import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer } from 'lucide-react';

const ROAD_LABELS = ['Road A', 'Road B', 'Road C', 'Road D'];

const getHeat = (pct) => {
  if (pct <= 20) return { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',  bar: '#22c55e', text: '#4ade80',  label: 'Clear'    };
  if (pct <= 45) return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', bar: '#f59e0b', text: '#fbbf24', label: 'Moderate' };
  if (pct <= 70) return { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', bar: '#f97316', text: '#fb923c', label: 'Heavy'    };
  return               { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',   bar: '#ef4444', text: '#f87171', label: 'Critical' };
};

const CongestionHeatmap = ({ vehicleData = [] }) => {
  const maxC = Math.max(...vehicleData.map(d => d?.count || 0), 1);

  return (
    <section style={{ padding: '0 24px 48px', maxWidth: 1400, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #dc2626, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Thermometer size={16} color="#fff" />
          </div>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.02em' }}>
            Congestion Heatmap
          </h2>
        </div>
        <p style={{ color: '#8da4c8', fontSize: 14 }}>Color-coded road density visualization</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="responsive-grid-4">
        {vehicleData.map((d, i) => {
          const count = d?.count || 0;
          const pct = (count / maxC) * 100;
          const h = getHeat(pct);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.09 }}
              style={{
                background: h.bg, border: `1px solid ${h.border}`,
                borderRadius: 16, padding: '20px',
                position: 'relative', overflow: 'hidden', minHeight: 160,
              }}
            >
              {/* Animated density fill from bottom */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: i * 0.15 }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: `linear-gradient(to top, ${h.bar}30, transparent)`,
                  pointerEvents: 'none',
                }}
              />
              {/* Pulse on critical */}
              {pct > 70 && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 16,
                  background: 'rgba(239,68,68,0.06)',
                  boxShadow: 'inset 0 0 0 2px rgba(239,68,68,0.2)',
                }} className="animate-pulse-dot" />
              )}

              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', gap: 14 }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <MapPin size={15} color={h.text} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff' }}>{ROAD_LABELS[i]}</span>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 800,
                    background: 'rgba(0,0,0,0.3)', color: h.text, letterSpacing: '0.06em',
                  }}>{h.label}</span>
                </div>

                {/* Count */}
                <div>
                  <span style={{ fontSize: 42, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', color: h.text, lineHeight: 1 }}>
                    {count}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>vehicles</span>
                </div>

                {/* Density bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Density</span>
                    <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: h.text }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.3, ease: 'easeOut', delay: i * 0.15 }}
                      style={{ height: '100%', borderRadius: 4, background: h.bar }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 14 }}>
        {[
          { label: 'Clear (≤20%)',    color: '#22c55e' },
          { label: 'Moderate (21–45%)', color: '#f59e0b' },
          { label: 'Heavy (46–70%)', color: '#f97316' },
          { label: 'Critical (>70%)', color: '#ef4444' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#4a6080' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CongestionHeatmap;
