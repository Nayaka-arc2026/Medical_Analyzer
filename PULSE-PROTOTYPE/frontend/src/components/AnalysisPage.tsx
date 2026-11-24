
import { useState } from "react";
import {
  Upload,
  Brain,
  Activity,
  Bone,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  ScanSearch,
} from "lucide-react";

import {
  uploadScan,
  analyzeScan,
  type AnalysisResponse,
} from "../services/api";

interface Props {
  modality: "brain" | "kidney" | "fracture";
  title: string;
  description: string;
}

const config = {
  brain: {
    icon: Brain,
    accent: "#8b5cf6",
    label: "BRAIN MRI",
    formats: "MRI scans",
  },
  kidney: {
    icon: Activity,
    accent: "#06b6d4",
    label: "KIDNEY SCAN",
    formats: "CT / MRI scans",
  },
  fracture: {
    icon: Bone,
    accent: "#f59e0b",
    label: "BONE X-RAY",
    formats: "X-ray / CT scans",
  },
};

export default function AnalysisPage({
  modality,
  title,
  description,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const theme = config[modality];
  const Icon = theme.icon;

  function selectFile(selected: File | undefined) {
    if (!selected) return;

    if (!["image/jpeg", "image/png"].includes(selected.type)) {
      setError("Only JPG and PNG images are supported.");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("Maximum file size is 10 MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError("");
  }

  async function handleAnalysis() {
    if (!file) {
      setError("Please upload a scan first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const uploaded = await uploadScan(file, modality);
      const analysis = await analyzeScan(uploaded.scan_id);
      setResult(analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Analysis failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pulse-analysis" style={{ "--accent": theme.accent } as React.CSSProperties}>
      <div className="analysis-heading">
        <div>
          <div className="analysis-eyebrow">
            <Icon size={16} />
            {theme.label}
          </div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="analysis-status">
          <span />
          AI MODEL READY
        </div>
      </div>

      <div className="analysis-grid">
        <section className="analysis-panel">
          <div className="panel-heading">
            <h2>Upload Scan</h2>
            <span>01 / INPUT</span>
          </div>

          <label className="upload-zone">
            <input
              type="file"
              accept="image/jpeg,image/png"
              hidden
              onChange={(e) => selectFile(e.target.files?.[0])}
            />

            {preview ? (
              <img src={preview} alt="Selected medical scan" />
            ) : (
              <>
                <div className="upload-icon">
                  <Upload size={27} />
                </div>
                <h3>Drop your scan here</h3>
                <p>or click to browse files</p>
                <span>JPG / PNG · MAX 10 MB</span>
              </>
            )}
          </label>

          {file && (
            <div className="selected-file">
              <FileImage size={19} />
              <div>
                <strong>{file.name}</strong>
                <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
              </div>
              <CheckCircle2 color="#10b981" size={20} />
            </div>
          )}

          <button
            className="analyze-button"
            disabled={!file || loading}
            onClick={handleAnalysis}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={19} />
                Analyzing Scan...
              </>
            ) : (
              <>
                <ScanSearch size={19} />
                Run AI Analysis
              </>
            )}
          </button>

          {error && (
            <div className="analysis-error">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="upload-info">
            <strong>Supported input</strong>
            <p>{theme.formats}</p>
            <p>Image dimensions: minimum 32 × 32 pixels</p>
          </div>
        </section>

        <section className="analysis-panel results-panel">
          <div className="panel-heading">
            <h2>Analysis Results</h2>
            <span>02 / OUTPUT</span>
          </div>

          {!result && !loading && (
            <div className="empty-results">
              <div className="empty-icon">
                <ScanSearch size={34} />
              </div>
              <h3>Waiting for scan</h3>
              <p>
                Upload a medical scan and run AI analysis
                to view detected findings here.
              </p>
            </div>
          )}

          {loading && (
            <div className="empty-results">
              <Loader2 className="spin" size={38} color={theme.accent} />
              <h3>Processing scan</h3>
              <p>Running the selected AI model...</p>
            </div>
          )}

          {result && (
            <div className="result-content">
              <div className="result-summary">
                <div>
                  <small>DETECTIONS FOUND</small>
                  <h2>{result.total_detections}</h2>
                </div>
                <span className="completed-tag">
                  <CheckCircle2 size={15} /> COMPLETED
                </span>
              </div>

              <div className="annotated-preview">
                <img
                  src={result.annotated_image}
                  alt="AI annotated scan"
                />
              </div>

              <h3>Detected Findings</h3>

              {result.detections.length > 0 ? (
                result.detections.map((item, index) => (
                  <div className="finding-card" key={index}>
                    <div>
                      <strong>{item.class_name}</strong>
                      <small>Detection #{index + 1}</small>
                    </div>
                    <strong className="confidence">
                      {item.confidence_percent.toFixed(2)}%
                    </strong>
                  </div>
                ))
              ) : (
                <p>No detections above the configured threshold.</p>
              )}

              <a
                className="download-button"
                href={result.annotated_image}
                download={`${modality}-annotated.jpg`}
              >
                <Download size={17} />
                Download Annotated Scan
              </a>

              <div className="medical-disclaimer">
                <AlertCircle size={17} />
                {result.disclaimer}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
