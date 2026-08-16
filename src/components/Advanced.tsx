import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Database,
  ShieldAlert,
  Terminal,
  Zap,
  Gauge,
  Layers,
  RotateCcw,
  Save,
  Check,
  AlertTriangle,
  Flame,
  Radio,
  FileCode,
  HardDrive,
  Network,
} from 'lucide-react';

export const Advanced: React.FC = () => {
  // Model & Vector Engine Config
  const [defaultModel, setDefaultModel] = useState('claude-3-7-sonnet');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-large');
  const [similarityThreshold, setSimilarityThreshold] = useState(0.78);
  const [topKRetrieval, setTopKRetrieval] = useState(12);
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(64);
  const [enableHybridSearch, setEnableHybridSearch] = useState(true);
  const [enableGraphReasoning, setEnableGraphReasoning] = useState(true);

  // Performance & Rate Limiting
  const [rateLimitRpm, setRateLimitRpm] = useState(2500);
  const [timeoutSeconds, setTimeoutSeconds] = useState(30);
  const [cacheTtlMinutes, setCacheTtlMinutes] = useState(60);
  const [streamResponses, setStreamResponses] = useState(true);

  // Webhooks & Developer Debug
  const [webhookUrl, setWebhookUrl] = useState('https://api.cairel.ai/hooks/v1/telemetry-sink');
  const [logLevel, setLogLevel] = useState('debug');
  const [rawSqlAccess, setRawSqlAccess] = useState(false);
  const [experimentalFeatures, setExperimentalFeatures] = useState(true);

  // Save banner
  const [savedBanner, setSavedBanner] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Danger zone reset modal / confirmation
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeInput, setPurgeInput] = useState('');
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleResetDefaults = () => {
    setDefaultModel('claude-3-7-sonnet');
    setEmbeddingModel('text-embedding-3-large');
    setSimilarityThreshold(0.78);
    setTopKRetrieval(12);
    setChunkSize(512);
    setChunkOverlap(64);
    setEnableHybridSearch(true);
    setEnableGraphReasoning(true);
    setRateLimitRpm(2500);
    setTimeoutSeconds(30);
    setCacheTtlMinutes(60);
    setLogLevel('debug');
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 2500);
  };

  const handlePurgeCache = () => {
    if (purgeInput === 'PURGE-INDEX') {
      setPurgeSuccess(true);
      setShowPurgeModal(false);
      setPurgeInput('');
      setTimeout(() => setPurgeSuccess(false), 3500);
    }
  };

  return (
    <main className="workspace-layout overflow-y-auto">
      <div className="overview-container">
        {/* Header Row */}
        <div className="overview-header-row">
          <div>
            <div className="settings-page-badge">
              <Sliders size={12} strokeWidth={1.5} />
              <span>Advanced System Parameters</span>
            </div>
            <h1 className="overview-title">Vector Engine & Runtime Tuning</h1>
            <p className="apikeys-subtitle">
              Configure low-level semantic embeddings, graph traversal depth, caching layers, and developer overrides.
            </p>
          </div>

          <div className="org-header-actions">
            <button className="secondary-action-btn" onClick={handleResetDefaults}>
              {resetConfirm ? (
                <>
                  <Check size={13} strokeWidth={1.5} style={{ color: '#22c55e' }} />
                  <span>Reset Applied</span>
                </>
              ) : (
                <>
                  <RotateCcw size={13} strokeWidth={1.5} />
                  <span>Reset Defaults</span>
                </>
              )}
            </button>
            <button className="settings-save-btn" onClick={handleSave}>
              <Save size={14} strokeWidth={1.5} />
              <span>Save Config</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {savedBanner && (
          <div className="settings-success-banner">
            <Check size={14} strokeWidth={1.5} />
            <span>Advanced parameters updated and propagated to vector engine workers.</span>
          </div>
        )}

        {purgeSuccess && (
          <div className="settings-success-banner" style={{ borderColor: '#F59E0B', color: '#F59E0B' }}>
            <Flame size={14} strokeWidth={1.5} />
            <span>Vector index cache and memory graph buffers have been completely flushed.</span>
          </div>
        )}

        {/* System Health Telemetry Cards */}
        <div className="settings-stat-grid">
          <div className="settings-stat-card">
            <div className="settings-stat-label">
              <Gauge size={13} strokeWidth={1.5} />
              <span>Vector Latency</span>
            </div>
            <div className="settings-stat-val">
              18.4ms <span className="settings-stat-sub">(p95 query)</span>
            </div>
          </div>

          <div className="settings-stat-card">
            <div className="settings-stat-label">
              <HardDrive size={13} strokeWidth={1.5} />
              <span>Vector Index Size</span>
            </div>
            <div className="settings-stat-val">
              1,536 <span className="settings-stat-sub">dim / HNSW</span>
            </div>
          </div>

          <div className="settings-stat-card">
            <div className="settings-stat-label">
              <Network size={13} strokeWidth={1.5} />
              <span>Pipeline Throughput</span>
            </div>
            <div className="settings-stat-val">
              1.8k <span className="settings-stat-sub">req / min</span>
            </div>
          </div>

          <div className="settings-stat-card">
            <div className="settings-stat-label">
              <Zap size={13} strokeWidth={1.5} />
              <span>Cache Hit Ratio</span>
            </div>
            <div className="settings-stat-val">
              94.2% <span className="settings-stat-badge">Optimal</span>
            </div>
          </div>
        </div>

        {/* Section 1: Semantic Embedding & Vector Graph Configuration */}
        <div className="settings-section-card">
          <div className="settings-card-header">
            <div>
              <h2 className="settings-card-title">Embedding & Retrieval Tuning</h2>
              <p className="settings-card-subtitle">
                Fine-tune chunk boundaries, threshold cutoffs, and multi-hop graph exploration
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="settings-form-body">
            <div className="settings-two-col">
              <div className="settings-input-group">
                <label className="settings-label">Primary LLM Orchestrator</label>
                <div className="settings-input-icon-wrap">
                  <Cpu size={14} strokeWidth={1.5} className="settings-input-icon" />
                  <select
                    className="settings-select settings-input--icon"
                    value={defaultModel}
                    onChange={(e) => setDefaultModel(e.target.value)}
                  >
                    <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (Hybrid Reasoning)</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="gpt-4o">OpenAI GPT-4o</option>
                    <option value="deepseek-r1">DeepSeek R1 (Self-hosted Cluster)</option>
                  </select>
                </div>
              </div>

              <div className="settings-input-group">
                <label className="settings-label">Embedding Model Dimensions</label>
                <div className="settings-input-icon-wrap">
                  <Database size={14} strokeWidth={1.5} className="settings-input-icon" />
                  <select
                    className="settings-select settings-input--icon"
                    value={embeddingModel}
                    onChange={(e) => setEmbeddingModel(e.target.value)}
                  >
                    <option value="text-embedding-3-large">OpenAI text-embedding-3-large (3072 dim)</option>
                    <option value="text-embedding-3-small">OpenAI text-embedding-3-small (1536 dim)</option>
                    <option value="bge-m3">BGE-M3 Multilingual (Dense + Sparse)</option>
                    <option value="cohere-embed-v3">Cohere Embed v3.0 (English)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sliders Range Grid */}
            <div className="settings-slider-grid">
              <div className="settings-slider-card">
                <div className="settings-slider-header">
                  <span className="settings-slider-name">Similarity Threshold Cutoff</span>
                  <span className="settings-slider-val">{similarityThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.01"
                  className="settings-range-slider"
                  value={similarityThreshold}
                  onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                />
                <span className="settings-slider-help">Discard chunks with cosine distance below this cutoff</span>
              </div>

              <div className="settings-slider-card">
                <div className="settings-slider-header">
                  <span className="settings-slider-name">Top-K Context Chunks</span>
                  <span className="settings-slider-val">{topKRetrieval}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="40"
                  step="1"
                  className="settings-range-slider"
                  value={topKRetrieval}
                  onChange={(e) => setTopKRetrieval(parseInt(e.target.value, 10))}
                />
                <span className="settings-slider-help">Max memory nodes injected into prompt context</span>
              </div>

              <div className="settings-slider-card">
                <div className="settings-slider-header">
                  <span className="settings-slider-name">Chunk Size (Tokens)</span>
                  <span className="settings-slider-val">{chunkSize} tokens</span>
                </div>
                <input
                  type="range"
                  min="128"
                  max="2048"
                  step="64"
                  className="settings-range-slider"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value, 10))}
                />
                <span className="settings-slider-help">Target length for recursive text partitioning</span>
              </div>

              <div className="settings-slider-card">
                <div className="settings-slider-header">
                  <span className="settings-slider-name">Chunk Overlap</span>
                  <span className="settings-slider-val">{chunkOverlap} tokens</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="256"
                  step="16"
                  className="settings-range-slider"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(parseInt(e.target.value, 10))}
                />
                <span className="settings-slider-help">Sliding window boundary token overlap</span>
              </div>
            </div>

            {/* Toggle options */}
            <div className="settings-toggle-list mt-4">
              <div className="settings-toggle-item">
                <div className="settings-toggle-info">
                  <div className="settings-toggle-title-row">
                    <Layers size={15} strokeWidth={1.5} />
                    <h4>Hybrid Dense + Sparse Search (BM25 Reranking)</h4>
                  </div>
                  <p>Combine vector semantic embeddings with exact keyword match scoring for high accuracy.</p>
                </div>
                <button
                  type="button"
                  className={`settings-switch ${enableHybridSearch ? 'settings-switch--active' : ''}`}
                  onClick={() => setEnableHybridSearch(!enableHybridSearch)}
                >
                  <div className="settings-switch-handle" />
                </button>
              </div>

              <div className="settings-toggle-item">
                <div className="settings-toggle-info">
                  <div className="settings-toggle-title-row">
                    <Zap size={15} strokeWidth={1.5} className="text-amber" />
                    <h4>Hierarchical Memory Graph Traversal</h4>
                  </div>
                  <p>Enable multi-hop entity relation expansion for complex inductive queries across documents.</p>
                </div>
                <button
                  type="button"
                  className={`settings-switch ${enableGraphReasoning ? 'settings-switch--active' : ''}`}
                  onClick={() => setEnableGraphReasoning(!enableGraphReasoning)}
                >
                  <div className="settings-switch-handle" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Section 2: Developer Pipelines & Webhooks */}
        <div className="settings-section-card">
          <div className="settings-card-header">
            <div>
              <h2 className="settings-card-title">Developer Webhooks & Telemetry Stream</h2>
              <p className="settings-card-subtitle">
                Forward real-time indexing lifecycle events and debug traces to external endpoints
              </p>
            </div>
          </div>

          <div className="settings-form-body">
            <div className="settings-input-group">
              <label className="settings-label">Live Ingestion Webhook URL</label>
              <div className="settings-input-icon-wrap">
                <Radio size={14} strokeWidth={1.5} className="settings-input-icon" />
                <input
                  type="url"
                  className="settings-input settings-input--icon"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="settings-two-col">
              <div className="settings-input-group">
                <label className="settings-label">System Log Verbosity</label>
                <div className="settings-input-icon-wrap">
                  <Terminal size={14} strokeWidth={1.5} className="settings-input-icon" />
                  <select
                    className="settings-select settings-input--icon"
                    value={logLevel}
                    onChange={(e) => setLogLevel(e.target.value)}
                  >
                    <option value="error">Error only</option>
                    <option value="warn">Warnings & Errors</option>
                    <option value="info">Info (Standard)</option>
                    <option value="debug">Debug (Full Payload Trace)</option>
                  </select>
                </div>
              </div>

              <div className="settings-input-group">
                <label className="settings-label">Global Rate Limiting</label>
                <div className="settings-input-icon-wrap">
                  <Gauge size={14} strokeWidth={1.5} className="settings-input-icon" />
                  <input
                    type="number"
                    className="settings-input settings-input--icon"
                    value={rateLimitRpm}
                    onChange={(e) => setRateLimitRpm(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>
            </div>

            <div className="settings-two-col">
              <div className="settings-input-group">
                <label className="settings-label">HTTP Request Timeout (Seconds)</label>
                <div className="settings-input-icon-wrap">
                  <Gauge size={14} strokeWidth={1.5} className="settings-input-icon" />
                  <input
                    type="number"
                    min="5"
                    max="300"
                    className="settings-input settings-input--icon"
                    value={timeoutSeconds}
                    onChange={(e) => setTimeoutSeconds(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>

              <div className="settings-input-group">
                <label className="settings-label">Memory Vector Cache TTL (Minutes)</label>
                <div className="settings-input-icon-wrap">
                  <Database size={14} strokeWidth={1.5} className="settings-input-icon" />
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    className="settings-input settings-input--icon"
                    value={cacheTtlMinutes}
                    onChange={(e) => setCacheTtlMinutes(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>
            </div>

            <div className="settings-toggle-list">
              <div className="settings-toggle-item">
                <div className="settings-toggle-info">
                  <div className="settings-toggle-title-row">
                    <FileCode size={15} strokeWidth={1.5} />
                    <h4>Stream SSE Chunk Token Events</h4>
                  </div>
                  <p>Stream progressive semantic responses over Server-Sent Events for ultra-low first token latency.</p>
                </div>
                <button
                  type="button"
                  className={`settings-switch ${streamResponses ? 'settings-switch--active' : ''}`}
                  onClick={() => setStreamResponses(!streamResponses)}
                >
                  <div className="settings-switch-handle" />
                </button>
              </div>

              <div className="settings-toggle-item">
                <div className="settings-toggle-info">
                  <div className="settings-toggle-title-row">
                    <Database size={15} strokeWidth={1.5} />
                    <h4>Direct pgvector / SQL Explorer Sandbox</h4>
                  </div>
                  <p>Expose read-only SQL querying playground directly against embeddings tables.</p>
                </div>
                <button
                  type="button"
                  className={`settings-switch ${rawSqlAccess ? 'settings-switch--active' : ''}`}
                  onClick={() => setRawSqlAccess(!rawSqlAccess)}
                >
                  <div className="settings-switch-handle" />
                </button>
              </div>

              <div className="settings-toggle-item">
                <div className="settings-toggle-info">
                  <div className="settings-toggle-title-row">
                    <Terminal size={15} strokeWidth={1.5} />
                    <h4>Experimental Knowledge Graph Sandbox</h4>
                  </div>
                  <p>Enable alpha graph clustering models and vector re-quantization algorithms.</p>
                </div>
                <button
                  type="button"
                  className={`settings-switch ${experimentalFeatures ? 'settings-switch--active' : ''}`}
                  onClick={() => setExperimentalFeatures(!experimentalFeatures)}
                >
                  <div className="settings-switch-handle" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Danger Zone */}
        <div className="settings-danger-card">
          <div className="settings-card-header">
            <div>
              <div className="danger-badge">
                <AlertTriangle size={12} strokeWidth={1.5} />
                <span>Danger Zone</span>
              </div>
              <h2 className="settings-card-title text-danger">Purge & Re-index Memory Vectors</h2>
              <p className="settings-card-subtitle">
                Irreversible actions that discard cached vector embeddings and rebuild graph relationships.
              </p>
            </div>
          </div>

          <div className="danger-actions-row">
            <div>
              <h4 className="danger-action-title">Flush Vector Embeddings Cache</h4>
              <p className="danger-action-desc">
                Clears all pre-computed cosine similarity caches across workers. Documents will re-index on next query.
              </p>
            </div>
            <button className="danger-btn" onClick={() => setShowPurgeModal(true)}>
              <Flame size={13} strokeWidth={1.5} />
              <span>Purge Vector Cache</span>
            </button>
          </div>
        </div>
      </div>

      {/* Purge Modal */}
      {showPurgeModal && (
        <div className="apikeys-modal-overlay" onClick={() => setShowPurgeModal(false)}>
          <div className="apikeys-modal" onClick={(e) => e.stopPropagation()}>
            <div className="apikeys-modal-header" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <div className="modal-title-row" style={{ color: '#EF4444' }}>
                <ShieldAlert size={16} strokeWidth={1.5} />
                <h3 className="apikeys-modal-title">Confirm Vector Cache Purge</h3>
              </div>
            </div>

            <div className="apikeys-modal-body">
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                This will immediately purge all cached embeddings and temporary graph state. Type{' '}
                <strong style={{ color: '#EDEDED', fontFamily: 'var(--font-mono)' }}>PURGE-INDEX</strong> below to confirm.
              </p>

              <div>
                <input
                  type="text"
                  placeholder="PURGE-INDEX"
                  className="apikeys-modal-input"
                  value={purgeInput}
                  onChange={(e) => setPurgeInput(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="apikeys-modal-footer">
              <button
                type="button"
                className="apikeys-modal-cancel"
                onClick={() => setShowPurgeModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`danger-modal-submit ${purgeInput === 'PURGE-INDEX' ? 'danger-modal-submit--active' : ''}`}
                disabled={purgeInput !== 'PURGE-INDEX'}
                onClick={handlePurgeCache}
              >
                Permanently Flush Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
