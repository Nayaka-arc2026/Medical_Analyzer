
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ScanLine,
  RefreshCw,
  Clock3,
  CheckCircle2,
  Filter,
  FileImage,
  Activity,
  X,
} from "lucide-react";
import { getScans } from "../services/api";

interface Scan {
  id: string;
  filename: string;
  modality: string;
  status: string;
  created_at: string;
}

export default function ScanHistory() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const loadScans = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getScans();
      setScans(data.scans || []);
    } catch {
      setError("Unable to load scan history. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScans();
  }, []);

  const completed = scans.filter(
    (scan) => scan.status?.toLowerCase() === "completed"
  ).length;

  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const matchesSearch =
        scan.filename?.toLowerCase().includes(search.toLowerCase()) ||
        scan.modality?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        scan.status?.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [scans, search, filter]);

  return (
    <div className="history-page">

      <section className="history-hero">
        <div>
          <div className="history-eyebrow">
            <span />
            MEDICAL RECORD MANAGEMENT
          </div>

          <h1>Scan <span>History</span></h1>

          <p>
            Track, search and review your medical imaging analysis records
            in one place.
          </p>
        </div>

        <div className="history-hero-icon">
          <ScanLine size={65} strokeWidth={1.2} />
          <div className="history-orbit" />
        </div>
      </section>

      {error && (
        <div className="history-error">
          {error}
          <button onClick={loadScans}>Retry</button>
        </div>
      )}

      <section className="history-stats">
        <div className="history-stat">
          <div className="history-stat-icon cyan">
            <FileImage size={21} />
          </div>
          <div>
            <span>TOTAL SCANS</span>
            <strong>{scans.length}</strong>
          </div>
        </div>

        <div className="history-stat">
          <div className="history-stat-icon green">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>COMPLETED</span>
            <strong>{completed}</strong>
          </div>
        </div>

        <div className="history-stat">
          <div className="history-stat-icon violet">
            <Activity size={21} />
          </div>
          <div>
            <span>OTHER STATUSES</span>
            <strong>{scans.length - completed}</strong>
          </div>
        </div>
      </section>

      <section className="history-table-card">
        <div className="history-table-heading">
          <div>
            <span className="section-eyebrow">YOUR RECORDS</span>
            <h2>Medical Scan Records</h2>
            <p>Browse your uploaded medical imaging files.</p>
          </div>

          <button
            className="history-refresh"
            onClick={loadScans}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? "spin-icon" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="history-toolbar">
          <div className="history-search">
            <Search size={17} />
            <input
              placeholder="Search filename or modality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="history-filter">
            <Filter size={15} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="history-table-wrap">
          {loading ? (
            <div className="history-empty">
              <RefreshCw className="spin-icon" size={28} />
              <p>Loading medical records...</p>
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="history-empty">
              <ScanLine size={35} />
              <h3>{scans.length === 0 ? "No scans yet" : "No matching scans"}</h3>
              <p>
                {scans.length === 0
                  ? "Upload a medical image to start building your scan history."
                  : "Try changing your search or status filter."}
              </p>
              {search && (
                <button
                  className="history-clear"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>MEDICAL IMAGE</th>
                  <th>MODALITY</th>
                  <th>STATUS</th>
                  <th>DATE & TIME</th>
                </tr>
              </thead>

              <tbody>
                {filteredScans.map((scan) => {
                  const status = scan.status?.toLowerCase() || "unknown";

                  return (
                    <tr key={scan.id}>
                      <td>
                        <div className="history-file">
                          <div className="history-file-icon">
                            <FileImage size={19} />
                          </div>
                          <div>
                            <strong>{scan.filename}</strong>
                            <span>Scan ID: {scan.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="history-modality">
                          {scan.modality || "Unknown"}
                        </span>
                      </td>

                      <td>
                        <span className={`history-status ${status}`}>
                          <span />
                          {scan.status || "Unknown"}
                        </span>
                      </td>

                      <td>
                        <div className="history-date">
                          <Clock3 size={14} />
                          {scan.created_at
                            ? new Date(scan.created_at).toLocaleString()
                            : "Date unavailable"}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="history-table-footer">
          <span>
            Showing <strong>{filteredScans.length}</strong> of{" "}
            <strong>{scans.length}</strong> records
          </span>
          <span className="history-secure">
            <CheckCircle2 size={14} />
            PULSE AI WORKSPACE
          </span>
        </div>
      </section>
    </div>
  );
}
