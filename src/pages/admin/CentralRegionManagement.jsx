import React, { useState, useEffect } from 'react';
import { daerahAPI } from '../../utils/api';

function CentralRegionManagement() {
  const [daerahList, setDaerahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDaerah, setSelectedDaerah] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    nama_daerah: '',
    provinsi: '',
    wilayah_hukum: '',
  });

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
      const response = await daerahAPI.getAll();
      setDaerahList(response.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      nama_daerah: '',
      provinsi: '',
      wilayah_hukum: '',
    });
    setShowAddModal(true);
  };

  const handleEdit = (daerah) => {
    setSelectedDaerah(daerah);
    setFormData({
      nama_daerah: daerah.nama_daerah,
      provinsi: daerah.provinsi || '',
      wilayah_hukum: daerah.wilayah_hukum || '',
    });
    setShowEditModal(true);
  };

  const handleDelete = (daerah) => {
    setSelectedDaerah(daerah);
    setShowDeleteModal(true);
  };

  const handleViewDetail = (daerah) => {
    setSelectedDaerah(daerah);
    setShowDetailModal(true);
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    try {
      await daerahAPI.create(formData);
      alert('Daerah berhasil ditambahkan');
      setShowAddModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal menambahkan daerah');
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await daerahAPI.update(selectedDaerah.id, formData);
      alert('Daerah berhasil diupdate');
      setShowEditModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal mengupdate daerah');
    }
  };

  const confirmDelete = async () => {
    try {
      await daerahAPI.delete(selectedDaerah.id);
      alert('Daerah berhasil dihapus');
      setShowDeleteModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal menghapus daerah');
    }
  };

  // Filter and search
  const filteredDaerah = daerahList.filter(daerah => {
    return daerah.nama_daerah?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           daerah.provinsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           daerah.wilayah_hukum?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(filteredDaerah.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDaerah = filteredDaerah.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Daerah</h2>
            <p className="text-gray-600 mt-1">Kelola data daerah/wilayah hukum</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Daerah
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari berdasarkan nama daerah, provinsi, atau wilayah hukum..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Daerah</div>
            <div className="text-2xl font-bold text-blue-600">{daerahList.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Hasil Filter</div>
            <div className="text-2xl font-bold text-green-600">{filteredDaerah.length}</div>
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
                  Nama Daerah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provinsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wilayah Hukum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading data...
                    </div>
                  </td>
                </tr>
              ) : paginatedDaerah.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Tidak ada data yang cocok dengan pencarian' : 'Belum ada data daerah'}
                  </td>
                </tr>
              ) : (
                paginatedDaerah.map((daerah) => (
                  <tr key={daerah.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {daerah.nama_daerah}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {daerah.provinsi || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {daerah.wilayah_hukum || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(daerah)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleEdit(daerah)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(daerah)}
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
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredDaerah.length)} dari {filteredDaerah.length} daerah
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Tambah Daerah Baru</h3>
            <form onSubmit={submitAdd}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Daerah *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_daerah}
                    onChange={(e) => setFormData({...formData, nama_daerah: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Surabaya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi *</label>
                  <input
                    type="text"
                    required
                    value={formData.provinsi}
                    onChange={(e) => setFormData({...formData, provinsi: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Jawa Timur"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah Hukum</label>
                  <input
                    type="text"
                    value={formData.wilayah_hukum}
                    onChange={(e) => setFormData({...formData, wilayah_hukum: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Surabaya dan sekitarnya"
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
      {showEditModal && selectedDaerah && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Daerah</h3>
            <form onSubmit={submitEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Daerah *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_daerah}
                    onChange={(e) => setFormData({...formData, nama_daerah: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi *</label>
                  <input
                    type="text"
                    required
                    value={formData.provinsi}
                    onChange={(e) => setFormData({...formData, provinsi: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah Hukum</label>
                  <input
                    type="text"
                    value={formData.wilayah_hukum}
                    onChange={(e) => setFormData({...formData, wilayah_hukum: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      {showDeleteModal && selectedDaerah && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-red-600">Konfirmasi Hapus</h3>
            <p className="mb-6">
              Yakin ingin menghapus daerah <strong>{selectedDaerah.nama_daerah}</strong>?
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
      {showDetailModal && selectedDaerah && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Detail Daerah</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nama Daerah</label>
                <p className="text-lg font-semibold">{selectedDaerah.nama_daerah}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Provinsi</label>
                  <p className="text-lg">{selectedDaerah.provinsi || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Wilayah Hukum</label>
                  <p className="text-lg">{selectedDaerah.wilayah_hukum || '-'}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedDaerah);
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
    </div>
  );
}

export default CentralRegionManagement;
