<h1 align="center">🚀 Placify</h1>
<h3 align="center">AI-Powered Campus Placement & Assessment Platform</h3>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TensorFlow-2.19-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenCV-4.11-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" />
</p>

---

## 📘 Overview

**Placify** is a **full-stack campus placement management system** featuring an **AI-powered quiz proctoring engine** built entirely from scratch. It streamlines placement workflows for students, recruiters, and admins — and uses **custom-built machine learning models** (not pre-trained libraries) for real-time exam integrity monitoring.

The platform includes a **Python FastAPI microservice** with custom CNN architectures for face detection, phone detection, gaze tracking, and plagiarism analysis — all designed and trained from the ground up.

---

## 🏗️ System Architecture

```
┌─────────────┐     base64 frames       ┌──────────────┐    plagiarism API     ┌─────────────┐
│             │  ─────────────────────►  │              │  ◄────────────────── │             │
│  Frontend   │                         │  ML Service  │                      │   Backend   │
│  React/Vite │  ◄─────────────────────  │  FastAPI     │  ─────────────────► │ Spring Boot │
│  :5173      │   detection results      │  :5000       │   plagiarism results │  :8080      │
└─────────────┘                         └──────────────┘                      └──────┬──────┘
                                                                                     │
                                                                              ┌──────┴──────┐
                                                                              │  MongoDB    │
                                                                              │  Cloudinary │
                                                                              └─────────────┘
```

**Three servers run in parallel:**
- `Frontend/` → React 19 + Vite 7 → **port 5173**
- `Backend/` → Spring Boot 3.5 + Java 25 → **port 8080**
- `ml-service/` → FastAPI + TensorFlow + OpenCV → **port 5000**

---

## 🎯 Key Features

### 👨‍🎓 Student Module
- Register, log in (Local + Google OAuth2), and manage profiles
- Browse placement drives and company listings
- Track applications and placement results
- Attempt quizzes with real-time AI proctoring
- Solve coding problems in an online IDE with multiple language support

### 🏢 Company Module
- Post job openings with eligibility filters
- View eligible students and shortlist candidates
- Manage interviews and selection results

### 🧑‍💼 Admin Module
- Approve/reject student & company registrations
- Manage placement schedules, subjects, and resources
- Create and manage quizzes and coding problems
- View detailed proctoring & plagiarism reports
- Audit logs for all administrative actions
- Analytics dashboard with charts and statistics

### 📝 Quiz & Assessment Module
- Admin creates multiple-choice quizzes with configurable timers
- Students attempt quizzes in fullscreen secure mode
- Instant scoring and result tracking
- Quiz attempt history with cheat count tracking
- Anti-cheat: tab switch, copy/paste, right-click, and DevTools blocking

### 💻 Online Code Editor
- Monaco-based coding arena with syntax highlighting
- Multi-language support (Java, Python, C++, JavaScript)
- Test case execution via Docker-sandboxed compiler engine
- AI-powered code explanation via Google Gemini

---

## 🧠 AI/ML Proctoring System (Custom-Built)

> **All ML models are built from scratch** using raw TensorFlow/Keras layers and OpenCV — no pre-trained model libraries used.

### 🔍 FaceGuard — Face Detection & Counting
| Stage | Technique |
|-------|-----------|
| Pre-filter | HSV skin color segmentation (H∈[0,25], S∈[40,170], V∈[80,255]) |
| Noise removal | Morphological close (5×5) + open (3×3) |
| Region proposals | Contour detection, filter by area ≥ 2000px² |
| Classification | **Custom 6-layer CNN** (Conv2D→BatchNorm→MaxPool ×3 → Dense→Dropout→Softmax) |
| Calibration | Fine-tunes Dense layers on user's face during quiz start (3 epochs) |

### 📱 PhoneSentry — Phone & Object Detection
| Stage | Technique |
|-------|-----------|
| Background modeling | MOG2 Background Subtractor (history=100, varThreshold=40) |
| Foreground extraction | Morphological ops + contour filtering ≥ 3000px² |
| Feature enrichment | Sobel edge detection + per-channel color histograms |
| Classification | **Custom 8-layer CNN** (Conv2D ×4 → GlobalAvgPool → Dense ×3 → Softmax) |
| Classes | `phone` · `book` · `clean` |

### 👁️ GazeTracker — Head Pose Estimation
| Technique | Details |
|-----------|---------|
| Centroid tracking | Face bounding box centroid normalized to frame dimensions |
| Direction mapping | x<0.3→left, x>0.7→right, y<0.3→up, y>0.7→down, else→center |
| Smoothing | Exponential Moving Average (α=0.3) to prevent jitter |
| Suspicious movement | Centroid jump >20% frame width between consecutive frames |
| Face proximity | Area ratio vs. calibration baseline; <0.5 → "moving away" |

### 📋 PlagiarismEngine — Answer Pattern Analysis
| Technique | Details |
|-----------|---------|
| Algorithm | Pairwise Jaccard Similarity: \|A ∩ B\| / \|A ∪ B\| |
| Threshold | Similarity > 0.8 → flagged as suspicious |
| Scope | All student pairs per quiz, triggered post-submission |

### 📸 Violation Evidence Pipeline
1. Frontend captures webcam screenshot on violation
2. Screenshot sent to Spring Boot as base64
3. Spring Boot uploads to **Cloudinary** → gets `secure_url`
4. Stores URL + severity + confidence in `ProctorLog` (MongoDB)
5. Admin views evidence with screenshots in the proctoring dashboard

---

## 📂 Project Structure

```
Placify/
├── Frontend/                      # React 19 + Vite 7
│   └── src/
│       ├── Components/
│       │   ├── Navigation/        # Quiz, MockTest, Compiler, etc.
│       │   └── Admin/             # Admin dashboard pages
│       ├── hooks/
│       │   └── useProctoring.js   # ML proctoring lifecycle hook
│       ├── utils/
│       │   └── proctoringUtils.js # Frame capture, API helpers
│       └── config.js              # API + ML service URLs
│
├── Backend/                       # Spring Boot 3.5 + Java 25
│   └── src/main/java/com/Placify/
│       ├── Controller/            # REST endpoints
│       ├── Service/               # Business logic
│       ├── Entity/                # MongoDB documents
│       ├── Repository/            # Data access layer
│       ├── Config/                # Security, Cloudinary, JWT
│       └── Filter/                # JWT authentication filter
│
├── ml-service/                    # FastAPI + TensorFlow + OpenCV
│   ├── app.py                     # FastAPI server (all endpoints)
│   ├── models/
│   │   ├── face_guard.py          # Custom face detection CNN
│   │   ├── phone_sentry.py        # Custom phone detection CNN
│   │   ├── gaze_tracker.py        # Geometric gaze tracker
│   │   └── plagiarism_engine.py   # Jaccard similarity analysis
│   ├── utils/
│   │   ├── frame_decoder.py       # Base64 decode/encode
│   │   └── image_processing.py    # Skin segmentation, edges, histograms
│   ├── training/
│   │   ├── collect_samples.py     # Webcam data collection tool
│   │   ├── train_face_model.py    # Face model training script
│   │   └── train_phone_model.py   # Phone model training script
│   └── weights/                   # Trained model weights (.h5)
│
└── compiler-engine/               # Docker-based code execution
```

---

## ⚙️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| TailwindCSS 4 | Utility-first styling |
| React Router 7 | Client-side routing |
| Framer Motion | Animations |
| Recharts | Analytics charts |
| Monaco Editor | Code editor (IDE) |
| Lucide React | Icon system |

### Backend
| Technology | Purpose |
|-----------|---------|
| Spring Boot 3.5 | REST API framework |
| Java 25 | Server-side language |
| MongoDB | NoSQL database |
| Spring Security | JWT authentication + role-based access |
| Cloudinary | Image CDN for violation screenshots |
| WebClient | HTTP client for ML service calls |
| Google Gemini API | AI code explanations |

### ML Service
| Technology | Purpose |
|-----------|---------|
| FastAPI | Async Python web framework |
| TensorFlow / Keras | Custom CNN model building & training |
| OpenCV | Computer vision (skin segmentation, background subtraction, edge detection) |
| NumPy | Numerical computations (gaze tracking, similarity) |
| Pillow | Image processing utilities |
| Uvicorn | ASGI server |

<p align="left">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="45" height="45"/>
  <img src="https://www.vectorlogo.zone/logos/springio/springio-icon.svg" alt="Spring Boot" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" alt="Java" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="Python" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tensorflow/tensorflow-original.svg" alt="TensorFlow" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/opencv/opencv-original.svg" alt="OpenCV" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg" alt="FastAPI" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" alt="HTML5" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" alt="CSS3" width="45" height="45"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" alt="Docker" width="45" height="45"/>
</p>

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** 18+ & npm
- **Java** 25+ & Maven
- **Python** 3.10+ & pip
- **MongoDB** 7.0+ (running locally or Atlas)
- **Docker** (for compiler engine)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ujjawal-singh1/Placify.git
cd Placify
```

### 2️⃣ Backend (Spring Boot)
```bash
cd Backend

# Configure MongoDB in src/main/resources/application.properties:
# spring.data.mongodb.uri=mongodb://localhost:27017/placify_db
# spring.data.mongodb.database=placify_db

# Run the backend
mvn spring-boot:run
# → http://localhost:8080
```

### 3️⃣ ML Service (FastAPI)
```bash
cd ml-service

# Install dependencies
pip install -r requirements.txt

# Run the ML service
python app.py
# → http://localhost:5000
# → Swagger docs at http://localhost:5000/docs
```

### 4️⃣ Frontend (React + Vite)
```bash
cd Frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
# → http://localhost:5173
```

### 5️⃣ Train ML Models (Optional — improves accuracy)
```bash
cd ml-service

# Step 1: Collect training data via webcam
python training/collect_samples.py
# Keys: f=face, n=not_face, p=phone, b=book, c=clean, q=quit
# Aim for 200+ samples per class

# Step 2: Train the face detection model
python training/train_face_model.py
# → saves weights/face_guard.weights.h5

# Step 3: Train the phone detection model
python training/train_phone_model.py
# → saves weights/phone_sentry.weights.h5
```

---

## 🔌 API Endpoints

### ML Service (FastAPI — :5000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check & model status |
| POST | `/api/detect/all` | Run all detections on a single frame |
| POST | `/api/detect/face` | Face detection only |
| POST | `/api/detect/phone` | Phone detection only |
| POST | `/api/detect/gaze` | Gaze tracking only |
| POST | `/api/calibrate` | Calibrate models for a user session |
| POST | `/api/plagiarism/analyze` | Analyze quiz for answer copying |

### Backend (Spring Boot — :8080)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User authentication |
| POST | `/auth/signup` | User registration |
| GET | `/quiz/all` | List all quizzes |
| GET | `/quiz/get/{id}` | Get quiz questions |
| POST | `/quiz/submit/{id}` | Submit quiz answers |
| POST | `/quiz/proctor/upload` | Upload proctoring violation |
| POST | `/api/plagiarism/analyze/{quizId}` | Trigger plagiarism analysis |
| GET | `/api/plagiarism/flagged` | Get flagged pairs |
| GET | `/api/compiler/run` | Execute code in sandbox |

---

## 📊 Database Collections (MongoDB)

| Collection | Description |
|-----------|-------------|
| `user` | Student & admin accounts with roles |
| `quiz` | Quiz metadata + embedded questions |
| `quizAttempt` | Student quiz attempts with scores & cheat counts |
| `attempt` | Detailed response data per attempt |
| `proctorLog` | Violation evidence (screenshots, severity, confidence) |
| `plagiarism_results` | Pairwise similarity analysis results |
| `codingProblem` | Coding challenges with test cases |
| `codingSubmission` | Student code submissions |
| `company` | Registered companies |
| `subject` | Academic subjects |
| `resource` | Learning resources per subject |
| `feedback` | User feedback & ratings |
| `auditLog` | Admin action audit trail |

---

## 👨‍💻 Team Members

| Name | Role |
|------|------|
| **Ujjawal Kumar** | Full Stack Lead (React + Spring Boot + MongoDB) |
| **Mana Panda** | Frontend Developer (React + UI/UX) |
| **Rohit Soni** | Backend & Database (MongoDB) |
| **Shubham Sharma** | UI/UX & Testing |

## 🧑‍🏫 Guided By

**Tapas Pal Sir**  
Department of Information Technology  
Asansol Engineering College

---

## 🪪 License

This project is for educational purposes.
