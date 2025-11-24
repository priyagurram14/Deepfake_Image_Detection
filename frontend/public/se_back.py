
from flask import Flask, request, jsonify, render_template
from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch
import os

# Initialize the Flask app
app = Flask(__name__)

# Define the model and processor directory
model_dir = "./model/deepfake_vs_real_image_detection"  # Adjust this to your actual model path

# Load the model using safetensors
model = ViTForImageClassification.from_pretrained(
    model_dir,
    local_files_only=True,
    trust_remote_code=True
)

# Load the processor
processor = ViTImageProcessor.from_pretrained(model_dir)

print("Model and Processor loaded successfully!")

# Route for the UI
@app.route('/')
def home():
    return render_template('index.html')  # This is your UI, assumed to be in 'templates/index.html'

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file found in the request"}), 400

        file = request.files['image']
        image = Image.open(file.stream).convert("RGB")

        # Preprocess the image
        inputs = processor(images=image, return_tensors="pt")

        # Perform inference
        with torch.no_grad():
            outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_id = logits.argmax(-1).item()

        # Map predicted class ID to label
        predicted_label = model.config.id2label[predicted_class_id]
        confidence = torch.softmax(logits, dim=-1)[0][predicted_class_id].item()

        # Return the prediction as JSON
        return jsonify({
            "prediction": predicted_label,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
