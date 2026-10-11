import logging
from typing import List, Dict, Any, Optional
from core.config import settings
from core.supabase_client import supabase_service
from core.security import verify_biometric_consent
try:
    from .face_engine import face_engine
except ImportError:
    from face_engine import face_engine

logger = logging.getLogger("dreamcast_search_service")

class MemorySearchService:
    """Matches student reference photos against the hostel memory vector index."""

    async def search_memories_by_face(
        self,
        image_bytes: bytes,
        user_id: Optional[str] = None,
        consent: bool = True,
        threshold: Optional[float] = None,
        limit: int = 20
    ) -> Dict[str, Any]:
        """
        AI Memory Search:
        1. Verifies resident biometric consent.
        2. Generates 512-dim embedding from student reference photo.
        3. Compares with all memory embeddings in Supabase via cosine vector similarity.
        4. Returns matching hostel photos, events, dates, and locations.
        """
        # 1. Enforce privacy controls & resident consent
        verify_biometric_consent(consent)

        match_threshold = threshold if threshold is not None else settings.FACE_MATCH_THRESHOLD

        # 2. Extract reference face embedding
        ref_embedding = face_engine.generate_single_face_embedding(image_bytes)
        if not ref_embedding:
            return {
                "status": "error",
                "message": "Could not detect a clear face in reference image. Please provide a clear front-facing portrait or selfie.",
                "matches": []
            }

        # 3. Fetch indexed embeddings from Supabase
        indexed_records = await supabase_service.get_all_indexed_face_embeddings()
        if not indexed_records:
            return {
                "status": "success",
                "message": "No indexed hostel memories found in the database yet.",
                "total_memories_searched": 0,
                "matches": []
            }

        # 4. Compare embeddings using cosine similarity
        matches_by_memory: Dict[str, Dict[str, Any]] = {}

        for rec in indexed_records:
            stored_vector = rec.get("embedding_vector")
            if not stored_vector or len(stored_vector) != len(ref_embedding):
                continue

            similarity = face_engine.calculate_cosine_similarity(ref_embedding, stored_vector)
            if similarity >= match_threshold:
                memory_info = rec.get("hostel_memories") or {}
                memory_id = rec.get("memory_id") or memory_info.get("id")

                if not memory_id:
                    continue

                # If this memory is already matched, keep the highest similarity face
                if memory_id in matches_by_memory:
                    if similarity > matches_by_memory[memory_id]["similarity"]:
                        matches_by_memory[memory_id]["similarity"] = round(similarity, 4)
                else:
                    matches_by_memory[memory_id] = {
                        "memory_id": memory_id,
                        "photo_url": memory_info.get("image_url", ""),
                        "event": memory_info.get("event_name") or memory_info.get("event") or "Hostel Memory",
                        "date": memory_info.get("date") or "2026",
                        "location": memory_info.get("location") or "COZY DEN",
                        "description": memory_info.get("description") or "",
                        "category": memory_info.get("category") or "Hostel Life",
                        "similarity": round(similarity, 4),
                        "confidence_rating": "High Match" if similarity > 0.85 else "Probable Match"
                    }

        # 5. Sort matches by similarity descending and limit
        sorted_matches = sorted(
            matches_by_memory.values(),
            key=lambda x: x["similarity"],
            reverse=True
        )[:limit]

        return {
            "status": "success",
            "matches_found": len(sorted_matches),
            "total_vectors_compared": len(indexed_records),
            "threshold_applied": match_threshold,
            "matches": sorted_matches
        }

memory_search_service = MemorySearchService()
