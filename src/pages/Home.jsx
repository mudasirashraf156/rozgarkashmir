import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, CheckCircle, Star, Briefcase, ArrowRight, Shield, Zap, MapPin } from 'lucide-react';
import { getWorkers } from '../utils/api';
import WorkerCard from '../components/WorkerCard';

const SKILLS = ['Carpenter', 'Plumber', 'Electrician', 'Painter', 'Mason', 'Gardener', 'Driver', 'Cook', 'Welder', 'Tailor'];
const DISTRICTS = ['Srinagar', 'Baramulla', 'Anantnag', 'Pulwama', 'Sopore', 'Budgam', 'Kupwara', 'Ganderbal'];

export default function Home() {
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [featuredWorkers, setFeaturedWorkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getWorkers({ limit: 3 }).then(res => setFeaturedWorkers(res.data.workers)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('skill', search);
    if (district) params.set('district', district);
    navigate(`/workers?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1A3A5C 0%, #254D7A 50%, #1A3A5C 100%)',
        padding: '72px 0 80px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,107,0,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,140,56,0.1) 0%, transparent 50%)' }}/>
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,107,0,0.18)', border: '1px solid rgba(255,107,0,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: '#FF8C38', fontWeight: 600, letterSpacing: '0.5px' }}>🏔️ BUILT FOR KASHMIR</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.15 }}>
            Find Trusted Local Workers<br/>
            <span style={{ color: '#FF8C38' }}>Across Kashmir</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(15px, 2vw, 18px)', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Connect with verified daily wage labourers and gig workers. Quick hiring, fair pay, trusted work.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 620, margin: '0 auto 20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 2, minWidth: 180 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8A8A8A' }}/>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Skill (e.g. Plumber, Carpenter)"
                style={{ width: '100%', padding: '13px 14px 13px 38px', borderRadius: 10, border: 'none', fontSize: 15, background: 'white', outline: 'none' }}
              />
            </div>
            <div style={{ position: 'relative', flex: 1, minWidth: 140 }}>
              <MapPin size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8A8A8A' }}/>
              <select value={district} onChange={e => setDistrict(e.target.value)}
                style={{ width: '100%', padding: '13px 12px 13px 30px', borderRadius: 10, border: 'none', fontSize: 14, background: 'white', appearance: 'none', outline: 'none', cursor: 'pointer' }}>
                <option value="">All Districts</option>
                {DISTRICTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '13px 24px', borderRadius: 10, fontSize: 15 }}>
              <Search size={15}/> Search
            </button>
          </form>

          {/* Quick skill chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {SKILLS.slice(0, 6).map(skill => (
              <button key={skill} onClick={() => navigate(`/workers?skill=${skill}`)}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '5px 14px', color: 'rgba(255,255,255,0.85)', fontSize: 13, cursor: 'pointer', transition: '0.2s' }}
                onMouseOver={e => { e.target.style.background = 'rgba(255,107,0,0.3)'; e.target.style.borderColor = '#FF6B00'; }}
                onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              >{skill}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'white', padding: '32px 0', borderBottom: '1.5px solid #E8DDD0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, textAlign: 'center' }}>
            {[
              { val: '500+', label: 'Verified Workers', icon: '👷' },
              { val: '12', label: 'Districts Covered', icon: '📍' },
              { val: '1000+', label: 'Jobs Completed', icon: '✅' },
              { val: '4.7★', label: 'Avg Rating', icon: '⭐' }
            ].map(({ val, label, icon }) => (
              <div key={label}>
                <div style={{ fontSize: 28, marginBottom: 2 }}>{icon}</div>
                <div style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 26, color: '#FF6B00' }}>{val}</div>
                <div style={{ color: '#8A8A8A', fontSize: 13 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '60px 0', background: '#FFFAF5' }}>
        <div className="container">
          <div className="section-header text-center">
            <h2 style={{ fontSize: 30 }}>How RozgarKashmir Works</h2>
            <p className="text-muted" style={{ marginTop: 8 }}>Simple, fast, and trusted</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginTop: 36 }}>
            {[
              { step: '01', icon: '🔍', title: 'Search Workers', desc: 'Browse verified workers by skill, district, and availability.' },
              { step: '02', icon: '📋', title: 'Send Request', desc: 'Book with your job details, date, and agreed daily rate.' },
              { step: '03', icon: '✅', title: 'Worker Confirms', desc: 'The worker accepts and shows up ready to work.' },
              { step: '04', icon: '⭐', title: 'Rate & Review', desc: 'After work, leave a review to help others decide.' }
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ textAlign: 'center', padding: '28px 20px', background: 'white', borderRadius: 14, border: '1.5px solid #E8DDD0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 36, color: '#FF6B00', opacity: 0.1 }}>{step}</div>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 17, marginBottom: 8, color: '#1A3A5C' }}>{title}</h3>
                <p style={{ color: '#8A8A8A', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Workers */}
      {featuredWorkers.length > 0 && (
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: 28 }}>Top Rated Workers</h2>
                <p className="text-muted">Trusted by hundreds of employers</p>
              </div>
              <Link to="/workers" className="btn btn-outline btn-sm">View All <ArrowRight size={14}/></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {featuredWorkers.map(w => <WorkerCard key={w._id} worker={w}/>)}
            </div>
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section style={{ padding: '60px 0', background: '#1A3A5C', color: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', color: 'white', fontSize: 28, marginBottom: 36 }}>Why Choose RozgarKashmir?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { icon: <Shield size={28} color="#FF8C38"/>, title: 'Verified Workers', desc: 'Every worker is ID-verified by our admin team before they can take jobs.' },
              { icon: <Zap size={28} color="#FF8C38"/>, title: 'Quick Hiring', desc: 'Book a worker in minutes. No lengthy calls or negotiations needed.' },
              { icon: <Star size={28} color="#FF8C38"/>, title: 'Rated & Reviewed', desc: 'Real reviews from real employers. Make informed decisions.' },
              { icon: <MapPin size={28} color="#FF8C38"/>, title: 'Local First', desc: 'Built specifically for Kashmir, covering all 12 districts of the valley.' }
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontFamily: "'Baloo 2'", color: 'white', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 0', textAlign: 'center', background: '#FFFAF5' }}>
        <div className="container">
          <h2 style={{ fontSize: 30, marginBottom: 12 }}>Ready to Get Started?</h2>
          <p className="text-muted" style={{ marginBottom: 28, fontSize: 16 }}>Join thousands of workers and employers on RozgarKashmir</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Register as Worker</Link>
            <Link to="/workers" className="btn btn-secondary btn-lg">Hire a Worker</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
