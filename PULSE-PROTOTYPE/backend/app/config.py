
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = BASE_DIR.parent

STORAGE_DIR = PROJECT_DIR / "storage"
MODEL_DIR = PROJECT_DIR / "models"

MAX_UPLOAD_SIZE = 10 * 1024 * 1024

ALLOWED_IMAGE_TYPES = {
    "JPEG": ".jpg",
    "PNG": ".png",
}

APP_NAME = "PULSE AI"
APP_VERSION = "1.0.0"

SECRET_KEY = os.getenv("SECRET_KEY", "development-only-change-me")
