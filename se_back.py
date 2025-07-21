
from flask import Flask, request, jsonify, render_template
from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch
import os
from flask_cors import CORS



# Initialize the Flask app 
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])



model_dir = os.path.abspath("./deepfake_vs_real_image_detection")
print(model_dir)

# Define the model and processor directory
#  # Adjust this to your actual model path

# Load the model using safetensors
model = ViTForImageClassification.from_pretrained(
    model_dir,
    local_files_only=True,
)

# Load the processor
processor = ViTImageProcessor.from_pretrained(
    model_dir,
    local_files_only=True
)

print("Model and Processor loaded successfully!")

# Route for the UI
@app.route('/')
def home():
    return "Flask Backend is working"  # This is your UI, assumed to be in 'templates/index.html'

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

        
        predicted_label = model.config.id2label[predicted_class_id]
        confidence = torch.softmax(logits, dim=-1)[0][predicted_class_id].item()
        print(predicted_label)

        return jsonify({
            "prediction": predicted_label,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

#cd C:\Users\HP\Downloads\deepfake_project\deepfake
#venv\Scripts\activate
#python se_back.py
