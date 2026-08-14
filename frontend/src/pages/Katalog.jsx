import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton.jsx";
import ProductCard from "../components/ProductCard.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const CATEGORIES = ["Semua", "Fresh", "Woody", "Floral", "Oriental"];

function Katalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("terbaru");

  const activeCategory = searchParams.get("kategori") || "Semua";

  useEffect(() => {
    const cari = searchParams.get("cari");
    if (cari !== null) {
      setSearch(cari);
    }
  }, [searchParams]);

  useEffect(() => {
    setStatus("loading");
    const url =
      activeCategory === "Semua"
        ? `${API_BASE_URL}/api/products`
        : `${API_BASE_URL}/api/products?category=${activeCategory}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [activeCategory]);

  const visibleProducts = useMemo(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "harga-rendah") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "harga-tinggi") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, sort]);

  function handleCategoryClick(category) {
    if (category === "Semua") {
      setSearchParams({});
    } else {
      setSearchParams({ kategori: category.toLowerCase() === activeCategory.toLowerCase() ? "" : category });
    }
  }

  return (
    <>
      <Header />
      <main>
        <section className="mb-8 bg-sand py-12">
          <div className="container">
            <p className="mb-2 text-[13px] uppercase tracking-widest text-primary">
              Katalog Produk
            </p>
            <h1 className="text-2xl text-ink sm:text-[32px]">Jelajahi Semua Aroma Oase</h1>
          </div>
        </section>

        <section className="container pb-16">
          <div className="mb-7 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`rounded-full border px-[18px] py-2 text-[13px] transition-colors ${
                    activeCategory.toLowerCase() === cat.toLowerCase() ||
                    (cat === "Semua" && !searchParams.get("kategori"))
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-[#fffdf8] text-ink hover:border-primary"
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input
                type="text"
                placeholder="Cari nama produk..."
                className="rounded-lg border border-line bg-[#fffdf8] px-3.5 py-2.5 text-[13px] text-ink sm:min-w-[220px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="rounded-lg border border-line bg-[#fffdf8] px-3.5 py-2.5 text-[13px] text-ink"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="terbaru">Terbaru</option>
                <option value="harga-rendah">Harga Terendah</option>
                <option value="harga-tinggi">Harga Tertinggi</option>
              </select>
            </div>
          </div>

          {status === "loading" && <p className="py-6 text-sm text-muted">Memuat produk...</p>}
          {status === "error" && (
            <p className="py-6 text-sm text-muted">
              Produk belum bisa dimuat. Coba lagi sebentar lagi.
            </p>
          )}
          {status === "success" && visibleProducts.length === 0 && (
            <p className="py-6 text-sm text-muted">Tidak ada produk yang cocok dengan pencarianmu.</p>
          )}

          {status === "success" && visibleProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

export default Katalog;
