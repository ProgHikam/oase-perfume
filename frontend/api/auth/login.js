import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method tidak didukung." });
  }

  const { username, password } = req.body || {};
  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "oase12345";

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ message: "Username atau password salah." });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "12h" });
  return res.status(200).json({ token, username });
}
