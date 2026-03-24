import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine, Base
from app.models.portfolio import Portfolio
from app.routers import portfolio

def run_migrations():
    """Run SQLite-safe migrations for new columns"""
    with engine.connect() as conn:
        migrations = [
            "ALTER TABLE portfolios ADD COLUMN photo_url TEXT",
            "ALTER TABLE portfolios ADD COLUMN custom_colors TEXT",
            "ALTER TABLE portfolios ADD COLUMN section_order TEXT",
            "ALTER TABLE portfolios ADD COLUMN dark_mode INTEGER DEFAULT 0",
            "ALTER TABLE portfolios ADD COLUMN available_for_hire INTEGER DEFAULT 0",
            "ALTER TABLE portfolios ADD COLUMN slug TEXT UNIQUE",
            "ALTER TABLE portfolios ADD COLUMN view_count INTEGER DEFAULT 0",
            "ALTER TABLE portfolios ADD COLUMN user_id TEXT",
        ]
        for sql in migrations:
            try:
                conn.execute(text(sql))
                conn.commit()
            except Exception as e:
                # Column already exists or other constraint error - log it
                print(f"Migration note: {str(e)}")
                pass

# Run migrations
run_migrations()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Portfolio API")

# Get allowed origins from environment variable, default to localhost for development
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
allowed_origins = [origin.strip() for origin in allowed_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio.router, prefix="/api")

@app.get("/health")
async def health():
    return {"status": "ok"}
