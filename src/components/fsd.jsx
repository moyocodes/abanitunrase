import { useState, useEffect, useRef } from "react";

const HERO_IMAGE = "/mnt/user-data/uploads/1779722615930_image.png";
const HOW_IT_WORKS_BG = "/mnt/user-data/uploads/1779722640736_image.png";
const HERO_PLAYERS = "/mnt/user-data/uploads/1779722628256_image.png";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=Barlow+Condensed:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}

:root {
  --cyan:#00e5c8;
  --cyan2:#00bfa5;
  --dark:#0a0a0a;
  --dark2:#0d0d0d;
  --dark3:#111111;
  --dark4:#1a1a1a;
  --border:rgba(255,255,255,0.08);
  --gray:rgba(255,255,255,0.5);
}

body{font-family:'DM Sans',sans-serif;background:var(--dark);color:#fff;overflow-x:hidden;}

/* ===== NAV ===== */
.nav{
  position:sticky;top:0;z-index:200;
  background:rgba(13,13,13,0.95);
  backdrop-filter:blur(12px);
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 48px;height:62px;
  animation:slideDown 0.5s ease both;
}
@keyframes slideDown{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}

.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;}
.nav-logo-img{
  width:38px;height:38px;
  background:var(--cyan);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:20px;
  overflow:hidden;
}
.nav-logo-text{
  font-family:'Barlow Condensed',sans-serif;
  font-weight:800;font-size:14px;
  text-transform:uppercase;line-height:1.1;
  color:#fff;
}
.nav-links{display:flex;gap:32px;list-style:none;}
.nav-links a{
  color:rgba(255,255,255,0.7);text-decoration:none;
  font-size:13.5px;font-weight:500;
  transition:color 0.2s;
}
.nav-links a:hover{color:#fff;}
.nav-actions{display:flex;gap:10px;align-items:center;}
.btn-ghost{
  background:none;border:none;color:rgba(255,255,255,0.8);
  font-size:13.5px;font-weight:500;cursor:pointer;
  font-family:'DM Sans',sans-serif;padding:6px 14px;
  transition:color 0.2s;
}
.btn-ghost:hover{color:#fff;}
.btn-primary{
  background:var(--cyan);border:none;color:#000;
  font-size:13px;font-weight:700;cursor:pointer;
  font-family:'DM Sans',sans-serif;
  padding:8px 22px;border-radius:5px;
  transition:all 0.2s;
}
.btn-primary:hover{background:var(--cyan2);transform:translateY(-1px);}

/* ===== HERO ===== */
.hero{
  position:relative;min-height:480px;
  background:linear-gradient(135deg,#071510 0%,#0b1e18 40%,#061009 100%);
  overflow:hidden;display:flex;align-items:center;
  padding:60px 48px;
}
.hero-bg-image{
  position:absolute;inset:0;
  background-image:url('https://images.unsplash.com/photo-1540747913346-19212a4b1bd5?w=1600&q=80');
  background-size:cover;background-position:center;
  opacity:0.12;
}
.hero-overlay{
  position:absolute;inset:0;
  background:
    linear-gradient(to right,#071510 40%,rgba(7,21,16,0.6) 70%,rgba(7,21,16,0.3) 100%),
    linear-gradient(to top,#071510 0%,transparent 40%);
}
.hero-banners{
  position:absolute;top:0;left:0;right:0;
  display:flex;gap:0;pointer-events:none;
}
.hero-banner{
  width:36px;height:52px;
  clip-path:polygon(0 0,100% 0,100% 78%,50% 100%,0 78%);
  margin-right:14px;
  animation:bannerDrop 0.6s ease both;
}
@keyframes bannerDrop{from{transform:translateY(-60px);opacity:0}to{transform:translateY(0);opacity:1}}

.hero-content{
  position:relative;z-index:3;max-width:520px;
  animation:heroIn 0.8s ease both 0.2s;
}
@keyframes heroIn{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}

.hero-title{
  font-family:'Barlow',sans-serif;
  font-weight:900;font-style:italic;
  font-size:62px;line-height:0.92;
  text-transform:uppercase;color:#fff;
  margin-bottom:10px;
}
.hero-title .accent{color:var(--cyan);}
.hero-subtitle{
  font-size:14px;color:rgba(255,255,255,0.5);
  margin-bottom:32px;line-height:1.6;
  max-width:360px;
}
.hero-btns{display:flex;gap:12px;}
.btn-outline{
  background:transparent;
  border:1.5px solid rgba(255,255,255,0.4);
  color:#fff;font-size:13px;font-weight:600;
  cursor:pointer;font-family:'DM Sans',sans-serif;
  padding:9px 22px;border-radius:5px;
  display:flex;align-items:center;gap:6px;
  transition:all 0.2s;
}
.btn-outline:hover{border-color:rgba(255,255,255,0.8);transform:translateY(-1px);}

/* hero right side */
.hero-right{
  position:absolute;right:0;top:0;bottom:0;width:58%;
  animation:heroRight 0.9s ease both 0.3s;
}
@keyframes heroRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}

.hero-players-img{
  position:absolute;bottom:0;right:0;
  width:90%;height:100%;
  object-fit:contain;object-position:bottom center;
  filter:drop-shadow(0 0 40px rgba(0,229,200,0.15));
}
.hero-players-placeholder{
  position:absolute;bottom:0;right:0;
  width:90%;height:100%;
  background:linear-gradient(135deg,rgba(0,229,200,0.05),rgba(0,100,80,0.1));
  border-radius:8px 8px 0 0;
  display:flex;align-items:center;justify-content:center;
  flex-direction:column;gap:8px;
}
.hero-img-overlay{
  position:absolute;inset:0;
  background:
    linear-gradient(to right,#071510 0%,transparent 25%),
    linear-gradient(to top,#071510 0%,transparent 20%);
}

/* floating badges */
.badge{
  position:absolute;z-index:5;
  background:rgba(15,30,23,0.9);
  border:1px solid rgba(0,229,200,0.25);
  border-radius:10px;padding:8px 12px;
  display:flex;align-items:center;gap:8px;
  backdrop-filter:blur(8px);
  box-shadow:0 8px 32px rgba(0,0,0,0.5);
  animation:badgeFloat 3s ease-in-out infinite;
}
.badge-1{top:15%;right:52%;animation-delay:0s;}
.badge-2{bottom:22%;right:50%;animation-delay:1s;}
.badge-3{top:28%;right:8%;animation-delay:0.5s;}
@keyframes badgeFloat{
  0%,100%{transform:translateY(0px);}
  50%{transform:translateY(-6px);}
}
.badge-icon{font-size:18px;}
.badge-label{font-size:9px;color:var(--cyan);font-weight:700;letter-spacing:0.06em;display:block;}
.badge-val{font-size:13px;font-weight:800;color:#fff;}

/* phone mockup */
.phone{
  position:absolute;right:14%;top:8%;
  width:155px;
  background:#16213e;
  border-radius:22px;
  border:2px solid rgba(255,255,255,0.1);
  padding:8px;
  box-shadow:0 24px 64px rgba(0,0,0,0.7);
  z-index:4;
  animation:phoneIn 1s ease both 0.5s;
}
@keyframes phoneIn{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
.phone-screen{
  background:linear-gradient(145deg,#0d2a1f,#1a3a2a);
  border-radius:16px;padding:10px;
  display:flex;flex-direction:column;gap:8px;
}
.phone-pitch{
  width:100%;height:120px;
  background:#1a4a30;border-radius:8px;
  position:relative;overflow:hidden;
  border:1px solid rgba(255,255,255,0.08);
}
.pitch-line{
  position:absolute;
  border:1px solid rgba(255,255,255,0.12);
}
.pitch-line.border{inset:4px;border-radius:4px;}
.pitch-line.center-circle{
  width:36px;height:36px;border-radius:50%;
  top:50%;left:50%;transform:translate(-50%,-50%);
}
.pitch-line.halfway{
  left:50%;top:4px;bottom:4px;width:0;
}
.pdot{
  width:7px;height:7px;background:var(--cyan);border-radius:50%;
  position:absolute;box-shadow:0 0 6px var(--cyan);
  animation:pulse 2s ease-in-out infinite;
}
@keyframes pulse{0%,100%{box-shadow:0 0 4px var(--cyan)}50%{box-shadow:0 0 10px var(--cyan),0 0 20px rgba(0,229,200,0.3)}}
.phone-row{
  display:flex;justify-content:space-between;align-items:center;
  background:rgba(255,255,255,0.06);
  border-radius:4px;padding:4px 7px;
  font-size:8.5px;
}
.phone-row-val{color:var(--cyan);font-weight:700;}

/* ===== HOW IT WORKS ===== */
.hiw{background:#0e0e0e;padding:52px 48px 0;}
.hiw-header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:0;
}
.section-title{
  font-family:'Barlow',sans-serif;
  font-weight:700;font-size:30px;color:#fff;
}
.btn-cyan-outline{
  background:transparent;
  border:1.5px solid var(--cyan);
  color:var(--cyan);font-size:12.5px;font-weight:600;
  cursor:pointer;font-family:'DM Sans',sans-serif;
  padding:7px 18px;border-radius:5px;
  display:flex;align-items:center;gap:6px;
  transition:all 0.2s;
}
.btn-cyan-outline:hover{background:rgba(0,229,200,0.08);}

.hiw-arena{
  position:relative;height:520px;
  margin:0 -48px;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
}
.hiw-arena-bg-img{
  position:absolute;inset:0;
  object-fit:cover;width:100%;height:100%;
  opacity:0.55;
}
.hiw-arena-overlay{
  position:absolute;inset:0;
  background:
    linear-gradient(to bottom,#0e0e0e 0%,rgba(14,14,14,0.15) 20%,rgba(14,14,14,0.15) 75%,#0e0e0e 100%),
    linear-gradient(to right,#0e0e0e 0%,transparent 15%,transparent 85%,#0e0e0e 100%),
    radial-gradient(ellipse 70% 80% at 50% 60%,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.6) 100%);
}
.hiw-cards{
  position:relative;z-index:2;
  display:grid;
  grid-template-columns:210px 230px 210px;
  grid-template-rows:auto auto;
  gap:14px;
  align-items:start;
  justify-items:center;
}
.hiw-card{
  background:#fff;color:#111;
  border-radius:14px;padding:26px 22px;
  text-align:center;width:100%;
  box-shadow:0 12px 40px rgba(0,0,0,0.6);
  transition:transform 0.25s ease;
}
.hiw-card:hover{transform:translateY(-4px);}
.hiw-card.left{margin-top:50px;}
.hiw-card.right{margin-top:50px;}
.hiw-card-icon{
  width:48px;height:48px;
  background:#f4f4f4;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 14px;font-size:24px;
}
.hiw-card h3{
  font-family:'Barlow',sans-serif;
  font-weight:800;font-size:17px;
  color:#111;margin-bottom:8px;
}
.hiw-card p{font-size:12px;color:#555;line-height:1.7;}

/* ===== STANDINGS ===== */
.standings{background:var(--dark);padding:68px 48px;}
.standings-header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:24px;
}
.tab-group{display:flex;gap:4px;}
.tab{
  background:transparent;border:none;
  color:rgba(255,255,255,0.4);
  font-size:12.5px;font-weight:500;cursor:pointer;
  font-family:'DM Sans',sans-serif;
  padding:5px 14px;border-radius:4px;
  transition:all 0.2s;
}
.tab.active{background:rgba(255,255,255,0.09);color:#fff;}
.table-wrap{
  border:1px solid var(--border);
  border-radius:10px;overflow:hidden;
}
table{width:100%;border-collapse:collapse;}
thead tr{background:#111;border-bottom:1px solid var(--border);}
thead th{
  padding:13px 16px;text-align:left;
  font-size:10px;font-weight:600;
  letter-spacing:0.08em;text-transform:uppercase;
  color:rgba(255,255,255,0.35);
}
thead th:last-child{text-align:right;}
tbody tr{
  border-bottom:1px solid rgba(255,255,255,0.04);
  transition:background 0.15s;
}
tbody tr:last-child{border-bottom:none;}
tbody tr:hover{background:rgba(255,255,255,0.03);}
td{padding:14px 16px;font-size:13px;color:rgba(255,255,255,0.85);}
td:last-child{text-align:right;font-weight:600;}
.rank-num{color:rgba(255,255,255,0.35);font-size:12px;}
.user-cell{display:flex;align-items:center;gap:10px;}
.avatar{
  width:34px;height:34px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;color:#fff;flex-shrink:0;
}
.user-name{font-size:13px;font-weight:500;color:#fff;}
.user-team{font-size:11px;color:var(--cyan);}
.cta-row{display:flex;justify-content:center;margin-top:28px;}
.btn-pill{
  background:transparent;
  border:1.5px solid rgba(255,255,255,0.2);
  color:#fff;font-size:13px;font-weight:600;
  cursor:pointer;font-family:'DM Sans',sans-serif;
  padding:10px 30px;border-radius:30px;
  display:flex;align-items:center;gap:8px;
  transition:all 0.2s;
}
.btn-pill:hover{border-color:rgba(255,255,255,0.5);transform:translateY(-1px);}

/* ===== NEWS ===== */
.news{background:#060606;padding:76px 48px;}
.news-title{
  font-family:'Barlow',sans-serif;
  font-weight:800;font-size:34px;
  text-align:center;color:#fff;
  margin-bottom:42px;
}
.news-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;}
.news-card{cursor:pointer;transition:transform 0.25s ease;}
.news-card:hover{transform:translateY(-4px);}
.news-thumb{
  width:100%;height:168px;
  border-radius:12px;overflow:hidden;
  margin-bottom:16px;
  position:relative;
  background:linear-gradient(135deg,#1a2a22,#0d1a14);
}
.news-thumb img{
  width:100%;height:100%;
  object-fit:cover;
}
.news-thumb-placeholder{
  width:100%;height:100%;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:8px;
  font-size:11px;color:rgba(255,255,255,0.3);
  font-weight:500;
}
.news-thumb-icon{font-size:36px;}
.news-card-title{
  font-family:'Barlow',sans-serif;
  font-weight:700;font-size:15.5px;
  color:#fff;margin-bottom:8px;
}
.news-card-desc{
  font-size:12px;color:rgba(255,255,255,0.48);
  line-height:1.65;margin-bottom:16px;
}
.btn-link{
  background:none;border:none;
  color:var(--cyan);font-size:12px;font-weight:600;
  cursor:pointer;font-family:'DM Sans',sans-serif;
  padding:0;display:flex;align-items:center;gap:4px;
}
.btn-link:hover{opacity:0.8;}

/* ===== NEWSLETTER ===== */
.newsletter{
  background:var(--dark);
  padding:64px 48px;
  border-top:1px solid rgba(255,255,255,0.05);
  display:flex;align-items:center;justify-content:space-between;gap:32px;
}
.newsletter h3{
  font-family:'Barlow',sans-serif;
  font-weight:700;font-size:24px;
  color:#fff;margin-bottom:4px;
}
.newsletter p{font-size:13px;color:rgba(255,255,255,0.42);}
.nl-form{
  display:flex;border-radius:6px;overflow:hidden;
  border:1px solid rgba(255,255,255,0.12);
}
.nl-input{
  background:#111;border:none;outline:none;
  color:#fff;font-size:13px;
  font-family:'DM Sans',sans-serif;
  padding:11px 18px;width:270px;
}
.nl-input::placeholder{color:rgba(255,255,255,0.28);}

/* ===== FOOTER ===== */
footer{
  background:#040404;
  padding:52px 48px 32px;
  border-top:1px solid rgba(255,255,255,0.05);
}
.footer-inner{
  display:grid;
  grid-template-columns:200px 1fr 1fr 1fr 1fr;
  gap:40px;margin-bottom:40px;
}
.footer-logo-mark{
  width:68px;height:68px;
  background:var(--cyan);border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:30px;margin-bottom:10px;
  overflow:hidden;
}
.footer-logo-name{
  font-family:'Barlow Condensed',sans-serif;
  font-weight:800;font-size:18px;
  text-transform:uppercase;line-height:1.1;color:#fff;
}
.footer-col-title{
  font-size:11px;font-weight:600;
  color:rgba(255,255,255,0.38);
  text-transform:uppercase;letter-spacing:0.07em;
  margin-bottom:14px;
}
.footer-links{list-style:none;display:flex;flex-direction:column;gap:10px;}
.footer-links a{
  color:rgba(255,255,255,0.5);text-decoration:none;
  font-size:13px;transition:color 0.2s;
}
.footer-links a:hover{color:#fff;}
.footer-bottom{
  border-top:1px solid rgba(255,255,255,0.06);
  padding-top:20px;font-size:12px;
  color:rgba(255,255,255,0.22);text-align:center;
}

/* ===== SCROLL ANIMATIONS ===== */
.fade-up{
  opacity:0;transform:translateY(30px);
  transition:opacity 0.7s ease,transform 0.7s ease;
}
.fade-up.visible{opacity:1;transform:translateY(0);}
.stagger-1{transition-delay:0.1s;}
.stagger-2{transition-delay:0.2s;}
.stagger-3{transition-delay:0.3s;}
`;

const avatarColors = [
  '#1a7a55','#7a2a55','#1a5a7a','#5a7a1a','#7a5a1a','#3a4a8a','#6a2a7a'
];

const standings = [
  {rank:1,name:'Philip Gbobo',team:'Finx FC',gw:1,pts:1260},
  {rank:2,name:'Victoria Oduah',team:'Finx FC',gw:2,pts:1120},
  {rank:3,name:'Deborah Isa',team:'Finx FC',gw:3,pts:1102},
  {rank:4,name:'Mary Okeke',team:'Finx FC',gw:4,pts:980},
  {rank:5,name:'James Ojo',team:'Finx FC',gw:5,pts:960},
  {rank:6,name:'Esther Pakabo',team:'Finx FC',gw:6,pts:886},
  {rank:7,name:'Mary Bashir',team:'Finx FC',gw:7,pts:874},
];

const newsItems = [
  {
    title:'New week. New challenge.',
    desc:'Start each Gameweek with a blank team sheet, reset budget and a new challenge. Unlimited Budget? 5 strikers? Points for own-goals? Everyone takes it on together.',
    bg:'linear-gradient(135deg,#00e5c8 0%,#00b89a 40%,#007a60 100%)',
    icon:'🃏',
    label:'PLACE IMAGE HERE',
  },
  {
    title:'Ever-changing Events.',
    desc:'Compete in themed events that completely take over the game. Take on your mates in our current Test Lab event running for the next 4 Gameweeks!',
    bg:'linear-gradient(135deg,#1a6aaa,#0d3a6a 60%,#0a1a3a)',
    icon:'⚽',
    label:'PLACE IMAGE HERE',
  },
  {
    title:'Make transfers anytime.',
    desc:"But watch out — players will be locked into your team as soon as their match kicks off. Managers can select up to 5 players from any one club.",
    bg:'linear-gradient(135deg,#2a4a8a,#1a2a6a 50%,#8a2a6a)',
    icon:'🔄',
    label:'PLACE IMAGE HERE',
  },
];

function useFadeUp() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); }
    }, {threshold:0.15});
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const playerDots = [
  {top:'14%',left:'50%'},{top:'32%',left:'22%'},{top:'32%',left:'78%'},
  {top:'52%',left:'20%'},{top:'52%',left:'80%'},{top:'52%',left:'50%'},
  {top:'72%',left:'35%'},{top:'72%',left:'65%'},{top:'85%',left:'50%'},
];

export default function FantasyShowdown() {
  const [tab, setTab] = useState('This Week');
  const [email, setEmail] = useState('');
  const hiwRef = useFadeUp();
  const standRef = useFadeUp();
  const newsRef = useFadeUp();

  const bannerColors = Array.from({length:20},(_, i) => (
    i%3===0?'var(--cyan)':i%3===1?'#1a3a2a':'#0d2a1a'
  ));

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh'}}>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          {/* <div className="nav-logo-img"> */}
         <img src="/logo.png" alt="Logo" style={{width:'100%',height:'100%',objectFit:'cover'}} /> 
   
          <div className="nav-logo-text">Fantasy<br/>Showdown</div>
        </div>
        <ul className="nav-links">
          {['Home','About FFPL','Football News','FAQs'].map(l=>(
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>
        <div className="nav-actions">
          <button className="btn-ghost">Log in</button>
          <button className="btn-primary">Register</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-image" />
        <div className="hero-overlay" />

        {/* Banner flags */}
        <div className="hero-banners">
          {bannerColors.map((c,i)=>(
            <div key={i} className="hero-banner" style={{
              background:c,
              opacity:0.65+(i%3)*0.12,
              marginTop:i%2===0?'0':'-12px',
              animationDelay:`${i*0.04}s`,
            }}/>
          ))}
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            A NEW ANGLE<br/>
            TO <span className="accent">FANTASY</span><br/>
            <span className="accent">FOOTBALL</span>
          </h1>
          <p className="hero-subtitle">
            A fresh take on fantasy football — pick your team, place your stake, and compete for real cash prizes every gameweek.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" style={{padding:'11px 26px',fontSize:'14px'}}>Get Started</button>
            <button className="btn-outline">Learn more →</button>
          </div>
        </div>

        {/* Right panel */}
        <div className="hero-right">
          {/* Players image placeholder — replace src with actual image */}
          <div className="hero-players-placeholder">
            <span style={{fontSize:48,opacity:0.4}}>👕</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,0.25)',fontWeight:600}}>PLAYERS IMAGE</span>
            <span style={{fontSize:10,color:'rgba(255,255,255,0.15)'}}>Upload player photo here</span>
          </div>
          <div className="hero-img-overlay" />

          {/* Floating badges */}
          <div className="badge badge-1">
            <span className="badge-icon">🏆</span>
            <div>
              <span className="badge-label">GAME BY GAME</span>
              <span className="badge-val">Active</span>
            </div>
          </div>
          <div className="badge badge-2">
            <span className="badge-icon">💰</span>
            <div>
              <span className="badge-label">WIN CASH PRIZES</span>
              <span className="badge-val">Live</span>
            </div>
          </div>
          <div className="badge badge-3" style={{flexDirection:'column',alignItems:'flex-start',gap:2}}>
            <span style={{fontSize:9,color:'var(--cyan)',fontWeight:700,letterSpacing:'0.06em'}}>SOCIAL BETTING</span>
            <span style={{fontSize:12,fontWeight:700}}>Join 12,000+ players</span>
          </div>

          {/* Phone mockup */}
          <div className="phone">
            <div className="phone-screen">
              <div className="phone-pitch">
                <div className="pitch-line border"/>
                <div className="pitch-line center-circle"/>
                <div className="pitch-line halfway"/>
                {playerDots.map((d,i)=>(
                  <div key={i} className="pdot" style={{
                    top:d.top,left:d.left,
                    transform:'translate(-50%,-50%)',
                    animationDelay:`${i*0.3}s`,
                    background:i>=6?'rgba(255,255,255,0.5)':'var(--cyan)',
                    boxShadow:i>=6?'none':'0 0 6px var(--cyan)',
                  }}/>
                ))}
              </div>
              {['Philip G. — 1260 pts','Victoria O. — 1120 pts','Deborah I. — 1102 pts'].map((s,i)=>(
                <div key={i} className="phone-row">
                  <span>#{i+1} {s.split('—')[0]}</span>
                  <span className="phone-row-val">{s.split('—')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="hiw">
        <div className="hiw-header">
          <h2 className="section-title">How it works</h2>
          <button className="btn-cyan-outline">Get Started →</button>
        </div>

        <div className="hiw-arena" ref={hiwRef}>
          {/* Stadium image — using a real stadium photo */}
          <img
            className="hiw-arena-bg-img"
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80"
            alt="Stadium"
            onError={e=>{e.target.style.display='none';}}
          />
          <div className="hiw-arena-overlay"/>

          <div className="hiw-cards fade-up" style={{opacity:1,transform:'none'}}>
            {/* Left */}
            <div className="hiw-card left stagger-1 fade-up" ref={useFadeUp()}>
              <div className="hiw-card-icon">🪙</div>
              <h3>Fund your Wallet</h3>
              <p>Easily add funds to your wallet to get started. Choose from multiple secure payment methods, top up your balance, and be ready to stake on your favorite fantasy games in minutes!</p>
            </div>

            {/* Center top */}
            <div className="hiw-card center stagger-2 fade-up" ref={useFadeUp()}>
              <div className="hiw-card-icon">🎯</div>
              <h3>Make a Stake</h3>
              <p>Place your stake on upcoming games or events, predict the outcomes, and join staking pools. Increase your chances of winning by backing your favourite players and teams!</p>
            </div>

            {/* Right */}
            <div className="hiw-card right stagger-3 fade-up" ref={useFadeUp()}>
              <div className="hiw-card-icon">🏆</div>
              <h3>Challenge &amp; Win</h3>
              <p>Rack up points with each successful prediction, climb the leaderboard, and unlock rewards. The more you play and win, the higher you rank—and the bigger your prizes!</p>
            </div>

            {/* Bottom center */}
            <div className="hiw-card fade-up" style={{gridColumn:2,gridRow:2}} ref={useFadeUp()}>
              <div className="hiw-card-icon">⭐</div>
              <h3>Earn Points</h3>
              <p>Rack up points with each successful prediction, climb the leaderboard, and unlock rewards. The more you play and win, the higher you rank—and the bigger your prizes!</p>
            </div>
          </div>
        </div>
      </section>

      {/* STANDINGS */}
      <section className="standings" ref={standRef}>
        <div className="standings-header fade-up" ref={useFadeUp()}>
          <h2 className="section-title">Overall Standings</h2>
          <div className="tab-group">
            {['This Week','This Month','All Time'].map(t=>(
              <button key={t} className={`tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="table-wrap fade-up" ref={useFadeUp()}>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th colSpan={2}>User &amp; Team</th>
                <th style={{textAlign:'center'}}>Gameweek</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s,i)=>(
                <tr key={s.rank}>
                  <td className="rank-num">{s.rank}</td>
                  <td colSpan={2}>
                    <div className="user-cell">
                      <div className="avatar" style={{background:avatarColors[i]}}>
                        {s.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="user-name">{s.name}</div>
                        <div className="user-team">{s.team}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{color:'rgba(255,255,255,0.45)',textAlign:'center'}}>{s.gw}</td>
                  <td>{s.pts.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cta-row">
          <button className="btn-pill">Register to join the fun →</button>
        </div>
      </section>

      {/* NEWS */}
      <section className="news" ref={newsRef}>
        <h2 className="news-title fade-up" ref={useFadeUp()}>Catch up with the Latest!</h2>
        <div className="news-grid">
          {newsItems.map((item,i)=>(
            <div key={i} className="news-card fade-up" ref={useFadeUp()} style={{transitionDelay:`${i*0.12}s`}}>
              <div className="news-thumb">
                {/* Placeholder — replace with <img src="..." /> */}
                <div className="news-thumb-placeholder" style={{background:item.bg}}>
                  <span className="news-thumb-icon">{item.icon}</span>
                  <span style={{fontSize:9,letterSpacing:'0.06em',fontWeight:700}}>{item.label}</span>
                </div>
              </div>
              <h4 className="news-card-title">{item.title}</h4>
              <p className="news-card-desc">{item.desc}</p>
              <button className="btn-link">Read more →</button>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <div>
          <h3>Stay updated!</h3>
          <p>We'll send you nice updates once per week. No spam.</p>
        </div>
        <div className="nl-form">
          <input
            className="nl-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
          <button className="btn-primary" style={{borderRadius:0,padding:'11px 22px'}}>Subscribe</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-logo-mark">
              <span>⚽</span>
            </div>
            <div className="footer-logo-name">Fantasy<br/>Showdown</div>
          </div>
          {[
            {title:'Home',links:['Players','Clubs','Tickets','Fixtures','Results']},
            {title:'Contact',links:['Customer Care','Facebook','X','Instagram']},
            {title:'FAQs',links:['Statistics','Help','Status']},
            {title:'Legal',links:['Terms','Privacy','Cookies']},
          ].map(col=>(
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <ul className="footer-links">
                {col.links.map(l=><li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">© 2024 Fantasy Showdown. All rights reserved.</div>
      </footer>
    </div>
  );
}