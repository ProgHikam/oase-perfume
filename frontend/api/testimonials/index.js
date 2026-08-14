import { getCollection, setCollection } from "../_lib/db.js";
import { requireAuth } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method === "GET") {
    const testimonials = await getCollection("testimonials");
    return res.status(200).json(testimonials);
  }

  if (req.method === "POST") {
    const admin = requireAuth(req, res);
    if (!admin) return;

    const testimonials = await getCollection("testimonials");
    const body = req.body || {};

    if (!body.name || !body.review) {
      return res.status(400).json({ message: "Nama dan isi ulasan wajib diisi." });
    }

    const newTestimonial = {
      id: Date.now(),
      name: body.name,
      product: body.product || "",
      rating: Number(body.rating) || 5,
      review: body.review,
      photo: body.photo || null,
      documentationPhoto: body.documentationPhoto || null,
    };

    testimonials.push(newTestimonial);
    await setCollection("testimonials", testimonials);
    return res.status(201).json(newTestimonial);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ message: "Method tidak didukung." });
}
