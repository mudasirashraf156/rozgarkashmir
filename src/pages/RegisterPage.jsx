import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../utils/api';
import { UserPlus, Briefcase, HardHat } from 'lucide-react';

const DISTRICTS = ['Srinagar','Baramulla','Anantnag','Pulwama','Kupwara','Sopore','Budgam','Ganderbal','Kulgam','Shopian','Bandipora','Handwara'];
const SKILLS = ['Carpenter','Electrician','Plumber','Painter','Mason','Driver','Cook','Cleaner','Gardner','Welder','Tailor','Blacksmith','Mechanic','Helper','Security Guard'];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'employer');
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', district:'', area:'', primarySkill:'', skills:[], dailyRate:'', experience:'', bio:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const toggleSkill = (skill) => {
    setForm(f => ({ ...f, skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = { ...form, role, location: { district: form.district, area: form.area }, skills: role === 'worker' ? form.skills : undefined };
      const res = await register(payload);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#F8F6F1,#E8F5E9)', padding:24 }}>
      <div style={{ width:'100%', maxWidth:520 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <h1 style={{ fontSize:26 }}>Create Account</h1>
          <p style={{ color:'#6B7280', marginTop:4 }}>Join RozgarKashmir today — it's free</p>
        </div>

        {/* Role selector */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
          {[
            { value:'employer', icon:<Briefcase size={22} />, label:'I need workers', sub:'Post jobs & hire' },
            { value:'worker', icon:<HardHat size={22} />, label:'I want work', sub:'Find jobs nearby' },
          ].map(r => (
            <button key={r.value} type="button" onClick={() => setRole(r.value)} style={{ padding:16, borderRadius:12, border:`2px solid ${role===r.value?'#1B4332':'#E5E0D5'}`, background:role===r.value?'#D1FAE5':'white', cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}>
              <div style={{ color:role===r.value?'#1B4332':'#6B7280', marginBottom:6 }}>{r.icon}</div>
              <div style={{ fontWeight:700, fontSize:15, color:role===r.value?'#1B4332':'#374151' }}>{r.label}</div>
              <div style={{ fontSize:12, color:'#9CA3AF' }}>{r.sub}</div>
            </button>
          ))}
        </div>

        <div className="card" style={{ padding:32 }}>
          {error && <div style={{ background:'#FEE2E2', border:'1px solid #FCA5A5', borderRadius:8, padding:'12px 16px', marginBottom:20, color:'#DC2626', fontSize:14 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Step 1: Basic info */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Ali Hassan" value={form.name} onChange={e => setForm({...form,name:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="9876543210" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="ali@example.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form,password:e.target.value})} minLength={6} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">District</label>
                <select className="form-input form-select" value={form.district} onChange={e => setForm({...form,district:e.target.value})} required>
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Area / Mohalla</label>
                <input className="form-input" placeholder="Lal Chowk, Sopore..." value={form.area} onChange={e => setForm({...form,area:e.target.value})} />
              </div>
            </div>

            {/* Worker-specific fields */}
            {role === 'worker' && (
              <>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Primary Skill</label>
                    <select className="form-input form-select" value={form.primarySkill} onChange={e => setForm({...form,primarySkill:e.target.value})} required>
                      <option value="">Select Skill</option>
                      {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Daily Rate (₹)</label>
                    <input className="form-input" type="number" placeholder="500" value={form.dailyRate} onChange={e => setForm({...form,dailyRate:e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (years)</label>
                  <input className="form-input" type="number" placeholder="2" value={form.experience} onChange={e => setForm({...form,experience:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Skills (select all that apply)</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
                    {SKILLS.map(skill => (
                      <button key={skill} type="button" onClick={() => toggleSkill(skill)} style={{ padding:'5px 12px', borderRadius:20, border:`1.5px solid ${form.skills.includes(skill)?'#1B4332':'#E5E0D5'}`, background:form.skills.includes(skill)?'#D1FAE5':'white', color:form.skills.includes(skill)?'#1B4332':'#6B7280', fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">About You</label>
                  <textarea className="form-input" placeholder="Describe your experience, what work you do best..." value={form.bio} onChange={e => setForm({...form,bio:e.target.value})} rows={3} style={{ resize:'vertical' }} />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop:4 }}>
              {loading ? <div className="spinner" style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%' }} /> : <UserPlus size={18} />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'#6B7280' }}>
            Already have an account? <Link to="/login" style={{ color:'#1B4332', fontWeight:700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
