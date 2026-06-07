"""
Frame encoding/decoding helpers for the proctoring pipeline.

We receive webcam frames as base64 strings from the frontend and need
to convert them into numpy arrays for OpenCV processing. These utils
handle that back-and-forth conversion.
"""

import base64
import cv2
import numpy as np


def decode_base64_frame(b64_string: str) -> np.ndarray:
    """
    Takes a base64-encoded image (possibly with a data URI prefix like
    'data:image/jpeg;base64,...') and returns a BGR numpy array.
    
    This is the entry point for every frame that comes in from the browser.
    """
    # strip the data URI scheme if the frontend sends it
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]

    raw_bytes = base64.b64decode(b64_string)
    img_array = np.frombuffer(raw_bytes, dtype=np.uint8)
    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if frame is None:
        raise ValueError("Failed to decode frame — got None from imdecode. Check the base64 input.")

    return frame


def encode_frame_base64(frame: np.ndarray) -> str:
    """
    Encodes a BGR numpy array back to a base64 JPEG string.
    Useful when we need to send annotated frames back to the client,
    though most of the time we just return detection results as JSON.
    """
    success, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
    if not success:
        raise RuntimeError("cv2.imencode failed — frame might be corrupted or empty")

    return base64.b64encode(buffer).decode("utf-8")


def resize_frame(frame: np.ndarray, max_dim: int = 640) -> np.ndarray:
    """
    Proportionally resize so the longest edge is at most `max_dim`.
    Keeps aspect ratio intact. If the frame is already small enough,
    we just return it as-is to avoid unnecessary interpolation.
    """
    h, w = frame.shape[:2]
    longest = max(h, w)

    if longest <= max_dim:
        return frame

    scale = max_dim / longest
    new_w = int(w * scale)
    new_h = int(h * scale)

    # INTER_AREA is better for downscaling, gives cleaner results
    resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
    return resized
