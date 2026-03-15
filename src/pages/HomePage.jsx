import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Star, Zap, Users, Briefcase, MapPin, ChevronRight, CheckCircle } from 'lucide-react';

const SKILLS = ['Carpenter','Electrician','Plumber','Painter','Mason','Driver','Cook','Cleaner','Gardner','Welder'];
const DISTRICTS = ['Srinagar','Baramulla','Anantnag','Pulwama','Kupwara','Sopore','Budgam','Ganderbal'];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #1B4332 100%)', padding:'80px 0 100px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 20% 80%, rgba(244,162,97,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
        <div className="container" style={{ position:'relative', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(244,162,97,0.2)', border:'1px solid rgba(244,162,97,0.4)', borderRadius:20, padding:'6px 16px', marginBottom:24 }}>
            <Zap size={14} color="#F4A261" />
            <span style={{ color:'#F4A261', fontSize:13, fontWeight:600 }}>Kashmir's #1 Labour Platform</span>
          </div>
          <h1 style={{ color:'white', fontSize:'clamp(2rem,5vw,3.5rem)', marginBottom:16, lineHeight:1.15 }}>
            Find Trusted Workers.<br />
            <span style={{ color:'#F4A261' }}>Get Work Done.</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:18, maxWidth:540, margin:'0 auto 40px', lineHeight:1.7 }}>
            Connect with verified daily wage labourers and gig workers across Kashmir. Simple, fast, and reliable.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/workers" className="btn btn-accent btn-lg">
              <Search size={18} />Find Workers
            </Link>
            <Link to="/register?role=worker" className="btn btn-lg" style={{ background:'rgba(255,255,255,0.15)', color:'white', border:'1.5px solid rgba(255,255,255,0.3)', backdropFilter:'blur(10px)' }}>
              Register as Worker
            </Link>
          </div>
          {/* Stats strip */}
          <div style={{ display:'flex', justifyContent:'center', gap:48, marginTop:60, flexWrap:'wrap' }}>
            {[['500+','Workers Registered'],['200+','Jobs Completed'],['50+','Employers'],['15+','Districts']].map(([num, label]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:28, fontWeight:800, color:'#F4A261', fontFamily:'Sora,sans-serif' }}>{num}</div>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills quick-search */}
      <section style={{ background:'#fff', padding:'32px 0', borderBottom:'1px solid #E5E0D5' }}>
        <div className="container">
          <p style={{ textAlign:'center', color:'#6B7280', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>Browse by Skill</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
            {SKILLS.map(skill => (
              <Link key={skill} to={`/workers?skill=${skill}`} style={{ padding:'8px 18px', borderRadius:20, background:'#F8F6F1', border:'1px solid #E5E0D5', color:'#1B4332', fontSize:14, fontWeight:500, transition:'all 0.2s' }}
                onMouseOver={e => { e.target.style.background='#1B4332'; e.target.style.color='white'; }}
                onMouseOut={e => { e.target.style.background='#F8F6F1'; e.target.style.color='#1B4332'; }}>
                {skill}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding:'80px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ color:'#F4A261', fontWeight:700, fontSize:13, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>How It Works</p>
            <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)' }}>Simple as 1-2-3</h2>
          </div>
          <div className="grid-3">
            {[
              { icon:<Search size={28} color="#1B4332" />, step:'01', title:'Search Workers', desc:'Browse verified workers by skill, location, and availability across Kashmir.' },
              { icon:<Shield size={28} color="#1B4332" />, step:'02', title:'Verified Profiles', desc:'Every worker is ID-verified by our team. You hire with confidence.' },
              { icon:<CheckCircle size={28} color="#1B4332" />, step:'03', title:'Book & Done', desc:'Send a booking request, confirm details, and get the work done.' },
            ].map(item => (
              <div key={item.step} className="card" style={{ textAlign:'center', padding:32, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:16, right:16, fontSize:48, fontWeight:900, color:'#F8F6F1', fontFamily:'Sora,sans-serif', lineHeight:1 }}>{item.step}</div>
                <div style={{ width:64, height:64, background:'#D1FAE5', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize:18, marginBottom:10 }}>{item.title}</h3>
                <p style={{ color:'#6B7280', lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Districts */}
      <section style={{ padding:'60px 0', background:'#fff' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)', marginBottom:8 }}>Available Across Kashmir</h2>
            <p style={{ color:'#6B7280' }}>Workers available in all major districts</p>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
            {DISTRICTS.map(d => (
              <Link key={d} to={`/workers?district=${d}`} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', borderRadius:10, border:'1.5px solid #E5E0D5', background:'#F8F6F1', color:'#1B4332', fontWeight:600, fontSize:14, transition:'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.borderColor='#1B4332'}
                onMouseOut={e => e.currentTarget.style.borderColor='#E5E0D5'}>
                <MapPin size={14} color="#F4A261" />{d}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why RozgarKashmir */}
      <section style={{ padding:'80px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <p style={{ color:'#F4A261', fontWeight:700, fontSize:13, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Why Choose Us</p>
              <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', marginBottom:20 }}>Built for Kashmir's Working People</h2>
              <p style={{ color:'#6B7280', lineHeight:1.8, marginBottom:28 }}>
                We understand the local challenges. Rozgar Kashmir is designed for low-end devices, slow internet, and local languages. Our mission is to empower every daily wage worker with dignity and opportunity.
              </p>
              {[
                'ID verification for every worker',
                'Ratings and reviews from real employers',
                'No registration fees for workers',
                'Supports Kashmiri & Urdu language',
                'Works on 2G/3G connections',
              ].map(point => (
                <div key={point} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <CheckCircle size={18} color="#059669" style={{ flexShrink:0 }} />
                  <span style={{ fontSize:15, color:'#374151' }}>{point}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {[
                { icon:<Users size={24} color="#1B4332" />, label:'For Workers', desc:'Find daily work near you. Get discovered by local employers.' },
                { icon:<Briefcase size={24} color="#F4A261" />, label:'For Employers', desc:'Find trusted, verified workers for any task, anytime.' },
                { icon:<Shield size={24} color="#059669" />, label:'Verified & Safe', desc:'Background checked and ID-verified worker profiles.' },
                { icon:<Star size={24} color="#D97706" />, label:'Rated Workers', desc:'See honest reviews from previous employers.' },
              ].map(item => (
                <div key={item.label} className="card" style={{ padding:20 }}>
                  <div style={{ marginBottom:10 }}>{item.icon}</div>
                  <h4 style={{ fontSize:15, marginBottom:6 }}>{item.label}</h4>
                  <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'linear-gradient(135deg,#1B4332,#2D6A4F)', padding:'72px 0', textAlign:'center' }}>
        <div className="container">
          <h2 style={{ color:'white', fontSize:'clamp(1.6rem,3vw,2.2rem)', marginBottom:16 }}>Ready to Get Started?</h2>
          <p style={{ color:'rgba(255,255,255,0.7)', marginBottom:32, fontSize:16 }}>Join hundreds of workers and employers already on the platform.</p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register" className="btn btn-accent btn-lg">Create Free Account</Link>
            <Link to="/workers" className="btn btn-lg" style={{ background:'rgba(255,255,255,0.15)', color:'white', border:'1.5px solid rgba(255,255,255,0.3)' }}>Browse Workers <ChevronRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:'#0D2B20', color:'rgba(255,255,255,0.6)', padding:'40px 0', textAlign:'center' }}>
        <div className="container">
          <div style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:20, color:'white', marginBottom:8 }}>
            Rozgar<span style={{ color:'#F4A261' }}>Kashmir</span>
          </div>
          <p style={{ fontSize:13 }}>Connecting workers with opportunities across Jammu & Kashmir</p>
          <p style={{ fontSize:12, marginTop:16, opacity:0.5 }}>© 2024 RozgarKashmir. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
