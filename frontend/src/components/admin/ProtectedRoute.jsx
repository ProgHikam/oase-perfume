import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAuth();

  if (checking) {
    return <p style={{ padding: 40, textAlign: "center" }}>Memuat...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
