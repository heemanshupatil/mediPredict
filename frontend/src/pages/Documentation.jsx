import { useState } from 'react';
import {
  BookOpen,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  FileText,
  BarChart,
  HelpCircle,
  ShieldCheck,
  Server,
  Activity,
  Terminal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const SECTIONS = [
  { id: 'overview', label: '1. Project Overview', icon: BookOpen },
  { id: 'statistics', label: '2. Statistical Methodology', icon: Activity },
  { id: 'algorithms', label: '3. Machine Learning Models', icon: Cpu },
  { id: 'metrics', label: '4. Evaluation Metrics', icon: BarChart },
  { id: 'data-pipeline', label: '5. Pipeline & Engineering', icon: Layers },
  { id: 'api-reference', label: '6. REST API Reference', icon: Code2 },
  { id: 'architecture', label: '7. System Architecture', icon: Server },
  { id: 'user-guide', label: '8. User Guide', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Top Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: 9999, background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)', color: '#2dd4bf', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
          <FileText size={14} />
          Academic & Technical Documentation
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem' }}>
          Project Documentation & Statistical Report
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '850px', margin: 0, lineHeight: 1.6 }}>
          Comprehensive statistical theory, mathematical formulations, machine learning methodologies, and system architecture for the Medical Insurance Cost Prediction academic study.
        </p>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sticky Sidebar Navigation */}
        <div className="card" style={{ padding: '1rem', position: 'sticky', top: '84px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
            Table of Contents
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {SECTIONS.map(sec => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8,
                    border: 'none', background: isActive ? 'rgba(13,148,136,0.15)' : 'transparent',
                    color: isActive ? '#2dd4bf' : '#94a3b8',
                    fontWeight: isActive ? 600 : 500, fontSize: '0.85rem',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Icon size={16} />
                    <span>{sec.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* 1. Overview */}
          <section id="overview" className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <BookOpen size={24} color="#0d9488" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>1. Project Overview & Objective</h2>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem' }}>
              In actuarial science and health economics, accurately determining individual medical insurance premiums is crucial for risk management, equitable pricing, and solvency. Traditional manual underwriting is cumbersome and prone to subjective bias.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem' }}>
              This college project frames <strong>Healthcare Expenditure Estimation</strong> as a supervised continuous regression task:
            </p>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #0d9488', padding: '1rem 1.25rem', borderRadius: '0 8px 8px 0', margin: '1.25rem 0' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: '#2dd4bf', fontWeight: 600 }}>
                Charges = f(Age, Sex, BMI, Children, Smoker Status, US Geographic Region)
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              The application serves as both an interactive predictive engine for end users and an analytical lab for researchers to explore exploratory data distributions, regression diagnostics, residual homoscedasticity, and comparative model efficacy.
            </p>
          </section>

          {/* 2. Statistical Methodology */}
          <section id="statistics" className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Activity size={24} color="#0ea5e9" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>2. Statistical Methodology</h2>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', marginTop: '1rem', marginBottom: '0.5rem' }}>
              Multiple Linear Regression Formulation
            </h3>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Multiple linear regression models the relationship between a continuous scalar dependent variable Y and p explanatory predictor variables X₁, X₂, ..., Xₚ:
            </p>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: 10, margin: '1rem 0' }}>
              <div style={{ fontFamily: 'monospace', color: '#f8fafc', fontSize: '1rem', marginBottom: '0.5rem' }}>
                Y_i = β₀ + Σ (βⱼ · Xᵢⱼ) + εᵢ,   εᵢ ~ N(0, σ²)
              </div>
              <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                Where β₀ represents the base intercept, βⱼ represents partial regression slopes, and εᵢ represents Gaussian error disturbances.
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              Ordinary Least Squares (OLS) Assumptions Checked
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>1. Linearity</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified via scatter and partial residual plots showing relationship between predictors and charges.</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>2. Homoscedasticity</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Examined via residual-vs-fitted scatter plot to ensure constant residual variance.</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>3. No Multicollinearity</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Assessed through Pearson correlation matrices and Variance Inflation Factor (VIF &lt; 5).</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>4. Normality of Residuals</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Residual histogram and skewness analysis indicate bell-shaped errors centered near zero.</div>
              </div>
            </div>
          </section>

          {/* 3. Algorithms */}
          <section id="algorithms" className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Cpu size={24} color="#a855f7" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>3. Machine Learning Models</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.2)', padding: '1.25rem', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '1.1rem', fontWeight: 700 }}>Model A: Multiple Linear Regression (Baseline)</h4>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(14,165,233,0.2)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: 9999 }}>Parametric</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 0.5rem' }}>
                  Calculated with Ordinary Least Squares (OLS) via normal equations β̂ = (XᵀX)⁻¹ XᵀY. Highly interpretable where each coefficient βⱼ directly represents the marginal change in expected annual health bill per unit increase in the corresponding feature.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  <strong>Key Strength:</strong> Fast, analytical derivation, straightforward explainability for audit committees.
                </div>
              </div>

              <div style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)', padding: '1.25rem', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: '#c084fc', fontSize: '1.1rem', fontWeight: 700 }}>Model B: Random Forest Regressor (Nonlinear Ensemble)</h4>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(168,85,247,0.2)', color: '#c084fc', padding: '0.2rem 0.6rem', borderRadius: 9999 }}>Ensemble Non-Parametric</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 0.5rem' }}>
                  A meta-estimator aggregating 100 decorrelated decision trees (Bootstrap Aggregation / Bagging). Effectively models complex nonlinear interaction terms (especially the critical compounding effect of high BMI combined with smoking status) without requiring explicit interaction term creation.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  <strong>Key Strength:</strong> Higher predictive accuracy, resilient to outliers, calculates Gini / Mean Decrease Impurity feature rankings.
                </div>
              </div>
            </div>
          </section>

          {/* 4. Evaluation Metrics */}
          <section id="metrics" className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <BarChart size={24} color="#f59e0b" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>4. Evaluation Metrics Explained</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', borderRadius: 10 }}>
                <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>R² (Coefficient of Determination)</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#2dd4bf', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: 4, marginBottom: '0.5rem' }}>
                  R² = 1 - [ Σ(yᵢ - ŷᵢ)² / Σ(yᵢ - ȳ)² ]
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Measures the proportion of the variance in medical charges explained by the model's independent variables.
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', borderRadius: 10 }}>
                <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>Adjusted R²</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: 4, marginBottom: '0.5rem' }}>
                  R²_adj = 1 - [ (1 - R²)(n - 1) / (n - p - 1) ]
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Penalizes the addition of non-informative explanatory variables to prevent artificial inflation.
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', borderRadius: 10 }}>
                <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>Mean Absolute Error (MAE)</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#f59e0b', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: 4, marginBottom: '0.5rem' }}>
                  MAE = (1/n) · Σ |yᵢ - ŷᵢ|
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Average absolute dollar discrepancy between predicted costs and true patient billing records.
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', borderRadius: 10 }}>
                <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>Root Mean Squared Error (RMSE)</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ef4444', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: 4, marginBottom: '0.5rem' }}>
                  RMSE = √[ (1/n) · Σ(yᵢ - ŷᵢ)² ]
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Penalizes large errors heavily; vital for insurance risk where severe underestimations pose significant insolvency risk.
                </div>
              </div>
            </div>
          </section>

          {/* 5. Pipeline & Engineering */}
          <section id="data-pipeline" className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Layers size={24} color="#10b981" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>5. Data Preprocessing & Feature Engineering</h2>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem' }}>
              The raw dataset contains 1,338 individual patient records. Prior to model training, the following transformation pipeline is executed:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 3 }} />
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <strong>Binary Encoding:</strong> Sex (<code>male=1, female=0</code>) and Smoker status (<code>yes=1, no=0</code>).
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 3 }} />
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <strong>One-Hot Dummy Encoding:</strong> US Geographic Regions (northeast, northwest, southeast, southwest) with one reference category dropped to prevent the dummy variable trap.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 3 }} />
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <strong>Interaction Synthesis:</strong> High-risk interaction feature: <code>smoker_bmi_interaction = smoker_encoded × bmi</code> and quadratic age acceleration terms.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 3 }} />
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <strong>Train-Test Split:</strong> 80% Training set (1,070 records) for parameter fitting and 20% Out-of-Sample Holdout set (268 records) for strict unbiased evaluation.
                </div>
              </div>
            </div>
          </section>

          {/* 6. REST API Reference */}
          <section id="api-reference" className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Code2 size={24} color="#0d9488" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>6. REST API Reference</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: '#10b981', color: '#042f2e', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 4 }}>POST</span>
                  <code style={{ color: '#2dd4bf', fontSize: '0.9rem' }}>/api/predict</code>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
                  Executes ML inference for a patient profile. Logs prediction to SQLite audit history.
                </div>
                <pre style={{ background: '#090d16', padding: '0.75rem', borderRadius: 6, fontSize: '0.8rem', color: '#e2e8f0', overflowX: 'auto', margin: 0 }}>
{`// Request Body (JSON)
{
  "age": 35,
  "sex": "male",
  "bmi": 27.5,
  "children": 2,
  "smoker": "no",
  "region": "northwest",
  "model": "linear_regression" // or "random_forest"
}

// Response (200 OK)
{
  "predicted_cost": 5934.20,
  "model_used": "linear_regression",
  "risk_category": "Moderate",
  "breakdown": { "base_intercept": 3200, "age_contrib": 875, ... },
  "confidence_interval": { "lower": 5300, "upper": 6550 }
}`}
                </pre>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: '#0ea5e9', color: '#082f49', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 4 }}>GET</span>
                  <code style={{ color: '#38bdf8', fontSize: '0.9rem' }}>/api/model-metrics</code>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.825rem' }}>
                  Returns comparative statistics (R², Adj R², MAE, RMSE) and regression coefficients for all models.
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: '#0ea5e9', color: '#082f49', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 4 }}>GET</span>
                  <code style={{ color: '#38bdf8', fontSize: '0.9rem' }}>/api/history</code>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.825rem' }}>
                  Retrieves all stored prediction audit records.
                </div>
              </div>
            </div>
          </section>

          {/* 7. Architecture */}
          <section id="architecture" className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Server size={24} color="#6366f1" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>7. System Architecture</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#818cf8', fontSize: '1rem' }}>Frontend Application</h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.825rem', lineHeight: 1.6 }}>
                  <li>React 18 SPA built with Vite</li>
                  <li>Recharts for responsive, hardware-accelerated graphs</li>
                  <li>Lucide icons & modern glassmorphism CSS theme</li>
                  <li>Axios API client with unified error handling</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#818cf8', fontSize: '1rem' }}>Backend Analytics Core</h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.825rem', lineHeight: 1.6 }}>
                  <li>Python 3 Flask RESTful Microservice</li>
                  <li>scikit-learn & statsmodels for OLS & Random Forest</li>
                  <li>Pandas & NumPy for vectorized statistical calculations</li>
                  <li>SQLite database for persistent prediction auditing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 8. User Guide */}
          <section id="user-guide" className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <HelpCircle size={24} color="#ec4899" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>8. Application User Guide</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 9999, background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '0.85rem' }}>
                  1
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.2rem' }}>Navigate to the Predictor</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Adjust age, gender, BMI, children, smoking habit, and region. Switch between Linear Regression and Random Forest to observe how algorithmic assumptions impact calculated costs.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 9999, background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '0.85rem' }}>
                  2
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.2rem' }}>Inspect Statistical Diagnostics on Regression Page</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Review the empirical regression equation, check t-test p-values for statistical significance, and evaluate residual normality and homoscedasticity scatter plots.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 9999, background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '0.85rem' }}>
                  3
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.2rem' }}>Review Prediction History & Export</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    All patient calculations are stored in the History tab. Filter by habit or region, track trends on the trajectory graph, and download data as a standard CSV report.
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
