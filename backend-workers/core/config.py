import os
from typing import Optional

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseModel as BaseSettings
    except ImportError:
        class BaseSettings:
            pass

class Settings(BaseSettings):
    # Service Information
    SERVICE_NAME: str = "COZY DEN Backend AI Workers"
    SERVICE_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # Supabase Connection
    SUPABASE_URL: str = os.getenv(
        "SUPABASE_URL", 
        os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://lpektepedttwesoeacbx.supabase.co")
    )
    SUPABASE_SERVICE_KEY: Optional[str] = (
        os.getenv("SUPABASE_SERVICE_KEY") 
        or os.getenv("SUPABASE_ANON_KEY") 
        or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    )
    SUPABASE_ANON_KEY: Optional[str] = os.getenv(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        os.getenv("SUPABASE_ANON_KEY")
    )

    # OpenAI Integration
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # API Security & Authentication
    BACKEND_API_KEY: Optional[str] = os.getenv("BACKEND_API_KEY")  # If set, validates X-API-KEY header
    ENABLE_RATE_LIMIT: bool = os.getenv("ENABLE_RATE_LIMIT", "true").lower() == "true"
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))

    # DreamCast PicBot Parameters
    FACE_MATCH_THRESHOLD: float = float(os.getenv("FACE_MATCH_THRESHOLD", "0.72"))
    EMBEDDING_DIMENSION: int = 512
    STORAGE_MEMORIES_BUCKET: str = "hostel-memories"

    # Complaint Escalation Parameters
    ESCALATION_HOURS_THRESHOLD: int = int(os.getenv("ESCALATION_HOURS_THRESHOLD", "48"))
    ESCALATION_CHECK_INTERVAL_SECONDS: int = int(os.getenv("ESCALATION_CHECK_INTERVAL_SECONDS", "300"))
    DREAMCAST_POLL_INTERVAL_SECONDS: int = int(os.getenv("DREAMCAST_POLL_INTERVAL_SECONDS", "60"))

settings = Settings()
