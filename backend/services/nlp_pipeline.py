import spacy
from typing import List
from models.schemas import MorphTrigger, LyricLine

nlp = spacy.load("en_core_web_sm")

SPATIAL_WORDS = {"time", "clock", "spin", "spiral", "circle", "wheel", "turn", "orbit", "ring", "cycle"}
HEART_WORDS = {"love", "heart", "feel", "soul", "beat", "pulse", "warm"}

def analyze_lyrics(lines: List[dict]) -> tuple[List[MorphTrigger], List[LyricLine]]:
    morph_triggers: List[MorphTrigger] = []
    lyric_lines: List[LyricLine] = []

    for line in lines:
        words = line.get("words", "")
        start = line.get("startTimeMs", 0) / 1000.0
        lyric_lines.append(LyricLine(startTime=start, words=words))

        doc = nlp(words.lower())
        tokens = {t.lemma_ for t in doc}

        if tokens & SPATIAL_WORDS:
            morph_triggers.append(MorphTrigger(timestamp=start, shape="clock"))
        elif tokens & HEART_WORDS:
            morph_triggers.append(MorphTrigger(timestamp=start, shape="spiral"))

    return morph_triggers, lyric_lines