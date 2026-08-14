import { Router } from "express";
import { readData, writeData } from "../utils/dataStore.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const FILE = "testimonials.json";

// GET /api/testimonials -> semua testimoni (publik)
router.get("/", (req, res) => {
  res.json(readData(FILE));
});

// POST /api/testimonials -> tambah testimoni baru (admin)
router.post("/", requireAuth, (req, res) => {
  const testimonials = readData(FILE);
  const body = req.body || {};

  if (!body.name || !body.review) {
    return res.status(400).json({ message: "Nama dan isi ulasan wajib diisi." });
  }

  const newTestimonial = {
    id: Date.now(),
    name: body.name,
    product: body.product || "",
    rating: Number(body.rating) || 5,
    review: body.review,
    photo: body.photo || null,
    documentationPhoto: body.documentationPhoto || null,
  };

  testimonials.push(newTestimonial);
  writeData(FILE, testimonials);
  res.status(201).json(newTestimonial);
});

// PUT /api/testimonials/:id -> update testimoni (admin)
router.put("/:id", requireAuth, (req, res) => {
  const testimonials = readData(FILE);
  const index = testimonials.findIndex((t) => String(t.id) === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Testimoni tidak ditemukan" });
  }

  testimonials[index] = {
    ...testimonials[index],
    ...req.body,
    rating: req.body.rating !== undefined ? Number(req.body.rating) : testimonials[index].rating,
  };
  writeData(FILE, testimonials);
  res.json(testimonials[index]);
});

// DELETE /api/testimonials/:id -> hapus testimoni (admin)
router.delete("/:id", requireAuth, (req, res) => {
  const testimonials = readData(FILE);
  const filtered = testimonials.filter((t) => String(t.id) !== req.params.id);

  if (filtered.length === testimonials.length) {
    return res.status(404).json({ message: "Testimoni tidak ditemukan" });
  }

  writeData(FILE, filtered);
  res.status(204).end();
});

export default router;
