import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const STATS = [
  { icon: '<', target: 120, suffix: 'ms', decimals: 0, label: 'Inference Time' },
  { icon: '%', target: 99.99, suffix: '%', decimals: 2, label: 'Platform Uptime' },
  { icon: '*', target: 24, suffix: '/7', decimals: 0, label: 'Autonomous Runtime' },
  { icon: '#', target: 2.4, suffix: 'M', decimals: 1, label: 'Context Windows' },
];

export default function Home() {
  const statsRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nodes = statsRef.current?.querySelectorAll('[data-target]');
    if (!nodes?.length) return;
    let started = false;
    const animate = () => {
      if (started) return;
      started = true;
      nodes.forEach((node, i) => {
        const target = Number(node.dataset.target);
        const decimals = Number(node.dataset.decimals);
        const start = performance.now() + 480 + i * 90;
        const duration = 1500 + i * 80;
        const tick = (now) => {
          const progress = Math.min(1, Math.max(0, (now - start) / duration));
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = (target * eased).toFixed(decimals);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && animate(), { threshold: 0.25 });
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="brand-mark" to="/" aria-label="MindForge home"><img src="/assets/logo.webp" alt="" width="52" height="52" /></Link>
        <nav className="nav-pill desktop-nav">{['Home', 'Product', 'Case Studies', 'Contact'].map((label, i) => <Link className={i === 0 ? 'active' : ''} key={label} to={i === 0 ? '/' : '/signup'}>{label}</Link>)}</nav>
        <Link className="sign-in desktop-sign-in" to="/login">Sign in</Link>
        <button className={`burger ${menuOpen ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i /><i /><i /></button>
        {menuOpen && <><button className="menu-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} /><nav className="mobile-menu">{['Home', 'Product', 'Case Studies', 'Contact'].map((label, i) => <Link className={i === 0 ? 'active' : ''} key={label} to={i === 0 ? '/' : '/signup'} onClick={() => setMenuOpen(false)}>{label}</Link>)}<Link className="mobile-sign-in" to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link></nav></>}
      </header>
      <div className="bg" aria-hidden="true">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />
        </video>
      </div>
      <section className="landing-hero">
        <div className="trust-row anim" style={{ '--d': '0.05s' }}>
          <div className="avatars" aria-label="Microsoft, Amazon and Google">
            {['fa-microsoft', 'fa-amazon', 'fa-google'].map((brand, i) => <span className={`avatar avatar-${i + 1}`} key={brand}><span><i className={`fa-brands ${brand}`} /></span></span>)}
          </div>
          <span className="trust-pill">Trusted by 2000+ Enterprises</span>
        </div>
        <h1 className="headline">
          <span>Intelligence</span>
          <span>Designed To Evolve</span>
        </h1>
        <p className="subhead anim" style={{ '--d': '0.28s' }}>Build applications that reason, adapt and collaborate using a modular<br className="desktop-break" /> AI platform designed for production.</p>
        <Link className="hero-cta anim" style={{ '--d': '0.4s' }} to="/signup">Get Started</Link>
      </section>
      <footer className="stats-footer" ref={statsRef}>
        {STATS.map((stat, i) => <div className="stat anim" style={{ '--d': `${0.5 + i * 0.08}s` }} key={stat.label}>
          <span className="stat-icon">{stat.icon}</span>
          <span className="stat-value"><span data-target={stat.target} data-decimals={stat.decimals}>0</span><small>{stat.suffix}</small></span>
          <span className="stat-label">{stat.label}</span>
        </div>)}
      </footer>
    </main>
  );
}
