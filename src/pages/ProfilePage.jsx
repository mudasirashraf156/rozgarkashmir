import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updateWorkerProfile } from '../utils/api';
import { User, Save, CheckCircle } from 'lucide-react';

const DISTRICTS = ['Srinagar','Baramulla','Anantnag','Pulwama','Kupwara','Sopore','Budgam','Ganderbal'];
const SKILLS = ['Carpenter','Electrician','Plumber','Painter','Mason','Driver','Cook','Cleaner','Gardner','Welder','Tailor','Mechanic','Helper'];

export default function ProfilePage() {
  const { user, workerProfile, setWorkerProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ name: user?.name || '', phone: user?.phone || '', district: user?.location?.district || '', area: user?.location?.area || '' });
  const [workerData, setWorkerData] = useState({
    primarySkill: workerProfile?.primarySkill || '',
    dailyRate: workerProfile?.dailyRate || '',
    experience: workerProfile?.experience || 0,
    bio: workerProfile?.bio || '',
    skills: workerProfile?.skills || [],
  });

  const toggleSkill = (skill) => {
    setWorkerData(d => ({ ...d, skills: d.skills.includes(skill) ? d.skills.filter(s => s !== skill) : [...d.skills, skill] }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await updateProfile({ ...userData, location: { district: userData.district, area: userData.area } });
      if (user.role === 'worker') {
        const res = await updateWorkerProfile({ ...workerData, dailyRate: Number(workerData.dailyRate) });
        setWorkerProfile(res.data.worker);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(e) { alert('Failed to save profile'); }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:700 }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:'clamp(1.4rem,3vw,2rem)' }}>My Profile</h1>
          <p style={{ color:'#6B7280' }}>Update your account information</p>
        </div>

        {saved && (
          <div style={{ background:'#D1FAE5', border:'1px solid #6EE7B7', borderRadius:10, padding:'14px 20px', marginBottom:24, color:'#065F46', display:'flex', alignItems:'center', gap:10 }}>
            <CheckCircle size={18} />Profile updated successfully!
          </div>
        )}

        {/* Profile header */}
        <div className="card" style={{ marginBottom:20, display:'flex', alignItems:'center', gap:20, padding:24 }}>
          <div style={{ width:72, height:72, borderRadius:18, background:'linear-gradient(135deg,#1B4332,#2D6A4F)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'white', fontFamily:'Sora,sans-serif', flexShrink:0 }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize:20 }}>{user?.name}</h2>
            <p style={{ color:'#6B7280', fontSize:14 }}>{user?.email}</p>
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <span className={`badge ${user?.role==='worker'?'badge-success':'badge-info'}`}>{user?.role}</span>
              {user?.isVerified && <span className="badge badge-success">✓ Verified</span>}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Basic info */}
          <div className="card">
            <h3 style={{ marginBottom:20, display:'flex', alignItems:'center', gap:8 }}><User size={18} color="#1B4332" />Basic Information</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={userData.name} onChange={e => setUserData({...userData,name:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={userData.phone} onChange={e => setUserData({...userData,phone:e.target.value})} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">District</label>
                  <select className="form-input form-select" value={userData.district} onChange={e => setUserData({...userData,district:e.target.value})}>
                    <option value="">Select</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Area</label>
                  <input className="form-input" placeholder="Mohalla / Area" value={userData.area} onChange={e => setUserData({...userData,area:e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Worker details */}
          {user?.role === 'worker' && (
            <div className="card">
              <h3 style={{ marginBottom:20 }}>Worker Details</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Primary Skill</label>
                    <select className="form-input form-select" value={workerData.primarySkill} onChange={e => setWorkerData({...workerData,primarySkill:e.target.value})}>
                      <option value="">Select</option>
                      {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Daily Rate (₹)</label>
                    <input className="form-input" type="number" value={workerData.dailyRate} onChange={e => setWorkerData({...workerData,dailyRate:e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (years)</label>
                  <input className="form-input" type="number" value={workerData.experience} onChange={e => setWorkerData({...workerData,experience:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">About You</label>
                  <textarea className="form-input" rows={4} value={workerData.bio} onChange={e => setWorkerData({...workerData,bio:e.target.value})} placeholder="Tell employers about your experience and skills..." style={{ resize:'vertical' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Skills</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {SKILLS.map(skill => (
                      <button key={skill} type="button" onClick={() => toggleSkill(skill)} style={{ padding:'5px 14px', borderRadius:20, border:`1.5px solid ${workerData.skills.includes(skill)?'#1B4332':'#E5E0D5'}`, background:workerData.skills.includes(skill)?'#D1FAE5':'white', color:workerData.skills.includes(skill)?'#1B4332':'#6B7280', fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Saving...' : <><Save size={18} />Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
}
