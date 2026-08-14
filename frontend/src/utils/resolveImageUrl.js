import { API_BASE_URL } from "./adminApi.js";

// Foto bisa datang dari 2 sumber tergantung backend yang dipakai:
// - Vercel Blob (production) -> sudah URL absolut (https://...), pakai langsung
// - Backend lokal (Express, folder backend/) -> path relatif (/uploads/...),
//   perlu diawali API_BASE_URL supaya browser tahu domain mana yang dituju
export function resolveImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
  return null; // placeholder lama / path tidak valid -> tampilkan fallback
}
