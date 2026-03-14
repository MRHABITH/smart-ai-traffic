import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Trophy, Clock, AlertTriangle } from 'lucide-react';

const ROAD_LABELS = ['Road A', 'Road B', 'Road C', 'Road D'];
const MAX_SIG = 90, MIN_SIG = 15;
const calcSig = (count, max) => Math.max(MIN_SIG, Math.round((count / (max || 1)) * MAX_SIG));

const RANK_STYLES = [
  { badge: '#ef4444', badgeBg: 'rgba(239,68,68,0.15)', label: '1st Priority', barColor: '#dc2626' },
  { badge: '#f97316', badgeBg: 'rgba(249,115,22,0.15)', label: '2nd Priority', barColor: '#ea580c' },
  { badge: '#f59e0b', badgeBg: 'rgba(245,158,11,0.15)', label: '3rd Priority', barColor: '#d97706' },
  { badge: '#64748b', badgeBg: 'rgba(100,116,139,0.10)', label: '4th Priority', barColor: '#475569' },
];

const SignalRecommendationTable = ({ vehicleData = [] }) => {
  const maxCount = Math.max(...vehicleData.map(d => d?.count || 0), 1);

  const sorted = [...vehicleData]
    .map((d, i) => ({
      index: i, label: ROAD_LABELS[i] || `Road ${i+1}`,
      count: d?.count || 0, signalTime: calcSig(d?.count || 0, maxCount),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <section style={{ padding: '0 24px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Step 4 — AI Signal Plan
          </span>
        </div>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.02em', marginBottom: 6 }}>
          AI Signal Recommendation
        </h2>
        <p style={{ color: '#8da4c8', fontSize: 14 }}>
          Proportional green-light allocation — busiest road gets up to {MAX_SIG}s, minimum {MIN_SIG}s guaranteed
        </p>
      </motion.div>

      {/* Info Banner */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 16px', borderRadius: 12, marginBottom: 24,
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
        color: '#fcd34d', fontSize: 13,
      }}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          Signal time formula: <strong style={{ fontFamily: 'JetBrains Mono, monospace' }}>green_time = max({MIN_SIG}, round(count / max_count × {MAX_SIG}))</strong>.
          Higher vehicle count = longer green light = cleared faster.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }} className="responsive-grid-2">
        {/* Table Wrapper for horizontal scroll on mobile */}
        <div style={{ overflowX: 'auto', margin: '0 -24px', padding: '0 24px' }}>
          <div style={{ background: '#111d35', border: '1px solid #1e3057', borderRadius: 16, overflow: 'hidden', minWidth: 600 }}>
          {/* Table Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 1fr 1fr',
            padding: '12px 20px', background: '#0b1426',
            borderBottom: '1px solid #1e3057',
            fontSize: 10, fontWeight: 700, color: '#4a6080',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            <span>Road</span>
            <span style={{ textAlign: 'center' }}>Vehicles</span>
            <span style={{ textAlign: 'center' }}>Priority</span>
            <span style={{ textAlign: 'center' }}>Signal</span>
            <span style={{ textAlign: 'center' }}>Allocation</span>
          </div>

          {sorted.map((road, rank) => {
            const rs = RANK_STYLES[rank] || RANK_STYLES[3];
            const pct = (road.signalTime / MAX_SIG) * 100;
            return (
              <motion.div
                key={road.index}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rank * 0.08 }}
                style={{
                  display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 1fr 1fr',
                  padding: '14px 20px',
                  background: rank === 0 ? 'rgba(239,68,68,0.04)' : 'transparent',
                  borderBottom: '1px solid #1e3057',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {rank === 0 && <Trophy size={14} color="#fbbf24" />}
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{road.label}</span>
                </div>
                <div style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>
                  {road.count}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                    background: rs.badgeBg, color: rs.badge, border: `1px solid ${rs.badge}40`,
                  }}>
                    {rs.label}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 8,
                    background: '#0b1426', border: '1px solid #1e3057',
                  }}>
                    <Clock size={12} color="#22d3ee" />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 800, color: '#22d3ee' }}>
                      {road.signalTime}s
                    </span>
                  </div>
                </div>
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ height: 8, borderRadius: 4, background: '#0b1426', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: rank * 0.12 }}
                      style={{ height: '100%', borderRadius: 4, background: rs.barColor }}
                    />
                  </div>
                  <div style={{ fontSize: 9, color: '#4a6080', marginTop: 3, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>
                    {pct.toFixed(0)}%
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        </div>

        {/* Signal Visual Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map((road, rank) => {
            const rs = RANK_STYLES[rank] || RANK_STYLES[3];
            return (
              <motion.div
                key={road.index}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: rank * 0.1 }}
                style={{
                  background: rank === 0 ? 'rgba(239,68,68,0.06)' : '#111d35',
                  border: `1px solid ${rank === 0 ? 'rgba(239,68,68,0.25)' : '#1e3057'}`,
                  borderRadius: 14, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: rs.badgeBg, border: `1px solid ${rs.badge}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 900, color: rs.badge,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>#{rank+1}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{road.label}</div>
                    <div style={{ fontSize: 10, color: '#4a6080' }}>{road.count} vehicles</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 28, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace',
                    color: rs.badge, lineHeight: 1,
                  }}>{road.signalTime}s</div>
                  <div style={{ fontSize: 10, color: '#4a6080' }}>green time</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SignalRecommendationTable;
