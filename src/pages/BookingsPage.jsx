import React, { useState, useEffect, useCallback } from 'react';
import { getBookings, updateBookingStatus, addReview } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Star, MapPin, Calendar } from 'lucide-react';

function StatusBadge({ status }) {
  const map = { pending:'badge-warning', accepted:'badge-info', rejected:'badge-danger', in_progress:'badge-info', completed:'badge-success', cancelled:'badge-danger' };
  return <span className={`badge ${map[status]||'badge-gray'}`}>{status?.replace('_',' ')}</span>;
}

function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:20 }}>
      <div className="card" style={{ maxWidth:400, width:'100%', padding:28 }}>
        <h3 style={{ marginBottom:20 }}>Rate {booking.worker?.user?.name}</h3>
        <div style={{ display:'flex', gap:8, marginBottom:20, justifyContent:'center' }}>
          {[1,2,3,4,5].map(i => (
            <button key={i} onClick={() => setRating(i)} style={{ fontSize:32, background:'none', border:'none', color: i<=rating ? '#F59E0B':'#E5E7EB', cursor:'pointer' }}>★</button>
          ))}
        </div>
        <div className="form-group" style={{ marginBottom:20 }}>
          <label className="form-label">Comment (optional)</label>
          <textarea className="form-input" rows={3} placeholder="How was the work?" value={comment} onChange={e => setComment(e.target.value)} style={{ resize:'vertical' }} />
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex:1 }} onClick={() => onSubmit(booking._id, rating, comment)}>Submit Review</button>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [reviewBooking, setReviewBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBookings(filter ? { status: filter } : {});
      setBookings(res.data.bookings);
    } catch(e) { console.error(e); }
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
    } catch(e) { alert(e.response?.data?.message || 'Error updating status'); }
  };

  const handleReview = async (id, rating, comment) => {
    try {
      await addReview(id, { rating, comment });
      setReviewBooking(null);
      fetchBookings();
    } catch(e) { alert('Failed to submit review'); }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:'clamp(1.4rem,3vw,2rem)' }}>Bookings</h1>
            <p style={{ color:'#6B7280' }}>Manage your booking requests</p>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['','pending','accepted','completed','cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter===s?'btn-primary':'btn-ghost'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:120 }} />)}
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#9CA3AF' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
            <h3 style={{ color:'#374151', marginBottom:8 }}>No bookings found</h3>
            <p>Bookings will appear here once created.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {bookings.map(b => {
              const workerUser = b.worker?.user || {};
              const employerName = b.employer?.name || 'Employer';
              return (
                <div key={b._id} className="card fade-in" style={{ padding:24 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:16 }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                        <h3 style={{ fontSize:17 }}>{b.jobTitle}</h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <p style={{ fontSize:13, color:'#6B7280' }}>{b.jobDescription}</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:20, color:'#1B4332' }}>₹{b.agreedRate}<span style={{ fontSize:12, fontWeight:400, color:'#9CA3AF' }}>/day</span></div>
                    </div>
                  </div>

                  <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:16, fontSize:13, color:'#6B7280' }}>
                    {user.role === 'employer' ? (
                      <span style={{ display:'flex', alignItems:'center', gap:5 }}><span>👤</span>{workerUser.name}</span>
                    ) : (
                      <span style={{ display:'flex', alignItems:'center', gap:5 }}><span>🏢</span>{employerName}</span>
                    )}
                    <span style={{ display:'flex', alignItems:'center', gap:5 }}><Calendar size={13} />{new Date(b.startDate).toLocaleDateString()}</span>
                    {b.location?.district && <span style={{ display:'flex', alignItems:'center', gap:5 }}><MapPin size={13} />{b.location.district}</span>}
                    <span>Duration: {b.duration || '—'}</span>
                    {b.category && <span className="badge badge-gray">{b.category}</span>}
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    {/* Worker actions */}
                    {user.role === 'worker' && b.status === 'pending' && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => handleStatus(b._id, 'accepted')}><CheckCircle size={14} />Accept</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleStatus(b._id, 'rejected')}><XCircle size={14} />Reject</button>
                      </>
                    )}
                    {/* Employer actions */}
                    {user.role === 'employer' && b.status === 'accepted' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleStatus(b._id, 'completed')}><CheckCircle size={14} />Mark Completed</button>
                    )}
                    {user.role === 'employer' && ['pending','accepted'].includes(b.status) && (
                      <button className="btn btn-ghost btn-sm" style={{ color:'#DC2626' }} onClick={() => handleStatus(b._id, 'cancelled')}><XCircle size={14} />Cancel</button>
                    )}
                    {user.role === 'employer' && b.status === 'completed' && !b.workerRating && (
                      <button className="btn btn-accent btn-sm" onClick={() => setReviewBooking(b)}><Star size={14} />Leave Review</button>
                    )}
                    {b.workerRating && (
                      <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, color:'#F59E0B', fontWeight:600 }}>
                        {'★'.repeat(b.workerRating)} Reviewed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {reviewBooking && (
        <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} onSubmit={handleReview} />
      )}
    </div>
  );
}
