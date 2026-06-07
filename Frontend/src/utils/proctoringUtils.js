import { ML_SERVICE_URL } from "../config";

/**
 * Grabs the current video frame and returns it as a base64-encoded JPEG.
 * We draw onto an offscreen canvas to avoid any visible flicker in the UI.
 */
export function captureFrameAsBase64(videoElement, quality = 0.6) {
  if (!videoElement || videoElement.readyState < 2) return null;

  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement, 0, 0);

  // strip the "data:image/jpeg;base64," prefix — backend expects raw b64
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return dataUrl.split(",")[1];
}

/**
 * Send a frame (or other payload) to the ML microservice.
 * Wraps fetch with a timeout so we don't block the quiz if the
 * service is slow or unreachable.
 */
export async function sendToMLService(endpoint, payload, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${ML_SERVICE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`ML service returned ${res.status} for ${endpoint}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      console.warn(`ML service timeout on ${endpoint}`);
    } else {
      console.error(`ML service error (${endpoint}):`, err.message);
    }
    return null;
  }
}

/**
 * Build the payload we POST to the Spring Boot proctor log endpoint.
 * Matches the ProctorLog entity fields on the backend.
 */
export function buildProctorPayload({
  userId,
  issue,
  attemptId,
  imageBase64 = null,
  severity = null,
  detectedObjects = null,
  confidence = null,
}) {
  return {
    userId,
    issue,
    attemptId,
    imageBase64,
    severity: severity || computeViolationSeverity(issue),
    detectedObjects,
    confidence,
  };
}

/**
 * Maps an issue type to a severity level.
 * Must stay in sync with the backend QuizService severity logic.
 */
export function computeViolationSeverity(issue) {
  const high = ["multiple_faces", "phone_detected"];
  const medium = ["no_face", "looking_away", "suspicious_movement"];
  // everything else defaults to "low"

  if (high.includes(issue)) return "high";
  if (medium.includes(issue)) return "medium";
  return "low";
}

/**
 * Turns internal issue codes into messages we can show in the UI.
 * Keeping these in one place so we don't have magic strings everywhere.
 */
const VIOLATION_MESSAGES = {
  no_face: "⚠ No face detected — please stay visible",
  multiple_faces: "⚠ Multiple faces detected!",
  phone_detected: "⚠ Mobile phone detected!",
  book_detected: "⚠ Prohibited object detected!",
  looking_away: "⚠ Please look at the screen",
  suspicious_movement: "⚠ Suspicious movement detected",
  window_blur: "⚠ Window focus lost",
  tab_switch: "⚠ Tab switch detected",
  fullscreen_exit: "⚠ Fullscreen mode exited",
  context_menu: "⚠ Right-click blocked",
  copy_paste: "⚠ Copy/paste attempt blocked",
  keyboard_shortcut: "⚠ Restricted shortcut blocked",
  devtools_attempt: "⚠ DevTools access blocked",
  device_disconnected: "⚠ Camera/mic disconnected",
};

export function formatViolationMessage(issue) {
  return VIOLATION_MESSAGES[issue] || `⚠ Violation: ${issue}`;
}
