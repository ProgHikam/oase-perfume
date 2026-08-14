import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Katalog Produk", href: "/katalog" },
  { label: "Promo", href: "/promo" },
  { label: "Testimoni", href: "/testimoni" },
  { label: "FAQ", href: "/faq" },
  { label: "Cara Pemesanan", href: "/cara-pemesanan" },
  { label: "Kontak", href: "/kontak" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hidden, setHidden] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHidden(currentScrollY > lastScrollY && currentScrollY > 100);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/katalog?cari=${encodeURIComponent(trimmed)}`);
    setQuery("");
    setSearchOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-dark border-b border-neutral-800 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"
        }`}
    >
      <div className="container flex items-center justify-between py-2.5">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Oase Perfume" className="h-10 w-auto sm:h-14" />
        </Link>

        <nav
          className={`lg:flex lg:gap-7 ${menuOpen
            ? "absolute left-0 right-0 top-full flex flex-col bg-dark border-b border-neutral-800"
            : "hidden"
            }`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm text-[#f2e9dc] hover:text-accent lg:border-none lg:px-0 lg:py-0 border-t border-neutral-800 px-6 py-3.5"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form
              className="flex items-center gap-1 rounded-full bg-white/10 py-1 pl-3.5 pr-1.5"
              onSubmit={handleSearchSubmit}
            >
              <input
                ref={searchInputRef}
                type="text"
                className="w-[100px] bg-transparent text-sm text-white placeholder:text-[#b8a99a] outline-none sm:w-[150px]"
                placeholder="Cari produk..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => {
                  if (!query.trim()) setSearchOpen(false);
                }}
              />
              <button type="submit" className="text-lg text-white" aria-label="Cari">
                🔍
              </button>
              <button
                type="button"
                className="text-lg text-white"
                aria-label="Tutup pencarian"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              className="text-lg text-white"
              aria-label="Cari produk"
              onClick={() => setSearchOpen(true)}
            >
              🔍
            </button>
          )}
          <button
            className="text-lg text-white lg:hidden"
            aria-label="Buka menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
