# Tech News Agent - Server

Backend API for fetching technology news, selecting relevant articles with Groq, storing them in PostgreSQL, and delivering user-specific newsletters by email.

## Features

- FastAPI-based REST API
- News ingestion from NewsAPI
- LLM-based relevance selection and summaries via Groq
- PostgreSQL persistence (SQLAlchemy)
- User subscription and category preferences
- Daily automated jobs (8:55 AM and 9:00 AM)
- Render-friendly wake endpoint

## Project Structure

- `main.py` - FastAPI app entrypoint, startup/shutdown hooks
- `routes/` - API routers
- `services/` - business logic (news, email, scheduler)
- `db/` - database engine and models
- `requirements.txt` - Python dependencies

## Requirements

- Python 3.11+ (project currently uses 3.13)
- PostgreSQL database (Neon or any Postgres-compatible DB)

## Installation

```bash
cd server
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in `server/`.

Required:

- `DATABASE_URL` - PostgreSQL connection URL
- `NEWS_API_KEY` - NewsAPI key
- `GROQ_API_KEY` - Groq API key
- `EMAIL_USER` - sender email (SMTP)
- `EMAIL_PASS` - sender email password/app password

Optional:

- `GROQ_MODEL` - default: `llama-3.3-70b-versatile`
- `FRONTEND_ORIGINS` - comma-separated CORS origins, default `*`
- `LOG_LEVEL` - default `INFO`
- `ENABLE_SCHEDULER` - `true`/`false`, default `true`
- `SCHEDULER_TIMEZONE` - default `Asia/Kolkata`

## Run Locally

```bash
cd server
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Scheduler (Automation)

Configured in `services/scheduler_service.py`:

- `08:55` - generate and store news (`daily_news_generation_855am`)
- `09:00` - send user newsletters (`daily_newsletter_delivery_900am`)

Both jobs use cron triggers in `SCHEDULER_TIMEZONE`.

## API Endpoints

Base URL example: `http://localhost:8000`

### Public Endpoints

- `GET /` - service info
- `GET /health` - service, database, and scheduler status
- `GET /api/v1/system/wake` - wake/readiness endpoint (useful for Render ping)
- `POST /api/v1/users/subscribe` - create/activate subscription and optional categories
- `GET /api/v1/users/{user_id}/preferences`
- `PUT /api/v1/users/{user_id}/preferences`
- `GET /api/v1/users/{user_id}/newsletter`
- `GET /api/v1/news/today`
- `GET /api/v1/news/latest`
- `GET /api/v1/news/{article_id}`

### Workflow Endpoints

- `POST /api/v1/workflow/fetch-news`
- `POST /api/v1/workflow/send-newsletters`
- `POST /api/v1/workflow/run-daily-workflow`

Example:

```bash
curl -X POST http://localhost:8000/api/v1/workflow/run-daily-workflow
```

## Render Deployment Notes

- Deploy this server as a Web Service.
- Set all required environment variables in Render dashboard.
- Keep service warm by pinging:
  - `GET /api/v1/system/wake`
- If running multiple instances, enable scheduler in only one instance:
  - `ENABLE_SCHEDULER=true` on one instance
  - `ENABLE_SCHEDULER=false` on others

## Security Notes

- Keep `.env` out of version control.
- Use app passwords for SMTP providers (e.g., Gmail App Password).
- Restrict `FRONTEND_ORIGINS` to your actual frontend domains in production.

## Troubleshooting

- Email failures:
  - Verify `EMAIL_USER` and `EMAIL_PASS`.
- Scheduler not running:
  - Check `ENABLE_SCHEDULER` and `/health` response.
- No articles inserted:
  - Verify `NEWS_API_KEY`, `GROQ_API_KEY`, and database connectivity.
