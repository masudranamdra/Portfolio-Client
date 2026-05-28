'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Search } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { SkeletonGrid } from '../../components/LoadingSkeleton';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

interface Blog {
  _id: string;
  title: string;
  description: string;
  readingTime: string;
  tags: string[];
  featuredImage: string;
  createdAt: string;
  category: string;
}

const MOCK_BLOGS: Blog[] = [
  {
    _id: 'b1',
    title: 'Demystifying Hydration Errors in Next.js 14 App Router',
    description: 'Why do hydration mismatch errors happen, and how can you structuralize your React components to prevent them forever?',
    readingTime: '6 min read',
    tags: ['Next.js', 'React', 'SSR', 'WebDev'],
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-10T00:00:00.000Z',
    category: 'Frontend',
  },
  {
    _id: 'b2',
    title: 'Mastering MongoDB Aggregate Pipelines for Advanced Dashboards',
    description: 'Ditch multiple separate find queries. Learn to construct single-stage aggregations for compound metrics calculations.',
    readingTime: '8 min read',
    tags: ['MongoDB', 'Express', 'Database', 'Backend'],
    featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-02T00:00:00.000Z',
    category: 'Backend',
  },
  {
    _id: 'b3',
    title: 'Securing API Sessions with HttpOnly JWT Cookies',
    description: 'Avoid localStorage JWT leakage vector. Configure secure CORS configurations and HttpOnly server side cookies.',
    readingTime: '5 min read',
    tags: ['Express', 'NodeJS', 'Security', 'Auth'],
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-04-20T00:00:00.000Z',
    category: 'Backend',
  }
];

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filtered, setFiltered] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        if (res.data && res.data.success && res.data.data.length > 0) {
          setBlogs(res.data.data);
        } else {
          setBlogs(MOCK_BLOGS);
        }
      } catch (err) {
        console.warn('API error, using mock blogs:', err);
        setBlogs(MOCK_BLOGS);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter((b) => b.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    setFiltered(result);
  }, [activeCategory, searchQuery, blogs]);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Security'];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 relative overflow-hidden">
        {/* Glow Background */}
        <div className="glow-spot bg-blue-600 top-1/4 left-1/4" />
        <div className="glow-spot bg-emerald-600 bottom-1/4 right-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <SectionHeader
            badge="Blog"
            title="Insights & Tutorials"
            subtitle="I write guides on server optimization, React state, and microservice APIs."
          />

          {/* Search & Filter Section */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 dark:border-white/5">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                    activeCategory === cat
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-transparent dark:border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-sm"
              />
            </div>
          </div>

          {loading ? (
            <SkeletonGrid count={3} cols={3} />
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((blog) => (
                  <motion.article
                    layout
                    key={blog._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group relative flex flex-col justify-between h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-gray-950/20 backdrop-blur-lg hover:border-sky-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <Link href={`/blog/${blog._id}`} className="block h-full">
                      {/* Image */}
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60" />
                        <span className="absolute bottom-3 left-3 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-emerald-400/20">
                          {blog.category}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-6">
                        {/* Meta */}
                        <div className="flex gap-4 items-center text-xs text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(blog.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {blog.readingTime}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-500 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {blog.description}
                        </p>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                No articles match your query. Try a different search!
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
