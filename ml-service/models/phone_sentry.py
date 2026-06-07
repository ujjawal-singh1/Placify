"""
PhoneSentry — detects phones and books in the webcam feed.

Uses background subtraction to find moving/new objects in the scene,
then classifies candidate regions with a CNN. The background model
adapts over time so it learns what the "normal" scene looks like
and can spot when something new (like a phone) appears.

Three classes: phone, book, clean (nothing suspicious)
"""

import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

from utils.image_processing import preprocess_for_cnn


# class index mapping
LABELS = {0: "phone", 1: "book", 2: "clean"}


class PhoneSentry:
    INPUT_SHAPE = (96, 96, 3)
    # minimum contour area to consider — filters out tiny motion artifacts
    MIN_CONTOUR_AREA = 3000

    def __init__(self, weights_path=None):
        self.model = self._build_model()
        self.bg_subtractor = self._init_bg_subtractor()

        if weights_path and os.path.exists(weights_path):
            self.load_weights(weights_path)
            print(f"[PhoneSentry] Loaded weights from {weights_path}")
        else:
            print("[PhoneSentry] No pretrained weights, running with random init")

    def _build_model(self):
        """
        Slightly deeper than FaceGuard since we're doing 3-class classification.
        Uses GlobalAveragePooling instead of Flatten to reduce params and
        make it more robust to spatial shifts.
        """
        model = keras.Sequential([
            layers.Input(shape=self.INPUT_SHAPE),

            # first block with larger kernel to capture broader features
            layers.Conv2D(16, (5, 5), activation="relu", padding="same"),
            layers.MaxPooling2D((2, 2)),

            layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
            layers.MaxPooling2D((2, 2)),

            layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
            layers.MaxPooling2D((2, 2)),

            layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
            layers.GlobalAveragePooling2D(),

            layers.Dense(128, activation="relu"),
            layers.Dropout(0.4),
            layers.Dense(64, activation="relu"),
            layers.Dense(3, activation="softmax"),
        ])

        model.compile(
            optimizer="adam",
            loss="categorical_crossentropy",
            metrics=["accuracy"],
        )
        return model

    def _init_bg_subtractor(self):
        """
        MOG2 background subtractor. history=100 means it considers
        the last 100 frames to build the background model.
        varThreshold=40 is a bit higher than default (16) to reduce
        false positives from minor lighting changes.
        """
        subtractor = cv2.createBackgroundSubtractorMOG2(
            history=100,
            varThreshold=40,
            detectShadows=False,  # shadows just add noise for our use case
        )
        return subtractor

    def detect(self, frame: np.ndarray) -> dict:
        """
        Detection pipeline:
        1. Apply background subtraction to find new/moving objects
        2. Clean up the foreground mask with morphological ops
        3. Find contour regions big enough to be a phone or book
        4. Classify the most promising candidate with the CNN
        
        Returns detection result with label, confidence, and bbox.
        """
        fg_mask = self.bg_subtractor.apply(frame, learningRate=0.005)

        # clean up the mask — remove noise then fill holes
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_OPEN, kernel)
        fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)

        # threshold to get solid regions
        _, fg_mask = cv2.threshold(fg_mask, 200, 255, cv2.THRESH_BINARY)

        contours, _ = cv2.findContours(fg_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        candidates = []
        frame_h, frame_w = frame.shape[:2]

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < self.MIN_CONTOUR_AREA:
                continue
            x, y, w, h = cv2.boundingRect(cnt)
            candidates.append((x, y, w, h, area))

        if not candidates:
            return {
                "detected": False,
                "label": "clean",
                "confidence": 0.0,
                "bbox": None,
            }

        # sort by area — biggest candidate is most likely the actual object
        candidates.sort(key=lambda c: c[4], reverse=True)

        # classify the top candidate (could do all of them but usually one is enough)
        best = candidates[0]
        bx, by, bw, bh, _ = best

        # pad the crop a little for context
        pad = 10
        x1 = max(0, bx - pad)
        y1 = max(0, by - pad)
        x2 = min(frame_w, bx + bw + pad)
        y2 = min(frame_h, by + bh + pad)

        crop = frame[y1:y2, x1:x2]
        if crop.size == 0:
            return {
                "detected": False,
                "label": "clean",
                "confidence": 0.0,
                "bbox": None,
            }

        processed = preprocess_for_cnn(crop, (96, 96))
        input_batch = np.expand_dims(processed, axis=0)

        preds = self.model.predict(input_batch, verbose=0)[0]
        class_idx = int(np.argmax(preds))
        confidence = float(preds[class_idx])
        label = LABELS[class_idx]

        # only report as "detected" if it's actually a phone or book
        is_detected = label in ("phone", "book") and confidence > 0.5

        return {
            "detected": is_detected,
            "label": label,
            "confidence": round(confidence, 4),
            "bbox": [int(bx), int(by), int(bw), int(bh)] if is_detected else None,
        }

    def update_background(self, frame: np.ndarray):
        """
        Feed a frame into the background model without doing detection.
        Call this during calibration to build up a good baseline of what
        the scene normally looks like.
        """
        self.bg_subtractor.apply(frame, learningRate=0.01)

    def save_weights(self, path: str):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.model.save_weights(path)
        print(f"[PhoneSentry] Saved weights to {path}")

    def load_weights(self, path: str):
        self.model.load_weights(path)
