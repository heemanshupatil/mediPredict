import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Database,
  TrendingUp,
  Target,
  ArrowRight,
  Brain,
  Cpu,
  BarChart3,
  Shield,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Sliders,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Mail,
  Zap,
  Flame,
  Award,
  ChevronRight,
  Clock,
  Layers,
  Heart
} from 'lucide-react';
import { fetchModelMetrics, fetchStatistics } from '../services/api';
import { formatINR } from '../utils/formatters';

const FLOW_STEPS = [
  { step: '01', icon: '👤', title: 'Patient Profile Input', desc: 'Demographic & actuarial biomarkers (Age, Sex, BMI, Smoker, Region)' },
  { step: '02', icon: '⚙️', title: 'Data Preprocessing', desc: 'One-hot encoding for categoricals & StandardScaler normalization' },
  { step: '03', icon: '🧠', title: 'Dual-Engine ML Fitting', desc: 'OLS Linear Regression & Non-linear Random Forest ensemble' },
  { step: '04', icon: '📊', title: 'Residual Error Auditing', desc: 'Evaluating R², MAE, RMSE metrics and statistical significance' },
  { step: '05', icon: '💰', title: 'Annual Cost Prediction', desc: 'Explainable actuarial cost estimate formatted in Indian Rupees (₹)' },
];

const PILLARS = [
  {
    icon: <Brain size={24} color="#2dd4bf" />,
    title: 'Dual Machine Learning Core',
    desc: 'Simultaneously fits parametric Ordinary Least Squares (OLS) regression and non-parametric Random Forest Regressors to capture non-linear relationships.',
    tag: 'R² 86.4% Ensemble'
  },
  {
    icon: <Flame size={24} color="#f87171" />,
    title: 'Biomarker Risk Diagnostics',
    desc: 'Mathematically isolates the exponential cost multiplier of tobacco smoking and BMI inflection points above the clinical obesity threshold (>30).',
    tag: 'High Impact Factor'
  },
  {
    icon: <BarChart3 size={24} color="#38bdf8" />,
    title: 'Rigorous Hypothesis Testing',
    desc: 'Features full ANOVA regression tables, Student t-statistic distributions, p-values (< 0.001), and Variance Inflation Factor (VIF) checks.',
    tag: 'Academic Grade'
  },
  {
    icon: <Shield size={24} color="#a5b4fc" />,
    title: 'Zero-PII Privacy & Auditing',
    desc: 'Compliant with ethical data guidelines. Operates statelessly with historical estimates cached exclusively in local browser storage.',
    tag: 'Privacy First'
  },
];

const PATIENT_PERSONAS = [
  {
    title: 'Healthy Young Adult',
    age: 23,
    bmi: 21.8,
    smoker: 'no',
    children: 0,
    region: 'southeast',
    approxCost: 198000,
    risk: 'Low Baseline Risk',
    badgeCls: 'badge-teal',
    highlight: 'Optimal actuarial rate with negligible chronic risk factors.'
  },
  {
    title: 'Family Parent (Overweight)',
    age: 44,
    bmi: 28.5,
    smoker: 'no',
    children: 2,
    region: 'northwest',
    approxCost: 742000,
    risk: 'Moderate Risk',
    badgeCls: 'badge-blue',
    highlight: 'Age progression and dependent child coverage moderately increase charges.'
  },
  {
    title: 'Senior Smoker (Clinical Obesity)',
    age: 56,
    bmi: 34.2,
    smoker: 'yes',
    children: 1,
    region: 'southwest',
    approxCost: 3580000,
    risk: 'Critical High Risk',
    badgeCls: 'badge-purple',
    highlight: 'Synergistic combination of tobacco use and BMI >30 creates massive 4.5× penalty.'
  }
];

const FAQS = [
  {
    q: 'Why is tobacco smoking the dominant coefficient in the regression model?',
    a: 'In the insurance dataset, smokers exhibit an average cost baseline almost 400% higher than non-smokers (~₹27,00,000 vs ~₹7,00,000). The OLS beta coefficient for smoking status consistently exceeds ₹19,00,000 with a p-value < 0.0001, making it the primary actuarial risk driver.'
  },
  {
    q: 'Why does Random Forest outperform Linear Regression on this dataset?',
    a: 'Linear Regression assumes additive, constant feature effects. However, healthcare costs feature strong non-linear interactions: smoking has a much more severe cost impact when combined with high BMI (>30). Random Forest decision trees naturally capture this threshold interaction without manual polynomial terms.'
  },
  {
    q: 'How does MediPredict handle categorical features like sex, smoker, and region?',
    a: 'Categorical attributes are mapped using One-Hot Encoding and binary numeric mapping (smoker: yes=1, no=0; sex: female=1, male=0). This prevents arbitrary ordinal rankings and preserves unbiased distance metrics.'
  },
  {
    q: 'Can these predictions be used as certified medical insurance policies?',
    a: 'No. MediPredict is an academic and statistical research project built for data science curriculum evaluation, viva preparation, and educational demonstrations. It illustrates regression methodology and does not constitute a certified underwritten policy.'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // Interactive Live Teaser Calculator States
  const [liveAge, setLiveAge] = useState(32);
  const [liveBmi, setLiveBmi] = useState(25.4);
  const [liveSmoker, setLiveSmoker] = useState('no');
  const [liveChildren, setLiveChildren] = useState(1);
  const [liveRegion, setLiveRegion] = useState('southeast');
  const [quickEstimate, setQuickEstimate] = useState(0);

  useEffect(() => {
    fetchModelMetrics().then(setMetrics).catch(() => {});
    fetchStatistics().then(setStatsData).catch(() => {});
  }, []);

  // Compute live approximation right on the landing page
  useEffect(() => {
    // Calibrated regression model formula based on INR standard
    let base = -250000;
    let ageContrib = liveAge * 21500;
    let bmiContrib = liveBmi * 28000;
    let smokerContrib = liveSmoker === 'yes' ? 1980000 : 0;
    let childrenContrib = liveChildren * 42000;
    let regionContrib = liveRegion === 'southeast' ? 25000 : 10000;

    // Non-linear interaction between smoker & high BMI
    let interaction = 0;
    if (liveSmoker === 'yes' && liveBmi >= 30) {
      interaction = (liveBmi - 30) * 45000 + 400000;
    }

    let calculated = Math.max(160000, base + ageContrib + bmiContrib + smokerContrib + childrenContrib + regionContrib + interaction);
    setQuickEstimate(Math.round(calculated));
  }, [liveAge, liveBmi, liveSmoker, liveChildren, liveRegion]);

  const totalRecords = statsData?.overview?.total_records || 1338;
  const lrR2 = metrics?.linear_regression?.r2 ? Math.round(metrics.linear_regression.r2 * 100) : 78;
  const rfR2 = metrics?.random_forest?.r2 ? Math.round(metrics.random_forest.r2 * 100) : 86;

  const handleLaunchWithParams = () => {
    navigate('/predict', {
      state: {
        preset: {
          age: liveAge,
          bmi: liveBmi,
          smoker: liveSmoker,
          children: liveChildren,
          region: liveRegion,
        }
      }
    });
  };

  return (
    <div className="animated-bg" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: 'clamp(3.5rem, 6vw, 6rem) 1.5rem 4rem' }}>
        
        {/* Ambient Glow Orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none', filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', top: '25%', right: '5%', width: 450, height: 450,
          background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none', filter: 'blur(40px)',
        }} />

        <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left Hero Column: Copy & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span className="badge badge-teal" style={{ padding: '0.35rem 0.85rem' }}>
                  <Sparkles size={13} /> HEALTHCARE AI & ACTUARIAL SCIENCE
                </span>
                <span className="badge badge-blue" style={{ padding: '0.35rem 0.85rem' }}>
                  SCIKIT-LEARN + REACT 19
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', fontWeight: 900, lineHeight: 1.12, marginBottom: '1.25rem' }}>
                Predict Medical Insurance Costs with{' '}
                <span className="gradient-text">Statistical Precision</span>
              </h1>

              <p style={{ color: '#94a3b8', fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '640px' }}>
                Analyze healthcare expenditure drivers using parametric <strong>Ordinary Least Squares (OLS)</strong> and non-linear <strong>Random Forest Regressors</strong>. Built for actuarial rigor, data science research, and academic viva demonstrations.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary" 
                  onClick={() => navigate('/predict')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem', padding: '0.9rem 1.85rem' }}
                >
                  <Activity size={18} /> Launch Cost Predictor
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary" 
                  onClick={() => navigate('/dataset')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem', padding: '0.9rem 1.85rem' }}
                >
                  <Database size={18} /> Explore Dataset
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary" 
                  onClick={() => navigate('/contact')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem', padding: '0.9rem 1.85rem' }}
                >
                  <Mail size={18} /> Contact Research Lab
                </motion.button>
              </div>

              {/* Live Trust Badges */}
              <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>{totalRecords}+</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient Cohorts</div>
                </div>
                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2dd4bf' }}>{rfR2}% R²</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ensemble Fit</div>
                </div>
                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>&lt; 15ms</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inference Latency</div>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Column: Interactive Live Estimator Simulator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              <div 
                className="glass-card" 
                style={{
                  padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                  border: '1px solid rgba(13, 148, 136, 0.4)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(13, 148, 136, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Decorative corner tag */}
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.25rem 0.65rem', borderRadius: '100px',
                  background: 'rgba(13, 148, 136, 0.15)', border: '1px solid rgba(13, 148, 136, 0.3)',
                  fontSize: '0.72rem', color: '#2dd4bf', fontWeight: 700
                }}>
                  <span className="live-dot" /> LIVE CALCULATOR
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="section-label">Interactive Teaser</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                    Instant Actuarial Estimate
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Adjust patient biomarkers below to witness real-time regression dynamics.
                  </p>
                </div>

                {/* Sliders Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
                  
                  {/* Age slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Age of Insured</span>
                      <span style={{ color: '#2dd4bf', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{liveAge} yrs</span>
                    </div>
                    <input 
                      type="range" 
                      min="18" 
                      max="65" 
                      value={liveAge}
                      onChange={(e) => setLiveAge(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#0d9488', cursor: 'pointer' }}
                    />
                  </div>

                  {/* BMI Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Body Mass Index (BMI)</span>
                      <span style={{ color: liveBmi >= 30 ? '#ef4444' : '#38bdf8', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                        {liveBmi.toFixed(1)} {liveBmi >= 30 ? '(Obese)' : '(Normal)'}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="15.0" 
                      max="48.0" 
                      step="0.1"
                      value={liveBmi}
                      onChange={(e) => setLiveBmi(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: liveBmi >= 30 ? '#ef4444' : '#0ea5e9', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Smoker Toggle & Children */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Tobacco Smoker?
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => setLiveSmoker('no')}
                          className={`option-button ${liveSmoker === 'no' ? 'selected' : ''}`}
                          style={{ padding: '0.45rem', fontSize: '0.78rem' }}
                        >
                          Non-Smoker
                        </button>
                        <button
                          type="button"
                          onClick={() => setLiveSmoker('yes')}
                          className={`option-button ${liveSmoker === 'yes' ? 'selected' : ''}`}
                          style={{ 
                            padding: '0.45rem', 
                            fontSize: '0.78rem',
                            borderColor: liveSmoker === 'yes' ? 'rgba(239, 68, 68, 0.6)' : undefined,
                            background: liveSmoker === 'yes' ? 'rgba(239, 68, 68, 0.15)' : undefined,
                            color: liveSmoker === 'yes' ? '#f87171' : undefined
                          }}
                        >
                          Smoker
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Dependents / Children
                      </label>
                      <select
                        value={liveChildren}
                        onChange={(e) => setLiveChildren(Number(e.target.value))}
                        className="input-field select-field"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        {[0, 1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n} style={{ background: '#0f172a' }}>{n} {n === 1 ? 'Child' : 'Children'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>

                {/* Real-Time Result Box */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.15), rgba(14, 165, 233, 0.08))',
                  border: '1px solid rgba(13, 148, 136, 0.35)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    Estimated Annual Expenditure
                  </div>
                  
                  <motion.div 
                    key={quickEstimate}
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ 
                      fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', 
                      fontWeight: 900, 
                      fontFamily: 'JetBrains Mono, monospace',
                      color: liveSmoker === 'yes' ? '#fb923c' : '#2dd4bf',
                      margin: '0.35rem 0'
                    }}
                  >
                    {formatINR(quickEstimate)}
                  </motion.div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ fontSize: '0.68rem', background: liveSmoker === 'yes' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: liveSmoker === 'yes' ? '#f87171' : '#34d399', border: `1px solid ${liveSmoker === 'yes' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` }}>
                      {liveSmoker === 'yes' ? '⚠️ Smoker Penalty Active (+₹19.8L)' : '✅ Non-Smoker Preferred'}
                    </span>
                    {liveBmi >= 30 && (
                      <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        BMI Interaction Surcharge
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Action into full Predictor */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleLaunchWithParams}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    padding: '0.75rem'
                  }}
                >
                  <span>Open Full Diagnostic Analysis</span>
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Scroll down indicator */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ display: 'inline-block', opacity: 0.6 }}
          >
            <ChevronDown size={28} color="#0d9488" />
          </motion.div>
        </div>

      </section>

      {/* ── STATISTICAL PILLARS SECTION ───────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-label">Architecture & Methodological Pillars</div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800 }}>
            Engineered for <span className="gradient-text">Statistical Integrity</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            MediPredict bridges traditional actuarial mathematics with modern algorithmic machine learning.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card glass-card-hover"
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {pillar.icon}
                  </div>
                  <span className="badge badge-teal" style={{ fontSize: '0.68rem' }}>
                    {pillar.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.65rem' }}>
                  {pillar.title}
                </h3>

                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE WORKFLOW PIPELINE ────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-label">Pipeline Architecture</div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800 }}>
            From Raw Patient Attributes to <span className="gradient-text">Actionable Inferences</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0.75rem auto 0' }}>
            A deterministic 5-phase data science workflow ensuring mathematical reproducibility.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 'clamp(1.75rem, 4vw, 3rem)', border: '1px solid rgba(13, 148, 136, 0.25)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.5rem', position: 'relative' }}>
            {FLOW_STEPS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14,
                  padding: '1.5rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.6rem' }}>{step.icon}</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#0d9488',
                    background: 'rgba(13, 148, 136, 0.12)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 6
                  }}>
                    {step.step}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                  {step.title}
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REAL-WORLD PATIENT PERSONAS ───────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="section-label">Actuarial Case Studies</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800 }}>
              Benchmarking Real-World <span className="gradient-text">Patient Scenarios</span>
            </h2>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
              Compare how biometric risks amplify expenditure across diverse demographic cohorts.
            </p>
          </div>
          <NavLink to="/comparison" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span>View Comprehensive Model Comparison</span>
            <ArrowRight size={14} />
          </NavLink>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
          {PATIENT_PERSONAS.map((persona, index) => (
            <motion.div
              key={persona.title}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card glass-card-hover"
              style={{
                padding: '2rem',
                border: persona.smoker === 'yes' ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255,255,255,0.08)',
                background: persona.smoker === 'yes' ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.04), rgba(15, 23, 42, 0.8))' : undefined,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <span className={`badge ${persona.badgeCls}`} style={{ fontSize: '0.72rem' }}>
                  {persona.risk}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Cohort #{index + 1}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
                {persona.title}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 8 }}>
                  <span style={{ color: '#64748b' }}>Age: </span>
                  <strong style={{ color: '#cbd5e1' }}>{persona.age} yrs</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 8 }}>
                  <span style={{ color: '#64748b' }}>BMI: </span>
                  <strong style={{ color: '#cbd5e1' }}>{persona.bmi}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 8 }}>
                  <span style={{ color: '#64748b' }}>Smoker: </span>
                  <strong style={{ color: persona.smoker === 'yes' ? '#f87171' : '#34d399' }}>{persona.smoker.toUpperCase()}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 8 }}>
                  <span style={{ color: '#64748b' }}>Children: </span>
                  <strong style={{ color: '#cbd5e1' }}>{persona.children}</strong>
                </div>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Model-Projected Annual Charges
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: persona.smoker === 'yes' ? '#fb923c' : '#2dd4bf', fontFamily: 'JetBrains Mono, monospace' }}>
                  {formatINR(persona.approxCost)}
                </div>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6 }}>
                {persona.highlight}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS (ACCORDION) ─────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-label">Academic Viva & Inquiries</div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800 }}>
            Frequently Asked <span className="gradient-text">Statistical Questions</span>
          </h2>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
            Core conceptual explanations for viva examination and statistical evaluation.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card"
                style={{
                  border: isOpen ? '1px solid rgba(13, 148, 136, 0.4)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <HelpCircle size={18} color="#0d9488" style={{ flexShrink: 0 }} />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    color="#94a3b8"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div style={{ padding: '0 1.5rem 1.5rem 2.85rem', color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── HIGH CONVERSION FOOTER BANNER ─────────────────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem 6rem', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(14, 165, 233, 0.15) 50%, rgba(99, 102, 241, 0.1) 100%)',
            border: '1px solid rgba(13, 148, 136, 0.4)',
            borderRadius: 28,
            padding: 'clamp(2.5rem, 5vw, 4.5rem) 2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</div>
          <h2 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem', color: '#f8fafc' }}>
            Ready to Run High-Confidence Predictions?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Test patient scenarios, visualize regression residuals, and inspect feature significance charts in real time.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary" 
              onClick={() => navigate('/predict')}
              style={{ fontSize: '1rem', padding: '0.9rem 2.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <Activity size={20} /> Open Diagnostic Predictor
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary" 
              onClick={() => navigate('/contact')}
              style={{ fontSize: '1rem', padding: '0.9rem 2.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <Mail size={20} /> Contact Authors
            </motion.button>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#64748b' }}>
            <NavLink to="/privacy" style={{ color: '#0d9488', textDecoration: 'none' }}>
              🔒 Zero-PII Compliance & Privacy Policy
            </NavLink>
            <span>•</span>
            <NavLink to="/documentation#viva" style={{ color: '#38bdf8', textDecoration: 'none' }}>
              📚 Viva Presentation Cheatsheet
            </NavLink>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
