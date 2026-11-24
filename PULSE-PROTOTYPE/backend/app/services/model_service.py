
from pathlib import Path
from threading import Lock
from ultralytics import YOLO

PROJECT_ROOT = Path(__file__).resolve().parents[3]


MODEL_CONFIG = {
    "brain": {
        "name": "Brain (MRI)",
        "file": "brain_model.pt",
        "conf": 0.10,
    },
    "fracture": {
        "name": "Bone Fracture (X-ray/CT)",
        "file": "fracture_model.pt",
        "conf": 0.05,
    },
    "kidney": {
        "name": "Kidney (CT/MRI)",
        "file": "kidney_model.pt",
        "conf": 0.10,
    },


}


class ModelService:
    def __init__(self):
        self.models = {}
        self.lock = Lock()
        self.loaded = False

    def get_config(self, modality):
        if modality not in MODEL_CONFIG:
            raise ValueError("Invalid modality")

        return MODEL_CONFIG[modality]


    def load_models(self):
        with self.lock:
            if self.loaded:
                return

            for key, config in MODEL_CONFIG.items():
                path = PROJECT_ROOT / config["file"]

                if not path.exists():
                    print(f"Model not found: {path}")
                    continue

                try:
                    self.models[key] = YOLO(str(path))
                    print(f"Loaded model: {config['name']}")
                except Exception as exc:
                    print(f"Failed to load {key}: {exc}")

            self.loaded = True

    def get_model(self, modality):
        self.load_models()

        if modality not in MODEL_CONFIG:
            raise ValueError("Invalid modality")

        model = self.models.get(modality)

        if model is None:
            raise RuntimeError(
                f"Model '{modality}' is unavailable"
            )

        return model

    def get_model_status(self):
        self.load_models()

        return {
            key: {
                "name": config["name"],
                "available": key in self.models,
                "confidence": config["conf"],
            }
            for key, config in MODEL_CONFIG.items()
        }


model_service = ModelService()
