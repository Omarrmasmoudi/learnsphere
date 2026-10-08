"""Sentiment analysis service for LearnSphere course feedback.

Ported from the FlexMeet desktop demo: Whisper transcribes spoken feedback and a multilingual
BERT model scores the text from 1 to 5 stars. The Next.js app calls this over HTTP; it is not
meant to be exposed to browsers directly.
"""

import io
import os
import re
import wave
from contextlib import asynccontextmanager

import numpy as np
import torch
from fastapi import FastAPI, HTTPException, Query, Request
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool
from transformers import pipeline

ASR_MODEL = os.getenv("ASR_MODEL", "openai/whisper-small")
SENTIMENT_MODEL = os.getenv("SENTIMENT_MODEL", "nlptown/bert-base-multilingual-uncased-sentiment")

SAMPLE_RATE = 16000  # what Whisper expects
MAX_AUDIO_SECONDS = 120
MAX_AUDIO_BYTES = 5 * 1024 * 1024
MIN_TEXT_LENGTH = 3

models = {}


@asynccontextmanager
async def lifespan(_app: FastAPI):
    device = 0 if torch.cuda.is_available() else -1
    models["asr"] = pipeline("automatic-speech-recognition", model=ASR_MODEL, device=device)
    # top_k=None returns the probability of every star rating, not just the best one
    models["sentiment"] = pipeline("sentiment-analysis", model=SENTIMENT_MODEL, device=device, top_k=None)
    yield
    models.clear()


app = FastAPI(title="LearnSphere sentiment service", lifespan=lifespan)


class TextRequest(BaseModel):
    text: str = Field(max_length=5000)


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    return re.sub(r"\s+", " ", text).strip()


def score_text(text: str) -> dict:
    cleaned = clean_text(text)
    if len(cleaned) < MIN_TEXT_LENGTH:
        raise HTTPException(status_code=422, detail="Feedback is too short to analyze.")

    results = models["sentiment"](cleaned, truncation=True)
    # Depending on the transformers version a single input comes back wrapped in a list
    if results and isinstance(results[0], list):
        results = results[0]

    scores = [0.0] * 5
    for result in results:
        stars = int(result["label"].split()[0])  # labels look like "4 stars"
        scores[stars - 1] = float(result["score"])

    best = int(np.argmax(scores))
    return {"text": text.strip(), "stars": best + 1, "confidence": scores[best], "scores": scores}


def read_wav(data: bytes) -> np.ndarray:
    """Decodes 16-bit PCM WAV into mono float32 samples at SAMPLE_RATE."""
    try:
        with wave.open(io.BytesIO(data)) as wav:
            channels = wav.getnchannels()
            sample_width = wav.getsampwidth()
            rate = wav.getframerate()
            frames = wav.readframes(wav.getnframes())
    except (wave.Error, EOFError) as error:
        raise HTTPException(status_code=400, detail="Audio must be a WAV file.") from error

    if sample_width != 2:
        raise HTTPException(status_code=400, detail="Audio must be 16-bit PCM.")

    audio = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
    if channels > 1:
        audio = audio.reshape(-1, channels).mean(axis=1)
    if rate != SAMPLE_RATE and len(audio) > 0:
        duration = len(audio) / rate
        target = np.linspace(0, duration, int(duration * SAMPLE_RATE), endpoint=False)
        audio = np.interp(target, np.arange(len(audio)) / rate, audio).astype(np.float32)

    if len(audio) / SAMPLE_RATE > MAX_AUDIO_SECONDS:
        raise HTTPException(status_code=413, detail=f"Recordings are limited to {MAX_AUDIO_SECONDS} seconds.")
    return audio


def transcribe(audio: np.ndarray, language: str | None) -> str:
    generate_kwargs = {"task": "transcribe"}
    if language:
        generate_kwargs["language"] = language  # otherwise Whisper detects it
    # Past Whisper's 30s window, timestamps switch it to sequential long-form transcription
    long_form = len(audio) > 30 * SAMPLE_RATE
    result = models["asr"](
        {"raw": audio, "sampling_rate": SAMPLE_RATE},
        generate_kwargs=generate_kwargs,
        return_timestamps=long_form,
    )
    return result["text"].strip()


@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": len(models) == 2}


@app.post("/analyze/text")
def analyze_text(body: TextRequest):
    return score_text(body.text)


@app.post("/analyze/audio")
async def analyze_audio(
    request: Request,
    language: str | None = Query(default=None, max_length=10, description="Whisper language code, e.g. 'fr'"),
):
    data = await request.body()
    if len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="Recording is too large.")

    audio = read_wav(data)
    transcript = await run_in_threadpool(transcribe, audio, language)
    if len(clean_text(transcript)) < MIN_TEXT_LENGTH:
        raise HTTPException(status_code=422, detail="Couldn't make out enough speech to analyze. Try again a bit closer to the mic.")
    return await run_in_threadpool(score_text, transcript)
