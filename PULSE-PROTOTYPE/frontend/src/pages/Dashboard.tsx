
import { useEffect, useState } from "react";
import {
  Brain,
  Bean,
  Bone,
  Activity,
  ArrowUpRight,
  ScanLine,
  Sparkles,
  Clock3,
  ShieldCheck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getModels, getScans } from "../services/api";

interface Scan {
  id: string;
  filename: string;
  modality: string;
  status: string;
  created_at: string;
}

const modules = [
  {
    name: "Brain Analysis",
    description: "Advanced neurological imaging and AI-assisted analysis.",
    path: "/brain",
    icon: Brain,
    color: "violet",
    number: "01",
    tag: "NEUROLOGY",
  },
  {
    name: "Kidney Analysis",
    description: "Intelligent kidney imaging and abnormality detection.",
    path: "/kidney",
    icon: Bean,
    color: "blue",
    number: "02",
    tag: "NEPHROLOGY",
  },
  {
    name: "Fracture Analysis",
    description: "Bone imaging analysis and fracture identification.",
    path: "/fracture",
    icon: Bone,
    color: "orange",
    number: "03",
    tag: "ORTHOPEDICS",
  },
];

export default function Dashboard() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [models, setModels] = useState<Record<string, any>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [scanData, modelData] = await Promise.all([
        getScans(),
        getModels(),
      ]);

      setScans(scanData.scans || []);
      setModels(modelData.models || {});
    } catch {
      setError("Unable to connect to the PULSE backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const availableModels = Object.values(models).filter(
    (model: any) => model.available
  ).length;

  const completedScans = scans.filter(
    (scan) => scan.status?.toLowerCase() === "completed"
  ).length;

  const stats = [
    {
      label: "Total Scans",
      value: scans.length,
      icon: ScanLine,
      color: "cyan",
      description: "Scans in your workspace",
    },
    {
      label: "Available Models",
      value: availableModels,
      icon: Brain,
      color: "violet",
      description: "AI models ready to use",
    },
    {
      label: "AI Modules",
      value: 3,
      icon: Activity,
      color: "green",
      description: "Analysis workspaces",
    },
    {
      label: "Completed Scans",
      value: completedScans,
      icon: ShieldCheck,
      color: "orange",
      description: "Successfully completed",
    },
  ];

  return (
    <div className="dashboard">

      {/* HERO SECTION */}

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-live-dot" />
            MEDICAL INTELLIGENCE PLATFORM
          </div>

          <h1>
            Welcome to <span>PULSE AI.</span>
            <br />
            <span className="hero-second-line">
              Intelligence meets healthcare.
            </span>
          </h1>

          <p>
            Explore intelligent medical imaging, analyze diagnostic scans
            and manage your AI-powered medical workspace.
          </p>

          <div className="hero-buttons">
            <Link to="/brain" className="hero-primary-button">
              <Sparkles size={17} />
              Start AI Analysis
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/history" className="hero-secondary-button">
              <Clock3 size={17} />
              View Scan History
            </Link>
          </div>

          <div className="hero-trust">
            <ShieldCheck size={15} />
            Medical imaging workspace
            <span>•</span>
            AI-assisted analysis
          </div>
        </div>

        <div className="hero-visual">
          <div className="orb orb-one" />
          <div className="orb orb-two" />

          <div className="hero-ring ring-one" />
          <div className="hero-ring ring-two" />
          <div className="hero-ring ring-three" />

          <div className="hero-core">
            <Activity size={65} strokeWidth={1.2} />
          </div>

          <div className="floating-chip chip-one">
            <Brain size={16} />
            <span>NEURAL AI</span>
          </div>

          <div className="floating-chip chip-two">
            <Zap size={16} />
            <span>INTELLIGENCE</span>
          </div>

          <div className="floating-chip chip-three">
            <ScanLine size={16} />
            <span>SCAN SYSTEM</span>
          </div>
        </div>

        <div className="hero-decoration">PULSE / 001</div>
      </section>

      {/* ERROR */}

      {error && (
        <div className="dashboard-error">
          <span>{error}</span>
          <button onClick={loadDashboard}>
            <RefreshCw size={15} /> Retry
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <section className="stats-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">OVERVIEW</span>
            <h2>Workspace Analytics</h2>
          </div>

          <button
            className="refresh-button"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? "spin-icon" : ""}
            />
            Refresh data
          </button>
        </div>

        <div className="stats-grid">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                className={`stat-card stat-${item.color}`}
                key={item.label}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="stat-top">
                  <div className="stat-icon">
                    <Icon size={21} />
                  </div>
                  <span className="stat-number">
                    0{index + 1}
                  </span>
                </div>

                <h3>{loading ? "—" : item.value}</h3>
                <p>{item.label}</p>
                <span className="stat-description">
                  {item.description}
                </span>

                <div className="stat-bottom-line" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ANALYSIS MODULES */}

      <section className="modules-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">AI CAPABILITIES</span>
            <h2>Analysis Workspaces</h2>
            <p>Select a specialized AI module to begin.</p>
          </div>

          <span className="module-count">03 MODULES</span>
        </div>

        <div className="modules-grid">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                to={module.path}
                className={`module-card module-${module.color}`}
                key={module.name}
              >
                <div className="module-card-top">
                  <div className="module-icon">
                    <Icon size={27} />
                  </div>

                  <span className="module-number">
                    {module.number}
                  </span>
                </div>

                <span className="module-tag">{module.tag}</span>

                <h3>{module.name}</h3>
                <p>{module.description}</p>

                <div className="module-card-bottom">
                  <span>OPEN WORKSPACE</span>
                  <div className="module-arrow">
                    <ArrowUpRight size={19} />
                  </div>
                </div>

                <div className="module-glow" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* RECENT SCANS */}

      <section className="recent-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">ACTIVITY</span>
            <h2>Recent Scan Activity</h2>
            <p>Your latest medical imaging records.</p>
          </div>

          <Link to="/history" className="view-all-button">
            View all scans <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="recent-card">
          {loading ? (
            <div className="empty-state">
              <RefreshCw className="spin-icon" size={25} />
              <p>Loading scan records...</p>
            </div>
          ) : scans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <ScanLine size={29} />
              </div>
              <h3>No scans available yet</h3>
              <p>
                Your uploaded medical scans will appear here.
                Start by opening an AI analysis workspace.
              </p>
              <Link to="/brain" className="empty-state-button">
                Start your first analysis <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="scan-table-wrapper">
              <table className="scan-table">
                <thead>
                  <tr>
                    <th>SCAN FILE</th>
                    <th>MODALITY</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>

                <tbody>
                  {scans.slice(0, 5).map((scan) => (
                    <tr key={scan.id}>
                      <td>
                        <div className="scan-file">
                          <div className="scan-file-icon">
                            <ScanLine size={17} />
                          </div>
                          <span>{scan.filename}</span>
                        </div>
                      </td>

                      <td>
                        <span className="modality-badge">
                          {scan.modality}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`scan-status ${
                            scan.status?.toLowerCase() === "completed"
                              ? "status-completed"
                              : "status-pending"
                          }`}
                        >
                          <span />
                          {scan.status}
                        </span>
                      </td>

                      <td className="scan-date">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <footer className="dashboard-footer">
        <span>PULSE AI</span>
        <span>MEDICAL INTELLIGENCE PLATFORM</span>
        <span>BUILT FOR BETTER INSIGHTS</span>
      </footer>
    </div>
  );
}
