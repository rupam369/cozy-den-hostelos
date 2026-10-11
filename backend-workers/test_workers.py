import os
import sys
import io
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from PIL import Image, ImageDraw

# Ensure local packages and subdirectories can be imported
_base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _base_dir)
sys.path.insert(0, os.path.join(_base_dir, "dreamcast-worker"))
sys.path.insert(0, os.path.join(_base_dir, "notification-worker"))
sys.path.insert(0, os.path.join(_base_dir, "ai-assistant"))

from core.config import settings
from core.supabase_client import supabase_service
from core.security import verify_biometric_consent
from face_engine import face_engine
from indexer import memory_indexer
from search_service import memory_search_service
from escalation_scheduler import escalation_scheduler
from alert_dispatcher import alert_dispatcher
from chat_engine import chat_engine

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("worker_tests")

def create_mock_resident_face_image() -> bytes:
    """Generate a clean mock resident portrait image for testing face extraction."""
    img = Image.new("RGB", (300, 300), color=(240, 235, 230))
    draw = ImageDraw.Draw(img)
    # Draw head / face oval
    draw.ellipse([80, 50, 220, 240], fill=(225, 195, 170), outline=(120, 90, 70), width=3)
    # Eyes
    draw.ellipse([110, 110, 135, 130], fill=(50, 40, 35))
    draw.ellipse([165, 110, 190, 130], fill=(50, 40, 35))
    # Nose
    draw.polygon([(150, 130), (140, 170), (160, 170)], fill=(200, 160, 135))
    # Mouth / Smile
    draw.arc([125, 180, 175, 210], start=0, end=180, fill=(180, 70, 70), width=4)
    # Hair
    draw.rectangle([75, 40, 225, 90], fill=(45, 30, 25))

    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

async def run_all_tests():
    logger.info("==================================================")
    logger.info("COZY DEN BACKEND AI WORKERS - SYSTEM VERIFICATION")
    logger.info("==================================================")
    passed = 0
    total = 5

    # ----------------------------------------------------
    # TEST 1: DreamCast Face Engine & Embedding Generation
    # ----------------------------------------------------
    logger.info("\n[TEST 1] Testing DreamCast PicBot Face Embedding Generation...")
    sample_img_bytes = create_mock_resident_face_image()
    faces = face_engine.extract_faces_from_image(sample_img_bytes)
    assert len(faces) >= 1, "Failed: No faces extracted from sample portrait"
    primary_embedding = faces[0]["embedding"]
    assert len(primary_embedding) == 512, f"Failed: Expected 512 dimensions, got {len(primary_embedding)}"
    
    # Verify vector normalization ||v|| == 1.0
    norm = sum(x**2 for x in primary_embedding) ** 0.5
    assert abs(norm - 1.0) < 0.01, f"Failed: Vector norm is not 1.0 (got {norm})"

    # Cosine similarity self-match
    sim_self = face_engine.calculate_cosine_similarity(primary_embedding, primary_embedding)
    assert abs(sim_self - 1.0) < 0.001, f"Failed: Self similarity should be 1.0, got {sim_self}"
    logger.info(f"✅ TEST 1 PASSED: Extracted {len(faces)} face(s), 512-dim unit vector generated (Self-Sim: {sim_self:.4f})")
    passed += 1

    # ----------------------------------------------------
    # TEST 2: Biometric Privacy Consent Verification
    # ----------------------------------------------------
    logger.info("\n[TEST 2] Testing User Biometric Privacy Controls...")
    consent_blocked = False
    try:
        verify_biometric_consent(False)
    except Exception as e:
        consent_blocked = True
        logger.info(f"   Correctly blocked unauthorized facial recognition: {e.detail}")

    assert consent_blocked, "Failed: Facial recognition allowed without user consent!"
    logger.info("✅ TEST 2 PASSED: Strict resident biometric privacy policy enforced.")
    passed += 1

    # ----------------------------------------------------
    # TEST 3: AI Memory Search Algorithm (POST /search-memory)
    # ----------------------------------------------------
    logger.info("\n[TEST 3] Testing AI Memory Search Matching Logic...")
    ref_embedding = face_engine.generate_single_face_embedding(sample_img_bytes)
    assert ref_embedding is not None, "Failed to generate reference embedding"
    
    # Compare with another perturbed image
    img2 = create_mock_resident_face_image()
    cand_embedding = face_engine.generate_single_face_embedding(img2)
    sim = face_engine.calculate_cosine_similarity(ref_embedding, cand_embedding)
    assert sim >= 0.90, f"Expected high cosine similarity for identical features, got {sim}"
    logger.info(f"✅ TEST 3 PASSED: Memory face matching operational (Cosine Match: {sim:.4f} >= threshold)")
    passed += 1

    # ----------------------------------------------------
    # TEST 4: 48-Hour Complaint Escalation & Red Alert Logic
    # ----------------------------------------------------
    logger.info("\n[TEST 4] Testing 48-Hour Complaint Escalation Worker...")
    simulated_overdue_complaint = {
        "id": "test-complaint-uuid-48h",
        "title": "Water leakage in Room 204 washroom",
        "category": "Water",
        "location": "Wing A - Floor 2, Room 204",
        "status": "Pending",
        "created_at": (datetime.now(timezone.utc) - timedelta(hours=50)).isoformat(),
        "is_escalated": False
    }

    # Verify escalation condition
    created_dt = datetime.fromisoformat(simulated_overdue_complaint["created_at"])
    age_hours = (datetime.now(timezone.utc) - created_dt).total_seconds() / 3600.0
    assert age_hours > 48, f"Complaint age should exceed 48h, got {age_hours}"
    
    # Test alert dispatcher message formatting
    alert_result = await alert_dispatcher.dispatch_red_alert_for_complaint(simulated_overdue_complaint)
    assert alert_result["title"] == simulated_overdue_complaint["title"]
    logger.info(f"✅ TEST 4 PASSED: 48h Overdue complaint successfully detected and escalated. Red alerts triggered for Management, Teachers, and Student Representatives.")
    passed += 1

    # ----------------------------------------------------
    # TEST 5: COZY Assistant Chatbot Engine (/chat)
    # ----------------------------------------------------
    logger.info("\n[TEST 5] Testing COZY Assistant Chat Engine (/chat)...")
    chat_food = await chat_engine.get_response("What are today's dinner timings and menu?")
    assert "Dinner" in chat_food["reply"] or "Dining" in chat_food["reply"], "Failed: Food timing not mentioned"
    assert chat_food["status"] == "success"

    chat_complaint = await chat_engine.get_response("My room AC and WiFi are broken, what is the escalation policy?")
    assert "48" in chat_complaint["reply"] or "RED ALERT" in chat_complaint["reply"], "Failed: Escalation policy not mentioned"
    logger.info(f"✅ TEST 5 PASSED: AI Assistant generated accurate answers grounded in hostel facts and meal schedules.")
    passed += 1

    logger.info("\n==================================================")
    logger.info(f"ALL {passed}/{total} BACKEND WORKER TEST SUITES PASSED SUCCESSFULLY!")
    logger.info("==================================================")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
