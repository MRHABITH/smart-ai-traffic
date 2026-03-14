import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart2, TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';

const ROAD_LABELS = ['Road A', 'Road B', 'Road C', 'Road D'];
const BAR_COLORS  = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b'];

const getCongestion = (pct) => {
  if (pct <= 20) return { label: 'Low',      barClass: 'bar-green',  color: '#4ade80' };
  if (pct <= 45) return { label: 'Medium',   barClass: 'bar-amber',  color: '#fbbf24' };
  if (pct <= 70) return { label: 'High',     barClass: 'bar-orange', color: '#fb923c' };
  return              { label: 'Critical',  barClass: 'bar-red',    color: '#f87171' };
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0b1426', border: '1px solid #2a4a8a',
      borderRadius: 10, padding: '10px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
    }}>
      <p style={{ color: '#f0f6ff', fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{payload[0].payload.name}</p>
      <p style={{ color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
        {payload[0].value} vehicles
      </p>
    </div>
  );
};

const StatCard = ({ title, value, Icon, color, sub }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    style={{
      background: '#111d35', border: '1px solid #1e3057', borderRadius: 14,
      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
    }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
      background: `${color}22`, border: `1px solid ${color}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 10, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', color: '#f0f6ff', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: '#4a6080', marginTop: 2 }}>{sub}</div>}
    </div>
  </motion.div>
);

const TrafficAnalysisPanel = ({ vehicleData = [] }) => {
  const counts = vehicleData.map(d => d?.count || 0);
  const total  = counts.reduce((a, b) => a + b, 0);
  const avg    = vehicleData.length > 0 ? (total / vehicleData.length).toFixed(1) : 0;
  const peak   = Math.max(...counts, 0);
  const low    = vehicleData.length > 0 ? Math.min(...counts) : 0;
  const maxC   = peak || 1;

  const ranked = [...vehicleData]
    .map((d, i) => ({ label: ROAD_LABELS[i] || `Road ${i+1}`, count: d?.count || 0, index: i }))
    .sort((a, b) => b.count - a.count);

  const chartData = vehicleData.map((d, i) => ({ name: ROAD_LABELS[i] || `Road ${i+1}`, count: d?.count || 0 }));

  return (
    <section style={{ padding: '0 24px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart2 size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Step 3 — Analysis
          </span>
        </div>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Traffic Analysis
        </h2>
        <p style={{ color: '#8da4c8', fontSize: 14 }}>
          Vehicle density scoring, congestion levels, and road priority ranking
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }} className="responsive-grid-2">
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <StatCard title="Total Vehicles" value={total}  Icon={Activity}      color="#3b82f6" sub="all roads combined" />
            <StatCard title="Avg per Road"   value={avg}    Icon={TrendingUp}    color="#06b6d4" sub="vehicles / road"    />
            <StatCard title="Peak Traffic"   value={peak}   Icon={AlertTriangle} color="#ef4444" sub="busiest road"        />
            <StatCard title="Lowest"         value={low}    Icon={TrendingDown}  color="#22c55e" sub="clearest road"       />
          </div>

          {/* Congestion Bars */}
          <div style={{ background: '#111d35', border: '1px solid #1e3057', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>Road Congestion Density</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {vehicleData.map((d, i) => {
                const count = d?.count || 0;
                const pct = (count / maxC) * 100;
                const cong = getCongestion(pct);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#8da4c8' }}>{ROAD_LABELS[i]}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: cong.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: `${cong.color}18` }}>{cong.label}</span>
                        <span style={{ color: '#4a6080', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>{count}</span>
                      </div>
                    </div>
                    <div style={{ height: 10, borderRadius: 6, background: '#0b1426', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.12 }}
                        className={cong.barClass}
                        style={{ height: '100%', borderRadius: 6 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Ranking */}
          <div style={{ background: '#111d35', border: '1px solid #1e3057', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 14 }}>Priority Ranking</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ranked.map((road, rank) => {
                const rankColors = ['#ef4444', '#f97316', '#f59e0b', '#64748b'];
                return (
                  <div key={road.index} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 10,
                    background: rank === 0 ? 'rgba(239,68,68,0.07)' : '#0b1426',
                    border: `1px solid ${rank === 0 ? 'rgba(239,68,68,0.2)' : '#1e3057'}`,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: `${rankColors[rank]}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 900, color: rankColors[rank],
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>#{rank + 1}</div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{road.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: rankColors[rank] }}>{road.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Bar Chart */}
        <div style={{ background: '#111d35', border: '1px solid #1e3057', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 20 }}>Vehicle Count by Road</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,48,87,0.8)" />
              <XAxis dataKey="name" tick={{ fill: '#4a6080', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={64}>
                {chartData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid #1e3057' }}>
            {chartData.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: BAR_COLORS[i] }} />
                <span style={{ fontSize: 11, color: '#8da4c8' }}>
                  {d.name}: <span style={{ color: '#f0f6ff', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{d.count}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficAnalysisPanel;
