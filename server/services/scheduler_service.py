import logging
import os
from apscheduler.schedulers.background import BackgroundScheduler  # type: ignore[import-not-found]

from services.email_service import send_newsletters
from services.news_service import fetch_and_store_news

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(timezone=os.getenv("SCHEDULER_TIMEZONE", "Asia/Kolkata"))
_scheduler_started = False


def run_news_generation_job():
    logger.info("Starting scheduled news generation job")
    result = fetch_and_store_news()
    logger.info("Finished scheduled news generation job: %s", result)
    return result


def run_newsletter_delivery_job():
    logger.info("Starting scheduled newsletter delivery job")
    result = send_newsletters()
    logger.info("Finished scheduled newsletter delivery job: %s", result)
    return result


def start_scheduler():
    global _scheduler_started

    scheduler_enabled = os.getenv("ENABLE_SCHEDULER", "true").lower() in {"1", "true", "yes", "on"}
    if not scheduler_enabled:
        logger.info("Scheduler is disabled")
        return scheduler

    is_primary = os.getenv("IS_PRIMARY_INSTANCE", "false").lower() == "true"

    if not is_primary:
        logger.info("Skipping scheduler (not primary instance)")
        return scheduler

    if _scheduler_started:
        return scheduler

    if not scheduler.running:
        scheduler.add_job(
            run_news_generation_job,
            trigger="cron",
            hour=8,
            minute=50,
            id="daily_news_generation_850am",
            replace_existing=True,
            max_instances=1,
            coalesce=True,
            misfire_grace_time=600,
        )

        scheduler.add_job(
            run_newsletter_delivery_job,
            trigger="cron",
            hour=9,
            minute=0,
            id="daily_newsletter_delivery_900am",
            replace_existing=True,
            max_instances=1,
            coalesce=True,
            misfire_grace_time=600,
        )

        scheduler.start()
        _scheduler_started = True
        logger.info("Scheduler started (PRIMARY INSTANCE) at %s", scheduler.timezone)

    return scheduler


def shutdown_scheduler():
    global _scheduler_started

    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Daily news scheduler stopped")

    _scheduler_started = False
