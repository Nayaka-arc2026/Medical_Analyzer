
from pathlib import Path
from ultralytics import YOLO
from PIL import Image
import sys

ROOT = Path(__file__).resolve().parents[1]

MODELS = {
    "brain": ROOT / "brain_model.pt",
    "fracture": ROOT / "fracture_model.pt",
    "kidney": ROOT / "kidney_model.pt",
}

SAMPLES = {
    "brain": ROOT / "samples/sample_brain.jpg",
    "fracture": ROOT / "samples/sample_fracture.jpg",
    "kidney": ROOT / "samples/sample_kidney.png",
}

for name, model_path in MODELS.items():
    print("\n" + "=" * 50)
    print("MODEL:", name)

    if not model_path.exists():
        print("MODEL FILE MISSING")
        continue

    model = YOLO(str(model_path))

    print("Classes:", model.names)

    sample = SAMPLES[name]

    if not sample.exists():
        print("SAMPLE IMAGE MISSING:", sample)
        continue

    image = Image.open(sample).convert("RGB")

    results = model.predict(
        image,
        conf=0.01,
        device="cpu",
        verbose=False
    )

    result = results[0]

    print("Detections:", len(result.boxes))

    for box in result.boxes:
        class_id = int(box.cls.item())
        confidence = float(box.conf.item())

        print(
            "Class:",
            model.names[class_id],
            "| Confidence:",
            round(confidence, 4)
        )

print("\nMODEL TEST COMPLETE")
