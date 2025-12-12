// src/pages/admin/CentralDashboard.jsx
import { useState, useEffect } from 'react';
import { dashboardAPI, lembagaAPI } from '../../utils/api';

function CentralDashboard() {
  const [stats, setStats] = useState(null);
  const [lembagaList, setLembagaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, lembagaData] = await Promise.all([
        dashboardAPI.getStats(),
        lembagaAPI.getAll(),
      ]);
      
      setStats(dashboardStats);
      setLembagaList(lembagaData.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-slate-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-700">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <header>
        <h1 className="text-xl font-semibold text-slate-900">
          Dashboard Nasional
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Server Pusat - Monitoring Konsolidasi Putusan Pengadilan
        </p>
      </header>

      {/* Kartu-kartu topline */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">Total Putusan Terkonsolidasi</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {stats?.totalPutusan?.toLocaleString() || 0}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600">
            Data dari {stats?.totalLembaga || 0} lembaga
          </p>
        </div>

        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">Server Daerah Terdaftar</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {stats?.totalLembaga || 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">lembaga peradilan</p>
        </div>

        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">Klasifikasi Perkara</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {stats?.totalKlasifikasi || 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            kategori klasifikasi
          </p>
        </div>

        <div className="rounded-sm border bg-white px-4 py-3 text-xs shadow-sm">
          <p className="text-[11px] text-slate-500">Periode Data</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {stats?.totalTahun || 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            tahun tersedia
          </p>
        </div>
      </div>

      {/* Tabel status server daerah */}
      <div className="rounded-sm border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <h1 className="text-lg font-semibold text-slate-800">
            Lembaga Peradilan Terdaftar
          </h1>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Nama Lembaga
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Jenis
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Tingkatan
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Daerah
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  URL API
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lembagaList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    Belum ada lembaga terdaftar
                  </td>
                </tr>
              ) : (
                lembagaList.map((lembaga) => (
                  <tr key={lembaga.id}>
                    <td className="px-4 py-2 font-semibold text-slate-800">
                      {lembaga.nama_lembaga}
                    </td>
                    <td className="px-4 py-2 text-slate-700">
                      {lembaga.jenis_lembaga}
                    </td>
                    <td className="px-4 py-2 text-slate-700">
                      {lembaga.tingkatan}
                    </td>
                    <td className="px-4 py-2 text-slate-700">
                      {lembaga.daerah?.nama_daerah || '-'} ({lembaga.daerah?.provinsi || '-'})
                    </td>
                    <td className="px-4 py-2">
                      {lembaga.url_api ? (
                        <span className="text-[11px] text-blue-600 font-mono">
                          {lembaga.url_api}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Belum dikonfigurasi
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CentralDashboard;
