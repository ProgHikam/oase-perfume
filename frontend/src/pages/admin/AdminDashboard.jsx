import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ProductsManager from "../../components/admin/ProductsManager.jsx";
import PromosManager from "../../components/admin/PromosManager.jsx";
import TestimonialsManager from "../../components/admin/TestimonialsManager.jsx";

const TABS = [
  { id: "products", label: "Produk" },
  { id: "promos", label: "Promo" },
  { id: "testimonials", label: "Testimoni" },
];

function AdminDashboard() {
  const { username, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex flex-col items-start gap-3 bg-dark px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-accent">Oase Perfume</p>
          <h1 className="mt-0.5 text-xl text-white">Dashboard Admin</h1>
        </div>
        <div className="flex items-center gap-4 text-[13px] text-[#e8dcc8]">
          <span>Masuk sebagai {username}</span>
          <button
            className="btn btn-outline border-white px-4 py-2 text-white hover:bg-white/10 hover:text-white"
            onClick={logout}
          >
            Keluar
          </button>
        </div>
      </header>

      <nav className="flex gap-1 border-b border-line px-5 pt-4 sm:px-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`border-b-2 px-5 py-3 text-sm ${
              activeTab === tab.id
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="p-5 sm:p-8">
        {activeTab === "products" && <ProductsManager />}
        {activeTab === "promos" && <PromosManager />}
        {activeTab === "testimonials" && <TestimonialsManager />}
      </main>
    </div>
  );
}

export default AdminDashboard;
