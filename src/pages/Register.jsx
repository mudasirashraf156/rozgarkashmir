import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SKILLS = ['Carpenter', 'Plumber', 'Electrician', 'Painter', 'Mason', 'Gardener', 'Driver', 'Cook', 'Welder', 'Tailor', 'Security Guard', 'General Labour'];
const DISTRICTS = ['Srinagar', 'Ganderbal', 'Budgam', 'Pulwama', 'Shopian', 'Kulgam', 'Anantnag', 'Islamabad', 'Baramulla', 'Kupwara', 'Bandipora', 'Sopore'];

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'employer',
    district: '', area: '',
    primarySkill: '', skills: [], experience: 0, dailyRate: 500, bio: ''
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = (s) => {
    setForm(f => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role,
        location: { district: form.district, area: form.area },
        ...(form.role === 'worker' ? {
          primarySkill: form.primarySkill, skills: form.skills,
          experience: form.experience, dailyRate: form.dailyRate, bio: form.bio
        } : {})
      };
      const res = await register(payload);
      loginUser(res.data.token, res.data.user);
      toast.success('Registration successful! Welcome to RozgarKashmir 🎉');
      navigate(form.role === 'worker' ? '/worker-dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = form.role === 'worker' ? 3 : 2;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFFAF5, #FFF3E0)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #FF6B00, #FF8C38)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 4px 16px rgba(255,107,0,0.3)' }}>
            <span style={{ color: 'white', fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 24 }}>R</span>
          </div>
          <h1 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 24, color: '#1A3A5C' }}>Create Account</h1>
          <p style={{ color: '#8A8A8A', fontSize: 14 }}>Join RozgarKashmir today</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? '#FF6B00' : '#E8DDD0', transition: '0.3s' }}/>
          ))}
        </div>

        <div className="card" style={{ padding: 28 }}>
          {/* Step 1: Role + Basic */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ fontFamily: "'Baloo 2'", fontSize: 18, marginBottom: 4 }}>I want to...</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { val: 'worker', emoji: '👷', title: 'Find Work', desc: 'Register as a labourer/gig worker' },
                  { val: 'employer', emoji: '🏠', title: 'Hire Workers', desc: 'Find skilled workers for my needs' }
                ].map(({ val, emoji, title, desc }) => (
                  <button key={val} onClick={() => set('role', val)}
                    style={{ padding: '16px 12px', borderRadius: 12, border: `2px solid ${form.role === val ? '#FF6B00' : '#E8DDD0'}`,
                      background: form.role === val ? '#FFF3E0' : 'white', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</div>
                    <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#1A3A5C', marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 12, color: '#8A8A8A' }}>{desc}</div>
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="input" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input className="input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
              </div>

              <button onClick={() => {
                if (!form.name || !form.email || !form.phone || !form.password) return toast.error('Fill all fields');
                if (form.password.length < 6) return toast.error('Password too short');
                setStep(2);
              }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }}>
                Next →
              </button>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ fontFamily: "'Baloo 2'", fontSize: 18, marginBottom: 4 }}>📍 Your Location</h2>
              <div className="form-group">
                <label className="form-label">District *</label>
                <select className="select" value={form.district} onChange={e => set('district', e.target.value)}>
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Area / Mohalla</label>
                <input className="input" placeholder="e.g. Lal Chowk, Rajbagh..." value={form.area} onChange={e => set('area', e.target.value)} />
              </div>

              {form.role !== 'worker' && (
                <div style={{ background: '#E8F5E9', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#2E7D32', marginBottom: 4 }}>🎉 You're almost done!</div>
                  <p style={{ fontSize: 13, color: '#2E7D32' }}>Click Register to create your employer account and start hiring.</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                {form.role === 'worker' ? (
                  <button onClick={() => { if (!form.district) return toast.error('Select district'); setStep(3); }}
                    className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Next →</button>
                ) : (
                  <button onClick={handleSubmit} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
                    {loading ? 'Creating...' : '✓ Register'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Worker Skills (workers only) */}
          {step === 3 && form.role === 'worker' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ fontFamily: "'Baloo 2'", fontSize: 18, marginBottom: 4 }}>🛠️ Your Skills</h2>
              <div className="form-group">
                <label className="form-label">Primary Skill *</label>
                <select className="select" value={form.primarySkill} onChange={e => set('primarySkill', e.target.value)}>
                  <option value="">Select main skill</option>
                  {SKILLS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">All Skills (select multiple)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {SKILLS.map(s => (
                    <button key={s} type="button" onClick={() => toggleSkill(s)}
                      style={{ padding: '5px 12px', borderRadius: 20, fontSize: 13, border: '1.5px solid', cursor: 'pointer', transition: '0.15s',
                        background: form.skills.includes(s) ? '#FF6B00' : 'white',
                        color: form.skills.includes(s) ? 'white' : '#4A4A4A',
                        borderColor: form.skills.includes(s) ? '#FF6B00' : '#E8DDD0'
                      }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Experience (years)</label>
                  <input className="input" type="number" min="0" max="50" value={form.experience} onChange={e => set('experience', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Daily Rate (₹)</label>
                  <input className="input" type="number" min="100" value={form.dailyRate} onChange={e => set('dailyRate', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">About Yourself</label>
                <textarea className="textarea" placeholder="Tell employers about your experience..." value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} />
              </div>
              <div style={{ background: '#FFF3E0', borderRadius: 10, padding: 12, fontSize: 13, color: '#D45500' }}>
                ℹ️ Your profile will be reviewed by our team and verified within 24 hours.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(2)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                <button onClick={handleSubmit} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Creating...' : '✓ Register'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#8A8A8A', fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: '#FF6B00', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
