'use client';

import React, { useEffect, useState, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit2,
  X,
  BarChart3,
  FileText,
  FolderOpen,
  Zap,
  Users,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Image as ImageIcon,
  Video,
  FileText as FileTextIcon,
  Newspaper,
  Calendar,
  Layers,
  Heart,
  Search,
  Settings,
  ChevronLeft,
  Menu,
  TrendingUp,
  Mail,
  Camera,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/Button';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface TabItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface ContentItem {
  _id: string;
  title?: string;
  name?: string;
  clientName?: string;
  email?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  image?: string;
  videoUrl?: string;
  category?: string;
  tags?: string[] | string;
  createdAt?: string;
  date?: string;
  rating?: number;
  reviewText?: string;
  clientImage?: string;
  percentage?: number;
  icon?: string;
  readingTime?: string;
  featuredImage?: string;
  externalLink?: string;
  thumbnail?: string;
  readTime?: string;
  githubLink?: string;
  liveLink?: string;
  role?: string;
  
  // Messages schema parameters
  phone?: string;
  subject?: string;
  message?: string;
  read?: boolean;
  
  // Settings Config schema parameters
  resumeUrl?: string;
  avatarUrl?: string;
  heroTitle?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;

  // New Image/Video Specs
  cameraInfo?: string;
  resolution?: string;
  customLabels?: string;
  duration?: string;
  videoQuality?: string;
  sourceType?: string;

  // Document specs
  documentType?: string;
  fileSize?: string;
  author?: string;
  googleDocsLink?: string;
  previewImage?: string;
}

export default function AdminPage() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const isAdmin = authContext?.isAdmin;
  const authLoading = authContext?.loading;
  const logout = authContext?.logout;
  
  const [activeTab, setActiveTab] = useState('projects');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Sidebar collapsible state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Analytics states
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    images: 0,
    videos: 0,
    documents: 0,
    messages: 0,
  });

  // Messages states
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContentItem | null>(null);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      const [projRes, blogRes, imgRes, vidRes, docRes, msgRes] = await Promise.all([
        api.get('/projects').catch(() => ({ data: { count: 0 } })),
        api.get('/blogs').catch(() => ({ data: { count: 0 } })),
        api.get('/gallery/images').catch(() => ({ data: { count: 0 } })),
        api.get('/gallery/videos').catch(() => ({ data: { count: 0 } })),
        api.get('/documents').catch(() => ({ data: { count: 0 } })),
        api.get('/messages').catch(() => ({ data: { count: 0 } })),
      ]);

      setStats({
        projects: projRes.data?.count || projRes.data?.data?.length || 0,
        blogs: blogRes.data?.count || blogRes.data?.data?.length || 0,
        images: imgRes.data?.count || imgRes.data?.data?.length || 0,
        videos: vidRes.data?.count || vidRes.data?.data?.length || 0,
        documents: docRes.data?.count || docRes.data?.data?.length || 0,
        messages: msgRes.data?.count || msgRes.data?.data?.length || 0,
      });
    } catch (err) {
      console.warn('Failed to load stats:', err);
    }
  }, []);

  const handleToggleRead = async (msg: ContentItem) => {
    try {
      const newRead = !msg.read;
      const res = await api.put(`/messages/${msg._id}`, { read: newRead });
      if (res.data?.success) {
        setItems(items.map((item) => (item._id === msg._id ? res.data.data : item)));
        if (selectedMessage && selectedMessage._id === msg._id) {
          setSelectedMessage(res.data.data);
        }
        toast.success(`Message marked as ${newRead ? 'read' : 'unread'}`);
        fetchStats();
      }
    } catch (err) {
      toast.error('Failed to toggle read status');
    }
  };

  const handleViewMessage = async (msg: ContentItem) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        const res = await api.put(`/messages/${msg._id}`, { read: true });
        if (res.data?.success) {
          setItems(items.map((item) => (item._id === msg._id ? res.data.data : item)));
          fetchStats();
        }
      } catch (err) {
        console.error('Failed to automatically mark message as read:', err);
      }
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    // common
    title: '',
    description: '',
    category: '',
    image: '',
    tags: '',

    // projects
    githubLink: '',
    liveLink: '',

    // blogs
    readingTime: '',
    featuredImage: '',

    // articles
    externalLink: '',
    thumbnail: '',
    readTime: '',

    // skills
    name: '',
    percentage: 80,
    icon: 'Code2',

    // testimonials
    clientName: '',
    role: '',
    rating: 5,
    reviewText: '',
    clientImage: '',
    whyChoseMe: '',
    project: '',

    // activities
    date: '',

    // gallery
    videoUrl: '',
    imageUrl: '',

    // config general settings
    resumeUrl: '',
    avatarUrl: '',
    heroTitle: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',

    // New specifications
    cameraInfo: '',
    resolution: '',
    customLabels: '',
    duration: '',
    videoQuality: '1080p',
    sourceType: 'YouTube',

    // Document fields
    documentType: 'PDF',
    fileSize: '',
    author: '',
    googleDocsLink: '',
    previewImage: ''
  });

  const tabs: TabItem[] = [
    { id: 'projects', name: 'Projects', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'blogs', name: 'Blogs', icon: <FileText className="w-4 h-4" /> },
    { id: 'articles', name: 'Articles', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'skills', name: 'Skills', icon: <Zap className="w-4 h-4" /> },
    { id: 'testimonials', name: 'Testimonials', icon: <Users className="w-4 h-4" /> },
    { id: 'activities', name: 'Activities', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'gallery/images', name: 'Images Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'gallery/videos', name: 'Videos Gallery', icon: <Video className="w-4 h-4" /> },
    { id: 'documents', name: 'Documents', icon: <FileTextIcon className="w-4 h-4" /> },
    { id: 'config', name: 'System Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'messages', name: 'Messages Inbox', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  // Fetch items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${activeTab}`);
      if (res.data?.success && res.data?.data) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchItems();
      fetchStats();
    }
  }, [fetchItems, fetchStats, user, isAdmin]);

  // Reset form when active tab changes
  useEffect(() => {
    resetForm();
  }, [activeTab]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      image: '',
      tags: '',
      githubLink: '',
      liveLink: '',
      readingTime: '',
      featuredImage: '',
      externalLink: '',
      thumbnail: '',
      readTime: '',
      name: '',
      percentage: 80,
      icon: 'Code2',
      clientName: '',
      role: '',
      rating: 5,
      reviewText: '',
      clientImage: '',
      whyChoseMe: '',
      project: '',
      date: '',
      videoUrl: '',
      imageUrl: '',
      resumeUrl: '',
      avatarUrl: '',
      heroTitle: '',
      githubUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      cameraInfo: '',
      resolution: '',
      customLabels: '',
      duration: '',
      videoQuality: '1080p',
      sourceType: 'YouTube',
      documentType: 'PDF',
      fileSize: '',
      author: '',
      googleDocsLink: '',
      previewImage: ''
    });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    let payload: any = {};
    const endpoint = activeTab;

    try {
      if (activeTab === 'projects') {
        if (!formData.title || !formData.category) return;
        payload = {
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          category: formData.category,
          githubLink: formData.githubLink,
          liveLink: formData.liveLink,
          image: formData.image,
        };
      } else if (activeTab === 'blogs') {
        if (!formData.title || !formData.category) return;
        payload = {
          title: formData.title,
          description: formData.description,
          readingTime: formData.readingTime || '5 min read',
          tags: formData.tags,
          featuredImage: formData.featuredImage,
          category: formData.category,
        };
      } else if (activeTab === 'articles') {
        if (!formData.title || !formData.externalLink) return;
        payload = {
          title: formData.title,
          description: formData.description,
          externalLink: formData.externalLink,
          thumbnail: formData.thumbnail,
          readTime: formData.readTime || '5 min read',
        };
      } else if (activeTab === 'skills') {
        if (!formData.name || !formData.category) return;
        payload = {
          name: formData.name,
          category: formData.category,
          percentage: Number(formData.percentage),
          icon: formData.icon,
          description: formData.description,
        };
      } else if (activeTab === 'testimonials') {
        if (!formData.clientName || !formData.reviewText) return;
        payload = {
          clientName: formData.clientName,
          role: formData.role,
          rating: Number(formData.rating),
          reviewText: formData.reviewText,
          clientImage: formData.clientImage,
          whyChoseMe: formData.whyChoseMe,
          project: formData.project,
        };
      } else if (activeTab === 'activities') {
        if (!formData.title || !formData.category) return;
        payload = {
          title: formData.title,
          description: formData.description,
          date: formData.date || new Date().toISOString(),
          image: formData.image,
          category: formData.category,
        };
      } else if (activeTab === 'gallery/images') {
        if (!formData.title || !formData.imageUrl) return;
        payload = {
          title: formData.title,
          imageUrl: formData.imageUrl,
          category: formData.category || 'Gallery',
          description: formData.description || formData.title,
          tags: formData.tags,
          cameraInfo: formData.cameraInfo,
          resolution: formData.resolution,
          customLabels: formData.customLabels
        };
      } else if (activeTab === 'gallery/videos') {
        if (!formData.title || !formData.videoUrl) return;
        payload = {
          title: formData.title,
          videoUrl: formData.videoUrl,
          description: formData.description,
          category: formData.category || 'Videos',
          tags: formData.tags,
          duration: formData.duration,
          videoQuality: formData.videoQuality,
          sourceType: formData.sourceType,
          thumbnail: formData.thumbnail
        };
      } else if (activeTab === 'documents') {
        if (!formData.title) return;
        payload = {
          title: formData.title,
          description: formData.description,
          category: formData.category || 'Documents',
          tags: formData.tags,
          documentType: formData.documentType || 'PDF',
          fileSize: formData.fileSize,
          author: formData.author || 'Masud Rana',
          googleDocsLink: formData.googleDocsLink,
          url: formData.googleDocsLink,
          previewImage: formData.previewImage,
        };
      } else if (activeTab === 'config') {
        payload = {
          category: 'HeroSettings',
          key: 'hero',
          resumeUrl: formData.resumeUrl,
          avatarUrl: formData.avatarUrl,
          heroTitle: formData.heroTitle,
          githubUrl: formData.githubUrl,
          linkedinUrl: formData.linkedinUrl,
          twitterUrl: formData.twitterUrl,
        };
      }

      const response = await (editingItem
        ? api.put(`/${endpoint}/${editingItem._id}`, payload)
        : api.post(`/${endpoint}`, payload));

      if (response.data?.success) {
        if (editingItem) {
          setItems(items.map((item) => (item._id === editingItem._id ? response.data.data : item)));
          setEditingItem(null);
          toast.success('Record modified successfully!');
        } else {
          setItems([response.data.data, ...items]);
          toast.success('Record created successfully!');
        }
        resetForm();
        setShowModal(false);
        fetchStats();
      }
    } catch (err) {
      toast.error('Could not save data record.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this record?')) return;

    try {
      const res = await api.delete(`/${activeTab}/${id}`);
      if (res.data?.success) {
        setItems(items.filter((item) => item._id !== id));
        toast.success('Record deleted successfully.');
        fetchStats();
      }
    } catch (err) {
      toast.error('Failed to delete resource.');
    }
  };

  const openEditModal = (item: ContentItem) => {
    setEditingItem(item);
    
    setFormData({
      title: item.title || '',
      description: item.description || '',
      category: item.category || '',
      image: item.image || item.imageUrl || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      githubLink: item.githubLink || '',
      liveLink: item.liveLink || item.url || '',
      readingTime: item.readingTime || '',
      featuredImage: item.featuredImage || '',
      externalLink: item.externalLink || '',
      thumbnail: item.thumbnail || '',
      readTime: item.readTime || '',
      name: item.name || '',
      percentage: item.percentage || 80,
      icon: item.icon || 'Code2',
      clientName: item.clientName || '',
      role: item.role || '',
      rating: item.rating || 5,
      reviewText: item.reviewText || '',
      clientImage: item.clientImage || '',
      whyChoseMe: (item as any).whyChoseMe || '',
      project: (item as any).project || '',
      date: item.date ? item.date.substring(0, 10) : '',
      videoUrl: item.videoUrl || item.url || '',
      imageUrl: item.imageUrl || item.url || '',
      resumeUrl: item.resumeUrl || '',
      avatarUrl: item.avatarUrl || '',
      heroTitle: item.heroTitle || '',
      githubUrl: item.githubUrl || '',
      linkedinUrl: item.linkedinUrl || '',
      twitterUrl: item.twitterUrl || '',
      cameraInfo: item.cameraInfo || '',
      resolution: item.resolution || '',
      customLabels: item.customLabels || '',
      duration: item.duration || '',
      videoQuality: item.videoQuality || '1080p',
      sourceType: item.sourceType || 'YouTube',
      documentType: item.documentType || 'PDF',
      fileSize: item.fileSize || '',
      author: item.author || '',
      googleDocsLink: item.googleDocsLink || item.url || '',
      previewImage: item.previewImage || ''
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    resetForm();
    setShowModal(true);
  };

  const filteredItems = items.filter((item) => {
    const term = searchQuery.toLowerCase();
    const matchTitle = (item.title || item.name || item.clientName || item.email || (item as any).subject || '').toLowerCase().includes(term);
    const matchDesc = (item.description || item.reviewText || item.category || (item as any).message || '').toLowerCase().includes(term);
    const matchesSearch = matchTitle || matchDesc;

    if (activeTab === 'messages') {
      if (messageFilter === 'unread') return matchesSearch && !item.read;
      if (messageFilter === 'read') return matchesSearch && item.read;
    }
    return matchesSearch;
  });

  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-slate-50 dark:bg-gray-950">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
            <div className="text-slate-500 dark:text-slate-400 font-medium">Validating admin dashboard session...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user || !isAdmin) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-slate-50 dark:bg-gray-950">
          <div className="max-w-md w-full mx-4 text-center p-8 rounded-2xl glass-card border border-red-500/10">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              You must be logged in as an administrator to view this control panel.
            </p>
            <Link href="/login">
              <Button fullWidth variant="primary">Sign In to Admin</Button>
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
      <main className="min-h-screen pt-20 pb-20 bg-slate-50/50 dark:bg-gray-950 relative overflow-hidden flex">
        <div className="glow-spot bg-blue-500/5 dark:bg-blue-600/5 top-0 left-1/4" />
        <div className="glow-spot bg-emerald-500/5 dark:bg-emerald-600/5 bottom-0 right-1/4 animate-pulse-slow" />

        {/* Collapsible Sidebar Layout */}
        <div
          className={`border-r border-slate-200/60 dark:border-white/5 bg-white/70 dark:bg-gray-900/30 backdrop-blur-lg flex flex-col justify-between py-6 px-4 transition-all duration-300 relative z-30 ${
            sidebarCollapsed ? 'w-20' : 'w-72'
          }`}
        >
          <div>
            {/* Top Collapse Button */}
            <div className="flex items-center justify-between mb-8">
              {!sidebarCollapsed && (
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Data Panel
                </span>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors ml-auto"
              >
                {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {/* Sidebar Tabs */}
            <div className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                        : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    {!sidebarCollapsed && <span>{tab.name}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar User Info */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/5">
            {!sidebarCollapsed && (
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Active Admin</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">{user.email}</span>
              </div>
            )}
            <button
              onClick={() => logout?.()}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Dashboard Work Area */}
        <div className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 relative z-10 pt-4">
          
          {/* Top Analytics Metrics Deck */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Projects</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{stats.projects}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Blogs</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{stats.blogs}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Images</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{stats.images}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Videos</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{stats.videos}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <FileTextIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Documents</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{stats.documents}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Inquiries</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{stats.messages}</span>
              </div>
            </div>
          </div>

          {/* Heading Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-sky-500 transition-colors mb-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Site
              </Link>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                {tabs.find((t) => t.id === activeTab)?.name} Management
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter records..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 transition-colors"
                />
              </div>

              {activeTab !== 'messages' && (
                <Button onClick={openAddModal} className="w-full sm:w-auto text-xs font-bold gap-1.5">
                  <Plus className="w-4 h-4" />
                  Create Record
                </Button>
              )}
            </div>
          </div>

          {/* Listings Wrapper */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5">
              <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin mb-3" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Loading collection metadata...</span>
            </div>
          ) : activeTab === 'messages' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-3">
                {(['all', 'unread', 'read'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setMessageFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                      messageFilter === filter
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {filter} ({
                      filter === 'all'
                        ? items.length
                        : filter === 'unread'
                        ? items.filter((i: any) => !i.read).length
                        : items.filter((i: any) => i.read).length
                    })
                  </button>
                ))}
              </div>

              {filteredItems.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 gap-3">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item: any) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        onClick={() => handleViewMessage(item)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          !item.read
                            ? 'bg-sky-500/5 border-sky-500/30 hover:border-sky-500/50 dark:bg-sky-500/10'
                            : 'bg-white dark:bg-white/5 border-slate-200/50 dark:border-white/5 hover:border-sky-500/20'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            {!item.read && <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />}
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {item.name} &lt;{item.email}&gt;
                            </span>
                            <span className="text-[10px] text-slate-400 ml-auto">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US') : ''}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">{item.subject}</h4>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{item.message}</p>
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleRead(item)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-500"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl">
                  <p className="text-slate-400 text-xs">No messages found in inbox.</p>
                </div>
              )}
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:border-sky-500/30 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {item.title || item.name || item.clientName || item.email || item.heroTitle || 'Untitled Settings'}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {item.category && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        )}
                        {item.resolution && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                            {item.resolution}
                          </span>
                        )}
                        {item.duration && (
                          <span className="text-[9px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                            {item.duration}
                          </span>
                        )}
                        {item.documentType && (
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {item.documentType}
                          </span>
                        )}
                        {item.fileSize && (
                          <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                            {item.fileSize}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl">
              <p className="text-slate-400 text-xs mb-4">No matching records found.</p>
              <Button onClick={openAddModal} size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Create First Record
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Dynamic CRUD Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/25">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingItem ? 'Modify Record' : 'Create Record'}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {tabs.find((t) => t.id === activeTab)?.name} Schema
                  </p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* 1. PROJECTS FORM */}
                {activeTab === 'projects' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Project Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. NovaSaaS - Enterprise AI Dashboard"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
                        <input
                          type="text"
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g. Fullstack, Frontend"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tags</label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="Next.js, TypeScript, MongoDB"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the application features..."
                        rows={3}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white resize-none focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">GitHub Repo</label>
                        <input
                          type="url"
                          value={formData.githubLink}
                          onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Live Demo</label>
                        <input
                          type="url"
                          value={formData.liveLink}
                          onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cover Image URL</label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* 2. BLOGS FORM */}
                {activeTab === 'blogs' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Blog Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Blog title..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
                        <input
                          type="text"
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Read Time</label>
                        <input
                          type="text"
                          value={formData.readingTime}
                          onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                          placeholder="5 min read"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tags</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Next.js, Tailwind"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white resize-none focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Featured Image URL</label>
                      <input
                        type="url"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* 3. ARTICLES FORM */}
                {activeTab === 'articles' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Article Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Publication URL</label>
                      <input
                        type="url"
                        required
                        value={formData.externalLink}
                        onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Read Time</label>
                        <input
                          type="text"
                          value={formData.readTime}
                          onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Thumbnail URL</label>
                        <input
                          type="url"
                          value={formData.thumbnail}
                          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 4. SKILLS FORM */}
                {activeTab === 'skills' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Technology Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category Group</label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="">Select Group...</option>
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Database">Database</option>
                          <option value="Tools">Tools</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lucide Icon</label>
                        <input
                          type="text"
                          value={formData.icon}
                          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proficiency Level</label>
                        <span className="text-xs font-bold text-sky-500">{formData.percentage}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={formData.percentage}
                        onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                      />
                    </div>
                  </>
                )}

                {/* 5. TESTIMONIALS FORM */}
                {activeTab === 'testimonials' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Client Name</label>
                        <input
                          type="text"
                          required
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Role/Designation</label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Recommendation Text</label>
                      <textarea
                        required
                        value={formData.reviewText}
                        onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white resize-none focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* 6. ACTIVITIES FORM */}
                {activeTab === 'activities' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Activity Name</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
                        <input
                          type="text"
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 7. GALLERY IMAGES FORM WITH EXTENDED METADATA */}
                {activeTab === 'gallery/images' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Image Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="E.g. Dynamic Skyline"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Image URL Source</label>
                      <input
                        type="url"
                        required
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Directory Category</label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="E.g. Travel, Architecture"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Resolution Spec</label>
                        <input
                          type="text"
                          value={formData.resolution}
                          onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                          placeholder="E.g. 6000 x 4000"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Camera / Device Info</label>
                        <input
                          type="text"
                          value={formData.cameraInfo}
                          onChange={(e) => setFormData({ ...formData, cameraInfo: e.target.value })}
                          placeholder="E.g. Sony Alpha A7 III"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Custom Tags (Comma Separated)</label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="Nature, Sunset, Canon"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Custom Labels Info (Key-Values)</label>
                      <input
                        type="text"
                        value={formData.customLabels}
                        onChange={(e) => setFormData({ ...formData, customLabels: e.target.value })}
                        placeholder="ISO: 100, Aperture: f/2.8, Speed: 1/200s"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description Overview</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Write detailed image specs..."
                        rows={2}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white resize-none focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* 8. GALLERY VIDEOS FORM WITH EXTENDED METADATA */}
                {activeTab === 'gallery/videos' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Video Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Video Title"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Video URL Link (Drive or YouTube)</label>
                      <input
                        type="url"
                        required
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Directory Category</label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="E.g. Tutorials, Motion"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Duration Spec</label>
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="E.g. 05:40"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Video Quality</label>
                        <select
                          value={formData.videoQuality}
                          onChange={(e) => setFormData({ ...formData, videoQuality: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="1080p">1080p Full HD</option>
                          <option value="4K">4K Ultra HD</option>
                          <option value="720p">720p HD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Source Type</label>
                        <select
                          value={formData.sourceType}
                          onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="YouTube">YouTube Embed</option>
                          <option value="GoogleDrive">Google Drive Direct</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Custom Tags (Comma Separated)</label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="Client, Animation, Marketing"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Optional Thumbnail Image URL</label>
                      <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="Leave empty for auto-generated YouTube thumbnails"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white resize-none focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* DOCUMENTS FORM */}
                {activeTab === 'documents' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Document Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="E.g. Brand Identity Guidelines 2024"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Document / Google Docs URL</label>
                      <input
                        type="url"
                        required
                        value={formData.googleDocsLink}
                        onChange={(e) => setFormData({ ...formData, googleDocsLink: e.target.value })}
                        placeholder="https://docs.google.com/... or PDF URL"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="E.g. Reports, Proposals"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Document Type</label>
                        <select
                          value={formData.documentType}
                          onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="PDF">PDF Document</option>
                          <option value="Google Doc">Google Doc</option>
                          <option value="Presentation">Presentation</option>
                          <option value="Spreadsheet">Spreadsheet</option>
                          <option value="Word">Word Document</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Author</label>
                        <input
                          type="text"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          placeholder="E.g. Masud Rana"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">File Size</label>
                        <input
                          type="text"
                          value={formData.fileSize}
                          onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                          placeholder="E.g. 2.4 MB"
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tags (Comma Separated)</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Design, Branding, 2024"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Preview Image URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.previewImage}
                        onChange={(e) => setFormData({ ...formData, previewImage: e.target.value })}
                        placeholder="https://... thumbnail/cover image"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                        placeholder="Brief summary of the document content..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white resize-none focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* 9. SYSTEM SETTINGS CONFIG FORM */}
                {activeTab === 'config' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Hero Profile Title</label>
                      <input
                        type="text"
                        value={formData.heroTitle}
                        onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Avatar Profile Image URL</label>
                      <input
                        type="url"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Resume PDF URL Link</label>
                      <input
                        type="url"
                        value={formData.resumeUrl}
                        onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">GitHub profile</label>
                        <input
                          type="url"
                          value={formData.githubUrl}
                          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">LinkedIn profile</label>
                        <input
                          type="url"
                          value={formData.linkedinUrl}
                          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Twitter Profile</label>
                        <input
                          type="url"
                          value={formData.twitterUrl}
                          onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-white/5">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 text-xs py-2.5 font-bold"
                    onClick={() => setShowModal(false)}
                  >
                    Discard
                  </Button>
                  <Button type="submit" className="flex-1 text-xs py-2.5 font-bold">
                    {editingItem ? 'Save Updates' : 'Add to Collection'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Message Inbox Detail Popup */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/25">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Message Details</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Inbox</p>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sender Name</span>
                    <p className="font-semibold text-slate-800 dark:text-white">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</span>
                    <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-sky-500 hover:underline">{selectedMessage.email}</a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</span>
                    <p className="font-semibold text-slate-800 dark:text-white">{selectedMessage.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Received Time</span>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString('en-US') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Subject</span>
                  <p className="font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-200/50 dark:border-white/5">
                    {selectedMessage.subject}
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Message Body</span>
                  <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200/50 dark:border-white/5 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/25 flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1 font-bold text-xs py-2"
                  onClick={() => handleToggleRead(selectedMessage)}
                >
                  Mark as {selectedMessage.read ? 'Unread' : 'Read'}
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 font-bold text-xs py-2 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    handleDeleteItem(selectedMessage._id);
                    setSelectedMessage(null);
                  }}
                >
                  Delete Message
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
}
