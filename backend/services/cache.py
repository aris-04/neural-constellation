import redis.asyncio as aioredis
import asyncpg
import json
import os
from typing import Optional

_redis: Optional[aioredis.Redis] = None
_pg: Optional[asyncpg.Pool] = None

async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = await aioredis.from_url(
            os.getenv("REDIS_URL", "redis://localhost:6379")
        )
    return _redis

async def get_pg() -> asyncpg.Pool:
    global _pg
    if _pg is None:
        _pg = await asyncpg.create_pool(
            os.getenv(
                "DATABASE_URL",
                "postgresql://postgres:postgres@localhost:5432/neural_constellation"
            ),
            min_size=2,
            max_size=10,
        )
        await _pg.execute("""
            CREATE TABLE IF NOT EXISTS song_analysis (
                track_id TEXT PRIMARY KEY,
                data JSONB NOT NULL,
                created_at TIMESTAMPTZ DEFAULT now()
            )
        """)
    return _pg

async def get_cached_analysis(track_id: str) -> Optional[dict]:
    try:
        r = await get_redis()
        cached = await r.get(f"analysis:{track_id}")
        if cached:
            return json.loads(cached)
        pg = await get_pg()
        row = await pg.fetchrow(
            "SELECT data FROM song_analysis WHERE track_id=$1",
            track_id
        )
        if row:
            data = json.loads(row["data"]) if isinstance(row["data"], str) else dict(row["data"])
            await r.setex(f"analysis:{track_id}", 3600, json.dumps(data))
            return data
        return None
    except Exception as e:
        print(f"Cache read error: {e}")
        return None

async def save_analysis(track_id: str, data: dict) -> None:
    try:
        r = await get_redis()
        pg = await get_pg()
        serialized = json.dumps(data)
        await r.setex(f"analysis:{track_id}", 3600, serialized)
        await pg.execute(
            """
            INSERT INTO song_analysis(track_id, data)
            VALUES($1, $2::jsonb)
            ON CONFLICT(track_id) DO UPDATE SET data=$2::jsonb
            """,
            track_id,
            serialized,
        )
    except Exception as e:
        print(f"Cache write error: {e}")