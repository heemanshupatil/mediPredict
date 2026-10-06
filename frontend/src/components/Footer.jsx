import { NavLink } from 'react-router-dom';
import { Activity, ShieldCheck, Mail, Heart, ExternalLink, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(5,10,20,0.95)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '3.5rem 1.5rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Brand Info */}
          <div>
            <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg, #0d9488, #0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 15px rgba(13, 148, 136, 0.4)'
              }}>
                <Activity size={18} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>MediPredict</span>
            </NavLink>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              An academic machine learning platform demonstrating OLS regression, Random Forest ensembles, and actuarial cost drivers on medical insurance data.
            </p>
            <div>
              <span className="badge badge-teal" style={{ fontSize: '0.7rem', padding: '0.3rem 0.75rem' }}>
                Statistics · AI & Data Science
              </span>
            </div>
          </div>

          {/* Core Platform */}
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Platform</div>
            {[
              { to: '/', label: 'Home / Landing Page' },
              { to: '/predict', label: 'Predict Insurance Cost' },
              { to: '/dataset', label: 'Insurance Registry Dataset' },
              { to: '/history', label: 'Historical Estimations' },
              { to: '/contact', label: 'Contact Research Team' },
            ].map(link => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                style={{ display: 'block', color: '#94a3b8', fontSize: '0.84rem', textDecoration: 'none', marginBottom: '0.6rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#2dd4bf'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Statistical Analytics */}
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Statistical Analytics</div>
            {[
              { to: '/analytics', label: 'EDA & Descriptive Stats' },
              { to: '/regression', label: 'OLS Regression Summary' },
              { to: '/comparison', label: 'Model Benchmarking (R² & MAE)' },
              { to: '/analytics', label: 'Correlation Heatmap' },
            ].map((link, i) => (
              <NavLink 
                key={i} 
                to={link.to} 
                style={{ display: 'block', color: '#94a3b8', fontSize: '0.84rem', textDecoration: 'none', marginBottom: '0.6rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#2dd4bf'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Governance & Privacy */}
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Governance & Legal</div>
            {[
              { to: '/privacy', label: 'Privacy & Data Policy', highlight: true },
              { to: '/privacy#medical-disclaimer', label: 'Medical Disclaimer' },
              { to: '/privacy#data-collection', label: 'Zero-PII Compliance' },
              { to: '/documentation', label: 'Academic Project Report' },
              { to: '/contact', label: 'Direct Inquiries & Viva Prep' },
            ].map((link, i) => (
              <NavLink 
                key={i} 
                to={link.to} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: link.highlight ? '#2dd4bf' : '#94a3b8', 
                  fontSize: '0.84rem', 
                  textDecoration: 'none', 
                  marginBottom: '0.6rem', 
                  fontWeight: link.highlight ? 600 : 400,
                  transition: 'color 0.2s' 
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
                onMouseLeave={e => e.currentTarget.style.color = link.highlight ? '#2dd4bf' : '#94a3b8'}
              >
                {link.highlight && <ShieldCheck size={14} color="#2dd4bf" />}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

        </div>

        {/* Bottom bar with Copyright & Direct Privacy & Policy Link */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.07)', 
          paddingTop: '1.75rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem' 
        }}>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5 }}>
              © 2025–2026 <strong>MediPredict Research Project</strong>. Built for Statistics & Data Science Academic Examination.
            </p>
            <p style={{ color: '#475569', fontSize: '0.73rem', marginTop: '0.2rem' }}>
              Academic demonstration only. Not a commercial insurance solicitation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <NavLink 
              to="/privacy" 
              style={{ 
                color: '#2dd4bf', 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(13, 148, 136, 0.1)',
                border: '1px solid rgba(13, 148, 136, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(13, 148, 136, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(13, 148, 136, 0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(13, 148, 136, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(13, 148, 136, 0.3)';
              }}
            >
              <Lock size={13} />
              <span>Privacy & Policy</span>
            </NavLink>

            <NavLink 
              to="/contact" 
              style={{ 
                color: '#94a3b8', 
                fontSize: '0.8rem', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              <Mail size={13} />
              <span>Contact Us</span>
            </NavLink>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-teal" style={{ fontSize: '0.68rem' }}>OLS Regression</span>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>Random Forest</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
