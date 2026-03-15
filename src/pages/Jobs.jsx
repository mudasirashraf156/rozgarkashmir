import React, { useState, useEffect } from 'react';
import { getJobs, createJob, applyToJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, IndianRupee, Clock, Plus, X, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Construction', 'Electrical Work', 'Plumbing', 'Painting', 'Carpentry', 'Gardening', 'Cleaning', 'Driving', 'Cooking', 'Security', 'General Labour', 'Other'];
const DISTRICTS = ['Srinagar', 'Ganderbal', 'Budgam', 'Pulwama', 'Shopian', 'Kulgam', 'Anantnag', 'Islamabad', 'Baramulla', 'Kupwara', 'Bandipora', 'Sopore'];

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ category: '', district: '', urgent: '' });
  const [form, setForm] = useState({ title: '', description: '', category: '', payAmount: '', payType: 'daily', district: '', area: '', isUrgent: false, workersNeeded: 1, startDate: '' });
  const [posting, setPosting] = useState(false);

  const load = async (f = filters) => {
    setLoading(true);
    try {
      const res = await getJobs({ ...f, limit: 20 });
      setJobs(res.data.jobs);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleFilter = (k, v) => {
    const updated = { ...filters, [k]: v };
    setFilters(updated);
    load(updated);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.payAmount || !form.district) return toast.error('Fill required fields');
    setPosting(true);
    try {
      await createJob({ ...form, location: { district: form.district, area: form.area } });
      toast.success('Job posted!');
      setShowForm(false);
      setForm({ title: '', description: '', category: '', payAmount: '', payType: 'daily', district: '', area: '', isUrgent: false, workersNeeded: 1, startDate: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally { setPosting(false); }
  };

  const handleApply = async (id) => {
    try {
      await applyToJob(id);
      toast.success('Applied successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not apply');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">Job Board</h1>
            <p className="page-subtitle">Open job listings across Kashmir</p>
          </div>
          {user?.role === 'employer' && (
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Post a Job</>}
            </button>
          )}
        </div>

        {/* Post job form */}
        {showForm && (
          <div className="card" style={{ marginBottom: 24, padding: 24 }}>
            <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, marginBottom: 18 }}>📝 Post a New Job</h3>
            <form onSubmit={handlePost} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Job Title *</label>
                <input className="input" placeholder="e.g. Need a plumber for bathroom repair" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">District *</label>
                <select className="select" value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}>
                  <option value="">Select</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Area</label>
                <input className="input" placeholder="e.g. Rajbagh" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Pay Amount (₹) *</label>
                <input className="input" type="number" placeholder="500" value={form.payAmount} onChange={e => setForm(f => ({ ...f, payAmount: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Pay Type</label>
                <select className="select" value={form.payType} onChange={e => setForm(f => ({ ...f, payType: e.target.value }))}>
                  <option value="daily">Per Day</option>
                  <option value="hourly">Per Hour</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Workers Needed</label>
                <input className="input" type="number" min="1" value={form.workersNeeded} onChange={e => setForm(f => ({ ...f, workersNeeded: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input className="input" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="textarea" rows={3} placeholder="Describe the job..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 16, alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                  <input type="checkbox" checked={form.isUrgent} onChange={e => setForm(f => ({ ...f, isUrgent: e.target.checked }))} />
                  🔥 Mark as Urgent
                </label>
                <button type="submit" className="btn btn-primary" disabled={posting}>{posting ? 'Posting...' : 'Post Job'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <select className="select" style={{ flex: 1, minWidth: 140 }} value={filters.category} onChange={e => handleFilter('category', e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="select" style={{ flex: 1, minWidth: 140 }} value={filters.district} onChange={e => handleFilter('district', e.target.value)}>
            <option value="">All Districts</option>
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <button className={`btn btn-sm ${filters.urgent ? 'btn-primary' : 'btn-ghost'}`} onClick={() => handleFilter('urgent', filters.urgent ? '' : 'true')}>
            🔥 Urgent Only
          </button>
        </div>

        {/* Jobs list */}
        {loading ? <div className="loading-screen"><div className="spinner"/></div> : jobs.length === 0 ? (
          <div className="empty-state"><div style={{ fontSize: 48 }}>📋</div><h3>No jobs found</h3><p>Try clearing filters</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {jobs.map(j => (
              <div key={j._id} className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                      <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 17, color: '#1A3A5C' }}>{j.title}</h3>
                      {j.isUrgent && <span style={{ background: '#FFEBEE', color: '#C62828', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={11} fill="#C62828"/>Urgent</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#4A4A4A', marginBottom: 8 }}>
                      <span style={{ background: '#FFF3E0', color: '#D45500', padding: '2px 10px', borderRadius: 8, fontWeight: 600 }}>{j.category}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} color="#FF6B00"/> {j.location?.area && `${j.location.area}, `}{j.location?.district}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IndianRupee size={13} color="#FF6B00"/> ₹{j.payAmount}/{j.payType}</span>
                      {j.startDate && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13}/> {new Date(j.startDate).toLocaleDateString('en-IN')}</span>}
                    </div>
                    {j.description && <p style={{ color: '#8A8A8A', fontSize: 14 }}>{j.description}</p>}
                    <div style={{ fontSize: 12, color: '#8A8A8A', marginTop: 6 }}>
                      Posted by <strong>{j.employer?.name}</strong> · {j.applicants?.length || 0} applicants · {new Date(j.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  {user?.role === 'worker' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleApply(j._id)}>Apply Now</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
