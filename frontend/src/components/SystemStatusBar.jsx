import React from 'react';
import { Wifi, WifiOff, Radio, Cpu, Activity, Clock } from 'lucide-react';

const SystemStatusBar = ({ backendStatus = 'checking', totalDetections = 0, lastUpdated = null }) => {
  const stMap = {
    online:   { label: 'Backend Online',  color: '#86efac', dot: '#22c55e', Icon: Wifi    },
    offline:  { label: 'Backend Offline', color: '#fca5a5', dot: '#ef4444', Icon: WifiOff },
    checking: { label: 'Connecting…',     color: '#fcd34d', dot: '#f59e0b', Icon: Radio   },
  };
  const st = stMap[backendStatus] || stMap.checking;

  const pillStyle = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600 };
  const sepStyle  = { width: 1, height: 14, background: '#1e3057' };

  return (
    <footer style={{ borderTop: '1px solid #1e3057', background: 'rgba(4,8,26,0.96)', padding: '10px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ ...pillStyle, color: st.color }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }} className={backendStatus !== 'offline' ? 'animate-pulse-dot' : ''} />
            <st.Icon size={13} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{st.label}</span>
          </div>
          <div style={sepStyle} />
          <div style={{ ...pillStyle, color: '#4a6080' }}>
            <Cpu size={13} />
            <span>YOLOv10 Model</span>
          </div>
          <div style={sepStyle} />
          <div style={{ ...pillStyle, color: '#4a6080' }}>
            <Activity size={13} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{totalDetections} vehicles detected</span>
          </div>
        </div>
        {/* Right */}
        <div style={{ ...pillStyle, color: '#4a6080' }}>
          {lastUpdated && (
            <>
              <Clock size={13} />
              <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
              <div style={sepStyle} />
            </>
          )}
          <span>AI Intelligent Traffic Management v2.0</span>
        </div>
      </div>
    </footer>
  );
};

export default SystemStatusBar;
