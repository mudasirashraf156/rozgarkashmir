import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, updateBookingStatus, addReview, getMyJobs } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, CheckCircle, Clock, Star, Briefcase, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: { bg: '#FFF3E0', color: '#F57C00', label: '⏳ Pending' },
  accepted: { bg: '#E3F2FD', color: '#1565C0', label: '✅ Accepted' },
  rejected: { bg: '#FFEBEE', color: '#C62828', label: '❌ Rejected' },
  in_progress: { bg: '#E8F5E9', color: '#2E7D32', label: '🔧 In Progress' },
  completed: { bg: '#E8F5E9', color: '#2E7D32', label: '🎉 Completed' },
  cancelled: { bg: '#F5F5F5', color: '#9E9E9E', label: '🚫 Cancelled' }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setTab] = useState('bookings');
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, jRes] = await Promise.all([getBookings(), getMyJobs()]);
      setBookings(bRes.data.bookings);
      setJobs(jRes.data.jobs);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await updateBookingStatus(id, 'cancelled');
      toast.success('Booking cancelled');
      load();
    } catch { toast.error('Failed to cancel'); }
  };

  const handleReview = async () => {
    try {
      await addReview(reviewModal, reviewData);
      toast.success('Review submitted!');
      setReviewModal(null);
      load();
    } catch { toast.error('Failed to submit review'); }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    active: bookings.filter(b => ['accepted', 'in_progress'].includes(b.status)).length
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">My Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.name?.split(' ')[0]}!</p>
          </div>
          <Link to="/workers" className="btn btn-primary"><Plus size={15}/> Book a Worker</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Bookings', val: stats.total, icon: <Calendar size={20}/>, color: '#1A3A5C' },
            { label: 'Pending', val: stats.pending, icon: <Clock size={20}/>, color: '#F57C00' },
            { label: 'Active', val: stats.active, icon: <Users size={20}/>, color: '#1565C0' },
            { label: 'Completed', val: stats.completed, icon: <CheckCircle size={20}/>, color: '#2E7D32' }
          ].map(({ label, val, icon, color }) => (
            <div key={label} className="card" style={{ padding: '18px 20px', borderLeft: `4px solid ${color}` }}>
              <div style={{ color, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 26, color }}>{val}</div>
              <div style={{ color: '#8A8A8A', fontSize: 13 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #E8DDD0', marginBottom: 24 }}>
          {[['bookings', 'My Bookings'], ['jobs', 'My Job Posts']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 15,
              color: activeTab === val ? '#FF6B00' : '#8A8A8A',
              borderBottom: `3px solid ${activeTab === val ? '#FF6B00' : 'transparent'}`,
              marginBottom: -2, transition: '0.2s'
            }}>{label}</button>
          ))}
        </div>

        {loading ? <div className="loading-screen"><div className="spinner"/></div> : (
          <>
            {/* Bookings tab */}
            {activeTab === 'bookings' && (
              bookings.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: 48 }}>📋</div>
                  <h3>No bookings yet</h3>
                  <p>Find and book a worker to get started</p>
                  <Link to="/workers" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Workers</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {bookings.map(b => {
                    const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
                    const workerUser = b.worker?.user;
                    return (
                      <div key={b._id} className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                              <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 16, color: '#1A3A5C' }}>{b.jobTitle}</h3>
                              <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                            </div>
                            <p style={{ color: '#4A4A4A', fontSize: 14 }}>Worker: <strong>{workerUser?.name}</strong> · {workerUser?.phone}</p>
                            <p style={{ color: '#8A8A8A', fontSize: 13 }}>
                              {b.location?.district} · {new Date(b.startDate).toLocaleDateString('en-IN')} · ₹{b.agreedRate}/day
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {b.status === 'completed' && !b.workerRating && (
                              <button className="btn btn-sm" onClick={() => setReviewModal(b._id)}
                                style={{ background: '#FFF3E0', color: '#FF6B00', border: '1.5px solid #FFD9B0' }}>
                                <Star size={13}/> Rate
                              </button>
                            )}
                            {['pending', 'accepted'].includes(b.status) && (
                              <button className="btn btn-sm btn-ghost" onClick={() => handleCancel(b._id)} style={{ color: '#C62828', borderColor: '#FFCDD2' }}>
                                <X size={13}/> Cancel
                              </button>
                            )}
                          </div>
                        </div>
                        {b.workerRating && (
                          <div style={{ marginTop: 10, display: 'flex', gap: 3 }}>
                            {[1,2,3,4,5].map(s => <Star key={s} size={14} color="#F59E0B" fill={s <= b.workerRating ? "#F59E0B" : "none"}/>)}
                            <span style={{ fontSize: 13, color: '#8A8A8A', marginLeft: 6 }}>{b.workerReview}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Jobs tab */}
            {activeTab === 'jobs' && (
              jobs.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: 48 }}>📝</div>
                  <h3>No job posts yet</h3>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {jobs.map(j => (
                    <div key={j._id} className="card" style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#1A3A5C' }}>{j.title}</h3>
                            {j.isUrgent && <span className="badge badge-danger">🔥 Urgent</span>}
                            <span className={`badge ${j.status === 'open' ? 'badge-success' : 'badge-muted'}`}>{j.status}</span>
                          </div>
                          <p style={{ color: '#8A8A8A', fontSize: 13 }}>{j.category} · {j.location?.district} · ₹{j.payAmount}/{j.payType}</p>
                        </div>
                        <span style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#FF6B00', fontSize: 15 }}>
                          {j.applicants?.length || 0} applicants
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="card" style={{ maxWidth: 400, width: '100%', padding: 28 }}>
            <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, marginBottom: 16 }}>Rate this Worker</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setReviewData(r => ({ ...r, rating: s }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <Star size={28} color="#F59E0B" fill={s <= reviewData.rating ? "#F59E0B" : "none"}/>
                </button>
              ))}
            </div>
            <textarea className="textarea" placeholder="Share your experience..." value={reviewData.comment}
              onChange={e => setReviewData(r => ({ ...r, comment: e.target.value }))} rows={3} style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" onClick={() => setReviewModal(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleReview} style={{ flex: 2, justifyContent: 'center' }}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
