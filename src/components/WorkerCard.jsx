import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Briefcase, CheckCircle, Clock } from 'lucide-react';

const SKILL_COLORS = {
  'Carpenter': '#8B4513', 'Plumber': '#1565C0', 'Electrician': '#F57F17',
  'Painter': '#6A1B9A', 'Mason': '#4E342E', 'Gardener': '#2E7D32',
  'Driver': '#0277BD', 'Cook': '#BF360C', 'Security Guard': '#1B5E20',
  'General Labour': '#455A64', 'Welder': '#E65100', 'Tailor': '#880E4F'
};

export default function WorkerCard({ worker }) {
  const user = worker.user;
  if (!user) return null;

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const skillColor = SKILL_COLORS[worker.primarySkill] || '#1A3A5C';
  const isAvailable = worker.availability;
  const rating = worker.rating?.toFixed(1) || '0.0';

  return (
    <Link to={`/workers/${worker._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ cursor: 'pointer', padding: 20, position: 'relative', overflow: 'hidden' }}>
        {/* Availability indicator */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          display: 'flex', alignItems: 'center', gap: 5,
          background: isAvailable ? '#E8F5E9' : '#F5F5F5',
          borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600,
          color: isAvailable ? '#2E7D32' : '#9E9E9E'
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: isAvailable ? '#4CAF50' : '#BDBDBD' }}/>
          {isAvailable ? 'Available' : 'Busy'}
        </div>

        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${skillColor}, ${skillColor}88)` }}/>

        {/* Worker info */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginTop: 8 }}>
          <div className="avatar" style={{ width: 52, height: 52, fontSize: 18, background: skillColor + '18', color: skillColor, border: `2px solid ${skillColor}33` }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 16, color: '#1A3A5C', marginBottom: 2 }}>
              {user.name}
              {worker.verificationStatus === 'verified' && (
                <CheckCircle size={14} color="#2E7D32" style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }}/>
              )}
            </div>
            <span style={{ background: skillColor + '18', color: skillColor, padding: '2px 9px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
              {worker.primarySkill}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, margin: '14px 0 12px', flexWrap: 'wrap' }}>
          <Stat icon={<Star size={13} color="#F59E0B" fill="#F59E0B"/>} label={`${rating} (${worker.totalRatings})`} />
          <Stat icon={<Briefcase size={13} color="#1A3A5C"/>} label={`${worker.totalJobsDone} jobs`} />
          <Stat icon={<Clock size={13} color="#1A3A5C"/>} label={`${worker.experience}y exp`} />
        </div>

        {/* Location */}
        {user.location?.district && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8A8A8A', fontSize: 13, marginBottom: 12 }}>
            <MapPin size={13}/> {user.location.area && `${user.location.area}, `}{user.location.district}
          </div>
        )}

        {/* Skills tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
          {worker.skills?.slice(0, 3).map(s => (
            <span key={s} style={{ background: '#F5F5F5', borderRadius: 5, padding: '2px 8px', fontSize: 12, color: '#4A4A4A' }}>{s}</span>
          ))}
        </div>

        {/* Rate */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #E8DDD0' }}>
          <div>
            <span style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 18, color: '#FF6B00' }}>₹{worker.dailyRate}</span>
            <span style={{ color: '#8A8A8A', fontSize: 12 }}> / day</span>
          </div>
          <span style={{ fontFamily: "'Baloo 2'", fontWeight: 600, fontSize: 13, color: '#FF6B00', background: '#FFF3E0', padding: '4px 12px', borderRadius: 6 }}>
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}

function Stat({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#4A4A4A', fontWeight: 500 }}>
      {icon}{label}
    </div>
  );
}
