import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle } from 'lucide-react';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { loginUser, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as admin, redirect
  React.useEffect(() => {
    if (user?.role === 'admin') navigate('/admin');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      if (res.data.user.role !== 'admin') {
        setError('Access denied. This login is for admins only.');
        setLoading(false);
        return;
      }
      loginUser(res.data.token, res.data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A3A5C 0%, #0D2137 60%, #1A3A5C 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,107,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,140,56,0.08) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>

        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #FF6B00, #FF8C38)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(255,107,0,0.4)'
          }}>
            <Shield size={36} color="white" />
          </div>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 26, color: 'white', marginBottom: 6 }}>
            Admin Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
            RozgarKashmir · Restricted Access
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: 36,
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)'
        }}>

          {/* Warning strip */}
          <div style={{
            background: '#FFF8E1',
            border: '1.5px solid #FFD54F',
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24
          }}>
            <Lock size={15} color="#F57C00" />
            <span style={{ fontSize: 13, color: '#795548', fontWeight: 500 }}>
              Authorised personnel only
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: '#FFEBEE',
              border: '1.5px solid #FFCDD2',
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20
            }}>
              <AlertCircle size={15} color="#C62828" />
              <span style={{ fontSize: 13, color: '#C62828', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8A8A8A' }} />
                <input
                  className="input"
                  type="email"
                  placeholder="admin@rozgarkashmir.in"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8A8A8A' }} />
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  style={{ paddingLeft: 38, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A8A8A' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading ? '#E8DDD0' : 'linear-gradient(135deg, #1A3A5C, #254D7A)',
                color: loading ? '#8A8A8A' : 'white',
                border: 'none',
                borderRadius: 10,
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 700,
                fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: '0.2s',
                marginTop: 4
              }}
            >
              <Shield size={17} />
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <a href="/" style={{ fontSize: 13, color: '#8A8A8A', textDecoration: 'none' }}>
              ← Back to RozgarKashmir
            </a>
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 20 }}>
          All admin activity is logged and monitored
        </p>
      </div>
    </div>
  );
}
