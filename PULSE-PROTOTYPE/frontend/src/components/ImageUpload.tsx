
import { useRef, useState, useEffect } from "react";
import {
  Upload,
  FileImage,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ScanLine,
  AlertTriangle,
} from "lucide-react";

import { uploadScan, analyzeScan } from "../services/api";

interface Props {
  modality: "brain" | "kidney" | "fracture";
  title: string;
}

interface Detection {
  class_name: string;
  confidence: number;
  bounding_box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

interface AnalysisResult {
  scan_id: string;
  status: string;
  total_detections: number;
  confidence_threshold: number;
  detections: Detection[];
  annotated_image: string;
  disclaimer: string;
}

export default function ImageUpload({ modality, title }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const selectFile = (selected?: File) => {
    if (!selected) return;

    if (!["image/jpeg", "image/png"].includes(selected.type)) {
      setError("Only JPEG and PNG images are supported.");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("Maximum upload size is 10 MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError("");
  };

  const clearFile = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleAnalysis = async () => {
    if (!file) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const uploaded = await uploadScan(file, modality);
      const analysis = await analyzeScan(uploaded.scan_id);

      setResult({
        scan_id: analysis.scan_id,
        status: analysis.status,
        total_detections:
          analysis.total_detections ?? analysis.detection_count ?? 0,
        confidence_threshold: analysis.confidence_threshold ?? 0,
        detections: analysis.detections ?? [],
        annotated_image: analysis.annotated_image ?? "",
        disclaimer:
          analysis.disclaimer ??
          "AI-assisted research prototype only. Not intended for clinical diagnosis.",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Analysis failed. Please check your backend.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* UPLOAD SECTION */}

      <div className="bg-white rounded-2xl border p-7">
        <h2 className="text-xl font-bold">{title}</h2>

        <p className="text-sm text-gray-500 mt-2">
          Upload a medical image for AI-assisted detection.
          JPEG and PNG, maximum 10 MB.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => selectFile(e.target.files?.[0])}
        />

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            selectFile(e.dataTransfer.files[0]);
          }}
          className="mt-6 border-2 border-dashed border-gray-300 hover:border-cyan-500 rounded-2xl p-12 text-center cursor-pointer"
        >
          <Upload className="mx-auto text-cyan-600" size={40} />

          <p className="font-semibold mt-4">
            Drop your scan here
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Or click to browse
          </p>
        </div>

        {file && (
          <div className="mt-5 flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 min-w-0">
              <FileImage className="text-cyan-600 shrink-0" />

              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {file.name}
                </p>

                <p className="text-xs text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={clearFile}
              disabled={loading}
              aria-label="Remove image"
              className="text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {preview && (
          <div className="mt-5">
            <p className="text-sm font-semibold mb-3">
              Original Image
            </p>

            <img
              src={preview}
              alt="Original scan"
              className="max-h-80 mx-auto rounded-xl object-contain"
            />
          </div>
        )}

        <button
          onClick={handleAnalysis}
          disabled={!file || loading}
          className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Running AI Analysis...
            </>
          ) : (
            <>
              <ScanLine size={20} />
              Upload & Analyze
            </>
          )}
        </button>

        {error && (
          <div className="mt-5 p-4 rounded-xl bg-red-50 text-red-600 flex gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* ANALYSIS RESULTS */}

      {result && (
        <div className="space-y-6">

          <div className="bg-white border rounded-2xl p-6">
            <div className="flex items-center gap-2">

              {result.total_detections > 0 ? (
                <AlertTriangle className="text-amber-600" size={22} />
              ) : (
                <CheckCircle className="text-green-600" size={22} />
              )}

              <h2 className="font-bold text-xl">
                {result.total_detections > 0
                  ? "Detection Results"
                  : "No Detections"}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">

              <div className="bg-cyan-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">
                  Total Detections
                </p>

                <h3 className="text-3xl font-bold text-cyan-700 mt-2">
                  {result.total_detections}
                </h3>
              </div>

              <div className="bg-purple-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">
                  Confidence Threshold
                </p>

                <h3 className="text-3xl font-bold text-purple-700 mt-2">
                  {(result.confidence_threshold * 100).toFixed(0)}%
                </h3>
              </div>

            </div>
          </div>

          {/* ANNOTATED IMAGE */}

          <div className="bg-white border rounded-2xl p-6">
            <h2 className="font-bold text-xl mb-5">
              AI Detection Visualization
            </h2>

            {result.annotated_image ? (
              <img
                src={result.annotated_image}
                alt="AI model annotated scan"
                className="w-full max-h-[600px] mx-auto rounded-xl object-contain"
              />
            ) : (
              <p className="text-red-500">
                Annotated image unavailable.
              </p>
            )}
          </div>

          {/* DETECTION DETAILS */}

          <div className="bg-white border rounded-2xl p-6">
            <h2 className="font-bold text-xl mb-5">
              What the AI Detected
            </h2>

            {result.detections.length === 0 ? (
              <p className="text-gray-500">
                No detections above the configured confidence threshold.
                This does not establish that the scan is normal.
              </p>
            ) : (
              <div className="space-y-3">

                {result.detections.map((detection, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-4 flex justify-between items-center gap-4"
                  >
                    <div>
                      <p className="font-bold text-gray-800 capitalize">
                        {detection.class_name.replace(/-/g, " ")}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Detection #{index + 1}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Bounding box:{" "}
                        {[
                          detection.bounding_box.x1,
                          detection.bounding_box.y1,
                          detection.bounding_box.x2,
                          detection.bounding_box.y2,
                        ]
                          .map((value) => Math.round(value))
                          .join(", ")}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-cyan-700">
                        {(detection.confidence * 100).toFixed(2)}%
                      </p>

                      <p className="text-xs text-gray-400">
                        Model confidence
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* DISCLAIMER */}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Medical disclaimer:</strong>{" "}
            {result.disclaimer}
          </div>

          <p className="text-xs text-gray-400 break-all">
            Scan ID: {result.scan_id}
          </p>

        </div>
      )}

    </div>
  );
}
