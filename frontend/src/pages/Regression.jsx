import { useEffect, useState } from 'react';
import { fetchModelMetrics, fetchCorrelation } from '../services/api';
import { toast } from 'react-hot-toast';
import HeartbeatLoader from '../components/HeartbeatLoader';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, BarChart, Bar, ReferenceLine, LineChart, Line
} from 'recharts';

function Section({ title, subtitle, children, style = {} }) {
  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', ...style }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{title}</h3>
        {subtitle && <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.25rem' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function InfoBox({ children, color = '#0d9488', style = {} }) {
  return (
    <div style={{ background: `${color}14`, border: `1px solid ${color}30`, borderRadius: 10, padding: '0.875rem 1rem', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7, ...style }}>
      {children}
    </div>
  );
}

export default function Regression() {
  const [metrics, setMetrics] = useState(null);
  const [corr, setCorr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([fetchModelMetrics(), fetchCorrelation()])
      .then(([m, c]) => { setMetrics(m); setCorr(c); setLoading(false); })
      .catch(e => { toast.error(e.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <HeartbeatLoader 
        message="Evaluating Regression Models..." 
        subMessage="Extracting OLS coefficients, p-values & diagnostic tests" 
      />
    </div>
  );

  const lr = metrics?.linear_regression;
  const lrCoeffs = lr?.coefficients?.features || [];
  const avp = lr?.actual_vs_predicted;
  const resid = lr?.residuals;

  const avpData = avp
    ? avp.actual.map((a, i) => ({ actual: a, predicted: avp.predicted[i] })).slice(0, 150)
    : [];

  const residData = resid
    ? resid.predicted.map((p, i) => ({ predicted: p, residual: resid.residuals[i] })).slice(0, 150)
    : [];

  const corrPairs = corr?.pairs_with_charges || [];
  const corrMatrix = corr?.matrix || [];
  const corrLabels = corr?.labels || [];

  const TABS = [
    { id: 'overview', label: '📖 Overview' },
    { id: 'coefficients', label: '📐 Coefficients' },
    { id: 'metrics', label: '📊 Metrics' },
    { id: 'avp', label: '🎯 Actual vs Predicted' },
    { id: 'residuals', label: '📉 Residuals' },
    { id: 'correlation', label: '🔗 Correlation' },
  ];

  // Heatmap color
  function heatColor(v) {
    const abs = Math.abs(v);
    if (v > 0) return `rgba(13,148,136,${0.15 + abs * 0.75})`;
    return `rgba(239,68,68,${0.15 + abs * 0.75})`;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2.5rem 1.5rem 4rem', background: '#090e1a' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div className="page-header">
          <div className="section-label">Statistical Analysis</div>
          <h1>Regression Analysis</h1>
          <p>Linear regression model details, coefficients, evaluation metrics, and correlation analysis</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={activeTab === t.id ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <Section title="What is Regression Analysis?" subtitle="Statistical foundation of this project">
              <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                Regression analysis is a statistical method used to model and analyze the relationships between a <strong style={{ color: '#0d9488' }}>dependent variable (Y)</strong> and one or more <strong style={{ color: '#0ea5e9' }}>independent variables (X)</strong>. In this project:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.75rem' }}>INDEPENDENT VARIABLES (X)</div>
                  {['Age', 'Sex', 'BMI', 'Children', 'Smoker', 'Region'].map(v => (
                    <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9', flexShrink: 0 }} /> {v}
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(13,148,136,0.07)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#2dd4bf', fontWeight: 700, marginBottom: '0.75rem' }}>DEPENDENT VARIABLE (Y)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d9488' }}>💰 Annual Insurance Charges</div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.6 }}>
                    The target variable we are trying to predict — a continuous numerical value representing annual medical costs.
                  </p>
                </div>
              </div>
              <InfoBox>
                <strong style={{ color: '#2dd4bf' }}>Why is this a regression problem?</strong><br />
                Because the output (insurance charges) is a <em>continuous numerical value</em>, not a category. Regression models estimate the expected value of Y given a set of X values. If the output were a category (e.g., "high/low cost"), it would be a classification problem.
              </InfoBox>
            </Section>

            <Section title="Multiple Linear Regression Equation" subtitle="The mathematical model learned from the data">
              {lr && (
                <div>
                  <div className="code-block" style={{ marginBottom: '1rem', lineHeight: 2.2 }}>
                    <span style={{ color: '#fbbf24' }}>Predicted Charges</span> = {lr.coefficients?.intercept?.toFixed(2)}<br />
                    {lrCoeffs.map(c => (
                      <span key={c.name}>
                        &nbsp;&nbsp;{c.coefficient >= 0 ? '+ ' : '- '}<span style={{ color: '#0d9488' }}>{Math.abs(c.coefficient).toFixed(4)}</span>
                        &nbsp;× <span style={{ color: '#a5b4fc' }}>{c.name}</span><br />
                      </span>
                    ))}
                  </div>
                  <InfoBox color="#6366f1">
                    <strong style={{ color: '#a5b4fc' }}>Interpretation:</strong> Each coefficient represents how much the predicted cost changes for a one-unit increase in that feature, <em>holding all other features constant</em>. The intercept is the baseline predicted value when all features are at their scaled mean.
                  </InfoBox>
                </div>
              )}
            </Section>
          </div>
        )}

        {/* COEFFICIENTS */}
        {activeTab === 'coefficients' && lr && (
          <div>
            <Section title="Linear Regression Coefficients" subtitle="Feature weights learned from training data — NOT hardcoded">
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.625rem 1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>INTERCEPT (β₀)</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fbbf24', fontWeight: 700 }}>{lr.coefficients?.intercept?.toFixed(4)}</span>
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                {lrCoeffs.map((c, i) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: 120, fontSize: '0.78rem', color: '#94a3b8', flexShrink: 0, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{c.name}</div>
                    <div style={{ flex: 1, position: 'relative', height: 24 }}>
                      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.1)' }} />
                      <div style={{
                        position: 'absolute',
                        top: 4, bottom: 4,
                        background: c.coefficient >= 0 ? 'rgba(13,148,136,0.6)' : 'rgba(239,68,68,0.6)',
                        borderRadius: 3,
                        left: c.coefficient >= 0 ? '50%' : `${50 - Math.min(Math.abs(c.coefficient) * 2, 50)}%`,
                        width: `${Math.min(Math.abs(c.coefficient) * 2, 50)}%`,
                      }} />
                    </div>
                    <div style={{ width: 90, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: c.coefficient >= 0 ? '#2dd4bf' : '#f87171', textAlign: 'right', flexShrink: 0 }}>
                      {c.coefficient >= 0 ? '+' : ''}{c.coefficient.toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
              <InfoBox>
                <strong style={{ color: '#2dd4bf' }}>Note:</strong> Features are standardized (z-score) before training, so coefficients reflect importance <em>after</em> scaling. A large positive coefficient means the feature increases predicted charges when its scaled value is high.
              </InfoBox>
            </Section>

            <Section title="Visual Coefficient Chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lrCoeffs} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={110} />
                  <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', fontSize: '0.82rem' }}>
                      <p style={{ color: '#94a3b8' }}>{label}</p>
                      <p style={{ color: '#0d9488', fontWeight: 700 }}>Coefficient: {payload[0].value?.toFixed(4)}</p>
                    </div>;
                  }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" />
                  <Bar dataKey="coefficient" radius={[0, 4, 4, 0]}>
                    {lrCoeffs.map((e, i) => <Cell key={i} fill={e.coefficient >= 0 ? '#0d9488' : '#ef4444'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>
          </div>
        )}

        {/* METRICS */}
        {activeTab === 'metrics' && lr && (
          <div>
            <Section title="Model Evaluation Metrics" subtitle="Calculated from the 20% test set — not training data">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'R² Score', val: lr.r2?.toFixed(4), desc: 'Proportion of variance explained', color: '#2dd4bf' },
                  { label: 'MAE', val: `₹${lr.mae?.toLocaleString('en-IN')}`, desc: 'Mean Absolute Error', color: '#38bdf8' },
                  { label: 'MSE', val: `₹${lr.mse?.toLocaleString('en-IN')}`, desc: 'Mean Squared Error', color: '#a5b4fc' },
                  { label: 'RMSE', val: `₹${lr.rmse?.toLocaleString('en-IN')}`, desc: 'Root Mean Squared Error', color: '#fbbf24' },
                  { label: 'Train Size', val: lr.train_size, desc: '80% of dataset', color: '#34d399' },
                  { label: 'Test Size', val: lr.test_size, desc: '20% of dataset', color: '#fb923c' },
                ].map(m => (
                  <div key={m.label} className="metric-card">
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: m.color, marginTop: '0.4rem', fontFamily: 'JetBrains Mono, monospace' }}>{m.val}</div>
                    <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.3rem' }}>{m.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {[
                  { metric: 'R² (R-squared)', formula: 'R² = 1 − SS_res / SS_tot', meaning: 'Values range 0–1. Higher is better. R²=0.8 means 80% of variance in charges is explained by the model.' },
                  { metric: 'MAE', formula: 'MAE = (1/n) Σ |yᵢ − ŷᵢ|', meaning: 'Average absolute difference between actual and predicted. Expressed in the same units as charges (₹).' },
                  { metric: 'MSE', formula: 'MSE = (1/n) Σ (yᵢ − ŷᵢ)²', meaning: 'Mean of squared errors. Penalizes large errors more heavily than MAE. Units are squared rupees (₹²).' },
                  { metric: 'RMSE', formula: 'RMSE = √MSE', meaning: 'Square root of MSE. Back in Rupee units (₹). Directly comparable to MAE — higher sensitivity to outliers.' },
                ].map(m => (
                  <div key={m.metric} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>{m.metric}</div>
                    <div className="code-block" style={{ padding: '0.4rem 0.75rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>{m.formula}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6 }}>{m.meaning}</div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ACTUAL VS PREDICTED */}
        {activeTab === 'avp' && avpData.length > 0 && (
          <Section title="Actual vs Predicted Chart" subtitle="How closely model predictions match real charges (150 test samples)">
            <ResponsiveContainer width="100%" height={380}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="actual" name="Actual" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} label={{ value: 'Actual Charges', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="predicted" name="Predicted" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} label={{ value: 'Predicted Charges', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', fontSize: '0.8rem' }}>
                    <p>Actual: <strong style={{ color: '#0ea5e9' }}>₹{d?.actual?.toLocaleString('en-IN')}</strong></p>
                    <p>Predicted: <strong style={{ color: '#0d9488' }}>₹{d?.predicted?.toLocaleString('en-IN')}</strong></p>
                    <p>Error: <strong style={{ color: '#f87171' }}>₹{Math.abs(d?.actual - d?.predicted)?.toFixed(0)}</strong></p>
                  </div>;
                }} />
                <Scatter data={avpData} fill="#0d948870" />
                {/* Perfect prediction line */}
                <Line data={[{ actual: 0, predicted: 0 }, { actual: 65000, predicted: 65000 }]} type="linear" dataKey="predicted" stroke="#ffffff20" dot={false} strokeDasharray="4 4" />
              </ScatterChart>
            </ResponsiveContainer>
            <InfoBox style={{ marginTop: '1rem' }}>
              <strong style={{ color: '#2dd4bf' }}>How to read this chart:</strong> Points on the diagonal line represent perfect predictions. Points above the line mean the model over-predicted; below means under-predicted. A tight cluster around the diagonal indicates a well-fitted model.
            </InfoBox>
          </Section>
        )}

        {/* RESIDUALS */}
        {activeTab === 'residuals' && residData.length > 0 && (
          <div>
            <Section title="Residual Plot" subtitle="Residual = Actual − Predicted. Should be randomly distributed around zero.">
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="predicted" name="Predicted" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} label={{ value: 'Predicted Charges', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} />
                  <YAxis dataKey="residual" name="Residual" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} label={{ value: 'Residual', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} />
                  <ReferenceLine y={0} stroke="#ffffff30" strokeDasharray="4 4" />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', fontSize: '0.8rem' }}>
                      <p>Predicted: <strong style={{ color: '#0d9488' }}>₹{d?.predicted?.toLocaleString('en-IN')}</strong></p>
                      <p>Residual: <strong style={{ color: d?.residual >= 0 ? '#2dd4bf' : '#f87171' }}>₹{d?.residual?.toLocaleString('en-IN')}</strong></p>
                    </div>;
                  }} />
                  <Scatter data={residData}>{residData.map((e, i) => <Cell key={i} fill={e.residual >= 0 ? '#0d948870' : '#ef444470'} />)}</Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <InfoBox color="#6366f1" style={{ marginTop: '1rem' }}>
                <strong style={{ color: '#a5b4fc' }}>What to look for:</strong> A good linear regression residual plot shows points scattered randomly around zero with no pattern. Funnel shapes indicate <em>heteroscedasticity</em>. Curved patterns suggest the model might benefit from polynomial features or a non-linear algorithm like Random Forest.
              </InfoBox>
            </Section>
          </div>
        )}

        {/* CORRELATION */}
        {activeTab === 'correlation' && corr && (
          <div>
            <Section title="Correlation Matrix" subtitle="Pearson correlation coefficients between numerical variables">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'separate', borderSpacing: 3, margin: '0 auto' }}>
                  <thead>
                    <tr>
                      <th style={{ background: 'transparent', padding: '0.5rem', fontSize: '0.72rem', color: '#64748b' }}></th>
                      {corrLabels.map(l => <th key={l} style={{ padding: '0.5rem 0.375rem', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap' }}>{l}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {corrMatrix.map((row, ri) => (
                      <tr key={ri}>
                        <td style={{ padding: '0.375rem 0.5rem', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>{corrLabels[ri]}</td>
                        {row.map((val, ci) => (
                          <td key={ci}>
                            <div className="heatmap-cell" style={{
                              width: 58, height: 42,
                              background: heatColor(val),
                              color: Math.abs(val) > 0.5 ? '#fff' : '#94a3b8',
                              fontSize: '0.72rem',
                            }}>
                              {val.toFixed(2)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <div style={{ width: 40, height: 12, borderRadius: 4, background: 'rgba(13,148,136,0.9)' }} /> Strong positive
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <div style={{ width: 40, height: 12, borderRadius: 4, background: 'rgba(239,68,68,0.9)' }} /> Strong negative
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <div style={{ width: 40, height: 12, borderRadius: 4, background: 'rgba(100,116,139,0.3)' }} /> Weak / none
                </div>
              </div>
            </Section>

            <Section title="Correlation with Charges" subtitle="Pearson r values and p-values for each predictor vs. insurance charges">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {corrPairs.map(p => (
                  <div key={p.variable} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8', fontSize: '0.85rem' }}>{p.variable}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: p.correlation > 0 ? '#2dd4bf' : '#f87171', fontWeight: 700 }}>r = {p.correlation}</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${Math.abs(p.correlation) * 100}%`, background: p.correlation > 0 ? 'linear-gradient(90deg,#0d9488,#0ea5e9)' : 'linear-gradient(90deg,#ef4444,#f97316)' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.4rem' }}>p-value: {p.p_value < 0.001 ? '< 0.001 ✓ significant' : p.p_value.toFixed(4)}</div>
                  </div>
                ))}
              </div>
              <InfoBox color="#f59e0b" style={{ marginTop: '1rem' }}>
                <strong style={{ color: '#fbbf24' }}>⚠ Correlation ≠ Causation:</strong> A high correlation between smoking and charges does not mean smoking directly causes high insurance costs in this model — it means they co-vary. However, domain knowledge (medical research) does support this causal relationship independently.
              </InfoBox>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
