import React, { useState } from 'react';
import {
  Plus,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  ChevronDown,
  Shield,
  Clock,
} from 'lucide-react';
import type { ApiKey } from '../types';
import { copyToClipboard, formatDate } from '../utils';

export const ApiKeys: React.FC = () => {
  // API Keys states
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [keyPermissionType, setKeyPermissionType] = useState<'full' | 'scoped'>('full');
  const [scopedContentTag, setScopedContentTag] = useState('');
  const [allowedEndpoints, setAllowedEndpoints] = useState<string[]>(['documents', 'memories']);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const generateApiKey = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const segments = [
      Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
      Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
      Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
      Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
    ];
    return `sk_live_${segments.join('')}`;
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const fullKey = generateApiKey();
    
    let keyPermissions: string[] = [];
    if (keyPermissionType === 'full') {
      keyPermissions = ['Full Access'];
    } else {
      keyPermissions = allowedEndpoints.map(ep => ep.charAt(0).toUpperCase() + ep.slice(1));
      if (scopedContentTag.trim()) {
        keyPermissions.unshift(`Tag: ${scopedContentTag.trim()}`);
      }
    }

    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName.trim(),
      key: fullKey,
      prefix: fullKey.slice(0, 12) + '...' + fullKey.slice(-4),
      createdAt: new Date().toISOString(),
      lastUsed: null,
      permissions: keyPermissions,
    };
    setApiKeys(prev => [newKey, ...prev]);
    setNewlyCreatedKey(newKey);
    setNewKeyName('');
    setKeyPermissionType('full');
    setScopedContentTag('');
    setAllowedEndpoints(['documents', 'memories']);
    setShowCreateKeyModal(false);
  };

  const handleCopyKey = async (key: ApiKey) => {
    const success = await copyToClipboard(key.key);
    if (success) {
      setCopiedKeyId(key.id);
      setTimeout(() => setCopiedKeyId(null), 2000);
    }
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    setDeleteConfirmId(null);
    if (newlyCreatedKey?.id === id) setNewlyCreatedKey(null);
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="workspace-layout overflow-y-auto">
      <div className="overview-container">
        {/* Header */}
        <div className="overview-header-row">
          <div>
            <h1 className="overview-title">API Keys</h1>
            <p className="apikeys-subtitle">Manage programmatic access credentials and scoped secret keys</p>
          </div>
          <button className="apikeys-create-btn" onClick={() => setShowCreateKeyModal(true)}>
            <Plus size={14} strokeWidth={1.5} />
            <span>Create key</span>
          </button>
        </div>

        {/* Newly created key banner */}
        {newlyCreatedKey && (
          <div className="apikeys-new-key-banner">
            <div className="apikeys-banner-header">
              <div className="apikeys-banner-icon">
                <AlertTriangle size={14} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="apikeys-banner-title">Secret key generated</h4>
                <p className="apikeys-banner-desc">Save this key now. For security, it will not be displayed again.</p>
              </div>
            </div>

            <div className="apikeys-banner-key-row">
              <code className="apikeys-banner-key-value">{newlyCreatedKey.key}</code>
              <button
                className="apikeys-banner-copy-btn"
                onClick={() => handleCopyKey(newlyCreatedKey)}
              >
                {copiedKeyId === newlyCreatedKey.id ? (
                  <>
                    <Check size={12} strokeWidth={1.5} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} strokeWidth={1.5} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <button
              className="apikeys-banner-dismiss"
              onClick={() => setNewlyCreatedKey(null)}
            >
              I have stored this key safely
            </button>
          </div>
        )}

        {/* API Keys Table or Empty State */}
        {apiKeys.length === 0 ? (
          <div className="apikeys-empty-state">
            <div className="apikeys-empty-icon">
              <KeyRound size={28} strokeWidth={1.2} />
            </div>
            <h3 className="apikeys-empty-title">No API keys created</h3>
            <p className="apikeys-empty-desc">
              Generate an API key to connect your application, Python agent, or CLI to the Cairel engine.
            </p>
            <button className="apikeys-create-btn" onClick={() => setShowCreateKeyModal(true)}>
              <Plus size={14} strokeWidth={1.5} />
              <span>Create first key</span>
            </button>
          </div>
        ) : (
          <div className="apikeys-table-wrapper">
            <div className="apikeys-table-header">
              <div>Name</div>
              <div>Key</div>
              <div>Permissions</div>
              <div>Created</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>

            {apiKeys.map((key) => {
              const isRevealed = revealedKeys.has(key.id);
              const isDeleting = deleteConfirmId === key.id;

              return (
                <div key={key.id} className="apikeys-table-row">
                  <div className="apikeys-col-name">
                    <KeyRound size={13} strokeWidth={1.5} className="apikeys-row-icon" />
                    <span>{key.name}</span>
                  </div>

                  <div className="apikeys-col-key">
                    <code className="apikeys-key-code">
                      {isRevealed ? key.key : key.prefix}
                    </code>
                  </div>

                  <div className="apikeys-col-perms">
                    {key.permissions.map((p, i) => (
                      <span
                        key={i}
                        className={`apikeys-perm-badge ${
                          p.toLowerCase().includes('full')
                            ? 'apikeys-perm-read'
                            : 'apikeys-perm-write'
                        }`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="apikeys-col-created">
                    <span title={key.createdAt}>{formatDate(key.createdAt)}</span>
                  </div>

                  <div className="apikeys-col-actions">
                    <button
                      className="apikeys-action-icon"
                      title={isRevealed ? 'Hide key' : 'Show key'}
                      onClick={() => toggleReveal(key.id)}
                    >
                      {isRevealed ? (
                        <EyeOff size={13} strokeWidth={1.5} />
                      ) : (
                        <Eye size={13} strokeWidth={1.5} />
                      )}
                    </button>

                    <button
                      className="apikeys-action-icon"
                      title="Copy key"
                      onClick={() => handleCopyKey(key)}
                    >
                      {copiedKeyId === key.id ? (
                        <Check size={13} strokeWidth={1.5} style={{ color: '#22c55e' }} />
                      ) : (
                        <Copy size={13} strokeWidth={1.5} />
                      )}
                    </button>

                    {isDeleting ? (
                      <button
                        className="apikeys-action-icon apikeys-action-danger-active"
                        title="Click again to confirm delete"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        <Check size={13} strokeWidth={1.5} />
                      </button>
                    ) : (
                      <button
                        className="apikeys-action-icon apikeys-action-danger"
                        title="Delete key"
                        onClick={() => setDeleteConfirmId(key.id)}
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Key Modal */}
      {showCreateKeyModal && (
        <div className="apikeys-modal-overlay" onClick={() => setShowCreateKeyModal(false)}>
          <div className="apikeys-modal" onClick={(e) => e.stopPropagation()}>
            <div className="apikeys-modal-header">
              <div className="modal-title-row">
                <Shield size={16} strokeWidth={1.5} />
                <h3 className="apikeys-modal-title">Create API Key</h3>
              </div>
            </div>

            <div className="apikeys-modal-body">
              <div>
                <label className="apikeys-modal-label">Key Name</label>
                <input
                  type="text"
                  placeholder="e.g. production-backend, cursor-agent"
                  className="apikeys-modal-input"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newKeyName.trim()) {
                      handleCreateKey();
                    }
                  }}
                />
              </div>

              <div>
                <label className="apikeys-modal-label">Access Scope</label>
                <div className="apikeys-perm-toggle-row">
                  <button
                    type="button"
                    className={`apikeys-perm-type-btn ${keyPermissionType === 'full' ? 'apikeys-perm-type-btn--active' : ''}`}
                    onClick={() => setKeyPermissionType('full')}
                  >
                    Full Access
                  </button>
                  <button
                    type="button"
                    className={`apikeys-perm-type-btn ${keyPermissionType === 'scoped' ? 'apikeys-perm-type-btn--active' : ''}`}
                    onClick={() => setKeyPermissionType('scoped')}
                  >
                    Scoped Access
                  </button>
                </div>
              </div>

              {keyPermissionType === 'scoped' && (
                <>
                  <div>
                    <label className="apikeys-modal-label">Restricted Container Tag</label>
                    <div className="apikeys-dropdown-wrapper">
                      <input
                        type="text"
                        placeholder="Tag name (e.g. default, project-docs)"
                        className="apikeys-modal-input dropdown-input"
                        value={scopedContentTag}
                        onChange={(e) => setScopedContentTag(e.target.value)}
                      />
                      <ChevronDown size={13} strokeWidth={1.5} className="apikeys-dropdown-arrow" />
                    </div>
                  </div>

                  <div>
                    <label className="apikeys-modal-label">Permitted Endpoints</label>
                    <div className="apikeys-endpoints-row">
                      {['documents', 'memories', 'search', 'graph'].map((endpoint) => {
                        const isAllowed = allowedEndpoints.includes(endpoint);
                        return (
                          <button
                            key={endpoint}
                            type="button"
                            className={`apikeys-endpoint-btn ${isAllowed ? 'apikeys-endpoint-btn--active' : ''}`}
                            onClick={() => {
                              if (isAllowed) {
                                setAllowedEndpoints(prev => prev.filter(e => e !== endpoint));
                              } else {
                                setAllowedEndpoints(prev => [...prev, endpoint]);
                              }
                            }}
                          >
                            <Check size={11} strokeWidth={1.5} className={isAllowed ? 'check-visible' : 'check-hidden'} />
                            <span>/{endpoint}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className="apikeys-modal-info">
                <Clock size={12} strokeWidth={1.5} />
                <span>Keys authenticate requests using standard Bearer token headers.</span>
              </div>
            </div>

            <div className="apikeys-modal-footer">
              <button
                className="apikeys-modal-cancel"
                onClick={() => setShowCreateKeyModal(false)}
              >
                Cancel
              </button>
              <button
                className={`apikeys-modal-submit ${newKeyName.trim() ? 'apikeys-modal-submit--active' : ''}`}
                disabled={!newKeyName.trim()}
                onClick={handleCreateKey}
              >
                Generate key
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
