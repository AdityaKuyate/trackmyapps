// Small fetch wrapper so the app works both:
// - locally (VITE_API_URL unset -> uses Vite's /api proxy to localhost:5001)
// - in production (VITE_API_URL set to your deployed backend URL)
const BASE = import.meta.env.VITE_API_URL || ''

export function apiUrl(path) {
  return `${BASE}${path}`
}

export async function apiFetch(path, options) {
  return fetch(apiUrl(path), options)
}
