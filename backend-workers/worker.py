import os
import sys
import time
import signal
import asyncio
import logging

# Ensure local packages and subdirectories can be imported
_base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _base_dir)
sys.path.insert(0, os.path.join(_base_dir, "dreamcast-worker"))
sys.path.insert(0, os.path.join(_base_dir, "notification-worker"))
sys.path.insert(0, os.path.join(_base_dir, "ai-assistant"))

from core.config import settings
from core.supabase_client import supabase_service
from indexer import memory_indexer
from escalation_scheduler import escalation_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [RENDER-WORKER] [%(levelname)s]: %(message)s"
)
logger = logging.getLogger("cozy_background_worker")

class CozyDenBackgroundDaemon:
    def __init__(self):
        self.running = True
        self.iteration = 0

    def handle_shutdown(self, signum, frame):
        logger.info(f"Received termination signal ({signum}). Initiating graceful shutdown...")
        self.running = False

    async def run(self):
        logger.info("=" * 60)
        logger.info("COZY DEN HostelOS - Render Background AI Worker Daemon")
        logger.info(f"Supabase Connection: {'Configured' if supabase_service.is_configured() else 'Missing'}")
        logger.info(f"48-Hour Complaint Escalation SLA: {settings.ESCALATION_HOURS_THRESHOLD} hours")
        logger.info(f"DreamCast Poll Interval: {settings.DREAMCAST_POLL_INTERVAL_SECONDS}s")
        logger.info("=" * 60)

        # Register signal handlers
        signal.signal(signal.SIGINT, self.handle_shutdown)
        signal.signal(signal.SIGTERM, self.handle_shutdown)

        while self.running:
            self.iteration += 1
            try:
                # 1. DreamCast PicBot: Scan for new uploaded memory photos
                logger.info(f"[Cycle #{self.iteration}] Scanning for unindexed hostel memories...")
                mem_report = await memory_indexer.scan_and_index_unprocessed_memories(batch_size=10)
                if mem_report.get("processed_count", 0) > 0:
                    logger.info(f"DreamCast PicBot: Processed {mem_report['processed_count']} memory photo(s).")

                # 2. Complaint Escalation: Check unresolved complaints > 48 hours
                logger.info(f"[Cycle #{self.iteration}] Checking for unresolved complaints exceeding 48 hours...")
                esc_report = await escalation_scheduler.check_and_escalate_overdue_complaints()
                if esc_report.get("escalated_count", 0) > 0:
                    logger.warning(
                        f"🚨 COMPLAINT ESCALATION: Dispatched RED ALERTS for {esc_report['escalated_count']} overdue complaint(s)!"
                    )

            except Exception as e:
                logger.error(f"Unexpected error in background worker cycle: {e}")

            # Sleep between polling cycles
            for _ in range(settings.DREAMCAST_POLL_INTERVAL_SECONDS):
                if not self.running:
                    break
                await asyncio.sleep(1)

        logger.info("COZY DEN Background Daemon shut down cleanly.")

if __name__ == "__main__":
    daemon = CozyDenBackgroundDaemon()
    asyncio.run(daemon.run())
