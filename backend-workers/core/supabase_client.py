import os
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
import httpx
from .config import settings

logger = logging.getLogger("cozy_supabase")

class SupabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL.rstrip("/")
        self.key = settings.SUPABASE_SERVICE_KEY or settings.SUPABASE_ANON_KEY or ""
        self.rest_url = f"{self.url}/rest/v1"
        self.storage_url = f"{self.url}/storage/v1"
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

    def is_configured(self) -> bool:
        return bool(self.url and self.key)

    async def get_unindexed_memories(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Fetch memories that have not yet undergone face embedding extraction."""
        if not self.is_configured():
            return []
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                # Query memories with faces_detected_count = 0
                resp = await client.get(
                    f"{self.rest_url}/hostel_memories",
                    params={
                        "select": "id,uploaded_by,uploaded_by_name,image_url,event_name,description,location,date,faces_detected_count,created_at",
                        "faces_detected_count": "eq.0",
                        "order": "created_at.desc",
                        "limit": str(limit)
                    },
                    headers=self.headers
                )
                if resp.status_code == 200:
                    return resp.json()
                logger.warning(f"Failed to fetch unindexed memories: {resp.status_code} - {resp.text}")
                return []
        except Exception as e:
            logger.error(f"Error fetching unindexed memories: {e}")
            return []

    async def download_image_bytes(self, image_url_or_path: str) -> Optional[bytes]:
        """Download image from Supabase Storage or external URL."""
        try:
            # If it's a full URL
            if image_url_or_path.startswith("http://") or image_url_or_path.startswith("https://"):
                async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                    resp = await client.get(image_url_or_path)
                    if resp.status_code == 200:
                        return resp.content
                    logger.warning(f"Direct download returned status {resp.status_code} for {image_url_or_path}")

            # If it's a storage path inside hostel-memories bucket
            clean_path = image_url_or_path.lstrip("/")
            storage_get_url = f"{self.storage_url}/object/public/{settings.STORAGE_MEMORIES_BUCKET}/{clean_path}"
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                resp = await client.get(storage_get_url, headers=self.headers)
                if resp.status_code == 200:
                    return resp.content

            # Authenticated storage object download fallback
            auth_storage_url = f"{self.storage_url}/object/authenticated/{settings.STORAGE_MEMORIES_BUCKET}/{clean_path}"
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                resp = await client.get(auth_storage_url, headers=self.headers)
                if resp.status_code == 200:
                    return resp.content

            logger.error(f"Could not retrieve image bytes from: {image_url_or_path}")
            return None
        except Exception as e:
            logger.error(f"Exception downloading image {image_url_or_path}: {e}")
            return None

    async def store_face_embedding(
        self,
        memory_id: str,
        user_id: Optional[str],
        person_name: str,
        confidence: float,
        bounding_box: Dict[str, float],
        embedding_vector: List[float]
    ) -> Optional[Dict[str, Any]]:
        """Insert a face embedding record into face_embeddings table."""
        if not self.is_configured():
            return None
        try:
            payload = {
                "memory_id": memory_id,
                "user_id": user_id,
                "person_name": person_name,
                "confidence": round(confidence, 3),
                "bounding_box": bounding_box,
                "embedding_vector": embedding_vector,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    f"{self.rest_url}/face_embeddings",
                    json=payload,
                    headers=self.headers
                )
                if resp.status_code in (200, 201):
                    res = resp.json()
                    return res[0] if isinstance(res, list) and res else res
                logger.error(f"Error storing face embedding: {resp.status_code} - {resp.text}")
                return None
        except Exception as e:
            logger.error(f"Exception storing face embedding: {e}")
            return None

    async def update_memory_faces_count(self, memory_id: str, count: int) -> bool:
        """Update faces_detected_count in hostel_memories table."""
        if not self.is_configured():
            return False
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.patch(
                    f"{self.rest_url}/hostel_memories",
                    params={"id": f"eq.{memory_id}"},
                    json={"faces_detected_count": max(1, count)},
                    headers=self.headers
                )
                return resp.status_code in (200, 204)
        except Exception as e:
            logger.error(f"Exception updating memory faces count: {e}")
            return False

    async def get_all_indexed_face_embeddings(self) -> List[Dict[str, Any]]:
        """Retrieve all indexed face embeddings joined with memory details for vector search."""
        if not self.is_configured():
            return []
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                # Query face_embeddings and join hostel_memories
                resp = await client.get(
                    f"{self.rest_url}/face_embeddings",
                    params={
                        "select": "id,memory_id,user_id,person_name,confidence,bounding_box,embedding_vector,hostel_memories(id,image_url,event_name,description,date,location,category)",
                        "order": "created_at.desc",
                        "limit": "2000"
                    },
                    headers=self.headers
                )
                if resp.status_code == 200:
                    return resp.json()
                logger.warning(f"Failed to fetch embeddings: {resp.status_code} - {resp.text}")
                return []
        except Exception as e:
            logger.error(f"Exception getting indexed embeddings: {e}")
            return []

    async def get_overdue_complaints(self, hours_threshold: int = 48) -> List[Dict[str, Any]]:
        """Retrieve unresolved complaints older than threshold hours that haven't been escalated."""
        if not self.is_configured():
            return []
        try:
            cutoff = datetime.now(timezone.utc) - timedelta(hours=hours_threshold)
            cutoff_iso = cutoff.isoformat()
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(
                    f"{self.rest_url}/complaints",
                    params={
                        "select": "id,title,description,category,location,priority,status,created_by,user_id,user_name,created_at,is_escalated",
                        "status": "neq.Resolved",
                        "is_escalated": "eq.false",
                        "created_at": f"lte.{cutoff_iso}",
                        "order": "created_at.asc"
                    },
                    headers=self.headers
                )
                if resp.status_code == 200:
                    return resp.json()
                logger.warning(f"Failed to query overdue complaints: {resp.status_code} - {resp.text}")
                return []
        except Exception as e:
            logger.error(f"Exception querying overdue complaints: {e}")
            return []

    async def escalate_complaint(self, complaint_id: str) -> bool:
        """Mark complaint as escalated with critical priority."""
        if not self.is_configured():
            return False
        try:
            now_iso = datetime.now(timezone.utc).isoformat()
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.patch(
                    f"{self.rest_url}/complaints",
                    params={"id": f"eq.{complaint_id}"},
                    json={
                        "is_escalated": True,
                        "escalated_at": now_iso,
                        "priority": "Critical"
                    },
                    headers=self.headers
                )
                return resp.status_code in (200, 204)
        except Exception as e:
            logger.error(f"Exception escalating complaint {complaint_id}: {e}")
            return False

    async def create_escalation_alert(
        self,
        complaint: Dict[str, Any],
        target_role: str = "Management Member"
    ) -> Optional[Dict[str, Any]]:
        """Create a RED ALERT notification for hostel management and staff."""
        if not self.is_configured():
            return None
        try:
            complaint_id = complaint.get("id")
            title = complaint.get("title", "Hostel Issue")
            location = complaint.get("location", "Hostel Area")
            category = complaint.get("category", "Maintenance")
            user_name = complaint.get("user_name") or "Resident"

            message = (
                f"Students are facing this issue: [{category.upper()}] '{title}' at {location}. "
                f"Management attention required immediately. Overdue > 48 hours without resolution."
            )

            payload = {
                "title": f"🚨 RED ALERT: Unresolved Complaint Escalated ({category})",
                "message": message,
                "type": "red",
                "priority": "Critical",
                "category": category,
                "complaint_id": complaint_id,
                "target_role": target_role,
                "is_read": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    f"{self.rest_url}/notifications",
                    json=payload,
                    headers=self.headers
                )
                if resp.status_code in (200, 201):
                    res = resp.json()
                    return res[0] if isinstance(res, list) and res else res
                logger.error(f"Error creating escalation notification: {resp.status_code} - {resp.text}")
                return None
        except Exception as e:
            logger.error(f"Exception creating escalation notification: {e}")
            return None

    async def get_meals(self) -> List[Dict[str, Any]]:
        """Get live meal schedule from Supabase."""
        if not self.is_configured():
            return []
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{self.rest_url}/meals",
                    params={"select": "*", "order": "start_time.asc"},
                    headers=self.headers
                )
                if resp.status_code == 200:
                    return resp.json()
                return []
        except Exception as e:
            logger.error(f"Exception getting meals: {e}")
            return []

    async def get_announcements(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Get active hostel announcements."""
        if not self.is_configured():
            return []
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{self.rest_url}/announcements",
                    params={
                        "select": "*",
                        "order": "created_at.desc",
                        "limit": str(limit)
                    },
                    headers=self.headers
                )
                if resp.status_code == 200:
                    return resp.json()
                return []
        except Exception as e:
            logger.error(f"Exception getting announcements: {e}")
            return []

    async def get_complaint_counts(self) -> Dict[str, int]:
        """Get summary stats of complaints."""
        if not self.is_configured():
            return {"total": 0, "pending": 0, "escalated": 0, "resolved": 0}
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{self.rest_url}/complaints",
                    params={"select": "status,is_escalated"},
                    headers=self.headers
                )
                if resp.status_code == 200:
                    data = resp.json()
                    total = len(data)
                    pending = sum(1 for c in data if c.get("status") != "Resolved")
                    resolved = sum(1 for c in data if c.get("status") == "Resolved")
                    escalated = sum(1 for c in data if c.get("is_escalated") is True)
                    return {
                        "total": total,
                        "pending": pending,
                        "escalated": escalated,
                        "resolved": resolved
                    }
                return {"total": 0, "pending": 0, "escalated": 0, "resolved": 0}
        except Exception as e:
            logger.error(f"Exception getting complaint counts: {e}")
            return {"total": 0, "pending": 0, "escalated": 0, "resolved": 0}

supabase_service = SupabaseService()
