"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
import os
from dotenv import load_dotenv
import time
import json
import base64

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("GEMINI_API_KEY")
BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
MODEL = "gemini-flash-latest"

# Supported MIME types
IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
DOC_TYPES   = ["application/pdf", "text/plain", "text/csv",
                "application/json", "text/html", "text/markdown"]


def build_parts(message: str, attachments: list) -> list:
    parts = []

    for att in attachments:
        mime = att.get("mimeType", "")
        data = att.get("data", "")     # base64 string from frontend
        name = att.get("name", "file")

        if mime in IMAGE_TYPES:
            parts.append({
                "inline_data": {
                    "mime_type": mime,
                    "data": data
                }
            })
        elif mime in DOC_TYPES:
            parts.append({
                "inline_data": {
                    "mime_type": mime,
                    "data": data
                }
            })
        else:
            # Unknown type — tell model about it
            parts.append({"text": f"[Attached file: {name} ({mime}) — content not renderable]"})

    if message:
        parts.append({"text": message})

    return parts


def call_gemini(contents: list) -> str:
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY is not set!")

    url = f"{BASE_URL}/{MODEL}:generateContent"
    print(f"\n🔄 Calling {MODEL}")

    response = requests.post(
        url,
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": API_KEY,
        },
        json={"contents": contents},
        timeout=60,
    )

    print(f"📥 Status: {response.status_code}")

    if response.status_code != 200:
        raise RuntimeError(f"HTTP {response.status_code}: {response.text[:400]}")

    res_data = response.json()

    if "error" in res_data:
        raise RuntimeError(res_data["error"].get("message", "Unknown API error"))

    try:
        reply = res_data["candidates"][0]["content"]["parts"][0]["text"]
        print(f"✅ Reply: {reply[:120]}...")
        return reply
    except (KeyError, IndexError) as e:
        raise RuntimeError(f"Unexpected response: {e} — {res_data}")


@app.get("/")
def home():
    return {"message": "Nchat backend ✅", "model": MODEL}


@app.get("/test")
def test():
    try:
        reply = call_gemini([{"role": "user", "parts": [{"text": "Say: API is working!"}]}])
        return {"status": "✅ success", "reply": reply}
    except Exception as e:
        return {"status": "❌ failed", "error": str(e)}


@app.post("/chat")
def chat(data: dict):
    user_message  = data.get("message", "").strip()
    history       = data.get("history", [])
    attachments   = data.get("attachments", [])   # NEW: list of {name, mimeType, data}

    if not user_message and not attachments:
        raise HTTPException(status_code=400, detail="Empty message")

    # Build history (text only for past messages)
    contents = []
    for msg in history[:-1]:
        role = "user" if msg["role"] == "user" else "model"
        text = msg.get("content", "").strip()
        if text:
            contents.append({"role": role, "parts": [{"text": text}]})

    # Current turn — may include attachments
    parts = build_parts(user_message, attachments)
    contents.append({"role": "user", "parts": parts})

    try:
        reply = call_gemini(contents)
    except Exception as e:
        err = f"⚠️ {str(e)}"
        return StreamingResponse(
            (c for c in err),
            media_type="text/plain"
        )

    def generate():
        for char in reply:
            yield char
            time.sleep(0.008)

    return StreamingResponse(generate(), media_type="text/plain")
""" 
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import boto3
import time

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Bedrock client
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1"
)

# ✅ Nova Lite model
MODEL_ID = "amazon.nova-lite-v1:0"


# ✅ Call Bedrock (Converse API)
def call_bedrock(contents: list) -> str:
    try:
        messages = []

        for item in contents:
            role = item["role"]
            text = item["parts"][0].get("text", "")

            if text:
                messages.append({
                    "role": role,
                    "content": [{"text": text}]
                })

        response = bedrock.converse(
            modelId=MODEL_ID,
            messages=messages,
            inferenceConfig={
                "maxTokens": 200,   # 🔥 safe limit
                "temperature": 0.5,
                "topP": 0.9
            }
        )

        return response["output"]["message"]["content"][0]["text"]

    except Exception as e:
        raise RuntimeError(f"Bedrock error: {str(e)}")


# ✅ Health check
@app.get("/")
def home():
    return {
        "message": "Nova Lite backend running ✅",
        "model": MODEL_ID
    }


# ✅ Test endpoint
@app.get("/test")
def test():
    try:
        reply = call_bedrock([
            {"role": "user", "parts": [{"text": "Say: API is working!"}]}
        ])
        return {"status": "✅ success", "reply": reply}
    except Exception as e:
        return {"status": "❌ failed", "error": str(e)}


# ✅ Chat endpoint
@app.post("/chat")
def chat(data: dict):
    user_message = data.get("message", "").strip()
    history = data.get("history", [])

    if not user_message:
        raise HTTPException(status_code=400, detail="Empty message")

    # 🔥 Limit history (important for quota)
    history = history[-5:]

    contents = []

    # Build history
    for msg in history[:-1]:
        role = "user" if msg["role"] == "user" else "assistant"
        text = msg.get("content", "").strip()

        if text:
            contents.append({
                "role": role,
                "parts": [{"text": text}]
            })

    # Current message
    contents.append({
        "role": "user",
        "parts": [{"text": user_message}]
    })

    try:
        reply = call_bedrock(contents)
    except Exception as e:
        err = f"⚠️ {str(e)}"
        return StreamingResponse((c for c in err), media_type="text/plain")

    # ✅ Streaming effect
    def generate():
        for char in reply:
            yield char
            time.sleep(0.006)

    return StreamingResponse(generate(), media_type="text/plain")