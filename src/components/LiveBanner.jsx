import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function LiveBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      color: 'white',
      padding: '12px 0',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
      zIndex: 50
    }}>
      {/* Decorative ribbon effect */}
      <div style={{
        position: 'absolute',
        top: -2,
        left: 0,
        right: 0,
        height: 4,
        background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)'
      }} />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: 'clamp(12px, 3vw, 15px)',
        fontWeight: 600,
        padding: '0 16px'
      }}>
        <AlertCircle size={18} style={{ flexShrink: 0 }} />
        <span>🚀 We're collecting data. Officially launching soon! Stay tuned.</span>
      </div>
      
      {/* Bottom decorative border */}
      <div style={{
        position: 'absolute',
        bottom: -2,
        left: 0,
        right: 0,
        height: 4,
        background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)'
      }} />
    </div>
  );
}
