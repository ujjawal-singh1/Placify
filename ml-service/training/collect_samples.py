"""
Webcam-based sample collection tool for training the proctoring models.

Opens a live webcam feed and lets you capture labeled samples with keyboard
shortcuts. Images are saved to organized directories that the training
scripts can directly consume.

Usage:
    python training/collect_samples.py

Controls:
    f = capture as "face"
    n = capture as "not_face"
    p = capture as "phone"
    b = capture as "book"
    c = capture as "clean" (nothing suspicious)
    q = quit
"""

import os
import sys
import time
import cv2


# where we save the collected samples
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# class directories
CLASSES = {
    ord("f"): "face",
    ord("n"): "not_face",
    ord("p"): "phone",
    ord("b"): "book",
    ord("c"): "clean",
}


def ensure_dirs():
    """Create the data directories if they don't exist yet."""
    for class_name in CLASSES.values():
        class_dir = os.path.join(DATA_DIR, class_name)
        os.makedirs(class_dir, exist_ok=True)


def count_samples() -> dict:
    """Count how many samples we have in each class directory."""
    counts = {}
    for class_name in CLASSES.values():
        class_dir = os.path.join(DATA_DIR, class_name)
        if os.path.exists(class_dir):
            counts[class_name] = len([
                f for f in os.listdir(class_dir)
                if f.endswith((".jpg", ".png"))
            ])
        else:
            counts[class_name] = 0
    return counts


def draw_overlay(frame, counts):
    """Draw the sample counts and control hints on the frame."""
    h, w = frame.shape[:2]

    # semi-transparent background for the text
    overlay = frame.copy()
    cv2.rectangle(overlay, (5, 5), (280, 180), (30, 30, 30), -1)
    cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)

    y_offset = 28
    cv2.putText(frame, "Sample Collector", (15, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 200), 1)
    y_offset += 25

    for class_name, count in counts.items():
        label = f"{class_name}: {count}"
        cv2.putText(frame, label, (15, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        y_offset += 22

    # controls reminder at the bottom
    controls = "f=face n=not_face p=phone b=book c=clean q=quit"
    cv2.putText(frame, controls, (10, h - 15),
                cv2.FONT_HERSHEY_SIMPLEX, 0.4, (180, 180, 180), 1)

    return frame


def main():
    ensure_dirs()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("ERROR: Could not open webcam. Make sure it's connected and not in use.")
        sys.exit(1)

    print("Webcam opened. Use keyboard shortcuts to capture samples.")
    print("  f=face, n=not_face, p=phone, b=book, c=clean, q=quit")

    counts = count_samples()
    last_save_msg = ""
    msg_timer = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame, exiting...")
            break

        display = frame.copy()
        display = draw_overlay(display, counts)

        # show the "saved!" message for a moment after capturing
        if last_save_msg and time.time() - msg_timer < 1.5:
            cv2.putText(display, last_save_msg, (15, display.shape[0] - 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        cv2.imshow("Sample Collector", display)

        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            print("Quitting...")
            break

        if key in CLASSES:
            class_name = CLASSES[key]
            timestamp = int(time.time() * 1000)
            filename = f"sample_{timestamp}.jpg"
            save_path = os.path.join(DATA_DIR, class_name, filename)

            cv2.imwrite(save_path, frame)
            counts[class_name] = counts.get(class_name, 0) + 1

            last_save_msg = f"Saved: {class_name}/{filename}"
            msg_timer = time.time()
            print(f"  [{class_name}] saved -> {save_path}")

    cap.release()
    cv2.destroyAllWindows()

    print("\nFinal counts:")
    for name, count in count_samples().items():
        print(f"  {name}: {count}")


if __name__ == "__main__":
    main()
