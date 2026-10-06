import { useEffect, useState } from 'react';
import { fetchModelMetrics } from '../services/api';
import { toast } from 'react-hot-toast';
import HeartbeatLoader from '../components/HeartbeatLoader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from 'recharts';

function formatMetricValue(val, isR2 = false) {
  if (val == null) return '-';
  if (typeof val !== 'number') return val;
  if (isR2) return val.toFixed(4);
  if (val >= 1000000) {
    return Math.round(val).toLocaleString('en-US');
  }
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function MetricCard({ label, lr, rf, better, unit = '', prefix = '', isR2 = false }) {
  const lrStr = `${prefix}${formatMetricValue(lr, isR2)}${unit}`;
  const rfStr = `${prefix}${formatMetricValue(rf, isR2)}${unit}`;

  const getFontSize = (str) => {
    if (str.length > 10) return '1.05rem';
    if (str.length > 8) return '1.18rem';
    return '1.35rem';
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.15rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.9rem', lineHeight: 1.3 }}>
        {label}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
        {/* Linear Regression */}
        <div style={{
          background: better === 'lr' ? 'rgba(13,148,136,0.12)' : 'rgba(255,255,255,0.02)',
          border: `1.5px solid ${better === 'lr' ? 'rgba(13,148,136,0.6)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 10,
          padding: '0.75rem 0.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', color: '#0d9488', fontWeight: 700 }}>Linear</span>
            {better === 'lr' && (
              <span style={{ background: '#0d9488', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: 4 }}>
                WINNER
              </span>
            )}
          </div>
          <div style={{
            fontSize: getFontSize(lrStr),
            fontWeight: 800,
            fontFamily: 'JetBrains Mono, monospace',
            color: better === 'lr' ? '#2dd4bf' : '#e2e8f0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {lrStr}
          </div>
        </div>

        {/* Random Forest */}
        <div style={{
          background: better === 'rf' ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
          border: `1.5px solid ${better === 'rf' ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 10,
          padding: '0.75rem 0.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', color: '#a5b4fc', fontWeight: 700 }}>Random Forest</span>
            {better === 'rf' && (
              <span style={{ background: '#6366f1', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: 4 }}>
                WINNER
              </span>
            )}
          </div>
          <div style={{
            fontSize: getFontSize(rfStr),
            fontWeight: 800,
            fontFamily: 'JetBrains Mono, monospace',
            color: better === 'rf' ? '#c7d2fe' : '#e2e8f0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {rfStr}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModelComparison() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelMetrics().then(m => { setMetrics(m); setLoading(false); })
      .catch(e => { toast.error(e.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <HeartbeatLoader 
        message="Benchmarking Machine Learning Models..." 
        subMessage="Comparing cross-validation scores, residuals and performance metrics" 
      />
    </div>
  );

  const lr = metrics?.linear_regression;
  const rf = metrics?.random_forest;
  if (!lr || !rf) return null;

  const betterR2 = rf.r2 > lr.r2 ? 'rf' : 'lr';
  const betterMAE = rf.mae < lr.mae ? 'rf' : 'lr';
  const betterMSE = rf.mse < lr.mse ? 'rf' : 'lr';
  const betterRMSE = rf.rmse < lr.rmse ? 'rf' : 'lr';

  const compTable = [
    { metric: 'R²', lr: lr.r2, rf: rf.r2, higherBetter: true, unit: '' },
    { metric: 'MAE', lr: lr.mae, rf: rf.mae, higherBetter: false, unit: '₹' },
    { metric: 'MSE', lr: lr.mse, rf: rf.mse, higherBetter: false, unit: '₹' },
    { metric: 'RMSE', lr: lr.rmse, rf: rf.rmse, higherBetter: false, unit: '₹' },
  ];

  const barData = [
    { name: 'R²', lr: lr.r2, rf: rf.r2 },
    { name: 'MAE/1000', lr: lr.mae / 1000, rf: rf.mae / 1000 },
    { name: 'RMSE/1000', lr: lr.rmse / 1000, rf: rf.rmse / 1000 },
  ];

  const rfImportances = rf.feature_importances || [];

  const radarData = [
    { metric: 'R²', LR: Math.round(lr.r2 * 100), RF: Math.round(rf.r2 * 100) },
    { metric: 'MAE', LR: Math.round((1 - lr.mae / 30000) * 100), RF: Math.round((1 - rf.mae / 30000) * 100) },
    { metric: 'RMSE', LR: Math.round((1 - lr.rmse / 30000) * 100), RF: Math.round((1 - rf.rmse / 30000) * 100) },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '2.5rem 1.5rem 4rem', background: '#090e1a' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div className="page-header">
          <div className="section-label">Model Comparison</div>
          <h1>Linear vs Random Forest</h1>
          <p>Side-by-side evaluation of both regression models trained on the same dataset with identical 80/20 split</p>
        </div>

        {/* Key metrics side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <MetricCard label="R² Score (higher = better)" lr={lr.r2} rf={rf.r2} better={betterR2} isR2={true} />
          <MetricCard label="MAE — Mean Absolute Error (lower = better)" lr={lr.mae} rf={rf.mae} better={betterMAE} prefix="₹" />
          <MetricCard label="MSE — Mean Squared Error (lower = better)" lr={lr.mse} rf={rf.mse} better={betterMSE} prefix="₹" />
          <MetricCard label="RMSE — Root Mean Squared Error (lower = better)" lr={lr.rmse} rf={rf.rmse} better={betterRMSE} prefix="₹" />
        </div>

        {/* Comparison table */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📋 Full Comparison Table</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Linear Regression</th>
                  <th>Random Forest</th>
                  <th>Winner</th>
                  <th>Higher is Better?</th>
                </tr>
              </thead>
              <tbody>
                {compTable.map(row => {
                  const lrBetter = row.higherBetter ? row.lr > row.rf : row.lr < row.rf;
                  return (
                    <tr key={row.metric}>
                      <td style={{ fontWeight: 700 }}>{row.metric}</td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', color: lrBetter ? '#2dd4bf' : '#e2e8f0' }}>
                        {row.unit}{typeof row.lr === 'number' ? row.lr.toLocaleString('en-US', { maximumFractionDigits: 4 }) : row.lr}
                        {lrBetter && ' ✓'}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', color: !lrBetter ? '#a5b4fc' : '#e2e8f0' }}>
                        {row.unit}{typeof row.rf === 'number' ? row.rf.toLocaleString('en-US', { maximumFractionDigits: 4 }) : row.rf}
                        {!lrBetter && ' ✓'}
                      </td>
                      <td>
                        <span className={`badge ${lrBetter ? 'badge-teal' : 'badge-purple'}`} style={{ fontSize: '0.72rem' }}>
                          {lrBetter ? 'Linear Regression' : 'Random Forest'}
                        </span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{row.higherBetter ? '✓ Yes' : '✗ No'}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td style={{ fontWeight: 700 }}>Training Size</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{lr.train_size} records</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{rf.train_size} records</td>
                  <td>—</td><td style={{ color: '#64748b', fontSize: '0.82rem' }}>Identical</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Test Size</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{lr.test_size} records</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{rf.test_size} records</td>
                  <td>—</td><td style={{ color: '#64748b', fontSize: '0.82rem' }}>Identical</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Bar chart comparison */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>📊 Metric Comparison Chart</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', fontSize: '0.8rem' }}>
                    <p style={{ color: '#94a3b8', marginBottom: '0.35rem' }}>{label}</p>
                    {payload.map((p, i) => <p key={i} style={{ color: p.fill }}>{p.name}: {p.value?.toFixed(4)}</p>)}
                  </div>;
                }} />
                <Legend formatter={v => <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{v}</span>} />
                <Bar dataKey="lr" name="Linear Regression" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rf" name="Random Forest" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* RF Feature Importances */}
          {rfImportances.length > 0 && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>🌲 Random Forest Feature Importances</h3>
              <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '1rem' }}>How much each feature contributes to the ensemble predictions</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={rfImportances.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={100} />
                  <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', fontSize: '0.8rem' }}>
                      <p style={{ color: '#94a3b8', marginBottom: '0.35rem' }}>{label}</p>
                      <p style={{ color: '#6366f1' }}>Importance: {(payload[0].value * 100).toFixed(2)}%</p>
                    </div>;
                  }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="importance" fill="#6366f1" radius={[0, 4, 4, 0]}>
                    {rfImportances.slice(0, 8).map((e, i) => <Cell key={i} fill={`hsl(${250 + i * 15}, 60%, ${55 + i * 2}%)`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Model descriptions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem', borderColor: 'rgba(13,148,136,0.3)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2rem' }}>📐</div>
              <div>
                <div style={{ fontWeight: 700, color: '#2dd4bf' }}>Linear Regression</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ordinary Least Squares (OLS)</div>
              </div>
            </div>
            {[
              ['Algorithm', 'OLS minimizing sum of squared residuals'],
              ['Interpretability', 'High — direct coefficient reading'],
              ['Assumptions', 'Linearity, homoscedasticity, normality'],
              ['Best for', 'Linear relationships, explainability'],
              ['Complexity', 'O(n·p²) — fast on small datasets'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8rem', gap: '1rem' }}>
                <span style={{ color: '#64748b' }}>{k}</span>
                <span style={{ color: '#cbd5e1', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', borderColor: 'rgba(99,102,241,0.3)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🌲</div>
              <div>
                <div style={{ fontWeight: 700, color: '#a5b4fc' }}>Random Forest Regression</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ensemble of 100 Decision Trees</div>
              </div>
            </div>
            {[
              ['Algorithm', 'Bootstrap aggregating (bagging) of trees'],
              ['Interpretability', 'Medium — feature importances available'],
              ['Assumptions', 'Few — handles non-linearity well'],
              ['Best for', 'Complex patterns, high accuracy'],
              ['Complexity', 'O(n·p·log n·T) — T = number of trees'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8rem', gap: '1rem' }}>
                <span style={{ color: '#64748b' }}>{k}</span>
                <span style={{ color: '#cbd5e1', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
          <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem' }}>⚠️ Important Note on Model Comparison</div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.7 }}>
            The "better" model depends on the specific dataset, train/test split, and evaluation metric.
            These results use <strong style={{ color: '#fbbf24' }}>random_state=42</strong> and an <strong style={{ color: '#fbbf24' }}>80/20 split</strong> to ensure reproducibility.
            With a different split or dataset, results may differ. Always validate on held-out data before concluding one model is universally superior.
          </p>
        </div>
      </div>
    </div>
  );
}
