import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminFetch, API_BASE_URL } from "../../utils/adminApi.js";
import { uploadImage } from "../../utils/uploadImage.js";
import { resolveImageUrl } from "../../utils/resolveImageUrl.js";

const EMPTY_FORM = {
  name: "",
  product: "",
  rating: 5,
  review: "",
  photo: "",
  documentationPhoto: "",
};

function TestimonialsManager() {
  const { token, logout } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  function loadTestimonials() {
    setStatus("loading");
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(true);
    setError("");
  }

  function openEditForm(t) {
    setForm({
      name: t.name,
      product: t.product,
      rating: t.rating,
      review: t.review,
      photo: t.photo || "",
      documentationPhoto: t.documentationPhoto || "",
    });
    setEditingId(t.id);
    setFormOpen(true);
    setError("");
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setError("");
    try {
      const url = await uploadImage(file, "testimonials", token);
      setForm((f) => ({ ...f, photo: url }));
    } catch (err) {
      if (err.message.includes("Sesi login")) logout();
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleDocumentationChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    setError("");
    try {
      const url = await uploadImage(file, "testimonials", token);
      setForm((f) => ({ ...f, documentationPhoto: url }));
    } catch (err) {
      if (err.message.includes("Sesi login")) logout();
      setError(err.message);
    } finally {
      setUploadingDoc(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      product: form.product,
      rating: Number(form.rating),
      review: form.review,
      photo: form.photo || null,
      documentationPhoto: form.documentationPhoto || null,
    };

    try {
      if (editingId) {
        await adminFetch(`/api/testimonials/${editingId}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(`/api/testimonials`, token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setFormOpen(false);
      loadTestimonials();
    } catch (err) {
      if (err.message.includes("Sesi login")) logout();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus testimoni ini?")) return;
    try {
      await adminFetch(`/api/testimonials/${id}`, token, { method: "DELETE" });
      loadTestimonials();
    } catch (err) {
      if (err.message.includes("Sesi login")) logout();
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl">Kelola Testimoni</h2>
        <button className="btn btn-primary" onClick={openAddForm}>
          + Tambah Testimoni
        </button>
      </div>

      {status === "loading" && <p className="text-sm text-muted">Memuat testimoni...</p>}
      {status === "error" && <p className="text-sm text-muted">Gagal memuat testimoni.</p>}

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
                  Produk
                </th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Rating
                </th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Ulasan
                </th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Dokumentasi
                </th>
                <th className="border-b border-line bg-sand px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <td className="border-b border-line px-4 py-3">
                    <div className="h-9 w-9 overflow-hidden rounded-full bg-sand">
                      {resolveImageUrl(t.photo) && (
                        <img
                          src={resolveImageUrl(t.photo)}
                          alt={t.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="border-b border-line px-4 py-3 text-sm">{t.name}</td>
                  <td className="border-b border-line px-4 py-3 text-sm">{t.product}</td>
                  <td className="border-b border-line px-4 py-3 text-sm">
                    {"★".repeat(t.rating)}
                  </td>
                  <td className="max-w-[320px] overflow-hidden truncate whitespace-nowrap border-b border-line px-4 py-3 text-sm">
                    {t.review}
                  </td>
                  <td className="border-b border-line px-4 py-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-sand text-[11px] text-muted">
                      {resolveImageUrl(t.documentationPhoto) ? (
                        <img
                          src={resolveImageUrl(t.documentationPhoto)}
                          alt="Bukti testimoni"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </td>
                  <td className="flex flex-wrap gap-2 whitespace-nowrap border-b border-line px-4 py-3">
                    <button
                      className="btn btn-outline px-3.5 py-1.5 text-[13px]"
                      onClick={() => openEditForm(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border-[1.5px] border-red-700 px-3.5 py-1.5 text-[13px] text-red-700 hover:bg-red-700 hover:text-white"
                      onClick={() => handleDelete(t.id)}
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
            <h3 className="mb-1 text-xl">{editingId ? "Edit Testimoni" : "Tambah Testimoni"}</h3>

            <label className="field-label">
              Foto Pelanggan (opsional, tampil sebagai avatar bulat)
              <div className="flex flex-wrap items-center gap-3.5">
                {resolveImageUrl(form.photo) ? (
                  <img
                    src={resolveImageUrl(form.photo)}
                    alt="Preview"
                    className="h-14 w-14 flex-shrink-0 rounded-full border border-line object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-line bg-sand text-center text-[10px] text-muted">
                    Tanpa foto
                  </div>
                )}
                <input
                  type="file"
                  className="text-xs"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePhotoChange}
                  disabled={uploadingPhoto}
                />
                {resolveImageUrl(form.photo) && !uploadingPhoto && (
                  <button
                    type="button"
                    className="text-xs text-red-700 underline"
                    onClick={() => setForm((f) => ({ ...f, photo: "" }))}
                  >
                    Hapus foto
                  </button>
                )}
                {uploadingPhoto && <span className="text-xs text-primary">Mengunggah...</span>}
              </div>
            </label>

            <label className="field-label">
              Dokumentasi Testimoni (opsional, screenshot chat / bukti dari pelanggan)
              <div className="flex flex-wrap items-center gap-3.5">
                {resolveImageUrl(form.documentationPhoto) ? (
                  <img
                    src={resolveImageUrl(form.documentationPhoto)}
                    alt="Preview dokumentasi"
                    className="h-[72px] w-[72px] flex-shrink-0 rounded-lg border border-line object-cover"
                  />
                ) : (
                  <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-lg border border-line bg-sand text-center text-[11px] text-muted">
                    Belum ada dokumentasi
                  </div>
                )}
                <input
                  type="file"
                  className="text-xs"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleDocumentationChange}
                  disabled={uploadingDoc}
                />
                {resolveImageUrl(form.documentationPhoto) && !uploadingDoc && (
                  <button
                    type="button"
                    className="text-xs text-red-700 underline"
                    onClick={() => setForm((f) => ({ ...f, documentationPhoto: "" }))}
                  >
                    Hapus foto
                  </button>
                )}
                {uploadingDoc && <span className="text-xs text-primary">Mengunggah...</span>}
              </div>
            </label>

            <label className="field-label">
              Nama Pelanggan
              <input
                className="field-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <label className="field-label">
                Nama Produk
                <input
                  className="field-input"
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  placeholder="Oase Kayu Senja"
                />
              </label>
              <label className="field-label">
                Rating (1-5)
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="field-input"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />
              </label>
            </div>

            <label className="field-label">
              Isi Ulasan
              <textarea
                className="field-input resize-y"
                rows="4"
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                required
              />
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

export default TestimonialsManager;
