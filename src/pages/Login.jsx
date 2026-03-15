import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
      const role = res.data.user.role;
      navigate(role === 'admin' ? '/admin' : role === 'worker' ? '/worker-dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFFAF5, #FFF3E0)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #FF6B00, #FF8C38)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 4px 16px rgba(255,107,0,0.3)' }}>
            <span style={{ color: 'white', fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 24 }}>R</span>
          </div>
          <h1 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 24, color: '#1A3A5C' }}>Welcome Back</h1>
          <p style={{ color: '#8A8A8A', fontSize: 14 }}>Sign in to your RozgarKashmir account</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required style={{ paddingRight: 42 }}/>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A8A8A' }}>
                  {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 16 }} disabled={loading}>
              <LogIn size={17}/> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ background: '#F8F9FA', borderRadius: 10, padding: 14, marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', marginBottom: 8 }}>DEMO ACCOUNTS</div>
            {[
              { role: 'Admin', email: 'admin@rozgarkashmir.in', pass: 'admin123' },
              { role: 'Employer', email: 'employer@test.com', pass: 'pass123' },
              { role: 'Worker', email: 'worker@test.com', pass: 'pass123' }
            ].map(({ role, email, pass }) => (
              <button key={role} onClick={() => setForm({ email, password: pass })}
                style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: '#FF6B00', fontWeight: 600 }}>{role}:</span>{' '}
                <span style={{ color: '#4A4A4A' }}>{email}</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#8A8A8A', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#FF6B00', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
