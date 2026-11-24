
import base64
import cv2
import numpy as np

from pathlib import Path
from app.services.model_service import (
    model_service,
    MODEL_CONFIG,
)


def run_inference(modality: str, image_path: str):
    if modality not in MODEL_CONFIG:
        raise ValueError("Invalid analysis modality")

    path = Path(image_path)

    if not path.exists():
        raise FileNotFoundError("Uploaded scan not found")

    image = cv2.imread(str(path))

    if image is None:
        raise ValueError("Unable to read uploaded scan")

    model = model_service.get_model(modality)
    confidence_threshold = MODEL_CONFIG[modality]["conf"]

    with model_service.lock:
        results = model.predict(
            source=image,
            conf=confidence_threshold,
            device="cpu",
            verbose=False,
        )

    result = results[0]

    detections = []

    for box in result.boxes:
        class_id = int(box.cls.item())
        confidence = float(box.conf.item())

        coordinates = box.xyxy[0].tolist()

        detections.append({
            "class_id": class_id,
            "class_name": model.names[class_id],
            "confidence": round(confidence, 4),
            "confidence_percent": round(confidence * 100, 2),
            "bounding_box": {
                "x1": round(coordinates[0], 2),
                "y1": round(coordinates[1], 2),
                "x2": round(coordinates[2], 2),
                "y2": round(coordinates[3], 2),
            },
        })

    annotated = result.plot()

    success, encoded_image = cv2.imencode(
        ".jpg",
        annotated,
        [cv2.IMWRITE_JPEG_QUALITY, 90],
    )

    if not success:
        raise RuntimeError("Could not generate annotated image")

    image_base64 = base64.b64encode(
        encoded_image.tobytes()
    ).decode("utf-8")

    return {
        "modality": modality,
        "total_detections": len(detections),
        "detections": detections,
        "annotated_image": f"data:image/jpeg;base64,{image_base64}",
        "status": "completed",
        "message": (
            "AI detections generated."
            if detections
            else "No detections above the configured confidence threshold."
        ),
        "disclaimer": (
            "Research prototype only. AI findings are not "
            "confirmed medical diagnoses."
        ),
    }
