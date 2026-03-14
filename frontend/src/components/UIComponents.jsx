import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingSpinner = ({ message = 'Processing…' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: 16 }}>
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      border: '3px solid #1e3057', borderTopColor: '#3b82f6',
    }} className="animate-spin-slow" />
    <p style={{ color: '#8da4c8', fontSize: 14, fontWeight: 600 }}>{message}</p>
  </div>
);

export const ErrorMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
    style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 18px', borderRadius: 14, marginBottom: 16,
      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
      color: '#fca5a5',
    }}
  >
    <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
    <div>
      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Error</p>
      <p style={{ fontSize: 13, color: '#fca5a5', opacity: 0.9, whiteSpace: 'pre-wrap' }}>{message}</p>
    </div>
  </motion.div>
);

export const SuccessMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
    style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 18px', borderRadius: 14, marginBottom: 16,
      background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
      color: '#86efac', fontSize: 14, fontWeight: 600,
    }}
  >
    <span>✓</span>
    {message}
  </motion.div>
);

export const EmptyState = ({ icon = '📊', title, description }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '64px 24px', textAlign: 'center',
    border: '2px dashed #1e3057', borderRadius: 20,
    background: '#0b1426',
  }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f0f6ff', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
    <p style={{ fontSize: 14, color: '#8da4c8', maxWidth: 360 }}>{description}</p>
  </div>
);
