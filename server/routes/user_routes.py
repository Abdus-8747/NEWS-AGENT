from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db.connection import SessionLocal
from db.models import User
from services.email_service import get_articles_for_user, send_welcome_email

router = APIRouter(prefix="/api/v1/users", tags=["users"])


class SubscribeRequest(BaseModel):
    email: str
    preferences: List[str] = []


@router.post("/subscribe")
def subscribe_user(payload: SubscribeRequest):
    email = payload.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user and user.is_active:
            user.preferences = list(set(payload.preferences + ["AI", "technology"]))
            db.commit()
            return {
                "message": "Welcome back! Your preferences are updated.",
                "created": False,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "is_active": user.is_active,
                    "preferences": user.preferences,
                }
            }
        
        created = False
        
        if not user:
            user = User(email=email, is_active=True, preferences=list(set(payload.preferences + ["AI", "technology"])))
            db.add(user)
            db.flush()
            created = True
            send_welcome_email(user.email)
            message_text = "Subscribed successfully. Your daily tech news will arrive at 9:00 AM."
        else:
            user.is_active = True
            user.preferences = list(set(payload.preferences + ["AI", "technology"]))
            send_welcome_email(user.email)
            message_text = "Welcome back! We've reactivated your daily subscription."

        db.commit()

        return {
            "message": message_text,
            "created": created,
            "user": {
                "id": user.id,
                "email": user.email,
                "is_active": user.is_active,
                "preferences": user.preferences,
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
                "category": article.category,
                "url": article.url,
                "image_url": article.image_url,
                "author": article.author,
                "source": article.source,
                "published_at": article.published_at.isoformat() if article.published_at else None,
            }
            for article in articles
        ],
    }


class UnsubscribeRequest(BaseModel):
    email: str
    user_id: int = None

@router.post("/unsubscribe")
def unsubscribe_user(payload: UnsubscribeRequest):
    email = payload.email.strip().lower()
    user_id = payload.user_id
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Email not found in system")
            
        if user.id != user_id:
            raise HTTPException(status_code=403, detail="You are not authorized to unsubscribe this email.")
        user.is_active = False
        db.commit()
        return {"message": "You have been successfully unsubscribed."}
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
