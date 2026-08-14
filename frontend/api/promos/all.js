import { getCollection } from "../_lib/db.js";
import { requireAuth } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const admin = requireAuth(req, res);
  if (!admin) return;

  if (req.method === "GET") {
    const promos = await getCollection("promos");
    return res.status(200).json(promos);
  }

  res.setHeader("Allow", "GET");
  return res.status(405).json({ message: "Method tidak didukung." });
}
