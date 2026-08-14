import { API_BASE_URL } from "./adminApi.js";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// type harus "products" atau "testimonials"
// Dikirim sebagai JSON base64 (bukan multipart) karena endpoint upload
// sekarang serverless function Vercel yang menyimpan ke Vercel Blob.
export async function uploadImage(file, type, token) {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran foto maksimal 5MB.");
  }

  const base64 = await fileToBase64(file);

  const res = await fetch(`${API_BASE_URL}/api/upload/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ image: base64, filename: file.name }),
  });

  if (res.status === 401) {
    throw new Error("Sesi login sudah berakhir. Silakan login ulang.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Upload foto gagal.");
  }

  const data = await res.json();
  return data.url;
}
