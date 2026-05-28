'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, User, Tag } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { GlassCard } from '../../../components/GlassCard';
import api from '../../../services/api';

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  readingTime: string;
  tags: string[];
  featuredImage: string;
  createdAt: string;
  category: string;
  author: {
    username: string;
  };
}

const MOCK_BLOGS: Record<string, Blog> = {
  'b1': {
    _id: 'b1',
    title: 'Demystifying Hydration Errors in Next.js 14 App Router',
    description: 'Why do hydration mismatch errors happen, and how can you structuralize your React components to prevent them forever?',
    content: `
      <p>Hydration is the process of mapping the pre-compiled server side HTML structure to the DOM nodes, registering events, and mounting standard React hooks in the client browser. Hydration mismatch errors happen when the server-rendered HTML does not match the client-rendered DOM node hierarchy.</p>
      
      <h2>Why do Hydration Errors occur?</h2>
      <p>There are several common culprits behind hydration mismatches:</p>
      <ul>
        <li><strong>Invalid HTML nesting:</strong> For example, placing a div inside a paragraph tag. In the browser, the parser automatically closes the paragraph before parsing the div, creating mismatched element depths.</li>
        <li><strong>Relying on client-only globals:</strong> Accessing window, localStorage, or screen properties on rendering steps without checking mount states.</li>
        <li><strong>Time stamps & Dates:</strong> Generating random numbers or dates in the render tree that differ between node build times and client execution times.</li>
      </ul>

      <h2>How to fix Hydration mismatches?</h2>
      <p>Here are three professional techniques to eliminate hydration warning highlights:</p>
      <pre><code>// 1. Use the useEffect hook to defer client-only rendering
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;</code></pre>

      <p>Alternatively, if you have a component that you know will render client-only items, disable server-side rendering for that component using dynamic imports:</p>
      <pre><code>// 2. Next dynamic imports with ssr disabled
import dynamic from 'next/dynamic';
const ClientComponent = dynamic(() => import('./ClientComponent'), { ssr: false });</code></pre>

      <p>By enforcing clean markup, keeping client states nested in useEffects, and using dynamic wrappers, you can maintain perfect next speed metrics and build zero error experiences.</p>
    `,
    readingTime: '6 min read',
    tags: ['Next.js', 'React', 'SSR', 'WebDev'],
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-10T00:00:00.000Z',
    category: 'Frontend',
    author: { username: 'Masud Rana' }
  },
  'b2': {
    _id: 'b2',
    title: 'Mastering MongoDB Aggregate Pipelines for Advanced Dashboards',
    description: 'Ditch multiple separate find queries. Learn to construct single-stage aggregations for compound metrics calculations.',
    content: `
      <p>Aggregation pipelines are the power tools of Mongoose and MongoDB. They let you filter, map, group, compute, and format collections of documents without having to fetch thousands of individual entries into Node memory buffers.</p>

      <h2>What is an Aggregation Pipeline?</h2>
      <p>An aggregation pipeline is an array of stages. Each stage transforms the document stream sequentially, passing the modified outputs directly to the next stage.</p>

      <h2>Core Stages you must master:</h2>
      <ul>
        <li><strong>$match:</strong> Filters the documents to include only matching query parameters. Should always be the first stage.</li>
        <li><strong>$group:</strong> Groups documents by a specific key, accumulating metrics like sums, averages, min/max values.</li>
        <li><strong>$project:</strong> Formats the returned schema, allowing you to exclude, rename, or compute fields on the fly.</li>
      </ul>

      <pre><code>// Dynamic pipeline example
const stats = await Project.aggregate([
  { $match: { category: 'Fullstack' } },
  { $group: { _id: '$category', totalLikes: { $sum: '$likes' } } }
]);</code></pre>

      <p>Using aggregations optimizes response times and saves massive server memory capacities on scale.</p>
    `,
    readingTime: '8 min read',
    tags: ['MongoDB', 'Express', 'Database', 'Backend'],
    featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-02T00:00:00.000Z',
    category: 'Backend',
    author: { username: 'Masud Rana' }
  },
  'b3': {
    _id: 'b3',
    title: 'Securing API Sessions with HttpOnly JWT Cookies',
    description: 'Avoid localStorage JWT leakage vector. Configure secure CORS configurations and HttpOnly server side cookies.',
    content: `
      <p>Standard authorization approaches store tokens in LocalStorage or SessionStorage, which are vulnerable to Cross-Site Scripting (XSS) leaks. A more secure method is to send JWTs inside HttpOnly cookies, rendering them inaccessible to malicious client scripts.</p>

      <h2>Why HttpOnly Cookies?</h2>
      <p>When a cookie is set with the <code>HttpOnly</code> attribute, the browser prevents client side scripts from reading it (e.g. via <code>document.cookie</code>). This offers robust protection against token theft.</p>

      <h2>Implementation in Express:</h2>
      <pre><code>res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 1 day
});</code></pre>

      <p>By coupling HttpOnly cookies with CSRF tokens and SameSite attributes, you can establish enterprise-grade web security.</p>
    `,
    readingTime: '5 min read',
    tags: ['Express', 'NodeJS', 'Security', 'Auth'],
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-04-20T00:00:00.000Z',
    category: 'Backend',
    author: { username: 'Masud Rana' }
  }
};

export default function BlogDetailPage() {
  const { id } = useParams() as { id: string };
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data && res.data.success) {
          setBlog(res.data.data);
        } else {
          setBlog(MOCK_BLOGS[id] || null);
        }
      } catch (err) {
        console.warn('API error, using mock blog detail:', err);
        setBlog(MOCK_BLOGS[id] || null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500 animate-pulse">Loading article content...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-slate-500">Article not found.</p>
          <Link href="/blog" className="text-sky-500 font-bold hover:underline">
            Back to Writings
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 relative overflow-hidden">
        {/* Glow Background */}
        <div className="glow-spot bg-blue-600 top-1/4 left-1/4" />
        <div className="glow-spot bg-emerald-600 bottom-1/4 right-1/4" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Writings
          </Link>

          <article>
            {/* Header Content */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-emerald-500 uppercase bg-emerald-500/10 rounded-full border border-emerald-500/20">
                {blog.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6">
                {blog.title}
              </h1>

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200 dark:border-white/5 py-4">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-sky-500" />
                  {blog.author?.username || 'Masud Rana'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(blog.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {blog.readingTime}
                </span>
              </div>
            </div>

            {/* Featured Image Banner */}
            <div className="h-[250px] sm:h-[400px] rounded-2xl overflow-hidden mb-12 shadow-2xl border border-slate-200 dark:border-white/10">
              <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>

            {/* Content Body */}
            <GlassCard className="p-8 sm:p-12 border-slate-200 dark:border-white/5 bg-white/5 dark:bg-gray-950/10">
              <div
                className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed
                prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-base prose-p:mb-4
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                prose-pre:bg-slate-900 prose-pre:text-sky-300 prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:font-mono prose-pre:text-sm prose-pre:border prose-pre:border-white/10
                prose-code:font-mono prose-code:text-sm prose-code:bg-slate-100 dark:prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
                  >
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
