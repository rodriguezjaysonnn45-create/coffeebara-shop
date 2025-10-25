export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5002';

/**
 * Build a full API url. Pass a path like '/api/login' or 'api/login'.
 */
export function apiUrl(path: string) {
  if (!path.startsWith('/')) path = '/' + path;
  return `${API_BASE}${path}`;
}
