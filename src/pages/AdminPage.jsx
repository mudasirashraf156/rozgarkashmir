import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminWorkers, verifyWorker, getAdminUsers, toggleUserStatus, getAdminBookings } from '../utils/api';
import { CheckCircle, XCircle, Users, Briefcase, ShieldCheck, BarChart3 } from 'lucide-react';

function StatusBadge({ status }) {
  const map = { pending: 'badge-warning', verified: 'badge-success', rejected: 'badge-danger' };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
}

export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerFilter, setWorkerFilter] = useState('pending');
  const [verifyNote, setVerifyNote] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sRes, wRes, uRes, bRes] = await Promise.all([
          getAdminStats(), getAdminWorkers({ status: workerFilter }), getAdminUsers(), getAdminBookings()
        ]);
        setStats(sRes.data);
        setWorkers(wRes.data.workers);
        setUsers(uRes.data.users);
        setBookings(bRes.data.bookings);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, [workerFilter]);

  const handleVerify = async (id, status) => {
    try {
      await verifyWorker(id, { status, note: verifyNote });
      setWorkers(ws => ws.filter(w => w._id !== id));
    } catch (e) { alert('Failed to update verification'); }
  };

  const handleToggleUser = async (id) => {
    try {
      await toggleUserStatus(id);
      setUsers(us => us.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (e) { alert('Failed to update user'); }
  };

  const renderIcon = (name, color) => {
    if (name === 'users') return <Users size={22} color={color} />;
    if (name === 'shield') return <ShieldCheck size={22} color={color} />;
    if (name === 'briefcase') return <Briefcase size={22} color={color} />;
    if (name === 'check') return <CheckCircle size={22} color={color} />;
    return <BarChart3 size={22} color={color} />;
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, bg: '#DBEAFE', iconColor: '#2563EB', iconName: 'users' },
    { label: 'Total Workers', value: stats.totalWorkers, bg: '#D1FAE5', iconColor: '#059669', iconName: 'shield' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, bg: '#FEF3C7', iconColor: '#D97706', iconName: 'shield' },
    { label: 'Total Bookings', value: stats.totalBookings, bg: '#F3E8FF', iconColor: '#7C3AED', iconName: 'briefcase' },
    { label: 'Completed Jobs', value: stats.completedBookings, bg: '#D1FAE5', iconColor: '#059669', iconName: 'check' },
    { label: 'Open Jobs', value: stats.openJobs, bg: '#FEE2E2', iconColor: '#DC2626', iconName: 'briefcase' },
  ] : [];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'verifications', label: `Verifications${stats?.pendingVerifications > 0 ? ` (${stats.pendingVerifications})` : ''}` },
    { id: 'users', label: 'Users' },
    { id: 'bookings', label: 'Bookings' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontFamily: "'Baloo 2', cursive", color: '#1A3A5C' }}>
            🛡️ Admin Panel
          </h1>
          <p style={{ color: '#6B7280' }}>Manage RozgarKashmir platform</p>
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#F8F6F1', borderRadius: 12, padding: 4, marginBottom: 28, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="btn btn-sm" style={{
              flex: 1, justifyContent: 'center', minWidth: 120,
              background: tab === t.id ? 'white' : 'transparent',
              color: tab === t.id ? '#FF6B00' : '#6B7280',
              fontWeight: tab === t.id ? 700 : 500,
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              border: 'none'
            }}>{t.label}</button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            Loading admin data...
          </div>
        )}

        {!loading && tab === 'overview' && stats && (
          <div className="grid-3" style={{ marginBottom: 28 }}>
            {statCards.map(s => (
              <div key={s.label} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {renderIcon(s.iconName, s.iconColor)}
                </div>
                <div>
                  <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 2 }}>{s.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Baloo 2', cursive", color: '#1A1A1A', lineHeight: 1 }}>{s.value ?? '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'verifications' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['pending', 'verified', 'rejected'].map(s => (
                <button key={s} onClick={() => setWorkerFilter(s)} className={`btn btn-sm ${workerFilter === s ? 'btn-primary' : 'btn-ghost'}`} style={{ textTransform: 'capitalize' }}>{s}</button>
              ))}
            </div>
            {workers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>No workers with "{workerFilter}" status</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {workers.map(w => {
                  const u = w.user || {};
                  return (
                    <div key={w._id} className="card" style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <h3 style={{ fontSize: 16, color: '#1A3A5C' }}>{u.name}</h3>
                            <StatusBadge status={w.verificationStatus} />
                          </div>
                          <p style={{ fontSize: 13, color: '#6B7280' }}>{w.primarySkill} · {u.phone} · {u.location?.district}</p>
                          <p style={{ fontSize: 13, color: '#9CA3AF' }}>₹{w.dailyRate}/day · {w.experience}yr exp</p>
                          {w.bio && <p style={{ fontSize: 13, color: '#374151', marginTop: 6, maxWidth: 500 }}>{w.bio}</p>}
                        </div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                      </div>
                      {w.verificationStatus === 'pending' && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                          <input className="input" placeholder="Note (optional)" value={verifyNote} onChange={e => setVerifyNote(e.target.value)} style={{ maxWidth: 280, flex: 1 }} />
                          <button className="btn btn-success btn-sm" onClick={() => handleVerify(w._id, 'verified')}><CheckCircle size={14} /> Verify</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleVerify(w._id, 'rejected')}><XCircle size={14} /> Reject</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!loading && tab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {users.map(u => (
              <div key={u._id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#1A3A5C' }}>{u.name}</span>
                    <span className={`badge ${u.role === 'worker' ? 'badge-success' : u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>{u.role}</span>
                    {!u.isActive && <span className="badge badge-danger">Deactivated</span>}
                  </div>
                  <p style={{ fontSize: 13, color: '#9CA3AF' }}>{u.email} · {u.phone} · {u.location?.district}</p>
                </div>
                {u.role !== 'admin' && (
                  <button onClick={() => handleToggleUser(u._id)} className={`btn btn-sm ${u.isActive ? 'btn-ghost' : 'btn-primary'}`}>
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookings.map(b => (
              <div key={b._id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: '#1A3A5C' }}>{b.jobTitle}</span>
                      <span className={`badge ${b.status === 'completed' ? 'badge-success' : b.status === 'pending' ? 'badge-warning' : 'badge-gray'}`}>{b.status}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#6B7280' }}>Employer: {b.employer?.name} · Worker: {b.worker?.user?.name} · ₹{b.agreedRate}/day</p>
                  </div>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {bookings.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>No bookings found</div>}
          </div>
        )}
      </div>
    </div>
  );
}
