import axios from 'axios';
import { logger } from '../utils/logger';

// API base URL (e.g. https://habith-smart-traffic.hf.space)
// The backend explicitly defines /api/detect for detection and /health for health check
const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = rawBase.replace(/\/api\/?$/, ''); // Keep base at root level
const TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '90000');

logger.info(`API Configuration: ${API_BASE_URL} (Timeout: ${TIMEOUT}ms)`);

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    logger.debug(`[API] ${config.method.toUpperCase()} ${config.url}`);
    config.metadata = { startTime: Date.now() };
    return config;
  },
  (error) => {
    logger.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata?.startTime;
    logger.debug(`[API Response] ${response.status} (${duration}ms)`, response.data);
    return response;
  },
  (error) => {
    logger.error(`API Response Error: ${error.response?.status || 'Unknown'}`, error);
    return Promise.reject(error);
  }
);

/**
 * Detect vehicles in uploaded images
 * @param {FormData} formData - Form data with image files (roads parameter)
 */
export const detectVehicles = async (formData) => {
  try {
    logger.group('Vehicle Detection');
    logger.time('Detection Request');

    // The remote Hugging Face backend uses @app.post("/analyze")
    const response = await apiClient.post('/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    logger.timeEnd('Detection Request');
    logger.info(`Detection Success: ${response.data.total_vehicles} vehicles detected`);
    logger.groupEnd();

    return response.data;
  } catch (error) {
    logger.error('Vehicle Detection Failed:', error);
    const errorMessage =
      error.response?.data?.detail ||
      error.message ||
      'Detection failed. Please check the backend is running.';
    throw { message: errorMessage, status: error.response?.status, originalError: error };
  }
};

/**
 * Health check
 */
export const checkHealth = async () => {
  try {
    logger.debug('Checking backend health...');
    // The backend uses @app.get("/health")
    const response = await apiClient.get('/health');
    logger.info('Backend is healthy', response.data);
    return response.data;
  } catch (error) {
    logger.warn('Backend health check failed:', error.message);
    throw {
      message: 'Backend server is not responding',
      status: error.response?.status,
      originalError: error,
    };
  }
};

export default apiClient;
