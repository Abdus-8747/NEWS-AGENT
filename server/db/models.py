from sqlalchemy import Column, Integer, String, Boolean, Text, TIMESTAMP, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ARRAY  # Requires PostgreSQL
from datetime import datetime
from enum import Enum

class CategoryEnum(str, Enum):
    TECHNOLOGY = "technology"
    AI = "AI"
    MACHINE_LEARNING = "machine learning"
    WEB_DEVELOPMENT = "web development"
    SOFTWARE_ENGINEERING = "software engineering"
    TECH_STARTUPS = "tech startups"

Base = declarative_base()


# 👤 USERS
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    preferences = Column(ARRAY(String), default=list)  # User category preferences
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


# 📰 ARTICLES
class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    description = Column(Text)
    ai_summary = Column(Text)  # Added field
    category = Column(String)  # Categorized by AI
    url = Column(Text, unique=True)
    image_url = Column(Text)
    author = Column(Text)
    source = Column(String)
    published_at = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"))
    status = Column(String, default="sent")
    delivered_at = Column(TIMESTAMP, default=datetime.utcnow)