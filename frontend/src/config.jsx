// Dev: local PHP (XAMPP). Prod: hosted API — must be HTTPS when the site is on HTTPS (Vercel) or browsers block requests (mixed content).
const DEFAULT_API_BASE_URL_DEV = "http://localhost/sdftrust/backend/api";
const DEFAULT_API_BASE_URL_PROD = "https://hrntechsolutions.com/backend/api";

function isLocalApiUrl(url) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i.test(url);
}

function normalizeApiBaseUrl(url) {
  let base = String(url).replace(/\/+$/, "");
  // Production build: never call remote API over http (mixed content on https://sdftrust.vercel.app)
  if (import.meta.env.PROD && base.startsWith("http://") && !isLocalApiUrl(base)) {
    base = "https://" + base.slice("http://".length);
  }
  return base;
}

const resolved =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? DEFAULT_API_BASE_URL_PROD : DEFAULT_API_BASE_URL_DEV);

export const API_BASE_URL = normalizeApiBaseUrl(resolved);

export const ADMIN_BASE_URL = API_BASE_URL.replace(/\/api$/, "/admin");

export const apiUrl = (endpoint = "") =>
  `${API_BASE_URL}/${String(endpoint).replace(/^\/+/, "")}`;

export const adminUrl = (path = "") =>
  `${ADMIN_BASE_URL}/${String(path).replace(/^\/+/, "")}`;

export const makeImageUrl = (
  path,
  fallback = "https://via.placeholder.com/800x500?text=No+Image",
) => {
  if (!path || typeof path !== "string") return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return adminUrl(path);
};
