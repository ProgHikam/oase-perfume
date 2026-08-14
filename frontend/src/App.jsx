import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Katalog from "./pages/Katalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Promo from "./pages/Promo.jsx";
import Testimoni from "./pages/Testimoni.jsx";
import FAQ from "./pages/FAQ.jsx";
import CaraPemesanan from "./pages/CaraPemesanan.jsx";
import Kontak from "./pages/Kontak.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/katalog" element={<Katalog />} />
      <Route path="/produk/:id" element={<ProductDetail />} />
      <Route path="/promo" element={<Promo />} />
      <Route path="/testimoni" element={<Testimoni />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/cara-pemesanan" element={<CaraPemesanan />} />
      <Route path="/kontak" element={<Kontak />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
