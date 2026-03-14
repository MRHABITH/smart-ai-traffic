/**
 * Validate image file
 * @param {File} file - File object
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: JPG, PNG, WebP. Got: ${file.type}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size too large. Max 10MB, got ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate multiple files
 * @param {FileList} files - Multiple files
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export const validateImageFiles = (files) => {
  const errors = [];
  const validFiles = [];

  for (let i = 0; i < files.length; i++) {
    const validation = validateImageFile(files[i]);
    if (!validation.valid) {
      errors.push(`File ${i + 1}: ${validation.error}`);
    } else {
      validFiles.push(files[i]);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    validFiles,
  };
};

/**
 * Validate vehicle count
 * @param {number} count - Vehicle count
 * @returns {boolean}
 */
export const isValidVehicleCount = (count) => {
  return typeof count === 'number' && count >= 0 && Number.isInteger(count);
};

/**
 * Validate confidence score
 * @param {number} confidence - Confidence score (0-1)
 * @returns {boolean}
 */
export const isValidConfidence = (confidence) => {
  return typeof confidence === 'number' && confidence >= 0 && confidence <= 1;
};
