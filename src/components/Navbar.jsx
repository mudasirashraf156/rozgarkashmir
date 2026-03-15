import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Briefcase, Users, LogOut, User, LayoutDashboard, CalendarCheck, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logoutUser(); navigate('/'); setOpen(false); };
  const isActive = (path) => location.pathname === path;

  const navLink = (to, label, icon) => (
    <Link to={to} onClick={() => setOpen(false)} style={{
      display:'flex', alignItems:'center', gap:6,
      padding:'8px 14px', borderRadius:8, fontSize:14, fontWeight:500,
      color: isActive(to) ? '#1B4332' : '#6B7280',
      background: isActive(to) ? '#D1FAE5' : 'transparent',
      transition:'all 0.2s'
    }}>
      {icon}{label}
    </Link>
  );

  return (
    <nav style={{ background:'#fff', borderBottom:'1px solid #E5E0D5', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:68 }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, background:'linear-gradient(135deg,#1B4332,#2D6A4F)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Briefcase size={20} color="#F4A261" />
          </div>
          <div>
            <div style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:18, color:'#1B4332', lineHeight:1 }}>Rozgar</div>
            <div style={{ fontFamily:'Sora,sans-serif', fontWeight:400, fontSize:12, color:'#F4A261', lineHeight:1 }}>Kashmir</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:4 }}>
          {navLink('/workers', 'Find Workers', <Users size={16} />)}
          {navLink('/jobs', 'Job Posts', <Briefcase size={16} />)}
          {user && navLink('/dashboard', 'Dashboard', <LayoutDashboard size={16} />)}
          {user && navLink('/bookings', 'Bookings', <CalendarCheck size={16} />)}
          {user?.role === 'admin' && navLink('/admin', 'Admin', <ShieldCheck size={16} />)}
        </div>

        {/* Auth buttons */}
        <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:10 }}>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Link to="/profile" style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:8, background:'#F8F6F1', color:'#1B4332', fontWeight:600, fontSize:13 }}>
                <User size={16} />{user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color:'#DC2626' }}>
                <LogOut size={16} />Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} style={{ display:'none', background:'none', border:'none', padding:4 }} className="mobile-toggle">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background:'#fff', borderTop:'1px solid #E5E0D5', padding:16, display:'flex', flexDirection:'column', gap:4 }}>
          {navLink('/workers', 'Find Workers', <Users size={16} />)}
          {navLink('/jobs', 'Job Posts', <Briefcase size={16} />)}
          {user && navLink('/dashboard', 'Dashboard', <LayoutDashboard size={16} />)}
          {user && navLink('/bookings', 'Bookings', <CalendarCheck size={16} />)}
          {user?.role === 'admin' && navLink('/admin', 'Admin', <ShieldCheck size={16} />)}
          <div className="divider" />
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline btn-sm btn-full" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm btn-full" onClick={() => setOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}><User size={16} />Profile</Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color:'#DC2626' }}><LogOut size={16} />Logout</button>
            </>
          )}
        </div>
      )}

      <style>{`.mobile-toggle { display: none; } @media(max-width:768px){ .mobile-toggle { display: block !important; } .hide-mobile { display: none !important; } }`}</style>
    </nav>
  );
}
