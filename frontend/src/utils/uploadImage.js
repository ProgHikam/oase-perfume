import { API_BASE_URL } from "./adminApi.js";

const MAX_DIMENSION = 1600; // px - lebih dari cukup untuk tampilan web
const JPEG_QUALITY = 0.82;

// Foto dari galeri HP sering berukuran besar (3-10MB), padahal Vercel punya
// batas keras 4.5MB per request (base64 bikin ukuran ~33% lebih besar dari
// file asli, jadi limitnya lebih ketat dari kelihatannya). Supaya upload
// TIDAK PERNAH gagal karena ukuran, foto dikecilkan dulu di browser sebelum
// dikirim - resolusi maksimal 1600px & dikompres jadi JPEG.
function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gagal membaca file foto. Pastikan formatnya JPG/PNG/WEBP."));
    };

    img.src = objectUrl;
  });
}

// type harus "products" atau "testimonials"
export async function uploadImage(file, type, token) {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa foto (JPG, PNG, WEBP, atau GIF).");
  }

  const base64 = await resizeImage(file);

  // Cek ukuran SETELAH dikecilkan (harusnya nyaris tidak pernah kena, tapi
  // tetap dijaga untuk foto dengan detail sangat tinggi).
  const approxBytes = base64.length * 0.75;
  if (approxBytes > 4 * 1024 * 1024) {
    throw new Error("Foto masih terlalu besar setelah dikompres. Coba pakai foto lain.");
  }

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
