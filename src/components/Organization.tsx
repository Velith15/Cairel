import React, { useState } from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  Mail,
  UserPlus,
  Trash2,
  Check,
  Copy,
  Crown,
  Lock,
  Globe,
  SlidersHorizontal,
  FolderGit2,
  Save,
} from 'lucide-react';
import type { TeamMember } from '../types';
import { OrganizationService } from '../services/organizationService';
import { copyToClipboard } from '../utils';

export const Organization: React.FC = () => {
  // General Info State
  const [orgName, setOrgName] = useState('Cairel Engineering');
  const [orgSlug, setOrgSlug] = useState('cairel-eng');
  const [orgDomain, setOrgDomain] = useState('cairel.ai');
  const [billingEmail, setBillingEmail] = useState('billing@cairel.ai');
  const [orgDescription, setOrgDescription] = useState(
    'Central R&D intelligence workspace for Cairel memory graph and semantic agent pipelines.'
  );
  const [savedBanner, setSavedBanner] = useState(false);

  // Members & Invitations State
  const [members, setMembers] = useState<TeamMember[]>(OrganizationService.getInitialMembers());
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member' | 'Viewer'>('Member');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Enterprise Security State
  const [ssoEnforced, setSsoEnforced] = useState(true);
  const [domainCapture, setDomainCapture] = useState(true);
  const [auditLogRetention, setAuditLogRetention] = useState('90');
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);

  // Save Settings
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = OrganizationService.createMember(inviteEmail, inviteRole);
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCopyOrgId = async () => {
    const id = 'org_9f83a812bf094628a8';
    const success = await copyToClipboard(id);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <main className="workspace-layout overflow-y-auto">
      <div className="overview-container">
        {/* Header Row */}
        <div className="overview-header-row">
          <div>
            <div className="settings-page-badge">
              <Building2 size={12} strokeWidth={1.5} />
              <span>Organization Settings</span>
            </div>
            <h1 className="overview-title">Organization Profile & Team</h1>
            <p className="apikeys-subtitle">
              Manage organization metadata, verified domains, team access levels, and security policies.
            </p>
          </div>

          <div className="org-header-actions">
            <button className="secondary-action-btn" onClick={handleCopyOrgId}>
              {copiedId ? (
                <>
                  <Check size={13} strokeWidth={1.5} style={{ color: '#22c55e' }} />
                  <span>Copied Org ID</span>
                </>
              ) : (
                <>
                  <Copy size={13} strokeWidth={1.5} />
                  <span>Copy Org ID</span>
                </>
              )}
            </button>
            <button className="apikeys-create-btn" onClick={() => setShowInviteModal(true)}>
              <UserPlus size={14} strokeWidth={1.5} />
              <span>Invite member</span>
            </button>
          </div>
        </div>

        {/* Success toast / banner */}
        {savedBanner && (
          <div className="settings-success-banner">
            <Check size={14} strokeWidth={1.5} />
            <span>Organization profile and preferences successfully updated.</span>
          </div>
        )}

        {/* Top Summary Metrics */}
        <div className="settings-stat-grid">
          <div className="settings-stat-card">
            <div className="settings-stat-label">
              <Users size={13} strokeWidth={1.5} />
              <span>Active Members</span>
            </div>
            <div className="settings-stat-val">
              {members.length} <span className="settings-stat-sub">/ 25 seats</span>
            </div>
          </div>

          <div className="settings-stat-card">
            <div className="settings-stat-label">
              <Crown size={13} strokeWidth={1.5} />
              <span>Workspace Plan</span>
            </div>
            <div className="settings-stat-val">
              Enterprise <span className="settings-stat-badge">Active</span>
            </div>
          </div>

          <div className="settings-stat-card">
            <div className="settings-stat-label">
              <ShieldCheck size={13} strokeWidth={1.5} />
              <span>SSO & SAML</span>
            </div>
            <div className="settings-stat-val">
              {ssoEnforced ? 'Enforced' : 'Optional'}
              <span className="settings-stat-sub">({orgDomain})</span>
            </div>
          </div>

          <div className="settings-stat-card">
            <div className="settings-stat-label">
              <FolderGit2 size={13} strokeWidth={1.5} />
              <span>Knowledge Scopes</span>
            </div>
            <div className="settings-stat-val">
              Unlimited <span className="settings-stat-sub">tags active</span>
            </div>
          </div>
        </div>

        {/* Form Grid */}
        <div className="settings-section-card">
          <div className="settings-card-header">
            <div>
              <h2 className="settings-card-title">General Information</h2>
              <p className="settings-card-subtitle">
                Core identity and routing parameters for API requests and integrations
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveGeneral} className="settings-form-body">
            <div className="settings-two-col">
              <div className="settings-input-group">
                <label className="settings-label">Organization Name</label>
                <input
                  type="text"
                  className="settings-input"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </div>

              <div className="settings-input-group">
                <label className="settings-label">Organization Slug (URL identifier)</label>
                <div className="settings-input-prefix-wrap">
                  <span className="settings-input-prefix">cairel.ai/org/</span>
                  <input
                    type="text"
                    className="settings-input settings-input--prefixed"
                    value={orgSlug}
                    onChange={(e) => setOrgSlug(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="settings-two-col">
              <div className="settings-input-group">
                <label className="settings-label">Primary Corporate Domain</label>
                <div className="settings-input-icon-wrap">
                  <Globe size={14} strokeWidth={1.5} className="settings-input-icon" />
                  <input
                    type="text"
                    className="settings-input settings-input--icon"
                    value={orgDomain}
                    onChange={(e) => setOrgDomain(e.target.value)}
                  />
                </div>
              </div>

              <div className="settings-input-group">
                <label className="settings-label">Billing Notifications Email</label>
                <div className="settings-input-icon-wrap">
                  <Mail size={14} strokeWidth={1.5} className="settings-input-icon" />
                  <input
                    type="email"
                    className="settings-input settings-input--icon"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="settings-input-group">
              <label className="settings-label">Description / Scope Summary</label>
              <textarea
                className="settings-textarea"
                rows={3}
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
              />
            </div>

            <div className="settings-form-actions">
              <button type="submit" className="settings-save-btn">
                <Save size={13} strokeWidth={1.5} />
                <span>Save changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Team Members List */}
        <div className="settings-section-card">
          <div className="settings-card-header">
            <div>
              <h2 className="settings-card-title">Team Members & Access Roles</h2>
              <p className="settings-card-subtitle">
                Users with access to organization datasets, playground instances, and API credentials
              </p>
            </div>
            <button className="secondary-action-btn" onClick={() => setShowInviteModal(true)}>
              <UserPlus size={13} strokeWidth={1.5} />
              <span>Invite</span>
            </button>
          </div>

          <div className="apikeys-table-wrapper">
            <div className="org-table-header">
              <div>User</div>
              <div>Role</div>
              <div>Status</div>
              <div>Joined</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>

            {members.map((member) => (
              <div key={member.id} className="org-table-row">
                <div className="org-col-user">
                  <div className="org-user-avatar">{member.avatarLetter}</div>
                  <div className="org-user-text">
                    <span className="org-user-name">{member.name}</span>
                    <span className="org-user-email">{member.email}</span>
                  </div>
                </div>

                <div className="org-col-role">
                  <span
                    className={`org-role-badge ${
                      member.role === 'Owner'
                        ? 'org-role-owner'
                        : member.role === 'Admin'
                        ? 'org-role-admin'
                        : 'org-role-member'
                    }`}
                  >
                    {member.role === 'Owner' && <Crown size={10} strokeWidth={1.5} className="mr-1" />}
                    {member.role}
                  </span>
                </div>

                <div className="org-col-status">
                  <span
                    className={`org-status-pill ${
                      member.status === 'Active' ? 'org-status--active' : 'org-status--invited'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="org-col-joined">
                  <span>{member.joinedAt}</span>
                </div>

                <div className="org-col-actions">
                  {member.role !== 'Owner' ? (
                    <button
                      className="apikeys-action-icon apikeys-action-danger"
                      title="Remove member"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  ) : (
                    <span className="org-owner-lock" title="Organization owner cannot be deleted">
                      <Lock size={12} strokeWidth={1.5} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Authentication Policies */}
        <div className="settings-section-card">
          <div className="settings-card-header">
            <div>
              <h2 className="settings-card-title">Security & Governance</h2>
              <p className="settings-card-subtitle">
                Authentication protocols, session isolation, and audit retention policies
              </p>
            </div>
          </div>

          <div className="settings-toggle-list">
            <div className="settings-toggle-item">
              <div className="settings-toggle-info">
                <div className="settings-toggle-title-row">
                  <ShieldCheck size={15} strokeWidth={1.5} className="text-emerald" />
                  <h4>Enforce SAML 2.0 / Single Sign-On (SSO)</h4>
                </div>
                <p>Require all team members with @{orgDomain} email addresses to log in via Okta or Google Workspace.</p>
              </div>
              <button
                type="button"
                className={`settings-switch ${ssoEnforced ? 'settings-switch--active' : ''}`}
                onClick={() => setSsoEnforced(!ssoEnforced)}
              >
                <div className="settings-switch-handle" />
              </button>
            </div>

            <div className="settings-toggle-item">
              <div className="settings-toggle-info">
                <div className="settings-toggle-title-row">
                  <Lock size={15} strokeWidth={1.5} />
                  <h4>Mandatory Two-Factor Authentication (2FA)</h4>
                </div>
                <p>Enforce TOTP or WebAuthn hardware security keys on all member accounts.</p>
              </div>
              <button
                type="button"
                className={`settings-switch ${twoFactorRequired ? 'settings-switch--active' : ''}`}
                onClick={() => setTwoFactorRequired(!twoFactorRequired)}
              >
                <div className="settings-switch-handle" />
              </button>
            </div>

            <div className="settings-toggle-item">
              <div className="settings-toggle-info">
                <div className="settings-toggle-title-row">
                  <Globe size={15} strokeWidth={1.5} />
                  <h4>Automatic Domain Account Capture</h4>
                </div>
                <p>Automatically assign newly signed-up users with verified company domain into this organization.</p>
              </div>
              <button
                type="button"
                className={`settings-switch ${domainCapture ? 'settings-switch--active' : ''}`}
                onClick={() => setDomainCapture(!domainCapture)}
              >
                <div className="settings-switch-handle" />
              </button>
            </div>

            <div className="settings-toggle-item">
              <div className="settings-toggle-info">
                <div className="settings-toggle-title-row">
                  <SlidersHorizontal size={15} strokeWidth={1.5} />
                  <h4>Audit Log Retention Period</h4>
                </div>
                <p>Specify how long granular API query logs and memory access trails are stored.</p>
              </div>
              <select
                className="settings-select"
                value={auditLogRetention}
                onChange={(e) => setAuditLogRetention(e.target.value)}
              >
                <option value="30">30 Days</option>
                <option value="90">90 Days (Enterprise Default)</option>
                <option value="180">180 Days</option>
                <option value="365">1 Year (Compliance)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="apikeys-modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="apikeys-modal" onClick={(e) => e.stopPropagation()}>
            <div className="apikeys-modal-header">
              <div className="modal-title-row">
                <UserPlus size={16} strokeWidth={1.5} />
                <h3 className="apikeys-modal-title">Invite Team Member</h3>
              </div>
            </div>

            <form onSubmit={handleInviteMember}>
              <div className="apikeys-modal-body">
                <div>
                  <label className="apikeys-modal-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="colleague@domain.com"
                    className="apikeys-modal-input"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="apikeys-modal-label">Role & Permissions</label>
                  <div className="role-selection-grid">
                    {(['Admin', 'Member', 'Viewer'] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        className={`role-select-card ${inviteRole === role ? 'role-select-card--active' : ''}`}
                        onClick={() => setInviteRole(role)}
                      >
                        <div className="role-card-title">{role}</div>
                        <div className="role-card-desc">
                          {role === 'Admin' && 'Full control over billing, members, and API keys'}
                          {role === 'Member' && 'Create memories, query playground, and build agents'}
                          {role === 'Viewer' && 'Read-only access to documents and memory graphs'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="apikeys-modal-footer">
                <button
                  type="button"
                  className="apikeys-modal-cancel"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`apikeys-modal-submit ${inviteEmail.trim() ? 'apikeys-modal-submit--active' : ''}`}
                  disabled={!inviteEmail.trim()}
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
