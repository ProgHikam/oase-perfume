import { Link } from "react-router-dom";

const linkClass = "block py-1 text-sm opacity-90 hover:opacity-100 hover:text-accent";

function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-800 bg-dark pt-12 pb-6 text-white">
      <div className="container grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr_1fr] md:gap-8">
        <div>
          <p className="mb-2 font-heading text-xl">Oase Perfume</p>
          <p className="max-w-[320px] text-[13px] opacity-75">
            Brand parfum lokal yang membantu kamu menemukan aroma sesuai
            karakter dan gaya hidupmu.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[13px] uppercase tracking-wide opacity-60">Navigasi</p>

          <Link to="/katalog" className={linkClass}>
            Katalog Produk
          </Link>
          <Link to="/cara-pemesanan" className={linkClass}>
            Cara Pemesanan
          </Link>
          <Link to="/faq" className={linkClass}>
            FAQ
          </Link>
        </div>

        <div>
          <p className="mb-3 text-[13px] uppercase tracking-wide opacity-60">Kontak</p>
          <a
            href="https://wa.me/628995311081"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/oase_parfume?utm_source=qr&igsh=dmcybW1ocXN6Ymhq"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Instagram
          </a>
          <a href="mailto:oaseparfum24@gmail.com" className={linkClass}>
            oaseparfum24@gmail.com
          </a>
        </div>
      </div>

      <p className="mt-8 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Oase Perfume. Seluruh hak cipta dilindungi.
        {" · "}
        <Link to="/admin/login" className="opacity-70 hover:opacity-100 hover:text-accent">
          Admin
        </Link>
      </p>
    </footer>
  );
}

export default Footer;
