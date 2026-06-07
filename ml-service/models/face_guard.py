"""
FaceGuard — CNN-based face detection for proctoring.

Uses skin color segmentation as a fast pre-filter, then runs candidate
regions through a small CNN to confirm whether they're actually faces.

Not as accurate as something like MTCNN or RetinaFace, but the whole point
is that we built this from scratch for the proctoring use case. It gets
fine-tuned per session during calibration so it learns the specific user's
face characteristics.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

from utils.image_processing import (
    segment_skin,
    extract_contour_regions,
    preprocess_for_cnn,
)


class FaceGuard:
    INPUT_SHAPE = (64, 64, 3)
    # confidence threshold — anything below this gets tossed
    CONF_THRESHOLD = 0.6

    def __init__(self, weights_path=None):
        self.model = self._build_model()
        if weights_path and os.path.exists(weights_path):
            self.load_weights(weights_path)
            print(f"[FaceGuard] Loaded weights from {weights_path}")
        else:
            print("[FaceGuard] Initialized with random weights (no pretrained weights found)")

    def _build_model(self):
        """
        Pretty standard small CNN — nothing fancy. Three conv blocks
        with batch norm, then a dense classifier on top.
        
        The softmax output gives us [not_face, face] probabilities.
        """
        model = keras.Sequential([
            layers.Input(shape=self.INPUT_SHAPE),

            # block 1
            layers.Conv2D(16, (3, 3), activation="relu", padding="same"),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),

            # block 2
            layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),

            # block 3 — 64 filters should be plenty for face/not-face
            layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),

            layers.Flatten(),
            layers.Dense(128, activation="relu"),
            layers.Dropout(0.5),
            layers.Dense(2, activation="softmax"),
        ])

        model.compile(
            optimizer="adam",
            loss="categorical_crossentropy",
            metrics=["accuracy"],
        )
        return model

    def detect(self, frame: np.ndarray) -> dict:
        """
        Full detection pipeline:
        1. Skin segmentation to find candidate regions
        2. Run each candidate through the CNN
        3. Keep only high-confidence face detections
        
        Returns face count, average confidence, and bounding boxes.
        """
        mask = segment_skin(frame)
        candidates = extract_contour_regions(mask, min_area=2000)

        if not candidates:
            return {"face_count": 0, "confidence": 0.0, "bboxes": []}

        # crop and preprocess all candidate regions
        batch = []
        valid_bboxes = []
        frame_h, frame_w = frame.shape[:2]

        for (x, y, w, h) in candidates:
            # make sure we don't go out of bounds
            x1 = max(0, x)
            y1 = max(0, y)
            x2 = min(frame_w, x + w)
            y2 = min(frame_h, y + h)

            crop = frame[y1:y2, x1:x2]
            if crop.size == 0:
                continue

            processed = preprocess_for_cnn(crop, (64, 64))
            batch.append(processed)
            valid_bboxes.append([x, y, w, h])

        if not batch:
            return {"face_count": 0, "confidence": 0.0, "bboxes": []}

        batch_array = np.array(batch)
        predictions = self.model.predict(batch_array, verbose=0)

        # predictions[:, 1] is the "face" probability
        face_bboxes = []
        confidences = []

        for i, pred in enumerate(predictions):
            face_prob = float(pred[1])
            if face_prob > self.CONF_THRESHOLD:
                face_bboxes.append(valid_bboxes[i])
                confidences.append(face_prob)

        avg_conf = float(np.mean(confidences)) if confidences else 0.0

        return {
            "face_count": len(face_bboxes),
            "confidence": round(avg_conf, 4),
            "bboxes": face_bboxes,
        }

    def calibrate(self, frames: list, epochs: int = 3):
        """
        Quick fine-tuning on calibration frames from the actual user.
        
        We extract face regions as positive samples and grab random
        non-skin patches as negatives. Then retrain for a few epochs
        so the model adapts to this specific person + webcam + lighting.
        
        Returns the number of samples used for training.
        """
        positive_samples = []
        negative_samples = []

        for frame in frames:
            mask = segment_skin(frame)
            regions = extract_contour_regions(mask, min_area=2000)
            frame_h, frame_w = frame.shape[:2]

            # positive: skin-colored regions (assume they're faces during calibration)
            for (x, y, w, h) in regions[:3]:  # cap at 3 per frame
                x2 = min(frame_w, x + w)
                y2 = min(frame_h, y + h)
                crop = frame[max(0, y):y2, max(0, x):x2]
                if crop.size == 0:
                    continue
                processed = preprocess_for_cnn(crop, (64, 64))
                positive_samples.append(processed)

            # negative: random patches from areas that aren't skin
            # grab a couple of random crops from the frame
            for _ in range(2):
                rx = np.random.randint(0, max(1, frame_w - 64))
                ry = np.random.randint(0, max(1, frame_h - 64))
                patch = frame[ry:ry + 64, rx:rx + 64]

                # check if this patch overlaps with any detected skin region
                patch_mask = mask[ry:ry + 64, rx:rx + 64]
                skin_ratio = np.sum(patch_mask > 0) / max(1, patch_mask.size)

                if skin_ratio < 0.3:  # mostly non-skin, good negative sample
                    processed = preprocess_for_cnn(patch, (64, 64))
                    negative_samples.append(processed)

        if not positive_samples:
            print("[FaceGuard] calibrate: no face regions found in the provided frames")
            return 0

        # balance the dataset — use equal numbers of pos and neg
        n_samples = min(len(positive_samples), max(len(negative_samples), 1))
        positive_samples = positive_samples[:n_samples]
        if negative_samples:
            negative_samples = negative_samples[:n_samples]
        else:
            # if we somehow got no negatives, just make some noise images
            for _ in range(n_samples):
                noise = np.random.rand(64, 64, 3).astype(np.float32)
                negative_samples.append(noise)

        X = np.array(positive_samples + negative_samples)
        # labels: [not_face, face] one-hot
        y_pos = np.array([[0, 1]] * len(positive_samples))
        y_neg = np.array([[1, 0]] * len(negative_samples))
        y = np.vstack([y_pos, y_neg]).astype(np.float32)

        # shuffle
        indices = np.random.permutation(len(X))
        X = X[indices]
        y = y[indices]

        # use a lower learning rate for fine-tuning
        self.model.optimizer.learning_rate.assign(0.0001)

        self.model.fit(X, y, epochs=epochs, batch_size=8, verbose=0)
        total = len(positive_samples) + len(negative_samples)
        print(f"[FaceGuard] Calibrated on {total} samples ({len(positive_samples)} pos, {len(negative_samples)} neg)")
        return total

    def save_weights(self, path: str):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.model.save_weights(path)
        print(f"[FaceGuard] Weights saved to {path}")

    def load_weights(self, path: str):
        self.model.load_weights(path)
