import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeartbeatLoader from './components/HeartbeatLoader';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Dataset from './pages/Dataset';
import Analytics from './pages/Analytics';
import Regression from './pages/Regression';
import ModelComparison from './pages/ModelComparison';
import History from './pages/History';
import Documentation from './pages/Documentation';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';

const routeMessages = {
  '/': {
    title: 'Loading Medical Analytics Platform',
    sub: 'Preparing statistical engine & dashboard metrics',
  },
  '/predict': {
    title: 'Initializing Cost Prediction Engine',
    sub: 'Loading Random Forest & Gradient Boosted regression models',
  },
  '/dataset': {
    title: 'Fetching Insurance Registry Data',
    sub: 'Loading 1,338 records with demographic & biomarker attributes',
  },
  '/analytics': {
    title: 'Generating Statistical Analytics',
    sub: 'Calculating distributions, correlations & risk segmentations',
  },
  '/regression': {
    title: 'Fitting Regression Models',
    sub: 'Evaluating OLS coefficients, hypothesis p-values & assumptions',
  },
  '/comparison': {
    title: 'Benchmarking ML Algorithms',
    sub: 'Comparing R², RMSE, MAE and residual distributions',
  },
  '/history': {
    title: 'Accessing Prediction Records',
    sub: 'Retrieving historical estimates and audit logs',
  },
  '/documentation': {
    title: 'Loading Project Documentation',
    sub: 'Rendering academic methodology, viva prep & statistical formulas',
  },
  '/contact': {
    title: 'Connecting to Research Team',
    sub: 'Initializing secure messaging channel & academic inquiry registry',
  },
  '/privacy': {
    title: 'Loading Privacy & Data Governance',
    sub: 'Rendering compliance policies & academic integrity guidelines',
  },
};

function RouteChangeTracker() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show heartbeat animation on every route change for 4 seconds
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4-second medical heartbeat loading animation

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  const currentRouteMeta = routeMessages[location.pathname] || {
    title: 'Synchronizing Medical Intelligence...',
    sub: 'Processing statistical metrics & vitals',
  };

  return (
    <HeartbeatLoader 
      fullScreen={true}
      message={currentRouteMeta.title}
      subMessage={currentRouteMeta.sub}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteChangeTracker />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#0d9488', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/regression" element={<Regression />} />
            <Route path="/comparison" element={<ModelComparison />} />
            <Route path="/history" element={<History />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
