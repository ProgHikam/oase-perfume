import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import testimonialsRouter from "./routes/testimonials.js";
import faqsRouter from "./routes/faqs.js";
import promosRouter from "./routes/promos.js";
import authRouter from "./routes/auth.js";
import uploadRouter from "./routes/upload.js";
import { readData } from "./utils/dataStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Menyajikan foto produk & testimoni yang diunggah admin lewat dashboard
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint promo aktif tunggal - dipakai di PromoStrip (Home).
// Diambil dari promo aktif pertama di promos.json, jadi otomatis ikut berubah
// begitu admin menambah/mengubah promo lewat dashboard.
app.get("/api/promo", (req, res) => {
  const promos = readData("promos.json");
  const active = promos.find((p) => p.active);

  if (!active) {
    return res.json({ active: false });
  }

  res.json({
    active: true,
    title: active.title,
    description: active.description,
    code: active.code,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/faqs", faqsRouter);
app.use("/api/promos", promosRouter);
app.use("/api/upload", uploadRouter);

app.get("/", (req, res) => {
  res.send("Oase Perfume API is running");
});

app.listen(PORT, () => {
  console.log(`Oase Perfume backend berjalan di http://localhost:${PORT}`);
});
