
import { useEffect, useState } from "react";
import {
  Activity,
  Brain,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const scanModes = [
  { name: "Neural Scan", detail: "Neural activity mapping", icon: Brain },
  { name: "Deep Analysis", detail: "Advanced pattern detection", icon: ScanLine },
  { name: "AI Diagnostics", detail: "Intelligent image assessment", icon: Sparkles },
];

export default function AnatomyExplorer() {
  const [mode, setMode] = useState(0);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || progress >= 100) return;

    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 1, 100));
    }, 180);

    return () => window.clearInterval(timer);
  }, [running, progress]);

  const restart = () => {
    setProgress(0);
    setRunning(true);
  };

  const ModeIcon = scanModes[mode].icon;

  return (
    <section className="pulse-neural">
      <div className="pulse-neural-grid" />

      <header className="pulse-neural-header">
        <div className="pulse-neural-heading">
          <span className="pulse-status-dot" />
          <span> PULSE AI / NEURAL LAB</span>
        </div>
        <span className="pulse-live-tag">SYSTEM ONLINE</span>
      </header>

      <div className="pulse-neural-main">
        <div className="pulse-visual">
          <div className="pulse-orbit pulse-orbit-one" />
          <div className="pulse-orbit pulse-orbit-two" />
          <div className="pulse-orbit pulse-orbit-three" />

          <div className="pulse-scan-beam" />

          <div className="pulse-core">
            <div className="pulse-core-glow" />
            <Brain size={92} strokeWidth={1.05} />
            <div className="pulse-core-caption">PULSE INTELLIGENCE</div>
          </div>

          {Array.from({ length: 12 }).map((_, index) => (
            <span
              key={index}
              className="pulse-particle"
              style={{
                "--particle-index": index,
              } as React.CSSProperties}
            />
          ))}

          <div className="pulse-coordinate pulse-coordinate-top">
            <span>NEURAL FIELD</span>
            <strong>0{mode + 1} / 03</strong>
          </div>

          <div className="pulse-coordinate pulse-coordinate-bottom">
            <span>AI ENGINE</span>
            <strong>ACTIVE</strong>
          </div>
        </div>

        <div className="pulse-neural-info">
          <div className="pulse-eyebrow">
            <Sparkles size={14} /> INTELLIGENT ANALYSIS
          </div>

          <h2>
            See beyond
            <br />
            <span>the scan.</span>
          </h2>

          <p>
            Advanced AI visualization designed to explore patterns,
            detect signals and transform medical imaging into insights.
          </p>

          <div className="pulse-mode-list">
            {scanModes.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  type="button"
                  className={`pulse-mode ${mode === index ? "active" : ""}`}
                  onClick={() => {
                    setMode(index);
                    setProgress(0);
                    setRunning(true);
                  }}
                >
                  <span className="pulse-mode-icon">
                    <Icon size={18} />
                  </span>
                  <span className="pulse-mode-copy">
                    <strong>{item.name}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <span className="pulse-mode-arrow">↗</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="pulse-neural-footer">
        <div className="pulse-progress-area">
          <div className="pulse-progress-label">
            <span>
              <Activity size={14} /> {progress === 100 ? "SCAN COMPLETE" : "LIVE ANALYSIS"}
            </span>
            <strong>{progress}%</strong>
          </div>
          <div className="pulse-progress-track">
            <div
              className="pulse-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="pulse-footer-status">
          <ShieldCheck size={16} />
          <span>{progress === 100 ? "Analysis cycle complete" : "AI engine ready"}</span>
        </div>

        <div className="pulse-actions">
          <button
            type="button"
            className="pulse-action-secondary"
            onClick={() => setRunning((value) => !value)}
            aria-label={running ? "Pause scan" : "Resume scan"}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            {running ? "Pause" : "Resume"}
          </button>

          <button
            type="button"
            className="pulse-action-primary"
            onClick={restart}
          >
            <RotateCcw size={15} />
            Restart
            <Zap size={14} />
          </button>
        </div>
      </footer>
    </section>
  );
}
