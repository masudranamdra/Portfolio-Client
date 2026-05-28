'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';
import api from '../services/api';

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
    title: 'Building Fluid Framer Motion Layout Transitions in Next.js',
    description: 'How to use AnimatePresence and layoutId to create smooth app-like routing transitions within Next.js App Router.',
    readingTime: '5 min read',
    tags: ['Framer Motion', 'Next.js', 'Animations', 'UX'],
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-04-18T00:00:00.000Z',
    category: 'Frontend',
  }
];

export const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs?featured=true');
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 380 : scrollLeft + 380;
      containerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="blog" className="py-20 relative overflow-hidden bg-slate-50/20 dark:bg-gray-950/10">
      <div className="glow-spot bg-emerald-600/5 dark:bg-emerald-600/10 top-1/4 right-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <SectionHeader
            badge="Insights"
            title="Latest Writings"
            subtitle="I write about performance audits, serverless scaling, state containers, and Web3 solutions."
          />
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link href="/blog" className="ml-2">
              <Button variant="secondary" className="gap-2 py-2 text-xs font-bold">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden py-4">
            <div className="min-w-[340px] h-96 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
            <div className="min-w-[340px] h-96 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
            <div className="min-w-[340px] h-96 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
          </div>
        ) : (
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {blogs.map((blog) => (
              <motion.article
                key={blog._id}
                whileHover={{ y: -6 }}
                className="snap-start min-w-[300px] max-w-[340px] sm:min-w-[340px] group relative flex flex-col justify-between rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-gray-950/20 backdrop-blur-lg hover:border-sky-500/30 transition-all duration-300 cursor-pointer"
              >
                <Link href={`/blog/${blog._id}`} className="block h-full">
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 340px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60" />
                    <span className="absolute bottom-4 left-4 inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-emerald-400/20">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-4 items-center text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-semibold">
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
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                        {blog.description}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-500 group-hover:gap-2 transition-all">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
