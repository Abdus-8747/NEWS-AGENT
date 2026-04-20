from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db.connection import SessionLocal
from db.models import User
from services.email_service import get_articles_for_user, send_welcome_email

router = APIRouter(prefix="/api/v1/users", tags=["users"])


class SubscribeRequest(BaseModel):
    email: str


@router.post("/subscribe")
def subscribe_user(payload: SubscribeRequest):
    email = payload.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user and user.is_active:
            raise HTTPException(
                status_code=409,
                detail="[SYS_ERR] This email is already initialized in our global stream."
            )
        
        created = False
        

        if not user:
            user = User(email=email, is_active=True)
            db.add(user)
            db.flush()
            created = True
            send_welcome_email(user.email)
        else:
            user.is_active = True
            send_welcome_email(user.email)

        db.commit()

        return {
            "message": "Subscription saved",
            "created": created,
            "user": {
                "id": user.id,
                "email": user.email,
                "is_active": user.is_active,
            }
        }
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@router.get("/{user_id}/newsletter")
def get_user_newsletter(user_id: int):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    finally:
        db.close()

    articles = get_articles_for_user(user_id)

    return {
        "user_id": user_id,
        "count": len(articles),
        "articles": [
            {
                "id": article.id,
                "title": article.title,
                "description": article.description,
                "ai_summary": article.ai_summary,
                "url": article.url,
                "image_url": article.image_url,
                "author": article.author,
                "source": article.source,
                "published_at": article.published_at.isoformat() if article.published_at else None,
            }
            for article in articles
        ],
    }

