'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import api from '../services/api';

interface Article {
  _id: string;
  title: string;
  description: string;
  externalLink: string;
  thumbnail: string;
  readTime: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    _id: 'art-1',
    title: '10 Advanced Tailwind Tricks for Sleek Glassmorphism UIs',
    description: 'Learn how to combine backdrop filters, box shadow spreads, and gradient borders to create state-of-the-art SaaS designs.',
    externalLink: 'https://medium.com',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
  },
  {
    _id: 'art-2',
    title: 'Why We Migrated from PostgreSQL to MongoDB for Real-Time Analytics',
    description: 'An in-depth breakdown of schema flexibility, sub-document efficiency, and how document databases helped scale our analytics SDK.',
    externalLink: 'https://medium.com',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    readTime: '7 min read',
  },
  {
    _id: 'art-3',
    title: 'Building Fluid Framer Motion Layout Transitions in Next.js',
    description: 'How to use AnimatePresence and layoutId to create smooth app-like routing transitions within Next.js App Router.',
    externalLink: 'https://medium.com',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
  }
];

export const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = (dir: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = dir === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading || articles.length === 0) {
    return null;
  }

  return (
    <section id="articles" className="py-20 relative overflow-hidden">
      <div className="glow-spot bg-emerald-600/5 dark:bg-emerald-600/10 top-1/2 right-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <SectionHeader
            badge="Publications"
            title="External Articles"
            subtitle="Articles published on Medium, Dev.to, and other engineering blogs."
          />
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {articles.map((art) => (
            <motion.div
              key={art._id}
              whileHover={{ y: -6 }}
              onClick={() => setActiveArticle(art)}
              className="snap-start min-w-[300px] max-w-[340px] sm:min-w-[340px] group flex flex-col justify-between rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-gray-950/20 backdrop-blur-lg hover:border-sky-500/30 transition-all duration-300 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="h-44 overflow-hidden relative">
                <Image
                  src={art.thumbnail}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 340px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/25 to-transparent opacity-50" />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[9px] font-bold text-sky-400 bg-slate-900/80 px-2 py-0.5 rounded border border-sky-400/20">
                  <BookOpen className="w-3 h-3" />
                  {art.readTime}
                </span>
              </div>

              {/* Contents */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-500 transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                    {art.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-sky-500 pt-3 border-t border-slate-200 dark:border-white/5">
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Detail Popup Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative flex flex-col"
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 z-10 text-white p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={activeArticle.thumbnail}
                  alt={activeArticle.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 512px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                <span className="absolute bottom-4 left-6 inline-flex items-center gap-1 text-[9px] font-bold text-sky-400 bg-slate-950/80 px-2.5 py-0.5 rounded border border-sky-400/20">
                  <BookOpen className="w-3.5 h-3.5" />
                  {activeArticle.readTime}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {activeArticle.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeArticle.description}
                </p>

                <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1 font-bold text-xs py-2.5"
                    onClick={() => setActiveArticle(null)}
                  >
                    Close Preview
                  </Button>
                  <a
                    href={activeArticle.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="primary" fullWidth className="gap-1.5 font-bold text-xs py-2.5">
                      Open Publication
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Articles;
