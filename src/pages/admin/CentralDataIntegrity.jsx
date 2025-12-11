// src/pages/admin/CentralDataIntegrity.jsx

function CentralDataIntegrity() {
  const checks = [
    {
      id: 1,
      region: "PN Contoh Kota (PNCK)",
      totalCenter: 1245,
      totalRegion: 1245,
      mismatch: 0,
      lastCheck: "10-12-2025 08:30",
    },
    {
      id: 2,
      region: "PN Semarang (PNSMG)",
      totalCenter: 980,
      totalRegion: 992,
      mismatch: 12,
      lastCheck: "10-12-2025 07:50",
    },
    {
      id: 3,
      region: "PN Denpasar (PNDPS)",
      totalCenter: 605,
      totalRegion: 650,
      mismatch: 45,
      lastCheck: "09-12-2025 20:10",
    },
  ];

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">
          Validasi Integritas Data & Metadata
        </h1>
      </header>

      {/* Ringkasan singkat */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">
            Server Daerah Divergen
          </p>
          <p className="mt-1 text-2xl font-semibold text-amber-600">2</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Memiliki perbedaan jumlah putusan &gt; 10
          </p>
        </div>
        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">
            Total Putusan Mismatch
          </p>
          <p className="mt-1 text-2xl font-semibold text-rose-600">57</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Perlu dilakukan re-sync selektif
          </p>
        </div>
        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">
            Pemeriksaan Terakhir
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            10-12-2025 09:00
          </p>
          <button className="mt-2 rounded-lg border border-slate-300 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">
            Jalankan pemeriksaan ulang
          </button>
        </div>
      </div>

      {/* Tabel detail per server */}
      <div className="rounded-sm border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Ringkasan Perbandingan Pusat vs Daerah
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Menampilkan jumlah putusan yang tercatat di pusat dan di server
            daerah, serta selisihnya.
          </p>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Server Daerah
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Putusan di Pusat
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Putusan di Daerah
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Selisih
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Pemeriksaan Terakhir
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {checks.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2 font-semibold text-slate-800">
                    {c.region}
                  </td>
                  <td className="px-4 py-2 text-slate-700">
                    {c.totalCenter.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-2 text-slate-700">
                    {c.totalRegion.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-2">
                    {c.mismatch === 0 ? (
                      <span className="text-[11px] text-emerald-600">
                        Sinkron
                      </span>
                    ) : (
                      <span className="text-[11px] text-rose-600">
                        {c.mismatch} putusan berbeda
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-slate-700">
                    {c.lastCheck}
                  </td>
                  <td className="px-4 py-2">
                    <button className="rounded-md border border-slate-300 px-2 py-1 text-[11px] hover:bg-slate-50">
                      Lihat detail mismatch
                    </button>
                  </td>
                </tr>
              ))}
              {checks.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Belum ada hasil pemeriksaan integritas data.
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

export default CentralDataIntegrity;
