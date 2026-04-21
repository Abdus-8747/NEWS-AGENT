import os
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.connection import engine
from db.models import Base
from sqlalchemy import text

from routes.news_routes import router as news_router
from routes.system_routes import router as system_router
from routes.user_routes import router as user_router
from routes.workflow_routes import router as workflow_router
from services.scheduler_service import scheduler, shutdown_scheduler, start_scheduler

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Tech News Agent API",
    version="1.0.0",
    description="API for ingesting, curating, and delivering personalized tech newsletters.",
)

frontend_origins = os.getenv("FRONTEND_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]
if not allowed_origins:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.on_event("startup")
def startup():
    try:
        logger.info("Starting scheduler")
        start_scheduler()
    except Exception as e:
        logger.error(f"Startup error: {e}")


@app.on_event("shutdown")
def shutdown():
    shutdown_scheduler()



@app.get("/")
def root():
    return {"message": "Tech News Agent API is running"}


@app.get("/health")
def health_check():
    db_ok = True
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        db_ok = False

    status = "ok" if db_ok else "degraded"

    return {
        "status": status,
        "database": "ok" if db_ok else "error",
        "scheduler_running": scheduler.running,
        "scheduler_timezone": str(scheduler.timezone),
        "scheduled_jobs": [job.id for job in scheduler.get_jobs()],
    }


app.include_router(workflow_router)
app.include_router(news_router)
app.include_router(user_router)
app.include_router(system_router)