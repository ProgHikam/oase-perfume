import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Tidak ada token. Silakan login." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Sesi login tidak valid atau sudah kedaluwarsa." });
  }
}

export { JWT_SECRET };
