# Placify ML Proctoring Service

A FastAPI microservice that provides real-time ML-based proctoring for the Placify quiz platform.

## Features

- **FaceGuard** — Custom CNN for face detection (skin segmentation + classification)
- **PhoneSentry** — Custom CNN for phone/object detection (background subtraction + classification)
- **GazeTracker** — Geometric head pose & gaze estimation using NumPy
- **PlagiarismEngine** — Jaccard similarity analysis on quiz answer patterns

## Setup

### Prerequisites
- Python 3.10+
- pip

### Installation

```bash
cd ml-service
pip install -r requirements.txt
```

### Running the Service

```bash
python app.py
```

The service starts on `http://localhost:5000`. Visit `http://localhost:5000/docs` for the interactive Swagger API documentation.

## Training Custom Models

The models work out of the box with random weights and runtime calibration, but training them will give much better accuracy.

### 1. Collect Training Data

```bash
python training/collect_samples.py
```

This opens your webcam. Use these keys:
- `f` — Save frame as "face" sample
- `n` — Save frame as "not_face" sample
- `p` — Save frame as "phone" sample
- `b` — Save frame as "book" sample
- `c` — Save frame as "clean" sample
- `q` — Quit

Aim for **200+ samples per class** for decent results.

### 2. Train Face Model

```bash
python training/train_face_model.py
```

Saves weights to `weights/face_guard.weights.h5`.

### 3. Train Phone Model

```bash
python training/train_phone_model.py
```

Saves weights to `weights/phone_sentry.weights.h5`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/detect/face` | Face detection only |
| POST | `/api/detect/phone` | Phone detection only |
| POST | `/api/detect/gaze` | Gaze tracking only |
| POST | `/api/detect/all` | **All detections in one call** |
| POST | `/api/calibrate` | Calibrate models for a user session |
| POST | `/api/plagiarism/analyze` | Analyze quiz for answer copying |

## Architecture

```
ml-service/
├── app.py                  # FastAPI server
├── requirements.txt        # Dependencies
├── models/
│   ├── face_guard.py       # Face detection CNN
│   ├── phone_sentry.py     # Phone detection CNN
│   ├── gaze_tracker.py     # Geometric gaze tracker
│   └── plagiarism_engine.py # Answer similarity analysis
├── utils/
│   ├── frame_decoder.py    # Base64 decode/encode
│   └── image_processing.py # CV utilities (skin seg, edges, etc.)
├── training/
│   ├── collect_samples.py  # Webcam data collection
│   ├── train_face_model.py # Face model training
│   └── train_phone_model.py # Phone model training
└── weights/                # Trained model weights (generated)
```
