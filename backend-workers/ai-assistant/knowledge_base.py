import logging
from typing import Dict, Any, List
from core.supabase_client import supabase_service

logger = logging.getLogger("cozy_assistant_kb")

class CozyHostelKnowledgeBase:
    """Live knowledge retriever combining static hostel guidelines with dynamic Supabase facts."""

    STATIC_HOSTEL_FACTS = {
        "hostel_name": "COZY DEN HostelOS",
        "campus_location": "Smart Tech Enclave, Sector 4",
        "emergency_contacts": {
            "head_warden": "Dr. Anita Desai (+91 98765-43210)",
            "faculty_advisor": "Prof. K. Sen (+91 98765-43211)",
            "mess_manager": "Rohan Mehra (+91 98765-43212)",
            "medical_emergency": "Hostel Health Pod / Ambulance: Ext. 108"
        },
        "curfew_and_hours": {
            "main_gate_curfew": "10:00 PM",
            "quiet_study_hours": "10:00 PM to 6:00 AM",
            "gymnasium": "6:00 AM to 10:00 PM",
            "sky_terrace_lounge": "6:00 AM to 11:00 PM"
        },
        "wifi_details": {
            "ssid": "COZY_DEN_MEMBER_5G",
            "speed": "1 Gbps Optical Fiber Mesh",
            "support": "WiFi complaints are prioritized with 4-hour SLA."
        },
        "complaint_sla": {
            "resolution_target": "24 to 48 hours",
            "escalation_policy": (
                "Any complaint unresolved after 48 hours is automatically escalated "
                "by our background AI worker, dispatching an immediate RED ALERT to "
                "the Head Warden, Faculty Advisors, and Student Representatives."
            ),
            "categories": [
                "WiFi", "Water", "Electricity", "Food", "Cleaning", "Security", "Room Maintenance"
            ]
        }
    }

    async def get_live_context_summary(self) -> Dict[str, Any]:
        """Fetch live meals and announcements to ground the AI assistant in real-time truth."""
        meals = await supabase_service.get_meals()
        announcements = await supabase_service.get_announcements(limit=3)
        complaint_stats = await supabase_service.get_complaint_counts()

        # Format meal schedule
        meal_summary = []
        for m in meals:
            m_type = m.get("meal_type")
            start = m.get("start_time")
            end = m.get("end_time")
            menu = m.get("menu")
            special = m.get("chef_special")
            line = f"- {m_type} ({start} - {end}): {menu}"
            if special:
                line += f" [Special: {special}]"
            meal_summary.append(line)

        # Fallback default schedule if DB is empty
        if not meal_summary:
            meal_summary = [
                "- Breakfast (9:00 AM - 9:30 AM): Masala Dosa with Sambar, Fluffy Idli, Boiled Eggs, Seasonal Fruits, Filter Coffee & Masala Chai",
                "- Lunch (1:00 PM - 2:00 PM): Paneer Butter Masala, Dal Makhani, Jeera Rice, Butter Naan, Fresh Cucumber Raita, Gulab Jamun",
                "- High Tea (6:00 PM - 6:30 PM): Crispy Vegetable Pakoras, Hot Samosa with Mint Chutney, Marie Biscuits, Ginger Cardamom Chai",
                "- Dinner (8:00 PM - 9:00 PM): Smoky Kadai Veg, Tadka Yellow Dal, Phulka Rotis, Steamed Basmati Rice, Moong Dal Halwa"
            ]

        # Format notices
        notice_summary = []
        for a in announcements:
            title = a.get("title")
            desc = a.get("description") or a.get("content", "")
            notice_summary.append(f"- {title}: {desc}")

        return {
            "static": self.STATIC_HOSTEL_FACTS,
            "meals": meal_summary,
            "announcements": notice_summary,
            "complaint_stats": complaint_stats
        }

hostel_kb = CozyHostelKnowledgeBase()
