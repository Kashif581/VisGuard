import cv2
import base64
from ollama import Client

def get_ollama_client():
    """Initializes the Ollama client."""
    # Replace with your actual Ollama host if different
    return Client(
        host="https://ollama.com",
        headers={
            "Authorization": ""
        }
    )

def get_image_caption(frame_np):
    """
    Generates a dense caption using Gemma 3:27b-cloud.
    Accepts a numpy array (RGB) from the video pipeline.
    """
    client = get_ollama_client()
    
    # 1. Convert Numpy (RGB) to BGR for OpenCV encoding
    # (Only needed if your input is RGB, which it is in your current app.py loop)
    bgr_frame = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)
    
    # 2. Encode image to memory buffer as JPEG
    _, buffer = cv2.imencode('.jpg', bgr_frame)
    
    # 3. Convert buffer to Base64 string
    img_base64 = base64.b64encode(buffer).decode('utf-8')

    prompt = """You are a video indexing assistant. Your task is to generate a single, rich, descriptive caption for a video keyframe that captures everything a person would need to understand the frame without seeing it — including visual content, any text shown, and contextual meaning.

                Analyze this keyframe and write ONE caption that integrates all of the following as applicable:

                1. SCENE & SUBJECTS: Who or what is in the frame, what are they doing, and where
                2. ON-SCREEN TEXT: Transcribe any visible text (slide titles, subtitles, labels, headings, UI elements, watermarks) — weave it into the description naturally, do not list it separately
                3. CONTEXT & CONTENT: If it is a lecture slide, name the topic or concept shown. If it is a diagram or chart, describe what it represents. If it is a product demo, describe what is being shown.
                4. EMOTION & EXPRESSION: If a person's emotion or reaction is clearly visible and contextually meaningful (e.g., a speaker laughing, an audience applauding, someone looking confused at a board), include it — skip it if faces are neutral or unclear
                5. VISUAL STRUCTURE: If relevant, note layout cues like "split-screen", "bullet list", "code block on the right", "title card"

                Strict rules:
                - Write in present tense
                - One paragraph, 2–4 sentences, 40–80 words
                - Be factual and specific — avoid vague phrases like "the image shows" or "a scene of"
                - Do NOT begin with "The image shows", "This frame depicts", or "A screenshot of"
                - Do NOT use emotional language for inanimate scenes
                - Return only the caption, nothing else.

                """

    try:
        response = client.chat(
            model="gemma3:27b-cloud",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                    "images": [img_base64]
                }
            ]
        )
        caption = response["message"]["content"].strip()
        print(f"Gemma Caption: {caption}")
        return caption
    
    except Exception as e:
        # st.error(f"Ollama API Error: {e}")
        return "Caption generation failed."