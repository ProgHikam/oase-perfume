// Karena frontend & API sekarang satu project Vercel (satu domain), CORS
// sebenarnya tidak wajib. Header ini ditambahkan untuk jaga-jaga saat dev
// lokal (misalnya akses dari port berbeda).
export function applyCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // caller harus langsung `return` setelah ini
  }

  return false;
}
