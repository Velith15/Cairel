import type { TeamMember } from '../types';

export const OrganizationService = {
  getInitialMembers: (): TeamMember[] => [
    {
      id: '1',
      name: 'Developer Account',
      email: 'developer@cairel.ai',
      role: 'Owner',
      avatarLetter: 'D',
      status: 'Active',
      joinedAt: 'Feb 12, 2026',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah.chen@cairel.ai',
      role: 'Admin',
      avatarLetter: 'S',
      status: 'Active',
      joinedAt: 'Mar 01, 2026',
    },
    {
      id: '3',
      name: 'Alex Rivera',
      email: 'alex.rivera@cairel.ai',
      role: 'Member',
      avatarLetter: 'A',
      status: 'Active',
      joinedAt: 'Apr 18, 2026',
    },
    {
      id: '4',
      name: 'AI Agent Service',
      email: 'agent-bot@service.internal',
      role: 'Viewer',
      avatarLetter: 'B',
      status: 'Active',
      joinedAt: 'May 04, 2026',
    },
  ],

  createMember: (email: string, role: 'Admin' | 'Member' | 'Viewer'): TeamMember => {
    return {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email: email.trim(),
      role,
      avatarLetter: email.charAt(0).toUpperCase(),
      status: 'Invited',
      joinedAt: 'Just now',
    };
  },
};
