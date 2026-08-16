import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Home,
  MessageSquare,
  FileText,
  Tag,
  GitGraph,
  Terminal,
  Lock,
  Globe,
  UploadCloud,
  KeyRound,
  Bot,
  Puzzle,
  ExternalLink,
  Users,
  CreditCard,
  Settings,
  ChevronDown,
  Building2,
  Sliders,
} from 'lucide-react';
import type { NavItem, NavSection } from '../types';

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { id: 'overview', label: 'Overview', icon: <Home size={15} strokeWidth={1.5} /> },
      { id: 'playground', label: 'Playground Chat', icon: <MessageSquare size={15} strokeWidth={1.5} /> },
      { id: 'documents', label: 'Documents', icon: <FileText size={15} strokeWidth={1.5} /> },
      { id: 'container-tags', label: 'Container Tags', icon: <Tag size={15} strokeWidth={1.5} /> },
      { id: 'memory-graph', label: 'Memory Graph', icon: <GitGraph size={15} strokeWidth={1.5} /> },
      { id: 'requests', label: 'Requests', icon: <Terminal size={15} strokeWidth={1.5} /> },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        id: 'user-insights',
        label: 'User Insights',
        icon: <Users size={15} strokeWidth={1.5} />,
        trailing: <Lock size={12} strokeWidth={1.5} className="nav-lock-icon" />,
      },
    ],
  },
  {
    title: 'Data',
    items: [
      { id: 'connectors', label: 'Connectors', icon: <Globe size={15} strokeWidth={1.5} /> },
      { id: 'import', label: 'Import', icon: <UploadCloud size={15} strokeWidth={1.5} /> },
    ],
  },
  {
    title: 'Developer',
    items: [
      { id: 'api-keys', label: 'API Keys', icon: <KeyRound size={15} strokeWidth={1.5} /> },
      { id: 'agents', label: 'Agents', icon: <Bot size={15} strokeWidth={1.5} /> },
      {
        id: 'plugins',
        label: 'Plugins',
        icon: <Puzzle size={15} strokeWidth={1.5} />,
        trailing: <ExternalLink size={12} strokeWidth={1.5} className="nav-external-icon" />,
      },
    ],
  },
  {
    title: 'Organization',
    items: [
      { id: 'team', label: 'Team', icon: <Users size={15} strokeWidth={1.5} /> },
      { id: 'billing', label: 'Billing', icon: <CreditCard size={15} strokeWidth={1.5} /> },
      {
        id: 'settings',
        label: 'Settings',
        icon: <Settings size={15} strokeWidth={1.5} />,
        children: [
          { id: 'organization', label: 'Organization', icon: <Building2 size={13} strokeWidth={1.5} /> },
          { id: 'advanced', label: 'Advanced', icon: <Sliders size={13} strokeWidth={1.5} /> },
        ],
      },
    ],
  },
];

interface SidebarProps {
  activeId: string;
  setActiveId: (id: string) => void;
  userEmail?: string;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeId, setActiveId, userEmail = 'developer@cairel.ai', onSignOut }) => {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      setSettingsOpen((prev) => !prev);
    } else {
      setActiveId(item.id);
    }
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const isActive = activeId === item.id;
    const hasChildren = !!item.children;
    const isExpanded = hasChildren && settingsOpen;

    return (
      <React.Fragment key={item.id}>
        <button
          className={`nav-link${isActive ? ' nav-link--active' : ''}${isChild ? ' nav-link--child' : ''}`}
          onClick={() => handleItemClick(item)}
          aria-expanded={hasChildren ? isExpanded : undefined}
        >
          <span className="nav-link-icon">{item.icon}</span>
          <span className="nav-link-label">{item.label}</span>

          {item.trailing && <span className="nav-link-trailing">{item.trailing}</span>}

          {hasChildren && (
            <ChevronDown
              size={13}
              strokeWidth={1.5}
              className={`nav-chevron${isExpanded ? ' nav-chevron--open' : ''}`}
            />
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="nav-children">
            {item.children!.map((child) => renderNavItem(child, true))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-header">
        <div className="sidebar-brand-mark">
          <div className="brand-dot" />
          <span className="sidebar-brand-name">CAIREL</span>
        </div>
        <span className="sidebar-brand-version">v1.0</span>
      </div>

      {/* Search Input */}
      <div className="search-container">
        <div className="search-wrapper">
          <Search size={13} strokeWidth={1.5} className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Quick search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="search-filter-badge">
            <SlidersHorizontal size={11} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav-container">
        {NAV_SECTIONS.map((section, idx) => (
          <div className="nav-section" key={section.title ?? idx}>
            {section.title && (
              <div className="sidebar-section-title">{section.title}</div>
            )}
            {section.items.map((item) => renderNavItem(item))}
          </div>
        ))}
      </nav>

      {/* Minimal User Profile Footer */}
      {onSignOut && (
        <div className="sidebar-user-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-details">
              <span className="sidebar-user-email" title={userEmail}>
                {userEmail}
              </span>
            </div>
          </div>
          <button
            className="sidebar-signout-btn"
            onClick={onSignOut}
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
};
