# backend/se_back.py
import os
import io
import base64
import requests
from flask import Flask, request, jsonify
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")
CORS(app, resources={r"/*": {"origins": FRONTEND_ORIGIN}})

# Hugging Face model (public)
HF_MODEL = "priyagurrram1455/deepfake_vs_real_image_detection"
HF_API = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
HF_API_TOKEN = os.environ.get("HF_API_TOKEN")  # optional

HEADERS = {"Authorization": f"Bearer {HF_API_TOKEN}"} if HF_API_TOKEN else {}

@app.route("/")
def home():
    return "Flask backend (HF Inference API proxy) is working"

def image_to_bytes(file_storage):
    # Normalize to PNG bytes (HF accepts raw image bytes)
    img = Image.open(file_storage.stream).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Accept multipart/form-data file upload under "image"
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded (expected form field 'image')"}), 400

        img_bytes = image_to_bytes(request.files["image"])

        # Send the image bytes directly to HF Inference API
        hf_resp = requests.post(HF_API, headers=HEADERS, data=img_bytes, timeout=60)

        if hf_resp.status_code != 200:
            return jsonify({
                "error": "Hugging Face inference failed",
                "status_code": hf_resp.status_code,
                "detail": hf_resp.text
            }), 502

        # HF typically returns a JSON array of label/score objects for image-classification:
        # e.g. [{"label":"FAKE","score":0.98}, {"label":"REAL","score":0.02}]
        data = hf_resp.json()

        # Normalize output to {"prediction": <top_label>, "confidence": <score>, "raw": <data>}
        if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
            top = max(data, key=lambda x: x.get("score", 0))
            return jsonify({
                "prediction": top.get("label"),
                "confidence": float(top.get("score", 0)),
                "raw": data
            }), 200

        # Fallback: return raw HF response
        return jsonify({"raw": data}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Request to HF API failed", "detail": str(e)}), 502
    except Exception as e:
        return jsonify({"error": "Internal server error", "detail": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
