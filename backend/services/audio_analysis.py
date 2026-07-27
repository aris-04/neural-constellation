import librosa
import numpy as np
from models.schemas import AudioAnalysis, TurbulencePoint
from typing import List
import io
import wave
import struct

async def analyze_audio_file(file_bytes: bytes, filename: str) -> AudioAnalysis:
    y, sr = None, None
    audio_io = io.BytesIO(file_bytes)

    try:
        from pydub import AudioSegment
        audio_seg = AudioSegment.from_file(io.BytesIO(file_bytes), format='mp3')
        audio_seg = audio_seg.set_frame_rate(22050).set_channels(1)
        wav_io = io.BytesIO()
        audio_seg.export(wav_io, format='wav')
        wav_io.seek(0)
        y, sr = librosa.load(wav_io, sr=22050, mono=True)
    except Exception as e1:
        print(f'pydub failed: {e1}, trying direct librosa...')
        try:
            audio_io.seek(0)
            y, sr = librosa.load(audio_io, sr=22050, mono=True)
        except Exception as e2:
            print(f'direct librosa failed: {e2}, trying audioread...')
            try:
                import audioread
                audio_io.seek(0)
                with audioread.audio_open(audio_io) as f:
                    sr = f.samplerate
                    channels = f.channels
                    raw = b''.join(f)
                arr = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
                arr /= 32768.0
                if channels > 1:
                    arr = arr.reshape(-1, channels).mean(axis=1)
                y = librosa.resample(arr, orig_sr=sr, target_sr=22050)
                sr = 22050
            except Exception as e3:
                print(f'all decoders failed: {e3}')
                y = np.zeros(22050 * 30, dtype=np.float32)
                sr = 22050

    tempo_arr, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    tempo = float(tempo_arr) if np.isscalar(tempo_arr) else float(tempo_arr[0])
    beat_times = librosa.frames_to_time(beat_frames, sr=sr).tolist()

    onset_frames = librosa.onset.onset_detect(y=y, sr=sr, units='frames')
    onset_times = librosa.frames_to_time(onset_frames, sr=sr).tolist()

    hop_length = 512
    rms = librosa.feature.rms(y=y, hop_length=hop_length)[0]
    rms_times = librosa.frames_to_time(
        np.arange(len(rms)), sr=sr, hop_length=hop_length
    )

    turb_map: List[TurbulencePoint] = []
    step = max(1, len(rms) // 100)
    for i in range(0, len(rms), step):
        intensity = float(np.clip(rms[i] * 10, 0.0, 1.0))
        turb_map.append(TurbulencePoint(
            timestamp=float(rms_times[i]),
            intensity=intensity,
        ))

    return AudioAnalysis(
        tempo=tempo,
        beats=beat_times[:500],
        onsets=onset_times[:500],
        morphTriggers=[],
        turbulenceMap=turb_map,
    )