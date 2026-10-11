import os
import sys
import base64
import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, Depends, File, UploadFile, Form, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure local packages and subdirectories can be imported
_base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _base_dir)
sys.path.insert(0, os.path.join(_base_dir, "dreamcast-worker"))
sys.path.insert(0, os.path.join(_base_dir, "notification-worker"))
sys.path.insert(0, os.path.join(_base_dir, "ai-assistant"))

from core.config import settings
from core.supabase_client import supabase_service
from core.security import verify_api_key, verify_rate_limit, verify_biometric_consent
from face_engine import face_engine
from indexer import memory_indexer
from search_service import memory_search_service
from escalation_scheduler import escalation_scheduler
from chat_engine import chat_engine
from knowledge_base import hostel_kb

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("cozy_den_api")

# Background scheduler state
background_worker_task = None
is_running = True

async def periodic_worker_loop():
    """Background task running alongside FastAPI to process memories and check escalations."""
    logger.info("Starting COZY DEN background scheduler inside FastAPI service...")
    escalation_counter = 0
    while is_running:
        try:
            # 1. Check for unindexed hostel memories every 60 seconds
            if supabase_service.is_configured():
                await memory_indexer.scan_and_index_unprocessed_memories(batch_size=5)

            # 2. Check for overdue complaints every 5 minutes (every 5 cycles)
            escalation_counter += 1
            if escalation_counter >= 5:
                escalation_counter = 0
                if supabase_service.is_configured():
                    await escalation_scheduler.check_and_escalate_overdue_complaints()

        except Exception as e:
            logger.error(f"Error in periodic worker loop: {e}")

        await asyncio.sleep(60)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Launch background worker loop
    global background_worker_task, is_running
    is_running = True
    background_worker_task = asyncio.create_task(periodic_worker_loop())
    logger.info(f"{settings.SERVICE_NAME} v{settings.SERVICE_VERSION} initialized successfully.")
    yield
    # Shutdown: Cancel background tasks
    is_running = False
    if background_worker_task:
        background_worker_task.cancel()
    logger.info("Background scheduler stopped.")

app = FastAPI(
    title="COZY DEN HostelOS - AI Background Services",
    description="Scalable Render Backend Workers for DreamCast PicBot, Complaint Automation & AI Assistant.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js Vercel frontend and mobile clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Vercel production and preview domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====================================================================
# Pydantic Schemas
# ====================================================================

class MemorySearchRequest(BaseModel):
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    user_id: Optional[str] = None
    consent: bool = Field(True, description="Explicit user biometric consent required for facial recognition")
    threshold: Optional[float] = Field(None, description="Cosine similarity threshold override (default 0.72)")
    limit: Optional[int] = Field(20, description="Maximum matching photos to return")

class IndexMemoryRequest(BaseModel):
    memory_id: Optional[str] = None
    scan_all: bool = False

class EscalationRequest(BaseModel):
    hours_threshold: Optional[int] = Field(48, description="Hours before an unresolved complaint is escalated")

class ChatRequest(BaseModel):
    message: str = Field(..., description="Message from the hostel resident or staff member")
    user_id: Optional[str] = None
    role: Optional[str] = Field("Student", description="Role: Student, Teacher, Management Member")

# ====================================================================
# 1. System Health & Stats Endpoints
# ====================================================================

@app.get("/")
async def root():
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
        "status": "online",
        "database_connected": supabase_service.is_configured(),
        "environment": settings.ENVIRONMENT,
        "endpoints": {
            "search_memory": "/search-memory (POST)",
            "index_memory": "/index-memory (POST)",
            "trigger_escalation": "/trigger-escalation (POST)",
            "chat": "/chat (POST)",
            "health": "/health (GET)",
            "stats": "/stats (GET)"
        }
    }

@app.get("/health")
async def health_check():
    supabase_ok = supabase_service.is_configured()
    return {
        "status": "healthy" if supabase_ok else "degraded",
        "supabase_connection": "connected" if supabase_ok else "missing_credentials",
        "openai_configured": bool(settings.OPENAI_API_KEY),
        "embedding_dimensions": settings.EMBEDDING_DIMENSION,
        "escalation_sla_hours": settings.ESCALATION_HOURS_THRESHOLD,
        "rate_limiting_enabled": settings.ENABLE_RATE_LIMIT
    }

@app.get("/stats", dependencies=[Depends(verify_rate_limit)])
async def get_system_stats():
    complaints = await supabase_service.get_complaint_counts()
    embeddings = await supabase_service.get_all_indexed_face_embeddings()
    meals = await supabase_service.get_meals()
    return {
        "complaints": complaints,
        "total_face_vectors": len(embeddings),
        "scheduled_meals": len(meals),
        "status": "active"
    }

# ====================================================================
# 2. SERVICE 2: AI Memory Search API (/search-memory)
# ====================================================================

@app.post(
    "/search-memory",
    dependencies=[Depends(verify_rate_limit), Depends(verify_api_key)],
    summary="Search hostel memories by student reference photo"
)
async def search_memory_json(request: MemorySearchRequest):
    """
    Search hostel photos using student reference image URL or base64.
    Enforces user biometric consent and computes cosine similarity with pgvector embeddings.
    """
    verify_biometric_consent(request.consent)

    image_bytes = None
    if request.image_base64:
        try:
            # Strip data URI prefix if present
            raw_b64 = request.image_base64.split(",")[-1]
            image_bytes = base64.b64decode(raw_b64)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 image data: {str(e)}")
    elif request.image_url:
        image_bytes = await supabase_service.download_image_bytes(request.image_url)
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Failed to download reference image from provided image_url.")
    else:
        raise HTTPException(
            status_code=400, 
            detail="Must provide either image_url, image_base64, or use /search-memory/upload with file."
        )

    results = await memory_search_service.search_memories_by_face(
        image_bytes=image_bytes,
        user_id=request.user_id,
        consent=request.consent,
        threshold=request.threshold,
        limit=request.limit or 20
    )
    return results

@app.post(
    "/search-memory/upload",
    dependencies=[Depends(verify_rate_limit), Depends(verify_api_key)],
    summary="Search hostel memories via direct image file upload"
)
async def search_memory_file_upload(
    file: UploadFile = File(...),
    consent: bool = Form(True),
    user_id: Optional[str] = Form(None),
    threshold: Optional[float] = Form(None),
    limit: Optional[int] = Form(20)
):
    """Multipart file upload endpoint for AI Memory Search."""
    verify_biometric_consent(consent)

    image_bytes = await file.read()
    if not image_bytes or len(image_bytes) < 100:
        raise HTTPException(status_code=400, detail="Uploaded file is empty or corrupted.")

    results = await memory_search_service.search_memories_by_face(
        image_bytes=image_bytes,
        user_id=user_id,
        consent=consent,
        threshold=threshold,
        limit=limit or 20
    )
    return results

# ====================================================================
# 3. SERVICE 1: DreamCast PicBot Indexer (/index-memory)
# ====================================================================

@app.post(
    "/index-memory",
    dependencies=[Depends(verify_rate_limit), Depends(verify_api_key)],
    summary="Trigger DreamCast PicBot face embedding extraction for a memory"
)
async def index_memory(request: IndexMemoryRequest):
    """
    Downloads memory photo securely, extracts facial landmarks and 512-dim vectors,
    and stores them in Supabase face_embeddings table.
    """
    if request.memory_id:
        # Index specific memory
        memories = await supabase_service.get_unindexed_memories(limit=50)
        target = next((m for m in memories if m.get("id") == request.memory_id), None)
        if not target:
            # Query directly if already indexed or specific
            target = {"id": request.memory_id, "image_url": request.memory_id}
        result = await memory_indexer.index_memory_by_record(target)
        return result
    else:
        # Scan batch of unindexed memories
        result = await memory_indexer.scan_and_index_unprocessed_memories(batch_size=10)
        return result

# ====================================================================
# 4. SERVICE 3: Complaint Escalation Worker (/trigger-escalation)
# ====================================================================

@app.post(
    "/trigger-escalation",
    dependencies=[Depends(verify_rate_limit), Depends(verify_api_key)],
    summary="Run 48-hour complaint escalation scanner and generate RED ALERTS"
)
async def trigger_escalation(request: EscalationRequest = EscalationRequest()):
    """
    Scans for unresolved complaints older than 48 hours.
    Dispatches RED ALERT notifications to Management, Teachers, and Student Representatives.
    """
    report = await escalation_scheduler.check_and_escalate_overdue_complaints(
        hours_threshold=request.hours_threshold or 48
    )
    return report

# ====================================================================
# 5. SERVICE 4: COZY Assistant Chatbot Backend (/chat)
# ====================================================================

@app.post(
    "/chat",
    dependencies=[Depends(verify_rate_limit)],
    summary="COZY Assistant chatbot for resident guidance"
)
async def chat_with_assistant(request: ChatRequest):
    """
    AI Assistant chatbot answering resident questions on meal timings, complaints,
    announcements, curfew, and hostel rules.
    """
    response = await chat_engine.get_response(
        message=request.message,
        user_id=request.user_id,
        role=request.role
    )
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=False)
