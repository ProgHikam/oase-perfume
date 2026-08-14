import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login -> { username, password } -> { token }
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "oase12345";

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ message: "Username atau password salah." });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, username });
});

// GET /api/auth/me -> cek apakah token masih valid (dipakai frontend saat refresh halaman)
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Tidak ada token." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ username: payload.username });
  } catch {
    res.status(401).json({ message: "Sesi tidak valid." });
  }
});

export default router;
