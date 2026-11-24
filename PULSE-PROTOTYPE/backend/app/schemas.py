
from pydantic import BaseModel, Field
from typing import Optional


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class ScanUploadResponse(BaseModel):
    scan_id: str
    filename: str
    modality: str
    status: str
    message: str


class AnalysisResponse(BaseModel):
    scan_id: str
    status: str
    message: str
    prediction: Optional[str] = None
    confidence: Optional[float] = None


class ErrorResponse(BaseModel):
    detail: str
