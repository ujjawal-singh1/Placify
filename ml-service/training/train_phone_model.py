"""
Training script for the PhoneSentry object detection model.

Loads phone/book/clean images from training/data/, trains the CNN,
and saves weights. Structure mirrors train_face_model.py but handles
3 classes instead of 2.

Usage:
    python training/train_phone_model.py
"""

import os
import sys
import glob
import random
import numpy as np
import cv2
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")
WEIGHTS_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "weights")
WEIGHTS_PATH = os.path.join(WEIGHTS_DIR, "phone_sentry.weights.h5")

IMG_SIZE = (96, 96)
BATCH_SIZE = 16
EPOCHS = 30
VAL_SPLIT = 0.2

CLASS_MAP = {"phone": 0, "book": 1, "clean": 2}


def load_images(class_dir: str, label: int) -> tuple:
    images = []
    labels = []

    patterns = [os.path.join(class_dir, f"*.{ext}") for ext in ("jpg", "png", "jpeg")]
    file_paths = []
    for pat in patterns:
        file_paths.extend(glob.glob(pat))

    for fpath in file_paths:
        img = cv2.imread(fpath)
        if img is None:
            continue
        img = cv2.resize(img, IMG_SIZE)
        img = img.astype(np.float32) / 255.0
        images.append(img)
        labels.append(label)

    return images, labels


def augment_image(img: np.ndarray) -> np.ndarray:
    """Random augmentations — flip, brightness, rotation."""
    result = img.copy()

    if random.random() > 0.5:
        result = np.fliplr(result)

    brightness = random.uniform(0.8, 1.2)
    result = np.clip(result * brightness, 0.0, 1.0)

    if random.random() > 0.5:
        angle = random.uniform(-10, 10)
        h, w = result.shape[:2]
        center = (w // 2, h // 2)
        mat = cv2.getRotationMatrix2D(center, angle, 1.0)
        temp = (result * 255).astype(np.uint8)
        temp = cv2.warpAffine(temp, mat, (w, h), borderMode=cv2.BORDER_REFLECT)
        result = temp.astype(np.float32) / 255.0

    return result


def build_model():
    """Same architecture as PhoneSentry._build_model()."""
    model = keras.Sequential([
        layers.Input(shape=(96, 96, 3)),

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


def main():
    # verify data dirs exist
    all_images = []
    all_labels = []

    for class_name, label_idx in CLASS_MAP.items():
        class_dir = os.path.join(DATA_DIR, class_name)
        if not os.path.exists(class_dir):
            print(f"WARNING: {class_dir} not found, skipping '{class_name}'")
            continue

        imgs, lbls = load_images(class_dir, label_idx)
        print(f"  {class_name}: {len(imgs)} samples")
        all_images.extend(imgs)
        all_labels.extend(lbls)

    if len(all_images) < 10:
        print("ERROR: Not enough training data. Collect more samples first.")
        sys.exit(1)

    # augment everything
    augmented_imgs = []
    augmented_labels = []
    for img, lbl in zip(all_images, all_labels):
        augmented_imgs.append(img)
        augmented_labels.append(lbl)
        for _ in range(2):
            augmented_imgs.append(augment_image(img))
            augmented_labels.append(lbl)

    X = np.array(augmented_imgs, dtype=np.float32)
    y = keras.utils.to_categorical(augmented_labels, num_classes=3)

    print(f"\nTotal samples after augmentation: {len(X)}")

    # shuffle
    perm = np.random.permutation(len(X))
    X = X[perm]
    y = y[perm]

    # split
    split = int(len(X) * (1 - VAL_SPLIT))
    X_train, X_val = X[:split], X[split:]
    y_train, y_val = y[:split], y[split:]

    print(f"Train: {len(X_train)}, Val: {len(X_val)}")
    print(f"Starting training for {EPOCHS} epochs...\n")

    model = build_model()
    model.summary()

    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        verbose=1,
    )

    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    model.save_weights(WEIGHTS_PATH)
    print(f"\nWeights saved to {WEIGHTS_PATH}")

    # results summary
    train_acc = history.history["accuracy"][-1]
    val_acc = history.history["val_accuracy"][-1]
    train_loss = history.history["loss"][-1]
    val_loss = history.history["val_loss"][-1]

    print(f"\n{'='*50}")
    print("Training Results:")
    print(f"  Train Accuracy: {train_acc:.4f}")
    print(f"  Val Accuracy:   {val_acc:.4f}")
    print(f"  Train Loss:     {train_loss:.4f}")
    print(f"  Val Loss:       {val_loss:.4f}")
    print(f"{'='*50}")

    # optional: save training curves
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

        ax1.plot(history.history["accuracy"], label="train")
        ax1.plot(history.history["val_accuracy"], label="val")
        ax1.set_title("PhoneSentry Accuracy")
        ax1.set_xlabel("Epoch")
        ax1.legend()

        ax2.plot(history.history["loss"], label="train")
        ax2.plot(history.history["val_loss"], label="val")
        ax2.set_title("PhoneSentry Loss")
        ax2.set_xlabel("Epoch")
        ax2.legend()

        plot_path = os.path.join(WEIGHTS_DIR, "phone_sentry_training.png")
        plt.savefig(plot_path, dpi=100, bbox_inches="tight")
        print(f"Training curves saved to {plot_path}")
    except ImportError:
        print("(matplotlib not available, skipping training curves)")


if __name__ == "__main__":
    main()
