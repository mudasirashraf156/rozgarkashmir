import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getWorkers } from '../utils/api';
import { Search, MapPin, Filter } from 'lucide-react';

const SKILLS = ['Carpenter','Electrician','Plumber','Painter','Mason','Driver','Cook','Cleaner','Gardner','Welder','Tailor','Mechanic','Helper'];
const DISTRICTS = ['Srinagar','Baramulla','Anantnag','Pulwama','Kupwara','Sopore','Budgam','Ganderbal'];

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'star' : 'star-empty'}>★</span>
      ))}
    </div>
  );
}

function WorkerCard({ worker }) {
  const u = worker.user || {};
  return (
    <div className="card fade-in" style={{ padding:0, overflow:'hidden', transition:'box-shadow 0.2s, transform 0.2s' }}
      onMouseOver={e => { e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.14)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow=''; e.currentTarget.style.transform=''; }}>
      <div style={{ background:'linear-gradient(135deg,#1B4332,#2D6A4F)', padding:'24px 24px 16px', position:'relative' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ width:52, height:52, borderRadius:14, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'white', fontFamily:'Sora,sans-serif' }}>
            {u.name?.charAt(0) || '?'}
          </div>
          <span style={{ background: worker.availability ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)', color: worker.availability ? '#6EE7B7' : '#FCA5A5', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, border: `1px solid ${worker.availability?'rgba(52,211,153,0.4)':'rgba(239,68,68,0.4)'}` }}>
            {worker.availability ? '✓ Available' : '✗ Busy'}
          </span>
        </div>
        <h3 style={{ color:'white', marginTop:12, fontSize:17 }}>{u.name}</h3>
        <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>{worker.primarySkill}</p>
      </div>
      <div style={{ padding:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <StarRating rating={worker.rating} />
            <span style={{ fontSize:13, color:'#6B7280' }}>({worker.totalRatings})</span>
          </div>
          <div style={{ fontFamily:'Sora,sans-serif', fontWeight:800, color:'#1B4332', fontSize:17 }}>₹{worker.dailyRate}<span style={{ fontWeight:400, fontSize:12, color:'#9CA3AF' }}>/day</span></div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5, color:'#9CA3AF', fontSize:13, marginBottom:12 }}>
          <MapPin size={13} />
          {u.location?.district || 'Kashmir'} {u.location?.area ? `· ${u.location.area}` : ''}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
          {(worker.skills || []).slice(0,3).map(s => (
            <span key={s} style={{ background:'#F8F6F1', border:'1px solid #E5E0D5', borderRadius:20, padding:'2px 10px', fontSize:12, color:'#374151' }}>{s}</span>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Link to={`/workers/${worker._id}`} className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }}>View Profile</Link>
        </div>
      </div>
    </div>
  );
}

export default function WorkersPage() {
  const [searchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    skill: searchParams.get('skill') || '',
    district: searchParams.get('district') || '',
    available: '',
    minRate: '',
    maxRate: '',
  });

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWorkers(Object.fromEntries(Object.entries(filters).filter(([,v]) => v)));
      setWorkers(res.data.workers);
      setTotal(res.data.total);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const handleSearch = (e) => { e.preventDefault(); fetchWorkers(); };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', marginBottom:8 }}>Find Workers</h1>
          <p style={{ color:'#6B7280' }}>Browse verified workers across Kashmir. {total > 0 && `${total} workers found.`}</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
            <input className="form-input" placeholder="Search by name..." value={filters.search} onChange={e => setFilters({...filters, search:e.target.value})} style={{ paddingLeft:38, width:'100%' }} />
          </div>
          <select className="form-input form-select" value={filters.skill} onChange={e => setFilters({...filters, skill:e.target.value})} style={{ minWidth:160 }}>
            <option value="">All Skills</option>
            {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="form-input form-select" value={filters.district} onChange={e => setFilters({...filters, district:e.target.value})} style={{ minWidth:160 }}>
            <option value="">All Districts</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn btn-outline"><Filter size={16} />Filters</button>
          <button type="submit" className="btn btn-primary"><Search size={16} />Search</button>
        </form>

        {showFilters && (
          <div className="card" style={{ marginBottom:20, padding:20, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16 }}>
            <div className="form-group">
              <label className="form-label">Availability</label>
              <select className="form-input form-select" value={filters.available} onChange={e => setFilters({...filters, available:e.target.value})}>
                <option value="">Any</option>
                <option value="true">Available Now</option>
                <option value="false">Busy</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Min Rate (₹/day)</label>
              <input className="form-input" type="number" placeholder="300" value={filters.minRate} onChange={e => setFilters({...filters, minRate:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Rate (₹/day)</label>
              <input className="form-input" type="number" placeholder="2000" value={filters.maxRate} onChange={e => setFilters({...filters, maxRate:e.target.value})} />
            </div>
          </div>
        )}

        {/* Workers grid */}
        {loading ? (
          <div className="grid-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:280 }} />)}
          </div>
        ) : workers.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#9CA3AF' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <h3 style={{ color:'#374151', marginBottom:8 }}>No workers found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid-3">
            {workers.map(w => <WorkerCard key={w._id} worker={w} />)}
          </div>
        )}
      </div>
    </div>
  );
}
