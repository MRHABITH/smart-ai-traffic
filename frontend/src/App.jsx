import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, BarChart2, Brain } from 'lucide-react';

// Components
import HeroHeader from './components/HeroHeader';
import WorkflowSteps from './components/WorkflowSteps';
import SystemStatusBar from './components/SystemStatusBar';
import UploadZone from './components/UploadZone';
import DetectionResultCard from './components/DetectionResultCard';
import TrafficAnalysisPanel from './components/TrafficAnalysisPanel';
import SignalRecommendationTable from './components/SignalRecommendationTable';
import LiveDashboard from './components/LiveDashboard';
import CongestionHeatmap from './components/CongestionHeatmap';
import { LoadingSpinner, ErrorMessage, SuccessMessage } from './components/UIComponents';
import ErrorBoundary from './components/ErrorBoundary';

// Hooks
import { useImageUpload } from './hooks/useImageUpload';

// API
import { checkHealth } from './services/api';

const ROAD_LABELS = ['Road A', 'Road B', 'Road C', 'Road D'];

function HeroLanding() {
  return (
    <section style={{
      position: 'relative',
      padding: '64px 24px 48px',
      textAlign: 'center',
      overflow: 'hidden',
      maxWidth: 1400, margin: '0 auto',
    }}>
      {/* Background glow orbs */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 40, left: '20%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative' }}>
        {/* Tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 100,
          background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(59,130,246,0.25)',
          color: '#93c5fd', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24,
        }}>
          <Cpu size={12} />
          YOLOv10 Powered • Real-Time Detection
        </div>

        {/* Big heading */}
        <h1 className="font-display" style={{
          fontSize: 'clamp(32px, 5vw, 58px)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 20,
          color: '#f0f6ff',
        }}>
          Intelligent Traffic
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Management System
          </span>
        </h1>

        {/* Sub text */}
        <p style={{
          fontSize: 17, color: '#8da4c8', maxWidth: 560, margin: '0 auto 36px',
          lineHeight: 1.7,
        }} className="responsive-p-mobile">
          Upload road traffic images. The AI scans, detects every vehicle type,
          then automatically calculates optimal signal timings across all roads.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
          {[
            { icon: <Zap size={12} />, label: 'Real-Time Detection', color: '#3b82f6' },
            { icon: <BarChart2 size={12} />, label: 'Traffic Analytics', color: '#06b6d4' },
            { icon: <Brain size={12} />, label: 'AI Signal Planning', color: '#8b5cf6' },
            { icon: <Cpu size={12} />, label: '4-Road Simultaneous', color: '#f59e0b' },
          ].map(f => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 100,
              background: `${f.color}14`, border: `1px solid ${f.color}30`,
              color: f.color, fontSize: 12, fontWeight: 600,
            }}>
              {f.icon}
              {f.label}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Divider() {
  return (
    <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1e3057, transparent)', margin: '0 24px' }} />
  );
}

function App() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [slotFiles, setSlotFiles] = useState([null, null, null, null]);
  const [slotPreviews, setSlotPreviews] = useState([null, null, null, null]);

  const resultsRef = useRef(null);

  const {
    vehicleData, loading, error, successMessage,
    handleImageUpload, clearData,
  } = useImageUpload();

  // Health check
  useEffect(() => {
    const check = async () => {
      try { await checkHealth(); setBackendStatus('online'); }
      catch  { setBackendStatus('offline'); }
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, []);

  // Scroll to results & mark timestamp
  useEffect(() => {
    if (vehicleData.length > 0) {
      setLastUpdated(new Date().toISOString());
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
    }
  }, [vehicleData]);

  const handleDetect = useCallback(async (files4) => {
    setSlotFiles(files4);
    const previews = files4.map(f => f ? URL.createObjectURL(f) : null);
    setSlotPreviews(prev => { prev.forEach(p => p && URL.revokeObjectURL(p)); return previews; });
    await handleImageUpload(files4);
  }, [handleImageUpload]);

  const handleFilesChange = useCallback((files4) => {
    setSlotFiles(files4);
  }, []);

  const handleClear = useCallback(() => {
    clearData();
    setSlotFiles([null, null, null, null]);
    slotPreviews.forEach(p => { if (p) URL.revokeObjectURL(p); });
    setSlotPreviews([null, null, null, null]);
    setLastUpdated(null);
  }, [clearData, slotPreviews]);

  const totalDetections = vehicleData.reduce((s, d) => s + (d?.count || 0), 0);
  const activeStep = loading ? 1 : vehicleData.length > 0 ? 4 : 0;

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', background: '#04081a', display: 'flex', flexDirection: 'column' }}>
        {/* Grid overlay */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(30,48,87,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(30,48,87,0.25) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
          zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* ── HEADER ── */}
          <HeroHeader backendStatus={backendStatus} totalDetections={totalDetections} />

          {/* ── HERO ── */}
          <HeroLanding />

          <Divider />

          {/* ── WORKFLOW STEPS ── */}
          <WorkflowSteps activeStep={activeStep} />

          <Divider />

          {/* ── UPLOAD ── */}
          <UploadZone
            onDetect={handleDetect}
            loading={loading}
            onFilesChange={handleFilesChange}
          />

          {/* ── ALERTS ── */}
          <div style={{ padding: '0 24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
            <AnimatePresence>
              {error && <ErrorMessage message={error} />}
              {!error && successMessage && <SuccessMessage message={successMessage} />}
            </AnimatePresence>
          </div>

          {/* ── LOADING ── */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LoadingSpinner message="YOLOv10 is analyzing your images — this may take a moment…" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── RESULTS (appear after detection) ── */}
          <AnimatePresence>
            {vehicleData.length > 0 && !loading && (
              <motion.div ref={resultsRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Divider />

                {/* Detection Cards */}
                <section style={{ padding: '0 24px 32px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, marginTop: 40, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
                        Step 2 — Detection Results
                      </span>
                      <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.02em', marginBottom: 4 }}>
                        Vehicle Detection Output
                      </h2>
                      <p style={{ color: '#8da4c8', fontSize: 14 }}>
                        YOLOv10 detected {totalDetections} vehicles across {vehicleData.length} road{vehicleData.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={handleClear}
                      style={{
                        padding: '10px 20px', borderRadius: 10, border: '1px solid #1e3057',
                        background: 'transparent', color: '#8da4c8', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = '#2a4a8a'; e.target.style.color = '#f0f6ff'; }}
                      onMouseLeave={e => { e.target.style.borderColor = '#1e3057'; e.target.style.color = '#8da4c8'; }}
                    >
                      ↩ Clear &amp; Reset
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    {vehicleData.map((data, index) => {
                      const nonNull = slotFiles.reduce((acc, f, i) => { if (f) acc.push(i); return acc; }, []);
                      const slotIdx = nonNull[index] ?? index;
                      return (
                        <DetectionResultCard
                          key={index} roadIndex={slotIdx}
                          data={data} preview={slotPreviews[slotIdx]}
                        />
                      );
                    })}
                  </div>
                </section>

                <Divider />
                <TrafficAnalysisPanel vehicleData={vehicleData} />
                <Divider />
                <SignalRecommendationTable vehicleData={vehicleData} />
                <Divider />
                <LiveDashboard vehicleData={vehicleData} />
                <Divider />
                <CongestionHeatmap vehicleData={vehicleData} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spacer */}
          <div style={{ flex: 1, minHeight: 32 }} />
        </div>

        {/* ── FOOTER STATUS BAR ── */}
        <SystemStatusBar
          backendStatus={backendStatus}
          totalDetections={totalDetections}
          lastUpdated={lastUpdated}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
