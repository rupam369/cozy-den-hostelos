import logging
import httpx
from typing import Dict, Any, Optional
from core.config import settings
try:
    from .knowledge_base import hostel_kb
except ImportError:
    from knowledge_base import hostel_kb

logger = logging.getLogger("cozy_chat_engine")

class CozyChatEngine:
    """
    AI Assistant chatbot engine for COZY DEN residents and management.
    Provides guidance on hostel rules, complaints, food timings, and notices.
    """

    async def get_response(
        self,
        message: str,
        user_id: Optional[str] = None,
        role: Optional[str] = "Student"
    ) -> Dict[str, Any]:
        """Generate a contextual answer to resident questions."""
        cleaned_msg = message.strip()
        lower_msg = cleaned_msg.lower()

        # Retrieve live hostel context
        kb_data = await hostel_kb.get_live_context_summary()

        # If OpenAI API Key is provided, call OpenAI
        if settings.OPENAI_API_KEY:
            try:
                reply = await self._query_openai(cleaned_msg, kb_data, role)
                if reply:
                    return {
                        "reply": reply,
                        "source": "openai",
                        "model": settings.OPENAI_MODEL,
                        "status": "success"
                    }
            except Exception as e:
                logger.warning(f"OpenAI call failed, falling back to rule-based engine: {e}")

        # Intelligent Fallback & Rule-based semantic response
        return self._generate_rule_based_response(lower_msg, kb_data, role)

    async def _query_openai(
        self,
        user_query: str,
        kb: Dict[str, Any],
        role: Optional[str]
    ) -> Optional[str]:
        """Calls OpenAI Chat Completion endpoint with grounded system context."""
        meals_text = "\n".join(kb.get("meals", []))
        announcements_text = "\n".join(kb.get("announcements", []))
        static_info = kb.get("static", {})

        system_prompt = f"""You are the COZY DEN AI Assistant, an empathetic, helpful, and highly intelligent hostel concierge for COZY DEN Smart HostelOS.
Your resident's role is: {role or 'Student'}.

Ground your answers strictly in the following official hostel data:
=== MEAL TIMINGS & MENU ===
{meals_text}

=== RECENT ANNOUNCEMENTS ===
{announcements_text}

=== HOSTEL GUIDELINES & EMERGENCY CONTACTS ===
- Campus: {static_info.get('campus_location')}
- Main Gate Curfew: {static_info.get('curfew_and_hours', {}).get('main_gate_curfew')}
- Quiet Hours: {static_info.get('curfew_and_hours', {}).get('quiet_study_hours')}
- Emergency: Warden Dr. Anita Desai (+91 98765-43210), Ambulance: Ext 108
- Complaint SLA: Complaints are resolved within 24-48 hours. Any complaint open for > 48 hours is AUTOMATICALLY ESCALATED to a RED ALERT by the background worker, alerting head wardens and faculty advisors immediately.
- DreamCast PicBot: An AI vision feature that tags and indexes moments from the rooftop and hostel events.

Tone: Warm, futuristic, supportive, and precise. Use bullet points for schedules."""

        payload = {
            "model": settings.OPENAI_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            "temperature": 0.5,
            "max_tokens": 400
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json=payload
            )
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"].strip()
            logger.error(f"OpenAI error {resp.status_code}: {resp.text}")
            return None

    def _generate_rule_based_response(
        self,
        query: str,
        kb: Dict[str, Any],
        role: Optional[str]
    ) -> Dict[str, Any]:
        """Semantic knowledge retrieval for instant answers without external API dependency."""
        meals = kb.get("meals", [])
        announcements = kb.get("announcements", [])
        static_info = kb.get("static", {})

        # 1. Food / Meal / Mess queries
        if any(w in query for w in ["food", "meal", "breakfast", "lunch", "dinner", "tea", "menu", "mess", "eat"]):
            meals_formatted = "\n".join(meals)
            reply = (
                f"🍽️ **COZY DEN Dining Schedule & Daily Menu**:\n\n"
                f"{meals_formatted}\n\n"
                f"💡 *Tip: You can submit meal feedback and ratings under the Food section in your dashboard.*"
            )
            return {"reply": reply, "intent": "food_timings", "source": "cozy_rule_engine", "status": "success"}

        # 2. Complaint / Grievance queries
        if any(w in query for w in ["complaint", "issue", "water", "wifi", "light", "clean", "broken", "escalat", "report", "red alert"]):
            reply = (
                f"🛠️ **Hostel Complaint & Grievance Protocol**:\n\n"
                f"1. **Categories**: WiFi, Water, Electricity, Food, Cleaning, Security, Room Maintenance.\n"
                f"2. **Submission**: Log your issue through the 'Complaints' tab with optional anonymous reporting.\n"
                f"3. **Automatic 48-Hour Escalation Guarantee**: If an issue remains unresolved for 48 hours, our backend AI worker triggers an automatic **RED ALERT** sent directly to the Head Warden and Management team.\n\n"
                f"Emergency hotline: Ext 108 or Head Warden Dr. Anita Desai (+91 98765-43210)."
            )
            return {"reply": reply, "intent": "complaint_guidance", "source": "cozy_rule_engine", "status": "success"}

        # 3. Announcements / News / Events
        if any(w in query for w in ["announcement", "notice", "news", "event", "happening", "activity", "bbq", "jam"]):
            notices_formatted = "\n".join(announcements) if announcements else "No new urgent notices today."
            reply = (
                f"📢 **Current COZY DEN Announcements**:\n\n"
                f"{notices_formatted}\n\n"
                f"Check your dashboard for real-time push notifications!"
            )
            return {"reply": reply, "intent": "announcements", "source": "cozy_rule_engine", "status": "success"}

        # 4. Gate / Curfew / Timing / Gym
        if any(w in query for w in ["curfew", "gate", "time", "quiet", "gym", "terrace", "night", "entry"]):
            ch = static_info.get("curfew_and_hours", {})
            reply = (
                f"⏰ **Hostel Timings & Curfew Policy**:\n\n"
                f"- **Main Gate Curfew**: {ch.get('main_gate_curfew')} (Late passes must be pre-approved)\n"
                f"- **Quiet Study Hours**: {ch.get('quiet_study_hours')}\n"
                f"- **Fitness Center / Gym**: {ch.get('gymnasium')}\n"
                f"- **Sky Terrace Lounge**: {ch.get('sky_terrace_lounge')}"
            )
            return {"reply": reply, "intent": "hostel_timings", "source": "cozy_rule_engine", "status": "success"}

        # 5. DreamCast / PicBot / Photos
        if any(w in query for w in ["dreamcast", "picbot", "photo", "face", "memory", "picture", "album"]):
            reply = (
                f"📸 **DreamCast PicBot AI**:\n\n"
                f"DreamCast PicBot scans and indexes hostel moments from campus events. "
                f"You can search your memories using our AI facial search API (`/search-memory`) "
                f"with guaranteed biometric privacy and resident consent controls!"
            )
            return {"reply": reply, "intent": "dreamcast_info", "source": "cozy_rule_engine", "status": "success"}

        # General Default Greeting & Capabilities
        reply = (
            f"Hello! I am your **COZY Assistant** for COZY DEN HostelOS. 🌟\n\n"
            f"I can assist you with:\n"
            f"- 🍽️ **Meal Timings & Daily Menu** (Breakfast, Lunch, High Tea, Dinner)\n"
            f"- 🛠️ **Filing & Tracking Complaints** (Automatic 48-hour Red Alert escalation)\n"
            f"- 📢 **Hostel Announcements & Campus Notices**\n"
            f"- 📸 **DreamCast PicBot AI Memory Search**\n"
            f"- ⏰ **Curfew, Quiet Hours & Facility Guidelines**\n\n"
            f"How can I help you today?"
        )
        return {"reply": reply, "intent": "general_inquiry", "source": "cozy_rule_engine", "status": "success"}

chat_engine = CozyChatEngine()
