// Dev: local PHP (XAMPP). Prod: hosted API — HTTPS required on https://sdftrust.vercel.app (mixed content).
const DEFAULT_API_BASE_URL_DEV = "http://localhost/sdftrust/backend/api";
const DEFAULT_API_BASE_URL_PROD = "https://hrntechsolutions.com/backend/api";

function isLocalApiUrl(url) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i.test(url);
}

/** Non-localhost http:// → https:// (mixed content + production API often set as http by mistake). */
function normalizeApiBaseUrl(url) {
  let base = String(url).replace(/\/+$/, "");
  if (base.startsWith("http://") && !isLocalApiUrl(base)) {
    base = "https://" + base.slice("http://".length);
  }
  return base;
}

/**
 * Resolve on every call (do not cache at module load) so Vercel / live hosts never keep a
 * build-time localhost URL in module-level constants.
 */
function getResolvedBaseUrl() {
  let resolved =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD ? DEFAULT_API_BASE_URL_PROD : DEFAULT_API_BASE_URL_DEV);

  if (import.meta.env.PROD && isLocalApiUrl(String(resolved))) {
    resolved = DEFAULT_API_BASE_URL_PROD;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      resolved = DEFAULT_API_BASE_URL_PROD;
    }
  }

  return normalizeApiBaseUrl(resolved);
}

export function getApiBaseUrl() {
  return getResolvedBaseUrl();
}

export function getAdminBaseUrl() {
  return getResolvedBaseUrl().replace(/\/api$/, "/admin");
}

export function apiUrl(endpoint = "") {
  const base = getResolvedBaseUrl().replace(/\/+$/, "");
  return `${base}/${String(endpoint).replace(/^\/+/, "")}`;
}

export function adminUrl(path = "") {
  const adminBase = getAdminBaseUrl().replace(/\/+$/, "");
  return `${adminBase}/${String(path).replace(/^\/+/, "")}`;
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
