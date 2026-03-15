import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookings, getWorkerStats, toggleAvailability } from '../utils/api';
import { Briefcase, CalendarCheck, Star, Users, ToggleLeft, ToggleRight, ChevronRight, Clock, CheckCircle } from 'lucide-react';

function StatusBadge({ status }) {
  const map = { pending:'badge-warning', accepted:'badge-info', rejected:'badge-danger', in_progress:'badge-info', completed:'badge-success', cancelled:'badge-danger' };
  return <span className={`badge ${map[status]||'badge-gray'}`}>{status?.replace('_',' ')}</span>;
}

export default function DashboardPage() {
  const { user, workerProfile, setWorkerProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBookings(),
      user.role === 'worker' ? getWorkerStats() : Promise.resolve(null)
    ]).then(([bRes, sRes]) => {
      setBookings(bRes.data.bookings.slice(0, 5));
      if (sRes) setStats(sRes.data);
    }).finally(() => setLoading(false));
  }, [user.role]);

  const handleToggleAvailability = async () => {
    try {
      const res = await toggleAvailability();
      setWorkerProfile(p => ({ ...p, availability: res.data.availability }));
    } catch (e) { console.error(e); }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner" style={{ width:40, height:40, border:'4px solid #E5E0D5', borderTopColor:'#1B4332', borderRadius:'50%' }} /></div>;

  return (
    <div className="page">
      <div className="container">
        {/* Welcome */}
        <div style={{ marginBottom:32, display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:'clamp(1.4rem,3vw,2rem)' }}>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <p style={{ color:'#6B7280', marginTop:4 }}>Here's what's happening on your account.</p>
          </div>
          {user.role === 'worker' && workerProfile && (
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'white', border:'1.5px solid #E5E0D5', borderRadius:12, padding:'10px 16px' }}>
              <span style={{ fontSize:14, fontWeight:600, color:'#374151' }}>Availability</span>
              <button onClick={handleToggleAvailability} style={{ background:'none', border:'none', padding:0, color: workerProfile.availability ? '#059669' : '#DC2626' }}>
                {workerProfile.availability ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
              <span style={{ fontSize:13, color: workerProfile.availability ? '#059669' : '#DC2626', fontWeight:600 }}>
                {workerProfile.availability ? 'Available' : 'Busy'}
              </span>
            </div>
          )}
        </div>

        {/* Worker verification banner */}
        {user.role === 'worker' && workerProfile?.verificationStatus === 'pending' && (
          <div style={{ background:'#FEF3C7', border:'1px solid #FCD34D', borderRadius:12, padding:'16px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12 }}>
            <Clock size={20} color="#D97706" />
            <div>
              <p style={{ fontWeight:700, color:'#92400E' }}>Verification Pending</p>
              <p style={{ fontSize:13, color:'#B45309' }}>Your profile is being reviewed by our team. You'll be notified once verified.</p>
            </div>
          </div>
        )}
        {user.role === 'worker' && workerProfile?.verificationStatus === 'verified' && (
          <div style={{ background:'#D1FAE5', border:'1px solid #6EE7B7', borderRadius:12, padding:'16px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12 }}>
            <CheckCircle size={20} color="#059669" />
            <p style={{ fontWeight:700, color:'#065F46' }}>✓ Your profile is verified! Employers can find and book you.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom:32 }}>
          {user.role === 'worker' ? [
            { label:'Total Bookings', value: stats?.totalBookings || 0, icon:<CalendarCheck size={22} color="#1B4332" />, color:'#D1FAE5' },
            { label:'Completed Jobs', value: stats?.completedBookings || 0, icon:<CheckCircle size={22} color="#059669" />, color:'#D1FAE5' },
            { label:'Pending', value: stats?.pendingBookings || 0, icon:<Clock size={22} color="#D97706" />, color:'#FEF3C7' },
            { label:'Rating', value: workerProfile?.rating ? `${workerProfile.rating.toFixed(1)} ★` : 'N/A', icon:<Star size={22} color="#F59E0B" />, color:'#FEF9C3' },
          ] : [
            { label:'Total Bookings', value: bookings.length, icon:<CalendarCheck size={22} color="#1B4332" />, color:'#D1FAE5' },
            { label:'Active', value: bookings.filter(b => b.status === 'accepted').length, icon:<Briefcase size={22} color="#2563EB" />, color:'#DBEAFE' },
            { label:'Completed', value: bookings.filter(b => b.status === 'completed').length, icon:<CheckCircle size={22} color="#059669" />, color:'#D1FAE5' },
            { label:'Pending', value: bookings.filter(b => b.status === 'pending').length, icon:<Clock size={22} color="#D97706" />, color:'#FEF3C7' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:20, display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:s.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize:13, color:'#9CA3AF', fontWeight:500 }}>{s.label}</p>
                <p style={{ fontSize:24, fontWeight:800, fontFamily:'Sora,sans-serif', color:'#1A1A1A' }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid-2" style={{ marginBottom:32 }}>
          <div className="card" style={{ padding:24 }}>
            <h3 style={{ marginBottom:16, fontSize:17 }}>Quick Actions</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {user.role === 'employer' ? (
                <>
                  <Link to="/workers" className="btn btn-primary"><Users size={16} />Find Workers</Link>
                  <Link to="/bookings" className="btn btn-outline"><CalendarCheck size={16} />View Bookings</Link>
                </>
              ) : (
                <>
                  <Link to="/jobs" className="btn btn-primary"><Briefcase size={16} />Browse Jobs</Link>
                  <Link to="/bookings" className="btn btn-outline"><CalendarCheck size={16} />My Bookings</Link>
                  <Link to="/profile" className="btn btn-ghost"><Star size={16} />Update Profile</Link>
                </>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontSize:17 }}>Recent Bookings</h3>
              <Link to="/bookings" style={{ fontSize:13, color:'#1B4332', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>View all <ChevronRight size={14} /></Link>
            </div>
            {bookings.length === 0 ? (
              <p style={{ color:'#9CA3AF', fontSize:14 }}>No bookings yet.</p>
            ) : (
              bookings.slice(0,4).map(b => (
                <div key={b._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:12, marginBottom:12, borderBottom:'1px solid #F3F4F6' }}>
                  <div>
                    <p style={{ fontWeight:600, fontSize:14, color:'#1A1A1A' }}>{b.jobTitle}</p>
                    <p style={{ fontSize:12, color:'#9CA3AF' }}>{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
