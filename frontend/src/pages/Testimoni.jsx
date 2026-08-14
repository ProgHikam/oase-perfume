import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton.jsx";
import TestimonialAvatar from "../components/TestimonialAvatar.jsx";
import { resolveImageUrl } from "../utils/resolveImageUrl.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function Testimoni() {
  const [testimonials, setTestimonials] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filterProduct, setFilterProduct] = useState("Semua");
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  const products = useMemo(
    () => ["Semua", ...new Set(testimonials.map((t) => t.product))],
    [testimonials]
  );

  const visible =
    filterProduct === "Semua"
      ? testimonials
      : testimonials.filter((t) => t.product === filterProduct);

  return (
    <>
      <Header />
      <main>
        <section className="mb-8 bg-sand py-8 sm:py-12">
          <div className="container">
            <p className="mb-2 text-[13px] uppercase tracking-widest text-primary">Testimoni</p>
            <h1 className="text-2xl text-ink sm:text-[32px]">
              Apa Kata Mereka yang Sudah Coba
            </h1>
          </div>
        </section>

        <section className="container pb-16">
          {status === "success" && products.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {products.map((p) => (
                <button
                  key={p}
                  className={`rounded-full border px-[18px] py-2 text-[13px] ${
                    filterProduct === p
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-[#fffdf8] text-ink"
                  }`}
                  onClick={() => setFilterProduct(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {status === "loading" && <p className="text-sm text-muted">Memuat testimoni...</p>}
          {status === "error" && <p className="text-sm text-muted">Testimoni belum bisa dimuat.</p>}

          {status === "success" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((t) => {
                const docUrl = resolveImageUrl(t.documentationPhoto);
                return (
                  <div key={t.id} className="rounded-lg border border-line bg-[#fffdf8] p-[18px]">
                    <div className="mb-3 flex items-center gap-2.5">
                      <TestimonialAvatar name={t.name} photo={t.photo} />
                      <div>
                        <p className="text-sm font-semibold text-ink">{t.name}</p>
                        <p className="mt-0.5 text-[13px] text-gold">{"★".repeat(t.rating)}</p>
                      </div>
                    </div>
                    <p className="mb-2.5 text-sm text-ink">"{t.review}"</p>
                    <p className="text-xs text-muted">{t.product}</p>

                    {docUrl && (
                      <button
                        type="button"
                        className="mt-3 flex items-center gap-2 rounded-full border border-line bg-sand py-1.5 pl-1.5 pr-2.5 font-body text-xs text-ink"
                        onClick={() => setLightboxImage(docUrl)}
                      >
                        <img
                          src={docUrl}
                          alt={`Bukti testimoni dari ${t.name}`}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <span>Lihat dokumentasi</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <WhatsAppFloatButton />

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1a120c]/85 p-6"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Dokumentasi testimoni"
            className="max-h-[90vh] max-w-full rounded-lg"
          />
          <button
            type="button"
            className="absolute right-6 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-base text-white"
            onClick={() => setLightboxImage(null)}
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

export default Testimoni;
