import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#1A3A5C', color: 'rgba(255,255,255,0.85)', marginTop: 60 }}>
      <div className="container" style={{ padding: '48px 20px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 36, marginBottom: 36 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 22, color: 'white', marginBottom: 8 }}>
              🏔️ RozgarKashmir
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)' }}>
              Connecting workers with opportunities across Kashmir. Empowering local labour, one job at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#FF8C38', marginBottom: 12, fontSize: 15 }}>Quick Links</div>
            {[['/', 'Home'], ['/workers', 'Find Workers'], ['/jobs', 'Job Board'], ['/register', 'Register']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 6, transition: '0.2s' }}
                onMouseOver={e => e.target.style.color = '#FF8C38'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
              >{label}</Link>
            ))}
          </div>

          {/* Skills */}
          <div>
            <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#FF8C38', marginBottom: 12, fontSize: 15 }}>Popular Skills</div>
            {['Carpenter', 'Plumber', 'Electrician', 'Painter', 'Mason', 'Gardener'].map(skill => (
              <span key={skill} style={{
                display: 'inline-block', background: 'rgba(255,255,255,0.08)',
                borderRadius: 6, padding: '3px 10px', fontSize: 12, margin: '0 4px 6px 0', color: 'rgba(255,255,255,0.75)'
              }}>{skill}</span>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#FF8C38', marginBottom: 12, fontSize: 15 }}>Contact</div>
            {[
              [<Phone size={13}/>, 'support@rozgarkashmir.in'],
              [<Mail size={13}/>, '+91-98765-43210'],
              [<MapPin size={13}/>, 'Srinagar, J&K, India']
            ].map(([icon, text], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'rgba(255,255,255,0.7)', fontSize: 13.5 }}>
                {icon}{text}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>© 2025 RozgarKashmir. All rights reserved.</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
            Made with <Heart size={12} color="#FF6B00" fill="#FF6B00"/> for Kashmir
          </span>
        </div>
      </div>
    </footer>
  );
}
