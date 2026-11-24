
const API_BASE = "http://127.0.0.1:8000/api/v1";

export interface ScanUploadResponse {
  scan_id: string;
  filename: string;
  modality: string;
  status: string;
  message: string;
}

export interface Detection {
  class_id: number;
  class_name: string;
  confidence: number;
  confidence_percent: number;
  bounding_box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export interface AnalysisResponse {
  scan_id: string;
  filename: string;
  modality: string;
  status: string;
  message: string;
  total_detections: number;
  detection_count: number;
  confidence_threshold: number;
  detections: Detection[];
  annotated_image: string;
  disclaimer: string;
  medical_disclaimer: string;
}

export interface Scan {
  id: string;
  filename: string;
  modality: string;
  status: string;
  created_at: string;
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

export async function uploadScan(
  file: File,
  modality: string
): Promise<ScanUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return request(
    `/scans/upload?modality=${encodeURIComponent(modality)}`,
    {
      method: "POST",
      body: formData
    }
  );
}

export async function analyzeScan(
  scanId: string
): Promise<AnalysisResponse> {
  return request(`/scans/${encodeURIComponent(scanId)}/analyze`, {
    method: "POST"
  });
}

export async function getModels() {
  return request<{ models: Record<string, any> }>("/models");
}

export async function getScans() {
  return request<{ total: number; scans: Scan[] }>("/scans");
}

export async function getScanHistory() {
  return getScans();
}
