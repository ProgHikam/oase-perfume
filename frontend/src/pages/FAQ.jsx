import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/faqs`)
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    faqs.forEach((f) => {
      if (!map[f.category]) map[f.category] = [];
      map[f.category].push(f);
    });
    return map;
  }, [faqs]);

  return (
    <>
      <Header />
      <main>
        <section className="mb-8 bg-sand py-8 sm:py-12">
          <div className="container">
            <p className="mb-2 text-[13px] uppercase tracking-widest text-primary">FAQ</p>
            <h1 className="text-2xl text-ink sm:text-[32px]">
              Pertanyaan yang Sering Ditanyakan
            </h1>
          </div>
        </section>

        <section className="container max-w-[760px] pb-16">
          {status === "loading" && <p className="text-sm text-muted">Memuat FAQ...</p>}
          {status === "error" && <p className="text-sm text-muted">FAQ belum bisa dimuat.</p>}

          {status === "success" &&
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h2 className="mb-3 text-lg text-primary">{category}</h2>
                {items.map((item) => (
                  <div key={item.id} className="border-b border-line">
                    <button
                      className="flex w-full items-center justify-between py-4 text-left font-body text-[15px] text-ink"
                      onClick={() => setOpenId(openId === item.id ? null : item.id)}
                    >
                      {item.question}
                      <span className="ml-3 flex-shrink-0 text-xl text-primary">
                        {openId === item.id ? "−" : "+"}
                      </span>
                    </button>
                    {openId === item.id && (
                      <p className="pb-4 text-sm leading-[1.7] text-muted">{item.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

export default FAQ;
