import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function BestSellerSection() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products?bestseller=true`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat produk");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section className="container px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl">Best Seller</h2>
        <Link to="/katalog" className="text-sm text-primary">
          Lihat semua produk →
        </Link>
      </div>

      {status === "loading" && <p className="text-sm text-muted">Memuat produk...</p>}
      {status === "error" && (
        <p className="text-sm text-muted">Produk belum bisa dimuat. Coba lagi sebentar lagi.</p>
      )}

      {status === "success" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default BestSellerSection;
