import { Router } from "express";
import { readData } from "../utils/dataStore.js";

const router = Router();
const FILE = "faqs.json";

// GET /api/faqs -> semua FAQ, dikelompokkan per kategori di frontend
router.get("/", (req, res) => {
  res.json(readData(FILE));
});

export default router;
