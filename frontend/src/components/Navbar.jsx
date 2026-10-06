import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Heart, BarChart2 } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/predict', label: 'Predict' },
  { path: '/dataset', label: 'Dataset' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/regression', label: 'Regression' },
  { path: '/comparison', label: 'Models' },
  { path: '/history', label: 'History' },
  { path: '/documentation', label: 'Docs' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-30 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,15,30,0.92)' : 'rgba(10,15,30,0.7)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            {/* Logo */}
            <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #0d9488, #0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Activity size={18} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                  MediPredict
                </div>
                <div style={{ fontSize: '0.65rem', color: '#0d9488', fontWeight: 500, letterSpacing: '0.05em' }}>
                  INSURANCE AI
                </div>
              </div>
            </NavLink>

            {/* Desktop nav */}
            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}
              className="hidden md:flex">
              {NAV_ITEMS.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <NavLink
                to="/predict"
                className="btn-primary hidden md:flex"
                style={{ textDecoration: 'none', fontSize: '0.8rem', padding: '0.5rem 1.1rem' }}
              >
                Predict Cost
              </NavLink>

              {/* Hamburger */}
              <button
                onClick={() => setOpen(v => !v)}
                className="md:hidden"
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '0.5rem', color: '#f8fafc', cursor: 'pointer',
                }}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="mobile-nav-overlay md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile panel */}
      <div
        className={`mobile-nav-panel md:hidden ${open ? 'open' : ''}`}
        style={{ overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>Navigation</span>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            style={{ display: 'block', width: '100%', marginBottom: '0.25rem' }}
          >
            {item.label}
          </NavLink>
        ))}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <NavLink
            to="/predict"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
          >
            Predict Insurance Cost
          </NavLink>
        </div>
      </div>
    </>
  );
}
