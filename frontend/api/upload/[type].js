import { put } from "@vercel/blob";
import { requireAuth } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method tidak didukung." });
  }

  const admin = requireAuth(req, res);
  if (!admin) return;

  const { type } = req.query;
  if (type !== "products" && type !== "testimonials") {
    return res.status(400).json({ message: "Tipe upload tidak dikenali." });
  }

  const { image, filename } = req.body || {};
  if (!image || typeof image !== "string" || !image.startsWith("data:")) {
    return res.status(400).json({ message: "Data foto tidak valid." });
  }

  const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    return res.status(400).json({ message: "Format foto harus JPG, PNG, WEBP, atau GIF." });
  }

  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");

  if (buffer.length > 5 * 1024 * 1024) {
    return res.status(400).json({ message: "Ukuran foto maksimal 5MB." });
  }

  const ext = mimeType.split("/")[1] || "jpg";
  const safeName = `${type}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  try {
    const blob = await put(safeName, buffer, {
      access: "public",
      contentType: mimeType,
    });

    return res.status(201).json({ url: blob.url });
  } catch (error) {
    console.error("Vercel Blob upload failed:", error);
    return res.status(500).json({ message: `Gagal mengunggah ke Vercel Blob: ${error.message}` });
  }
}
