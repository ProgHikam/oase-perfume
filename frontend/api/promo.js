import { getCollection } from "./_lib/db.js";
import { applyCors } from "./_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method tidak didukung." });
  }

  const promos = await getCollection("promos");
  const active = promos.find((p) => p.active);

  if (!active) {
    return res.status(200).json({ active: false });
  }

  return res.status(200).json({
    active: true,
    title: active.title,
    description: active.description,
    code: active.code,
  });
}
