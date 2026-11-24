
import io
import uuid
import warnings

from PIL import Image, UnidentifiedImageError

from app.config import (
    STORAGE_DIR,
    MAX_UPLOAD_SIZE,
    ALLOWED_IMAGE_TYPES,
)
from app.core.security import sanitize_filename


def validate_image(image_bytes: bytes):
    if not image_bytes:
        raise ValueError("Empty image file.")

    if len(image_bytes) > MAX_UPLOAD_SIZE:
        raise ValueError("Image exceeds the 10 MB upload limit.")

    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)

            image = Image.open(io.BytesIO(image_bytes))
            image.verify()

            image = Image.open(io.BytesIO(image_bytes))

            if image.format not in ALLOWED_IMAGE_TYPES:
                raise ValueError("Only JPEG and PNG images are supported.")

            if image.width < 32 or image.height < 32:
                raise ValueError("Image resolution is too small.")

            return image.format, image.width, image.height

    except (UnidentifiedImageError, OSError, Image.DecompressionBombError,
            Image.DecompressionBombWarning):
        raise ValueError("Invalid or unsafe image file.")


def save_image(image_bytes: bytes, filename: str):
    image_format, width, height = validate_image(image_bytes)

    STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    scan_id = str(uuid.uuid4())

    safe_filename = sanitize_filename(filename)

    extension = ALLOWED_IMAGE_TYPES[image_format]

    destination = STORAGE_DIR / f"{scan_id}{extension}"

    destination.write_bytes(image_bytes)

    return {
        "scan_id": scan_id,
        "filename": safe_filename,
        "file_path": destination,
        "format": image_format,
        "width": width,
        "height": height,
    }
