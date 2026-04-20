from fastapi import APIRouter
from sqlalchemy import text

from db.connection import engine
from services.scheduler_service import scheduler, start_scheduler

router = APIRouter(prefix="/api/v1/system", tags=["system"])


@router.get("/wake")
def wake_server():
    db_ok = True
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        db_ok = False

    start_scheduler()

    return {
        "status": "awake",
        "database": "ok" if db_ok else "error",
        "scheduler_running": scheduler.running,
        "scheduled_jobs": [job.id for job in scheduler.get_jobs()],
    }
