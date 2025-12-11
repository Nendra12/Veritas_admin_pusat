// src/pages/admin/AdminRegionLogin.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// --- Komponen Loader Sederhana yang Keren ---
const ThemedSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
        {/* Spinner Utama: Dibuat tebal (border-4) dan menggunakan warna biru (primary) */}
        <div className="relative h-6 w-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-blue-700 animate-spin"></div>
        </div>
        {/* Teks Loading */}
        <span className="text-sm font-semibold text-gray-700">
            Memuat Dashboard...
        </span>
    </div>
);

function AdminRegionLogin() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('Login attempt with:', { email, password });
      navigate("/admin/pusat/panel/dashboard");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-700 bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="mt-4 text-xl font-bold text-gray-800 tracking-wide">
            Login Admin Pusat
          </h1>
        </div>

        {/* ------------------ FORM ASLI ------------------ */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Email / Username
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 transition duration-150 ease-in-out"
              placeholder="admin.pncontoh@example.go.id"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting} // Menonaktifkan input saat loading
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 transition duration-150 ease-in-out"
              placeholder="Masukkan password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting} // Menonaktifkan input saat loading
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                disabled={isSubmitting} 
              />
              <span>Ingat saya</span>
            </label>
            <a href="#" className={`text-xs font-medium ${isSubmitting ? 'text-blue-400' : 'text-blue-700 hover:text-blue-900'}`}>
              Lupa Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer mt-4 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400 transition duration-200 ease-in-out"
          >
            {isSubmitting ? <ThemedSpinner /> : "Masuk sebagai Admin Pusat"}
          </button>
        </form>
        {/* ------------------ END FORM ASLI ------------------ */}
        
        <p className="text-center text-[10px] text-gray-400 mt-6">
            © 2025 Gerbang Putusan
        </p>
      </div>
    </div>
  );
}

export default AdminRegionLogin;