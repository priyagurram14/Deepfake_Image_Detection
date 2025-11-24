from flask import Flask, request, jsonify
from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch
import os
from flask_cors import CORS

# Initialize Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Path to your model directory
model_dir = os.path.abspath("./deepfake_vs_real_image_detection")
print("Model path:", model_dir)

# Load model
model = ViTForImageClassification.from_pretrained(
    model_dir,
    local_files_only=True
)

# Load processor
processor = ViTImageProcessor.from_pretrained(
    model_dir,
    local_files_only=True
)

print("Model & Processor loaded successfully!")

@app.route('/')
def home():
    return "Flask Backend is working"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files['image']
        image = Image.open(file.stream).convert("RGB")

        # Preprocess
        inputs = processor(images=image, return_tensors="pt")

        # Inference
        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits
        cls_id = logits.argmax(-1).item()
        label = model.config.id2label[cls_id]
        confidence = torch.softmax(logits, dim=-1)[0][cls_id].item()

        return jsonify({
            "prediction": label,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
