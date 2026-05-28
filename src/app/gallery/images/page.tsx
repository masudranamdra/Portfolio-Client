'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FolderOpen,
  Tag,
  Camera,
  Maximize2,
  Calendar,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Button } from '../../../components/Button';
import { GlassCard } from '../../../components/GlassCard';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

interface Image {
  _id: string;
  title: string;
  imageUrl?: string;
  url?: string;
  description?: string;
  category?: string;
  tags?: string[];
  cameraInfo?: string;
  resolution?: string;
  customLabels?: string;
  createdAt?: string;
  uploadedAt?: string;
}

export default function ImagesGalleryPage() {
  const { user, isAdmin } = useAuth();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  
  // Navigation & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination / Infinite Scroll
  const [displayCount, setDisplayCount] = useState(12);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchImages();
  }, [user]);

  const fetchImages = async () => {
    try {
      const res = await api.get('/gallery/images');
      if (res.data?.success && res.data?.data) {
        setImages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: Image) => image.imageUrl || image.url || '';

  // Get all unique categories (folders)
  const folders = ['All', ...Array.from(new Set(images.map((img) => img.category || 'Uncategorized').filter(Boolean)))];

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      images.flatMap((img) => img.tags || [])
    )
  ).filter(Boolean);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filtered images list
  const filteredImages = useMemo(() => images.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFolder =
      selectedFolder === 'All' ||
      (img.category || 'Uncategorized') === selectedFolder;
    
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((t) => (img.tags || []).includes(t));

    return matchesSearch && matchesFolder && matchesTags;
  }), [images, searchQuery, selectedFolder, selectedTags]);

  // Modal navigation
  const currentIndex = useMemo(() => {
    if (!selectedImage) return -1;
    return filteredImages.findIndex((img) => img._id === selectedImage._id);
  }, [selectedImage, filteredImages]);

  const goToNext = useCallback(() => {
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  }, [currentIndex, filteredImages]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  }, [currentIndex, filteredImages]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (!selectedImage) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedImage, goToNext, goToPrev]);

  // Infinite Scroll Trigger
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && filteredImages.length > displayCount) {
      setDisplayCount((prev) => prev + 12);
    }
  }, [filteredImages.length, displayCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-slate-50 dark:bg-gray-950">
          <div className="max-w-md w-full mx-4 text-center p-8 rounded-2xl glass-card border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-gray-950/20 backdrop-blur-md">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Gallery Secured</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              You must log in to your account to view this media archive.
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Photography & Image Gallery
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Explore architectural drafts, visual artwork, and travel collections.
              </p>
            </div>
            {isAdmin && (
              <Link href="/admin">
                <Button className="gap-2 text-xs sm:text-sm">
                  <SlidersHorizontal className="w-4 h-4" />
                  Manage In Console
                </Button>
              </Link>
            )}
          </div>

          {/* Filtering Layout */}
          <GlassCard className="p-3 sm:p-4 mb-8 border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-slate-900/40">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, details..."
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

          {/* Masonry-style Grid Layout */}
          {loading ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="break-inside-avoid rounded-2xl bg-white dark:bg-white/5 animate-pulse border border-slate-200/50 dark:border-white/5"
                  style={{ height: `${180 + Math.random() * 120}px` }}
                />
              ))}
            </div>
          ) : filteredImages.length > 0 ? (
            <>
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
                {filteredImages.slice(0, displayCount).map((image, idx) => (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.4), duration: 0.4 }}
                    onClick={() => setSelectedImage(image)}
                    className="break-inside-avoid group cursor-pointer rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-900/20 backdrop-blur-md hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageUrl(image)}
                        alt={image.title}
                        loading="lazy"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Hover Metadata Overlay — hidden by default */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                        {/* Category badge */}
                        {image.category && (
                          <span className="self-start px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-sky-400 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg mb-2">
                            {image.category}
                          </span>
                        )}

                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 mb-1">
                          {image.title}
                        </h3>

                        {image.description && (
                          <p className="text-[10px] text-white/70 line-clamp-2 mb-2">
                            {image.description}
                          </p>
                        )}

                        {/* Inline specs row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {image.cameraInfo && (
                            <span className="flex items-center gap-1 text-[9px] text-white/60">
                              <Camera className="w-2.5 h-2.5" />
                              {image.cameraInfo}
                            </span>
                          )}
                          {image.resolution && (
                            <span className="flex items-center gap-1 text-[9px] text-white/60">
                              <Maximize2 className="w-2.5 h-2.5" />
                              {image.resolution}
                            </span>
                          )}
                          {(image.createdAt || image.uploadedAt) && (
                            <span className="flex items-center gap-1 text-[9px] text-white/60">
                              <Calendar className="w-2.5 h-2.5" />
                              {new Date(image.createdAt || image.uploadedAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        {image.tags && image.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {image.tags.slice(0, 3).map((t) => (
                              <span key={t} className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-white/10 text-white/70 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Zoom icon on hover */}
                      <div className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title-only bar — always visible */}
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-slate-200/50 dark:border-white/5">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-sky-500 transition-colors">
                        {image.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Scroll Sentinel */}
              <div ref={observerTarget} className="h-10 w-full" />
            </>
          ) : (
            <div className="text-center py-24 bg-white/30 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-2xl">
              <p className="text-slate-400 text-xs mb-2">No matching gallery items found.</p>
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

          {/* Full Image Preview Modal with Navigation */}
          <AnimatePresence>
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center"
                onClick={() => setSelectedImage(null)}
              >
                <motion.div
                  key={selectedImage._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] mx-4"
                >
                  {/* Photo area with navigation arrows */}
                  <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[250px] sm:min-h-[300px]">
                    <img
                      src={getImageUrl(selectedImage)}
                      alt={selectedImage.title}
                      className="w-full h-full max-h-[80vh] object-contain"
                    />

                    {/* Close button */}
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Previous button */}
                    {currentIndex > 0 && (
                      <button
                        onClick={goToPrev}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-sky-500 text-white transition-all shadow-lg"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}

                    {/* Next button */}
                    {currentIndex < filteredImages.length - 1 && (
                      <button
                        onClick={goToNext}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-sky-500 text-white transition-all shadow-lg"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}

                    {/* Counter badge */}
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-[10px] font-bold text-white/80 tracking-wider">
                      {currentIndex + 1} / {filteredImages.length}
                    </span>
                  </div>

                  {/* Metadata area */}
                  <div className="md:w-2/5 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/5">
                    <div>
                      {/* Breadcrumbs */}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        <span>Gallery</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-sky-500">{selectedImage.category || 'Uncategorized'}</span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {selectedImage.title}
                      </h2>

                      {selectedImage.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                          {selectedImage.description}
                        </p>
                      )}

                      {/* Metadata grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-200 dark:border-white/5 mb-6">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Upload Date</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {selectedImage.createdAt || selectedImage.uploadedAt
                              ? new Date(selectedImage.createdAt || selectedImage.uploadedAt || '').toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'Unknown'}
                          </span>
                        </div>
                        {selectedImage.resolution && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Resolution</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                              {selectedImage.resolution}
                            </span>
                          </div>
                        )}
                        {selectedImage.cameraInfo && (
                          <div className="col-span-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Camera Device</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-slate-400" />
                              {selectedImage.cameraInfo}
                            </span>
                          </div>
                        )}
                        {selectedImage.customLabels && (
                          <div className="col-span-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Specifications</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg block mt-1">
                              {selectedImage.customLabels}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags index */}
                    {selectedImage.tags && selectedImage.tags.length > 0 && (
                      <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Indexed Tags</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedImage.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
