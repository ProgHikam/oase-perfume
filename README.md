# Oase Perfume — Website + Dashboard Admin

Website e-commerce parfum lokal dengan dashboard admin untuk kelola produk,
promo, dan testimoni. Siap deploy 100% ke **Vercel** (frontend + API +
database + storage foto, satu platform saja).

## Struktur Project

```
oase-perfume/
├── frontend/          <- INI YANG DI-DEPLOY KE VERCEL
│   ├── api/            API (serverless functions) - products, promos, dst.
│   ├── src/             React app
│   └── scripts/seed.mjs  Isi data awal ke database
└── backend/           <- HANYA untuk testing cepat di laptop sendiri
                           (Express + file JSON, TIDAK dipakai saat live)
```

## Database — Upstash Redis (via Vercel Marketplace)

Data produk, promo, testimoni, dan FAQ disimpan sebagai **JSON di Redis**
(lewat integrasi Upstash yang tersedia native di Vercel). **Tidak ada SQL
sama sekali** — jadi tidak ada tabel, tidak ada migration, tidak ada
error "prepared statement" seperti sebelumnya.

Cara membayangkannya: dulu tiap jenis data (produk, promo, dst.) adalah 1
file `.json`. Sekarang konsepnya identik, cuma "file" itu disimpan sebagai
1 baris di Redis supaya tetap ada meski di serverless function Vercel yang
tidak punya disk permanen.

### Setup sekali di awal (5 langkah)

1. Di dashboard project Vercel → tab **Storage** → **Create Database** → cari **Upstash** → pilih **Redis** → **Create**. Vercel otomatis menyambungkan ke project ini dan menambahkan environment variable (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) — tidak perlu diisi manual.
2. Di komputer sendiri, masuk ke folder `frontend/`:
   ```bash
   npm install -g vercel     # kalau belum pernah install Vercel CLI
   cd frontend
   vercel link               # sekali saja, hubungkan folder ini ke project Vercel
   vercel env pull           # ambil KV_REST_API_URL & KV_REST_API_TOKEN ke .env.local
   ```
3. Jalankan script isi data awal (isinya 12 produk, 2 promo, 3 testimoni, 7 FAQ yang sudah pernah kita siapkan):
   ```bash
   node scripts/seed.mjs
   ```
4. Kalau muncul `✅ products (12 item)` dst. sampai selesai — database sudah terisi.
5. Redeploy project di Vercel (Deployments → "..." → Redeploy) supaya function baru terbaca.

**Untuk isi ulang / reset data** kapan pun: jalankan lagi `node scripts/seed.mjs` — aman, akan menimpa data lama, bukan menambah duplikat.

### Storage foto — Vercel Blob

Foto produk & testimoni yang diupload lewat dashboard admin disimpan di
**Vercel Blob** (bukan disk lokal, karena serverless function tidak punya
disk permanen).

1. Tab **Storage** → **Create Database** → pilih **Blob** → **Create**.
2. Vercel otomatis menambahkan env var `BLOB_READ_WRITE_TOKEN` — tidak perlu diisi manual.

### Environment variable yang perlu diisi manual

Di Settings → Environment Variables, tambahkan 3 ini (yang lain otomatis dari langkah di atas):

| Nama | Isi |
|---|---|
| `ADMIN_USERNAME` | Username untuk login dashboard admin |
| `ADMIN_PASSWORD` | Password login (jangan pakai contoh, ganti sendiri) |
| `JWT_SECRET` | String acak panjang, misal dari generate-secret.vercel.app/32 |

Setelah diisi, redeploy sekali lagi.

## Cara menjalankan di komputer sendiri (development)

**Opsi A — paling cepat, tanpa perlu setup Redis/Vercel dulu:**
Pakai `backend/` (Express biasa + file JSON lokal). Cocok untuk coba-coba
tampilan atau fitur baru tanpa mikirin database. Sudah otomatis nyambung
lewat `frontend/.env.development` (isinya `VITE_API_BASE_URL=http://localhost:5000`)
— file ini HANYA aktif saat `npm run dev`, tidak akan ikut ke build production/Vercel.
```bash
cd backend && npm install && npm run dev     # jalan di :5000
cd frontend && npm install && npm run dev    # jalan di :3000, otomatis connect ke :5000
```

**Opsi B — testing dengan setup asli (Redis + Blob), sebelum deploy:**
```bash
cd frontend
vercel dev        # jalankan frontend + api/ sekaligus, pakai Redis/Blob yang sudah disetup
```

## Dashboard Admin

- **URL login**: `/admin/login` (ada juga link kecil "Admin" di footer website)
- Setelah login, bisa kelola **Produk** (termasuk upload foto & fragrance notes), **Promo** (kode, syarat ketentuan, aktif/nonaktif), dan **Testimoni** (termasuk foto pelanggan & dokumentasi bukti chat)
- Semua perubahan langsung tersimpan ke Redis dan langsung terlihat oleh pengunjung website

## Styling — Tailwind CSS

Semua styling pakai Tailwind langsung di className komponen. Warna & font
brand didefinisikan di `frontend/tailwind.config.js` (`primary`, `accent`,
`dark`, `cream`, `sand`, `ink`, `muted`, `gold`, `whatsapp`, `line`) — kalau
mau ganti warna brand, cukup edit file itu saja.

## Struktur API (`frontend/api/`)

```
api/
├── lib/
│   ├── db.js       koneksi Redis + helper getCollection/setCollection
│   ├── auth.js     verifikasi JWT
│   └── cors.js
├── auth/
│   ├── login.js    POST /api/auth/login
│   └── me.js       GET  /api/auth/me
├── products/
│   ├── index.js    GET/POST /api/products
│   └── [id].js     GET/PUT/DELETE /api/products/:id
├── promos/
│   ├── index.js    GET/POST /api/promos          (hanya yang aktif)
│   ├── all.js       GET /api/promos/all           (admin, termasuk nonaktif)
│   └── [id].js      PUT/DELETE /api/promos/:id
├── testimonials/
│   ├── index.js    GET/POST /api/testimonials
│   └── [id].js     PUT/DELETE /api/testimonials/:id
├── faqs/
│   └── index.js    GET /api/faqs
├── upload/
│   └── [type].js   POST /api/upload/products atau /api/upload/testimonials
└── promo.js         GET /api/promo (1 promo aktif, dipakai section Home)
```

Setiap endpoint di atas punya bentuk yang sama: **GET** ambil seluruh data
dari 1 key Redis lalu difilter di JavaScript (bukan query rumit), **POST/PUT/DELETE**
ambil data, ubah array-nya di JavaScript, simpan lagi ke Redis. Ini sengaja
dibuat sesederhana mungkin — logic-nya identik dengan versi file JSON yang
lama, cuma tempat simpannya beda.

## Ganti nomor WhatsApp

Dipakai di: `ProductCard.jsx`, `WhatsAppFloatButton.jsx`, `Footer.jsx`,
`ProductDetail.jsx`, `Promo.jsx`, `Kontak.jsx`.

## Belum dikerjakan / keterbatasan

- Link "Beli di Shopee" di halaman Detail Produk masih placeholder (`shopeeLink` di `ProductDetail.jsx`) — ganti dengan link toko Shopee asli.
- Alamat toko & embed peta di halaman Kontak masih perlu disesuaikan dengan alamat asli.
- Hanya 1 akun admin (username/password tunggal), belum ada multi-user dengan role berbeda.
