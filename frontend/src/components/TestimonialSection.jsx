import { useEffect, useState } from "react";
import TestimonialAvatar from "./TestimonialAvatar.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function TestimonialSection() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then((res) => res.json())
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="container mb-10 rounded-xl bg-sand px-4 py-10 sm:mb-14 sm:px-6 sm:py-14">
      <h2 className="mb-6 text-center text-2xl">Apa Kata Mereka</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-lg bg-[#fffdf8] p-[18px]">
            <div className="mb-3 flex items-center gap-2.5">
              <TestimonialAvatar name={t.name} photo={t.photo} />
              <div>
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="mt-0.5 text-[13px] text-gold">{"★".repeat(t.rating)}</p>
              </div>
            </div>
            <p className="mb-2.5 text-sm text-ink">"{t.review}"</p>
            <p className="text-xs text-muted">{t.product}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialSection;
