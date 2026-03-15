import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminWorkers, verifyWorker, getAdminUsers, toggleUserStatus, getAdminBookings } from '../utils/api';
import { CheckCircle, XCircle, Users, Briefcase, ShieldCheck, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
 
export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setTab] = useState('overview');
  const [verifyNote, setVerifyNote] = useState('');
  const [verifyModal, setVerifyModal] = useState(null);
  const [workerFilter, setWorkerFilter] = useState('pending');
 
  const load = async () => {
    setLoading(true);
    try {
      const [sRes, wRes, uRes, bRes] = await Promise.all([
        getAdminStats(), getAdminWorkers({ status: workerFilter }), getAdminUsers(), getAdminBookings()
      ]);
      setStats(sRes.data);
      setWorkers(wRes.data.workers);
      setUsers(uRes.data.users);
      setBookings(bRes.data.bookings);
    } catch {} finally { setLoading(false); }
  };
 
  useEffect(() => { load(); }, [workerFilter]);
 
  const handleVerify = async (status) => {
    try {
      await verifyWorker(verifyModal, { status, note: verifyNote });
      toast.success(`Worker ${status}!`);
      setVerifyModal(null);
      setVerifyNote('');
      load();
    } catch { toast.error('Failed'); }
  };
 
  const handleToggleUser = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      toast.success(res.data.message);
      load();
    } catch { toast.error('Failed'); }
  };
 
  const TABS = [['overview', '📊 Overview'], ['workers', '👷 Workers'], ['users', '👥 Users'], ['bookings', '📋 Bookings']];
 
  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">RozgarKashmir Control Panel</p>
        </div>
 
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #E8DDD0', marginBottom: 28, overflowX: 'auto' }}>
          {TABS.map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 14,
              color: activeTab === val ? '#FF6B00' : '#8A8A8A',
              borderBottom: `3px solid ${activeTab === val ? '#FF6B00' : 'transparent'}`, marginBottom: -2
            }}>{label}</button>
          ))}
        </div>
 
        {loading ? <div className="loading-screen"><div className="spinner"/></div> : (
          <>
            {/* Overview */}
            {activeTab === 'overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
                  {[
                    { label: 'Total Users', val: stats.totalUsers, color: '#1A3A5C', bg: '#E3F2FD' },
                    { label: 'Total Workers', val: stats.totalWorkers, color: '#2E7D32', bg: '#E8F5E9' },
                    { label: 'Pending Verify', val: stats.pendingVerifications, color: '#F57C00', bg: '#FFF3E0' },
                    { label: 'Total Bookings', val: stats.totalBookings, color: '#6A1B9A', bg: '#F3E5F5' },
                    { label: 'Completed Jobs', val: stats.completedBookings, color: '#00695C', bg: '#E0F2F1' },
                    { label: 'Open Jobs', val: stats.openJobs, color: '#1565C0', bg: '#E3F2FD' }
                  ].map(({ label, val, color, bg }) => (
                    <div key={label} className="card" style={{ padding: 20, background: bg, border: `1.5px solid ${color}22` }}>
                      <div style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 28, color }}>{val ?? '...'}</div>
                      <div style={{ fontSize: 13, color: color + 'BB' }}>{label}</div>
                    </div>
                  ))}
                </div>
 
                {/* Recent pending workers */}
                <div className="card" style={{ padding: 24 }}>
                  <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, marginBottom: 16 }}>⏳ Pending Worker Verifications</h3>
                  {workers.filter(w => w.verificationStatus === 'pending').slice(0, 5).map(w => (
                    <div key={w._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #E8DDD0', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{w.user?.name}</div>
                        <div style={{ fontSize: 13, color: '#8A8A8A' }}>{w.primarySkill} · {w.user?.phone} · {w.user?.location?.district}</div>
                      </div>
                      <button className="btn btn-sm btn-primary" onClick={() => setVerifyModal(w._id)}>Review</button>
                    </div>
                  ))}
                  {workers.filter(w => w.verificationStatus === 'pending').length === 0 && (
                    <p style={{ color: '#8A8A8A', fontSize: 14 }}>✅ All workers are verified!</p>
                  )}
                </div>
              </div>
            )}
 
            {/* Workers tab */}
            {activeTab === 'workers' && (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {['pending', 'verified', 'rejected'].map(s => (
                    <button key={s} onClick={() => setWorkerFilter(s)} className={`btn btn-sm ${workerFilter === s ? 'btn-primary' : 'btn-ghost'}`} style={{ textTransform: 'capitalize' }}>
                      {s}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {workers.map(w => (
                    <div key={w._id} className="card" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 16, color: '#1A3A5C' }}>{w.user?.name}</div>
                          <div style={{ color: '#8A8A8A', fontSize: 13 }}>
                            {w.primarySkill} · {w.user?.phone} · {w.user?.email}
                          </div>
                          <div style={{ fontSize: 13, color: '#4A4A4A' }}>📍 {w.user?.location?.district} · ₹{w.dailyRate}/day · {w.experience}yr exp</div>
                          <div style={{ fontSize: 12, color: '#8A8A8A', marginTop: 2 }}>Joined: {new Date(w.user?.createdAt).toLocaleDateString('en-IN')}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {w.verificationStatus === 'pending' && (
                            <>
                              <button className="btn btn-sm btn-success" onClick={() => setVerifyModal(w._id)}><CheckCircle size={13}/> Verify</button>
                              <button className="btn btn-sm btn-danger" onClick={async () => {
                                await verifyWorker(w._id, { status: 'rejected', note: 'Rejected by admin' });
                                toast.success('Worker rejected'); load();
                              }}><XCircle size={13}/> Reject</button>
                            </>
                          )}
                          {w.verificationStatus === 'verified' && (
                            <span className="badge badge-success">✅ Verified</span>
                          )}
                          {w.verificationStatus === 'rejected' && (
                            <span className="badge badge-danger">❌ Rejected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {workers.length === 0 && <div className="empty-state"><h3>No workers with this status</h3></div>}
                </div>
              </div>
            )}
 
            {/* Users tab */}
            {activeTab === 'users' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {users.map(u => (
                  <div key={u._id} className="card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1A3A5C' }}>{u.name}</div>
                      <div style={{ fontSize: 13, color: '#8A8A8A' }}>{u.email} · {u.phone}</div>
                      <div style={{ fontSize: 12, color: '#8A8A8A' }}>
                        <span style={{ background: u.role === 'worker' ? '#E3F2FD' : '#FFF3E0', color: u.role === 'worker' ? '#1565C0' : '#E65100', padding: '2px 8px', borderRadius: 10, fontWeight: 600, marginRight: 6 }}>{u.role}</span>
                        {u.location?.district}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: u.isActive ? '#2E7D32' : '#C62828', fontWeight: 600 }}>
                        {u.isActive ? '🟢 Active' : '🔴 Disabled'}
                      </span>
                      <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggleUser(u._id)}>
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
 
            {/* Bookings tab */}
            {activeTab === 'bookings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bookings.map(b => (
                  <div key={b._id} className="card" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <h4 style={{ fontFamily: "'Baloo 2'", fontWeight: 700, color: '#1A3A5C', marginBottom: 4 }}>{b.jobTitle}</h4>
                        <div style={{ fontSize: 13, color: '#4A4A4A' }}>
                          Employer: <strong>{b.employer?.name}</strong> · Worker: <strong>{b.worker?.user?.name}</strong>
                        </div>
                        <div style={{ fontSize: 13, color: '#8A8A8A' }}>
                          📍 {b.location?.district} · 📅 {new Date(b.startDate).toLocaleDateString('en-IN')} · ₹{b.agreedRate}/day
                        </div>
                      </div>
                      <span style={{
                        background: b.status === 'completed' ? '#E8F5E9' : b.status === 'pending' ? '#FFF3E0' : '#F5F5F5',
                        color: b.status === 'completed' ? '#2E7D32' : b.status === 'pending' ? '#F57C00' : '#757575',
                        padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600
                      }}>{b.status}</span>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <div className="empty-state"><h3>No bookings found</h3></div>}
              </div>
            )}
          </>
        )}
      </div>
 
      {/* Verify Modal */}
      {verifyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="card" style={{ maxWidth: 420, width: '100%', padding: 28 }}>
            <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 800, marginBottom: 16 }}>Verify Worker</h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Note (optional)</label>
              <textarea className="textarea" placeholder="Add a note..." value={verifyNote} onChange={e => setVerifyNote(e.target.value)} rows={3} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" onClick={() => setVerifyModal(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleVerify('rejected')} style={{ flex: 1, justifyContent: 'center' }}>
                <XCircle size={14}/> Reject
              </button>
              <button className="btn btn-success" onClick={() => handleVerify('verified')} style={{ flex: 1, justifyContent: 'center' }}>
                <CheckCircle size={14}/> Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 