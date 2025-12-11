// src/pages/admin/CentralDashboard.jsx

function CentralDashboard() {
  // dummy data dulu, nanti bisa dipull dari backend pusat
  const regionServers = [
    {
      name: "PN Contoh Kota",
      code: "PNCK",
      status: "online",
      lastSync: "10-12-2025 09:15",
      pending: 3,
    },
    {
      name: "PN Bojonegoro",
      code: "PNBG",
      status: "online",
      lastSync: "10-12-2025 08:50",
      pending: 0,
    },
    {
      name: "PN Semarang",
      code: "PNSMG",
      status: "warning",
      lastSync: "10-12-2025 06:10",
      pending: 12,
    },
    {
      name: "PN Denpasar",
      code: "PNDPS",
      status: "offline",
      lastSync: "09-12-2025 21:02",
      pending: 45,
    },
  ];

  const getStatusBadge = (status) => {
    if (status === "online") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          ● Online
        </span>
      );
    }
    if (status === "warning") {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
          ● Lambat
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
        ● Offline
      </span>
    );
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <header>
        <h1 className="text-xl font-semibold text-slate-900">
          Dashboard Nasional
        </h1>
      </header>

      {/* Kartu-kartu topline */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">Total Putusan Terkonsolidasi</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            124.560
          </p>
          <p className="mt-1 text-[11px] text-emerald-600">
            ▲ +1.245 putusan bulan ini
          </p>
        </div>

        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">Server Daerah Online</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">96</p>
          <p className="mt-1 text-[11px] text-slate-500">dari 100 server</p>
        </div>

        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">Antrean Sinkronisasi</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">328</p>
          <p className="mt-1 text-[11px] text-amber-600">
            24 putusan menunggu &gt; 24 jam
          </p>
        </div>

        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">Gagal Replikasi (24 jam)</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">7</p>
          <p className="mt-1 text-[11px] text-rose-600">
            Perlu investigasi dan retry manual
          </p>
        </div>
      </div>

      {/* Tabel status server daerah */}
      <div className="rounded-sm border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <h1 className="text-lg font-semibold text-slate-800">
            Status Server Daerah
          </h1>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Pengadilan / Server
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Kode
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Sinkron Terakhir
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Antrean Pending
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regionServers.map((srv) => (
                <tr key={srv.code}>
                  <td className="px-4 py-2 font-semibold text-slate-800">
                    {srv.name}
                  </td>
                  <td className="px-4 py-2 text-slate-700">{srv.code}</td>
                  <td className="px-4 py-2">{getStatusBadge(srv.status)}</td>
                  <td className="px-4 py-2 text-slate-700">
                    {srv.lastSync}
                  </td>
                  <td className="px-4 py-2">
                    {srv.pending === 0 ? (
                      <span className="text-[11px] text-emerald-600">
                        Tidak ada antrean
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-800">
                        {srv.pending} putusan belum terkirim
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {regionServers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Belum ada data server daerah yang terdaftar.
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

export default CentralDashboard;
