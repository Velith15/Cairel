export interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Viewer';
  avatarLetter: string;
  status: 'Active' | 'Invited';
  joinedAt: string;
}

export interface ProcessingItem {
  id: string;
  name: string;
  type: 'file' | 'url';
  progress: number;
  status: 'processing' | 'completed' | 'queued';
  sizeOrUrl: string;
  method: string;
  endpoint: string;
  timestamp: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
