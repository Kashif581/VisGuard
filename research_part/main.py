
# uvicorn main:app --reload --host 0.0.0.0 --port 8000
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from keyframe_extractor import run_hybrid_pipeline
from captions_generator import get_image_caption
from vector_embeddings import (dense_model, get_hybrid_embeddings, get_sparse_batch, get_tfidf_vectorizer,search_with_prf)
from store_embeddings import VideoDB

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

db = VideoDB()

# store TFIDF per video (IMPORTANT)
video_vectorizers = {}

# =========================
# UPLOAD VIDEO PIPELINE
# =========================
@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    path = f"videos/{file.filename}"
    os.makedirs("videos", exist_ok=True)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extracting Keyframes
    output = run_hybrid_pipeline(path)
    scenes = output["scenes"]
    frames_buffer = output["frames_buffer"]

    captions = []
    frame_indices = []
    timestamps = []
    dense_vecs = []
    tfidf_captions = []

    for scene in scenes:
        frame_idx = scene["frame"]

        frame = frames_buffer[frame_idx]
        # Generating Captions
        caption = get_image_caption(frame)

        captions.append(caption)
        frame_indices.append(frame_idx)
        # timestamps.append(float(scene["timestamp"]))
        timestamp_str = scene["timestamp"]

        h, m, s = timestamp_str.split(":")
        seconds = int(h) * 3600 + int(m) * 60 + float(s)

        timestamps.append(seconds)

        dense_vecs.append(get_hybrid_embeddings(caption, dense_model))
        tfidf_captions.append(caption)

    # fit TF-IDF for this video
    vectorizer = get_tfidf_vectorizer(tfidf_captions)
    video_vectorizers[file.filename] = vectorizer

    sparse_vecs = get_sparse_batch(vectorizer, tfidf_captions)
    
    # storing embeddings
    db.insert_batch(
        video_id=file.filename,
        frame_indices=frame_indices,
        timestamps=timestamps,
        captions=captions,
        dense_vecs=dense_vecs,
        sparse_vecs=sparse_vecs
    )
    print("Finished storing embeddings.")
    print(len(scenes))

    return {"status": "processed", "scenes": len(scenes)}




@app.post("/search")
async def search(data: dict):
    query = data["query"]

    all_results = []

    # search inside every uploaded video's vectorizer
    for video_id, vectorizer in video_vectorizers.items():

        results = search_with_prf(
            db=db,
            query_text=query,
            tfidf_vectorizer=vectorizer,
            dense_model=dense_model,
            video_id=video_id,
            top_k=3
        )

        for hit in results:
            all_results.append({
                "video_id": hit.entity.get("video_id"),
                "timestamp": hit.entity.get("timestamp"),
                "caption": hit.entity.get("caption"),
                "frame_index": hit.entity.get("frame_index"),
                "score": hit.score
            })

    # sort best matches first
    all_results = sorted(
        all_results,
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "results": all_results[:5]
    }