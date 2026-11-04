import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useEffect } from 'react';
import BootLoader from './components/ui/BootLoader';
import CloudShell from './components/shell/CloudShell';
import ChaosMonkey from './components/chaos/ChaosMonkey';
import Effects from './components/ui/Effects';
import Lamp from './components/ui/Lamp';
import { warmBackend } from './services/api';

// Pages are code-split so the first paint only ships what it needs.
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const CertificationsPage = lazy(() => import('./pages/CertificationsPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const BusinessPage = lazy(() => import('./pages/BusinessPage'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));

/* Route-level loading state: same pipeline motif as the boot screen. */
const Spinner = () => (
  <div className="flex flex-col items-center justify-center h-screen gap-4" style={{ background: 'var(--bg-page)' }}>
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '3px solid var(--accent-glow)',
        borderTopColor: 'var(--accent)',
        animation: 'nySpin 0.8s linear infinite',
      }}
    />
    <p style={{ fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 12, color: 'var(--text-muted)' }}>
      <span style={{ color: 'var(--accent-ink)' }}>$</span> npm run build &amp;&amp; deploy…
    </p>
  </div>
);

export default function App() {
  // Wake the (free-tier) backend while the visitor reads the hero, so live
  // sections like Medium articles and the library are ready by the time they scroll.
  useEffect(() => {
    warmBackend();
  }, []);

  return (
    <BrowserRouter>
      <BootLoader />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e2e',
            color: '#e2e8f0',
            border: '1px solid rgba(206,254,8,0.3)',
          },
        }}
      />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/resume" element={<ResumePage />} />
          {/* Unknown URLs land on the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <CloudShell />
      <ChaosMonkey />
      <Effects />
      <Lamp />
    </BrowserRouter>
  );
}
