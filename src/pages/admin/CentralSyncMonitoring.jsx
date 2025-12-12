import React, { useState, useEffect } from 'react';
import { syncAPI, lembagaAPI } from '../../utils/api';

function CentralSyncMonitoring() {
  const [syncLogs, setSyncLogs] = useState([]);
  const [failedSyncs, setFailedSyncs] = useState([]);
  const [lembagaList, setLembagaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resyncLoading, setResyncLoading] = useState({});

  // Filter states
  const [selectedLembaga, setSelectedLembaga] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTipeOperasi, setSelectedTipeOperasi] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'failed'

  const limit = 10;

  // Load data
  useEffect(() => {
    loadSyncData();
    loadLembagaList();
  }, [selectedLembaga, selectedStatus, selectedTipeOperasi, currentPage, activeTab]);

  const loadSyncData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'all') {
        const params = {
          page: currentPage,
          limit: limit,
        };
        if (selectedLembaga) params.lembaga_id = selectedLembaga;
        if (selectedStatus) params.status = selectedStatus;
        if (selectedTipeOperasi) params.tipe_operasi = selectedTipeOperasi;

        const response = await syncAPI.getHistory(params);
        setSyncLogs(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalRecords(response.pagination?.total || 0);
      } else {
        const response = await syncAPI.getFailedSyncs(selectedLembaga || null);
        setFailedSyncs(response.data || []);
        setTotalRecords(response.data?.length || 0);
      }
    } catch (err) {
      console.error('Error loading sync data:', err);
      setError(err.message || 'Gagal memuat data sinkronisasi');
    } finally {
      setLoading(false);
    }
  };

  const loadLembagaList = async () => {
    try {
      const response = await lembagaAPI.getAll();
      setLembagaList(response.data || []);
    } catch (err) {
      console.error('Error loading lembaga list:', err);
    }
  };

  const handleResync = async (syncLogId) => {
    try {
      setResyncLoading({ ...resyncLoading, [syncLogId]: true });
      await syncAPI.resyncPutusan(syncLogId);
      alert('Resync berhasil dimulai');
      loadSyncData(); // Reload data
    } catch (err) {
      console.error('Error resync:', err);
      alert(err.message || 'Gagal melakukan resync');
    } finally {
      setResyncLoading({ ...resyncLoading, [syncLogId]: false });
    }
  };

  const handleBulkResync = async () => {
    if (!selectedLembaga) {
      alert('Pilih lembaga terlebih dahulu');
      return;
    }

    if (!confirm('Yakin ingin melakukan bulk resync untuk lembaga ini?')) {
      return;
    }

    try {
      setLoading(true);
      await syncAPI.bulkResync(selectedLembaga);
      alert('Bulk resync berhasil dimulai');
      loadSyncData();
    } catch (err) {
      console.error('Error bulk resync:', err);
      alert(err.message || 'Gagal melakukan bulk resync');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadSyncData();
  };

  const renderStatusBadge = (status) => {
    const statusClasses = {
      'success': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const displayLogs = activeTab === 'all' ? syncLogs : failedSyncs;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Monitoring Sinkronisasi</h2>
            <p className="text-gray-600 mt-1">Pantau proses sinkronisasi dari server daerah</p>
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

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Semua Log
          </button>
          <button
            onClick={() => { setActiveTab('failed'); setCurrentPage(1); }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'failed'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Gagal Sinkronisasi
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lembaga Peradilan</label>
            <select
              value={selectedLembaga}
              onChange={(e) => { setSelectedLembaga(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Lembaga</option>
              {lembagaList.map((lembaga) => (
                <option key={lembaga.id} value={lembaga.id}>
                  {lembaga.kode_lembaga} - {lembaga.nama_lembaga}
                </option>
              ))}
            </select>
          </div>

          {activeTab === 'all' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Operasi</label>
                <select
                  value={selectedTipeOperasi}
                  onChange={(e) => { setSelectedTipeOperasi(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Operasi</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'failed' && selectedLembaga && (
            <div className="flex items-end">
              <button
                onClick={handleBulkResync}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                disabled={loading}
              >
                Bulk Resync
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-700">
            Total Record: <span className="font-semibold">{totalRecords}</span>
            {activeTab === 'all' && totalPages > 1 && (
              <> | Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span></>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lembaga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Putusan ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error
                </th>
                {activeTab === 'failed' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={activeTab === 'failed' ? 7 : 6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading data...
                    </div>
                  </td>
                </tr>
              ) : displayLogs.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'failed' ? 7 : 6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data sinkronisasi
                  </td>
                </tr>
              ) : (
                displayLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.createdAt || log.waktu_sync)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.LembagaPeradilan?.kode_lembaga || log.lembaga_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.tipe_operasi === 'create' ? 'bg-green-100 text-green-800' :
                        log.tipe_operasi === 'update' ? 'bg-blue-100 text-blue-800' :
                        log.tipe_operasi === 'delete' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.tipe_operasi || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {log.putusan_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {renderStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={log.error_message}>
                      {log.error_message || '-'}
                    </td>
                    {activeTab === 'failed' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleResync(log.id)}
                          disabled={resyncLoading[log.id]}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {resyncLoading[log.id] ? 'Syncing...' : 'Resync'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {activeTab === 'all' && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalRecords)} dari {totalRecords} record
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
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
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
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page}>...</span>;
                  }
                  return null;
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
    </div>
  );
}

export default CentralSyncMonitoring;
