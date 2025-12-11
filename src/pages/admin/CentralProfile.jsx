// src/pages/admin/RegionProfile.jsx
import { useParams, useNavigate } from "react-router-dom";

function RegionProfile() {
  const navigate = useNavigate();
  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Profil Admin Daerah
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/daerah/panel")}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          Kembali ke daftar putusan
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-[1.2fr,1fr]">
        {/* Data profil */}
        <div className="space-y-4 rounded-xl border bg-white p-4 text-xs shadow-sm md:p-5">
          <h2 className="text-sm font-semibold text-slate-800">
            Data Akun
          </h2>

      <div className="grid gap-3 text-xs">

        {/* Foto Profil */}
        <div className="md:col-span-2 mb-3">
          <label className="block text-[11px] text-slate-500 mb-2">
            Foto Profil
          </label>

          <div className="flex items-center gap-4">
            {/* Gambar Profil */}
            {/* <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border">
              <img
                src="/img/default-profile.jpg"   // ganti sesuai gambar profil
                alt="Foto Profil"
                className="w-full h-full object-cover"
              />
            </div> */}
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
            AD
            </div>

            {/* Input File */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs 
                          focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Format: JPG, PNG — Max 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Nama Lengkap */}
        <div>
          <label className="text-[11px] text-slate-500 block mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            defaultValue="Admin Pengadilan Negeri Contoh"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs 
                      focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Peran (Non Editable) */}
        <div>
          <label className="text-[11px] text-slate-500 block mb-1">
            Peran
          </label>
          <input
            type="text"
            value="Admin Pusat Nasional"
            readOnly
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-slate-100 
                      text-slate-500 cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-[11px] text-slate-500 block mb-1">Email</label>
          <input
            type="email"
            defaultValue="admin.pncontoh@example.go.id"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs 
                      focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Satuan Kerja */}
        <div>
          <label className="text-[11px] text-slate-500 block mb-1">
            Pengadilan / Satuan Kerja
          </label>
          <input
            type="text"
            defaultValue="Pengadilan Negeri Contoh"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs 
                      focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>



          <div>
            <p className="text-[11px] text-slate-500">Catatan</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Data di atas masih dummy dan nantinya akan diambil dari sistem
              autentikasi (misalnya SSO Mahkamah Agung atau modul auth
              internal Gerbang Putusan Nasional).
            </p>
          </div>
        </div>

        {/* Box pengaturan / password */}
        <div className="space-y-4 rounded-xl border bg-white p-4 text-xs shadow-sm md:p-5">
          <h2 className="text-sm font-semibold text-slate-800">
            Pengaturan Akun
          </h2>

          <div>
            <p className="text-[11px] text-slate-500 mb-1">
              Ganti Password
            </p>
            <button
              type="button"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Kirim tautan reset password ke email
            </button>
            <p className="mt-1 text-[11px] text-slate-500">
              Fitur ini hanya placeholder. Nantinya akan terhubung dengan
              layanan reset password yang sebenarnya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegionProfile;
