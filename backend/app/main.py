from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from face_engine.encoder import encode_dataset
from face_engine.face_utils import add_face_from_image
from face_engine.scanner import start_scanner, generate_frames
import csv
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "AttendEase API running"}

@app.post("/register")
async def register_face(name: str = Form(...), file: UploadFile = File(...)):
    image_bytes = await file.read()
    add_face_from_image(name, image_bytes)
    encode_dataset()
    return {"message": f"{name} registered successfully"}

@app.post("/start-scan")
def start_scan():
    start_scanner()
    return {"message": "Scanner started"}

@app.get("/stream")
def stream():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/attendance/recent")
def recent_attendance():
    log_file = "face_engine/attendance.csv"
    if not os.path.isfile(log_file):
        return []

    with open(log_file, newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    # Return last 20, newest first
    return list(reversed(rows[-20:]))
