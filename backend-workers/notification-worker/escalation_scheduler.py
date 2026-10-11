import logging
from typing import Dict, Any, List
from core.config import settings
from core.supabase_client import supabase_service
try:
    from .alert_dispatcher import alert_dispatcher
except ImportError:
    from alert_dispatcher import alert_dispatcher

logger = logging.getLogger("cozy_escalation_scheduler")

class ComplaintEscalationScheduler:
    """Automated scheduled scanner for unresolved hostel complaints older than 48 hours."""

    async def check_and_escalate_overdue_complaints(
        self,
        hours_threshold: int = None
    ) -> Dict[str, Any]:
        """
        Scans Supabase complaints table for:
        - status != 'Resolved'
        - created_at <= (now - 48 hours)
        - is_escalated = false
        For each match, dispatches RED ALERT notification and marks as escalated.
        """
        hours = hours_threshold if hours_threshold is not None else settings.ESCALATION_HOURS_THRESHOLD
        logger.info(f"Scanning for unresolved complaints older than {hours} hours...")

        overdue_complaints = await supabase_service.get_overdue_complaints(hours_threshold=hours)
        if not overdue_complaints:
            logger.info("No overdue complaints requiring escalation at this time.")
            return {
                "status": "clean",
                "hours_threshold": hours,
                "overdue_count": 0,
                "escalated_count": 0,
                "results": []
            }

        logger.warning(f"Found {len(overdue_complaints)} unresolved complaint(s) exceeding {hours} hours!")

        results = []
        for complaint in overdue_complaints:
            res = await alert_dispatcher.dispatch_red_alert_for_complaint(complaint)
            results.append(res)

        return {
            "status": "escalations_triggered",
            "hours_threshold": hours,
            "overdue_count": len(overdue_complaints),
            "escalated_count": len(results),
            "results": results
        }

escalation_scheduler = ComplaintEscalationScheduler()
