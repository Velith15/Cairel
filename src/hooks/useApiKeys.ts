import { useState } from 'react';
import type { ApiKey } from '../types';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

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

  const createKey = (name: string, permissions: string[]) => {
    const fullKey = generateApiKey();
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: name.trim(),
      key: fullKey,
      prefix: fullKey.slice(0, 12) + '...' + fullKey.slice(-4),
      createdAt: new Date().toISOString(),
      lastUsed: null,
      permissions,
    };
    setApiKeys((prev) => [newKey, ...prev]);
    return newKey;
  };

  const deleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return {
    apiKeys,
    revealedKeys,
    copiedKeyId,
    setCopiedKeyId,
    createKey,
    deleteKey,
    toggleReveal,
  };
};
