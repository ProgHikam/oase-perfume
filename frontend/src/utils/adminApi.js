const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function adminFetch(path, token, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    throw new Error("Sesi login sudah berakhir. Silakan login ulang.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Terjadi kesalahan pada server.");
  }

  if (res.status === 204) return null;
  return res.json();
}

export { API_BASE_URL };
