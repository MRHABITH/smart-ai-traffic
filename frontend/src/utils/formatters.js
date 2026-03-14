/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format percentage
 * @param {number} numerator - Numerator
 * @param {number} denominator - Denominator
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (numerator, denominator) => {
  if (!denominator || denominator === 0) return '0%';
  return Math.round((numerator / denominator) * 100) + '%';
};

/**
 * Get traffic status based on vehicle count
 * @param {number} count - Vehicle count
 * @returns {Object} - { label: string, color: string, severity: string }
 */
export const getTrafficStatus = (count) => {
  if (count === 0) {
    return {
      label: 'Clear',
      color: 'bg-green-900/40',
      textColor: 'text-green-300',
      borderColor: 'border-green-600',
      severity: 'low',
    };
  } else if (count <= 3) {
    return {
      label: 'Light',
      color: 'bg-cyan-900/40',
      textColor: 'text-cyan-300',
      borderColor: 'border-cyan-600',
      severity: 'low',
    };
  } else if (count <= 7) {
    return {
      label: 'Moderate',
      color: 'bg-yellow-900/40',
      textColor: 'text-yellow-300',
      borderColor: 'border-yellow-600',
      severity: 'medium',
    };
  } else {
    return {
      label: 'Heavy',
      color: 'bg-red-900/40',
      textColor: 'text-red-300',
      borderColor: 'border-red-600',
      severity: 'high',
    };
  }
};

/**
 * Calculate average confidence from detections
 * @param {Array} detections - Detection data array
 * @returns {number} - Average confidence
 */
export const calculateAverageConfidence = (detections) => {
  if (!detections || detections.length === 0) return 0;
  const total = detections.reduce((sum, d) => sum + (d.confidence || 0), 0);
  return (total / detections.length).toFixed(2);
};

/**
 * Format file size
 * @param {number} bytes - Bytes
 * @returns {string} - Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format timestamp to human-readable
 * @param {Date|number} timestamp - Timestamp
 * @returns {string} - Formatted time
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
