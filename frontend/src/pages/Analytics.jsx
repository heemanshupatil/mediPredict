import { useEffect, useState } from 'react';
import { fetchStatistics } from '../services/api';
import { toast } from 'react-hot-toast';
import HeartbeatLoader from '../components/HeartbeatLoader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, PieChart, Pie, Legend, LineChart, Line, Area, AreaChart
} from 'recharts';

const COLORS = ['#0d9488', '#0ea5e9', '#6366f1', '#f59e0b', '#ec4899', '#10b981'];

function Section({ title, subtitle, children }) {
  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{title}</h3>
        {subtitle && <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.25rem' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function StatTable({ data, label }) {
  if (!data) return null;
  const rows = [
    ['Mean', data.mean?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['Median', data.median?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['Mode', data.mode?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['Min', data.min?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['Max', data.max?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['Std Dev', data.std?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['Variance', data.variance?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['Q1 (25%)', data.q1?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['Q3 (75%)', data.q3?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['IQR', data.iqr?.toLocaleString('en-US', { maximumFractionDigits: 2 })],
    ['Skewness', data.skewness?.toFixed(4)],
    ['Kurtosis', data.kurtosis?.toFixed(4)],
  ];
  return (
    <div>
      <div style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
        {label}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
        {rows.map(([k, v]) => (
          <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{k}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomTip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
      <p style={{ color: '#94a3b8', marginBottom: '0.35rem' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#0d9488', fontWeight: 700 }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('descriptive');

  useEffect(() => {
    fetchStatistics().then(s => { setStats(s); setLoading(false); }).catch(e => { toast.error(e.message); setLoading(false); });
  }, []);

  const TABS = [
    { id: 'descriptive', label: '📊 Descriptive Stats' },
    { id: 'distributions', label: '📈 Distributions' },
    { id: 'categorical', label: '🏷 Categorical' },
    { id: 'scatter', label: '🔵 Scatter Plots' },
    { id: 'boxplot', label: '📦 Box Plots' },
    { id: 'eda', label: '🔍 EDA' },
  ];

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <HeartbeatLoader 
        message="Generating Statistical Analytics..." 
        subMessage="Aggregating distributions, skewness and biomarker correlations" 
      />
    </div>
  );

  if (!stats) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load statistics. Is the backend running?</div>
    </div>
  );

  const { descriptive, distributions, categorical_analysis: cat, scatter_data: scatter, box_plots: boxes, overview } = stats;

  // Prepare chart data
  const ageHist = distributions?.age?.bin_centers?.map((c, i) => ({ x: c, count: distributions.age.counts[i] })) || [];
  const bmiHist = distributions?.bmi?.bin_centers?.map((c, i) => ({ x: c, count: distributions.bmi.counts[i] })) || [];
  const chargesHist = distributions?.charges?.bin_centers?.map((c, i) => ({ x: Math.round(c), count: distributions.charges.counts[i] })) || [];

  const smokerPie = cat?.smoker?.value_counts ? Object.entries(cat.smoker.value_counts).map(([name, value]) => ({ name, value })) : [];
  const regionBar = cat?.region?.charges_by_group ? Object.entries(cat.region.charges_by_group).map(([name, avg]) => ({ name, avg })) : [];
  const childrenBar = cat?.children?.charges_by_group ? Object.entries(cat.children.charges_by_group).map(([name, avg]) => ({ children: name, avg })) : [];
  const genderBar = cat?.sex?.charges_by_group ? Object.entries(cat.sex.charges_by_group).map(([name, avg]) => ({ name, avg })) : [];
  const smokerCharges = cat?.smoker?.charges_by_group ? Object.entries(cat.smoker.charges_by_group).map(([name, avg]) => ({ name, avg })) : [];

  return (
    <div style={{ minHeight: '100vh', padding: '2.5rem 1.5rem 4rem', background: '#090e1a' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="page-header">
          <div className="section-label">Data Science</div>
          <h1>Statistics & Analytics</h1>
          <p>Comprehensive exploratory data analysis with descriptive statistics, distributions, and visualizations</p>
        </div>

        {/* Overview summary row */}
        {overview && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Records', val: overview.total_records.toLocaleString() },
              { label: 'Features', val: overview.num_features },
              { label: 'Missing', val: overview.missing_values },
              { label: 'Duplicates', val: overview.duplicate_rows },
            ].map(c => (
              <div key={c.label} className="metric-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2dd4bf' }}>{c.val}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={activeTab === t.id ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* DESCRIPTIVE STATS */}
        {activeTab === 'descriptive' && descriptive && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {['age', 'bmi', 'children', 'charges'].map(col => (
                <Section key={col} title={col.charAt(0).toUpperCase() + col.slice(1)} subtitle="Descriptive statistics for this variable">
                  <StatTable data={descriptive[col]} label={col} />
                </Section>
              ))}
            </div>

            {/* Stat concept explainers */}
            <Section title="📚 What do these statistics mean?" subtitle="Quick reference for academic viva">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {[
                  { term: 'Mean', def: 'Average value — sum of all values ÷ count. Sensitive to outliers.' },
                  { term: 'Median', def: 'Middle value when sorted. Robust to outliers — better for skewed data.' },
                  { term: 'Mode', def: 'Most frequently occurring value in the dataset.' },
                  { term: 'Standard Deviation', def: 'Average distance of values from the mean. Higher = more spread.' },
                  { term: 'Variance', def: 'Square of standard deviation. Measures data dispersion.' },
                  { term: 'Q1 / Q3', def: '25th and 75th percentiles. Describe the middle 50% of data.' },
                  { term: 'IQR', def: 'Interquartile Range = Q3 − Q1. Used to detect outliers.' },
                  { term: 'Skewness', def: 'Measures asymmetry. Positive = right tail; negative = left tail.' },
                ].map(c => (
                  <div key={c.term} style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '0.875rem 1rem' }}>
                    <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{c.term}</div>
                    <div style={{ color: '#64748b', fontSize: '0.78rem', lineHeight: 1.6 }}>{c.def}</div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* DISTRIBUTIONS */}
        {activeTab === 'distributions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
            <Section title="Age Distribution" subtitle="Frequency histogram of patient ages">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={ageHist}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="x" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Age (years)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} /><YAxis tick={{ fill: '#64748b', fontSize: 11 }} /><Tooltip content={<CustomTip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} /><Bar dataKey="count" fill="#0d9488" radius={[3, 3, 0, 0]} name="Count" /></BarChart>
              </ResponsiveContainer>
            </Section>

            <Section title="BMI Distribution" subtitle="Frequency histogram of Body Mass Index">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={bmiHist}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="x" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'BMI', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} /><YAxis tick={{ fill: '#64748b', fontSize: 11 }} /><Tooltip content={<CustomTip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} /><Bar dataKey="count" fill="#0ea5e9" radius={[3, 3, 0, 0]} name="Count" /></BarChart>
              </ResponsiveContainer>
            </Section>

            <Section title="Charges Distribution" subtitle="Frequency histogram of annual insurance charges">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chargesHist}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="x" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} /><YAxis tick={{ fill: '#64748b', fontSize: 11 }} /><Tooltip content={<CustomTip prefix="₹" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} /><Bar dataKey="count" fill="#6366f1" radius={[3, 3, 0, 0]} name="Count" /></BarChart>
              </ResponsiveContainer>
            </Section>
          </div>
        )}

        {/* CATEGORICAL */}
        {activeTab === 'categorical' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
            <Section title="Charges by Smoking Status" subtitle="Average annual charges for smokers vs non-smokers">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={smokerCharges}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} /><YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} /><Tooltip content={<CustomTip prefix="₹" />} /><Bar dataKey="avg" name="Avg Charges" radius={[5, 5, 0, 0]}>{smokerCharges.map((e, i) => <Cell key={i} fill={e.name === 'yes' ? '#ef4444' : '#10b981'} />)}</Bar></BarChart>
              </ResponsiveContainer>
            </Section>

            <Section title="Charges by Region" subtitle="Average charges across US geographic regions">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={regionBar}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} /><YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} /><Tooltip content={<CustomTip prefix="₹" />} /><Bar dataKey="avg" name="Avg Charges" radius={[5, 5, 0, 0]}>{regionBar.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar></BarChart>
              </ResponsiveContainer>
            </Section>

            <Section title="Charges by Gender" subtitle="Average charges by sex">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={genderBar}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} /><YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} /><Tooltip content={<CustomTip prefix="₹" />} /><Bar dataKey="avg" name="Avg Charges" radius={[5, 5, 0, 0]}>{genderBar.map((e, i) => <Cell key={i} fill={i === 0 ? '#0ea5e9' : '#ec4899'} />)}</Bar></BarChart>
              </ResponsiveContainer>
            </Section>

            <Section title="Charges by Number of Children" subtitle="How dependents affect average insurance cost">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={childrenBar}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="children" tick={{ fill: '#64748b', fontSize: 12 }} label={{ value: 'Children', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} /><YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} /><Tooltip content={<CustomTip prefix="₹" />} /><Bar dataKey="avg" name="Avg Charges" fill="#f59e0b" radius={[5, 5, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </Section>

            <Section title="Smoker Distribution" subtitle="Proportion of smokers vs non-smokers in dataset">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart><Pie data={smokerPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`} labelLine={false} fontSize={12}>
                  {smokerPie.map((e, i) => <Cell key={i} fill={e.name === 'yes' ? '#ef4444' : '#10b981'} />)}
                </Pie><Tooltip /><Legend /></PieChart>
              </ResponsiveContainer>
            </Section>
          </div>
        )}

        {/* SCATTER */}
        {activeTab === 'scatter' && scatter && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
            <Section title="Charges vs Age" subtitle="Scatter plot colored by smoking status (sample of 400 records)">
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="x" name="Age" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Age', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} /><YAxis dataKey="y" name="Charges" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} /><Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', fontSize: '0.8rem' }}><p>Age: {d?.x}</p><p>Charges: ₹{d?.y?.toLocaleString('en-IN')}</p><p>Smoker: {d?.smoker}</p></div>;
                }} />
                  <Scatter data={scatter.age_vs_charges}>{scatter.age_vs_charges.map((e, i) => <Cell key={i} fill={e.smoker === 'yes' ? '#ef444490' : '#0d948890'} />)}</Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#94a3b8' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} /> Smoker</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#94a3b8' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#0d9488' }} /> Non-smoker</div>
              </div>
            </Section>

            <Section title="Charges vs BMI" subtitle="BMI vs charges with smoker coloring">
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="x" name="BMI" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'BMI', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} /><YAxis dataKey="y" name="Charges" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} /><Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', fontSize: '0.8rem' }}><p>BMI: {d?.x}</p><p>Charges: ₹{d?.y?.toLocaleString('en-IN')}</p><p>Smoker: {d?.smoker}</p></div>;
                }} />
                  <Scatter data={scatter.bmi_vs_charges}>{scatter.bmi_vs_charges.map((e, i) => <Cell key={i} fill={e.smoker === 'yes' ? '#f59e0b90' : '#0ea5e990'} />)}</Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#94a3b8' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} /> Smoker</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#94a3b8' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#0ea5e9' }} /> Non-smoker</div>
              </div>
            </Section>
          </div>
        )}

        {/* BOX PLOTS */}
        {activeTab === 'boxplot' && boxes && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {['age', 'bmi', 'charges'].map(col => {
                const b = boxes[col];
                if (!b) return null;
                const unit = col === 'charges' ? '₹' : '';
                const fmt = v => col === 'charges' ? `₹${Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : v;
                return (
                  <Section key={col} title={`${col.toUpperCase()} Box Plot`} subtitle={`Outlier count: ${b.outlier_count}`}>
                    <div style={{ padding: '1rem 0' }}>
                      {[
                        { label: 'Maximum Whisker', val: fmt(b.whisker_high), color: '#64748b' },
                        { label: 'Q3 (75th percentile)', val: fmt(b.q3), color: '#0ea5e9' },
                        { label: 'Median (Q2)', val: fmt(b.median), color: '#0d9488' },
                        { label: 'Q1 (25th percentile)', val: fmt(b.q1), color: '#0ea5e9' },
                        { label: 'Minimum Whisker', val: fmt(b.whisker_low), color: '#64748b' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderLeft: `3px solid ${item.color}`, marginBottom: '0.4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0 6px 6px 0' }}>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.label}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.val}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: 8, fontSize: '0.78rem', color: '#fca5a5' }}>
                        ⚠ {b.outlier_count} outlier{b.outlier_count !== 1 ? 's' : ''} detected (values beyond 1.5 × IQR)
                      </div>
                    </div>
                  </Section>
                );
              })}
            </div>
            <Section title="📚 What is a Box Plot?" subtitle="Understanding outlier analysis">
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.8 }}>
                A box plot displays the distribution of data based on five summary statistics: minimum whisker, Q1, median (Q2), Q3, and maximum whisker.
                Points outside 1.5 × IQR from Q1/Q3 are considered <strong style={{ color: '#f87171' }}>outliers</strong> and shown as individual dots.
                <br /><br />
                In medical insurance data, high-charge outliers often represent patients with serious conditions or smokers with high BMI.
                These outliers are kept in the dataset to preserve real-world data characteristics.
              </p>
            </Section>
          </div>
        )}

        {/* EDA */}
        {activeTab === 'eda' && (
          <div>
            <Section title="Dataset Overview" subtitle="Basic structural information">
              {overview && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {[
                    ['Rows', overview.total_records],
                    ['Columns', (overview.num_features || 0) + 1],
                    ['Target Variable', 'charges (₹)'],
                    ['Missing Values', overview.missing_values + ' (none expected)'],
                    ['Duplicate Rows', overview.duplicate_rows],
                    ['Feature Types', '3 numerical, 3 categorical'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '0.875rem 1rem' }}>
                      <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{k}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0d9488', marginTop: '0.2rem' }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Data Types" subtitle="Variable classifications for the dataset">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {[
                  { col: 'age', dtype: 'int64', role: 'Numerical — Independent', range: '18–64' },
                  { col: 'sex', dtype: 'object', role: 'Categorical — Independent', vals: 'male, female' },
                  { col: 'bmi', dtype: 'float64', role: 'Numerical — Independent', range: '~16–53' },
                  { col: 'children', dtype: 'int64', role: 'Numerical — Independent', range: '0–5' },
                  { col: 'smoker', dtype: 'object', role: 'Categorical — Independent', vals: 'yes, no' },
                  { col: 'region', dtype: 'object', role: 'Categorical — Independent', vals: '4 US regions' },
                  { col: 'charges', dtype: 'float64', role: 'Numerical — TARGET (Y)', range: '₹1k–₹65k' },
                ].map(v => (
                  <div key={v.col} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0d9488', fontWeight: 600, fontSize: '0.9rem' }}>{v.col}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#6366f1', fontSize: '0.75rem' }}>{v.dtype}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{v.role}</div>
                    {v.range && <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.2rem' }}>Range: {v.range}</div>}
                    {v.vals && <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.2rem' }}>Values: {v.vals}</div>}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Feature Encoding Strategy" subtitle="How categorical variables are prepared for ML models">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {[
                  { feature: 'sex', method: 'OneHotEncoder (drop=first)', result: 'sex_male → 0/1', note: 'female is the dropped reference category' },
                  { feature: 'smoker', method: 'OneHotEncoder (drop=first)', result: 'smoker_yes → 0/1', note: 'no is the dropped reference category' },
                  { feature: 'region', method: 'OneHotEncoder (drop=first)', result: '3 binary columns', note: 'northwest is dropped reference' },
                  { feature: 'age, bmi, children', method: 'StandardScaler', result: 'z-score normalized', note: 'μ=0, σ=1 after scaling' },
                ].map(f => (
                  <div key={f.feature} style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '0.875rem 1rem' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#a5b4fc', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{f.feature}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem' }}>Method: <span style={{ color: '#94a3b8' }}>{f.method}</span></div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem' }}>Result: <span style={{ color: '#0d9488' }}>{f.result}</span></div>
                    <div style={{ fontSize: '0.72rem', color: '#475569' }}>ℹ {f.note}</div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
