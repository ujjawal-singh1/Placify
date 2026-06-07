"""
Main FastAPI application for the ML proctoring service.

This runs as a standalone microservice that the Spring Boot backend calls
during quiz sessions. It handles real-time face/phone/gaze detection from
webcam frames and post-quiz plagiarism analysis.

Frame images are processed here but NOT stored — violation screenshots
get uploaded to Cloudinary from the Spring Boot side.
"""

import os
import time
import threading
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from utils.frame_decoder import decode_base64_frame, resize_frame
from models.face_guard import FaceGuard
from models.phone_sentry import PhoneSentry
from models.gaze_tracker import GazeTracker
from models.plagiarism_engine import PlagiarismEngine

# ── app setup ───────────────────────────────────────────────

app = FastAPI(
    title="Placify ML Proctoring Service",
    description="Real-time quiz proctoring with face detection, phone detection, gaze tracking, and plagiarism analysis",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # wide open for dev — lock this down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── model instances (initialized at startup) ───────────────

WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), "weights")

face_guard: Optional[FaceGuard] = None
phone_sentry: Optional[PhoneSentry] = None
plagiarism_engine: Optional[PlagiarismEngine] = None

# per-session gaze trackers: session_id -> (GazeTracker, last_active_timestamp)
gaze_sessions: dict = {}
gaze_lock = threading.Lock()

# how long before we clean up an inactive session (2 hours)
SESSION_TIMEOUT_SECS = 2 * 60 * 60


# ── request/response schemas ───────────────────────────────

class FrameRequest(BaseModel):
    frame: str
    session_id: str

class GazeRequest(BaseModel):
    frame: str
    session_id: str
    face_bbox: list = Field(default_factory=list)

class CalibrateRequest(BaseModel):
    frames: list
    session_id: str

class AttemptData(BaseModel):
    user_id: str
    responses: dict

class PlagiarismRequest(BaseModel):
    quiz_id: str
    attempts: list[AttemptData]

class FaceResponse(BaseModel):
    face_count: int
    confidence: float
    bboxes: list

class PhoneResponse(BaseModel):
    detected: bool
    label: str
    confidence: float
    bbox: Optional[list] = None

class GazeResponse(BaseModel):
    direction: str
    is_looking_away: bool
    is_suspicious: bool
    face_size_ratio: float = 1.0
    face_size_status: str = "normal"

class AllDetectionResponse(BaseModel):
    face: dict
    phone: dict
    gaze: dict
    timestamp: str


# ── helper functions ────────────────────────────────────────

def _get_gaze_tracker(session_id: str) -> GazeTracker:
    """Get or create a GazeTracker for this session."""
    with gaze_lock:
        if session_id in gaze_sessions:
            tracker, _ = gaze_sessions[session_id]
            gaze_sessions[session_id] = (tracker, time.time())
            return tracker
        else:
            tracker = GazeTracker()
            gaze_sessions[session_id] = (tracker, time.time())
            return tracker


def _cleanup_stale_sessions():
    """Remove gaze trackers that haven't been used in a while."""
    now = time.time()
    with gaze_lock:
        stale = [
            sid for sid, (_, last_active) in gaze_sessions.items()
            if now - last_active > SESSION_TIMEOUT_SECS
        ]
        for sid in stale:
            del gaze_sessions[sid]
        if stale:
            print(f"[Cleanup] Removed {len(stale)} stale gaze sessions")


def _decode_and_resize(b64_frame: str):
    """Common frame decoding logic used by all detection endpoints."""
    frame = decode_base64_frame(b64_frame)
    frame = resize_frame(frame, max_dim=640)
    return frame


# ── startup / shutdown ──────────────────────────────────────

@app.on_event("startup")
def startup_event():
    global face_guard, phone_sentry, plagiarism_engine

    print("[Startup] Loading ML models...")

    face_weights = os.path.join(WEIGHTS_DIR, "face_guard.weights.h5")
    phone_weights = os.path.join(WEIGHTS_DIR, "phone_sentry.weights.h5")

    face_guard = FaceGuard(weights_path=face_weights)
    phone_sentry = PhoneSentry(weights_path=phone_weights)
    plagiarism_engine = PlagiarismEngine()

    print("[Startup] All models loaded successfully")

    # start a background thread that periodically cleans up old sessions
    cleanup_thread = threading.Thread(target=_session_cleanup_loop, daemon=True)
    cleanup_thread.start()


def _session_cleanup_loop():
    """Runs in the background, cleans up old sessions every 30 minutes."""
    while True:
        time.sleep(30 * 60)
        _cleanup_stale_sessions()


# ── endpoints ───────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    models_ok = face_guard is not None and phone_sentry is not None
    return {
        "status": "ok",
        "models_loaded": models_ok,
        "active_sessions": len(gaze_sessions),
    }


@app.post("/api/detect/face", response_model=FaceResponse)
def detect_face(req: FrameRequest):
    try:
        frame = _decode_and_resize(req.frame)
        result = face_guard.detect(frame)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Face detection failed: {str(e)}")


@app.post("/api/detect/phone", response_model=PhoneResponse)
def detect_phone(req: FrameRequest):
    try:
        frame = _decode_and_resize(req.frame)
        result = phone_sentry.detect(frame)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Phone detection failed: {str(e)}")


@app.post("/api/detect/gaze", response_model=GazeResponse)
def detect_gaze(req: GazeRequest):
    try:
        tracker = _get_gaze_tracker(req.session_id)

        if req.face_bbox and len(req.face_bbox) == 4:
            frame = _decode_and_resize(req.frame)
            h, w = frame.shape[:2]
            tracker.update(req.face_bbox, w, h)

        return tracker.get_status()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gaze detection failed: {str(e)}")


@app.post("/api/detect/all", response_model=AllDetectionResponse)
def detect_all(req: FrameRequest):
    """
    Run all detections in one shot. This is what the frontend typically
    calls on each frame interval to get everything at once.
    """
    try:
        frame = _decode_and_resize(req.frame)

        # face detection
        face_result = face_guard.detect(frame)

        # phone detection
        phone_result = phone_sentry.detect(frame)

        # gaze tracking — use the first detected face bbox
        tracker = _get_gaze_tracker(req.session_id)
        if face_result["bboxes"]:
            h, w = frame.shape[:2]
            tracker.update(face_result["bboxes"][0], w, h)

        gaze_result = tracker.get_status()

        return {
            "face": face_result,
            "phone": phone_result,
            "gaze": gaze_result,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection pipeline failed: {str(e)}")


@app.post("/api/calibrate")
def calibrate(req: CalibrateRequest):
    """
    Calibrate the models for a specific user session.
    
    The frontend sends several frames of the user sitting normally.
    We use these to:
    - Fine-tune the face model on this person's face
    - Build up the phone detector's background model
    - Set the gaze tracker's baseline face size
    """
    try:
        frames = []
        for b64 in req.frames:
            f = _decode_and_resize(b64)
            frames.append(f)

        if not frames:
            raise HTTPException(status_code=400, detail="No valid frames provided")

        # calibrate face model
        samples_processed = face_guard.calibrate(frames)

        # feed frames to phone detector's background model
        for f in frames:
            phone_sentry.update_background(f)

        # set gaze baseline from the first frame where we can find a face
        tracker = _get_gaze_tracker(req.session_id)
        for f in frames:
            result = face_guard.detect(f)
            if result["bboxes"]:
                h, w = f.shape[:2]
                tracker.set_baseline(result["bboxes"][0], w, h)
                break

        return {
            "status": "calibrated",
            "samples_processed": samples_processed,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calibration failed: {str(e)}")


@app.post("/api/plagiarism/analyze")
def analyze_plagiarism(req: PlagiarismRequest):
    try:
        # convert pydantic models to plain dicts for the engine
        attempts_data = [
            {"userId": a.user_id, "responses": a.responses}
            for a in req.attempts
        ]

        results = plagiarism_engine.analyze(attempts_data)
        flagged_count = sum(1 for r in results if r["flagged"])

        return {
            "quiz_id": req.quiz_id,
            "results": results,
            "flagged_count": flagged_count,
            "total_pairs_analyzed": len(results),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plagiarism analysis failed: {str(e)}")


# ── run directly ────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
