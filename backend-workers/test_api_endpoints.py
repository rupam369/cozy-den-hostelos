import os
import sys
import asyncio
import logging
from httpx import AsyncClient, ASGITransport

_base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _base_dir)

from main import app
from test_workers import create_mock_resident_face_image

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("api_tests")

async def test_api_routes():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Test GET /
        res = await client.get("/")
        assert res.status_code == 200, f"Root returned {res.status_code}"
        data = res.json()
        assert data["status"] == "online"
        logger.info(f"✅ GET / -> {data['service']} (Status: {data['status']})")

        # 2. Test GET /health
        res = await client.get("/health")
        assert res.status_code == 200, f"Health returned {res.status_code}"
        h_data = res.json()
        logger.info(f"✅ GET /health -> Status: {h_data['status']}, Embedding Dim: {h_data['embedding_dimensions']}")

        # 3. Test GET /stats
        res = await client.get("/stats")
        assert res.status_code == 200, f"Stats returned {res.status_code}"
        s_data = res.json()
        logger.info(f"✅ GET /stats -> Complaints: {s_data['complaints']}, Vectors: {s_data['total_face_vectors']}")

        # 4. Test POST /chat
        res = await client.post("/chat", json={"message": "What time is dinner served?", "role": "Student"})
        assert res.status_code == 200, f"Chat returned {res.status_code}"
        c_data = res.json()
        assert "reply" in c_data and len(c_data["reply"]) > 10
        logger.info(f"✅ POST /chat -> Intent: {c_data.get('intent')}, Reply Preview: {c_data['reply'][:60]}...")

        # 5. Test POST /search-memory with file upload
        test_img = create_mock_resident_face_image()
        files = {"file": ("student_portrait.jpg", test_img, "image/jpeg")}
        data = {"consent": "true"}
        res = await client.post("/search-memory/upload", files=files, data=data)
        assert res.status_code == 200, f"Search memory returned {res.status_code}: {res.text}"
        m_data = res.json()
        logger.info(f"✅ POST /search-memory/upload -> Matches: {m_data.get('matches_found', 0)}, Status: {m_data.get('status')}")

        # 6. Test Privacy Consent Rejection (consent=false)
        files = {"file": ("student_portrait.jpg", test_img, "image/jpeg")}
        data = {"consent": "false"}
        res = await client.post("/search-memory/upload", files=files, data=data)
        assert res.status_code == 403, f"Expected 403 for consent=false, got {res.status_code}"
        logger.info(f"✅ POST /search-memory/upload (consent=false) -> Correctly returned 403 Forbidden: {res.json()['detail'][:65]}...")

        # 7. Test POST /trigger-escalation
        res = await client.post("/trigger-escalation", json={"hours_threshold": 48})
        assert res.status_code == 200, f"Escalation returned {res.status_code}"
        e_data = res.json()
        logger.info(f"✅ POST /trigger-escalation -> Status: {e_data.get('status')}, Overdue: {e_data.get('overdue_count')}")

    logger.info("\n🎉 ALL FASTAPI HTTP ENDPOINT TESTS PASSED COMPLETELY!")

if __name__ == "__main__":
    asyncio.run(test_api_routes())
