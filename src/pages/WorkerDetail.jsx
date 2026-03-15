import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Briefcase, Clock, CheckCircle, Phone, Calendar, ArrowLeft } from 'lucide-react';
import { getWorker } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';

export default function WorkerDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    getWorker(id)
      .then(res => setWorker(res.data.worker))
      .catch(() => navigate('/workers'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner"/><span>Loading worker profile...</span></div>;
  if (!worker) return null;

  const u = worker.user;
  const rating = worker.rating?.toFixed(1) || '0.0';
  const initials = u?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const isAvailable = worker.availability;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>
          <ArrowLeft size={15}/> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile card */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div className="avatar" style={{ width: 80, height: 80, fontSize: 28, background: '#FFF3E0', color: '#FF6B00', border: '3px solid #FFD9B0' }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: 24 }}>{u?.name}</h1>
                    {worker.verificationStatus === 'verified' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E8F5E9', color: '#2E7D32', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        <CheckCircle size={12} fill="#2E7D32"/> Verified
                      </span>
                    )}
                    <span style={{ background: isAvailable ? '#E8F5E9' : '#F5F5F5', color: isAvailable ? '#2E7D32' : '#9E9E9E', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {isAvailable ? '🟢 Available' : '🔴 Busy'}
                    </span>
                  </div>
                  <p style={{ color: '#FF6B00', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 16, margin: '4px 0 8px' }}>{worker.primarySkill}</p>
                  {u?.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8A8A8A', fontSize: 14 }}>
                      <MapPin size={14}/> {u.location.area && `${u.location.area}, `}{u.location.district}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
                {[
                  { val: rating, label: 'Rating', icon: '⭐' },
                  { val: worker.totalRatings, label: 'Reviews', icon: '💬' },
                  { val: `${worker.totalJobsDone}`, label: 'Jobs Done', icon: '✅' },
                  { val: `${worker.experience}yr`, label: 'Experience', icon: '🕐' }
                ].map(({ val, label, icon }) => (
                  <div key={label} style={{ textAlign: 'center', background: '#FFFAF5', borderRadius: 10, padding: '12px 8px' }}>
                    <div style={{ fontSize: 20, marginBottom: 2 }}>{icon}</div>
                    <div style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 18, color: '#1A3A5C' }}>{val}</div>
                    <div style={{ color: '#8A8A8A', fontSize: 11 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            {worker.bio && (
              <div className="card">
                <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 700, marginBottom: 10 }}>About</h3>
                <p style={{ color: '#4A4A4A', lineHeight: 1.7 }}>{worker.bio}</p>
              </div>
            )}

            {/* Skills */}
            <div className="card">
              <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 700, marginBottom: 12 }}>Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {worker.skills?.map(s => (
                  <span key={s} style={{ background: '#FFF3E0', color: '#D45500', padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, border: '1px solid #FFD9B0' }}>{s}</span>
                ))}
              </div>
              {worker.languages?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8A8A8A', marginBottom: 6 }}>LANGUAGES</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {worker.languages.map(l => <span key={l} style={{ background: '#E3F2FD', color: '#1565C0', padding: '3px 10px', borderRadius: 12, fontSize: 13 }}>{l}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            {worker.reviews?.length > 0 && (
              <div className="card">
                <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 700, marginBottom: 16 }}>Reviews ({worker.reviews.length})</h3>
                {worker.reviews.slice(0, 5).map((rev, i) => (
                  <div key={i} style={{ borderBottom: i < worker.reviews.length - 1 ? '1px solid #E8DDD0' : 'none', paddingBottom: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{rev.employer?.name || 'Employer'}</div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill={s <= rev.rating ? "#F59E0B" : "none"}/>)}
                      </div>
                    </div>
                    <p style={{ color: '#4A4A4A', fontSize: 14 }}>{rev.comment}</p>
                    <div style={{ fontSize: 12, color: '#8A8A8A', marginTop: 4 }}>{new Date(rev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column - Booking card */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 32, color: '#FF6B00' }}>₹{worker.dailyRate}</div>
                <div style={{ color: '#8A8A8A', fontSize: 13 }}>per day</div>
              </div>

              {user?.role === 'employer' ? (
                <>
                  <button
                    onClick={() => isAvailable ? setShowBooking(true) : null}
                    className={`btn ${isAvailable ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ width: '100%', justifyContent: 'center', marginBottom: 10, fontSize: 15, padding: '13px' }}
                    disabled={!isAvailable}
                  >
                    <Calendar size={16}/> {isAvailable ? 'Book Now' : 'Worker Busy'}
                  </button>
                  <p style={{ fontSize: 12, color: '#8A8A8A', textAlign: 'center', lineHeight: 1.5 }}>
                    No payment now. The worker will confirm your request.
                  </p>
                </>
              ) : !user ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#4A4A4A', marginBottom: 12, fontSize: 14 }}>Login as employer to book this worker</p>
                  <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Login to Book</button>
                </div>
              ) : (
                <div style={{ background: '#FFF3E0', borderRadius: 10, padding: 14, textAlign: 'center', fontSize: 13, color: '#D45500' }}>
                  Workers and admins cannot book workers
                </div>
              )}

              <div className="divider"/>

              {/* Contact info (shown only to logged in employers) */}
              {user?.role === 'employer' && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', marginBottom: 10 }}>CONTACT</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#4A4A4A' }}>
                    <Phone size={14} color="#FF6B00"/> {u?.phone}
                  </div>
                </div>
              )}

              {/* Work area */}
              {worker.workLocation?.district && (
                <>
                  <div className="divider"/>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', marginBottom: 8 }}>WORKS IN</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#4A4A4A', fontSize: 14 }}>
                      <MapPin size={13} color="#FF6B00"/> {worker.workLocation.district}
                    </div>
                    {worker.workLocation.areas?.map(a => (
                      <span key={a} style={{ display: 'inline-block', background: '#F5F5F5', borderRadius: 5, padding: '2px 8px', fontSize: 12, margin: '4px 3px 0 0' }}>{a}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBooking && <BookingModal worker={worker} onClose={() => setShowBooking(false)} />}

      <style>{`@media (max-width: 768px) { .container > div { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
