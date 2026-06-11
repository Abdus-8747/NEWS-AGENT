# 🤖 Tech News Agent

An automated, intelligent, and personalized technology news aggregator and newsletter delivery platform. The **Tech News Agent** fetches the latest articles daily from various sources, leverages Large Language Models (LLMs) via Groq to filter, categorize, and summarize the most relevant news, and delivers custom-tailored daily email newsletters to subscribers based on their specific interest categories.

---

## 🏗️ Architecture Overview

The project is split into a modern decoupled client-server architecture:

```
                              ┌──────────────────┐
                              │   React Client   │
                              │ (Vite, Tailwind) │
                              └────────┬─────────┘
                                       │ HTTPS REST
                                       ▼
                              ┌──────────────────┐
                              │  FastAPI Server  │
                              └─┬──────┬───────┬─┘
                                │      │       │
             1. Fetch News      │      │       │ 3. Select & Summarize
      ┌─────────────────────────┘      │       └────────────────────────┐
      ▼                                ▼ 2. Read/Write                  ▼
┌───────────┐                  ┌──────────────┐                   ┌───────────┐
│  NewsAPI  │                  │  PostgreSQL  │                   │   Groq    │
└───────────┘                  └──────────────┘                   │ (Llama 3) │
                                       │                          └───────────┘
                                       │ 4. Send Newsletters
                                       ▼
                               ┌──────────────┐
                               │  SMTP Email  │
                               └──────────────┘
```

*   **Frontend (`/client`)**: A sleek React 19 single-page application built on Vite, styled with Tailwind CSS v4, and featuring rich animations with Framer Motion.
*   **Backend (`/server`)**: A robust FastAPI service handling scheduled tasks (with APScheduler), database ORM (SQLAlchemy), LLM agent workflows, and email newsletter delivery via SMTP.

---

## ✨ Features

- **Automated Ingestion & Filtering**: Cron jobs trigger daily fetches of tech news from NewsAPI.
- **LLM News Curator**: A Groq-powered AI pipeline filters out noise, classifies articles into specific technical domains, and writes concise bullet-point summaries.
- **Personalized Newsletters**: Users subscribe and choose which tech categories they care about (e.g., AI, Development, Security).
- **Interactive UI**: A dashboard to read today's curated news, manage email subscription preferences, and view personalized feeds.
- **Robust Background Jobs**: Handled natively in the FastAPI lifecycle with built-in fault tolerance.

---

## 📁 Repository Layout

```
News_Agent/
├── client/                 # Frontend React application
│   ├── src/                # Component files and pages
│   ├── package.json        # Frontend configuration and packages
│   └── vite.config.js      # Vite configuration
└── server/                 # Backend FastAPI application
    ├── main.py             # App entrypoint & scheduler startup
    ├── db/                 # Database schema and models
    ├── routes/             # API routing endpoints
    ├── services/           # Ingestion, summarization, scheduling & email tasks
    ├── utils/              # Helper utilities
    └── requirements.txt    # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL Database** (e.g., Neon Postgres, local Postgres, or Docker)

---

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows PowerShell
   .\.venv\Scripts\Activate.ps1
   # macOS/Linux
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables (see [Environment Variables](#environment-variables) below).
5. Run database migrations/initial setup:
   ```bash
   python db_migrate.py
   ```
6. Run the local development server:
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

---

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install the node modules:
   ```bash
   npm install
   ```
3. Configure frontend environment variables.
4. Run the local development server:
   ```bash
   npm run dev
   ```

---

## ⚙️ Environment Variables

### Backend Configuration (`server/.env`)

Create a `.env` file in the `server/` directory and configure the following variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/dbname` |
| `NEWS_API_KEY` | Developer API key from [NewsAPI](https://newsapi.org/) | `abc123xyz...` |
| `GROQ_API_KEY` | Developer API key from [Groq Console](https://console.groq.com/) | `gsk_xyz...` |
| `EMAIL_USER` | Sender SMTP email address for sending newsletters | `noreply@domain.com` |
| `EMAIL_PASS` | Password or App Password for the sender SMTP account | `xxxx xxxx xxxx xxxx` |
| `GROQ_MODEL` | *(Optional)* Model to use for summarization and curation | `llama-3.3-70b-versatile` |
| `FRONTEND_ORIGINS` | *(Optional)* Allowed CORS origins (comma-separated) | `http://localhost:5173` |
| `ENABLE_SCHEDULER` | *(Optional)* Toggle background automated news pipeline | `true` |
| `SCHEDULER_TIMEZONE` | *(Optional)* Timezone context for daily runs | `Asia/Kolkata` |

### Frontend Configuration (`client/.env`)

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:8000
```

---

## 🗓️ Automation & Workflow

The automated news cycle runs daily using cron schedules:

1. **08:55 AM**: Fetches incoming articles from NewsAPI, processes them through Llama 3 via Groq for filtering and summary generation, and updates the database (`daily_news_generation_855am`).
2. **09:00 AM**: Matches curated articles against active user subscriptions and preferences, formats HTML newsletters, and dispatches them via SMTP (`daily_newsletter_delivery_900am`).

You can manually trigger these pipelines at any time by calling the administrative workflow endpoints:
- `POST /api/v1/workflow/fetch-news`
- `POST /api/v1/workflow/send-newsletters`
- `POST /api/v1/workflow/run-daily-workflow`

---

## 🔗 Key API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Verifies server status, database connection, and scheduler status. |
| `/api/v1/users/subscribe` | `POST` | Subscribes/updates preferences for a specific email address. |
| `/api/v1/users/{user_id}/preferences` | `GET`/`PUT` | Fetches or updates category preferences for a subscriber. |
| `/api/v1/news/today` | `GET` | Returns today's curated technology news. |
| `/api/v1/news/{article_id}` | `GET` | Fetches details and summaries for a specific article. |
