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

# 🔍 multi-query expansion
QUERIES = [
    "technology",
    "AI",
    "machine learning",
    "web development",
    "software engineering",
    "tech startups"
]


# =========================
# 🔥 FETCH (multi-query)
# =========================

import time

def safe_fetch(url, params):
    try:
        res = requests.get(url, params=params, timeout=10)

        if res.status_code != 200:
            print(f"⚠️ Status {res.status_code}: {res.text[:80]}")
            return None

        if not res.text.strip():
            print("⚠️ Empty response")
            return None

        return res.json()

    except Exception as e:
        print(f"❌ Fetch error: {e}")
        return None

def fetch_news():
    url = "https://newsapi.org/v2/everything"

    today = datetime.utcnow()
    since = today - timedelta(days=2)

    all_articles = []
    seen_urls = set()

    for query in QUERIES:
        for page in range(1, 2):  # 🔥 start with 1 page (stable)
            print(f"🔍 Fetching: {query} | page {page}")

            params = {
                "q": query,
                "from": since.strftime("%Y-%m-%d"),
                "to": today.strftime("%Y-%m-%d"),
                "sortBy": "publishedAt",
                "language": "en",
                "pageSize": 25,
                "page": page,
                "apiKey": API_KEY
            }

            data = safe_fetch(url, params)

            if not data:
                continue

            articles = data.get("articles", [])

            if not articles:
                break

            for article in articles:
                article_url = article.get("url")

                if not article_url or article_url in seen_urls:
                    continue

                seen_urls.add(article_url)
                all_articles.append(article)

            time.sleep(1.2)

            # 🔥 stop early if enough data
            if len(all_articles) >= 100:
                print("🛑 Enough articles collected")
                print(f"📰 Total fetched: {len(all_articles)}")
                return all_articles

    print(f"📰 Total fetched: {len(all_articles)}")
    return all_articles


# =========================
# 🧹 CLEANING
# =========================
def is_valid_article(article):
    title = article.get("title")
    url = article.get("url")
    source = article.get("source", {}).get("name")
    image_url = article.get("urlToImage")

    if not title or not url:
        return False

    if source in BLOCKED_SOURCES:
        return False

    if "consent" in url:
        return False

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

    print(f"🧹 Cleaned: {len(cleaned)}")
    return cleaned


# =========================
# 🤖 GROQ PROMPT
# =========================
def _build_groq_prompt(articles):
    compact = []

    for a in articles:
        compact.append({
            "title": a.get("title"),
            "desc": (a.get("description") or "")[:120],
            "url": a.get("url"),
        })

    instructions = {
        "task": "Select only high-signal developer-relevant tech articles.",
        "rules": [
            "ONLY include software engineering, AI, dev tools, cloud, cybersecurity.",
            "REMOVE jobs, ads, and generic news.",
            "Prefer practical engineering insights.",
            "Max 15 articles."
        ],
        "schema": {
            "selected_articles": [
                {"url": "string", "ai_summary": "string"}
            ]
        },
        "articles": compact
    }

    return json.dumps(instructions)


# =========================
# 🧠 GROQ CALL
# =========================
def safe_json_parse(content):
    try:
        return json.loads(content)
    except Exception as e:
        print("⚠️ JSON parse error:", e)
        return {"selected_articles": []}


def select_relevant_with_groq(articles):
    if not articles:
        return []

    if not GROQ_API_KEY:
        return articles[:10]

    prompt = _build_groq_prompt(articles)

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROQ_MODEL,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": "Return ONLY JSON."},
            {"role": "user", "content": prompt},
        ],
    }

    res = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=45,
    )

    if res.status_code != 200:
        raise Exception(res.text)

    content = res.json()["choices"][0]["message"]["content"]
    parsed = safe_json_parse(content)

    selected_rows = parsed.get("selected_articles", [])

    selected_map = {
        row["url"]: row.get("ai_summary", "")
        for row in selected_rows if row.get("url")
    }

    final = []

    for article in articles:
        if article["url"] in selected_map:
            item = dict(article)
            item["ai_summary"] = selected_map[article["url"]]
            final.append(item)

    return final


# =========================
# 🔥 MULTI-STAGE LLM
# =========================
def chunk_articles(articles, size=12):
    for i in range(0, len(articles), size):
        yield articles[i:i + size]


def batch_select(articles):
    all_selected = []

    for batch in chunk_articles(articles, 12):
        try:
            result = select_relevant_with_groq(batch)
            all_selected.extend(result)
            time.sleep(6)  # Avoid busting TPM limits
        except Exception as e:
            error_str = str(e).lower()
            if "rate limit" in error_str or "429" in error_str:
                print("⏳ Rate Limit Hit during batch. Waiting 30s...")
                time.sleep(30)
            else:
                print("❌ Batch error:", e)

    print(f"📦 Batch selected: {len(all_selected)}")
    return all_selected


def final_select(articles):
    time.sleep(4)  # Padding to ensure we don't trip limits
    return select_relevant_with_groq(articles[:20])


def multi_stage_groq_selection(cleaned):
    if not cleaned:
        return []

    # Cap at 60 articles to prevent blowing through the 12,000 TPM Groq Free Tier Limit
    cleaned = cleaned[:60]

    batch = batch_select(cleaned)

    if not batch:
        return cleaned[:10]

    # dedup
    seen = set()
    unique = []

    for a in batch:
        if a["url"] not in seen:
            seen.add(a["url"])
            unique.append(a)

    print(f"🔁 Dedup: {len(unique)}")

    final = final_select(unique)

    print(f"🎯 Final: {len(final)}")
    return final


# =========================
# 💾 SAVE
# =========================
def save_articles(articles):
    if not articles:
        return 0

    db = SessionLocal()

    try:
        stmt = insert(Article).values(articles)

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


# =========================
# 🚀 MAIN PIPELINE
# =========================
def fetch_and_store_news():
    raw = fetch_news()

    cleaned = transform_articles(raw)

    selected = multi_stage_groq_selection(cleaned)

    inserted = save_articles(selected)

    return {
        "fetched": len(raw),
        "cleaned": len(cleaned),
        "selected": len(selected),
        "inserted": inserted,
    }