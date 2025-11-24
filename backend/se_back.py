# backend/se_back.py
from flask import Flask, request, jsonify
from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch
import os
from flask_cors import CORS
import io
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("se_back")

app = Flask(__name__)

# Allow frontend origin via env var, fallback to localhost
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")
CORS(app, resources={r"/*": {"origins": FRONTEND_ORIGIN}})

# Hugging Face model repo id (your public repo)
MODEL_REPO = "priyagurrram1455/deepfake_vs_real_image_detection"

# Optional: if your repo is private set HF_TOKEN env var in Render/Vercel
HF_TOKEN = os.environ.get("HF_TOKEN", None)
use_auth_token = HF_TOKEN if HF_TOKEN else None

log.info(f"Loading model from Hugging Face repo: {MODEL_REPO} (auth token present: {'yes' if HF_TOKEN else 'no'})")

# Load processor + model from Hugging Face hub (cached automatically)
try:
    processor = ViTImageProcessor.from_pretrained(MODEL_REPO, use_auth_token=use_auth_token)
    model = ViTForImageClassification.from_pretrained(MODEL_REPO, use_auth_token=use_auth_token)
    model.eval()
    log.info("Model and processor loaded successfully.")
except Exception as e:
    log.exception("Failed to load model from Hugging Face. Make sure MODEL_REPO is correct and HF_TOKEN (if private) is set.")
    raise

@app.route("/")
def home():
    return "Flask Backend is working"

def read_image_from_file_storage(file_storage):
    image = Image.open(file_storage.stream).convert("RGB")
    return image

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Accept either multipart form-file (preferred) or JSON with base64 image.
        if "image" in request.files:
            file = request.files["image"]
            image = read_image_from_file_storage(file)
        else:
            # fallback: JSON with {"image": "<base64 string>"}
            data = request.get_json(silent=True)
            if not data or "image" not in data:
                return jsonify({"error": "No image uploaded"}), 400
            import base64
            img_bytes = base64.b64decode(data["image"])
            image = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        # Preprocess
        inputs = processor(images=image, return_tensors="pt")

        # Inference
        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits
        cls_id = int(logits.argmax(-1).item())
        label = model.config.id2label.get(cls_id, str(cls_id))
        confidence = float(torch.softmax(logits, dim=-1)[0][cls_id].item())

        return jsonify({
            "prediction": label,
            "confidence": confidence
        }), 200

    except Exception as e:
        log.exception("Prediction failed")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
