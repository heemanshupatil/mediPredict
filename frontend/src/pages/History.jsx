import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHistory, deleteHistory, clearHistory } from '../services/api';
import { toast } from 'react-hot-toast';
import {
  History as HistoryIcon,
  Trash2,
  Download,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModel, setFilterModel] = useState('all');
  const [filterSmoker, setFilterSmoker] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load prediction history: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteHistory(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Record deleted successfully');
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearHistory();
      setHistory([]);
      toast.success('All history cleared');
      setShowClearConfirm(false);
    } catch (err) {
      toast.error('Clear failed: ' + err.message);
    }
  };

  const exportCSV = () => {
    if (history.length === 0) {
      toast.error('No records to export');
      return;
    }
    const headers = ['ID', 'Timestamp', 'Age', 'Sex', 'BMI', 'Children', 'Smoker', 'Region', 'Model', 'Predicted Cost'];
    const rows = history.map(r => [
      r.id,
      r.timestamp,
      r.age,
      r.sex,
      r.bmi,
      r.children,
      r.smoker,
      r.region,
      r.model,
      r.predicted_cost
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medipredict_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  // Filtered records
  const filtered = history.filter(item => {
    if (filterModel !== 'all' && item.model !== filterModel) return false;
    if (filterSmoker !== 'all' && item.smoker !== filterSmoker) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchRegion = item.region?.toLowerCase().includes(term);
      const matchSex = item.sex?.toLowerCase().includes(term);
      const matchModel = item.model?.toLowerCase().includes(term);
      const matchCost = item.predicted_cost?.toString().includes(term);
      const matchAge = item.age?.toString().includes(term);
      if (!matchRegion && !matchSex && !matchModel && !matchCost && !matchAge) return false;
    }
    return true;
  });

  // Calculate metrics
  const totalRecords = history.length;
  const costs = history.map(h => h.predicted_cost).filter(c => typeof c === 'number' && !isNaN(c));
  const avgCost = costs.length ? Math.round(costs.reduce((a, b) => a + b, 0) / costs.length) : 0;
  const maxCost = costs.length ? Math.max(...costs) : 0;
  const minCost = costs.length ? Math.min(...costs) : 0;

  // Chart data: chronological cost trends
  const chartData = [...history]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(-20)
    .map((item, idx) => ({
      name: `#${item.id || idx + 1}`,
      cost: Math.round(item.predicted_cost),
      age: item.age,
      smoker: item.smoker === 'yes' ? 'Smoker' : 'Non-Smoker',
      model: item.model === 'random_forest' ? 'Random Forest' : 'Linear Reg',
    }));

  return (
    <div style={{ minHeight: '100vh', background: '#090e1a', padding: '2rem 0 4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(14,165,233,0.2))',
              border: '1px solid rgba(13,148,136,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <HistoryIcon size={22} color="#0d9488" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Prediction History
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                Track past queries, review generated estimates, and audit model inferences.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={loadHistory}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={history.length === 0}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={history.length === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem',
              background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px', padding: '0.5rem 1rem', cursor: history.length === 0 ? 'not-allowed' : 'pointer',
              opacity: history.length === 0 ? 0.5 : 1
            }}
          >
            <Trash2 size={15} />
            Clear All
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clear All */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', border: '1px solid rgba(239,68,68,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', marginBottom: '1rem' }}>
              <AlertCircle size={28} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Confirm Clear History</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to delete all past prediction logs? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  background: '#ef4444', color: 'white', border: 'none',
                  borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: 600, cursor: 'pointer'
                }}
                onClick={handleClearAll}
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem', marginBottom: '2rem'
      }}>
        <div className="metric-card glass-card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Predictions</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2dd4bf', marginTop: '0.5rem' }}>{totalRecords}</div>
            </div>
            <div style={{
              padding: '0.6rem', borderRadius: 10,
              background: 'rgba(13,148,136,0.15)', color: '#0d9488'
            }}>
              <Layers size={20} />
            </div>
          </div>
        </div>

        <div className="metric-card glass-card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Predicted Cost</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.5rem' }}>₹{avgCost.toLocaleString('en-IN')}</div>
            </div>
            <div style={{
              padding: '0.6rem', borderRadius: 10,
              background: 'rgba(14,165,233,0.15)', color: '#0ea5e9'
            }}>
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="metric-card glass-card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Highest Predicted</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.5rem' }}>₹{Math.round(maxCost).toLocaleString('en-IN')}</div>
            </div>
            <div style={{
              padding: '0.6rem', borderRadius: 10,
              background: 'rgba(245,158,11,0.15)', color: '#f59e0b'
            }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="metric-card glass-card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lowest Predicted</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.5rem' }}>₹{Math.round(minCost).toLocaleString('en-IN')}</div>
            </div>
            <div style={{
              padding: '0.6rem', borderRadius: 10,
              background: 'rgba(16,185,129,0.15)', color: '#10b981'
            }}>
              <Sparkles size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {chartData.length > 1 && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              Recent Prediction Cost Trajectory
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Sequential trend of the latest insurance calculations (₹ INR)
            </p>
          </div>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{
                          background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: 8, padding: '0.75rem', fontSize: '0.8rem', color: '#f8fafc'
                        }}>
                          <div style={{ fontWeight: 700, color: '#2dd4bf', marginBottom: '4px' }}>
                            {data.name}: ₹{data.cost?.toLocaleString('en-IN')}
                          </div>
                          <div>Age: {data.age} yrs</div>
                          <div>Status: {data.smoker}</div>
                          <div>Model: {data.model}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="cost" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#costGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by region, sex, cost, or age..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>

          {/* Model Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              value={filterModel}
              onChange={e => setFilterModel(e.target.value)}
              className="input-field"
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value="all">All Models</option>
              <option value="linear_regression">Linear Regression</option>
              <option value="random_forest">Random Forest</option>
            </select>
          </div>

          {/* Smoker Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={filterSmoker}
              onChange={e => setFilterSmoker(e.target.value)}
              className="input-field"
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value="all">All Habits</option>
              <option value="yes">Smokers</option>
              <option value="no">Non-Smokers</option>
            </select>
          </div>

          {(searchTerm || filterModel !== 'all' || filterSmoker !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setFilterModel('all'); setFilterSmoker('all'); }}
              style={{
                background: 'none', border: 'none', color: '#0ea5e9',
                fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem', display: 'block', color: '#0d9488' }} />
            Loading query history...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <HistoryIcon size={44} color="#475569" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ color: '#f8fafc', fontWeight: 700, margin: '0 0 0.5rem' }}>No Prediction Logs Found</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              {history.length === 0
                ? "You haven't run any insurance predictions yet. Try entering patient parameters on the Predict page."
                : "No records match your active search filters."}
            </p>
            {history.length === 0 && (
              <button
                className="btn-primary"
                onClick={() => navigate('/predict')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Go to Predict
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>ID & Date</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Patient Profile</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>BMI & Category</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Smoker</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Region</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Model Used</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Predicted Cost</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => {
                  const dateStr = row.timestamp ? new Date(row.timestamp).toLocaleString([], {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  }) : 'N/A';
                  const bmiVal = Number(row.bmi);
                  const isObese = bmiVal >= 30;
                  const isSmoker = row.smoker === 'yes';

                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 700, color: '#f8fafc', marginRight: '6px' }}>#{row.id}</span>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dateStr}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ color: '#f8fafc', fontWeight: 600 }}>{row.age} yrs • {row.sex}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.children} {row.children === 1 ? 'dependent' : 'dependents'}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: isObese ? '#f59e0b' : '#38bdf8' }}>
                          {bmiVal.toFixed(1)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {isObese ? 'Obese (≥30)' : bmiVal >= 25 ? 'Overweight' : 'Normal'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600,
                          background: isSmoker ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                          color: isSmoker ? '#ef4444' : '#10b981',
                          border: isSmoker ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(16,185,129,0.3)'
                        }}>
                          {isSmoker ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textTransform: 'capitalize', color: '#cbd5e1' }}>
                        {row.region}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.75rem',
                          background: row.model === 'random_forest' ? 'rgba(168,85,247,0.15)' : 'rgba(14,165,233,0.15)',
                          color: row.model === 'random_forest' ? '#c084fc' : '#38bdf8',
                          border: `1px solid ${row.model === 'random_forest' ? 'rgba(168,85,247,0.3)' : 'rgba(14,165,233,0.3)'}`
                        }}>
                          {row.model === 'random_forest' ? 'Random Forest' : 'Linear Reg'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2dd4bf' }}>
                          ₹{Math.round(row.predicted_cost).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>annually</div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {deleteConfirmId === row.id ? (
                          <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                            <button
                              onClick={() => handleDelete(row.id)}
                              style={{
                                background: '#ef4444', color: 'white', border: 'none',
                                borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.72rem', cursor: 'pointer'
                              }}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              style={{
                                background: '#334155', color: '#f8fafc', border: 'none',
                                borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.72rem', cursor: 'pointer'
                              }}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(row.id)}
                            title="Delete this query log"
                            style={{
                              background: 'transparent', border: 'none', color: '#64748b',
                              cursor: 'pointer', padding: '0.35rem', borderRadius: 6,
                              transition: 'color 0.15s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
