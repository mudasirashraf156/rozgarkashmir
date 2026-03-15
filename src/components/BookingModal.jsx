import React, { useState } from 'react';
import { X, Calendar, MapPin, IndianRupee, Briefcase } from 'lucide-react';
import { createBooking } from '../utils/api';
import toast from 'react-hot-toast';

const DISTRICTS = ['Srinagar', 'Ganderbal', 'Budgam', 'Pulwama', 'Shopian', 'Kulgam', 'Anantnag', 'Islamabad', 'Baramulla', 'Kupwara', 'Bandipora', 'Sopore'];
const CATEGORIES = ['Construction', 'Electrical Work', 'Plumbing', 'Painting', 'Carpentry', 'Gardening', 'Cleaning', 'Driving', 'Cooking', 'Security', 'General Labour', 'Other'];

export default function BookingModal({ worker, onClose, onSuccess }) {
  const [form, setForm] = useState({
    jobTitle: '',
    jobDescription: '',
    category: '',
    startDate: '',
    endDate: '',
    duration: '1 day',
    agreedRate: worker.dailyRate,
    location: { address: '', district: '', area: '' }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('loc_')) {
      setForm(f => ({ ...f, location: { ...f.location, [name.slice(4)]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jobTitle || !form.category || !form.startDate || !form.location.district) {
      return toast.error('Please fill all required fields');
    }
    setLoading(true);
    try {
      await createBooking({ ...form, workerId: worker._id });
      toast.success('Booking request sent! Worker will respond shortly.');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)'
    }}>
      <div style={{ background: 'white', borderRadius: 16, maxWidth: 540, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1.5px solid #E8DDD0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, color: '#1A3A5C', fontSize: 18 }}>Book {worker.user?.name}</h3>
            <p style={{ color: '#8A8A8A', fontSize: 13 }}>{worker.primarySkill} · ₹{worker.dailyRate}/day</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#4A4A4A"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input className="input" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g. Paint 2 rooms" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="select" name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Agreed Rate (₹/day) *</label>
              <input className="input" type="number" name="agreedRate" value={form.agreedRate} onChange={handleChange} min="100" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input className="input" type="date" name="startDate" value={form.startDate} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]} required />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="input" type="date" name="endDate" value={form.endDate} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">District *</label>
              <select className="select" name="loc_district" value={form.location.district} onChange={handleChange} required>
                <option value="">Select District</option>
                {DISTRICTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Area / Mohalla</label>
              <input className="input" name="loc_area" value={form.location.area} onChange={handleChange} placeholder="e.g. Lal Chowk" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea className="textarea" name="jobDescription" value={form.jobDescription} onChange={handleChange}
              placeholder="Describe the work in detail..." rows={3} />
          </div>

          {/* Summary box */}
          <div style={{ background: '#FFF8F0', border: '1.5px solid #FFD9B0', borderRadius: 10, padding: 14 }}>
            <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#FF6B00', marginBottom: 6, fontSize: 14 }}>📋 Booking Summary</div>
            <div style={{ fontSize: 13, color: '#4A4A4A', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>Worker: <strong>{worker.user?.name}</strong></span>
              <span>Rate: <strong>₹{form.agreedRate}/day</strong></span>
              {form.startDate && <span>Starting: <strong>{new Date(form.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</strong></span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Sending...' : '✓ Send Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
