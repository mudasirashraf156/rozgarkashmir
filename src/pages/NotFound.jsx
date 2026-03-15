import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
      <div>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🏔️</div>
        <h1 style={{ fontFamily: "'Baloo 2'", fontSize: 48, color: '#FF6B00', marginBottom: 8 }}>404</h1>
        <h2 style={{ fontFamily: "'Baloo 2'", color: '#1A3A5C', marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ color: '#8A8A8A', marginBottom: 28 }}>Looks like this page got lost in the mountains!</p>
        <Link to="/" className="btn btn-primary btn-lg">Go Back Home</Link>
      </div>
    </div>
  );
}
