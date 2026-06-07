"""
Low-level image processing utilities for the detection models.

Handles skin segmentation, contour extraction, edge detection, and
feature extraction. These are the building blocks that FaceGuard and
PhoneSentry rely on before feeding data into their CNNs.
"""

import cv2
import numpy as np


def segment_skin(frame: np.ndarray) -> np.ndarray:
    """
    Simple HSV-based skin color segmentation.
    
    Not perfect by any means — struggles with very dark or very light skin,
    and lighting conditions matter a lot. But it's fast and works well enough
    as a first-pass filter to find candidate face regions.
    
    Returns a binary mask where white = probable skin pixels.
    """
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # these ranges cover most skin tones under decent lighting
    lower_bound = np.array([0, 40, 80], dtype=np.uint8)
    upper_bound = np.array([25, 170, 255], dtype=np.uint8)

    mask = cv2.inRange(hsv, lower_bound, upper_bound)

    # close first to fill small gaps in the skin region,
    # then open to remove noise specks
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    kernel_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))

    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel_open)

    return mask


def extract_contour_regions(mask: np.ndarray, min_area: int = 2000) -> list:
    """
    Find contours in a binary mask and return bounding boxes for regions
    that are large enough to actually be something meaningful.
    
    Filters out tiny blobs that are probably just noise. Returns a list
    of (x, y, w, h) tuples sorted by area descending.
    """
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    regions = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area:
            continue
        x, y, w, h = cv2.boundingRect(cnt)
        regions.append((x, y, w, h))

    # sort by area (largest first) — the biggest region is most likely the face
    regions.sort(key=lambda r: r[2] * r[3], reverse=True)
    return regions


def sobel_edges(region: np.ndarray) -> np.ndarray:
    """
    Compute edge magnitude using Sobel gradients.
    Useful for detecting rectangular objects like phones/books
    which tend to have strong straight edges.
    """
    if len(region.shape) == 3:
        gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
    else:
        gray = region

    grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)

    magnitude = np.sqrt(grad_x ** 2 + grad_y ** 2)
    # normalize to 0-255 range
    magnitude = np.clip(magnitude / magnitude.max() * 255, 0, 255).astype(np.uint8) if magnitude.max() > 0 else magnitude.astype(np.uint8)

    return magnitude


def color_histogram(region: np.ndarray, bins: int = 16) -> np.ndarray:
    """
    Compute a normalized color histogram across all 3 BGR channels.
    Returns a flattened feature vector of length bins*3.
    
    This gives us a compact color signature for a region, which can
    help distinguish skin-colored regions from other objects.
    """
    features = []
    for channel in range(3):
        hist = cv2.calcHist([region], [channel], None, [bins], [0, 256])
        hist = hist.flatten()
        # L1 normalize so we're comparing distributions, not absolute counts
        total = hist.sum()
        if total > 0:
            hist = hist / total
        features.append(hist)

    return np.concatenate(features)


def preprocess_for_cnn(region: np.ndarray, target_size: tuple) -> np.ndarray:
    """
    Resize a cropped region and normalize pixel values for CNN input.
    
    target_size should be (width, height) — e.g. (64, 64) for FaceGuard
    or (96, 96) for PhoneSentry.
    
    Returns a float32 array with values in [0, 1].
    """
    resized = cv2.resize(region, target_size, interpolation=cv2.INTER_LINEAR)
    normalized = resized.astype(np.float32) / 255.0
    return normalized
