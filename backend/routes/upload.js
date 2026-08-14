import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = path.join(__dirname, "..", "uploads");

// POST /api/upload/products      -> upload foto produk
// POST /api/upload/testimonials  -> upload foto testimoni
// Body JSON: { image: "data:image/jpeg;base64,....", filename: "nama.jpg" }
// Format ini SAMA seperti endpoint upload di frontend/api/upload/[type].js (Vercel),
// supaya dashboard admin tetap berfungsi identik baik pakai backend lokal ini
// maupun sudah di-deploy ke Vercel - tidak perlu 2 cara berbeda.
const router = Router();

router.post("/:type", requireAuth, (req, res) => {
  const { type } = req.params;
  if (type !== "products" && type !== "testimonials") {
    return res.status(400).json({ message: "Tipe upload tidak dikenali." });
  }

  const { image } = req.body || {};
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
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const dest = path.join(UPLOADS_ROOT, type);
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, filename), buffer);

  const url = `/uploads/${type}/${filename}`;
  res.status(201).json({ url });
});

export default router;
