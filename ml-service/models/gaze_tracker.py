"""
GazeTracker — estimates where the user is looking based on face position.

This is NOT a proper eye-tracking solution. Instead, we track the face
bounding box position within the frame as a proxy for head orientation.
If the face moves to the left side of the frame, the user is probably
looking left. Simple but surprisingly effective for catching obvious
cheating behavior like looking at a second monitor or phone.

Pure NumPy — no TensorFlow dependency.
"""

import numpy as np
from collections import deque


class GazeTracker:

    def __init__(self, history_size: int = 30):
        self.history = deque(maxlen=history_size)
        self.baseline_area = None
        self.ema_alpha = 0.3  # smoothing factor for exponential moving average
        self._smoothed_x = 0.5  # start centered
        self._smoothed_y = 0.5

    def update(self, face_bbox: list, frame_width: int, frame_height: int):
        """
        Update the tracker with a new face position.
        
        face_bbox is [x, y, w, h] in pixel coordinates.
        We normalize everything to [0, 1] range relative to frame size
        so the logic doesn't depend on resolution.
        """
        x, y, w, h = face_bbox

        # centroid of the face bbox
        cx = (x + w / 2) / frame_width
        cy = (y + h / 2) / frame_height

        # EMA smoothing to reduce jitter from noisy detections
        self._smoothed_x = self.ema_alpha * cx + (1 - self.ema_alpha) * self._smoothed_x
        self._smoothed_y = self.ema_alpha * cy + (1 - self.ema_alpha) * self._smoothed_y

        current_area = (w * h) / (frame_width * frame_height)

        self.history.append({
            "x": self._smoothed_x,
            "y": self._smoothed_y,
            "raw_x": cx,
            "raw_y": cy,
            "area": current_area,
        })

    def get_direction(self) -> str:
        """
        Determine which direction the user is looking based on
        where their face is positioned in the frame.
        
        Thresholds are intentionally generous — we'd rather miss
        a few edge cases than flag someone who's just shifting
        slightly in their chair.
        """
        if not self.history:
            return "center"

        latest = self.history[-1]
        x = latest["x"]
        y = latest["y"]

        # check corners first, then edges, then center
        # TODO: maybe add diagonal directions too?
        if x < 0.3:
            return "left"
        elif x > 0.7:
            return "right"
        elif y < 0.3:
            return "up"
        elif y > 0.7:
            return "down"
        else:
            return "center"

    def is_looking_away(self) -> bool:
        """Quick check: is the user NOT looking at the screen?"""
        return self.get_direction() != "center"

    def is_suspicious(self) -> bool:
        """
        Detect sudden large movements that might indicate the user
        is quickly glancing at something and looking back.
        
        We check the normalized distance between consecutive frames.
        A jump of > 0.2 is quite large and unusual during normal typing.
        """
        if len(self.history) < 2:
            return False

        prev = self.history[-2]
        curr = self.history[-1]

        # use raw positions for jump detection (not smoothed)
        dx = curr["raw_x"] - prev["raw_x"]
        dy = curr["raw_y"] - prev["raw_y"]
        distance = np.sqrt(dx * dx + dy * dy)

        return distance > 0.2

    def get_face_size_ratio(self) -> float:
        """
        Compare current face size to the baseline established during calibration.
        
        If the ratio drops below ~0.5, the user might be leaning back or
        moving away from the screen (suspicious behavior).
        Returns 1.0 if no baseline has been set yet.
        """
        if self.baseline_area is None or not self.history:
            return 1.0

        current_area = self.history[-1]["area"]
        if self.baseline_area <= 0:
            return 1.0

        ratio = current_area / self.baseline_area
        return round(ratio, 4)

    def set_baseline(self, face_bbox: list, frame_width: int = 640, frame_height: int = 480):
        """
        Set the reference face size during calibration.
        Should be called when the user is sitting normally at their desk.
        """
        x, y, w, h = face_bbox
        self.baseline_area = (w * h) / (frame_width * frame_height)
        print(f"[GazeTracker] Baseline face area set to {self.baseline_area:.6f}")

    def reset(self):
        """Clear everything — used when starting a new session."""
        self.history.clear()
        self.baseline_area = None
        self._smoothed_x = 0.5
        self._smoothed_y = 0.5

    def get_status(self) -> dict:
        """
        Returns the full gaze status in one call.
        This is what the API endpoint returns to the Spring Boot backend.
        """
        direction = self.get_direction()
        size_ratio = self.get_face_size_ratio()

        # determine if user is moving away from camera
        size_status = "normal"
        if size_ratio < 0.5:
            size_status = "moving_away"
        elif size_ratio > 1.8:
            size_status = "too_close"  # they're getting right up in the camera

        return {
            "direction": direction,
            "is_looking_away": self.is_looking_away(),
            "is_suspicious": self.is_suspicious(),
            "face_size_ratio": size_ratio,
            "face_size_status": size_status,
        }
