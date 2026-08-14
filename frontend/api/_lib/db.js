import { Redis } from "@upstash/redis";

// Mendukung 2 kemungkinan nama env var, karena integrasi "Upstash for Redis"
// di Vercel Marketplace kadang menyuntikkan KV_REST_API_* (kompatibel nama lama
// Vercel KV), kadang UPSTASH_REDIS_REST_* (nama asli Upstash).
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Setiap "koleksi" (products, promos, testimonials, faqs) disimpan sebagai
// SATU key berisi seluruh array-nya dalam bentuk JSON - persis seperti dulu
// masing-masing jadi 1 file products.json, promos.json, dst, cuma sekarang
// disimpan di Redis (Upstash) supaya tetap ada walau di serverless function.

export async function getCollection(key) {
  const raw = await redis.get(key);
  if (!raw) return [];
  // @upstash/redis kadang sudah otomatis parse JSON, kadang masih string mentah -
  // ditangani dua-duanya agar tidak error.
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export async function setCollection(key, data) {
  await redis.set(key, JSON.stringify(data));
}

export { redis };
