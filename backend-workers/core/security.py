import time
import logging
from typing import Optional, Dict
from fastapi import Request, HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPBearer, HTTPAuthorizationCredentials
from .config import settings

logger = logging.getLogger("cozy_security")

api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=False)
bearer_auth = HTTPBearer(auto_error=False)

# Simple in-memory sliding window rate limiter
class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.rpm = requests_per_minute
        self.window = 60.0
        self.history: Dict[str, list] = {}

    def is_allowed(self, client_ip: str) -> bool:
        if not settings.ENABLE_RATE_LIMIT:
            return True

        now = time.time()
        timestamps = self.history.get(client_ip, [])
        # Prune timestamps older than 60 seconds
        fresh = [t for t in timestamps if now - t < self.window]

        if len(fresh) >= self.rpm:
            self.history[client_ip] = fresh
            return False

        fresh.append(now)
        self.history[client_ip] = fresh
        return True

rate_limiter = RateLimiter(requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)

async def verify_rate_limit(request: Request):
    """Ensure client does not exceed request per minute limit."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    # Honor forwarded headers from Render reverse proxy
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()

    if not rate_limiter.is_allowed(client_ip):
        logger.warning(f"Rate limit exceeded for client IP: {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Maximum {settings.RATE_LIMIT_PER_MINUTE} requests per minute allowed."
        )

async def verify_api_key(
    key_from_header: Optional[str] = Security(api_key_header),
    bearer_token: Optional[HTTPAuthorizationCredentials] = Security(bearer_auth)
) -> bool:
    """Validate backend API key if configured."""
    expected_key = settings.BACKEND_API_KEY
    if not expected_key:
        # Development or open mode
        return True

    token = key_from_header or (bearer_token.credentials if bearer_token else None)
    if not token or token != expected_key:
        logger.warning("Unauthorized access attempt - invalid API key")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing X-API-KEY authentication credentials."
        )
    return True

def verify_biometric_consent(consent: bool):
    """Enforce strict resident biometric privacy consent."""
    if not consent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "User biometric consent required for facial recognition matching. "
                "Residents must opt-in to DreamCast PicBot facial indexing in accordance with hostel privacy policies."
            )
        )
