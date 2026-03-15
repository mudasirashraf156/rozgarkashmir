import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus, toggleAvailability, getWorkerStats, updateWorkerProfile } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock, ToggleLeft, ToggleRight, Star, Briefcase, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: { bg: '#FFF3E0', color: '#F57C00', label: '⏳ Pending' },
  accepted: { bg: '#E3F2FD', color: '#1565C0', label: '✅ Accepted' },
  rejected: { bg: '#FFEBEE', color: '#C62828', label: '❌ Rejected' },
  completed: { bg: '#E8F5E9', color: '#2E7D32', label: '🎉 Completed' },
  cancelled: { bg: '#F5F5F5', color: '#9E9E9E', label: '🚫 Cancelled' }
};

const SKILLS = ['Carpenter', 'Plumber', 'Electrician', 'Painter', 'Mason', 'Gardener', 'Driver', 'Cook', 'Welder', 'Tailor', 'Security Guard', 'General Labour'];

export default function WorkerDashboard() {
  const { user, workerProfile, refreshUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(workerProfile?.availability ?? true);
  const [activeTab, setTab] = useState('bookings');
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    primarySkill: workerProfile?.primarySkill || '',
    dailyRate: workerProfile?.dailyRate || 500,
    experience: workerProfile?.experience || 0,
    bio: workerProfile?.bio || '',
    skills: workerProfile?.skills || []
  });

  const load = async () => {
    try {
      const [bRes, sRes] = await Promise.all([getBookings(), getWorkerStats()]);
      setBookings(bRes.data.bookings);
      setStats(sRes.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (workerProfile) { setAvailable(workerProfile.availability); setProfileForm({ primarySkill: workerProfile.primarySkill, dailyRate: workerProfile.dailyRate, experience: workerProfile.experience, bio: workerProfile.bio || '', skills: workerProfile.skills || [] }); } }, [workerProfile]);

  const handleRespond = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(status === 'accepted' ? 'Booking accepted!' : 'Booking rejected');
      load();
    } catch { toast.error('Action failed'); }
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await toggleAvailability();
      setAvailable(res.data.availability);
      toast.success(res.data.availability ? 'You are now Available for work!' : 'Status set to Busy');
    } catch { toast.error('Failed to update'); }
  };

  const handleSaveProfile = async () => {
    try {
      await updateWorkerProfile(profileForm);
      toast.success('Profile updated!');
      setEditMode(false);
      refreshUser();
    } catch { toast.error('Update failed'); }
  };

  const toggleSkill = (s) => setProfileForm(f => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s] }));

  const verStatus = workerProfile?.verificationStatus;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Profile header */}
        <div className="card" style={{ marginBottom: 24, padding: '24px 28px' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="avatar" style={{ width: 64, height: 64, fontSize: 22, background: '#FFF3E0', color: '#FF6B00', border: '3px solid #FFD9B0' }}>{initials}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 22 }}>{user?.name}</h2>
              <p style={{ color: '#8A8A8A', fontSize: 14 }}>{workerProfile?.primarySkill} · {user?.location?.district}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{
                  background: verStatus === 'verified' ? '#E8F5E9' : verStatus === 'pending' ? '#FFF3E0' : '#FFEBEE',
                  color: verStatus === 'verified' ? '#2E7D32' : verStatus === 'pending' ? '#F57C00' : '#C62828',
                  padding: '3px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600
                }}>
                  {verStatus === 'verified' ? '✅ Verified' : verStatus === 'pending' ? '⏳ Pending Verification' : '❌ Rejected'}
                </span>
              </div>
            </div>

            {/* Availability toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#8A8A8A' }}>AVAILABILITY</div>
              <button onClick={handleToggleAvailability} style={{
                background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
              }}>
                {available ? <ToggleRight size={36} color="#2E7D32"/> : <ToggleLeft size={36} color="#9E9E9E"/>}
                <span style={{ fontWeight: 700, color: available ? '#2E7D32' : '#9E9E9E', fontSize: 14 }}>{available ? 'Available' : 'Busy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Bookings', val: stats.totalBookings || 0, icon: '📋', color: '#1A3A5C' },
            { label: 'Completed', val: stats.completedBookings || 0, icon: '✅', color: '#2E7D32' },
            { label: 'Pending', val: stats.pendingBookings || 0, icon: '⏳', color: '#F57C00' },
            { label: 'Rating', val: `${(stats.rating || 0).toFixed(1)}⭐`, icon: '🏆', color: '#FF6B00' }
          ].map(({ label, val, icon, color }) => (
            <div key={label} className="card" style={{ padding: '16px', textAlign: 'center', borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 22, color }}>{val}</div>
              <div style={{ color: '#8A8A8A', fontSize: 12 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Verification alert */}
        {verStatus === 'pending' && (
          <div style={{ background: '#FFF8E1', border: '1.5px solid #FFD54F', borderRadius: 12, padding: 16, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24 }}>⏳</span>
            <div>
              <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#F57C00', marginBottom: 4 }}>Verification Pending</div>
              <p style={{ color: '#795548', fontSize: 14 }}>Our team is reviewing your profile. You'll be able to accept job bookings once verified. This usually takes 24 hours.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #E8DDD0', marginBottom: 24 }}>
          {[['bookings', 'Booking Requests'], ['profile', 'My Profile']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 15,
              color: activeTab === val ? '#FF6B00' : '#8A8A8A',
              borderBottom: `3px solid ${activeTab === val ? '#FF6B00' : 'transparent'}`,
              marginBottom: -2
            }}>{label}</button>
          ))}
        </div>

        {loading ? <div className="loading-screen"><div className="spinner"/></div> : (
          <>
            {/* Bookings tab */}
            {activeTab === 'bookings' && (
              bookings.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: 48 }}>📭</div>
                  <h3>No bookings yet</h3>
                  <p>Once employers book you, requests will appear here</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {bookings.map(b => {
                    const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
                    return (
                      <div key={b._id} className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                              <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#1A3A5C' }}>{b.jobTitle}</h3>
                              <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                            </div>
                            <p style={{ color: '#4A4A4A', fontSize: 14 }}>Employer: <strong>{b.employer?.name}</strong> · {b.employer?.phone}</p>
                            <p style={{ color: '#8A8A8A', fontSize: 13 }}>
                              📍 {b.location?.area && `${b.location.area}, `}{b.location?.district} · 📅 {new Date(b.startDate).toLocaleDateString('en-IN')} · ₹{b.agreedRate}/day
                            </p>
                            {b.jobDescription && <p style={{ color: '#4A4A4A', fontSize: 13, marginTop: 6 }}>{b.jobDescription}</p>}
                          </div>
                          {b.status === 'pending' && (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-sm btn-success" onClick={() => handleRespond(b._id, 'accepted')}>
                                <CheckCircle size={13}/> Accept
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleRespond(b._id, 'rejected')}>
                                <XCircle size={13}/> Reject
                              </button>
                            </div>
                          )}
                        </div>
                        {b.workerRating && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #E8DDD0' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', marginBottom: 4 }}>EMPLOYER REVIEW</div>
                            <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                              {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill={s <= b.workerRating ? "#F59E0B" : "none"}/>)}
                            </div>
                            <p style={{ fontSize: 13, color: '#4A4A4A' }}>{b.workerReview}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Profile tab */}
            {activeTab === 'profile' && (
              <div className="card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 18 }}>Worker Profile</h3>
                  <button className={`btn btn-sm ${editMode ? 'btn-ghost' : 'btn-outline'}`} onClick={() => setEditMode(!editMode)}>
                    <Settings size={14}/> {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {editMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div className="form-group">
                        <label className="form-label">Primary Skill</label>
                        <select className="select" value={profileForm.primarySkill} onChange={e => setProfileForm(f => ({ ...f, primarySkill: e.target.value }))}>
                          {SKILLS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Daily Rate (₹)</label>
                        <input className="input" type="number" value={profileForm.dailyRate} onChange={e => setProfileForm(f => ({ ...f, dailyRate: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Experience (yrs)</label>
                        <input className="input" type="number" value={profileForm.experience} onChange={e => setProfileForm(f => ({ ...f, experience: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Skills</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                        {SKILLS.map(s => (
                          <button key={s} type="button" onClick={() => toggleSkill(s)}
                            style={{ padding: '4px 12px', borderRadius: 20, fontSize: 13, border: '1.5px solid', cursor: 'pointer',
                              background: profileForm.skills.includes(s) ? '#FF6B00' : 'white',
                              color: profileForm.skills.includes(s) ? 'white' : '#4A4A4A',
                              borderColor: profileForm.skills.includes(s) ? '#FF6B00' : '#E8DDD0'
                            }}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bio</label>
                      <textarea className="textarea" value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} rows={3} />
                    </div>
                    <button className="btn btn-primary" onClick={handleSaveProfile} style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>Save Changes</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                    {[
                      ['Primary Skill', workerProfile?.primarySkill],
                      ['Daily Rate', `₹${workerProfile?.dailyRate}/day`],
                      ['Experience', `${workerProfile?.experience} years`],
                      ['Rating', `${(workerProfile?.rating || 0).toFixed(1)} / 5`],
                      ['Jobs Done', workerProfile?.totalJobsDone],
                      ['Verification', workerProfile?.verificationStatus]
                    ].map(([label, val]) => (
                      <div key={label}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', marginBottom: 4 }}>{label.toUpperCase()}</div>
                        <div style={{ fontWeight: 600, color: '#1A3A5C' }}>{val || '—'}</div>
                      </div>
                    ))}
                    {workerProfile?.bio && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', marginBottom: 4 }}>BIO</div>
                        <p style={{ color: '#4A4A4A' }}>{workerProfile.bio}</p>
                      </div>
                    )}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', marginBottom: 8 }}>SKILLS</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {workerProfile?.skills?.map(s => <span key={s} style={{ background: '#FFF3E0', color: '#D45500', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{s}</span>)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
