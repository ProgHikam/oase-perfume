import { Router } from "express";
import { readData, writeData } from "../utils/dataStore.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const FILE = "products.json";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/products              -> semua produk
// GET /api/products?bestseller=true -> hanya produk best seller
// GET /api/products?category=Woody  -> filter kategori
router.get("/", (req, res) => {
  const { bestseller, category } = req.query;
  let result = readData(FILE);

  if (bestseller === "true") {
    result = result.filter((p) => p.bestseller);
  }
  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(result);
});

// GET /api/products/:id -> detail 1 produk
router.get("/:id", (req, res) => {
  const products = readData(FILE);
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  res.json(product);
});

// POST /api/products -> tambah produk baru (butuh login admin)
router.post("/", requireAuth, (req, res) => {
  const products = readData(FILE);
  const body = req.body || {};

  if (!body.name || !body.category || !body.price) {
    return res.status(400).json({ message: "Nama, kategori, dan harga wajib diisi." });
  }

  let id = slugify(body.name);
  let suffix = 1;
  while (products.some((p) => p.id === id)) {
    id = `${slugify(body.name)}-${suffix++}`;
  }

  const newProduct = {
    id,
    name: body.name,
    category: body.category,
    character: body.character || "",
    notes: {
      top: body.notes?.top || [],
      middle: body.notes?.middle || [],
      base: body.notes?.base || [],
    },
    price: Number(body.price),
    sizes: body.sizes?.length ? body.sizes : ["30ml", "50ml"],
    image: body.image || "/images/products/placeholder.jpg",
    bestseller: !!body.bestseller,
  };

  products.push(newProduct);
  writeData(FILE, products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id -> update produk (butuh login admin)
router.put("/:id", requireAuth, (req, res) => {
  const products = readData(FILE);
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  const body = req.body || {};
  products[index] = {
    ...products[index],
    ...body,
    notes: {
      top: body.notes?.top ?? products[index].notes.top,
      middle: body.notes?.middle ?? products[index].notes.middle,
      base: body.notes?.base ?? products[index].notes.base,
    },
    price: body.price !== undefined ? Number(body.price) : products[index].price,
  };

  writeData(FILE, products);
  res.json(products[index]);
});

// DELETE /api/products/:id -> hapus produk (butuh login admin)
router.delete("/:id", requireAuth, (req, res) => {
  const products = readData(FILE);
  const filtered = products.filter((p) => p.id !== req.params.id);

  if (filtered.length === products.length) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  writeData(FILE, filtered);
  res.status(204).end();
});

export default router;
