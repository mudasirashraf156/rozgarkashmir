import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function ComingSoonModal() {
  return (
    <>
      {/* Blur overlay background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 999,
        animation: 'fadeIn 0.3s ease'
      }} />

      {/* Modal Content */}
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.3s ease'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          width: '100%',
          padding: '0',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Red Ribbon Header */}
          <div style={{
            background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
            color: 'white',
            padding: '24px 20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative ribbon effect - top */}
            <div style={{
              position: 'absolute',
              top: -2,
              left: 0,
              right: 0,
              height: 4,
              background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 20px)'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '8px'
            }}>
              <AlertCircle size={24} />
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: 'Sora, sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                🚀
              </div>
            </div>

            <h2 style={{
              fontSize: 'clamp(18px, 5vw, 28px)',
              fontWeight: 800,
              fontFamily: 'Sora, sans-serif',
              margin: '8px 0',
              lineHeight: 1.3
            }}>
              Coming Soon!
            </h2>

            {/* Decorative ribbon effect - bottom */}
            <div style={{
              position: 'absolute',
              bottom: -2,
              left: 0,
              right: 0,
              height: 4,
              background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 20px)'
            }} />
          </div>

          {/* Main Content */}
          <div style={{
            padding: '40px 30px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 16px)',
              color: '#6B7280',
              lineHeight: 1.8,
              marginBottom: '12px'
            }}>
              We're collecting data and preparing something amazing for you!
            </p>

            <div style={{
              background: '#FEE2E2',
              border: '2px solid #FCA5A5',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '32px'
            }}>
              <p style={{
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                color: '#7F1D1D',
                fontWeight: 600,
                margin: 0,
                lineHeight: 1.6
              }}>
                ✨ Stay Tuned, We Are Opening Soon! ✨
              </p>
            </div>

            <p style={{
              fontSize: 'clamp(12px, 2vw, 13px)',
              color: '#9CA3AF',
              marginBottom: '32px',
              fontStyle: 'italic'
            }}>
              Be among the first to join our platform
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <Link
                to="/register?role=worker"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
                  color: 'white',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: 'clamp(13px, 2.5vw, 15px)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(27, 67, 50, 0.3)',
                  cursor: 'pointer',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(27, 67, 50, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(27, 67, 50, 0.3)';
                }}
              >
                Register as Worker
                <ArrowRight size={16} />
              </Link>

              <p style={{
                fontSize: 'clamp(12px, 2vw, 13px)',
                color: '#9CA3AF',
                margin: '8px 0 0 0'
              }}>
                We'll notify you when we launch
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 640px) {
          div[style*="maxWidth: '500px'"] {
            margin: 0 16px;
          }
        }
      `}</style>
    </>
  );
}
