import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import {
  captureFrameAsBase64,
  sendToMLService,
  buildProctorPayload,
  formatViolationMessage,
  computeViolationSeverity,
} from "../utils/proctoringUtils";

/**
 * useProctoring — custom hook that handles the entire ML proctoring lifecycle
 *
 * It manages:
 *  1. Camera access (video stream)
 *  2. Calibration phase (sends initial face samples to ML service)
 *  3. Periodic detection loop (face + phone + gaze — all in one API call)
 *  4. Violation tracking with debounced warnings
 *  5. Screenshot capture + backend logging on violations
 *
 * Usage in Quiz.jsx:
 *   const proctoring = useProctoring({ quizId, enabled: true });
 *   // proctoring.videoRef → attach to <video> element
 *   // proctoring.status → current detection status object
 *   // proctoring.cheatCount → number of violations so far
 *   // etc.
 */
export function useProctoring({ quizId, enabled = true }) {
  // ---- refs ----
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectIntervalRef = useRef(null);
  const sessionIdRef = useRef(`session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

  // consecutive "no face" counter for debounced warnings
  const noFaceStreakRef = useRef(0);

  // ---- state ----
  const [isModelReady, setIsModelReady] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [cheatCount, setCheatCount] = useState(0);
  const [violations, setViolations] = useState([]); // array of {type, timestamp, severity}

  // detection status — updated each cycle
  const [status, setStatus] = useState({
    face: { count: 0, confidence: 0, message: "Initializing..." },
    phone: { detected: false, label: "clean", confidence: 0 },
    gaze: { direction: "center", isLookingAway: false, isSuspicious: false },
    overall: "initializing", // "initializing" | "calibrating" | "active" | "warning" | "error"
  });

  // keep a ref copy of cheatCount so callbacks always see the latest value
  const cheatCountRef = useRef(0);
  useEffect(() => {
    cheatCountRef.current = cheatCount;
  }, [cheatCount]);

  // ---- helpers ----
  const getUserInfo = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      return user.email || "anonymous";
    } catch {
      return "anonymous";
    }
  }, []);

  /**
   * Record a violation — bumps cheatCount, logs it locally, sends to backend.
   * The optional screenshotB64 gets uploaded and stored via Cloudinary on the backend.
   */
  const recordViolation = useCallback(
    (issue, confidence = null, detectedObjects = null) => {
      // grab a screenshot right when the violation happens
      const screenshotB64 = captureFrameAsBase64(videoRef.current, 0.5);

      setCheatCount((prev) => prev + 1);
      setViolations((prev) => [
        ...prev,
        {
          type: issue,
          timestamp: new Date().toISOString(),
          severity: computeViolationSeverity(issue),
        },
      ]);

      // send to spring boot backend
      const payload = buildProctorPayload({
        userId: getUserInfo(),
        issue,
        attemptId: quizId,
        imageBase64: screenshotB64,
        confidence,
        detectedObjects,
      });

      fetch(`${API_BASE_URL}/quiz/proctor/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // don't let a logging failure crash the quiz
      });
    },
    [quizId, getUserInfo]
  );

  // ---- camera setup ----
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false, // we only need video for proctoring
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // track disconnection
      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          recordViolation("device_disconnected");
        };
      });

      return true;
    } catch (err) {
      console.error("Camera access denied:", err);
      setStatus((prev) => ({
        ...prev,
        overall: "error",
        face: { ...prev.face, message: "Camera permission denied" },
      }));
      return false;
    }
  }, [recordViolation]);

  // ---- calibration ----
  const runCalibration = useCallback(async () => {
    if (!videoRef.current) return false;

    setIsCalibrating(true);
    setStatus((prev) => ({ ...prev, overall: "calibrating" }));

    // collect frames over ~4 seconds
    const frames = [];
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 350));
      const frame = captureFrameAsBase64(videoRef.current, 0.7);
      if (frame) frames.push(frame);
    }

    if (frames.length < 5) {
      console.warn("Not enough calibration frames, proceeding anyway");
      setIsCalibrating(false);
      return false;
    }

    // send to ML service for model fine-tuning
    const result = await sendToMLService("/api/calibrate", {
      frames,
      session_id: sessionIdRef.current,
    });

    setIsCalibrating(false);

    if (result && result.status === "calibrated") {
      setIsModelReady(true);
      setStatus((prev) => ({
        ...prev,
        overall: "active",
        face: { ...prev.face, message: "Proctoring active" },
      }));
      return true;
    }

    // calibration failed — still activate proctoring but note the issue
    console.warn("Calibration response:", result);
    setIsModelReady(true);
    setStatus((prev) => ({
      ...prev,
      overall: "active",
      face: { ...prev.face, message: "Active (uncalibrated)" },
    }));
    return true;
  }, []);

  // ---- detection loop ----
  const runDetection = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;

    const frame = captureFrameAsBase64(videoRef.current);
    if (!frame) return;

    const result = await sendToMLService("/api/detect/all", {
      frame,
      session_id: sessionIdRef.current,
    });

    if (!result) {
      // ML service unreachable — don't crash, just note it
      setStatus((prev) => ({
        ...prev,
        face: { ...prev.face, message: "ML service offline" },
      }));
      return;
    }

    // -- process face results --
    const faceData = result.face || {};
    const faceCount = faceData.face_count ?? 0;
    let faceMessage = "Face detected ✓";

    if (faceCount === 0) {
      noFaceStreakRef.current += 1;
      faceMessage = `No face detected (${noFaceStreakRef.current}/3)`;

      // only fire a violation after 3 consecutive no-face readings (~9 seconds)
      if (noFaceStreakRef.current >= 3) {
        recordViolation("no_face", faceData.confidence);
        noFaceStreakRef.current = 0; // reset after logging
      }
    } else if (faceCount > 1) {
      noFaceStreakRef.current = 0;
      faceMessage = `${faceCount} faces detected!`;
      recordViolation("multiple_faces", faceData.confidence);
    } else {
      noFaceStreakRef.current = 0;
    }

    // -- process phone results --
    const phoneData = result.phone || {};
    if (phoneData.detected && phoneData.label !== "clean") {
      const issueType =
        phoneData.label === "phone" ? "phone_detected" : "book_detected";
      recordViolation(issueType, phoneData.confidence, phoneData.label);
    }

    // -- process gaze results --
    const gazeData = result.gaze || {};
    if (gazeData.is_looking_away) {
      // gaze violations are softer — don't bump cheat count, just warn
      // unless it's flagged as suspicious (sudden jump)
      if (gazeData.is_suspicious) {
        recordViolation("suspicious_movement");
      }
    }

    // -- update status --
    setStatus({
      face: {
        count: faceCount,
        confidence: faceData.confidence || 0,
        message: faceMessage,
        bboxes: faceData.bboxes || [],
      },
      phone: {
        detected: phoneData.detected || false,
        label: phoneData.label || "clean",
        confidence: phoneData.confidence || 0,
      },
      gaze: {
        direction: gazeData.direction || "center",
        isLookingAway: gazeData.is_looking_away || false,
        isSuspicious: gazeData.is_suspicious || false,
      },
      overall:
        faceCount === 0 || (phoneData.detected && phoneData.label !== "clean")
          ? "warning"
          : "active",
    });
  }, [recordViolation]);

  // ---- main lifecycle ----
  useEffect(() => {
    if (!enabled) return;

    let alive = true;

    const init = async () => {
      const cameraOk = await startCamera();
      if (!alive || !cameraOk) return;

      // wait a beat for the video to actually start rendering
      await new Promise((r) => setTimeout(r, 800));
      if (!alive) return;

      await runCalibration();
      if (!alive) return;

      // start the detection loop — every 3 seconds
      detectIntervalRef.current = setInterval(() => {
        if (alive) runDetection();
      }, 3000);
    };

    init();

    return () => {
      alive = false;
      if (detectIntervalRef.current) {
        clearInterval(detectIntervalRef.current);
        detectIntervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [enabled, startCamera, runCalibration, runDetection]);

  return {
    videoRef,
    status,
    isModelReady,
    isCalibrating,
    cheatCount,
    violations,
    recordViolation, // exposed so Quiz.jsx can call it for tab-switch etc.
  };
}
