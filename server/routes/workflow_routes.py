from fastapi import APIRouter

from services.email_service import send_newsletters
from services.news_service import fetch_and_store_news

router = APIRouter(
    prefix="/api/v1/workflow",
    tags=["workflow"],
)


@router.post("/fetch-news")
def run_news_pipeline():
    result = fetch_and_store_news()
    return {
        "message": "News fetched, filtered, and stored",
        "result": result,
    }


@router.post("/send-newsletters")
def run_newsletters_only():
    result = send_newsletters()
    return {
        "message": "Category-based newsletters processed",
        "result": result,
    }


@router.post("/run-daily-workflow")
def run_daily_workflow_now():
    news_result = fetch_and_store_news()
    email_result = send_newsletters()
    return {
        "message": "Daily workflow executed (news at 8:55 logic + emails at 9:00 logic)",
        "news": news_result,
        "email": email_result,
    }
