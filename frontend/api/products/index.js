import { getCollection, setCollection } from "../_lib/db.js";
import { requireAuth } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method === "GET") {
    let products = await getCollection("products");

    if (req.query.bestseller === "true") {
      products = products.filter((p) => p.bestseller);
    }
    if (req.query.category) {
      products = products.filter(
        (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }

    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const admin = requireAuth(req, res);
    if (!admin) return;

    const products = await getCollection("products");
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
    await setCollection("products", products);
    return res.status(201).json(newProduct);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ message: "Method tidak didukung." });
}
