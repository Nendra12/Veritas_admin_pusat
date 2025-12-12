import React, { useState, useEffect } from 'react';
import { putusanAPI, lembagaAPI, klasifikasiAPI, tahunAPI } from '../../utils/api';

function CentralPutusanManagement() {
  const [putusanList, setPutusanList] = useState([]);
  const [lembagaList, setLembagaList] = useState([]);
  const [klasifikasiList, setKlasifikasiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLembaga, setFilterLembaga] = useState('');
  const [filterKlasifikasi, setFilterKlasifikasi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 15;
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPutusan, setSelectedPutusan] = useState(null);

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadPutusan();
  }, [currentPage, filterLembaga, filterKlasifikasi, filterTahun, searchTerm]);

  const loadFilters = async () => {
    try {
      const [lembagaRes, klasifikasiRes, tahunRes] = await Promise.all([
        lembagaAPI.getAll(),
        klasifikasiAPI.getAll(),
        tahunAPI.getAll()
      ]);
      setLembagaList(lembagaRes.data || []);
      setKlasifikasiList(klasifikasiRes.data || []);
      setTahunList(tahunRes.data || []);
    } catch (err) {
      console.error('Error loading filters:', err);
    }
  };

  const loadPutusan = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: limit,
      };
      if (filterLembaga) params.lembaga_id = filterLembaga;
      if (filterKlasifikasi) params.klasifikasi_id = filterKlasifikasi;
      if (filterTahun) params.tahun_id = filterTahun;
      if (searchTerm) params.search = searchTerm;

      const response = await putusanAPI.getAll(params);
      setPutusanList(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalRecords(response.pagination?.total || 0);
    } catch (err) {
      console.error('Error loading putusan:', err);
      setError(err.message || 'Gagal memuat data putusan');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (putusan) => {
    try {
      const response = await putusanAPI.getById(putusan.id);
      setSelectedPutusan(response.data);
      setShowDetailModal(true);
    } catch (err) {
      alert(err.message || 'Gagal memuat detail putusan');
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadPutusan();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterLembaga('');
    setFilterKlasifikasi('');
    setFilterTahun('');
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadPDF = (putusan) => {
    if (putusan.file_pdf_url) {
      window.open(putusan.file_pdf_url, '_blank');
    } else {
      alert('File PDF tidak tersedia');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Putusan</h2>
            <p className="text-gray-600 mt-1">Data putusan dari seluruh lembaga peradilan</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Putusan</div>
            <div className="text-2xl font-bold text-blue-600">{totalRecords}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Lembaga</div>
            <div className="text-2xl font-bold text-green-600">{lembagaList.length}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Klasifikasi</div>
            <div className="text-2xl font-bold text-purple-600">{klasifikasiList.length}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Halaman</div>
            <div className="text-2xl font-bold text-orange-600">{currentPage} / {totalPages}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="Cari nomor putusan..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterLembaga}
              onChange={(e) => { setFilterLembaga(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Lembaga</option>
              {lembagaList.map((lembaga) => (
                <option key={lembaga.id} value={lembaga.id}>
                  {lembaga.kode_lembaga}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterKlasifikasi}
              onChange={(e) => { setFilterKlasifikasi(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Klasifikasi</option>
              {klasifikasiList.map((klasifikasi) => (
                <option key={klasifikasi.id} value={klasifikasi.id}>
                  {klasifikasi.nama_klasifikasi}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterTahun}
              onChange={(e) => { setFilterTahun(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tahun</option>
              {tahunList.map((tahun) => (
                <option key={tahun.id} value={tahun.id}>
                  {tahun.tahun}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={handleResetFilters}
              className="w-full px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nomor Putusan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lembaga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Klasifikasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Musyawarah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading data...
                    </div>
                  </td>
                </tr>
              ) : putusanList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data putusan
                  </td>
                </tr>
              ) : (
                putusanList.map((putusan) => (
                  <tr key={putusan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {putusan.nomor_putusan}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {putusan.lembaga?.kode_lembaga || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {putusan.klasifikasi?.nama || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(putusan.tanggal_musyawarah)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        putusan.file_pdf_url 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {putusan.file_pdf_url ? 'Ada PDF' : 'Tanpa PDF'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(putusan)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Detail
                        </button>
                        {putusan.file_pdf_url && (
                          <button
                            onClick={() => downloadPDF(putusan)}
                            className="text-green-600 hover:text-green-800"
                          >
                            PDF
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalRecords)} dari {totalRecords} putusan
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  let page;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPutusan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Detail Putusan</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="border-b pb-4">
                <h4 className="font-semibold text-lg mb-3">Informasi Dasar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nomor Putusan</label>
                    <p className="text-lg font-semibold">{selectedPutusan.nomor_putusan}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Lembaga Peradilan</label>
                    <p className="text-lg">{selectedPutusan.lembaga?.nama_lembaga || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Klasifikasi</label>
                    <p className="text-lg">{selectedPutusan.klasifikasi?.nama || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tahun</label>
                    <p className="text-lg">{selectedPutusan.tahun?.tahun || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Tanggal */}
              <div className="border-b pb-4">
                <h4 className="font-semibold text-lg mb-3">Tanggal Penting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tanggal Register</label>
                    <p className="text-lg">{formatDate(selectedPutusan.tanggal_register)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tanggal Musyawarah</label>
                    <p className="text-lg">{formatDate(selectedPutusan.tanggal_musyawarah)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tanggal Dibacakan</label>
                    <p className="text-lg">{formatDate(selectedPutusan.tanggal_dibacakan)}</p>
                  </div>
                </div>
              </div>

              {/* Pihak Terkait */}
              <div className="border-b pb-4">
                <h4 className="font-semibold text-lg mb-3">Pihak Terkait</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Para Pihak</label>
                    <p className="text-lg">{selectedPutusan.para_pihak || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Hakim</label>
                    <p className="text-lg">{selectedPutusan.hakim || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Panitera</label>
                    <p className="text-lg">{selectedPutusan.panitera || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Amar Putusan */}
              <div className="border-b pb-4">
                <h4 className="font-semibold text-lg mb-3">Amar Putusan</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedPutusan.amar_putusan || '-'}</p>
                </div>
              </div>

              {/* File PDF */}
              {selectedPutusan.file_pdf_url && (
                <div>
                  <h4 className="font-semibold text-lg mb-3">Dokumen</h4>
                  <button
                    onClick={() => downloadPDF(selectedPutusan)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CentralPutusanManagement;
