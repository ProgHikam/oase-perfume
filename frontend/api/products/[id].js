import { getCollection, setCollection } from "../_lib/db.js";
import { requireAuth } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  const { id } = req.query;

  if (req.method === "GET") {
    const products = await getCollection("products");
    const product = products.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    return res.status(200).json(product);
  }

  if (req.method === "PUT") {
    const admin = requireAuth(req, res);
    if (!admin) return;

    const products = await getCollection("products");
    const index = products.findIndex((p) => p.id === id);
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

    await setCollection("products", products);
    return res.status(200).json(products[index]);
  }

  if (req.method === "DELETE") {
    const admin = requireAuth(req, res);
    if (!admin) return;

    const products = await getCollection("products");
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await setCollection("products", filtered);
    return res.status(204).end();
  }

  res.setHeader("Allow", "GET, PUT, DELETE");
  return res.status(405).json({ message: "Method tidak didukung." });
}
