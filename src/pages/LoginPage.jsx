import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../utils/api';
import { LogIn, Mail, Lock, Briefcase } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#F8F6F1 0%,#E8F5E9 100%)', padding:24 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, background:'linear-gradient(135deg,#1B4332,#2D6A4F)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <Briefcase size={28} color="#F4A261" />
          </div>
          <h1 style={{ fontSize:28, marginBottom:6 }}>Welcome Back</h1>
          <p style={{ color:'#6B7280' }}>Sign in to your RozgarKashmir account</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          {error && (
            <div style={{ background:'#FEE2E2', border:'1px solid #FCA5A5', borderRadius:8, padding:'12px 16px', marginBottom:20, color:'#DC2626', fontSize:14 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} style={{ paddingLeft:38 }} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
                <input className="form-input" type="password" placeholder="Enter password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} style={{ paddingLeft:38 }} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <div className="spinner" style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%' }} /> : <LogIn size={18} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:24, fontSize:14, color:'#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#1B4332', fontWeight:700 }}>Register here</Link>
          </div>

          {/* Demo credentials */}
         
        </div>
      </div>
    </div>
  );
}
