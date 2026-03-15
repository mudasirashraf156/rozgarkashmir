import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorker, createBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Briefcase, Calendar, CheckCircle } from 'lucide-react';

const CATEGORIES = ['Construction','Carpentry','Electrical','Plumbing','Painting','Driving','Cooking','Cleaning','Gardening','Welding','Other'];

function StarRating({ rating }) {
  return <div className="stars">{[1,2,3,4,5].map(i => <span key={i} className={i<=Math.round(rating)?'star':'star-empty'}>★</span>)}</div>;
}

export default function WorkerDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking] = useState({ jobTitle:'', jobDescription:'', category:'', startDate:'', duration:'1 day', agreedRate:'', address:'', district:'' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getWorker(id).then(res => { setWorker(res.data.worker); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setBookingLoading(true); setError('');
    try {
      await createBooking({ workerId: worker._id, ...booking, location: { address:booking.address, district:booking.district }, agreedRate: Number(booking.agreedRate) });
      setSuccess('Booking request sent! The worker will confirm shortly.');
      setShowBooking(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    }
    setBookingLoading(false);
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner" style={{ width:40, height:40, border:'4px solid #E5E0D5', borderTopColor:'#1B4332', borderRadius:'50%' }} /></div>;
  if (!worker) return <div style={{ textAlign:'center', padding:80 }}><h2>Worker not found</h2></div>;

  const u = worker.user || {};

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:900 }}>
        {success && <div style={{ background:'#D1FAE5', border:'1px solid #6EE7B7', borderRadius:10, padding:'14px 20px', marginBottom:24, color:'#065F46', display:'flex', alignItems:'center', gap:10 }}><CheckCircle size={18} />{success}</div>}
        {error && <div style={{ background:'#FEE2E2', border:'1px solid #FCA5A5', borderRadius:10, padding:'14px 20px', marginBottom:24, color:'#DC2626' }}>{error}</div>}

        <div className="grid-2" style={{ alignItems:'start', gap:28 }}>
          {/* Left: Profile */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ background:'linear-gradient(135deg,#1B4332,#2D6A4F)', padding:28 }}>
                <div style={{ width:72, height:72, borderRadius:18, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, fontWeight:800, color:'white', fontFamily:'Sora,sans-serif', marginBottom:16 }}>
                  {u.name?.charAt(0)}
                </div>
                <h1 style={{ color:'white', fontSize:22, marginBottom:4 }}>{u.name}</h1>
                <p style={{ color:'rgba(255,255,255,0.7)', fontSize:15 }}>{worker.primarySkill}</p>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12 }}>
                  <span style={{ background:worker.availability?'rgba(52,211,153,0.2)':'rgba(239,68,68,0.2)', color:worker.availability?'#6EE7B7':'#FCA5A5', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700, border:`1px solid ${worker.availability?'rgba(52,211,153,0.4)':'rgba(239,68,68,0.4)'}` }}>
                    {worker.availability ? '✓ Available' : '✗ Not Available'}
                  </span>
                  <span className="badge badge-success" style={{ background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.8)', border:'1px solid rgba(255,255,255,0.2)' }}>Verified</span>
                </div>
              </div>
              <div style={{ padding:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <div>
                    <StarRating rating={worker.rating} />
                    <p style={{ fontSize:12, color:'#9CA3AF', marginTop:4 }}>{worker.totalRatings} reviews · {worker.totalJobsDone} jobs done</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:24, color:'#1B4332' }}>₹{worker.dailyRate}</div>
                    <div style={{ fontSize:12, color:'#9CA3AF' }}>per day</div>
                  </div>
                </div>

                {worker.bio && <p style={{ color:'#6B7280', lineHeight:1.7, fontSize:14, marginBottom:16 }}>{worker.bio}</p>}

                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, color:'#374151' }}>
                    <MapPin size={15} color="#F4A261" />
                    {u.location?.district || 'Kashmir'}{u.location?.area ? `, ${u.location.area}` : ''}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, color:'#374151' }}>
                    <Briefcase size={15} color="#F4A261" />
                    {worker.experience} years experience
                  </div>
                  {u.phone && (
                    <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, color:'#374151' }}>
                      <Phone size={15} color="#F4A261" />
                      {u.phone}
                    </div>
                  )}
                </div>

                {worker.skills?.length > 0 && (
                  <div style={{ marginTop:16 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Skills</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {worker.skills.map(s => <span key={s} style={{ background:'#F8F6F1', border:'1px solid #E5E0D5', borderRadius:20, padding:'3px 12px', fontSize:13, color:'#1B4332' }}>{s}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book button */}
            {worker.availability && user?.role === 'employer' && (
              <button className="btn btn-accent btn-full btn-lg" onClick={() => setShowBooking(true)}>
                <Calendar size={18} />Book This Worker
              </button>
            )}
            {!user && (
              <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/login')}>
                Login to Book
              </button>
            )}
          </div>

          {/* Right: Booking form or Reviews */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {showBooking && (
              <div className="card">
                <h3 style={{ marginBottom:20 }}>Create Booking</h3>
                <form onSubmit={handleBook} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input className="form-input" placeholder="e.g. Fix electrical wiring" value={booking.jobTitle} onChange={e => setBooking({...booking,jobTitle:e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input form-select" value={booking.category} onChange={e => setBooking({...booking,category:e.target.value})} required>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={3} placeholder="Describe the work needed..." value={booking.jobDescription} onChange={e => setBooking({...booking,jobDescription:e.target.value})} style={{ resize:'vertical' }} />
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input className="form-input" type="date" value={booking.startDate} onChange={e => setBooking({...booking,startDate:e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <select className="form-input form-select" value={booking.duration} onChange={e => setBooking({...booking,duration:e.target.value})}>
                        {['1 day','2 days','3 days','1 week','2 weeks','1 month','Ongoing'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Agreed Rate (₹/day)</label>
                    <input className="form-input" type="number" placeholder={worker.dailyRate} value={booking.agreedRate} onChange={e => setBooking({...booking,agreedRate:e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Location</label>
                    <input className="form-input" placeholder="Address / Area" value={booking.address} onChange={e => setBooking({...booking,address:e.target.value})} />
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowBooking(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={bookingLoading}>
                      {bookingLoading ? 'Sending...' : 'Send Request'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews */}
            <div className="card">
              <h3 style={{ marginBottom:16 }}>Reviews ({worker.reviews?.length || 0})</h3>
              {worker.reviews?.length === 0 ? (
                <p style={{ color:'#9CA3AF', fontSize:14 }}>No reviews yet.</p>
              ) : (
                worker.reviews?.slice(0,5).map((r, i) => (
                  <div key={i} style={{ borderBottom:'1px solid #F3F4F6', paddingBottom:16, marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <StarRating rating={r.rating} />
                      <span style={{ fontSize:12, color:'#9CA3AF' }}>{new Date(r.date).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize:14, color:'#374151', lineHeight:1.6 }}>{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
