/**
 * API base URL resolution for Vite + PHP backend.
 * - Local dev: http://localhost/... (XAMPP)
 * - Deployed (Vercel, etc.): always https://hrntechsolutions.com/backend/api
 * Vite bakes VITE_API_BASE_URL at build time; we override via hostname when not on localhost.
 */
const DEFAULT_API_BASE_URL_DEV = "http://localhost/sdftrust/backend/api";
const DEFAULT_API_BASE_URL_PROD = "https://hrntechsolutions.com/backend/api";

function isLocalApiUrl(url) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i.test(url);
}

function normalizeApiBaseUrl(url) {
  let base = String(url).trim().replace(/\/+$/, "");
  base = base.replace(/^http:\/\/www\.hrntechsolutions\.com/i, "https://www.hrntechsolutions.com");
  base = base.replace(/^http:\/\/hrntechsolutions\.com/i, "https://hrntechsolutions.com");
  if (base.startsWith("http://") && !isLocalApiUrl(base)) {
    base = "https://" + base.slice("http://".length);
  }
  return base;
}

function getResolvedBaseUrl() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return normalizeApiBaseUrl(DEFAULT_API_BASE_URL_PROD);
    }
  }

  let resolved =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD ? DEFAULT_API_BASE_URL_PROD : DEFAULT_API_BASE_URL_DEV);

  if (import.meta.env.PROD && isLocalApiUrl(String(resolved))) {
    resolved = DEFAULT_API_BASE_URL_PROD;
  }

  return normalizeApiBaseUrl(resolved);
}

export function getApiBaseUrl() {
  return getResolvedBaseUrl();
}

export function getAdminBaseUrl() {
  return getResolvedBaseUrl().replace(/\/api$/, "/admin");
}

/** Full URL to a PHP file under /backend/api/ (e.g. "projects.php" or "x.php?a=1"). */
export function apiUrl(endpoint = "") {
  const base = getResolvedBaseUrl().replace(/\/+$/, "");
  const path = String(endpoint).replace(/^\/+/, "");
  const full = `${base}/${path}`;
  return normalizeApiBaseUrl(full);
}

export function adminUrl(path = "") {
  const adminBase = getAdminBaseUrl().replace(/\/+$/, "");
  const rest = String(path).replace(/^\/+/, "");
  return normalizeApiBaseUrl(`${adminBase}/${rest}`);
}

/**
 * Use this for all PHP API calls so URLs always go through the same resolution + HTTPS rules.
 */
export function apiFetch(endpoint, init) {
  return fetch(apiUrl(endpoint), init);
}

export function makeImageUrl(
  path,
  fallback = "https://via.placeholder.com/800x500?text=No+Image",
) {
  if (!path || typeof path !== "string") return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (path.startsWith("http://") && !isLocalApiUrl(path)) {
      return normalizeApiBaseUrl(path);
    }
    return path;
  }
  return adminUrl(path);
}
