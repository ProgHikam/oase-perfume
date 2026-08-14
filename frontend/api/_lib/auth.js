import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

// Kembalikan payload token kalau valid. Kalau tidak valid, langsung kirim
// response 401 dan kembalikan null - jadi tinggal dicek "if (!admin) return;"
export function requireAuth(req, res) {
  const token = getTokenFromRequest(req);

  if (!token) {
    res.status(401).json({ message: "Tidak ada token. Silakan login." });
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    res.status(401).json({ message: "Sesi login tidak valid atau sudah kedaluwarsa." });
    return null;
  }
}

export { JWT_SECRET };
