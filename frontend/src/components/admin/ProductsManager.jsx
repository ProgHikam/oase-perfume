import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminFetch, API_BASE_URL } from "../../utils/adminApi.js";
import { uploadImage } from "../../utils/uploadImage.js";
import { resolveImageUrl } from "../../utils/resolveImageUrl.js";

const CATEGORIES = ["Fresh", "Woody", "Floral", "Oriental"];

const EMPTY_FORM = {
  name: "",
  category: "Fresh",
  character: "",
  price: "",
  sizes: "30ml, 50ml",
  notesTop: "",
  notesMiddle: "",
  notesBase: "",
  bestseller: false,
  image: "",
};

function toCommaList(text) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function ProductsManager() {
  const { token, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function loadProducts() {
    setStatus("loading");
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(true);
    setError("");
  }

  function openEditForm(product) {
    setForm({
      name: product.name,
      category: product.category,
      character: product.character,
      price: product.price,
      sizes: product.sizes.join(", "),
      notesTop: product.notes.top.join(", "),
      notesMiddle: product.notes.middle.join(", "),
      notesBase: product.notes.base.join(", "),
      bestseller: product.bestseller,
      image: product.image || "",
    });
    setEditingId(product.id);
    setFormOpen(true);
    setError("");
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, "products", token);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      if (err.message.includes("Sesi login")) logout();
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      category: form.category,
      character: form.character,
      price: Number(form.price),
      sizes: toCommaList(form.sizes),
      bestseller: form.bestseller,
      image: form.image,
      notes: {
        top: toCommaList(form.notesTop),
        middle: toCommaList(form.notesMiddle),
        base: toCommaList(form.notesBase),
      },
    };

    try {
      if (editingId) {
        await adminFetch(`/api/products/${editingId}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(`/api/products`, token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setFormOpen(false);
      loadProducts();
    } catch (err) {
      if (err.message.includes("Sesi login")) logout();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus produk ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      await adminFetch(`/api/products/${id}`, token, { method: "DELETE" });
      loadProducts();
    } catch (err) {
      if (err.message.includes("Sesi login")) logout();
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl">Kelola Produk</h2>
        <button className="btn btn-primary" onClick={openAddForm}>
          + Tambah Produk
        </button>
      </div>

      {status === "loading" && <p className="text-sm text-muted">Memuat produk...</p>}
      {status === "error" && <p className="text-sm text-muted">Gagal memuat produk.</p>}

      {status === "success" && (
        <div className="overflow-x-auto rounded-lg border border-line bg-[#fffdf8]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-line bg-sand px-4 py-3"></th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Nama
                </th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Kategori
                </th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Harga
                </th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Best Seller
                </th>
                <th className="border-b border-line bg-sand px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="border-b border-line px-4 py-3 last:border-0">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-sand text-[11px] text-muted">
                      {resolveImageUrl(p.image) ? (
                        <img
                          src={resolveImageUrl(p.image)}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-line px-4 py-3 text-sm">{p.name}</td>
                  <td className="border-b border-line px-4 py-3 text-sm">{p.category}</td>
                  <td className="border-b border-line px-4 py-3 text-sm">
                    {formatPrice(p.price)}
                  </td>
                  <td className="border-b border-line px-4 py-3 text-sm">
                    {p.bestseller ? "Ya" : "-"}
                  </td>
                  <td className="flex flex-wrap gap-2 whitespace-nowrap border-b border-line px-4 py-3">
                    <button
                      className="btn btn-outline px-3.5 py-1.5 text-[13px]"
                      onClick={() => openEditForm(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border-[1.5px] border-red-700 px-3.5 py-1.5 text-[13px] text-red-700 hover:bg-red-700 hover:text-white"
                      onClick={() => handleDelete(p.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#1a120c]/60 px-5 py-10"
          onClick={() => setFormOpen(false)}
        >
          <form
            className="flex w-full max-w-[520px] flex-col gap-3.5 rounded-xl bg-[#fffdf8] p-7"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h3 className="mb-1 text-xl">{editingId ? "Edit Produk" : "Tambah Produk"}</h3>

            <label className="field-label">
              Foto Produk
              <div className="flex flex-wrap items-center gap-3.5">
                {resolveImageUrl(form.image) ? (
                  <img
                    src={resolveImageUrl(form.image)}
                    alt="Preview"
                    className="h-[72px] w-[72px] flex-shrink-0 rounded-lg border border-line object-cover"
                  />
                ) : (
                  <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-lg border border-line bg-sand text-center text-[11px] text-muted">
                    Belum ada foto
                  </div>
                )}
                <input
                  type="file"
                  className="text-xs"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePhotoChange}
                  disabled={uploading}
                />
                {resolveImageUrl(form.image) && !uploading && (
                  <button
                    type="button"
                    className="text-xs text-red-700 underline"
                    onClick={() => setForm((f) => ({ ...f, image: "" }))}
                  >
                    Hapus foto
                  </button>
                )}
                {uploading && <span className="text-xs text-primary">Mengunggah...</span>}
              </div>
            </label>

            <label className="field-label">
              Nama Produk
              <input
                className="field-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <label className="field-label">
                Kategori
                <select
                  className="field-input"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                Harga (Rp)
                <input
                  type="number"
                  className="field-input"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </label>
            </div>

            <label className="field-label">
              Karakter Pengguna
              <input
                className="field-input"
                value={form.character}
                onChange={(e) => setForm({ ...form, character: e.target.value })}
                placeholder="Untuk yang tenang, percaya diri..."
              />
            </label>

            <label className="field-label">
              Ukuran tersedia (pisahkan dengan koma)
              <input
                className="field-input"
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder="30ml, 50ml"
              />
            </label>

            <p className="-mb-1 mt-2 text-xs uppercase tracking-wide text-primary">
              Fragrance Notes (pisahkan dengan koma)
            </p>
            <label className="field-label">
              Top Notes
              <input
                className="field-input"
                value={form.notesTop}
                onChange={(e) => setForm({ ...form, notesTop: e.target.value })}
                placeholder="Bergamot, Lada hitam"
              />
            </label>
            <label className="field-label">
              Middle Notes
              <input
                className="field-input"
                value={form.notesMiddle}
                onChange={(e) => setForm({ ...form, notesMiddle: e.target.value })}
                placeholder="Cedarwood, Vetiver"
              />
            </label>
            <label className="field-label">
              Base Notes
              <input
                className="field-input"
                value={form.notesBase}
                onChange={(e) => setForm({ ...form, notesBase: e.target.value })}
                placeholder="Sandalwood, Musk"
              />
            </label>

            <label className="field-label !flex-row items-center !gap-2">
              <input
                type="checkbox"
                checked={form.bestseller}
                onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
              />
              Tampilkan sebagai Best Seller di Home
            </label>

            {error && <p className="text-[13px] text-red-700">{error}</p>}

            <div className="mt-2 flex justify-end gap-2.5">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setFormOpen(false)}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductsManager;
