'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Search, Tag } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { SectionHeader } from '../../components/SectionHeader';
import { SkeletonGrid } from '../../components/LoadingSkeleton';
import api from '../../services/api';

interface Activity {
  _id: string;
  title: string;
  description: string;
  date?: string;
  image?: string;
  category?: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/activities')
      .then((res) => setActivities(res.data?.data || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(activities.map((a) => a.category).filter((value): value is string => Boolean(value))))],
    [activities]
  );
  const filtered = activities.filter((activity) => {
    const matchesCategory = category === 'All' || activity.category === category;
    const q = query.toLowerCase();
    return matchesCategory && [activity.title, activity.description, activity.category].some((value) => value?.toLowerCase().includes(q));
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
          <SectionHeader badge="Activities" title="Activities & Engagements" subtitle="Talks, certifications, hackathons, and engineering community work." />

          <div className="mb-10 flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-white/10 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button key={item} onClick={() => setCategory(item)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${category === item ? 'bg-sky-500 text-white' : 'bg-slate-200/60 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search activities..." className="w-full rounded-xl border border-slate-200 bg-slate-100/60 py-2 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-white" />
            </div>
          </div>

          {loading ? <SkeletonGrid count={6} cols={3} /> : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((activity) => (
                <motion.article key={activity._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <Link href={`/activities/${activity._id}`}>
                    {activity.image && <img src={activity.image} alt={activity.title} className="h-48 w-full object-cover" />}
                    <div className="p-6">
                      <div className="mb-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {activity.category && <span className="inline-flex items-center gap-1 text-sky-500"><Tag className="h-3.5 w-3.5" />{activity.category}</span>}
                        {activity.date && <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(activity.date).toLocaleDateString()}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white">{activity.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
