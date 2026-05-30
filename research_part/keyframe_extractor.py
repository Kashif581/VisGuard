import cv2
import numpy as np
import datetime


from PIL import Image
from sentence_transformers import SentenceTransformer


# ===============================
# LOAD CLIP MODEL
# ===============================

def load_clip_model():
    return SentenceTransformer("clip-ViT-B-32")


clip_model = load_clip_model()


# ===============================
# TIME HELPERS
# ===============================
def get_seconds(time_str):
    """
    Converts:
    00:00:42.159 -> 42.159
    """
    try:
        h, m, s = time_str.split(":")

        return (
            int(h) * 3600
            + int(m) * 60
            + float(s)
        )

    except Exception:
        return 0.0


def format_timestamp(frame_index, fps):
    total_seconds = frame_index / fps

    return str(
        datetime.timedelta(
            seconds=round(total_seconds, 2)
        )
    )


# ===============================
# DYNAMIC HISTOGRAM THRESHOLD
# ===============================
def get_policy_thresholds(duration_sec):

    if duration_sec < 120:
        return 0.25

    elif duration_sec < 1800:
        return 0.30

    elif duration_sec < 7200:
        return 0.60

    elif duration_sec < 10800:
        return 0.35

    else:
        return 0.40


# ===============================
# BLACK FRAME FILTER
# ===============================
def is_frame_black(frame, threshold=2.0):
    return cv2.mean(frame)[0] < threshold


# ===============================
# MAIN HYBRID PIPELINE
# ===============================
def run_hybrid_pipeline(video_path):

    cap = cv2.VideoCapture(video_path)

    fps = cap.get(cv2.CAP_PROP_FPS)

    total_frames = int(
        cap.get(cv2.CAP_PROP_FRAME_COUNT)
    )

    duration_sec = total_frames / fps

    # ===============================
    # DOWNSAMPLE VIDEO TO 2 FPS
    # ===============================
    sample_interval = max(
1,
        int(fps / 2)
    )

    # ===============================
    # HISTOGRAM THRESHOLD
    # ===============================
    hist_t = get_policy_thresholds(
        duration_sec
    )

    prev_hist = None

    scene_boundaries = [0]

    count = 0

    # ===============================
    # STAGE 1:
    # HISTOGRAM SCENE DETECTION
    # ===============================
    frames_buffer = {}

    while cap.isOpened():

        ret, frame = cap.read()

        if not ret:
            break

        # SAMPLE EVERY NTH FRAME
        if count % sample_interval == 0:

            # SKIP BLACK FRAMES
            if is_frame_black(frame):
                count += 1
                continue

            # STORE FRAME
            frames_buffer[count] = frame

            # HSV HISTOGRAM
            hsv = cv2.cvtColor(
                frame,
                cv2.COLOR_BGR2HSV
            )

            hist = cv2.calcHist(
                [hsv],
                [0, 1, 2],
                None,
                [8, 8, 8],
                [0, 180, 0, 256, 0, 256]
            )

            hist = cv2.normalize(
                hist,
                hist
            ).flatten()

            # HISTOGRAM DIFFERENCE
            if prev_hist is not None:

                dist = cv2.compareHist(
                    prev_hist,
                    hist,
                    cv2.HISTCMP_BHATTACHARYYA
                )

                # NEW SCENE
                if dist > hist_t:
                    scene_boundaries.append(count)

            prev_hist = hist

        count += 1

    cap.release()

    scene_boundaries.append(total_frames)

    print(
        "Buffered frames:",
        len(frames_buffer)
    )

    # ===============================
    # STAGE 2:
    # BUILD SCENE RANGES
    # ===============================
    scenes = [

        (
            scene_boundaries[i],
            scene_boundaries[i + 1]
        )

        for i in range(
            len(scene_boundaries) - 1
        )
    ]

    # ===============================
    # STAGE 3:
    # CLIP KEYFRAME EXTRACTION
    # ===============================
    results = []

    for scene_id, (start, end) in enumerate(scenes):

        images = []

        frames = []

        indices = []

        # ===============================
        # PROCESS FRAMES INSIDE SCENE
        # ===============================
        for f in range(start, end,sample_interval):
            if f not in frames_buffer:
                continue

            frame = frames_buffer[f]

            img = Image.fromarray(
                cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
            )

            frames.append(frame)

            indices.append(f)

            images.append(img)

        # EMPTY SCENE
        if len(images) == 0:
            continue

        # ===============================
        # CLIP EMBEDDINGS
        # ===============================
        embeddings = clip_model.encode(
            images,
            batch_size=8,
            show_progress_bar=True
        )

        embeddings = np.array(embeddings)

        # ===============================
        # CENTROID FRAME
        # ===============================
        centroid = np.mean(
            embeddings,
            axis=0
        )

        dists = np.linalg.norm(embeddings - centroid, axis=1)

        best_idx = np.argmin(dists)

        best_frame_index = indices[best_idx]

        # ===============================
        # SAVE RESULT
        # ===============================
        results.append({

            "scene": scene_id,

            "frame": best_frame_index,

            "timestamp": format_timestamp(
                best_frame_index,
                fps
            )

        })

    # ===============================
    # RETURN PIPELINE OUTPUT
    # ===============================
    return {

        "scenes": results,

        "frames_buffer": frames_buffer

    }