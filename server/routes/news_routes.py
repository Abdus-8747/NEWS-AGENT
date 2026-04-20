from datetime import date, datetime, timedelta

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func

from db.connection import SessionLocal
from db.models import Article

router = APIRouter(prefix="/api/v1/news", tags=["news"])


def _serialize_article(article: Article) -> dict:
    return {
        "id": article.id,
        "title": article.title,
        "description": article.description,
        "ai_summary": article.ai_summary,
        "url": article.url,
        "image_url": article.image_url,
        "author": article.author,
        "source": article.source,
        "published_at": article.published_at.isoformat() if article.published_at else None,
        "created_at": article.created_at.isoformat() if article.created_at else None,
    }


@router.get("/latest")
def get_todays_articles(limit: int = Query(default=100, ge=1, le=500)):
    today = datetime.utcnow().date()
    yesterday = date.today() - timedelta(days=1)
    #print(f"📅 Fetching articles for {today} with limit {limit}")
    db = SessionLocal()
    try:
        rows = (
            db.query(Article)
            .filter(func.date(Article.published_at) == today or func.date(Article.published_at) == yesterday)
            .order_by(Article.published_at.desc())
            .limit(limit)
            .all()
        )

        return {
            "date": str(today),
            "count": len(rows),
            "articles": [_serialize_article(row) for row in rows],
        }
    finally:
        db.close()

@router.get("/{article_id}")
def get_article_detail(article_id: int):
    db = SessionLocal()
    try:
        article = db.query(Article).filter(Article.id == article_id).first()
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")

        return {"article": _serialize_article(article)}
    finally:
        db.close()
