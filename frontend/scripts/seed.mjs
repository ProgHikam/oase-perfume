// Script sekali-jalan untuk mengisi data awal ke Upstash Redis.
// Dijalankan SEKALI SAJA setelah database Redis dibuat di Vercel,
// supaya katalog produk/promo/testimoni/FAQ tidak mulai dari kosong.
//
// Cara pakai:
//   1. cd frontend
//   2. vercel env pull        (ambil KV_REST_API_URL & KV_REST_API_TOKEN ke .env.local)
//   3. node scripts/seed.mjs
//
// Aman dijalankan berkali-kali - akan menimpa (replace) data lama dengan
// data di bawah, bukan menambah duplikat.

import { Redis } from "@upstash/redis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Baca .env.local hasil `vercel env pull` secara manual (tanpa dependency tambahan)
function loadEnvLocal() {
  try {
    const envPath = join(__dirname, "..", ".env.local");
    const content = readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = value;
      }
    });
  } catch {
    // .env.local tidak ada - berarti env var sudah diset manual, lanjut saja
  }
}

loadEnvLocal();

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken || redisUrl.includes("[SENSITIVE]") || redisToken.includes("[SENSITIVE]")) {
  console.error(
    "❌ Env var Redis tidak ketemu atau bernilai '[SENSITIVE]'.\n\n" +
    "Karena Vercel menyembunyikan nilai sensitif saat `vercel env pull`, Anda harus menyalin nilainya secara manual:\n" +
    "1. Buka Dashboard Vercel project Anda (https://vercel.com).\n" +
    "2. Masuk ke tab 'Storage' lalu pilih database KV / Redis Anda.\n" +
    "3. Di bagian 'Quick Start', pilih tab '.env.local'.\n" +
    "4. Salin nilai KV_REST_API_URL dan KV_REST_API_TOKEN asli.\n" +
    "5. Buka file frontend/.env.local di text editor Anda, lalu ganti '[SENSITIVE]' dengan nilai asli tersebut.\n" +
    "6. Jalankan kembali script ini: node scripts/seed.mjs\n"
  );
  process.exit(1);
}

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

const products = [
  {
    id: "ysl-black-opium-sp",
    name: "YSL Black Opium SP",
    category: "Oriental",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: true,
  },
  {
    id: "romance-wish",
    name: "Romance Wish",
    category: "Floral",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: true,
  },
  {
    id: "bbw-pink-chiffon-sp",
    name: "BBW Pink Chiffon SP",
    category: "Floral",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: true,
  },
  {
    id: "dunhill-desire-blue-p",
    name: "Dunhill Desire Blue P",
    category: "Fresh",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: true,
  },
  {
    id: "hawas-ice-edp-sp",
    name: "Hawas Ice EDP SP",
    category: "Fresh",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: false,
  },
  {
    id: "esscada-moon-sparkle",
    name: "Esscada Moon Sparkle",
    category: "Floral",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: false,
  },
  {
    id: "tiziana-terenzi-kirke-sp",
    name: "Tiziana Terenzi Kirke SP",
    category: "Oriental",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: false,
  },
  {
    id: "christian-dior-sauvage-sp",
    name: "Christian Dior Sauvage SP",
    category: "Woody",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: false,
  },
  {
    id: "victoria-secret-aqua-kiss",
    name: "Victoria Secret Aqua Kiss",
    category: "Fresh",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: false,
  },
  {
    id: "hmns-orgasme-sp",
    name: "HMNS Orgasme SP",
    category: "Oriental",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: false,
  },
  {
    id: "taylor-swift",
    name: "Taylor Swift",
    category: "Floral",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: false,
  },
  {
    id: "burberry-her-lady-sp",
    name: "Burberry Her/Lady SP",
    category: "Floral",
    character: "Perlu dilengkapi lewat dashboard admin",
    notes: { top: [], middle: [], base: [] },
    price: 150000,
    sizes: ["30ml", "50ml"],
    image: "/images/products/placeholder.jpg",
    bestseller: false,
  },
];

const promos = [
  {
    id: "promo-bulan-ini",
    title: "Promo Bulan Ini",
    description: "Diskon 15% untuk pembelian 2 botol parfum, berlaku sampai akhir bulan.",
    code: "OASE15",
    validUntil: "2026-08-31",
    terms: [
      "Berlaku untuk semua varian aroma",
      "Tidak dapat digabung dengan promo lain",
      "Berlaku untuk pemesanan via WhatsApp maupun beli langsung di toko",
    ],
    active: true,
  },
  {
    id: "gratis-ongkir",
    title: "Gratis Ongkir Jabodetabek",
    description: "Gratis ongkos kirim untuk pemesanan minimal Rp300.000 area Jabodetabek.",
    code: "OASEFREEONGKIR",
    validUntil: "2026-08-15",
    terms: [
      "Minimal transaksi Rp300.000 setelah diskon",
      "Hanya berlaku untuk pengiriman area Jabodetabek",
      "Estimasi pengiriman 1-2 hari kerja",
    ],
    active: true,
  },
];

const testimonials = [
  {
    id: 1,
    name: "Salsa Amelia",
    product: "Oase Bunga Malam",
    rating: 5,
    review: "Aromanya tahan lama dan pas banget sama karakter aku yang suka hal-hal lembut. Suka banget!",
    photo: null,
    documentationPhoto: null,
  },
  {
    id: 2,
    name: "Bagas Pratama",
    product: "Oase Kayu Senja",
    rating: 5,
    review: "Wanginya maskulin tapi ga nyengat. Cocok dipakai kerja maupun santai bareng teman.",
    photo: null,
    documentationPhoto: null,
  },
  {
    id: 3,
    name: "Rani Kusuma",
    product: "Oase Embun Pagi",
    rating: 4,
    review: "Seger banget, cocok buat dipakai pagi hari. Pengiriman juga cepat dan admin ramah.",
    photo: null,
    documentationPhoto: null,
  },
];

const faqs = [
  { id: 1, category: "Produk", question: "Apakah parfum Oase tahan lama?", answer: "Rata-rata produk Oase bertahan 6-8 jam di kulit, tergantung jenis kulit dan aktivitas. Kami menggunakan bibit parfum berkualitas dengan konsentrasi Eau de Parfum." },
  { id: 2, category: "Produk", question: "Apakah ada varian ukuran selain yang tertera?", answer: "Saat ini kami menyediakan ukuran 30ml dan 50ml untuk sebagian besar produk. Untuk kebutuhan ukuran khusus, silakan hubungi kami via WhatsApp." },
  { id: 3, category: "Pengiriman", question: "Berapa lama waktu pengiriman?", answer: "Untuk area Jabodetabek biasanya 1-2 hari kerja, sedangkan luar Jabodetabek 3-5 hari kerja tergantung ekspedisi yang dipilih." },
  { id: 4, category: "Pengiriman", question: "Apakah tersedia COD (Cash on Delivery)?", answer: "COD tersedia untuk beberapa wilayah tertentu melalui mitra ekspedisi. Detail area COD bisa ditanyakan langsung saat checkout via WhatsApp." },
  { id: 5, category: "Pembayaran", question: "Metode pembayaran apa saja yang tersedia?", answer: "Kami menerima transfer bank, e-wallet (OVO, GoPay, Dana), dan QRIS. Detail rekening akan diberikan admin setelah pesanan dikonfirmasi." },
  { id: 6, category: "Retur", question: "Apakah bisa retur atau tukar produk?", answer: "Retur bisa dilakukan maksimal 2x24 jam setelah barang diterima, dengan syarat segel belum dibuka dan produk dalam kondisi baik." },
  { id: 7, category: "Retur", question: "Bagaimana jika produk yang diterima rusak/bocor?", answer: "Segera hubungi kami via WhatsApp maksimal 1x24 jam setelah barang diterima disertai foto/video unboxing, dan kami akan proses penggantian tanpa biaya tambahan." },
];

async function seed() {
  await redis.set("products", JSON.stringify(products));
  console.log(`✅ products (${products.length} item)`);

  await redis.set("promos", JSON.stringify(promos));
  console.log(`✅ promos (${promos.length} item)`);

  await redis.set("testimonials", JSON.stringify(testimonials));
  console.log(`✅ testimonials (${testimonials.length} item)`);

  await redis.set("faqs", JSON.stringify(faqs));
  console.log(`✅ faqs (${faqs.length} item)`);

  console.log("\nSelesai! Semua data awal sudah masuk ke Redis.");
}

seed();
