import { Router } from "express";
import { readData, writeData } from "../utils/dataStore.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const FILE = "promos.json";

// GET /api/promos -> semua promo aktif (untuk halaman Promo publik)
router.get("/", (req, res) => {
  const promos = readData(FILE);
  res.json(promos.filter((p) => p.active));
});

// GET /api/promos/all -> semua promo termasuk yang nonaktif (untuk dashboard admin)
router.get("/all", requireAuth, (req, res) => {
  res.json(readData(FILE));
});

// POST /api/promos -> tambah promo baru (admin)
router.post("/", requireAuth, (req, res) => {
  const promos = readData(FILE);
  const body = req.body || {};

  if (!body.title || !body.code) {
    return res.status(400).json({ message: "Judul dan kode promo wajib diisi." });
  }

  const newPromo = {
    id: `promo-${Date.now()}`,
    title: body.title,
    description: body.description || "",
    code: body.code,
    validUntil: body.validUntil || null,
    terms: body.terms || [],
    active: body.active !== undefined ? !!body.active : true,
  };

  promos.push(newPromo);
  writeData(FILE, promos);
  res.status(201).json(newPromo);
});

// PUT /api/promos/:id -> update promo (admin)
router.put("/:id", requireAuth, (req, res) => {
  const promos = readData(FILE);
  const index = promos.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Promo tidak ditemukan" });
  }

  promos[index] = { ...promos[index], ...req.body };
  writeData(FILE, promos);
  res.json(promos[index]);
});

// DELETE /api/promos/:id -> hapus promo (admin)
router.delete("/:id", requireAuth, (req, res) => {
  const promos = readData(FILE);
  const filtered = promos.filter((p) => p.id !== req.params.id);

  if (filtered.length === promos.length) {
    return res.status(404).json({ message: "Promo tidak ditemukan" });
  }

  writeData(FILE, filtered);
  res.status(204).end();
});

export default router;
