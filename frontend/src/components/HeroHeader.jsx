import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, WifiOff, Radio, Clock, Activity } from 'lucide-react';

const HeroHeader = ({ backendStatus = 'checking', totalDetections = 0 }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) => d.toLocaleTimeString('en-US', { hour12: false });
  const fmtDate = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const statusConfig = {
    online:   { label: 'System Online',   dotColor: '#22c55e',  bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  textColor: '#86efac', Icon: Wifi    },
    offline:  { label: 'Backend Offline', dotColor: '#ef4444',  bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  textColor: '#fca5a5', Icon: WifiOff },
    checking: { label: 'Connecting…',     dotColor: '#fbbf24',  bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', textColor: '#fcd34d', Icon: Radio   },
  };
  const st = statusConfig[backendStatus] || statusConfig.checking;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(4, 8, 26, 0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1e3057',
    }}>
      {/* Top accent gradient line */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, #2563eb, #06b6d4, #8b5cf6)',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', gap: 16 }} className="responsive-header-inner">

          {/* LEFT — Logo + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="responsive-header-left">
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #2563eb, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
              flexShrink: 0,
              position: 'relative'
            }}>
              <Cpu size={22} color="#fff" />
              <div style={{
                position: 'absolute', top: -3, right: -3,
                width: 10, height: 10, borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #04081a',
              }} className="animate-pulse-dot" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
                className="grad-text-hero">
                AI Traffic Command Center
              </div>
              <div style={{ fontSize: 11, color: '#4a6080', fontWeight: 500, letterSpacing: '0.06em' }}>
                YOLOv10 • Intelligent Signal Management • v2.0
              </div>
            </div>
          </div>

          {/* CENTER — Metrics */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="hide-on-mobile">
            {[
              { label: 'Model', value: 'YOLOv10',  color: '#93c5fd' },
              { label: 'Roads', value: '4',          color: '#67e8f9' },
              { label: 'Detected', value: String(totalDetections), color: '#86efac' },
            ].map(m => (
              <div key={m.label} style={{
                padding: '6px 14px', borderRadius: 8,
                background: '#111d35', border: '1px solid #1e3057',
                fontSize: 12
              }}>
                <span style={{ color: '#4a6080' }}>{m.label}: </span>
                <span style={{ color: m.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* RIGHT — Clock + Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Clock */}
            <div style={{
              padding: '7px 14px', borderRadius: 10,
              background: '#111d35', border: '1px solid #1e3057',
              display: 'flex', alignItems: 'center', gap: 8
            }} className="hide-on-mobile">
              <Clock size={14} color="#4a6080" />
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color: '#f0f6ff', lineHeight: 1 }}>
                  {fmt(currentTime)}
                </div>
                <div style={{ fontSize: 10, color: '#4a6080', marginTop: 2, lineHeight: 1 }}>
                  {fmtDate(currentTime)}
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 10,
              background: st.bg, border: `1px solid ${st.border}`,
              color: st.textColor, fontSize: 12, fontWeight: 700
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: st.dotColor,
              }} className={backendStatus !== 'offline' ? 'animate-pulse-dot' : ''} />
              <st.Icon size={14} />
              <span>{st.label}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroHeader;
