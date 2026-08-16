import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Plus,
  X,
  Globe,
  Database,
  Check,
  Loader2,
  FileText,
  Clock,
  CheckCircle2,
  ChevronDown,
  SlidersHorizontal,
  Bot,
  GitGraph,
  User,
  Zap,
  ArrowUpRight,
  BookOpen,
  KeyRound,
  RotateCw,
  FolderTree,
  Sparkles,
} from 'lucide-react';
import { ApiKeys } from './ApiKeys';
import { Organization } from './Organization';
import { Advanced } from './Advanced';
import type { ProcessingItem, ChatMessage } from '../types';

interface WorkspaceProps {
  activeId: string;
  setActiveId: (id: string) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ activeId, setActiveId }) => {
  // Import section states
  const [urls, setUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [containerTag, setContainerTag] = useState('');
  const [taskType, setTaskType] = useState<'Memory' | 'SuperRAG'>('Memory');
  const [isDragging, setIsDragging] = useState(false);

  // Overview dashboard states
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | 'all'>('30d');
  const [onboardingFlow, setOnboardingFlow] = useState<'instant' | 'step-by-step'>('step-by-step');

  // Processing Queue states
  const [queue, setQueue] = useState<ProcessingItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat Area states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your assistant. Ask me anything about your files and memory graph.',
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulation of processing queue progress
  useEffect(() => {
    const timer = setInterval(() => {
      setQueue((prevQueue) =>
        prevQueue.map((item) => {
          if (item.status === 'processing') {
            const nextProgress = item.progress + Math.floor(Math.random() * 15) + 5;
            if (nextProgress >= 100) {
              return { ...item, progress: 100, status: 'completed' };
            }
            return { ...item, progress: nextProgress };
          }
          if (item.status === 'queued') {
            const hasActiveProcessing = prevQueue.some(
              (i) => i.status === 'processing'
            );
            if (!hasActiveProcessing && prevQueue.indexOf(item) === prevQueue.findIndex(i => i.status === 'queued')) {
              return { ...item, status: 'processing' };
            }
          }
          return item;
        })
      );
    }, 1200);

    return () => clearInterval(timer);
  }, [queue]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      let formattedUrl = urlInput.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
      if (!urls.includes(formattedUrl)) {
        setUrls((prev) => [...prev, formattedUrl]);
      }
      setUrlInput('');
    }
  };

  const removeUrl = (indexToRemove: number) => {
    setUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleImportSubmit = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newItems: ProcessingItem[] = [];
    files.forEach((file) => {
      newItems.push({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: 'file',
        progress: 0,
        status: 'queued',
        sizeOrUrl: `${(file.size / 1024).toFixed(1)} KB`,
        method: 'POST',
        endpoint: `/v1/memories/upload`,
        timestamp: now,
      });
    });
    urls.forEach((url) => {
      newItems.push({
        id: Math.random().toString(36).substring(7),
        name: url.replace(/^https?:\/\/(www\.)?/, ''),
        type: 'url',
        progress: 0,
        status: 'queued',
        sizeOrUrl: url,
        method: 'POST',
        endpoint: `/v1/memories/crawl`,
        timestamp: now,
      });
    });
    setQueue((prev) => [...prev, ...newItems]);
    setFiles([]);
    setUrls([]);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      const newMsg: ChatMessage = {
        sender: 'user',
        text: chatInput.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      setChatInput('');

      // Mock bot reply
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Analyzing query: "${newMsg.text}". Let me check your knowledge base and container tags.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1000);
    }
  };

  const clearCompleted = () => {
    setQueue((prev) => prev.filter((item) => item.status !== 'completed'));
  };

  const totalItemsToImport = files.length + urls.length;

  if (activeId === 'organization') {
    return <Organization />;
  }

  if (activeId === 'advanced') {
    return <Advanced />;
  }

  if (activeId === 'api-keys') {
    return <ApiKeys />;
  }

  // Playground Chat Tab
  if (activeId === 'playground') {
    return (
      <main className="workspace workspace-chat-layout">
        <div className="chat-hero-container">
          {/* Centered Hero Title */}
          <div className="chat-hero-header">
            <div className="chat-hero-icon">
              <Sparkles size={20} strokeWidth={1.5} />
            </div>
            <h1 className="chat-hero-title">See what Cairel can do</h1>
          </div>

          {/* Minimal Input Card */}
          <div className="chat-input-card">
            {/* Top status bar */}
            <div className="chat-card-status-bar">
              <span className="chat-status-badge">
                <FileText size={12} strokeWidth={1.5} />
                <span>Documents</span>
              </span>
              <button className="chat-container-select" type="button">
                <Database size={11} strokeWidth={1.5} />
                <span>default_workspace</span>
                <ChevronDown size={11} strokeWidth={1.5} />
              </button>
            </div>

            {/* Text area */}
            <form onSubmit={handleSendChat} className="chat-card-input-area">
              <textarea
                placeholder="Ask anything about your knowledge base..."
                className="chat-card-textarea"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat(e);
                  }
                }}
              />
            </form>

            {/* Bottom toolbar */}
            <div className="chat-card-toolbar">
              <button className="chat-toolbar-icon-btn" type="button" title="Reset">
                <RotateCw size={13} strokeWidth={1.5} />
              </button>
              <div className="chat-toolbar-right">
                <button className="chat-model-select" type="button">
                  <span className="model-dot" />
                  <span>Sonnet 4.6</span>
                  <ChevronDown size={11} strokeWidth={1.5} />
                </button>
                <button className="chat-toolbar-icon-btn" type="button" title="Settings">
                  <SlidersHorizontal size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Action pill buttons */}
          <div className="chat-action-pills">
            <button className="chat-pill-btn" type="button">
              <Database size={12} strokeWidth={1.5} />
              <span>Memories</span>
            </button>
            <button className="chat-pill-btn" type="button">
              <Bot size={12} strokeWidth={1.5} />
              <span>Agent</span>
            </button>
            <button className="chat-pill-btn" type="button">
              <GitGraph size={12} strokeWidth={1.5} />
              <span>Graph</span>
            </button>
            <button className="chat-pill-btn" type="button">
              <FileText size={12} strokeWidth={1.5} />
              <span>Docs</span>
            </button>
            <button className="chat-pill-btn" type="button">
              <User size={12} strokeWidth={1.5} />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Messages feed */}
        {messages.length > 1 && (
          <div className="chat-messages-overlay">
            <div className="chat-messages-box">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble-row chat-bubble-row--${msg.sender}`}>
                  <div className="chat-bubble-content">{msg.text}</div>
                  <div className="chat-bubble-time">{msg.timestamp}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>
    );
  }

  // Memory Graph tab
  if (activeId === 'memory-graph') {
    const completedItems = queue.filter((i) => i.status === 'completed');
    const hasNodes = completedItems.length > 0;

    return (
      <main className="workspace">
        <div className="graph-container">
          <div className="graph-header">
            <h1 className="graph-title">Memory Graph</h1>
            <p className="graph-subtitle">Visual topological mapping of indexed knowledge nodes and relationships</p>
          </div>

          {!hasNodes ? (
            <div className="graph-empty-state">
              <div className="graph-empty-icon">
                <GitGraph size={32} strokeWidth={1.2} />
              </div>
              <h3 className="graph-empty-title">No nodes indexed yet</h3>
              <p className="graph-empty-text">
                Import files or URLs to automatically generate your visual memory graph.
              </p>
            </div>
          ) : (
            <div className="graph-canvas-wrapper">
              <div className="graph-stats-bar">
                <div className="graph-stat">
                  <Zap size={12} strokeWidth={1.5} />
                  <span>{completedItems.length} nodes</span>
                </div>
                <div className="graph-stat">
                  <GitGraph size={12} strokeWidth={1.5} />
                  <span>{completedItems.length} links</span>
                </div>
              </div>
              <div className="graph-canvas-area">
                {completedItems.map((item, idx) => {
                  const angle = (idx / completedItems.length) * Math.PI * 2 - Math.PI / 2;
                  const radiusX = 220;
                  const radiusY = 160;
                  const cx = 50 + (Math.cos(angle) * radiusX / (radiusX + 80)) * 40;
                  const cy = 50 + (Math.sin(angle) * radiusY / (radiusY + 80)) * 35;

                  return (
                    <React.Fragment key={item.id}>
                      <svg className="graph-edge-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line
                          x1="50%" y1="50%"
                          x2={`${cx}%`} y2={`${cy}%`}
                          stroke="#222222"
                          strokeWidth="0.25"
                        />
                      </svg>
                      <div
                        className={`graph-node graph-node--${item.type}`}
                        style={{ left: `${cx}%`, top: `${cy}%` }}
                        title={item.name}
                      >
                        <div className="graph-node-dot" />
                        <span className="graph-node-label">{item.name.length > 18 ? item.name.slice(0, 18) + '…' : item.name}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
                {/* Center node */}
                <div className="graph-node graph-node--center" style={{ left: '50%', top: '50%' }}>
                  <div className="graph-node-dot graph-node-dot--center" />
                  <span className="graph-node-label">Cairel</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Overview Tab
  if (activeId === 'overview') {
    const completedFiles = queue.filter(item => item.type === 'file' && item.status === 'completed');
    const completedUrls = queue.filter(item => item.type === 'url' && item.status === 'completed');
    const documentCount = completedFiles.length + completedUrls.length;
    const memoryCount = queue.filter(item => item.status === 'completed').length;
    const searchRequestsCount = messages.filter(m => m.sender === 'user').length;
    const tagCount = containerTag.trim() ? 1 : 0;
    const connectorsCount = 0;

    return (
      <main className="workspace-layout overflow-y-auto">
        <div className="overview-container">
          {/* Header Row */}
          <div className="overview-header-row">
            <div>
              <h1 className="overview-title">Overview</h1>
              <p className="overview-subtitle">Real-time system telemetry and knowledge layer activity</p>
            </div>
            <div className="period-selector">
              {(['1d', '7d', '30d', 'all'] as const).map((period) => (
                <button
                  key={period}
                  className={`period-btn ${timeRange === period ? 'period-btn--active' : ''}`}
                  onClick={() => setTimeRange(period)}
                >
                  {period === 'all' ? 'All' : period}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="metrics-grid">
            {/* Documents */}
            <div className="metric-card">
              <div className="metric-label">Documents</div>
              <div className="metric-value-row">
                <span className="metric-number">{documentCount}</span>
                {documentCount > 0 && (
                  <span className="metric-trend trend-up">
                    <svg className="sparkline" viewBox="0 0 36 12" width="36" height="12">
                      <path d="M0,10 Q9,2 18,7 T36,2" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* Memories */}
            <div className="metric-card">
              <div className="metric-label">Memories</div>
              <div className="metric-value-row">
                <span className="metric-number">{memoryCount}</span>
                {memoryCount > 0 && (
                  <span className="metric-trend trend-up">
                    <svg className="sparkline" viewBox="0 0 36 12" width="36" height="12">
                      <path d="M0,11 Q7,8 14,2 T28,6 T36,1" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* Search Requests */}
            <div className="metric-card">
              <div className="metric-label">Search Requests</div>
              <div className="metric-value-row">
                <span className="metric-number">{searchRequestsCount}</span>
              </div>
            </div>

            {/* Container Tags */}
            <div className="metric-card">
              <div className="metric-label">Container Tags</div>
              <div className="metric-value-row">
                <span className="metric-number">{tagCount}</span>
                {tagCount > 0 && (
                  <span className="metric-trend trend-up">
                    <svg className="sparkline" viewBox="0 0 36 12" width="36" height="12">
                      <path d="M0,9 Q9,11 18,2 T36,3" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* Connectors */}
            <div className="metric-card">
              <div className="metric-label">Connectors</div>
              <div className="metric-value-row">
                <span className="metric-number">{connectorsCount}</span>
              </div>
            </div>
          </div>

          {/* Setup / Onboarding Section */}
          <div className="onboarding-section">
            <h2 className="section-title">Get Started</h2>

            {/* Choice Cards */}
            <div className="onboarding-choice-grid">
              <div
                className={`choice-card ${onboardingFlow === 'instant' ? 'choice-card--active' : ''}`}
                onClick={() => setOnboardingFlow('instant')}
              >
                <div className="choice-icon-wrapper">
                  <Zap size={15} strokeWidth={1.5} />
                </div>
                <div className="choice-content">
                  <h3 className="choice-title">Instant Setup</h3>
                  <p className="choice-desc">Single-command integration to connect Cairel memory layer with your agent.</p>
                </div>
                {onboardingFlow === 'instant' && (
                  <div className="check-badge">
                    <Check size={11} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <div
                className={`choice-card ${onboardingFlow === 'step-by-step' ? 'choice-card--active' : ''}`}
                onClick={() => setOnboardingFlow('step-by-step')}
              >
                <div className="choice-icon-wrapper">
                  <Clock size={15} strokeWidth={1.5} />
                </div>
                <div className="choice-content">
                  <h3 className="choice-title">Step by Step</h3>
                  <p className="choice-desc">Custom workflow: import sources, test recall in playground, generate scoped keys.</p>
                </div>
                {onboardingFlow === 'step-by-step' && (
                  <div className="check-badge">
                    <Check size={11} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </div>

            {/* Checklist Cards */}
            <div className="checklist-grid">
              {/* Card 1: Add first memory */}
              <div className={`checklist-card ${memoryCount > 0 ? 'done' : ''}`}>
                <div className="checklist-card-header">
                  <div className={memoryCount > 0 ? 'check-status-badge' : 'checklist-icon-badge'}>
                    {memoryCount > 0 ? <Check size={12} strokeWidth={1.5} /> : <UploadCloud size={13} strokeWidth={1.5} />}
                  </div>
                  {memoryCount > 0 && <span className="step-tag-done">Completed</span>}
                </div>
                <h4 className="checklist-title">Import knowledge</h4>
                <p className="checklist-desc">Upload documents, markdown files, or URLs to index.</p>
                <button className="checklist-action-btn" onClick={() => setActiveId('import')}>
                  <span>{memoryCount > 0 ? 'View items' : 'Import items'}</span>
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                </button>
              </div>

              {/* Card 2: Try playground */}
              <div className="checklist-card">
                <div className="checklist-card-header">
                  <div className="checklist-icon-badge">
                    <Sparkles size={13} strokeWidth={1.5} />
                  </div>
                </div>
                <h4 className="checklist-title">Test Playground</h4>
                <p className="checklist-desc">Run queries and evaluate semantic retrieval speed.</p>
                <button className="checklist-action-btn" onClick={() => setActiveId('playground')}>
                  <span>Open Playground</span>
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                </button>
              </div>

              {/* Card 3: Connect source */}
              <div className="checklist-card">
                <div className="checklist-card-header">
                  <div className="checklist-icon-badge">
                    <Globe size={13} strokeWidth={1.5} />
                  </div>
                </div>
                <h4 className="checklist-title">Connect Sources</h4>
                <p className="checklist-desc">Sync GitHub, Notion, or webhooks continuously.</p>
                <button className="checklist-action-btn" onClick={() => setActiveId('connectors')}>
                  <span>Connect source</span>
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                </button>
              </div>

              {/* Card 4: Create API key */}
              <div className="checklist-card">
                <div className="checklist-card-header">
                  <div className="checklist-icon-badge">
                    <KeyRound size={13} strokeWidth={1.5} />
                  </div>
                </div>
                <h4 className="checklist-title">Generate API Key</h4>
                <p className="checklist-desc">Access memory endpoints programmatically via SDK.</p>
                <button className="checklist-action-btn" onClick={() => setActiveId('api-keys')}>
                  <span>Manage keys</span>
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Explore Platform Section */}
          <div className="explore-section">
            <h2 className="section-title">Explore Platform</h2>
            <div className="explore-grid">
              <div className="explore-card" onClick={() => setActiveId('import')}>
                <div className="explore-card-left">
                  <UploadCloud className="explore-icon" size={15} strokeWidth={1.5} />
                  <div>
                    <h4 className="explore-card-title">Quick Ingestion</h4>
                    <p className="explore-card-desc">Batch file upload & crawler</p>
                  </div>
                </div>
                <ArrowUpRight className="explore-arrow" size={13} strokeWidth={1.5} />
              </div>

              <div className="explore-card" onClick={() => setActiveId('playground')}>
                <div className="explore-card-left">
                  <Sparkles className="explore-icon" size={15} strokeWidth={1.5} />
                  <div>
                    <h4 className="explore-card-title">Semantic Search</h4>
                    <p className="explore-card-desc">Interactive memory playground</p>
                  </div>
                </div>
                <ArrowUpRight className="explore-arrow" size={13} strokeWidth={1.5} />
              </div>

              <div className="explore-card" onClick={() => setActiveId('memory-graph')}>
                <div className="explore-card-left">
                  <GitGraph className="explore-icon" size={15} strokeWidth={1.5} />
                  <div>
                    <h4 className="explore-card-title">Memory Graph</h4>
                    <p className="explore-card-desc">Node clustering visualizer</p>
                  </div>
                </div>
                <ArrowUpRight className="explore-arrow" size={13} strokeWidth={1.5} />
              </div>

              <div className="explore-card" onClick={() => setActiveId('documents')}>
                <div className="explore-card-left">
                  <BookOpen className="explore-icon" size={15} strokeWidth={1.5} />
                  <div>
                    <h4 className="explore-card-title">Documentation</h4>
                    <p className="explore-card-desc">API schema and guides</p>
                  </div>
                </div>
                <ArrowUpRight className="explore-arrow" size={13} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (activeId === 'api-keys') {
    return <ApiKeys />;
  }

  if (activeId === 'organization') {
    return <Organization />;
  }

  if (activeId === 'advanced') {
    return <Advanced />;
  }

  if (activeId !== 'import') {
    return (
      <main className="workspace">
        <div className="empty-state-view">
          <h2>{activeId.replace('-', ' ').toUpperCase()}</h2>
          <p>Content for this section is currently syncing.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="workspace-layout">
      {/* Left Column: Import Form */}
      <div className="workspace-main-content">
        <div className="import-container">
          <div className="import-header">
            <h1 className="import-title">Knowledge Base</h1>
            <p className="import-subtitle">Upload files or ingest URLs to index into your memory layer</p>
          </div>

          {/* Upload card */}
          <div className="premium-card">
            <h2 className="section-label">Upload Files</h2>
            <div
              className={`dropzone ${isDragging ? 'dropzone--dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div className="dropzone-content-wrapper">
                <div className="dropzone-icon-wrapper">
                  <UploadCloud size={18} strokeWidth={1.5} />
                </div>
                <div className="dropzone-text-primary">
                  Drag & drop files or <span className="browse-link">browse</span>
                </div>
                <div className="dropzone-text-secondary">
                  TXT, MD, JSON, PDF, DOCX, CSV
                </div>
              </div>
            </div>

            {/* Render selected files */}
            {files.length > 0 && (
              <div className="imported-items-list">
                {files.map((file, idx) => (
                  <div key={idx} className="imported-item-pill">
                    <FileText size={12} strokeWidth={1.5} className="pill-type-icon" />
                    <span className="item-pill-text">{file.name}</span>
                    <button className="remove-pill-btn" onClick={(e) => { e.stopPropagation(); removeFile(idx); }}>
                      <X size={11} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add URLs card */}
          <div className="premium-card">
            <h2 className="section-label">Web Endpoints & URLs</h2>
            <form onSubmit={handleAddUrl} className="url-input-wrapper">
              <div className="url-input-container">
                <Globe className="url-icon" size={14} strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="https://example.com/documentation"
                  className="url-field"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
              <button type="submit" className="add-url-btn">
                <Plus size={13} strokeWidth={1.5} />
                <span>Add</span>
              </button>
            </form>

            {/* Render added URLs */}
            {urls.length > 0 && (
              <div className="imported-items-list">
                {urls.map((url, idx) => (
                  <div key={idx} className="imported-item-pill url-pill">
                    <Globe size={12} strokeWidth={1.5} className="pill-type-icon" />
                    <span className="item-pill-text">{url}</span>
                    <button className="remove-pill-btn" onClick={() => removeUrl(idx)}>
                      <X size={11} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meta Grid (Container Tag & Task Type) */}
          <div className="import-meta-grid">
            <div className="premium-card">
              <h2 className="section-label">Container Tag (Optional)</h2>
              <div className="tag-input-container">
                <FolderTree className="tag-icon" size={14} strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="e.g. project-core, docs-v2"
                  className="tag-field"
                  value={containerTag}
                  onChange={(e) => setContainerTag(e.target.value)}
                />
              </div>
            </div>

            <div className="premium-card">
              <h2 className="section-label">Extraction Pipeline</h2>
              <div className="task-type-selector">
                <button
                  type="button"
                  className={`task-type-btn ${taskType === 'Memory' ? 'task-type-btn--active' : ''}`}
                  onClick={() => setTaskType('Memory')}
                >
                  <Database size={13} strokeWidth={1.5} />
                  <span>Memory</span>
                  {taskType === 'Memory' && <Check size={11} strokeWidth={1.5} className="check-indicator" />}
                </button>
                <button
                  type="button"
                  className={`task-type-btn ${taskType === 'SuperRAG' ? 'task-type-btn--active' : ''}`}
                  onClick={() => setTaskType('SuperRAG')}
                >
                  <Sparkles size={13} strokeWidth={1.5} />
                  <span>SuperRAG</span>
                  {taskType === 'SuperRAG' && <Check size={11} strokeWidth={1.5} className="check-indicator" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="button"
            className={`submit-import-btn ${totalItemsToImport > 0 ? 'submit-import-btn--active' : ''}`}
            disabled={totalItemsToImport === 0}
            onClick={handleImportSubmit}
          >
            Import {totalItemsToImport} {totalItemsToImport === 1 ? 'item' : 'items'}
          </button>
        </div>
      </div>

      {/* Right Column: Requests Log Panel */}
      <aside className="workspace-queue-panel">
        <div className="queue-header">
          <div className="queue-header-left">
            <h2 className="queue-title">Requests</h2>
            <div className="queue-count-badge">{queue.length}</div>
          </div>
          {queue.some((i) => i.status === 'completed') && (
            <button className="clear-completed-btn" onClick={clearCompleted}>
              Clear
            </button>
          )}
        </div>

        <div className="queue-content">
          {queue.length === 0 ? (
            <div className="queue-empty-state">
              <div className="queue-empty-illustration">
                <Clock size={24} strokeWidth={1.2} />
              </div>
              <p className="empty-text-primary">No active requests</p>
              <p className="empty-text-secondary">Ingestion pipeline logs will stream here in real time</p>
            </div>
          ) : (
            <div className="queue-items-container">
              {queue.map((item) => (
                <div key={item.id} className={`req-card req-card--${item.status}`}>
                  <div className="req-top-row">
                    <div className="req-left">
                      <span className="req-method-badge">{item.method}</span>
                      <code className="req-endpoint">{item.endpoint}</code>
                    </div>
                    <span className={`req-status-code ${
                      item.status === 'completed' ? 'req-status-code--200' :
                      item.status === 'processing' ? 'req-status-code--pending' :
                      'req-status-code--queued'
                    }`}>
                      {item.status === 'completed' ? '200' :
                       item.status === 'processing' ? 'Pending' :
                       'Queued'}
                    </span>
                  </div>

                  <div className="req-body-row">
                    <div className="req-body-label">
                      {item.type === 'file' ? (
                        <FileText size={11} strokeWidth={1.5} className="req-body-icon" />
                      ) : (
                        <Globe size={11} strokeWidth={1.5} className="req-body-icon" />
                      )}
                      <span className="req-body-name" title={item.name}>{item.name}</span>
                    </div>
                    <span className="req-body-size">{item.sizeOrUrl}</span>
                  </div>

                  {item.status === 'processing' && (
                    <div className="req-progress-row">
                      <div className="queue-progress-bar-bg">
                        <div
                          className="queue-progress-bar-fill"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="req-progress-pct">
                        <Loader2 size={9} strokeWidth={1.5} className="spin-icon" />
                        {item.progress}%
                      </span>
                    </div>
                  )}

                  <div className="req-footer-row">
                    <span className="req-timestamp">{item.timestamp}</span>
                    {item.status === 'completed' && (
                      <span className="req-complete-badge">
                        <CheckCircle2 size={10} strokeWidth={1.5} />
                        Indexed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </main>
  );
};
