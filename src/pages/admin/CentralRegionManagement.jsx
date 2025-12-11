// src/pages/admin/CentralRegionManagement.jsx

function CentralRegionManagement() {
  const servers = [
    {
      name: "PN Contoh Kota",
      code: "PNCK",
      endpoint: "https://pnck.gpn.example.go.id",
      status: "online",
      region: "Jawa Timur",
    },
    {
      name: "PN Bojonegoro",
      code: "PNBG",
      endpoint: "https://pnbg.gpn.example.go.id",
      status: "online",
      region: "Jawa Timur",
    },
    {
      name: "PN Denpasar",
      code: "PNDPS",
      endpoint: "https://pndps.gpn.example.go.id",
      status: "offline",
      region: "Bali",
    },
  ];

  const badgeStatus = (status) => {
    const base =
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold";
    if (status === "online")
      return (
        <span className={`${base} bg-emerald-50 text-emerald-700`}>
          ● Online
        </span>
      );
    return (
      <span className={`${base} bg-rose-50 text-rose-700`}>
        ● Offline
      </span>
    );
  };

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">
          Manajemen Server Daerah
        </h1>
      </header>

      {/* Form tambah server baru (dummy) */}
      <div className="rounded-sm border bg-white p-4 text-xs shadow-sm md:p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          Tambah Server Daerah Baru
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] text-slate-600">
              Nama Pengadilan / Server
            </label>
            <input
              type="text"
              placeholder="Contoh: Pengadilan Negeri Surabaya"
              className="w-full rounded-sm border border-slate-300 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-600">
              Kode Server
            </label>
            <input
              type="text"
              placeholder="Contoh: PNSBY"
              className="w-full rounded-sm border border-slate-300 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-600">
              Wilayah / Provinsi
            </label>
            <input
              type="text"
              placeholder="Contoh: Jawa Timur"
              className="w-full rounded-sm border border-slate-300 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-[11px] text-slate-600">
            Endpoint API Server Daerah
          </label>
          <input
            type="text"
            placeholder="https://pnsby.gpn.example.go.id/api"
            className="w-full rounded-sm border border-slate-300 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Endpoint ini akan digunakan oleh server pusat untuk mengambil
            metadata dan dokumen putusan saat proses sinkronisasi.
          </p>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="rounded-sm bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-700">
            Simpan Konfigurasi
          </button>
        </div>
      </div>

      {/* Tabel daftar server di sistem */}
      <div className="rounded-sm border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Daftar Server Daerah Terdaftar
          </h2>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Nama Server
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Kode
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Wilayah
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Endpoint
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {servers.map((srv) => (
                <tr key={srv.code}>
                  <td className="px-4 py-2 font-semibold text-slate-800">
                    {srv.name}
                  </td>
                  <td className="px-4 py-2 text-slate-700">{srv.code}</td>
                  <td className="px-4 py-2 text-slate-700">{srv.region}</td>
                  <td className="px-4 py-2 text-slate-700">
                    {srv.endpoint}
                  </td>
                  <td className="px-4 py-2">{badgeStatus(srv.status)}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button className="rounded-md border border-slate-300 px-2 py-1 text-[11px] hover:bg-slate-50">
                        Edit
                      </button>
                      <button className="rounded-md border border-rose-200 px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50">
                        Nonaktifkan
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {servers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Belum ada server daerah yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CentralRegionManagement;
