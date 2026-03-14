import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, BarChart2, TrafficCone, LayoutDashboard, ChevronRight } from 'lucide-react';

const STEPS = [
  { icon: Upload,        title: 'Upload Images',    desc: 'Add traffic images for Road A–D',        num: '01', accent: '#3b82f6', bg: 'rgba(37,99,235,0.15)',   border: 'rgba(59,130,246,0.35)' },
  { icon: Cpu,           title: 'AI Detection',     desc: 'YOLOv10 scans every vehicle type',        num: '02', accent: '#06b6d4', bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.35)' },
  { icon: BarChart2,     title: 'Traffic Analysis', desc: 'Density scoring & road priority ranking', num: '03', accent: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.35)' },
  { icon: TrafficCone,   title: 'Signal Planning',  desc: 'AI assigns optimal green-light times',    num: '04', accent: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)' },
  { icon: LayoutDashboard, title: 'Live Dashboard', desc: 'Animated command centre view',           num: '05', accent: '#22c55e', bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.35)'  },
];

const WorkflowSteps = ({ activeStep = 0 }) => {
  return (
    <section style={{ padding: '56px 24px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 16px', borderRadius: 100,
          background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(59,130,246,0.25)',
          color: '#93c5fd', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} className="animate-pulse-dot" />
          5-Step AI Pipeline
        </div>
        <h2 className="font-display" style={{
          fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8,
          color: '#f0f6ff'
        }}>
          How the System Works
        </h2>
        <p style={{ color: '#8da4c8', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>
          From image upload to real-time adaptive traffic signal control in 5 intelligent steps
        </p>
      </motion.div>

      {/* Steps Row Wrapper for Mobile Scrolling */}
      <div style={{
        overflowX: 'auto',
        paddingBottom: 16,
        margin: '0 -24px', // bleed into section padding
        padding: '0 24px 16px',
        scrollbarWidth: 'none', // hide scrollbar Firefox
        msOverflowStyle: 'none' // hide scrollbar IE/Edge
      }} className="responsive-wf-scroll">
        <style dangerouslySetInnerHTML={{__html: `
          .responsive-wf-scroll::-webkit-scrollbar { display: none; }
        `}} />
        
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
          flexWrap: 'nowrap', // Force horizontal line
          justifyContent: 'flex-start',
          minWidth: 'max-content',
        }} className="responsive-wf-flex">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeStep;
            const isDone = i < activeStep;
            const isLast = i === STEPS.length - 1;

            return (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    flex: '0 0 auto',
                    width: 170, // Fixed width for horizontal scrolling
                    background: isActive ? step.bg : isDone ? 'rgba(34,197,94,0.07)' : '#111d35',
                    border: `1px solid ${isActive ? step.border : isDone ? 'rgba(34,197,94,0.2)' : '#1e3057'}`,
                    borderRadius: 16,
                    padding: '24px 18px',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.3s',
                    boxShadow: isActive ? `0 0 24px ${step.accent}22` : 'none',
                  }}
                  className="responsive-wf-item"
                >
                  {/* Step Number */}
                  <div style={{
                    position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                    background: isActive ? step.accent : isDone ? '#16a34a' : '#1e3057',
                    color: '#fff',
                    fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                    padding: '2px 10px', borderRadius: 100,
                    letterSpacing: '0.05em',
                  }} className="responsive-wf-num">
                    {isDone ? '✓' : step.num}
                  </div>

                  <div className="responsive-wf-content-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  {/* Icon */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: isActive ? step.accent : isDone ? '#16a34a' : '#1a2540',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px',
                    boxShadow: isActive ? `0 4px 20px ${step.accent}50` : 'none',
                    transition: 'all 0.3s',
                  }} className={(isActive ? 'animate-float ' : '') + 'responsive-wf-icon-wrap'}>
                    <Icon size={24} color={isActive || isDone ? '#fff' : '#4a6080'} />
                  </div>

                  {/* Text */}
                  <div className="responsive-wf-text-wrap">
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: isActive ? '#f0f6ff' : isDone ? '#86efac' : '#8da4c8',
                      marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontSize: 11, lineHeight: 1.5,
                      color: isActive ? step.accent : isDone ? '#4ade80' : '#4a6080',
                    }}>
                      {step.desc}
                    </div>
                  </div>
                  </div>
                </motion.div>

                {/* Connector Arrow */}
                {!isLast && (
                  <div style={{
                    display: 'flex', alignItems: 'center', padding: '0 8px',
                    color: i < activeStep ? '#22c55e' : '#1e3057',
                    flexShrink: 0,
                    alignSelf: 'center',
                  }} className="responsive-wf-arrow">
                    <ChevronRight size={20} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSteps;
