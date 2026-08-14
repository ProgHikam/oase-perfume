import { getCollection, setCollection } from "../_lib/db.js";
import { requireAuth } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  const { id } = req.query;

  const admin = requireAuth(req, res);
  if (!admin) return;

  if (req.method === "PUT") {
    const testimonials = await getCollection("testimonials");
    const index = testimonials.findIndex((t) => String(t.id) === id);
    if (index === -1) {
      return res.status(404).json({ message: "Testimoni tidak ditemukan" });
    }

    testimonials[index] = {
      ...testimonials[index],
      ...req.body,
      rating: req.body.rating !== undefined ? Number(req.body.rating) : testimonials[index].rating,
    };

    await setCollection("testimonials", testimonials);
    return res.status(200).json(testimonials[index]);
  }

  if (req.method === "DELETE") {
    const testimonials = await getCollection("testimonials");
    const filtered = testimonials.filter((t) => String(t.id) !== id);
    if (filtered.length === testimonials.length) {
      return res.status(404).json({ message: "Testimoni tidak ditemukan" });
    }

    await setCollection("testimonials", filtered);
    return res.status(204).end();
  }

  res.setHeader("Allow", "PUT, DELETE");
  return res.status(405).json({ message: "Method tidak didukung." });
}
