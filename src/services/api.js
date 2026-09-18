import axios from 'axios';

// Dynamically use window.location.hostname so localhost:5173 connects to localhost:8000 (prevents Chrome PNA blocks)
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }
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
    const requestUrl = error.config?.url || '';
    const isAuthRequest = requestUrl.includes('/auth');

    let formattedError = {
      success: false,
      error_code: 'NETWORK_ERROR',
      message: isAuthRequest
        ? 'Could not connect to backend server. The cloud instance may be offline or starting up.'
        : 'Could not connect to SatQuery AI backend server.',
      suggestion: 'Ensure backend server is running (python -m uvicorn app.main:app --host 0.0.0.0 --port 8000) or check Render logs.',
    };

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      formattedError = {
        success: false,
        error_code: 'TIMEOUT_ERROR',
        message: isAuthRequest
          ? 'Authentication timed out. The cloud backend server (Render) is sleeping or unresponsive.'
          : 'Satellite data retrieval timed out after 120 seconds.',
        suggestion: isAuthRequest
          ? 'Please verify that your Render backend service is Active, or run the app locally on http://localhost:5173.'
          : 'The Copernicus STAC server or satellite processing took too long. Please click ANALYZE MISSION again.',
      };
    } else if (error.response) {
      const data = error.response.data;
      const detail = data?.detail;
      const isDetailObj = typeof detail === 'object' && detail !== null;

      formattedError = {
        success: false,
        status_code: error.response.status,
        error_code: (isDetailObj ? detail.error_code : null) || data?.error_code || `HTTP_${error.response.status}`,
        message: (isDetailObj ? detail.message : null) || (typeof detail === 'string' ? detail : null) || data?.message || 'Backend API error occurred.',
        suggestion: (isDetailObj ? detail.suggestion : null) || data?.suggestion || 'Try adjusting query parameters.',
      };
    }

    return Promise.reject(formattedError);
  }
);

export const loginApi = async (email, password) => {
  const res = await apiClient.post('/api/auth/login', { email, password }, { timeout: 20000 });
  return res.data;
};

export const registerApi = async (email, password, fullName = null) => {
  const res = await apiClient.post('/api/auth/register', { email, password, full_name: fullName }, { timeout: 20000 });
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
