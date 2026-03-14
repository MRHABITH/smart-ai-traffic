import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Zap, AlertCircle, ImagePlus } from 'lucide-react';

const ROADS = [
  { label: 'Road A', accent: '#3b82f6', bg: 'rgba(37,99,235,0.12)',  border: '#2563eb' },
  { label: 'Road B', accent: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: '#0891b2' },
  { label: 'Road C', accent: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: '#7c3aed' },
  { label: 'Road D', accent: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: '#d97706' },
];

const UploadZone = ({ onDetect, loading, onFilesChange }) => {
  const [slots, setSlots] = useState([null, null, null, null]);
  const [dragging, setDragging] = useState(null);
  const [error, setError] = useState('');
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const assign = useCallback((idx, file) => {
    if (!file?.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, etc.)');
      return;
    }
    setError('');
    const preview = URL.createObjectURL(file);
    setSlots(prev => {
      const n = [...prev];
      if (n[idx]?.preview) URL.revokeObjectURL(n[idx].preview);
      n[idx] = { file, preview };
      onFilesChange?.(n.map(s => s?.file || null));
      return n;
    });
  }, [onFilesChange]);

  const clear = (idx) => {
    setSlots(prev => {
      const n = [...prev];
      if (n[idx]?.preview) URL.revokeObjectURL(n[idx].preview);
      n[idx] = null;
      onFilesChange?.(n.map(s => s?.file || null));
      return n;
    });
  };

  const clearAll = () => {
    slots.forEach(s => s?.preview && URL.revokeObjectURL(s.preview));
    const empty = [null, null, null, null];
    setSlots(empty);
    setError('');
    onFilesChange?.(empty.map(() => null));
  };

  const filled = slots.filter(Boolean).length;

  const detect = () => {
    if (filled === 0) { setError('Upload at least one road image to start detection.'); return; }
    setError('');
    onDetect(slots.map(s => s?.file || null));
  };

  return (
    <section style={{ padding: '0 24px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Section Label */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ImagePlus size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Step 1 — Upload
          </span>
        </div>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Upload Road Traffic Images
        </h2>
        <p style={{ color: '#8da4c8', fontSize: 14 }}>
          Drag & drop or click each road slot to upload an image. Supports up to 4 roads simultaneously.
        </p>
      </motion.div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 12, marginBottom: 20,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', fontSize: 13,
            }}>
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4-slot Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }} className="responsive-grid-4">
        {ROADS.map((road, i) => {
          const slot = slots[i];
          const isDragging = dragging === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className={isDragging ? 'drop-zone-active' : ''}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                border: `2px dashed ${slot ? road.border : isDragging ? road.accent : '#2a4a8a'}`,
                minHeight: 210,
                cursor: 'pointer',
                background: slot ? 'transparent' : isDragging ? road.bg : '#0b1426',
                transition: 'all 0.2s',
              }}
              onDragOver={e => { e.preventDefault(); setDragging(i); }}
              onDragLeave={() => setDragging(null)}
              onDrop={e => { e.preventDefault(); setDragging(null); assign(i, e.dataTransfer.files?.[0]); }}
              onClick={() => !slot && refs[i].current?.click()}
            >
              <input ref={refs[i]} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { assign(i, e.target.files?.[0]); e.target.value = ''; }} />

              {slot ? (
                /* Filled */
                <div style={{ position: 'relative', height: '100%', minHeight: 210 }}>
                  <img src={slot.preview} alt={road.label}
                    style={{ width: '100%', height: '100%', minHeight: 210, maxHeight: 230, objectFit: 'cover', display: 'block' }} />
                  {/* Gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,8,26,0.9) 0%, rgba(4,8,26,0.3) 50%, transparent 100%)' }} />
                  {/* Road Badge */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    padding: '4px 12px', borderRadius: 8,
                    background: road.accent, color: '#fff',
                    fontSize: 11, fontWeight: 800, letterSpacing: '0.05em',
                  }}>
                    {road.label}
                  </div>
                  {/* Clear btn */}
                  <button
                    onClick={e => { e.stopPropagation(); clear(i); }}
                    style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(239,68,68,0.85)', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#fff',
                    }}><X size={14} /></button>
                  {/* File name */}
                  <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                    <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {slot.file.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
                      {(slot.file.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  {/* Change overlay */}
                  <button
                    onClick={e => { e.stopPropagation(); refs[i].current?.click(); }}
                    style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                  >
                    <span style={{
                      padding: '6px 14px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff', fontSize: 12, fontWeight: 600, opacity: 0,
                    }}
                      className="change-label">Change</span>
                  </button>
                </div>
              ) : (
                /* Empty */
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '100%', minHeight: 210, padding: 24, textAlign: 'center',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: road.bg, border: `2px solid ${road.border}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                  }} className="animate-float">
                    <Camera size={26} color={road.accent} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: road.accent, marginBottom: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {road.label}
                  </div>
                  <div style={{ fontSize: 12, color: '#4a6080', lineHeight: 1.5 }}>
                    {isDragging ? '⬇ Drop image now' : 'Drop image here or click to browse'}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {slots.map((s, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: s ? '#22c55e' : '#1e3057',
                border: s ? '2px solid #16a34a' : '2px solid #2a4a8a',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
          <span style={{ color: '#8da4c8', fontSize: 13, fontWeight: 500 }}>
            {filled} of 4 roads uploaded
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {filled > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              disabled={loading}
              onClick={clearAll}
              className="btn-ghost"
              style={{ padding: '10px 20px' }}
            >
              Clear All
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={detect}
            disabled={loading || filled === 0}
            className="btn-primary"
            style={{ padding: '11px 28px', fontSize: 14 }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                }} className="animate-spin-slow" />
                Analyzing Images…
              </>
            ) : (
              <>
                <Zap size={16} />
                Run AI Detection
              </>
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default UploadZone;
