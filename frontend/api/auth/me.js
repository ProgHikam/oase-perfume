import { requireAuth } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method tidak didukung." });
  }

  const admin = requireAuth(req, res);
  if (!admin) return;

  return res.status(200).json({ username: admin.username });
}
