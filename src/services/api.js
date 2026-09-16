import axios from 'axios';

// Dynamically use window.location.hostname so localhost:5173 connects to localhost:8000 (prevents Chrome PNA blocks)
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:8000`;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let formattedError = {
      success: false,
      error_code: 'NETWORK_ERROR',
      message: 'Could not connect to SatQuery AI backend server.',
      suggestion: 'Ensure backend server is running on port 8000 (python -m uvicorn app.main:app --host 0.0.0.0 --port 8000).',
    };

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      formattedError = {
        success: false,
        error_code: 'TIMEOUT_ERROR',
        message: 'Satellite data retrieval timed out after 120 seconds.',
        suggestion: 'The Copernicus STAC server or satellite processing took too long. Please click ANALYZE MISSION again.',
      };
    } else if (error.response) {
      formattedError = {
        success: false,
        status_code: error.response.status,
        error_code: error.response.data?.error_code || `HTTP_${error.response.status}`,
        message: error.response.data?.message || error.response.data?.detail || 'Backend API error occurred.',
        suggestion: error.response.data?.suggestion || 'Try adjusting query parameters.',
      };
    }

    return Promise.reject(formattedError);
  }
);

export const loginApi = async (email, password) => {
  const res = await apiClient.post('/api/auth/login', { email, password });
  return res.data;
};

export const registerApi = async (email, password, fullName = null) => {
  const res = await apiClient.post('/api/auth/register', { email, password, full_name: fullName });
  return res.data;
};

export const checkHealth = async () => {
  const res = await apiClient.get('/api/health');
  return res.data;
};

export const checkAuthHealth = async () => {
  const res = await apiClient.get('/api/health/auth');
  return res.data;
};

export const checkAvailability = async (bbox, targetDate, satellite = 'sentinel-2-l2a', maxCloudCover = 30.0) => {
  const res = await apiClient.post('/api/satellite/availability', {
    bbox,
    target_date: targetDate,
    satellite,
    max_cloud_cover: maxCloudCover,
  });
  return res.data;
};

export const runAnalysis = async (payload, options = {}) => {
  const res = await apiClient.post('/api/query/analyze', payload, {
    signal: options.signal
  });
  return res.data;
};

export const getHistory = async (limit = 20, filterType = null) => {
  const params = { limit };
  if (filterType) params.filter_type = filterType;
  const res = await apiClient.get('/api/history', { params });
  return res.data;
};

export const getHistoryDetail = async (analysisId) => {
  const res = await apiClient.get(`/api/history/${analysisId}`);
  return res.data;
};

export const exportPDFReport = async (analysisId) => {
  const res = await apiClient.post(
    '/api/export/pdf',
    { analysis_id: analysisId },
    { responseType: 'blob' }
  );
  return res.data;
};

export default apiClient;
