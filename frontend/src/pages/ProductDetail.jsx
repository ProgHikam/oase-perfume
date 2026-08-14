import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton.jsx";
import ProductCard from "../components/ProductCard.jsx";
import TestimonialAvatar from "../components/TestimonialAvatar.jsx";
import { resolveImageUrl } from "../utils/resolveImageUrl.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || null);
        setStatus("success");

        fetch(`${API_BASE_URL}/api/products?category=${data.category}`)
          .then((res) => res.json())
          .then((all) => setRelated(all.filter((p) => p.id !== data.id).slice(0, 4)));

        fetch(`${API_BASE_URL}/api/testimonials`)
          .then((res) => res.json())
          .then((all) => setReviews(all.filter((t) => t.product === data.name)));
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") {
    return (
      <>
        <Header />
        <p className="container py-16 text-center text-muted">Memuat produk...</p>
        <Footer />
      </>
    );
  }

  if (status === "error" || !product) {
    return (
      <>
        <Header />
        <div className="container flex flex-col items-center gap-4 py-16 text-center text-muted">
          <p>Produk tidak ditemukan.</p>
          <Link to="/katalog" className="btn btn-primary">
            Kembali ke Katalog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const waMessage = encodeURIComponent(
    `Halo Oase Perfume, saya tertarik dengan produk "${product.name}" ukuran ${selectedSize}. Bisa dibantu info lebih lanjut?`
  );
  const waLink = `https://wa.me/628995311081?text=${waMessage}`;
  const shopeeLink = "https://id.shp.ee/mwtTcNHt";

  return (
    <>
      <Header />
      <main>
        <section className="container grid grid-cols-1 gap-6 py-6 sm:gap-12 sm:py-10 lg:grid-cols-2">
          <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl bg-sand text-[13px] text-muted sm:min-h-[420px]">
            {resolveImageUrl(product.image) ? (
              <img
                src={resolveImageUrl(product.image)}
                alt={product.name}
                className="h-full min-h-[280px] w-full object-cover sm:min-h-[420px]"
              />
            ) : (
              <span>Foto produk</span>
            )}
          </div>

          <div>
            <span className="mb-3 inline-block rounded-full bg-dark px-2.5 py-1 text-[11px] text-white">
              {product.category}
            </span>
            <h1 className="mb-2 text-2xl text-ink sm:text-[32px]">{product.name}</h1>
            <p className="mb-3 text-[15px] text-muted">{product.character}</p>
            <p className="mb-6 text-2xl font-semibold text-primary">
              {formatPrice(product.price)}
            </p>

            <div className="mb-5 rounded-lg border border-line bg-[#fffdf8] p-[18px]">
              <p className="mb-3 text-[13px] uppercase tracking-wide text-muted">
                Fragrance Notes
              </p>
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="mb-1 text-[13px] font-semibold text-ink">Top Notes</p>
                  <p>{product.notes.top.join(", ")}</p>
                </div>
                <div>
                  <p className="mb-1 text-[13px] font-semibold text-ink">Middle Notes</p>
                  <p>{product.notes.middle.join(", ")}</p>
                </div>
                <div>
                  <p className="mb-1 text-[13px] font-semibold text-ink">Base Notes</p>
                  <p>{product.notes.base.join(", ")}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[13px] uppercase tracking-wide text-muted">
                Pilih Ukuran
              </p>
              <div className="flex gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`rounded-lg border-[1.5px] px-5 py-2 text-sm ${selectedSize === size
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-[#fffdf8] text-ink"
                      }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp justify-center"
              >
                Pesan via WhatsApp
              </a>
              <a
                href={shopeeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary justify-center"
              >
                Beli di Shopee
              </a>
            </div>
          </div>
        </section>

        {reviews.length > 0 && (
          <section className="container pb-10 sm:pb-14">
            <h2 className="mb-5 text-xl sm:text-2xl">Ulasan untuk {product.name}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-lg border border-line bg-[#fffdf8] p-4">
                  <div className="mb-2 flex items-center gap-2.5">
                    <TestimonialAvatar name={r.name} photo={r.photo} />
                    <p className="text-sm font-semibold text-ink">{r.name}</p>
                  </div>
                  <p className="mb-2 text-sm text-gold">{"★".repeat(r.rating)}</p>
                  <p className="text-sm">"{r.review}"</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="container pb-10 sm:pb-14">
            <h2 className="mb-5 text-xl sm:text-2xl">Produk Terkait</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

export default ProductDetail;
