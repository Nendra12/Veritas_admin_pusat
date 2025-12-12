// src/pages/admin/AdminCentralLogin.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../../utils/api";

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

function AdminCentralLogin() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Login dengan username dan password
      const response = await authAPI.login(username, password);
      
      // Simpan token dan user info ke localStorage
      localStorage.setItem('admin_pusat_token', response.data.token);
      localStorage.setItem('admin_pusat_user', JSON.stringify(response.data.admin));
      localStorage.setItem('admin_pusat_logged_in', 'true');
      localStorage.setItem('admin_pusat_access_time', new Date().toISOString());
      
      console.log('Login successful, redirecting to dashboard...');
      navigate("/admin/pusat/panel/dashboard");
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Username atau password salah. Pastikan server berjalan.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-700 bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-wide">
            Admin Server Pusat
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            Portal Manajemen Putusan Nasional
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* ------------------ FORM ------------------ */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 transition duration-150 ease-in-out"
              placeholder="Masukkan username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              autoComplete="username"
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
              disabled={isSubmitting}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer mt-4 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400 transition duration-200 ease-in-out"
          >
            {isSubmitting ? <ThemedSpinner /> : "Login ke Dashboard"}
          </button>
        </form>
        {/* ------------------ END FORM ------------------ */}
        
        <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-xs text-blue-800 font-medium mb-1">ℹ️ Login Default</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Username: <span className="font-mono font-semibold">admin</span></li>
            <li>• Password: <span className="font-mono font-semibold">admin123</span></li>
            <li>• Server: {import.meta.env.VITE_API_BASE_URL || 'localhost:5001'}</li>
          </ul>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 mt-6">
            © 2025 Veritas - Gerbang Putusan Nasional
        </p>
      </div>
    </div>
  );
}

export default AdminCentralLogin;

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
//       <div className="w-full max-w-sm rounded-xl border border-gray-700 bg-white p-8 shadow-2xl">
//         <div className="mb-6 text-center">
//           <h1 className="mt-4 text-xl font-bold text-gray-800 tracking-wide">
//             Login Admin Pusat
//           </h1>
//         </div>

//         {/* ------------------ FORM ASLI ------------------ */}
//         <form onSubmit={handleSubmit} className="space-y-4 text-sm">
//           <div>
//             <label className="mb-1 block text-xs font-semibold text-gray-700">
//               Email / Username
//             </label>
//             <input
//               type="text"
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 transition duration-150 ease-in-out"
//               placeholder="admin.pncontoh@example.go.id"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={isSubmitting} // Menonaktifkan input saat loading
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-xs font-semibold text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 transition duration-150 ease-in-out"
//               placeholder="Masukkan password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={isSubmitting} // Menonaktifkan input saat loading
//             />
//           </div>

//           <div className="flex items-center justify-between pt-1">
//             <label className="inline-flex items-center gap-2 text-xs text-gray-600">
//               <input
//                 type="checkbox"
//                 className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
//                 disabled={isSubmitting} 
//               />
//               <span>Ingat saya</span>
//             </label>
//             <a href="#" className={`text-xs font-medium ${isSubmitting ? 'text-blue-400' : 'text-blue-700 hover:text-blue-900'}`}>
//               Lupa Password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="cursor-pointer mt-4 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400 transition duration-200 ease-in-out"
//           >
//             {isSubmitting ? <ThemedSpinner /> : "Masuk sebagai Admin Pusat"}
//           </button>
//         </form>
//         {/* ------------------ END FORM ASLI ------------------ */}
        
//         <p className="text-center text-[10px] text-gray-400 mt-6">
//             © 2025 Gerbang Putusan
//         </p>
//       </div>
//     </div>
//   );
// }

// export default AdminRegionLogin;