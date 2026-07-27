# Neural Constellation

![Neural Constellation Demo](docs/demo.gif)

> GPU-accelerated 3D music visualization powered by real audio ML, NLP lyric analysis, and custom WebGL shaders.

[![Backend Tests](https://github.com/YOUR_USERNAME/neural-constellation/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/neural-constellation/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## What It Does

Upload any MP3. The backend runs a real ML audio analysis pipeline (Librosa) to extract beats, onsets, and energy curves. An NLP pipeline (SpaCy) scans lyrics for spatial and emotional themes and generates morph trigger timestamps. All of this is passed as GPU uniforms to a custom GLSL shader driving 50,000 particles at 60 FPS.

## Architecture

MP3 Upload → FastAPI → Librosa ML Pipeline → SpaCy NLP
↓
Redis (hot cache) + PostgreSQL (persistent)
↓
GPU Uniforms → GLSL Vertex Shader → 50k Particles

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React Three Fiber, Zustand |
| Rendering | Three.js, Custom GLSL Shaders, WebGL |
| Backend | Python, FastAPI, Uvicorn |
| ML / Audio | Librosa, NumPy |
| NLP | SpaCy (en_core_web_sm) |
| Database | PostgreSQL 18 |
| Cache | Redis (Memurai on Windows) |

## Features

- **50,000 GPU particles** rendered via custom GLSL ShaderMaterial with additive blending
- **Real ML beat detection** — Librosa beat tracking, onset detection, RMS energy curves
- **NLP → GPU morphing** — SpaCy detects lyric themes and triggers particle shape transitions
- **Dual-layer caching** — Redis hot cache + PostgreSQL persistence, instant repeat loads
- **Fluid dynamics** — Sine-based noise displacement in vertex shader for organic movement
- **Real-time controls** — Particle size, gravity, adjustable at runtime

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 18 running on port 5432
- Redis running on port 6379

### Option A — Local Services (Windows)
Install PostgreSQL and Memurai (Redis for Windows) as local services.

### Option B — Docker
```bash
docker-compose up -d
```

### Setup

**1. Clone**
```bash
git clone https://github.com/YOUR_USERNAME/neural-constellation.git
cd neural-constellation
```

**2. Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cp .env.example .env         # fill in your values
uvicorn main:app --reload --port 8000
```

**3. Frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000

## Environment Variables

### `backend/.env.example`

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/neural_constellation
REDIS_URL=redis://localhost:6379


### `frontend/.env.local.example`

NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

## Running Tests
```bash
cd backend
pytest -v
```

## Performance
- 50,000 particles sustained at 60 FPS on Intel integrated graphics
- Sub-15 second ML analysis for a 4-minute track
- Repeat loads served from Redis in <50ms

## License
MIT