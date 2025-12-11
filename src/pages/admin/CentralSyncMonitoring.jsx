// src/pages/admin/CentralSyncMonitoring.jsx

function CentralSyncMonitoring() {
  const syncLogs = [
    {
      id: 1,
      time: "10-12-2025 09:21",
      region: "PN Contoh Kota (PNCK)",
      batch: "BATCH-2025-12-10-01",
      decisions: 12,
      status: "success",
    },
    {
      id: 2,
      time: "10-12-2025 08:50",
      region: "PN Bojonegoro (PNBG)",
      batch: "BATCH-2025-12-10-02",
      decisions: 5,
      status: "pending",
    },
    {
      id: 3,
      time: "10-12-2025 06:10",
      region: "PN Semarang (PNSMG)",
      batch: "BATCH-2025-12-10-03",
      decisions: 20,
      status: "warning",
    },
    {
      id: 4,
      time: "09-12-2025 21:02",
      region: "PN Denpasar (PNDPS)",
      batch: "BATCH-2025-12-09-07",
      decisions: 18,
      status: "failed",
    },
  ];

  const renderStatusBadge = (status) => {
    const base =
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold";
    if (status === "success")
      return (
        <span className={`${base} bg-emerald-50 text-emerald-700`}>
          Berhasil
        </span>
      );
    if (status === "pending")
      return (
        <span className={`${base} bg-slate-50 text-slate-700`}>
          Menunggu
        </span>
      );
    if (status === "warning")
      return (
        <span className={`${base} bg-amber-50 text-amber-700`}>
          Lambat
        </span>
      );
    return (
      <span className={`${base} bg-rose-50 text-rose-700`}>
        Gagal
      </span>
    );
  };

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">
          Monitoring Sinkronisasi
        </h1>
      </header>

      {/* Filter sederhana */}
      <div className="flex flex-wrap gap-2 rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
        <div className="flex min-w-[180px] flex-1 items-center gap-2">
          <label className="text-[11px] text-slate-600">Server Daerah</label>
          <input
            type="text"
            placeholder="Cari nama / kode server..."
            className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-slate-600">Status</label>
          <select className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
            <option>Semua</option>
            <option>Berhasil</option>
            <option>Menunggu</option>
            <option>Lambat</option>
            <option>Gagal</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-slate-600">Rentang Waktu</label>
          <select className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
            <option>24 jam terakhir</option>
            <option>7 hari terakhir</option>
            <option>30 hari terakhir</option>
          </select>
        </div>
      </div>

      {/* Tabel log sinkronisasi */}
      <div className="rounded-sm border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Log Aktivitas Sinkronisasi
          </h2>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Waktu
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Server Daerah
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  ID Batch
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Jumlah Putusan
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {syncLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-2 text-slate-700">{log.time}</td>
                  <td className="px-4 py-2 font-semibold text-slate-800">
                    {log.region}
                  </td>
                  <td className="px-4 py-2 text-slate-700">{log.batch}</td>
                  <td className="px-4 py-2 text-slate-700">
                    {log.decisions} putusan
                  </td>
                  <td className="px-4 py-2">{renderStatusBadge(log.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CentralSyncMonitoring;
