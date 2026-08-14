import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function PromoStrip() {
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/promo`)
      .then((res) => res.json())
      .then((data) => {
        if (data.active) setPromo(data);
      })
      .catch(() => setPromo(null));
  }, []);

  if (!promo) return null;

  return (
    <section className="container pb-10 sm:pb-14">
      <div className="flex flex-col items-start gap-4 rounded-xl bg-primary p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="mb-1 font-heading text-xl">{promo.title}</p>
          <p className="text-sm opacity-85">{promo.description}</p>
        </div>
        <Link to="/promo" className="btn bg-white text-primary whitespace-nowrap hover:bg-white/90">
          Lihat Promo
        </Link>
      </div>
    </section>
  );
}

export default PromoStrip;
