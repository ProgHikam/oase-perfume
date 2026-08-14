import { getCollection, setCollection } from "../_lib/db.js";
import { requireAuth } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  const { id } = req.query;

  const admin = requireAuth(req, res);
  if (!admin) return;

  if (req.method === "PUT") {
    const promos = await getCollection("promos");
    const index = promos.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Promo tidak ditemukan" });
    }

    promos[index] = { ...promos[index], ...req.body };
    await setCollection("promos", promos);
    return res.status(200).json(promos[index]);
  }

  if (req.method === "DELETE") {
    const promos = await getCollection("promos");
    const filtered = promos.filter((p) => p.id !== id);
    if (filtered.length === promos.length) {
      return res.status(404).json({ message: "Promo tidak ditemukan" });
    }

    await setCollection("promos", filtered);
    return res.status(204).end();
  }

  res.setHeader("Allow", "PUT, DELETE");
  return res.status(405).json({ message: "Method tidak didukung." });
}
