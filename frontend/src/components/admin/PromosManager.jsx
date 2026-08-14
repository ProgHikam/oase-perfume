import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminFetch } from "../../utils/adminApi.js";

const EMPTY_FORM = {
  title: "",
  description: "",
  code: "",
  validUntil: "",
  terms: "",
  active: true,
};

function PromosManager() {
  const { token, logout } = useAuth();
  const [promos, setPromos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function loadPromos() {
    setStatus("loading");
    adminFetch("/api/promos/all", token)
      .then((data) => {
        setPromos(data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.message.includes("Sesi login")) logout();
        setStatus("error");
      });
  }

  useEffect(() => {
    loadPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(true);
    setError("");
  }

  function openEditForm(promo) {
    setForm({
      title: promo.title,
      description: promo.description,
      code: promo.code,
      validUntil: promo.validUntil ? promo.validUntil.slice(0, 10) : "",
      terms: (promo.terms || []).join("\n"),
      active: promo.active,
    });
    setEditingId(promo.id);
    setFormOpen(true);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      code: form.code,
      validUntil: form.validUntil || null,
      terms: form.terms
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      active: form.active,
    };

    try {
      if (editingId) {
        await adminFetch(`/api/promos/${editingId}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(`/api/promos`, token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setFormOpen(false);
      loadPromos();
    } catch (err) {
      if (err.message.includes("Sesi login")) logout();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus promo ini?")) return;
    try {
      await adminFetch(`/api/promos/${id}`, token, { method: "DELETE" });
      loadPromos();
    } catch (err) {
      if (err.message.includes("Sesi login")) logout();
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl">Kelola Promo</h2>
        <button className="btn btn-primary" onClick={openAddForm}>
          + Tambah Promo
        </button>
      </div>

      {status === "loading" && <p className="text-sm text-muted">Memuat promo...</p>}
      {status === "error" && <p className="text-sm text-muted">Gagal memuat promo.</p>}

      {status === "success" && (
        <div className="overflow-x-auto rounded-lg border border-line bg-[#fffdf8]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Judul
                </th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Kode
                </th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Berlaku Sampai
                </th>
                <th className="border-b border-line bg-sand px-4 py-3 text-left text-xs uppercase tracking-wide text-muted">
                  Status
                </th>
                <th className="border-b border-line bg-sand px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.id}>
                  <td className="border-b border-line px-4 py-3 text-sm">{p.title}</td>
                  <td className="border-b border-line px-4 py-3 text-sm">{p.code}</td>
                  <td className="border-b border-line px-4 py-3 text-sm">
                    {p.validUntil || "-"}
                  </td>
                  <td className="border-b border-line px-4 py-3 text-sm">
                    {p.active ? "Aktif" : "Nonaktif"}
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
            <h3 className="mb-1 text-xl">{editingId ? "Edit Promo" : "Tambah Promo"}</h3>

            <label className="field-label">
              Judul Promo
              <input
                className="field-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>

            <label className="field-label">
              Deskripsi
              <textarea
                className="field-input resize-y"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <label className="field-label">
                Kode Promo
                <input
                  className="field-input"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                />
              </label>
              <label className="field-label">
                Berlaku Sampai
                <input
                  type="date"
                  className="field-input"
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                />
              </label>
            </div>

            <label className="field-label">
              Syarat & Ketentuan (satu baris = satu poin)
              <textarea
                className="field-input resize-y"
                rows="4"
                value={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.value })}
                placeholder={"Berlaku untuk semua varian\nTidak dapat digabung promo lain"}
              />
            </label>

            <label className="field-label !flex-row items-center !gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Aktifkan promo ini (tampil di halaman Promo & Home)
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

export default PromosManager;
