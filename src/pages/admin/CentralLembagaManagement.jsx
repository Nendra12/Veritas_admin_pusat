import React, { useState, useEffect } from 'react';
import { lembagaAPI, daerahAPI } from '../../utils/api';

function CentralLembagaManagement() {
  const [lembagaList, setLembagaList] = useState([]);
  const [daerahList, setDaerahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDaerah, setFilterDaerah] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedLembaga, setSelectedLembaga] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    kode_lembaga: '',
    nama_lembaga: '',
    jenis_lembaga: '',
    tingkatan: '',
    id_daerah: '',
  });

  const [apiKeyData, setApiKeyData] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [lembagaResponse, daerahResponse] = await Promise.all([
        lembagaAPI.getAll(),
        daerahAPI.getAll()
      ]);
      setLembagaList(lembagaResponse.data || []);
      setDaerahList(daerahResponse.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      kode_lembaga: '',
      nama_lembaga: '',
      jenis_lembaga: '',
      tingkatan: '',
      id_daerah: '',
    });
    setShowAddModal(true);
  };

  const handleEdit = (lembaga) => {
    setSelectedLembaga(lembaga);
    setFormData({
      kode_lembaga: lembaga.kode_lembaga,
      nama_lembaga: lembaga.nama_lembaga,
      jenis_lembaga: lembaga.jenis_lembaga || '',
      tingkatan: lembaga.tingkatan || '',
      id_daerah: lembaga.id_daerah || '',
    });
    setShowEditModal(true);
  };

  const handleDelete = (lembaga) => {
    setSelectedLembaga(lembaga);
    setShowDeleteModal(true);
  };

  const handleViewDetail = (lembaga) => {
    setSelectedLembaga(lembaga);
    setShowDetailModal(true);
  };

  const handleEditApiKey = (lembaga) => {
    setSelectedLembaga(lembaga);
    setApiKeyData(lembaga.api_key || '');
    setShowApiKeyModal(true);
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    try {
      await lembagaAPI.create(formData);
      alert('Lembaga berhasil ditambahkan');
      setShowAddModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal menambahkan lembaga');
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await lembagaAPI.update(selectedLembaga.id, formData);
      alert('Lembaga berhasil diupdate');
      setShowEditModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal mengupdate lembaga');
    }
  };

  const confirmDelete = async () => {
    try {
      await lembagaAPI.delete(selectedLembaga.id);
      alert('Lembaga berhasil dihapus');
      setShowDeleteModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal menghapus lembaga');
    }
  };

  const submitApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyData.trim()) {
      alert('API Key tidak boleh kosong');
      return;
    }
    try {
      await lembagaAPI.updateApiKey(selectedLembaga.id, apiKeyData.trim());
      alert('API Key berhasil diupdate');
      setShowApiKeyModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal mengupdate API Key');
    }
  };

  // Filter and search
  const filteredLembaga = lembagaList.filter(lembaga => {
    const matchSearch = lembaga.kode_lembaga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       lembaga.nama_lembaga?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDaerah = !filterDaerah || lembaga.id_daerah === filterDaerah;
    return matchSearch && matchDaerah;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLembaga.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLembaga = filteredLembaga.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Server Lembaga Peradilan</h2>
            <p className="text-gray-600 mt-1">Kelola server lembaga peradilan di seluruh Indonesia</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Server Lembaga
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="Cari berdasarkan kode atau nama lembaga..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterDaerah}
              onChange={(e) => { setFilterDaerah(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Daerah</option>
              {daerahList.map((daerah) => (
                <option key={daerah.id} value={daerah.id}>
                  {daerah.nama_daerah}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Lembaga</div>
            <div className="text-2xl font-bold text-blue-600">{lembagaList.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Hasil Filter</div>
            <div className="text-2xl font-bold text-green-600">{filteredLembaga.length}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Daerah</div>
            <div className="text-2xl font-bold text-purple-600">{daerahList.length}</div>
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
                  Kode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Lembaga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis/Tingkatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daerah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading data...
                    </div>
                  </td>
                </tr>
              ) : paginatedLembaga.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || filterDaerah ? 'Tidak ada data yang cocok dengan filter' : 'Belum ada data lembaga'}
                  </td>
                </tr>
              ) : (
                paginatedLembaga.map((lembaga) => (
                  <tr key={lembaga.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lembaga.kode_lembaga}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lembaga.nama_lembaga}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{lembaga.jenis_lembaga || '-'}</div>
                      <div className="text-xs text-gray-500">{lembaga.tingkatan || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lembaga.daerah?.nama_daerah || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(lembaga)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleEdit(lembaga)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleEditApiKey(lembaga)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          API Key
                        </button>
                        <button
                          onClick={() => handleDelete(lembaga)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Hapus
                        </button>
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
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredLembaga.length)} dari {filteredLembaga.length} lembaga
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Tambah Lembaga Baru</h3>
            <form onSubmit={submitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Lembaga *</label>
                  <input
                    type="text"
                    required
                    value={formData.kode_lembaga}
                    onChange={(e) => setFormData({...formData, kode_lembaga: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., PNSBY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daerah *</label>
                  <select
                    required
                    value={formData.id_daerah}
                    onChange={(e) => setFormData({...formData, id_daerah: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Daerah</option>
                    {daerahList.map((daerah) => (
                      <option key={daerah.id} value={daerah.id}>
                        {daerah.nama_daerah}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lembaga *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_lembaga}
                    onChange={(e) => setFormData({...formData, nama_lembaga: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Pengadilan Negeri Surabaya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Lembaga</label>
                  <input
                    type="text"
                    value={formData.jenis_lembaga}
                    onChange={(e) => setFormData({...formData, jenis_lembaga: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., PN, PA, PTUN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tingkatan</label>
                  <input
                    type="text"
                    value={formData.tingkatan}
                    onChange={(e) => setFormData({...formData, tingkatan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Pertama, Banding, Kasasi"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Lembaga</h3>
            <form onSubmit={submitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Lembaga *</label>
                  <input
                    type="text"
                    required
                    value={formData.kode_lembaga}
                    onChange={(e) => setFormData({...formData, kode_lembaga: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daerah *</label>
                  <select
                    required
                    value={formData.id_daerah}
                    onChange={(e) => setFormData({...formData, id_daerah: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Daerah</option>
                    {daerahList.map((daerah) => (
                      <option key={daerah.id} value={daerah.id}>
                        {daerah.nama_daerah}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lembaga *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_lembaga}
                    onChange={(e) => setFormData({...formData, nama_lembaga: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Lembaga</label>
                  <input
                    type="text"
                    value={formData.jenis_lembaga}
                    onChange={(e) => setFormData({...formData, jenis_lembaga: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., PN, PA, PTUN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tingkatan</label>
                  <input
                    type="text"
                    value={formData.tingkatan}
                    onChange={(e) => setFormData({...formData, tingkatan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Pertama, Banding, Kasasi"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedLembaga && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-red-600">Konfirmasi Hapus</h3>
            <p className="mb-6">
              Yakin ingin menghapus lembaga <strong>{selectedLembaga.nama_lembaga}</strong>?
              <br />
              <span className="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLembaga && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Detail Lembaga</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Kode Lembaga</label>
                  <p className="text-lg font-semibold">{selectedLembaga.kode_lembaga}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Daerah</label>
                  <p className="text-lg">{selectedLembaga.daerah?.nama_daerah || '-'}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Nama Lembaga</label>
                <p className="text-lg">{selectedLembaga.nama_lembaga}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Jenis Lembaga</label>
                  <p className="text-lg">{selectedLembaga.jenis_lembaga || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Tingkatan</label>
                  <p className="text-lg">{selectedLembaga.tingkatan || '-'}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedLembaga);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
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

      {/* API Key Modal */}
      {showApiKeyModal && selectedLembaga && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4 text-purple-600">Kelola API Key</h3>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>⚠️ Peringatan:</strong> Setelah mengubah API Key, server daerah harus memperbarui konfigurasi mereka dengan API Key yang baru.
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-2">Lembaga</label>
              <p className="text-lg font-semibold">{selectedLembaga.nama_lembaga}</p>
              <p className="text-sm text-gray-600">{selectedLembaga.kode_lembaga}</p>
            </div>
            <form onSubmit={submitApiKey}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={apiKeyData}
                    onChange={(e) => setApiKeyData(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    placeholder="Masukkan API Key"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(apiKeyData);
                      alert('API Key disalin ke clipboard');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    disabled={!apiKeyData}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Salin
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  API Key harus unik untuk setiap lembaga
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Simpan API Key
                </button>
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CentralLembagaManagement;
