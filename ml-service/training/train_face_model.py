"""
Training script for the FaceGuard face detection model.

Loads face/not_face images from training/data/, applies data augmentation,
trains the CNN, and saves the weights.

Usage:
    python training/train_face_model.py

Make sure you've collected enough samples first using collect_samples.py.
Aim for at least 100-200 images per class for decent results.
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


# paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")
WEIGHTS_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "weights")
WEIGHTS_PATH = os.path.join(WEIGHTS_DIR, "face_guard.weights.h5")

IMG_SIZE = (64, 64)
BATCH_SIZE = 16
EPOCHS = 30
VAL_SPLIT = 0.2


def load_images(class_dir: str, label: int) -> tuple:
    """Load all images from a directory and assign a label."""
    images = []
    labels = []

    patterns = [os.path.join(class_dir, f"*.{ext}") for ext in ("jpg", "png", "jpeg")]
    file_paths = []
    for p in patterns:
        file_paths.extend(glob.glob(p))

    for fpath in file_paths:
        img = cv2.imread(fpath)
        if img is None:
            print(f"  Warning: couldn't read {fpath}, skipping")
            continue
        img = cv2.resize(img, IMG_SIZE)
        img = img.astype(np.float32) / 255.0
        images.append(img)
        labels.append(label)

    return images, labels


def augment_image(img: np.ndarray) -> np.ndarray:
    """
    Apply random augmentations to increase dataset variety.
    Nothing too aggressive — just flips, brightness, and small rotations.
    """
    augmented = img.copy()

    # random horizontal flip
    if random.random() > 0.5:
        augmented = np.fliplr(augmented)

    # random brightness adjustment
    brightness = random.uniform(0.75, 1.25)
    augmented = np.clip(augmented * brightness, 0.0, 1.0)

    # small random rotation (up to 15 degrees)
    if random.random() > 0.4:
        angle = random.uniform(-15, 15)
        h, w = augmented.shape[:2]
        center = (w // 2, h // 2)
        mat = cv2.getRotationMatrix2D(center, angle, 1.0)
        # need to convert back to uint8 for warpAffine, then normalize again
        temp = (augmented * 255).astype(np.uint8)
        temp = cv2.warpAffine(temp, mat, (w, h), borderMode=cv2.BORDER_REFLECT)
        augmented = temp.astype(np.float32) / 255.0

    return augmented


def build_model():
    """Same architecture as FaceGuard._build_model() so weights are compatible."""
    model = keras.Sequential([
        layers.Input(shape=(64, 64, 3)),

        layers.Conv2D(16, (3, 3), activation="relu", padding="same"),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),

        layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),

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


def main():
    face_dir = os.path.join(DATA_DIR, "face")
    notface_dir = os.path.join(DATA_DIR, "not_face")

    # check that data directories exist and have images
    for d, name in [(face_dir, "face"), (notface_dir, "not_face")]:
        if not os.path.exists(d):
            print(f"ERROR: {d} does not exist. Run collect_samples.py first.")
            sys.exit(1)

    print("Loading images...")
    face_imgs, face_labels = load_images(face_dir, label=1)
    notface_imgs, notface_labels = load_images(notface_dir, label=0)

    print(f"  Face samples: {len(face_imgs)}")
    print(f"  Not-face samples: {len(notface_imgs)}")

    if len(face_imgs) == 0 or len(notface_imgs) == 0:
        print("ERROR: Need at least some samples in both classes!")
        sys.exit(1)

    # augment to roughly balance and increase dataset size
    all_images = face_imgs + notface_imgs
    all_labels = face_labels + notface_labels

    augmented_imgs = []
    augmented_labels = []
    for img, lbl in zip(all_images, all_labels):
        augmented_imgs.append(img)
        augmented_labels.append(lbl)
        # add 2 augmented copies of each image
        for _ in range(2):
            augmented_imgs.append(augment_image(img))
            augmented_labels.append(lbl)

    X = np.array(augmented_imgs, dtype=np.float32)
    # one-hot encode: [not_face, face]
    y = keras.utils.to_categorical(augmented_labels, num_classes=2)

    print(f"Total samples after augmentation: {len(X)}")

    # shuffle
    indices = np.random.permutation(len(X))
    X = X[indices]
    y = y[indices]

    # train/val split
    split_idx = int(len(X) * (1 - VAL_SPLIT))
    X_train, X_val = X[:split_idx], X[split_idx:]
    y_train, y_val = y[:split_idx], y[split_idx:]

    print(f"Training on {len(X_train)} samples, validating on {len(X_val)} samples")
    print(f"Training for {EPOCHS} epochs...\n")

    model = build_model()
    model.summary()

    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        verbose=1,
    )

    # save weights
    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    model.save_weights(WEIGHTS_PATH)
    print(f"\nWeights saved to {WEIGHTS_PATH}")

    # print final metrics
    final_train_acc = history.history["accuracy"][-1]
    final_val_acc = history.history["val_accuracy"][-1]
    final_train_loss = history.history["loss"][-1]
    final_val_loss = history.history["val_loss"][-1]

    print(f"\n{'='*50}")
    print(f"Training Results:")
    print(f"  Train Accuracy: {final_train_acc:.4f}")
    print(f"  Val Accuracy:   {final_val_acc:.4f}")
    print(f"  Train Loss:     {final_train_loss:.4f}")
    print(f"  Val Loss:       {final_val_loss:.4f}")
    print(f"{'='*50}")

    # try to plot curves if matplotlib is available
    try:
        import matplotlib
        matplotlib.use("Agg")  # non-interactive backend
        import matplotlib.pyplot as plt

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

        ax1.plot(history.history["accuracy"], label="train")
        ax1.plot(history.history["val_accuracy"], label="val")
        ax1.set_title("Accuracy")
        ax1.set_xlabel("Epoch")
        ax1.legend()

        ax2.plot(history.history["loss"], label="train")
        ax2.plot(history.history["val_loss"], label="val")
        ax2.set_title("Loss")
        ax2.set_xlabel("Epoch")
        ax2.legend()

        plot_path = os.path.join(WEIGHTS_DIR, "face_guard_training.png")
        plt.savefig(plot_path, dpi=100, bbox_inches="tight")
        print(f"Training curves saved to {plot_path}")
    except ImportError:
        print("(matplotlib not installed, skipping plot generation)")


if __name__ == "__main__":
    main()
