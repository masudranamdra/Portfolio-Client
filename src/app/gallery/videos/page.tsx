'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Search,
  FolderOpen,
  Tag,
  Clock,
  Video as VideoIcon,
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  MapPin,
  Shield,
  BadgeCheck,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Button } from '../../../components/Button';
import { GlassCard } from '../../../components/GlassCard';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

interface Video {
  _id: string;
  title: string;
  videoUrl?: string;
  url?: string;
  thumbnail?: string;
  description?: string;
  duration?: string;
  category?: string;
  tags?: string[];
  videoQuality?: string;
  sourceType?: string;
  createdAt?: string;
  uploadedAt?: string;
  location?: string;
  copyright?: string;
  verified?: boolean;
  creator?: string;
}

// Extract video ID from Google Drive URL
const getGoogleDriveVideoId = (url: string) => {
  const match = url.match(/\/d\/([^/]+)/);
  return match ? match[1] : '';
};

const getYouTubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
};

export default function VideosGalleryPage() {
  const { user, isAdmin } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Navigation & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination / Infinite Scroll
  const [displayCount, setDisplayCount] = useState(9);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchVideos();
  }, [user]);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/gallery/videos');
      if (res.data?.success && res.data?.data) {
        setVideos(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVideoUrl = (video: Video) => video.videoUrl || video.url || '';
  
  const getEmbedUrl = (url: string) =>
    url.includes('drive.google.com')
      ? `https://drive.google.com/file/d/${getGoogleDriveVideoId(url)}/preview`
      : getYouTubeEmbedUrl(url);

  // Get YouTube video ID for inline dynamic images
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
    return match ? match[1] : '';
  };

  // Get all unique categories (folders)
  const folders = ['All', ...Array.from(new Set(videos.map((vid) => vid.category || 'Uncategorized').filter(Boolean)))];

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      videos.flatMap((vid) => vid.tags || [])
    )
  ).filter(Boolean);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filtered videos list
  const filteredVideos = useMemo(() => videos.filter((vid) => {
    const matchesSearch =
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vid.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFolder =
      selectedFolder === 'All' ||
      (vid.category || 'Uncategorized') === selectedFolder;
    
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((t) => (vid.tags || []).includes(t));

    return matchesSearch && matchesFolder && matchesTags;
  }), [videos, searchQuery, selectedFolder, selectedTags]);

  // Recommended videos (same category, excluding current)
  const recommendedVideos = useMemo(() => {
    if (!selectedVideo) return [];
    return videos
      .filter((v) => v._id !== selectedVideo._id)
      .sort((a, b) => {
        // Prioritize same category
        const aMatch = a.category === selectedVideo.category ? 1 : 0;
        const bMatch = b.category === selectedVideo.category ? 1 : 0;
        return bMatch - aMatch;
      })
      .slice(0, 5);
  }, [selectedVideo, videos]);

  // Infinite Scroll Trigger
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && filteredVideos.length > displayCount) {
      setDisplayCount((prev) => prev + 9);
    }
  }, [filteredVideos.length, displayCount]);

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
                Motion Graphics & Video Gallery
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Browse client presentations, tutorials, and motion designs.
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

          {/* YouTube-Style Video Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(9)].map((_, idx) => (
                <div key={idx} className="rounded-2xl bg-white dark:bg-white/5 animate-pulse border border-slate-200/50 dark:border-white/5 overflow-hidden">
                  <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
                  <div className="p-3 sm:p-4 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start"
              >
                <AnimatePresence mode="popLayout">
                  {filteredVideos.slice(0, displayCount).map((video) => {
                    const ytId = getYouTubeId(getVideoUrl(video));
                    const thumbUrl = video.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');
                    return (
                      <motion.div
                        key={video._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedVideo(video)}
                        className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-900/20 backdrop-blur-md hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300"
                      >
                        {/* Thumbnail Container */}
                        <div className="relative aspect-video overflow-hidden bg-slate-800">
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={video.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-950 to-slate-900" />
                          )}
                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-500/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg shadow-sky-500/30 scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                            </div>
                          </div>
                          {/* Duration Badge */}
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-black/80 rounded flex items-center gap-1">
                              {video.duration}
                            </span>
                          )}
                          {/* Quality Badge */}
                          {video.videoQuality && (
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-extrabold text-white bg-sky-500 rounded shadow">
                              {video.videoQuality}
                            </span>
                          )}
                        </div>

                        {/* YouTube-style Info Bar */}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start gap-3">
                            {/* Channel Avatar */}
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs flex-shrink-0 mt-0.5">
                              {(video.creator || 'MR').substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white line-clamp-2 group-hover:text-sky-500 transition-colors leading-snug">
                                {video.title}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                  {video.creator || 'Masud Rana'}
                                </span>
                                {video.verified !== false && (
                                  <BadgeCheck className="w-3 h-3 text-sky-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 flex-wrap">
                                {video.category && (
                                  <span className="flex items-center gap-0.5">
                                    <FolderOpen className="w-2.5 h-2.5" />
                                    {video.category}
                                  </span>
                                )}
                                {video.createdAt && (
                                  <span>
                                    {new Date(video.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Scroll Sentinel */}
              <div ref={observerTarget} className="h-10 w-full" />
            </>
          ) : (
            <div className="text-center py-24 bg-white/30 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-2xl">
              <p className="text-slate-400 text-xs mb-2">No matching video items found.</p>
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

          {/* Video Player & Details Modal with Recommended Sidebar */}
          <AnimatePresence>
            {selectedVideo && (
              <div
                className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-start justify-center overflow-y-auto"
                onClick={() => setSelectedVideo(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-7xl mx-auto py-4 sm:py-8 px-4"
                >
                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Main Player + Details */}
                    <div className="flex-1 min-w-0">
                      {/* Player area */}
                      <div className="relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                        <iframe
                          src={getEmbedUrl(getVideoUrl(selectedVideo))}
                          width="100%"
                          height="100%"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                        <button
                          onClick={() => setSelectedVideo(null)}
                          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white z-10 transition-colors"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* Details Panel */}
                      <div className="mt-4 sm:mt-6 bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          <span>Video Archives</span>
                          <ChevronRight className="w-3 h-3" />
                          <span className="text-sky-500">{selectedVideo.category || 'Uncategorized'}</span>
                        </div>

                        <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
                          {selectedVideo.title}
                        </h2>

                        {/* Creator Row */}
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-white/5">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {(selectedVideo.creator || 'MR').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                                {selectedVideo.creator || 'Masud Rana'}
                              </span>
                              {selectedVideo.verified !== false && (
                                <BadgeCheck className="w-3.5 h-3.5 text-sky-500" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">Content Creator</span>
                          </div>
                        </div>

                        {selectedVideo.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
                            {selectedVideo.description}
                          </p>
                        )}

                        {/* Technical Spec Row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {selectedVideo.duration || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            <VideoIcon className="w-3.5 h-3.5 text-slate-400" />
                            {selectedVideo.videoQuality || 'HD'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                            {selectedVideo.sourceType || 'Streaming'}
                          </div>
                          {selectedVideo.location && (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {selectedVideo.location}
                            </div>
                          )}
                          {selectedVideo.copyright && (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              <Shield className="w-3.5 h-3.5 text-slate-400" />
                              {selectedVideo.copyright}
                            </div>
                          )}
                          {selectedVideo.createdAt && (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(selectedVideo.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                          )}
                        </div>

                        {/* Video tags */}
                        {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 flex flex-wrap gap-1">
                            {selectedVideo.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommended Videos Sidebar */}
                    {recommendedVideos.length > 0 && (
                      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                          Recommended
                        </h3>
                        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                          {recommendedVideos.map((vid) => {
                            const rYtId = getYouTubeId(getVideoUrl(vid));
                            const rThumb = vid.thumbnail || (rYtId ? `https://img.youtube.com/vi/${rYtId}/hqdefault.jpg` : '');
                            return (
                              <button
                                key={vid._id}
                                onClick={() => setSelectedVideo(vid)}
                                className="flex flex-col lg:flex-row gap-2 lg:gap-3 min-w-[200px] lg:min-w-0 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sky-500/20 rounded-xl overflow-hidden transition-all text-left group"
                              >
                                <div className="relative w-full lg:w-40 aspect-video lg:aspect-auto lg:h-24 overflow-hidden flex-shrink-0">
                                  {rThumb ? (
                                    <img src={rThumb} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                  ) : (
                                    <div className="w-full h-full bg-slate-800" />
                                  )}
                                  {vid.duration && (
                                    <span className="absolute bottom-1 right-1 px-1 py-0.5 text-[9px] font-bold text-white bg-black/80 rounded">
                                      {vid.duration}
                                    </span>
                                  )}
                                </div>
                                <div className="p-2 lg:py-2 lg:pr-2 lg:pl-0 flex-1 min-w-0">
                                  <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                                    {vid.title}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    {vid.creator || 'Masud Rana'}
                                  </p>
                                  {vid.category && (
                                    <p className="text-[9px] text-slate-500 mt-0.5">{vid.category}</p>
                                  )}
                                </div>
                              </button>
                            );
                          })}
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
