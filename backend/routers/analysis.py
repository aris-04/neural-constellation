from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.audio_analysis import analyze_audio_file
from services.nlp_pipeline import analyze_lyrics
from services.cache import get_cached_analysis, save_analysis

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("/upload")
async def upload_and_analyze(
    file: UploadFile = File(...),
    track_id: str = Form(...),
    lyrics: str = Form(""),
):
    cached = await get_cached_analysis(track_id)
    if cached:
        return cached

    if not file.content_type or 'audio' not in file.content_type:
        raise HTTPException(status_code=400, detail="File must be an audio file")

    file_bytes = await file.read()

    audio = await analyze_audio_file(file_bytes, file.filename or "track.mp3")

    lines = []
    if lyrics.strip():
        raw_lines = [l.strip() for l in lyrics.strip().split('\n') if l.strip()]
        duration = audio.beats[-1] if audio.beats else 180.0
        step = duration / max(len(raw_lines), 1)
        lines = [
            {"words": line, "startTimeMs": int(i * step * 1000)}
            for i, line in enumerate(raw_lines)
        ]

    morph_triggers, lyric_lines = analyze_lyrics(lines)
    audio.morphTriggers = morph_triggers

    result = {
        "trackId": track_id,
        "analysis": audio.model_dump(),
        "lyrics": [l.model_dump() for l in lyric_lines],
    }

    await save_analysis(track_id, result)
    return result