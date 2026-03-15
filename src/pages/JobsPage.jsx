import React, { useState, useEffect, useCallback } from 'react';
import { getJobs, createJob, applyToJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Zap, Plus, X } from 'lucide-react';

const CATEGORIES = ['Construction','Carpentry','Electrical','Plumbing','Painting','Driving','Cooking','Cleaning','Gardening','Welding','Tailoring','Other'];
const DISTRICTS = ['Srinagar','Baramulla','Anantnag','Pulwama','Kupwara','Sopore','Budgam','Ganderbal'];

function JobCard({ job, onApply, user }) {
  const [applied, setApplied] = useState(false);
  const handleApply = async () => {
    await onApply(job._id);
    setApplied(true);
  };
  return (
    <div className="card fade-in" style={{ padding:0, overflow:'hidden' }}>
      {job.isUrgent && (
        <div style={{ background:'#FEF3C7', borderBottom:'1px solid #FCD34D', padding:'6px 16px', display:'flex', alignItems:'center', gap:6 }}>
          <Zap size={13} color="#D97706" /><span style={{ fontSize:12, fontWeight:700, color:'#92400E' }}>URGENT HIRING</span>
        </div>
      )}
      <div style={{ padding:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div>
            <h3 style={{ fontSize:16, marginBottom:4 }}>{job.title}</h3>
            <span className="badge badge-gray">{job.category}</span>
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:18, color:'#1B4332' }}>₹{job.payAmount}</div>
            <div style={{ fontSize:11, color:'#9CA3AF' }}>/{job.payType}</div>
          </div>
        </div>
        <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.6, marginBottom:12 }}>{job.description}</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:12, fontSize:13, color:'#9CA3AF', marginBottom:14 }}>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={13} />{job.location?.district}</span>
          {job.duration && <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={13} />{job.duration}</span>}
          <span>👥 {job.workersNeeded} worker{job.workersNeeded > 1 ? 's' : ''} needed</span>
        </div>
        {job.skills?.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
            {job.skills.map(s => <span key={s} style={{ background:'#F8F6F1', border:'1px solid #E5E0D5', borderRadius:20, padding:'2px 10px', fontSize:12 }}>{s}</span>)}
          </div>
        )}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#9CA3AF' }}>{job.applicants?.length || 0} applied</span>
          {user?.role === 'worker' && (
            <button onClick={handleApply} disabled={applied} className={`btn btn-sm ${applied?'btn-ghost':'btn-primary'}`}>
              {applied ? '✓ Applied' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PostJobModal({ onClose, onPost }) {
  const [form, setForm] = useState({ title:'', description:'', category:'', district:'', area:'', payType:'daily', payAmount:'', duration:'', workersNeeded:1, isUrgent:false, skills:[] });
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await onPost({ ...form, location: { district:form.district, area:form.area }, payAmount: Number(form.payAmount), workersNeeded: Number(form.workersNeeded) });
      onClose();
    } catch(e) { alert(e.response?.data?.message || 'Failed to post job'); }
    setLoading(false);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:20, overflowY:'auto' }}>
      <div className="card" style={{ width:'100%', maxWidth:540, padding:28, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
          <h3>Post a Job</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9CA3AF' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input className="form-input" placeholder="e.g. Need electrician for house wiring" value={form.title} onChange={e => setForm({...form,title:e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input form-select" value={form.category} onChange={e => setForm({...form,category:e.target.value})} required>
              <option value="">Select</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} placeholder="Describe the work in detail..." value={form.description} onChange={e => setForm({...form,description:e.target.value})} required style={{ resize:'vertical' }} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">District</label>
              <select className="form-input form-select" value={form.district} onChange={e => setForm({...form,district:e.target.value})} required>
                <option value="">Select</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Area</label>
              <input className="form-input" placeholder="e.g. Lal Chowk" value={form.area} onChange={e => setForm({...form,area:e.target.value})} />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Pay Type</label>
              <select className="form-input form-select" value={form.payType} onChange={e => setForm({...form,payType:e.target.value})}>
                <option value="daily">Daily</option>
                <option value="hourly">Hourly</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Pay Amount (₹)</label>
              <input className="form-input" type="number" placeholder="700" value={form.payAmount} onChange={e => setForm({...form,payAmount:e.target.value})} required />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input className="form-input" placeholder="e.g. 3 days" value={form.duration} onChange={e => setForm({...form,duration:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Workers Needed</label>
              <input className="form-input" type="number" min={1} value={form.workersNeeded} onChange={e => setForm({...form,workersNeeded:e.target.value})} />
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <input type="checkbox" id="urgent" checked={form.isUrgent} onChange={e => setForm({...form,isUrgent:e.target.checked})} />
            <label htmlFor="urgent" style={{ fontSize:14, fontWeight:500, cursor:'pointer' }}>Mark as Urgent</label>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPost, setShowPost] = useState(false);
  const [filter, setFilter] = useState({ category:'', district:'' });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobs(Object.fromEntries(Object.entries(filter).filter(([,v])=>v)));
      setJobs(res.data.jobs);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [filter]);

  const handleApply = async (id) => {
    if (!user) { navigate('/login'); return; }
    try { await applyToJob(id); } catch(e) { alert(e.response?.data?.message || 'Apply failed'); }
  };

  const handlePost = async (data) => {
    await createJob(data);
    fetchJobs();
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:'clamp(1.4rem,3vw,2rem)' }}>Job Postings</h1>
            <p style={{ color:'#6B7280' }}>Browse available jobs in Kashmir</p>
          </div>
          {user?.role === 'employer' && (
            <button className="btn btn-accent" onClick={() => setShowPost(true)}><Plus size={16} />Post a Job</button>
          )}
          {!user && (
            <button className="btn btn-primary" onClick={() => navigate('/register?role=employer')}><Plus size={16} />Post a Job</button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
          <select className="form-input form-select" value={filter.category} onChange={e => setFilter({...filter,category:e.target.value})} style={{ minWidth:160 }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-input form-select" value={filter.district} onChange={e => setFilter({...filter,district:e.target.value})} style={{ minWidth:160 }}>
            <option value="">All Districts</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid-2">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:200 }} />)}</div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#9CA3AF' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>💼</div>
            <h3 style={{ color:'#374151' }}>No jobs posted yet</h3>
            <p>Check back soon or post your own job</p>
          </div>
        ) : (
          <div className="grid-2">
            {jobs.map(j => <JobCard key={j._id} job={j} onApply={handleApply} user={user} />)}
          </div>
        )}
      </div>

      {showPost && <PostJobModal onClose={() => setShowPost(false)} onPost={handlePost} />}
    </div>
  );
}
