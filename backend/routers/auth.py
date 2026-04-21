import os
import httpx
from urllib.parse import urlencode
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from jose import jwt
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
import models, schemas

router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
SECRET_KEY = os.getenv("SECRET_KEY", "changeme_in_production")
ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 7


def _make_jwt(user: models.User) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
        "exp": datetime.now(timezone.utc) + timedelta(days=TOKEN_EXPIRE_DAYS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.get("/google")
def google_login():
    params = urlencode({
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": f"{BACKEND_URL}/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": f"{BACKEND_URL}/auth/google/callback",
            },
        )
        if token_resp.status_code != 200:
            return RedirectResponse(f"{FRONTEND_URL}/login?error=oauth_failed")

        access_token = token_resp.json().get("access_token")

        userinfo_resp = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        userinfo = userinfo_resp.json()

    user = db.query(models.User).filter(models.User.google_id == userinfo["id"]).first()
    if user:
        user.name = userinfo.get("name")
        user.picture = userinfo.get("picture")
        db.commit()
        db.refresh(user)
    else:
        user = models.User(
            google_id=userinfo["id"],
            email=userinfo["email"],
            name=userinfo.get("name"),
            picture=userinfo.get("picture"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = _make_jwt(user)
    return RedirectResponse(f"{FRONTEND_URL}/auth/callback?token={token}")


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == int(current_user["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
