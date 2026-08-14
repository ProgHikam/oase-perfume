import { getCollection, setCollection } from "../_lib/db.js";
import { requireAuth } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method === "GET") {
    const promos = await getCollection("promos");
    return res.status(200).json(promos.filter((p) => p.active));
  }

  if (req.method === "POST") {
    const admin = requireAuth(req, res);
    if (!admin) return;

    const promos = await getCollection("promos");
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
    await setCollection("promos", promos);
    return res.status(201).json(newPromo);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ message: "Method tidak didukung." });
}
