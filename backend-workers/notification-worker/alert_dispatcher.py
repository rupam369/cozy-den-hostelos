import logging
from typing import Dict, Any, List
from core.supabase_client import supabase_service

logger = logging.getLogger("cozy_alert_dispatcher")

class AlertDispatcher:
    """Dispatches high-priority RED ALERT notifications to hostel stakeholders."""

    TARGET_ROLES = [
        "Management Member",
        "Teacher",
        "Student"  # Targets student floor representatives
    ]

    async def dispatch_red_alert_for_complaint(self, complaint: Dict[str, Any]) -> Dict[str, Any]:
        """
        Dispatches RED ALERT notification across Management, Teachers, and Student Representatives.
        Marks the complaint as is_escalated=true and priority=Critical.
        """
        complaint_id = complaint.get("id")
        title = complaint.get("title", "Hostel Grievance")
        location = complaint.get("location", "Hostel Premises")
        category = complaint.get("category", "General")

        logger.warning(
            f"🚨 ESCALATING COMPLAINT {complaint_id} ({category}) Overdue > 48 Hours: '{title}' at {location}"
        )

        sent_notifications = []
        for role in self.TARGET_ROLES:
            alert = await supabase_service.create_escalation_alert(
                complaint=complaint,
                target_role=role
            )
            if alert:
                sent_notifications.append({"role": role, "id": alert.get("id")})

        # Mark complaint as escalated in Supabase
        escalated_ok = await supabase_service.escalate_complaint(complaint_id)

        return {
            "complaint_id": complaint_id,
            "title": title,
            "escalated_in_db": escalated_ok,
            "notifications_dispatched": len(sent_notifications),
            "target_roles": [n["role"] for n in sent_notifications]
        }

alert_dispatcher = AlertDispatcher()
