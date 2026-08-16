export const APP_CONFIG = {
  appName: 'CAIREL',
  version: 'v1.0',
  defaultWorkspace: 'default_workspace',
  defaultUserEmail: 'developer@cairel.ai',
};

export const AVAILABLE_MODELS = [
  { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet (Hybrid Reasoning)' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'gpt-4o', name: 'OpenAI GPT-4o' },
  { id: 'deepseek-r1', name: 'DeepSeek R1 (Self-hosted Cluster)' },
] as const;

export const EMBEDDING_MODELS = [
  { id: 'text-embedding-3-large', name: 'OpenAI text-embedding-3-large (3072 dim)' },
  { id: 'text-embedding-3-small', name: 'OpenAI text-embedding-3-small (1536 dim)' },
  { id: 'bge-m3', name: 'BGE-M3 Multilingual (Dense + Sparse)' },
  { id: 'cohere-embed-v3', name: 'Cohere Embed v3.0 (English)' },
] as const;
