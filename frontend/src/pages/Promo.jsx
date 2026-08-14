import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Promo() {
  const [promos, setPromos] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/promos`)
      .then((res) => res.json())
      .then((data) => {
        setPromos(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="mb-8 bg-sand py-8 sm:py-12">
          <div className="container">
            <p className="mb-2 text-[13px] uppercase tracking-widest text-primary">Promo</p>
            <h1 className="text-2xl text-ink sm:text-[32px]">Penawaran Spesial Buat Kamu</h1>
          </div>
        </section>

        <section className="container flex flex-col gap-6 pb-16">
          {status === "loading" && <p className="text-sm text-muted">Memuat promo...</p>}
          {status === "error" && (
            <p className="text-sm text-muted">Promo belum bisa dimuat. Coba lagi sebentar lagi.</p>
          )}
          {status === "success" && promos.length === 0 && (
            <p className="text-sm text-muted">Belum ada promo aktif saat ini.</p>
          )}

          {status === "success" &&
            promos.map((promo) => {
              const waMessage = encodeURIComponent(
                `Halo Oase Perfume, saya mau tanya soal promo "${promo.title}" dengan kode ${promo.code}.`
              );
              return (
                <div
                  key={promo.id}
                  className="grid grid-cols-1 overflow-hidden rounded-xl border border-line bg-[#fffdf8] sm:grid-cols-[2fr_1fr]"
                >
                  <div className="p-5 sm:p-7">
                    <h2 className="mb-2 text-xl text-ink sm:text-[22px]">{promo.title}</h2>
                    <p className="mb-2 text-sm text-muted">{promo.description}</p>
                    <p className="mb-4 text-[13px] font-semibold text-primary">
                      Berlaku sampai {formatDate(promo.validUntil)}
                    </p>
                    <ul className="list-disc space-y-1 pl-[18px] text-[13px] leading-[1.8] text-muted">
                      {promo.terms.map((term, i) => (
                        <li key={i}>{term}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-1.5 bg-sand p-5 sm:p-7">
                    <p className="text-xs text-muted">Kode Promo</p>
                    <p className="mb-3.5 text-xl font-bold tracking-wide text-primary">
                      {promo.code}
                    </p>
                    <a
                      href={`https://wa.me/628995311081?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      Pakai Promo Ini
                    </a>
                  </div>
                </div>
              );
            })}
        </section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

export default Promo;
