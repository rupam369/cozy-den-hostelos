import logging
from typing import List, Dict, Any, Optional
from core.supabase_client import supabase_service
try:
    from .face_engine import face_engine
except ImportError:
    from face_engine import face_engine

logger = logging.getLogger("dreamcast_indexer")

class MemoryIndexer:
    """Processes newly uploaded hostel memory photos and generates pgvector face embeddings."""

    async def index_memory_by_record(self, memory: Dict[str, Any]) -> Dict[str, Any]:
        """Index a single hostel memory dictionary record."""
        memory_id = memory.get("id")
        image_url = memory.get("image_url")
        user_id = memory.get("uploaded_by")
        uploaded_by_name = memory.get("uploaded_by_name", "Resident")

        if not memory_id or not image_url:
            return {"status": "error", "message": "Missing memory_id or image_url", "memory_id": memory_id}

        logger.info(f"DreamCast PicBot: Processing memory {memory_id} from {image_url}")

        # 1. Download image securely
        image_bytes = await supabase_service.download_image_bytes(image_url)
        if not image_bytes:
            logger.warning(f"Could not retrieve image bytes for memory {memory_id}")
            return {"status": "error", "message": "Failed to download image", "memory_id": memory_id}

        # 2. Extract faces and embeddings
        detected_faces = face_engine.extract_faces_from_image(image_bytes)
        if not detected_faces:
            logger.info(f"No faces detected in memory {memory_id}")
            # Mark as processed with 1 baseline feature anchor so it won't repeatedly poll
            await supabase_service.update_memory_faces_count(memory_id, 1)
            return {"status": "processed", "faces_count": 0, "memory_id": memory_id}

        # 3. Store each face embedding in Supabase pgvector table
        saved_count = 0
        for i, face in enumerate(detected_faces):
            person_name = f"{uploaded_by_name} (Subject #{i+1})"
            res = await supabase_service.store_face_embedding(
                memory_id=memory_id,
                user_id=user_id,
                person_name=person_name,
                confidence=face["confidence"],
                bounding_box=face["bounding_box"],
                embedding_vector=face["embedding"]
            )
            if res:
                saved_count += 1

        # 4. Update hostel_memories table
        await supabase_service.update_memory_faces_count(memory_id, max(1, saved_count))

        logger.info(f"DreamCast PicBot: Successfully indexed {saved_count} face embeddings for memory {memory_id}")
        return {
            "status": "success",
            "memory_id": memory_id,
            "faces_detected": len(detected_faces),
            "embeddings_stored": saved_count
        }

    async def scan_and_index_unprocessed_memories(self, batch_size: int = 10) -> Dict[str, Any]:
        """Scans Supabase for memories with faces_detected_count = 0 and processes them."""
        unindexed = await supabase_service.get_unindexed_memories(limit=batch_size)
        if not unindexed:
            return {"status": "idle", "processed_count": 0}

        results = []
        for mem in unindexed:
            res = await self.index_memory_by_record(mem)
            results.append(res)

        return {
            "status": "completed",
            "batch_size": len(unindexed),
            "processed_count": len(results),
            "details": results
        }

memory_indexer = MemoryIndexer()
