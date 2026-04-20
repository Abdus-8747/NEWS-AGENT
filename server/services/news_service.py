import requests
from datetime import datetime, timedelta
import os
import json
from dotenv import load_dotenv

from db.connection import SessionLocal
from db.models import Article
from sqlalchemy.dialects.postgresql import insert

load_dotenv()

API_KEY = os.getenv("NEWS_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL") or "llama-3.3-70b-versatile"


# 🚫 blacklist sources (noise)
BLOCKED_SOURCES = [
    "Slickdeals",
    "Yahoo Entertainment",
    "consent.yahoo.com"
]


def fetch_news():
    url = "https://newsapi.org/v2/everything"

    today = datetime.utcnow()
    yesterday = today - timedelta(days=1)

    params = {
        "q": "software development OR programming OR coding OR technology OR AI OR tech startups OR web development OR machine learning OR data science OR cybersecurity OR cloud computing OR blockchain OR programming languages OR software engineering",
        "from": yesterday.strftime("%Y-%m-%d"),
        "to": today.strftime("%Y-%m-%d"),
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": 50,
        "apiKey": API_KEY
    }

    res = requests.get(url, params=params)

    if res.status_code != 200:
        raise Exception(f"News API Error: {res.text}")

    return res.json().get("articles", [])

def print_news():
        db = SessionLocal()
        articles = db.query(Article).order_by(Article.published_at.desc()).limit(10).all()

        for art in articles:
            print(f"{art.title} ({art.description}) - {art.published_at}")
        return {art.description for art in articles}

def is_valid_article(article):
    title = article.get("title")
    url = article.get("url")
    source = article.get("source", {}).get("name")
    image_url = article.get("urlToImage")

    # ❌ basic validation
    if not title or not url:
        return False

    # ❌ skip blocked sources
    if source in BLOCKED_SOURCES:
        return False

    # ❌ skip consent / tracking links
    if "consent" in url:
        return False

    # ❌ skip useless titles
    if len(title) < 20:
        return False
    
    if not image_url:
        return False

    return True

def transform_articles(raw_articles):
    cleaned = []

    for article in raw_articles:
        if not is_valid_article(article):
            continue

        cleaned.append({
            "title": article.get("title"),
            "description": article.get("description"),
            "url": article.get("url"),
            "image_url": article.get("urlToImage"),
            "author": article.get("author") or "Unknown",
            "source": article.get("source", {}).get("name"),
            "published_at": article.get("publishedAt"),
        })

    return cleaned


def _build_groq_prompt(articles):
    compact_articles = []
    for article in articles:
        compact_articles.append({
            "title": article.get("title"),
            "description": article.get("description"),
            "url": article.get("url"),
            "source": article.get("source"),
            "author": article.get("author"),
            "published_at": article.get("published_at"),
        })

    instructions = {
        "task": "Select the most relevant technology/software articles for a developer-focused daily digest.",
        "selection_rules": [
            "Prefer practical software, AI engineering, cloud, security, data, and dev-tooling updates.",
            "Avoid generic business/news noise.",
            "Pick at most 10 items.",
            "Return only valid JSON matching the schema."
        ],
        "schema": {
            "selected_articles": [
                {
                    "url": "string",
                    "ai_summary": "string"
                }
            ]
        },
        "articles": compact_articles
    }

    return json.dumps(instructions, ensure_ascii=True)


def select_relevant_with_groq(cleaned_articles):
    if not cleaned_articles:
        return []

    if not GROQ_API_KEY:
        # Graceful fallback if Groq credentials are not configured.
        return cleaned_articles[:10]

    prompt = _build_groq_prompt(cleaned_articles[:30])
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": GROQ_MODEL,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": "You are a strict JSON API. Return only JSON without markdown.",
            },
            {"role": "user", "content": prompt},
        ],
    }

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=45,
    )
    if response.status_code != 200:
        raise Exception(f"Groq API Error: {response.text}")

    data = response.json()
    content = data["choices"][0]["message"]["content"]
    parsed = json.loads(content)
    selected_rows = parsed.get("selected_articles", [])

    selected_by_url = {}
    for row in selected_rows:
        url = row.get("url")
        if not url:
            continue
        selected_by_url[url] = {
            "ai_summary": row.get("ai_summary") or "",
        }

    final_selection = []
    for article in cleaned_articles:
        meta = selected_by_url.get(article.get("url"))
        if not meta:
            continue

        item = dict(article)
        item["ai_summary"] = meta["ai_summary"]
        final_selection.append(item)
        print(f"✅ Selected: {item['ai_summary'][:60]}... - {item['title']}")

    return final_selection

def save_articles(articles):
    if not articles:
        return 0

    db = SessionLocal()

    try:
        normalized_articles = []
        for article in articles:
            row = dict(article)
            row.setdefault("ai_summary", "")
            normalized_articles.append(row)

        stmt = insert(Article).values(normalized_articles)

        stmt = stmt.on_conflict_do_update(
            index_elements=["url"],
            set_={
                "title": stmt.excluded.title,
                "description": stmt.excluded.description,
                "ai_summary": stmt.excluded.ai_summary,
                "image_url": stmt.excluded.image_url,
                "author": stmt.excluded.author,
                "source": stmt.excluded.source,
                "published_at": stmt.excluded.published_at,
            },
        )

        result = db.execute(stmt)
        db.commit()

        return result.rowcount or 0

    except Exception as e:
        db.rollback()
        print("❌ DB Error:", e)
        return 0

    finally:
        db.close()

def fetch_and_store_news():
    raw = fetch_news()

    print(f"📰 Fetched: {len(raw)}")

    cleaned = transform_articles(raw)

    print(f"🧹 Cleaned: {len(cleaned)}")

    selected = select_relevant_with_groq(cleaned)

    print(f"🎯 Selected: {len(selected)}")

    inserted = save_articles(selected)

    return {
        "fetched": len(raw),
        "cleaned": len(cleaned),
        "selected": len(selected),
        "inserted": inserted,
    }