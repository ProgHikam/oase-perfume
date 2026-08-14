import { getCollection } from "../_lib/db.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method === "GET") {
    const faqs = await getCollection("faqs");
    return res.status(200).json(faqs);
  }

  res.setHeader("Allow", "GET");
  return res.status(405).json({ message: "Method tidak didukung." });
}
