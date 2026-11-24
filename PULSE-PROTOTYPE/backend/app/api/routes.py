
import base64
from pathlib import Path

import cv2
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.database import create_scan, get_scan, get_all_scans
from app.services.image_service import save_image
from app.services.model_service import model_service, MODEL_CONFIG
from app.schemas import ScanUploadResponse

router = APIRouter()


@router.get("/health")
async def api_health():
    return {"status": "healthy", "service": "PULSE AI API"}


@router.get("/models")
async def get_models():
    return {"models": model_service.get_model_status()}


@router.post("/scans/upload", response_model=ScanUploadResponse)
async def upload_scan(
    modality: str,
    file: UploadFile = File(...)
):
    if modality not in MODEL_CONFIG:
        raise HTTPException(400, "Invalid modality")

    try:
        image_bytes = await file.read(10 * 1024 * 1024 + 1)

        result = save_image(
            image_bytes,
            file.filename or "medical_scan"
        )

        create_scan(
            scan_id=result["scan_id"],
            filename=result["filename"],
            modality=modality,
            file_path=result["file_path"]
        )

        return {
            "scan_id": result["scan_id"],
            "filename": result["filename"],
            "modality": modality,
            "status": "uploaded",
            "message": "Image uploaded successfully"
        }

    except ValueError as error:
        raise HTTPException(400, str(error))
    except OSError:
        raise HTTPException(500, "Unable to save image")
    finally:
        await file.close()


@router.get("/scans")
async def list_scans():
    scans = get_all_scans()
    return {
        "total": len(scans),
        "scans": [dict(scan) for scan in scans]
    }


@router.get("/scans/{scan_id}")
async def scan_details(scan_id: str):
    scan = get_scan(scan_id)

    if not scan:
        raise HTTPException(404, "Scan not found")

    return {"scan": dict(scan)}


@router.post("/scans/{scan_id}/analyze")
async def analyze_scan(scan_id: str):
    scan = get_scan(scan_id)

    if not scan:
        raise HTTPException(404, "Scan not found")

    modality = scan["modality"]
    image_path = Path(scan["file_path"])

    if not image_path.exists():
        raise HTTPException(404, "Image file not found")

    try:
        model = model_service.get_model(modality)
        threshold = MODEL_CONFIG[modality]["conf"]

        results = model.predict(
            source=str(image_path),
            conf=threshold,
            imgsz=640,
            verbose=False
        )

        result = results[0]

        annotated = result.plot()

        success, encoded = cv2.imencode(".jpg", annotated)

        if not success:
            raise RuntimeError("Image encoding failed")

        image_base64 = base64.b64encode(
            encoded.tobytes()
        ).decode("utf-8")

        detections = []

        if result.boxes is not None:
            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])

                x1, y1, x2, y2 = map(
                    float,
                    box.xyxy[0].tolist()
                )

                detections.append({
                    "class_id": class_id,
                    "class_name": str(result.names[class_id]),
                    "confidence": confidence,
                    "confidence_percent": round(confidence * 100, 2),
                    "bounding_box": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2
                    }
                })

        return {
            "scan_id": scan_id,
            "filename": scan["filename"],
            "modality": modality,
            "status": "completed",
            "message": "Inference completed successfully",
            "total_detections": len(detections),
            "detection_count": len(detections),
            "confidence_threshold": threshold,
            "detections": detections,
            "annotated_image": (
                f"data:image/jpeg;base64,{image_base64}"
            ),
            "disclaimer": (
                "Research prototype only. Not for clinical diagnosis."
            ),
            "medical_disclaimer": (
                "AI-assisted research prototype only. "
                "Not intended for clinical diagnosis."
            )
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Inference failed: {str(error)}"
        )
