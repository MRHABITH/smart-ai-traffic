import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import { useTrafficTimer } from '../hooks/useTrafficTimer';

const ROAD_LABELS = ['Road A', 'Road B', 'Road C', 'Road D'];
const ROAD_ACCENTS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b'];

const TrafficSignalLight = ({ isGreen }) => (
  <div style={{
    background: '#050d1a', border: '2px solid #1a2540',
    borderRadius: 16, padding: '12px 10px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    width: 52, marginBottom: 12,
  }}>
    {/* Red */}
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      background: !isGreen ? '#ef4444' : '#1a2540',
      boxShadow: !isGreen ? '0 0 14px rgba(239,68,68,0.7)' : 'none',
      transition: 'all 0.4s',
    }} />
    {/* Amber */}
    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#1a2540' }} />
    {/* Green */}
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      background: isGreen ? '#22c55e' : '#1a2540',
      boxShadow: isGreen ? '0 0 14px rgba(34,197,94,0.8), 0 0 28px rgba(34,197,94,0.3)' : 'none',
      transition: 'all 0.4s',
    }} className={isGreen ? 'animate-blink-green' : ''} />
  </div>
);

const LiveDashboard = ({ vehicleData = [] }) => {
  const { roadTimings, timeRemaining, currentGreenRoad } = useTrafficTimer(vehicleData);

  return (
    <section style={{ padding: '0 24px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LayoutDashboard size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Step 5 — Live Dashboard
          </span>
        </div>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Live Traffic Signal Control
        </h2>
        <p style={{ color: '#8da4c8', fontSize: 14 }}>
          Real-time adaptive signals cycling through roads by priority — proportional green-light allocation
        </p>
      </motion.div>

      {/* Signal Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="responsive-grid-4">
        {roadTimings.map((road, idx) => {
          const isGreen = currentGreenRoad === idx;
          const origIdx = road.originalIndex ?? idx;
          const accent = ROAD_ACCENTS[origIdx] || ROAD_ACCENTS[0];
          const label = ROAD_LABELS[origIdx] || `Road ${road.road}`;
          const key = `road_${road.road}`;
          const remaining = timeRemaining[key] || 0;
          const pct = road.signalTime > 0 ? (remaining / road.signalTime) * 100 : 0;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: isGreen ? 'rgba(34,197,94,0.06)' : '#111d35',
                border: `2px solid ${isGreen ? 'rgba(34,197,94,0.4)' : '#1e3057'}`,
                borderRadius: 18, overflow: 'hidden',
                boxShadow: isGreen ? '0 0 32px rgba(34,197,94,0.12)' : 'none',
                transition: 'all 0.5s',
              }}
            >
              {/* Progress bar top */}
              <div style={{ height: 4, background: '#0b1426' }}>
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    height: '100%',
                    background: isGreen ? 'linear-gradient(90deg, #16a34a, #4ade80)' : '#1e3057',
                    transition: 'background 0.4s',
                  }}
                />
              </div>

              <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Road label + status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{label}</span>
                  <span style={{
                    padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em',
                    background: isGreen ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)',
                    color: isGreen ? '#86efac' : '#fca5a5',
                    border: `1px solid ${isGreen ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'}`,
                  }}>
                    {isGreen ? '● GREEN' : '● RED'}
                  </span>
                </div>

                {/* Traffic Light */}
                <TrafficSignalLight isGreen={isGreen} />

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
                  <div style={{ padding: '10px', borderRadius: 10, background: '#0b1426', border: '1px solid #1e3057', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Vehicles</div>
                    <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', color: '#f0f6ff' }}>{road.count}</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: 10, background: '#0b1426', border: '1px solid #1e3057', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Time Left</div>
                    <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', color: isGreen ? '#4ade80' : '#4a6080' }}>
                      {String(remaining).padStart(2, '0')}s
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 10, fontSize: 10, color: '#4a6080', fontFamily: 'JetBrains Mono, monospace' }}>
                  {road.signalTime}s allocated
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
        {[
          { color: '#22c55e', label: 'Active green signal' },
          { color: '#ef4444', label: 'Waiting (red)' },
          { color: '#22d3ee', label: 'Countdown timer' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#4a6080' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveDashboard;
