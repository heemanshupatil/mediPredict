import { useEffect, useState, useRef } from 'react';
import { Search, Upload, ChevronLeft, ChevronRight, Filter, Download, X } from 'lucide-react';
import { fetchDataset, uploadDataset } from '../services/api';
import { toast } from 'react-hot-toast';
import HeartbeatLoader from '../components/HeartbeatLoader';

const COLUMNS = ['age', 'sex', 'bmi', 'children', 'smoker', 'region', 'charges'];

export default function Dataset() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [overview, setOverview] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sex: '', smoker: '', region: '', search: '', age_min: '', age_max: '', bmi_min: '', bmi_max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const fileRef = useRef();

  useEffect(() => { load(); }, [page, filters]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchDataset({ page, per_page: 15, ...filters });
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.total_pages);
      setOverview(res.overview);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  function resetFilters() {
    setFilters({ sex: '', smoker: '', region: '', search: '', age_min: '', age_max: '', bmi_min: '', bmi_max: '' });
    setPage(1);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const t = toast.loading('Uploading and retraining...');
    try {
      const res = await uploadDataset(fd);
      toast.success(`${res.message} (${res.rows} rows)`, { id: t });
      load();
    } catch (err) {
      toast.error(err.message, { id: t });
    }
    e.target.value = '';
  }

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div style={{ minHeight: '100vh', padding: '2.5rem 1.5rem 4rem', background: '#09101f' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="page-header">
          <div className="section-label">Dataset Explorer</div>
          <h1>Insurance Dataset</h1>
          <p>Browse, filter, and analyze the medical insurance dataset used to train the models</p>
        </div>

        {/* Overview cards */}
        {overview && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Records', val: overview.total_records.toLocaleString(), color: '#2dd4bf' },
              { label: 'Features', val: overview.num_features, color: '#38bdf8' },
              { label: 'Target', val: 'charges', color: '#a5b4fc' },
              { label: 'Missing Values', val: overview.missing_values, color: '#34d399' },
              { label: 'Duplicates', val: overview.duplicate_rows, color: '#fbbf24' },
            ].map(c => (
              <div key={c.label} className="metric-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: c.color }}>{c.val}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={15} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input-field"
              placeholder="Search by sex, smoker, region..."
              value={filters.search}
              onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <button className={`btn-secondary ${showFilters ? 'selected' : ''}`} onClick={() => setShowFilters(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
            <Filter size={15} /> Filters {hasFilters && <span className="badge badge-teal" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>ON</span>}
          </button>
          {hasFilters && (
            <button className="btn-secondary" onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <X size={14} /> Clear
            </button>
          )}
          <button className="btn-secondary" onClick={() => fileRef.current.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
            <Upload size={15} /> Upload CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleUpload} />
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Gender</label>
              <select className="input-field select-field" value={filters.sex} onChange={e => { setFilters(f => ({ ...f, sex: e.target.value })); setPage(1); }} style={{ marginTop: '0.35rem' }}>
                <option value="">All</option><option value="male">Male</option><option value="female">Female</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Smoker</label>
              <select className="input-field select-field" value={filters.smoker} onChange={e => { setFilters(f => ({ ...f, smoker: e.target.value })); setPage(1); }} style={{ marginTop: '0.35rem' }}>
                <option value="">All</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Region</label>
              <select className="input-field select-field" value={filters.region} onChange={e => { setFilters(f => ({ ...f, region: e.target.value })); setPage(1); }} style={{ marginTop: '0.35rem' }}>
                <option value="">All</option>
                {['northeast','northwest','southeast','southwest'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Age Min</label>
              <input className="input-field" type="number" placeholder="18" value={filters.age_min}
                onChange={e => { setFilters(f => ({ ...f, age_min: e.target.value })); setPage(1); }} style={{ marginTop: '0.35rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Age Max</label>
              <input className="input-field" type="number" placeholder="100" value={filters.age_max}
                onChange={e => { setFilters(f => ({ ...f, age_max: e.target.value })); setPage(1); }} style={{ marginTop: '0.35rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>BMI Min</label>
              <input className="input-field" type="number" placeholder="10" value={filters.bmi_min}
                onChange={e => { setFilters(f => ({ ...f, bmi_min: e.target.value })); setPage(1); }} style={{ marginTop: '0.35rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>BMI Max</label>
              <input className="input-field" type="number" placeholder="70" value={filters.bmi_max}
                onChange={e => { setFilters(f => ({ ...f, bmi_max: e.target.value })); setPage(1); }} style={{ marginTop: '0.35rem' }} />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  {COLUMNS.map(c => <th key={c}>{c.toUpperCase()}</th>)}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <HeartbeatLoader 
                      size="small" 
                      message="Querying Patient Registry..." 
                      subMessage="Filtering records according to biomarker criteria" 
                    />
                  </td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No records found</td></tr>
                ) : data.map((row, i) => (
                  <tr key={i}>
                    <td style={{ color: '#475569', fontSize: '0.78rem' }}>{(page - 1) * 15 + i + 1}</td>
                    <td>{row.age}</td>
                    <td>
                      <span className="badge" style={{ fontSize: '0.7rem', background: row.sex === 'male' ? 'rgba(14,165,233,0.15)' : 'rgba(236,72,153,0.15)', color: row.sex === 'male' ? '#38bdf8' : '#f472b6', border: '1px solid transparent' }}>
                        {row.sex}
                      </span>
                    </td>
                    <td>{Number(row.bmi).toFixed(1)}</td>
                    <td>{row.children}</td>
                    <td>
                      <span className="badge" style={{ fontSize: '0.7rem', background: row.smoker === 'yes' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: row.smoker === 'yes' ? '#f87171' : '#34d399', border: '1px solid transparent' }}>
                        {row.smoker}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{row.region}</td>
                    <td style={{ fontWeight: 600, color: '#2dd4bf', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
                      ₹{Number(row.charges).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Showing {Math.min((page - 1) * 15 + 1, total)}–{Math.min(page * 15, total)} of {total.toLocaleString()} records
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}
                style={{ padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem' }}>
                <ChevronLeft size={14} /> Prev
              </button>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', padding: '0.4rem 0.5rem' }}>
                {page} / {totalPages}
              </span>
              <button className="btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                style={{ padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem' }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Variable description */}
        <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Dataset Variable Descriptions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {[
              { col: 'age', type: 'Numerical', desc: 'Age of the primary insured individual (18–64)' },
              { col: 'sex', type: 'Categorical', desc: 'Gender of insured: male or female' },
              { col: 'bmi', type: 'Numerical', desc: 'Body Mass Index — weight/height² measure' },
              { col: 'children', type: 'Numerical', desc: 'Number of dependents covered (0–5)' },
              { col: 'smoker', type: 'Categorical', desc: 'Whether the insured is a smoker: yes / no' },
              { col: 'region', type: 'Categorical', desc: 'US region: northeast, northwest, southeast, southwest' },
              { col: 'charges', type: 'Target (Y)', desc: 'Annual medical insurance charges billed to the insured' },
            ].map(v => (
              <div key={v.col} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '0.875rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: v.col === 'charges' ? '#fbbf24' : '#0d9488', fontWeight: 600 }}>{v.col}</span>
                  <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: 'none', padding: '0.15rem 0.5rem' }}>{v.type}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
