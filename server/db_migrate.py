from db.connection import engine
from sqlalchemy import text

with engine.begin() as conn:
    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences VARCHAR[] DEFAULT '{}';"))
    conn.execute(text("ALTER TABLE articles ADD COLUMN IF NOT EXISTS category VARCHAR(255);"))
    
print("Migration successful: Added required columns to database.")
