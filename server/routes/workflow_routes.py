from fastapi import APIRouter, BackgroundTasks

from services.email_service import send_newsletters
from services.news_service import fetch_and_store_news

router = APIRouter(
    prefix="/api/v1/workflow",
    tags=["workflow"],
)


@router.post("/fetch-news")
def run_news_pipeline(background_tasks: BackgroundTasks):
    background_tasks.add_task(fetch_and_store_news)
    return {
        "message": "News fetch pipeline started in the background",
        "status": "processing"
    }


@router.post("/send-newsletters")
def run_newsletters_only(background_tasks: BackgroundTasks):
    background_tasks.add_task(send_newsletters)
    return {
        "message": "Newsletter delivery triggered in the background",
        "status": "processing"
    }


@router.post("/run-daily-workflow")
def run_daily_workflow_now(background_tasks: BackgroundTasks):
    def full_workflow():
        fetch_and_store_news()
        send_newsletters()

    background_tasks.add_task(full_workflow)
    return {
        "message": "Daily full workflow (fetch + email) triggered in the background",
        "status": "processing"
    }
