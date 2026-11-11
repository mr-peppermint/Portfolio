import { useState, useEffect } from 'react';
import { ProjectItem } from '../../config';
import './ProjectPreviewModal.css';

interface ProjectPreviewModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [showRawReadme, setShowRawReadme] = useState(false);

  useEffect(() => {
    if (!project) return;
    setStreamedText(project.aiSummary.overview);
    setStreaming(false);
    setShowRawReadme(false);
  }, [project]);

  if (!project) return null;

  const handleResynthesize = () => {
    if (streaming) return;
    setStreaming(true);
    setStreamedText('');
    const fullText = project.aiSummary.overview;
    let index = 0;

    const timer = setInterval(() => {
      index += 3;
      setStreamedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(timer);
        setStreaming(false);
      }
    }, 16);
  };

  return (
    <div className="preview-backdrop" onClick={onClose}>
      <div
        className="preview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        style={{ '--project-accent': project.accent } as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        {/* Retro Window Header */}
        <div className="preview-window-bar">
          <div className="preview-window-title">
            <span className="preview-exe-icon">✦</span>
            <span>GPT_OSS_120B_ANALYZER.EXE // {project.title.toUpperCase()}</span>
          </div>
          <div className="preview-window-btns">
            <button
              type="button"
              className="preview-btn-close"
              onClick={onClose}
              aria-label="Close project preview"
            >
              ×
            </button>
          </div>
        </div>

        {/* AI Model Spec Bar */}
        <div className="preview-model-strip">
          <div className="model-strip-left">
            <span className="model-chip model-chip--primary">
              <span className="model-chip-dot" />
              MODEL: GPT-OSS 120B
            </span>
            <span className="model-chip">SYNTHESIS: README-ONLY</span>
            <span className="model-chip model-chip--stats">120 TOKENS/S</span>
          </div>
          <button
            type="button"
            className="resynthesize-btn"
            onClick={handleResynthesize}
            disabled={streaming}
            title="Re-run GPT-OSS 120B analysis"
          >
            {streaming ? 'STREAMING...' : 'RE-SYNTHESIZE ↻'}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="preview-body">
          {/* Project Header Card */}
          <div className="preview-project-header">
            <div className="preview-media-thumb">
              <img src={project.image} alt={project.alt || project.title} />
              <div className="preview-media-glow" />
            </div>

            <div className="preview-project-info">
              <div className="preview-badge-row">
                <span className="preview-accent-pill">{project.title}</span>
                {project.liveUrl && (
                  <span className="preview-live-tag">
                    <span className="live-dot" /> LIVE DEPLOYMENT
                  </span>
                )}
              </div>

              <h2 id="preview-title" className="preview-project-title">
                {project.title}
              </h2>
              <p className="preview-project-subtitle">{project.subtitle}</p>

              {/* Action Buttons */}
              <div className="preview-actions">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="preview-btn preview-btn--live"
                  >
                    <span>OPEN LIVE PROJECT</span>
                    <span className="btn-arrow">↗</span>
                  </a>
                )}
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-btn preview-btn--github"
                >
                  <span>GITHUB REPO</span>
                  <span className="btn-arrow">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* AI Analysis Container */}
          <div className="ai-analysis-container">
            {/* Overview */}
            <div className="ai-section">
              <div className="ai-section-heading">
                <span>01 // EXECUTIVE SUMMARY</span>
                <span className="ai-model-tag">GPT-OSS 120B</span>
              </div>
              <div className="ai-overview-text">
                <p>
                  {streamedText}
                  {streaming && <span className="ai-cursor">_</span>}
                </p>
              </div>
            </div>

            {/* Key Capabilities */}
            <div className="ai-section">
              <div className="ai-section-heading">
                <span>02 // CAPABILITIES SYNTHESIZED FROM README</span>
              </div>
              <ul className="ai-features-list">
                {project.aiSummary.features.map((feat, i) => (
                  <li key={i}>
                    <span className="feat-bullet">▹</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="ai-section">
              <div className="ai-section-heading">
                <span>03 // ARCHITECTURE &amp; TECH STACK</span>
              </div>
              <div className="ai-tech-pills">
                {project.aiSummary.techStack.map(t => (
                  <span key={t} className="ai-tech-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Architectural Highlight */}
            {project.aiSummary.highlight && (
              <div className="ai-section ai-section--highlight">
                <div className="ai-section-heading">
                  <span>04 // SYSTEM HIGHLIGHT</span>
                </div>
                <p className="ai-highlight-quote">
                  &ldquo;{project.aiSummary.highlight}&rdquo;
                </p>
              </div>
            )}

            {/* Collapsible Raw README Source */}
            <div className="ai-readme-source">
              <button
                type="button"
                className="readme-toggle-btn"
                onClick={() => setShowRawReadme(!showRawReadme)}
              >
                <span>{showRawReadme ? '▾ HIDE SOURCE README EXCERPT' : '▸ INSPECT SOURCE README EXCERPT'}</span>
                <span className="readme-badge">RAW INPUT</span>
              </button>

              {showRawReadme && (
                <div className="readme-terminal-box">
                  <pre>{project.readmeDescription}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
