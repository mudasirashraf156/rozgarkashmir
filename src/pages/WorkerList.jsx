import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getWorkers } from '../utils/api';
import WorkerCard from '../components/WorkerCard';

const SKILLS = ['Carpenter', 'Plumber', 'Electrician', 'Painter', 'Mason', 'Gardener', 'Driver', 'Cook', 'Welder', 'Tailor', 'Security Guard', 'General Labour'];
const DISTRICTS = ['Srinagar', 'Ganderbal', 'Budgam', 'Pulwama', 'Shopian', 'Kulgam', 'Anantnag', 'Islamabad', 'Baramulla', 'Kupwara', 'Bandipora', 'Sopore'];

export default function WorkerList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    skill: searchParams.get('skill') || '',
    district: searchParams.get('district') || '',
    minRate: '',
    maxRate: '',
    available: '',
    search: '',
    page: 1
  });

  const fetchWorkers = async (f = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (f.skill) params.skill = f.skill;
      if (f.district) params.district = f.district;
      if (f.minRate) params.minRate = f.minRate;
      if (f.maxRate) params.maxRate = f.maxRate;
      if (f.available) params.available = f.available;
      if (f.search) params.search = f.search;
      params.page = f.page;
      params.limit = 12;
      const res = await getWorkers(params);
      setWorkers(res.data.workers);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const handleFilter = (key, val) => {
    const updated = { ...filters, [key]: val, page: 1 };
    setFilters(updated);
    fetchWorkers(updated);
  };

  const clearFilters = () => {
    const reset = { skill: '', district: '', minRate: '', maxRate: '', available: '', search: '', page: 1 };
    setFilters(reset);
    fetchWorkers(reset);
    setSearchParams({});
  };

  const changePage = (p) => {
    const updated = { ...filters, page: p };
    setFilters(updated);
    fetchWorkers(updated);
    window.scrollTo(0, 0);
  };

  const activeFiltersCount = [filters.skill, filters.district, filters.minRate, filters.maxRate, filters.available].filter(Boolean).length;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="page-title">Find Workers</h1>
          <p className="page-subtitle">{total} verified workers available across Kashmir</p>
        </div>

        {/* Search + Filter toggle */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8A8A8A' }}/>
            <input className="input" placeholder="Search by name..." value={filters.search}
              onChange={e => handleFilter('search', e.target.value)}
              style={{ paddingLeft: 36 }} />
          </div>
          <button className="btn btn-ghost" onClick={() => setShowFilters(!showFilters)} style={{ position: 'relative' }}>
            <Filter size={15}/> Filters
            {activeFiltersCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: '#FF6B00', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{activeFiltersCount}</span>}
          </button>
          {activeFiltersCount > 0 && (
            <button className="btn btn-ghost" onClick={clearFilters} style={{ color: '#C62828' }}>
              <X size={14}/> Clear
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="card" style={{ marginBottom: 20, padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Skill</label>
                <select className="select" value={filters.skill} onChange={e => handleFilter('skill', e.target.value)}>
                  <option value="">All Skills</option>
                  {SKILLS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <select className="select" value={filters.district} onChange={e => handleFilter('district', e.target.value)}>
                  <option value="">All Districts</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Min Rate (₹/day)</label>
                <input className="input" type="number" placeholder="e.g. 300" value={filters.minRate}
                  onChange={e => handleFilter('minRate', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Rate (₹/day)</label>
                <input className="input" type="number" placeholder="e.g. 1000" value={filters.maxRate}
                  onChange={e => handleFilter('maxRate', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <select className="select" value={filters.available} onChange={e => handleFilter('available', e.target.value)}>
                  <option value="">Any</option>
                  <option value="true">Available Now</option>
                  <option value="false">Busy</option>
                </select>
              </div>
            </div>

            {/* Skill chips */}
            <div style={{ marginTop: 14 }}>
              <div className="form-label" style={{ marginBottom: 8 }}>Quick Select Skill:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SKILLS.map(s => (
                  <button key={s} onClick={() => handleFilter('skill', filters.skill === s ? '' : s)}
                    style={{ padding: '4px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer', border: '1.5px solid', transition: '0.15s',
                      background: filters.skill === s ? '#FF6B00' : 'transparent',
                      color: filters.skill === s ? 'white' : '#4A4A4A',
                      borderColor: filters.skill === s ? '#FF6B00' : '#E8DDD0'
                    }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Workers grid */}
        {loading ? (
          <div className="loading-screen"><div className="spinner"/><span>Finding workers...</span></div>
        ) : workers.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>👷</div>
            <h3>No workers found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="btn btn-primary" onClick={clearFilters} style={{ marginTop: 16 }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {workers.map(w => <WorkerCard key={w._id} worker={w}/>)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 36 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => changePage(filters.page - 1)} disabled={filters.page === 1}>
              <ChevronLeft size={16}/>
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => changePage(p)}
                style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                  background: p === filters.page ? '#FF6B00' : 'white',
                  color: p === filters.page ? 'white' : '#4A4A4A',
                  borderColor: p === filters.page ? '#FF6B00' : '#E8DDD0'
                }}>{p}</button>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => changePage(filters.page + 1)} disabled={filters.page === pages}>
              <ChevronRight size={16}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
