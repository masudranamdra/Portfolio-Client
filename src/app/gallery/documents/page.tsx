'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Search,
  FolderOpen,
  Tag,
  Calendar,
  User as UserIcon,
  Download,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  X,
  FileCode,
  FileSpreadsheet,
  MonitorPlay,
  FileCheck
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Button } from '../../../components/Button';
import { GlassCard } from '../../../components/GlassCard';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

interface DocumentItem {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
  uploadedAt?: string;
  author?: string;
  documentType?: 'PDF' | 'Word' | 'GoogleDoc' | 'Presentation' | 'Resource';
  fileSize?: string;
  previewImage?: string;
  googleDocsLink?: string;
  url?: string;
}

export default function DocumentGalleryPage() {
  const { user, isAdmin } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  // Navigation & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination / Infinite Scroll
  const [displayCount, setDisplayCount] = useState(6);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      if (res.data?.success && res.data?.data) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDocUrl = (doc: DocumentItem) => doc.url || doc.googleDocsLink || '';

  // Get all unique categories (folders)
  const folders = [
    'All',
    'Documents',
    'Research',
    'Tutorials',
    'Client Docs',
    'Certificates',
    'Reports'
  ];

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      documents.flatMap((doc) => doc.tags || [])
    )
  ).filter(Boolean);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filtered documents list
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.author || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder =
      selectedFolder === 'All' ||
      (doc.category || 'Documents') === selectedFolder;

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((t) => (doc.tags || []).includes(t));

    return matchesSearch && matchesFolder && matchesTags;
  });

  // Infinite Scroll Trigger
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && filteredDocs.length > displayCount) {
        setDisplayCount((prev) => prev + 6);
      }
    },
    [filteredDocs.length, displayCount]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  const getDocTypeIcon = (type?: string) => {
    switch (type) {
      case 'PDF':
        return <FileCheck className="w-5 h-5 text-red-500" />;
      case 'Word':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'GoogleDoc':
        return <FileCode className="w-5 h-5 text-yellow-500" />;
      case 'Presentation':
        return <MonitorPlay className="w-5 h-5 text-orange-500" />;
      case 'Resource':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const getEmbedUrl = (doc: DocumentItem) => {
    const link = getDocUrl(doc);
    if (doc.documentType === 'GoogleDoc' || link.includes('docs.google.com')) {
      // Modify URL to preview mode
      if (link.includes('/edit')) {
        return link.replace(/\/edit.*$/, '/preview');
      }
      return link;
    }
    return link;
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-slate-50 dark:bg-gray-950">
          <div className="max-w-md w-full mx-4 text-center p-8 rounded-2xl glass-card border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-gray-950/20 backdrop-blur-md">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Gallery Secured</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              You must log in to your account to view this documents archive.
            </p>
            <Link href="/login">
              <Button variant="primary" fullWidth>Go to Login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 relative overflow-hidden bg-slate-50/50 dark:bg-gray-950">
        <div className="glow-spot bg-blue-500/10 dark:bg-blue-600/10 top-0 left-1/4" />
        <div className="glow-spot bg-emerald-500/10 dark:bg-emerald-600/10 bottom-0 right-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Document & Resource Archive
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Access client assets, study research papers, tutorials, and reports.
              </p>
            </div>
            {isAdmin && (
              <Link href="/admin">
                <Button className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Manage In Console
                </Button>
              </Link>
            )}
          </div>

          {/* Filtering Layout */}
          <GlassCard className="p-4 mb-8 border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-slate-900/40">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, description, or author..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
              </div>

              {/* Advanced Filter Toggles */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                    showFilters
                      ? 'bg-sky-500/10 border-sky-500/30 text-sky-500'
                      : 'bg-white dark:bg-white/5 border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filter Options
                </button>
              </div>
            </div>

            {/* Filter Drawer */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 pt-4 border-t border-slate-200 dark:border-white/5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Folders/Categories selection */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5" />
                        Directory Folders
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {folders.map((folder) => (
                          <button
                            key={folder}
                            onClick={() => setSelectedFolder(folder)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              selectedFolder === folder
                                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {folder}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tags selection */}
                    {allTags.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          Tag Index
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {allTags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                  isSelected
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                    : 'bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* Grid Layout */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-2xl bg-white dark:bg-white/5 animate-pulse border border-slate-200/50 dark:border-white/5" />
              ))}
            </div>
          ) : filteredDocs.length > 0 ? (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
              >
                <AnimatePresence mode="popLayout">
                  {filteredDocs.slice(0, displayCount).map((doc) => (
                    <motion.div
                      key={doc._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSelectedDoc(doc)}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-900/20 backdrop-blur-md hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-800 flex items-center justify-center">
                        {doc.previewImage ? (
                          <img
                            src={doc.previewImage}
                            alt={doc.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
                            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-white/50 group-hover:scale-110 transition-transform">
                              {getDocTypeIcon(doc.documentType)}
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                        </div>
                        {doc.category && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-sky-500 bg-white/95 dark:bg-slate-950/80 rounded-lg shadow-sm">
                            {doc.category}
                          </span>
                        )}
                        {doc.documentType && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white bg-slate-900/80 backdrop-blur border border-white/10 rounded-lg">
                            {doc.documentType}
                          </span>
                        )}
                      </div>
                      <div className="p-4 border-t border-slate-200/50 dark:border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Size: {doc.fileSize || 'N/A'}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            By {doc.author || 'Masud Rana'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-sky-500 transition-colors">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Scroll Sentinel */}
              <div ref={observerTarget} className="h-10 w-full" />
            </>
          ) : (
            <div className="text-center py-24 bg-white/30 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-2xl">
              <p className="text-slate-400 text-xs mb-2">No matching document items found.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFolder('All');
                  setSelectedTags([]);
                }}
                className="text-xs text-sky-500 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Details & PDF/Google Docs Embed modal */}
          <AnimatePresence>
            {selectedDoc && (
              <div
                className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedDoc(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                >
                  {/* File preview iframe area */}
                  <div className="md:w-3/5 bg-slate-950 flex flex-col items-center justify-center relative min-h-[350px]">
                    {getDocUrl(selectedDoc) ? (
                      <iframe
                        src={getEmbedUrl(selectedDoc)}
                        width="100%"
                        height="100%"
                        className="absolute inset-0 w-full h-full border-none min-h-[350px]"
                        allow="autoplay"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                        <FileText className="w-12 h-12 text-slate-600 animate-pulse" />
                        <span className="text-xs">No direct file embed URL specified.</span>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Metadata area */}
                  <div className="md:w-2/5 p-6 overflow-y-auto flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/5">
                    <div>
                      {/* Breadcrumbs */}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        <span>Documents</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-sky-500">{selectedDoc.category || 'Documents'}</span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {selectedDoc.title}
                      </h2>

                      {selectedDoc.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                          {selectedDoc.description}
                        </p>
                      )}

                      {/* Metadata grid */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-white/5 mb-6">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Author</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                            {selectedDoc.author || 'Masud Rana'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">File Size</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                            {selectedDoc.fileSize || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Created Date</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {selectedDoc.createdAt || selectedDoc.uploadedAt
                              ? new Date(selectedDoc.createdAt || selectedDoc.uploadedAt || '').toLocaleDateString('en-US')
                              : 'Recent'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Doc Type</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold capitalize">
                            {selectedDoc.documentType || 'PDF'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions panel */}
                    <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-200 dark:border-white/5">
                      {getDocUrl(selectedDoc) && (
                        <a
                          href={getDocUrl(selectedDoc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button className="w-full gap-2 text-xs py-2.5 font-bold" variant="primary">
                            <ExternalLink className="w-4 h-4" />
                            Open In New Tab
                          </Button>
                        </a>
                      )}
                      {getDocUrl(selectedDoc) && (
                        <a
                          href={getDocUrl(selectedDoc)}
                          download
                          className="w-full"
                        >
                          <Button className="w-full gap-2 text-xs py-2.5 font-bold" variant="secondary">
                            <Download className="w-4 h-4" />
                            Download Document
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
