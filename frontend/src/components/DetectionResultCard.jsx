import React from 'react';
import { motion } from 'framer-motion';
import { Car, Truck, Bike, User, Bus, CheckCircle, AlertTriangle, XCircle, AlertCircle } from 'lucide-react';

const ROAD_META = [
  { label: 'Road A', accent: '#3b82f6', bg: 'rgba(37,99,235,0.12)',  border: '#1e3a70', bar: 'linear-gradient(90deg,#1d4ed8,#60a5fa)' },
  { label: 'Road B', accent: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: '#164e63', bar: 'linear-gradient(90deg,#0e7490,#22d3ee)' },
  { label: 'Road C', accent: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: '#3b1f7a', bar: 'linear-gradient(90deg,#6d28d9,#a78bfa)' },
  { label: 'Road D', accent: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: '#78350f', bar: 'linear-gradient(90deg,#b45309,#fbbf24)' },
];

const CONGESTION = [
  { max: 3,        label: 'LOW',      Icon: CheckCircle,  bg: 'rgba(34,197,94,0.12)',  color: '#86efac', border: 'rgba(34,197,94,0.3)'  },
  { max: 8,        label: 'MEDIUM',   Icon: AlertCircle,  bg: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: 'rgba(245,158,11,0.3)' },
  { max: 15,       label: 'HIGH',     Icon: AlertTriangle,bg: 'rgba(249,115,22,0.12)', color: '#fdba74', border: 'rgba(249,115,22,0.3)' },
  { max: Infinity, label: 'CRITICAL', Icon: XCircle,      bg: 'rgba(239,68,68,0.15)',  color: '#fca5a5', border: 'rgba(239,68,68,0.35)' },
];

const VEHICLE_TYPES = {
  car:       { label: 'Cars',       color: '#60a5fa',  Icon: Car   },
  bus:       { label: 'Buses',      color: '#fbbf24',  Icon: Bus   },
  truck:     { label: 'Trucks',     color: '#fb923c',  Icon: Truck },
  motorbike: { label: 'Motorbikes', color: '#c084fc',  Icon: Bike  },
  bicycle:   { label: 'Bicycles',   color: '#4ade80',  Icon: Bike  },
  person:    { label: 'Persons',    color: '#f472b6',  Icon: User  },
};

const DetectionResultCard = ({ roadIndex = 0, data, preview = null }) => {
  const meta = ROAD_META[roadIndex] || ROAD_META[0];
  const count = data?.count || 0;
  const vehicles = data?.vehicles || [];
  const confidence = data?.confidence ? (data.confidence * 100).toFixed(0) : 0;
  const cong = CONGESTION.find(l => count <= l.max) || CONGESTION[3];
  const CongIcon = cong.Icon;

  const typeCounts = {};
  vehicles.forEach(v => { typeCounts[v] = (typeCounts[v] || 0) + 1; });
  const detectedTypes = Object.entries(typeCounts).filter(([, n]) => n > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: roadIndex * 0.08 }}
      style={{
        background: '#111d35', border: `1px solid ${meta.border}`,
        borderRadius: 16, overflow: 'hidden',
      }}
    >
      {/* Image or Placeholder */}
      <div style={{ position: 'relative', height: 150, background: '#0b1426' }}>
        {preview ? (
          <img src={preview} alt={meta.label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={48} color="#1e3057" />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,29,53,1) 0%, rgba(17,29,53,0.4) 50%, transparent 100%)' }} />
        {/* Road Badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          padding: '4px 12px', borderRadius: 8,
          background: meta.accent, color: '#fff',
          fontSize: 11, fontWeight: 800, letterSpacing: '0.05em',
        }}>
          {meta.label}
        </div>
        {/* Confidence */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          padding: '4px 10px', borderRadius: 8,
          background: 'rgba(0,0,0,0.6)', color: '#cbd5e1',
          fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
        }}>
          {confidence}% conf
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        {/* Count + Congestion */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
              Total Vehicles
            </div>
            <div style={{
              fontSize: 40, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace',
              background: meta.bar, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', lineHeight: 1,
            }}>
              {count}
            </div>
          </div>
          {/* Congestion Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 10,
            background: cong.bg, border: `1px solid ${cong.border}`,
            color: cong.color, fontSize: 11, fontWeight: 800,
            letterSpacing: '0.06em',
          }}>
            <CongIcon size={13} />
            {cong.label}
          </div>
        </div>

        {/* Vehicle Types */}
        {detectedTypes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            {detectedTypes.map(([type, n]) => {
              const tv = VEHICLE_TYPES[type];
              if (!tv) return null;
              const TVIcon = tv.Icon;
              return (
                <div key={type} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: 10,
                  background: '#0b1426', border: '1px solid #1e3057',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TVIcon size={15} color={tv.color} />
                    <span style={{ color: '#8da4c8', fontSize: 12, fontWeight: 500 }}>{tv.label}</span>
                  </div>
                  <span style={{ color: tv.color, fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{n}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#4a6080', fontSize: 12, padding: '8px 0', marginBottom: 14 }}>
            No vehicles detected
          </div>
        )}

        {/* Density Bar */}
        <div style={{ height: 6, borderRadius: 6, background: '#0b1426', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(count * 6, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: roadIndex * 0.1 + 0.3 }}
            style={{ height: '100%', borderRadius: 6, background: meta.bar }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DetectionResultCard;
