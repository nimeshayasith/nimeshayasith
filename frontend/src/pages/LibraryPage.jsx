import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, FileText, Monitor, FileArchive, Download,
  Eye, Calendar, Search, X, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, RotateCcw,
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionHeading from '../components/ui/SectionHeading';
import { libraryApi } from '../services/api';

// Worker served from public/ — most reliable approach in Vite
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/* ── helpers ──────────────────────────────────────────────────────────── */
const TYPE_META = {
  pdf:          { label: 'PDF',          icon: FileText,    color: '#fb923c' },
  presentation: { label: 'Presentation', icon: Monitor,     color: '#818cf8' },
  report:       { label: 'Report',       icon: BookOpen,    color: '#22d3ee' },
  other:        { label: 'Document',     icon: FileArchive, color: '#94a3b8' },
};

/* Force Cloudinary to serve the file as an attachment (proper download).
   Inserts fl_attachment into the Cloudinary upload URL. */
const getDownloadUrl = (fileUrl) => {
  if (!fileUrl) return '#';
  // Works for both /upload/ and /raw/upload/ paths
  return fileUrl.replace('/upload/', '/upload/fl_attachment/');
};

/* Detect file type from URL extension */
const getFileExt = (url = '') => url.split('?')[0].split('.').pop().toLowerCase();

const CAT_FILTERS = [
  { value: 'all',         label: 'All' },
  { value: 'university',  label: 'University' },
  { value: 'project',     label: 'Projects' },
  { value: 'research',    label: 'Research' },
  { value: 'seminar',     label: 'Seminars' },
  { value: 'competition', label: 'Competitions' },
  { value: 'other',       label: 'Other' },
];

const TYPE_FILTERS = [
  { value: 'all',          label: 'All Types' },
  { value: 'pdf',          label: 'PDFs' },
  { value: 'presentation', label: 'Presentations' },
  { value: 'report',       label: 'Reports' },
];

function DocumentCard({ item, onClick }) {
  const meta = TYPE_META[item.type] || TYPE_META.other;
  const Icon = meta.icon;
  const dateStr = item.date
    ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass glass-hover rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
      onClick={() => onClick(item)}
    >
      {/* Thumbnail / Placeholder */}
      <div
        className="relative h-44 flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ background: `${meta.color}10`, borderBottom: `1px solid ${meta.color}20` }}
      >
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Icon className="w-16 h-16 opacity-30" style={{ color: meta.color }} />
        )}
        {/* Type badge */}
        <span
          className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: `${meta.color}25`, color: meta.color, border: `1px solid ${meta.color}40` }}
        >
          {meta.label}
        </span>
        {/* Hover overlay */}
        <div className="dark-surface absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            className="p-3 rounded-xl text-white font-medium text-xs flex items-center gap-2"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={e => { e.stopPropagation(); onClick(item); }}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          {item.downloadable && (
            <a
              href={getDownloadUrl(item.fileUrl)}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-3 rounded-xl text-black font-medium text-xs flex items-center gap-2"
              style={{ background: '#cefe08' }}
            >
              <Download className="w-4 h-4" /> Download
            </a>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="t-h3 line-clamp-2">
          {item.title}
        </h3>
        {item.description && (
          <p className="t-small line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {item.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
          {dateStr && (
            <span className="flex items-center gap-1 text-slate-500 text-xs">
              <Calendar className="w-3 h-3" /> {dateStr}
            </span>
          )}
          {item.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full text-slate-400" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── PDF Viewer (react-pdf canvas renderer — no iframe needed) ─────────── */
function PdfViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNum, setPageNum]   = useState(1);
  const [scale, setScale]       = useState(1.2);
  const [error, setError]       = useState(null);
  const containerRef = useRef(null);

  // Backend proxy = same-origin fetch, no CORS issue
  const proxyUrl = `/api/library/proxy?url=${encodeURIComponent(fileUrl)}`;

  const onDocLoad  = ({ numPages }) => setNumPages(numPages);
  const onDocError = (err) => setError(err.message || 'Failed to load PDF');

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* PDF Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/60 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNum(p => Math.max(1, p - 1))}
            disabled={pageNum <= 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-300 text-xs tabular-nums">
            {numPages ? `${pageNum} / ${numPages}` : '...'}
          </span>
          <button
            onClick={() => setPageNum(p => Math.min(numPages ?? p, p + 1))}
            disabled={!numPages || pageNum >= numPages}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setScale(s => Math.max(0.6, parseFloat((s - 0.2).toFixed(1))))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-slate-500 text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(2.5, parseFloat((s + 0.2).toFixed(1))))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => { setScale(1.2); setPageNum(1); }}
            className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 overflow-auto flex justify-center items-start p-6 bg-slate-900">
        {error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <FileText className="w-12 h-12 text-slate-600" />
            <p className="t-body">Could not render PDF.</p>
            <a href={fileUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black"
              style={{ background: '#cefe08' }}>
              <Eye className="w-4 h-4" /> Open in Browser
            </a>
          </div>
        ) : (
          <Document
            file={proxyUrl}
            onLoadSuccess={onDocLoad}
            onLoadError={onDocError}
            loading={
              <div className="flex flex-col items-center justify-center gap-3 py-20">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <p className="t-small">Loading PDF...</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNum}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-2xl"
            />
          </Document>
        )}
      </div>
    </div>
  );
}

/* ── Preview Modal ──────────────────────────────────────────────────────── */
function PreviewModal({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onNext, onPrev, hasPrev, hasNext]);

  if (!item) return null;
  const meta = TYPE_META[item.type] || TYPE_META.other;
  const ext = getFileExt(item.fileUrl);
  const isPdf   = ext === 'pdf' || item.type === 'pdf' || item.type === 'report';
  const isOffice = ['ppt', 'pptx', 'doc', 'docx'].includes(ext);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Nav buttons */}
      <div className="dark-surface contents">
        {hasPrev && (
          <button
            onClick={e => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass rounded-xl text-white/70 hover:text-white z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={e => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-xl text-white/70 hover:text-white z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-5xl max-h-[92vh] glass rounded-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ border: `1px solid ${meta.color}30` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${meta.color}20` }}>
              <meta.icon className="w-4 h-4" style={{ color: meta.color }} />
            </div>
            <div>
              <h2 className="section-title">{item.title}</h2>
              <p className="t-small">{meta.label} · {item.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {item.downloadable && (
              <a
                href={getDownloadUrl(item.fileUrl)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-black"
                style={{ background: '#cefe08' }}
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg glass">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer — flex-1 so it fills remaining space */}
        <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {isPdf ? (
            <PdfViewer fileUrl={item.fileUrl} />
          ) : isOffice ? (
            /* Microsoft Office Online viewer for PPT/PPTX/DOC/DOCX */
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item.fileUrl)}`}
              title={item.title}
              className="w-full h-full"
              style={{ minHeight: '70vh', border: 'none' }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <FileText className="w-16 h-16 text-slate-600" />
              <p className="t-body">Preview not available for this file type.</p>
              <a href={item.fileUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black"
                style={{ background: '#cefe08' }}>
                <Eye className="w-4 h-4" /> Open File
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function LibraryPage() {
  const [items, setItems]               = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType]     = useState('all');
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [failed, setFailed]             = useState(false);
  const [attempt, setAttempt]           = useState(0);
  const [previewIdx, setPreviewIdx]     = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setFailed(false);
    libraryApi.getAll()
      .then(res => {
        setItems(res.items || []);
        setFiltered(res.items || []);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [attempt]);

  useEffect(() => {
    let list = items;
    if (activeCategory !== 'all') list = list.filter(i => i.category === activeCategory);
    if (activeType !== 'all')     list = list.filter(i => i.type === activeType);
    if (search.trim())            list = list.filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase()) ||
      i.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
    setFiltered(list);
  }, [activeCategory, activeType, search, items]);

  const openPreview = (item) => {
    const idx = filtered.findIndex(i => i._id === item._id);
    setPreviewIdx(idx >= 0 ? idx : null);
  };

  const filterBtnCls = (active) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      active ? 'text-white shadow-[0_0_20px_rgba(206,254,8,0.25)]' : 'glass glass-hover text-slate-400'
    }`;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <div className="page-wrap">
        <SectionHeading as="h1" label="Knowledge Base" title={<>My <span className="gradient-text">Library</span></>}
          lead={<>Presentations, research reports, and PDFs from my academic journey — view online or download freely.</>}
          animate={false}
        />
      </div>

      {/* ── Filters + Search ── */}
      <div className="page-wrap">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search documents, tags..."
              className="w-full glass rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-500 border border-white/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {CAT_FILTERS.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={filterBtnCls(activeCategory === cat.value)}
              style={activeCategory === cat.value ? { background: '#cefe08', color: '#111' } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TYPE_FILTERS.map(t => (
            <button
              key={t.value}
              onClick={() => setActiveType(t.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={activeType === t.value
                ? { background: 'rgba(129,140,248,0.2)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.4)' }
                : { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="text-center mb-8">
          <p className="t-body" style={{ fontFamily: 'Inter, sans-serif' }}>
            Showing <span className="text-white font-semibold">{filtered.length}</span> of{' '}
            <span className="text-white font-semibold">{items.length}</span> documents
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <>
            <p className="t-body text-center mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Loading from my backend… if it was asleep this can take up to a minute (free-tier cold start).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="glass animate-pulse rounded-2xl h-64" />
              ))}
            </div>
          </>
        ) : failed ? (
          <div className="text-center py-24 mb-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">The library service isn't answering right now</p>
            <p className="t-body mt-2 mb-6">
              It runs on a free-tier backend that sleeps when idle. The rest of the portfolio is unaffected.
            </p>
            <button onClick={() => setAttempt(a => a + 1)} className="btn-primary inline-flex">
              <span className="btn-icon"><RotateCcw className="w-4 h-4" /></span>
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 mb-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">No documents found</p>
            <p className="t-body mt-2">
              {search ? 'Try a different search term' : 'Check back soon — more coming!'}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
              {filtered.map((item) => (
                <DocumentCard key={item._id} item={item} onClick={openPreview} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewIdx !== null && filtered[previewIdx] && (
          <PreviewModal
            item={filtered[previewIdx]}
            onClose={() => setPreviewIdx(null)}
            onPrev={() => setPreviewIdx(i => i - 1)}
            onNext={() => setPreviewIdx(i => i + 1)}
            hasPrev={previewIdx > 0}
            hasNext={previewIdx < filtered.length - 1}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
