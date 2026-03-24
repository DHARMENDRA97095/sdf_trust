const DEFAULT_API_BASE_URL = "http://localhost/sdftrust/backend/api";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

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