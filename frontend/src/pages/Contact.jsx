import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Mail,
  Send,
  User,
  AtSign,
  MessageSquare,
  Sparkles,
  Building,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Activity,
  Shield,
  HelpCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

const QUICK_TOPICS = [
  { label: '🎓 Viva Defense Preparation', category: 'Viva Defense', subject: 'Questions regarding viva defense & model assumptions' },
  { label: '📊 Regression P-Values & VIF', category: 'Methodology', subject: 'Statistical significance & multicollinearity question' },
  { label: '🔬 Dataset Citation & Rights', category: 'Dataset', subject: 'Inquiry regarding medical insurance dataset citation' },
  { label: '⚙️ Python / Scikit-learn API', category: 'Technical', subject: 'Technical question regarding model serving & pipeline' },
];

const ROLES = [
  'Student / Scholar',
  'Data Scientist / ML Engineer',
  'Actuary / Risk Underwriter',
  'Faculty / Evaluator',
  'Healthcare Professional',
  'Other'
];

const CATEGORIES = [
  { id: 'Methodology', label: 'Model Methodology & Math' },
  { id: 'Viva Defense', label: 'Viva Defense & Exam Prep' },
  { id: 'Dataset', label: 'Dataset & Exploratory Analysis' },
  { id: 'Technical', label: 'API, Python & Code Implementation' },
  { id: 'Collaboration', label: 'Academic Research Collaboration' },
  { id: 'Feedback', label: 'Feedback & Bug Report' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student / Scholar',
    category: 'Methodology',
    priority: 'Normal',
    subject: '',
    message: '',
  });

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('research@medipredict-stats.org');
    setCopied(true);
    toast.success('Academic email copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleQuickTopic = (topic) => {
    setFormData(prev => ({
      ...prev,
      category: topic.category,
      subject: topic.subject,
    }));
    toast('Topic pre-filled in contact form', { icon: '✨' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please provide your name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!formData.subject.trim()) {
      toast.error('Please enter an inquiry subject');
      return;
    }
    if (formData.message.trim().length < 15) {
      toast.error('Message should be at least 15 characters long');
      return;
    }

    setSubmitting(true);

    // Simulate async submission with authentic ticket creation
    setTimeout(() => {
      setSubmitting(false);
      const ticketId = `MED-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket({
        id: ticketId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...formData
      });
      toast.success(`Message transmitted successfully! Ticket #${ticketId}`);
    }, 1200);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData({
      name: '',
      email: '',
      role: 'Student / Scholar',
      category: 'Methodology',
      priority: 'Normal',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="animated-bg" style={{ minHeight: '100vh', padding: 'clamp(2.5rem, 5vw, 4.5rem) 1.5rem 6rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-teal" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
              <Sparkles size={14} /> ACADEMIC & RESEARCH INQUIRIES
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Connect with the <span className="gradient-text">Research Team</span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '750px', margin: '0 auto', lineHeight: 1.7 }}>
            Have questions regarding our regression coefficients, machine learning metrics, viva defense questions, or actuarial statistics? 
            Reach out directly to the project authors and researchers.
          </p>

          {/* Quick Pre-fill topics */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.75rem' }}>
              Quick Selection: Frequently Discussed Topics
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
              {QUICK_TOPICS.map((topic, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => handleQuickTopic(topic)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '100px',
                    padding: '0.45rem 1rem',
                    color: '#cbd5e1',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(13, 148, 136, 0.5)';
                    e.currentTarget.style.background = 'rgba(13, 148, 136, 0.1)';
                    e.currentTarget.style.color = '#2dd4bf';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  {topic.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main 2-Column Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Interactive Form or Success Card */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {submittedTicket ? (
                /* Success Confirmation State */
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card"
                  style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)'
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #0d9488)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
                    }}
                  >
                    <CheckCircle2 size={38} color="#ffffff" />
                  </motion.div>

                  <span className="badge badge-teal" style={{ marginBottom: '1rem', padding: '0.35rem 0.9rem' }}>
                    TICKET REGISTERED: {submittedTicket.id}
                  </span>

                  <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem', color: '#f8fafc' }}>
                    Inquiry Dispatched Successfully!
                  </h2>

                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 1.75rem' }}>
                    Thank you, <strong>{submittedTicket.name}</strong>. Your query concerning <em>"{submittedTicket.subject}"</em> has been logged in our research registry. Our team will review your statistical question and reply to <code style={{ color: '#38bdf8' }}>{submittedTicket.email}</code>.
                  </p>

                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    textAlign: 'left',
                    marginBottom: '2rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Category:</span>
                      <strong style={{ color: '#2dd4bf' }}>{submittedTicket.category}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Inquirer Role:</span>
                      <span style={{ color: '#f8fafc' }}>{submittedTicket.role}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Priority:</span>
                      <span style={{ color: submittedTicket.priority === 'Urgent (Viva / Exam)' ? '#f87171' : '#34d399' }}>
                        {submittedTicket.priority}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Estimated Reply:</span>
                      <span style={{ color: '#fbbf24' }}>Within 12 - 24 hours</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleReset}
                      className="btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <RefreshCw size={16} /> Send Another Message
                    </button>
                    <NavLink
                      to="/documentation"
                      className="btn-primary"
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <FileText size={16} /> Explore Documentation
                    </NavLink>
                  </div>
                </motion.div>
              ) : (
                /* Primary Contact Form */
                <form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  className="glass-card"
                  style={{
                    padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                    border: '1px solid rgba(13, 148, 136, 0.3)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                    <div>
                      <div className="section-label">Direct Communication</div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Send an Academic Inquiry</h2>
                    </div>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'rgba(13, 148, 136, 0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#2dd4bf', border: '1px solid rgba(13, 148, 136, 0.3)'
                    }}>
                      <Mail size={20} />
                    </div>
                  </div>

                  {/* Name and Email Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                        Your Full Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Dr. Jane Smith / Rahul Sharma"
                          className="input-field"
                          style={{ paddingLeft: '2.5rem' }}
                        />
                        <User size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                        Email Address <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="scholar@university.edu"
                          className="input-field"
                          style={{ paddingLeft: '2.5rem' }}
                        />
                        <AtSign size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Role & Category */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                        Your Academic / Industry Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="input-field select-field"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r} style={{ background: '#0f172a', color: '#f8fafc' }}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                        Inquiry Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field select-field"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Priority selector */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                      Inquiry Urgency
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                      {[
                        { label: 'Normal', desc: 'Standard (24-48h)' },
                        { label: 'High Priority', desc: 'Active Study' },
                        { label: 'Urgent (Viva / Exam)', desc: 'Viva < 24 Hours' },
                      ].map((p) => {
                        const isSelected = formData.priority === p.label;
                        return (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority: p.label })}
                            className={`option-button ${isSelected ? 'selected' : ''}`}
                            style={{
                              padding: '0.5rem 0.75rem',
                              textAlign: 'center',
                              borderColor: isSelected && p.label.includes('Urgent') ? 'rgba(239, 68, 68, 0.7)' : undefined,
                              background: isSelected && p.label.includes('Urgent') ? 'rgba(239, 68, 68, 0.15)' : undefined,
                              color: isSelected && p.label.includes('Urgent') ? '#f87171' : undefined,
                            }}
                          >
                            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{p.label}</div>
                            <div style={{ fontSize: '0.68rem', opacity: 0.75 }}>{p.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subject */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                      Subject / Topic <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Question on Heteroscedasticity Breusch-Pagan Test"
                      className="input-field"
                    />
                  </div>

                  {/* Message Body */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>
                        Detailed Message <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <span style={{ fontSize: '0.72rem', color: formData.message.length > 800 ? '#ef4444' : '#64748b' }}>
                        {formData.message.length} / 1000 chars
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      maxLength={1000}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify your query in detail, including relevant statistical concepts, code questions, or dataset observations..."
                      className="input-field"
                      style={{ resize: 'vertical', minHeight: '120px' }}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem',
                      fontSize: '0.95rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.75 : 1
                    }}
                  >
                    {submitting ? (
                      <>
                        <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                        <span>Transmitting Securely...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Academic Inquiry</span>
                      </>
                    )}
                  </motion.button>

                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Shield size={12} color="#0d9488" /> Protected by SSL & zero-telemetry academic privacy policy
                    </span>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Laboratory Info, Live Telemetry & Quick Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
          >
            
            {/* Direct Email Card */}
            <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid rgba(13, 148, 136, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #0d9488, #0ea5e9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white'
                }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Primary Direct Mail
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    Research Lab Inbox
                  </h3>
                </div>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                For formal thesis citations, external model evaluation, or collaborative grant inquiries:
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem', color: '#2dd4bf' }}>
                  research@medipredict-stats.org
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  style={{
                    background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid ' + (copied ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.12)'),
                    borderRadius: '6px',
                    padding: '0.4rem 0.65rem',
                    color: copied ? '#34d399' : '#cbd5e1',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Live Model Server Status */}
            <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#34d399'
                  }}>
                    <Activity size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Inference Node Health</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Stateless REST Microservice</div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.65rem',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 100,
                  fontSize: '0.72rem',
                  color: '#34d399',
                  fontWeight: 600,
                }}>
                  <span className="live-dot" />
                  <span>ONLINE</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: 8 }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>API Availability</div>
                  <div style={{ color: '#2dd4bf', fontWeight: 700, marginTop: '0.2rem' }}>99.98% Uptime</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: 8 }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Inference Latency</div>
                  <div style={{ color: '#38bdf8', fontWeight: 700, marginTop: '0.2rem' }}>~12ms Average</div>
                </div>
              </div>
            </div>

            {/* Department & Office Info */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                <Building size={18} color="#0d9488" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                  Academic Laboratory Details
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.825rem', color: '#94a3b8' }}>
                <div>
                  <div style={{ color: '#cbd5e1', fontWeight: 600 }}>Department:</div>
                  <div>Centre for Statistical Modeling & Artificial Intelligence in Healthcare</div>
                </div>
                <div>
                  <div style={{ color: '#cbd5e1', fontWeight: 600 }}>Project Focus:</div>
                  <div>Health Economics, Actuarial Regression & Non-linear Ensembles</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Clock size={15} color="#fbbf24" />
                  <span>Viva Review & Consultation: Mon – Fri (10:00 – 17:30 IST)</span>
                </div>
              </div>
            </div>

            {/* Project Quick References */}
            <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.6)' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.85rem' }}>
                Quick Documentation Links
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <NavLink
                  to="/documentation#viva"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#cbd5e1',
                    fontSize: '0.825rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#2dd4bf'; e.currentTarget.style.background = 'rgba(13,148,136,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <span>Top 20 Viva Examination Questions</span>
                  <ArrowRight size={14} />
                </NavLink>

                <NavLink
                  to="/regression"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#cbd5e1',
                    fontSize: '0.825rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#2dd4bf'; e.currentTarget.style.background = 'rgba(13,148,136,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <span>Regression Statistical Summary & OLS</span>
                  <ArrowRight size={14} />
                </NavLink>

                <NavLink
                  to="/privacy"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#cbd5e1',
                    fontSize: '0.825rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#2dd4bf'; e.currentTarget.style.background = 'rgba(13,148,136,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <span>Data Governance & Privacy Policy</span>
                  <ArrowRight size={14} />
                </NavLink>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}
