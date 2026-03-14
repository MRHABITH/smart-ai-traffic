import { useState, useCallback, useRef } from 'react';
import { validateImageFiles } from '../utils/validators';
import { detectVehicles } from '../services/api';

/**
 * Custom hook for image upload and vehicle detection.
 * Returns:
 *   vehicleData  — detection results array
 *   roadPreviews — array of [null | objectURL string] per road slot (length 4)
 *   loading, error, successMessage
 *   handleImageUpload(filesArray4) — takes array of 4 nullable File objects (indexed Road A-D)
 *   clearData
 */
export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [roadPreviews, setRoadPreviews] = useState([null, null, null, null]);
  const [successMessage, setSuccessMessage] = useState(null);
  const prevPreviewsRef = useRef([null, null, null, null]);

  /**
   * @param {Array<File|null>} filesArray - 4-element array (Road A, B, C, D), nulls for empty slots
   */
  const handleImageUpload = useCallback(async (filesArray) => {
    setError(null);
    setSuccessMessage(null);

    const nonNullFiles = filesArray.filter(Boolean);
    if (nonNullFiles.length === 0) {
      setError('Please upload at least one road image.');
      return false;
    }

    // Basic validation on non-null files
    const validation = validateImageFiles(nonNullFiles);
    if (!validation.valid) {
      setError(validation.errors.join('\n'));
      return false;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      filesArray.forEach((file, index) => {
        if (file) {
          formData.append('roads', `Road ${String.fromCharCode(65 + index)}`);
          formData.append('files', file);
        }
      });

      const response = await detectVehicles(formData);

      // Extract detections from response. The HF API returns { signalPlan: [...], totalCount: ... }
      const detectionsArray = response.signalPlan || response.detections || response.results || response.data || [];
      if (!detectionsArray || !Array.isArray(detectionsArray)) {
        throw new Error('Invalid response structure from server');
      }

      // Map whatever the backend returned into the standard shape
      const normalizedDetections = detectionsArray.map(r => ({
        ...r,
        count: r.count !== undefined ? r.count : r.vehicleCount || 0,
        // Insert a dummy array of 'car' so the UI doesn't say "No vehicles detected"
        vehicles: r.vehicles || r.vehicleTypes || new Array(r.count || 0).fill('car'),
        confidence: r.confidence || r.avgConfidence || 0
      }));

      setVehicleData(normalizedDetections);

      // Build previews — match response.detections back to original slot positions
      // Backend returns detections in order of images that were sent
      // We need to map them back: build a map of road index → detection
      const detectionsBySlot = new Array(4).fill(null);
      let detectionIdx = 0;
      filesArray.forEach((file, slotIdx) => {
        if (file && detectionIdx < normalizedDetections.length) {
          detectionsBySlot[slotIdx] = normalizedDetections[detectionIdx];
          detectionIdx++;
        }
      });

      const totalVehicles = response.totalCount || response.totalVehicles || response.total_vehicles || normalizedDetections.reduce((sum, d) => sum + d.count, 0);

      setSuccessMessage(
        `✓ Detected ${totalVehicles} vehicles across ${normalizedDetections.length} road${normalizedDetections.length !== 1 ? 's' : ''}`
      );
      return true;
    } catch (err) {
      const msg = err.message || 'Detection failed. Ensure the backend is running.';
      setError(msg);
      console.error('[Upload Error]', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setVehicleData([]);
    setRoadPreviews([null, null, null, null]);
    setError(null);
    setSuccessMessage(null);
    prevPreviewsRef.current = [null, null, null, null];
  }, []);

  return {
    vehicleData,
    roadPreviews,
    setRoadPreviews,
    loading,
    error,
    successMessage,
    handleImageUpload,
    clearData,
  };
};

export default useImageUpload;
