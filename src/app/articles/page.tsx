'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowLeft, BookOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { SectionHeader } from '../../components/SectionHeader';
import { SkeletonGrid } from '../../components/LoadingSkeleton';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

interface Article {
  _id: string;
  title: string;
  description: string;
  externalLink: string;
  thumbnail: string;
  readTime: string;
  category?: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    _id: 'art-1',
    title: '10 Advanced Tailwind Tricks for Sleek Glassmorphism UIs',
    description: 'Learn how to combine backdrop filters, box shadow spreads, and gradient borders to create state-of-the-art SaaS designs.',
    externalLink: 'https://medium.com/@masudrana/tailwind-glassmorphism',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    category: 'Frontend',
  },
  {
    _id: 'art-2',
    title: 'Why We Migrated from PostgreSQL to MongoDB for Real-Time Analytics',
    description: 'An in-depth breakdown of schema flexibility, sub-document efficiency, and how document databases helped scale our analytics SDK.',
    externalLink: 'https://medium.com/@masudrana/postgresql-to-mongodb',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    readTime: '7 min read',
    category: 'Backend',
  },
  {
    _id: 'art-3',
    title: 'Building Fluid Framer Motion Layout Transitions in Next.js',
    description: 'How to use AnimatePresence and layoutId to create smooth app-like routing transitions within Next.js App Router.',
    externalLink: 'https://medium.com/@masudrana/framer-motion-nextjs',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    category: 'Frontend',
  },
  {
    _id: 'art-4',
    title: 'JWT vs OAuth2: Deep Dive into Authentication Patterns',
    description: 'A comprehensive comparison of authentication strategies, security implications, and when to use each approach in modern applications.',
    externalLink: 'https://medium.com/@masudrana/jwt-vs-oauth2',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?auto=format&fit=crop&w=800&q=80',
    readTime: '8 min read',
    category: 'Backend',
  },
  {
    _id: 'art-5',
    title: 'Optimizing React Component Rendering with Memoization',
    description: 'Learn useMemo, useCallback, and React.memo patterns to prevent unnecessary re-renders and boost application performance.',
    externalLink: 'https://medium.com/@masudrana/react-memoization',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    category: 'Frontend',
  },
  {
    _id: 'art-6',
    title: 'Deploying Next.js Applications to Vercel: Best Practices',
    description: 'A step-by-step guide to production deployment, environment configuration, CI/CD pipelines, and performance optimization strategies.',
    externalLink: 'https://medium.com/@masudrana/nextjs-vercel-deployment',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-adf4e565c6c1?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    category: 'DevOps',
  },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filtered, setFiltered] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        if (res.data && res.data.success && res.data.data.length > 0) {
          setArticles(res.data.data);
        } else {
          setArticles(MOCK_ARTICLES);
        }
      } catch (err) {
        console.warn('API error, using mock articles:', err);
        setArticles(MOCK_ARTICLES);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const query = searchTerm.toLowerCase();
    const results = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query)
    );
    setFiltered(results);
  }, [searchTerm, articles]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 relative overflow-hidden">
        {/* Glow Background */}
        <div className="glow-spot bg-emerald-600 top-1/4 left-1/4" />
        <div className="glow-spot bg-blue-600 bottom-1/4 right-1/4" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <SectionHeader
            badge="Publications"
            title="Articles & Insights"
            subtitle="In-depth technical articles, engineering insights, and best practices shared on Medium and across the web."
          />

          {/* Search Bar */}
          <div className="mb-10 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all"
            />
          </div>

          {loading ? (
            <SkeletonGrid count={6} cols={3} />
          ) : filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((article) => (
                  <motion.div
                    key={article._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/10"
                  >
                    <Link href={`/articles/${article._id}`} className="flex h-full flex-col">
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden h-48 bg-gradient-to-br from-slate-900 to-slate-800">
                      <motion.img
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* External Link Icon */}
                      <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        {article.category && (
                          <span className="inline-block mb-3 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
                            {article.category}
                          </span>
                        )}
                        <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2 group-hover:text-sky-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-3">
                          {article.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                        <span className="text-xs text-slate-500">
                          {article.readTime}
                        </span>
                        <span className="text-xs font-semibold text-sky-400 group-hover:gap-1.5 transition-all flex items-center gap-1">
                          Read More
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h2 className="text-xl font-bold mb-2">No articles found</h2>
              <p className="text-slate-400">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
