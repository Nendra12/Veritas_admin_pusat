// src/utils/api.js
// API Client untuk Server Pusat

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API_KEY = import.meta.env.VITE_API_KEY || 'master-api-key-for-admin-pusat-2024';

console.log('API_BASE_URL:', API_KEY);
/**
 * Helper function untuk fetch API dengan error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}/api/v1${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Get headers untuk request
 */
function getHeaders(includeAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };

  if (includeAuth) {
    const token = localStorage.getItem('admin_pusat_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// ==================== AUTH API ====================

export const authAPI = {
  /**
   * Login admin
   */
  login: async (username, password) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Logout (clear local storage)
   */
  logout: () => {
    localStorage.removeItem('admin_pusat_token');
    localStorage.removeItem('admin_pusat_user');
    localStorage.removeItem('admin_pusat_logged_in');
    localStorage.removeItem('admin_pusat_access_time');
  },
};

// ==================== PUTUSAN API ====================

export const putusanAPI = {
  /**
   * Get all putusan dengan pagination, search, dan filter
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.id_lembaga) queryParams.append('id_lembaga', params.id_lembaga);
    if (params.id_tahun) queryParams.append('id_tahun', params.id_tahun);
    if (params.id_klasifikasi) queryParams.append('id_klasifikasi', params.id_klasifikasi);

    const query = queryParams.toString();
    return fetchAPI(`/putusan${query ? `?${query}` : ''}`);
  },

  /**
   * Get putusan by ID
   */
  getById: async (id) => {
    return fetchAPI(`/putusan/${id}`);
  },

  /**
   * Create new putusan
   */
  create: async (data) => {
    return fetchAPI('/putusan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update putusan
   */
  update: async (id, data) => {
    return fetchAPI(`/putusan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete putusan
   */
  delete: async (id) => {
    return fetchAPI(`/putusan/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Sync putusan dari server daerah
   */
  syncFromDaerah: async (lembagaId) => {
    return fetchAPI(`/putusan/sync/${lembagaId}`, {
      method: 'POST',
    });
  },

  /**
   * Get statistics
   */
  getStatistics: async () => {
    return fetchAPI('/putusan/statistics');
  },
};

// ==================== LEMBAGA API ====================

export const lembagaAPI = {
  /**
   * Get all lembaga peradilan
   */
  getAll: async () => {
    return fetchAPI('/lembaga');
  },

  /**
   * Get lembaga by ID
   */
  getById: async (id) => {
    return fetchAPI(`/lembaga/${id}`);
  },

  /**
   * Create new lembaga
   */
  create: async (data) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI('/lembaga', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Update lembaga
   */
  update: async (id, data) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI(`/lembaga/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete lembaga
   */
  delete: async (id) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI(`/lembaga/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Get all lembaga with API keys (untuk admin)
   */
  getAllWithKeys: async () => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI('/lembaga-keys', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Regenerate API key untuk lembaga
   */
  regenerateApiKey: async (id) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI(`/lembaga/${id}/regenerate-key`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Update API key untuk lembaga secara manual
   */
  updateApiKey: async (id, apiKey) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI(`/lembaga/${id}/api-key`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ api_key: apiKey }),
    });
  },
};

// ==================== KLASIFIKASI API ====================

export const klasifikasiAPI = {
  /**
   * Get all klasifikasi
   */
  getAll: async () => {
    return fetchAPI('/klasifikasi');
  },

  /**
   * Get klasifikasi by ID
   */
  getById: async (id) => {
    return fetchAPI(`/klasifikasi/${id}`);
  },

  /**
   * Create new klasifikasi
   */
  create: async (data) => {
    return fetchAPI('/klasifikasi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update klasifikasi
   */
  update: async (id, data) => {
    return fetchAPI(`/klasifikasi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete klasifikasi
   */
  delete: async (id) => {
    return fetchAPI(`/klasifikasi/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TAHUN API ====================

export const tahunAPI = {
  /**
   * Get all tahun
   */
  getAll: async () => {
    return fetchAPI('/tahun');
  },

  /**
   * Get tahun by ID
   */
  getById: async (id) => {
    return fetchAPI(`/tahun/${id}`);
  },

  /**
   * Create new tahun
   */
  create: async (data) => {
    return fetchAPI('/tahun', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update tahun
   */
  update: async (id, data) => {
    return fetchAPI(`/tahun/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete tahun
   */
  delete: async (id) => {
    return fetchAPI(`/tahun/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== DASHBOARD API ====================

export const dashboardAPI = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    // Mengambil data dari berbagai endpoint untuk dashboard
    try {
      const [putusanStats, lembagaData, klasifikasiData, tahunData] = await Promise.all([
        putusanAPI.getAll({ limit: 1 }), // Untuk total count
        lembagaAPI.getAll(),
        klasifikasiAPI.getAll(),
        tahunAPI.getAll(),
      ]);

      return {
        totalPutusan: putusanStats.pagination?.total || 0,
        totalLembaga: lembagaData.data?.length || 0,
        totalKlasifikasi: klasifikasiData.data?.length || 0,
        totalTahun: tahunData.data?.length || 0,
        lembagaList: lembagaData.data || [],
        klasifikasiList: klasifikasiData.data || [],
        tahunList: tahunData.data || [],
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

// ==================== SYNC API ====================

export const syncAPI = {
  /**
   * Get sync history dengan filter
   */
  getHistory: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.lembaga_id) queryParams.append('lembaga_id', params.lembaga_id);
    if (params.status) queryParams.append('status', params.status);
    if (params.tipe_operasi) queryParams.append('tipe_operasi', params.tipe_operasi);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const query = queryParams.toString();
    return fetchAPI(`/sync/history${query ? `?${query}` : ''}`);
  },

  /**
   * Get failed syncs
   */
  getFailedSyncs: async (lembagaId = null) => {
    const query = lembagaId ? `?lembaga_id=${lembagaId}` : '';
    return fetchAPI(`/sync/failed${query}`);
  },

  /**
   * Resync putusan
   */
  resyncPutusan: async (syncLogId) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI(`/sync/resync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ sync_log_id: syncLogId }),
    });
  },

  /**
   * Bulk resync
   */
  bulkResync: async (lembagaId) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI(`/sync/bulk-resync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ lembaga_id: lembagaId }),
    });
  },
};

// ==================== DAERAH API ====================

export const daerahAPI = {
  /**
   * Get all daerah
   */
  getAll: async () => {
    return fetchAPI('/daerah');
  },

  /**
   * Get daerah by ID
   */
  getById: async (id) => {
    return fetchAPI(`/daerah/${id}`);
  },

  /**
   * Create new daerah
   */
  create: async (data) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI('/daerah', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Update daerah
   */
  update: async (id, data) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI(`/daerah/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete daerah
   */
  delete: async (id) => {
    const token = localStorage.getItem('admin_pusat_token');
    return fetchAPI(`/daerah/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Export utility functions
export { API_BASE_URL, API_KEY, getHeaders };
