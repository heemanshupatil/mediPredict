import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  FileText, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Mail
} from 'lucide-react';

const SECTIONS = [
  { id: 'academic-purpose', title: '1. Academic Scope & Purpose', icon: <FileText size={18} /> },
  { id: 'data-collection', title: '2. Information We Do (and Do Not) Collect', icon: <EyeOff size={18} /> },
  { id: 'ml-processing', title: '3. Machine Learning Inference & Processing', icon: <Database size={18} /> },
  { id: 'local-storage', title: '4. Local Storage & Prediction History', icon: <Lock size={18} /> },
  { id: 'cookies-tracking', title: '5. Zero Invasive Tracking & Cookies', icon: <ShieldCheck size={18} /> },
  { id: 'security-standards', title: '6. Data Security & Encryption', icon: <CheckCircle2 size={18} /> },
  { id: 'medical-disclaimer', title: '7. Medical & Actuarial Disclaimer', icon: <AlertTriangle size={18} /> },
  { id: 'contact-rights', title: '8. Governance & Privacy Contact', icon: <Mail size={18} /> },
];

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState('academic-purpose');

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="animated-bg" style={{ minHeight: '100vh', padding: 'clamp(2rem, 5vw, 4rem) 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '2rem' }}
        >
          <NavLink 
            to="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: '#0d9488', 
              textDecoration: 'none', 
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              background: 'rgba(13, 148, 136, 0.08)',
              border: '1px solid rgba(13, 148, 136, 0.2)'
            }}
          >
            <ArrowLeft size={16} /> Return to Home
          </NavLink>
        </motion.div>

        {/* Header Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="badge badge-teal" style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}>
              <ShieldCheck size={14} /> Data Governance & Compliance
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1rem' }}>
            Privacy <span className="gradient-text">& Data Policy</span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
            Transparency, ethical artificial intelligence, and rigorous research integrity are fundamental to MediPredict.
            Here is an explicit explanation of how data is handled across our statistical models.
          </p>

          {/* Quick Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              🛡️ <strong>Zero PII Collected</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              🔒 <strong>Client-Side Local Storage Only</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              📅 <strong>Effective: October 2025</strong>
            </div>
          </div>
        </motion.div>

        {/* Content Layout: Sidebar + Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Sticky Quick Nav */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card" 
            style={{ 
              padding: '1.5rem', 
              position: 'sticky', 
              top: '84px',
              border: '1px solid rgba(13, 148, 136, 0.25)',
              background: 'rgba(15, 23, 42, 0.85)'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0d9488', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Table of Contents
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === sec.id ? 'rgba(13, 148, 136, 0.15)' : 'transparent',
                    color: activeTab === sec.id ? '#2dd4bf' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    fontWeight: activeTab === sec.id ? 600 : 500,
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== sec.id) {
                      e.currentTarget.style.color = '#f8fafc';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== sec.id) {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {sec.icon}
                    <span>{sec.title}</span>
                  </span>
                  <ChevronRight size={14} style={{ opacity: activeTab === sec.id ? 1 : 0.4 }} />
                </button>
              ))}
            </nav>

            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem' }}>
                Have questions about compliance or datasets?
              </div>
              <NavLink 
                to="/contact" 
                className="btn-primary" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  padding: '0.55rem 1rem'
                }}
              >
                <Mail size={14} /> Contact Governance
              </NavLink>
            </div>
          </motion.div>

          {/* Policy Text Articles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 2 }}>
            
            {/* Section 1 */}
            <motion.section 
              id="academic-purpose"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#2dd4bf', marginBottom: '1rem' }}>
                <FileText size={22} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  1. Academic Scope & Purpose
                </h2>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                <strong>MediPredict</strong> is developed strictly as an <em>academic data science, statistical analysis, and machine learning research platform</em>. The primary objective is to evaluate comparative regression algorithms (Ordinary Least Squares Linear Regression, Polynomial Regression, Random Forest Regressors, and Gradient Boosted Models) on public healthcare expenditure data.
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>
                This platform does not operate as an insurance broker, underwriter, or licensed healthcare provider. Predictions are theoretical statistical calculations modeled for academic viva demonstrations and curriculum coursework.
              </p>
            </motion.section>

            {/* Section 2 */}
            <motion.section 
              id="data-collection"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#38bdf8', marginBottom: '1rem' }}>
                <EyeOff size={22} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  2. Information We Do (and Do Not) Collect
                </h2>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                We believe in strict data minimization. MediPredict guarantees:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: 0, color: '#cbd5e1', fontSize: '0.88rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Zero Personally Identifiable Information (PII):</strong> We never ask for, collect, or store patient names, government identification numbers, Social Security Numbers, Aadhaar, phone numbers, or credit card details.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Anonymized Actuarial Features:</strong> The input data fed into the prediction engine (Age, Sex, BMI, Children count, Smoker status, Region) is treated strictly as transient mathematical input vectors.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>No Medical Record Ingestion:</strong> Electronic Health Records (EHR) or hospital diagnostic histories are not consumed or linked.</span>
                </li>
              </ul>
            </motion.section>

            {/* Section 3 */}
            <motion.section 
              id="ml-processing"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#a5b4fc', marginBottom: '1rem' }}>
                <Database size={22} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  3. Machine Learning Inference & Processing
                </h2>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                When you initiate a cost estimate on the <strong>/predict</strong> or landing page teaser:
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
                <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <li>The numerical features are passed to the stateless Python/Flask backend.</li>
                  <li>Features are scaled with scikit-learn’s <code style={{ color: '#2dd4bf' }}>StandardScaler</code> and one-hot encoded for categoricals.</li>
                  <li>The trained model weights output the continuous cost target in Indian Rupees (₹).</li>
                  <li>Once returned to your browser, the temporary payload is immediately cleared from active memory on the server.</li>
                </ol>
              </div>
            </motion.section>

            {/* Section 4 */}
            <motion.section 
              id="local-storage"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#fbbf24', marginBottom: '1rem' }}>
                <Lock size={22} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  4. Local Storage & Prediction History
                </h2>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                The <NavLink to="/history" style={{ color: '#0d9488', textDecoration: 'underline' }}>Prediction History</NavLink> feature allows students and evaluators to review prior model iterations. 
              </p>
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Your Control, Your Device:
                </p>
                <p style={{ color: '#cbd5e1', fontSize: '0.825rem', lineHeight: 1.6 }}>
                  Historical estimates are cached locally in your browser’s <code style={{ color: '#f59e0b' }}>localStorage</code> or stored on your local development server instance. You can flush, delete individual rows, or wipe the entire history at any time with a single click.
                </p>
              </div>
            </motion.section>

            {/* Section 5 */}
            <motion.section 
              id="cookies-tracking"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#34d399', marginBottom: '1rem' }}>
                <ShieldCheck size={22} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  5. Zero Invasive Tracking & Cookies
                </h2>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                We believe websites should respect user focus. MediPredict:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
                <li>❌ Does <strong>NOT</strong> run advertising trackers or Google Ads pixels.</li>
                <li>❌ Does <strong>NOT</strong> conduct cross-site fingerprinting or user profiling.</li>
                <li>❌ Does <strong>NOT</strong> sell or license user inquiry information to third-party actuarial firms.</li>
                <li>✅ Uses standard session caching to maintain responsive UI transitions.</li>
              </ul>
            </motion.section>

            {/* Section 6 */}
            <motion.section 
              id="security-standards"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#38bdf8', marginBottom: '1rem' }}>
                <CheckCircle2 size={22} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  6. Data Security & Encryption
                </h2>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                All network communication between the Vite frontend client and Flask prediction microservice adheres to modern encryption standards:
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>
                <li>Encrypted transport via TLS 1.3 / HTTPS in production deployments.</li>
                <li>Strict CORS headers preventing unauthorized cross-origin requests.</li>
                <li>Input sanitization and numerical clamping to protect against injection exploits.</li>
              </ul>
            </motion.section>

            {/* Section 7 */}
            <motion.section 
              id="medical-disclaimer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card" 
              style={{ 
                padding: '2rem', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(15, 23, 42, 0.8))'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#f87171', marginBottom: '1rem' }}>
                <AlertTriangle size={22} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  7. Medical & Actuarial Disclaimer
                </h2>
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.8 }}>
                <p style={{ marginBottom: '0.75rem' }}>
                  <strong>CRITICAL NOTICE:</strong> The outputs, cost projections, and model confidence scores produced by MediPredict are strictly mathematical approximations.
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  They <em>must not</em> be interpreted as certified insurance quotes, actual premium invoices, or clinical medical evaluations. Always consult licensed health insurance providers for policy coverage and certified medical doctors for health guidance.
                </p>
              </div>
            </motion.section>

            {/* Section 8 */}
            <motion.section 
              id="contact-rights"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#2dd4bf', marginBottom: '1rem' }}>
                <Mail size={22} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  8. Governance & Privacy Contact
                </h2>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                If you have questions, peer-review inquiries, or data governance feedback regarding this project, please reach out to our team via the contact portal.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <NavLink 
                  to="/contact" 
                  className="btn-primary" 
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Mail size={16} /> Open Contact Portal
                </NavLink>
                <NavLink 
                  to="/documentation" 
                  className="btn-secondary" 
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <FileText size={16} /> Read Full Methodology
                </NavLink>
              </div>
            </motion.section>

          </div>
        </div>

      </div>
    </div>
  );
}
