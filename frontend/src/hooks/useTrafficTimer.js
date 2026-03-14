import { useState, useEffect, useCallback } from 'react';

const MAX_SIGNAL = 90;
const MIN_SIGNAL = 15;

const calcSignalTime = (count, maxCount) => {
  if (maxCount === 0) return MIN_SIGNAL;
  return Math.max(MIN_SIGNAL, Math.round((count / maxCount) * MAX_SIGNAL));
};

/**
 * Custom hook for proportional traffic light timing
 * - Highest-traffic road gets up to 90s green
 * - Others scaled proportionally (min 15s)
 */
export const useTrafficTimer = (vehicleData = []) => {
  const [roadTimings, setRoadTimings] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [currentGreenRoad, setCurrentGreenRoad] = useState(0);

  // Rebuild timings when vehicleData changes
  useEffect(() => {
    if (!vehicleData || vehicleData.length === 0) {
      setRoadTimings([]);
      setTimeRemaining({});
      setCurrentGreenRoad(0);
      return;
    }

    const maxCount = Math.max(...vehicleData.map(d => d?.count || 0), 1);

    // Sort by count descending, preserve original index
    const sorted = vehicleData
      .map((data, idx) => ({
        ...data,
        road: idx + 1,
        originalIndex: idx,
        count: data?.count || 0,
        signalTime: calcSignalTime(data?.count || 0, maxCount),
      }))
      .sort((a, b) => b.count - a.count);

    setRoadTimings(sorted);

    const newTimings = {};
    sorted.forEach(road => {
      newTimings[`road_${road.road}`] = road.signalTime;
    });
    setTimeRemaining(newTimings);
    setCurrentGreenRoad(0);
  }, [vehicleData]);

  // Countdown timer
  useEffect(() => {
    if (!roadTimings || roadTimings.length === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const updated = { ...prev };
        const keys = Object.keys(updated);
        if (keys.length === 0) return updated;

        const currentKey = keys[currentGreenRoad];
        if (!currentKey) return updated;

        if (updated[currentKey] > 1) {
          updated[currentKey] -= 1;
        } else {
          // Move to next road, reset its timer to its allocated signal time
          const nextIdx = (currentGreenRoad + 1) % keys.length;
          setCurrentGreenRoad(nextIdx);
          const nextRoad = roadTimings[nextIdx];
          updated[currentKey] = nextRoad?.signalTime || MIN_SIGNAL;
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [roadTimings, currentGreenRoad]);

  const getProgressPercent = useCallback((road) => {
    const key = `road_${road.road}`;
    const remaining = timeRemaining[key] || 0;
    const total = road.signalTime || MIN_SIGNAL;
    return (remaining / total) * 100;
  }, [timeRemaining]);

  return {
    roadTimings,
    timeRemaining,
    currentGreenRoad,
    getProgressPercent,
  };
};

export default useTrafficTimer;
