from pydantic import BaseModel
from typing import List, Optional

class MorphTrigger(BaseModel):
    timestamp: float
    shape: str

class TurbulencePoint(BaseModel):
    timestamp: float
    intensity: float

class AudioAnalysis(BaseModel):
    tempo: float
    beats: List[float]
    onsets: List[float]
    morphTriggers: List[MorphTrigger]
    turbulenceMap: List[TurbulencePoint]

class LyricLine(BaseModel):
    startTime: float
    words: str

class AnalysisResponse(BaseModel):
    trackId: str
    analysis: AudioAnalysis
    lyrics: List[LyricLine]