import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/admin", { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-6">
      <form
        className="flex w-full max-w-[380px] flex-col gap-3.5 rounded-xl bg-[#fffdf8] p-10"
        onSubmit={handleSubmit}
      >
        <p className="text-xs uppercase tracking-wide text-primary">Oase Perfume</p>
        <h1 className="mt-1 text-2xl">Dashboard Admin</h1>
        <p className="mb-2.5 text-[13px] text-muted">
          Masuk untuk mengelola produk, promo, dan testimoni.
        </p>

        <label className="field-label">
          Username
          <input
            type="text"
            className="field-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="field-label">
          Password
          <input
            type="password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="text-[13px] text-red-700">{error}</p>}

        <button type="submit" className="btn btn-primary mt-2 justify-center" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
