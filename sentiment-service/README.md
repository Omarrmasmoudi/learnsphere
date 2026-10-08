# Sentiment service

FastAPI service behind LearnSphere's course feedback. It transcribes voice notes with
[Whisper small](https://huggingface.co/openai/whisper-small) and scores text from 1 to 5 stars with
[nlptown/bert-base-multilingual-uncased-sentiment](https://huggingface.co/nlptown/bert-base-multilingual-uncased-sentiment)
(English, Dutch, German, French, Spanish, Italian). It was ported from the FlexMeet Tkinter demo.

## Run it

```bash
cd sentiment-service
python -m venv .venv
.venv/Scripts/activate        # Windows; use `source .venv/bin/activate` elsewhere
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

The first start downloads both models (~1.5 GB) into the Hugging Face cache. Startup takes a while
because the models load before the server accepts requests. The Next.js app finds the service through
`SENTIMENT_SERVICE_URL` (default `http://127.0.0.1:8000`).

It has no authentication: bind it to localhost or a private network, never to the public internet.

## API

| Method | Path | Body | Notes |
| --- | --- | --- | --- |
| GET | `/health` | | `models_loaded` is true once startup finishes |
| POST | `/analyze/text` | JSON `{ "text": "..." }` | |
| POST | `/analyze/audio?language=fr` | 16-bit PCM WAV bytes | `language` is optional; Whisper detects it otherwise. Max 120 s / 5 MB |

Both analyze endpoints return:

```json
{ "text": "transcript or input", "stars": 4, "confidence": 0.71, "scores": [0.01, 0.02, 0.06, 0.71, 0.20] }
```

`scores[i]` is the probability of `i + 1` stars. Input that is too short, or a recording with no
intelligible speech, gets a 422 whose `detail` is safe to show to users.

Environment overrides: `ASR_MODEL`, `SENTIMENT_MODEL`.
