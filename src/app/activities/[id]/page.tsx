'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import api from '../../../services/api';

interface Activity {
  _id: string;
  title: string;
  description: string;
  date?: string;
  image?: string;
  category?: string;
}

export default function ActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    params.then(({ id }) => api.get(`/activities/${id}`).then((res) => setActivity(res.data?.data || null)));
  }, [params]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/activities" className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Activities
          </Link>
          {activity && (
            <>
              {activity.image && <img src={activity.image} alt={activity.title} className="mb-8 h-80 w-full rounded-2xl object-cover" />}
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {activity.category && <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-500">{activity.category}</span>}
                {activity.date && <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(activity.date).toLocaleDateString()}</span>}
              </div>
              <h1 className="text-4xl font-black text-slate-950 dark:text-white">{activity.title}</h1>
              <p className="mt-6 whitespace-pre-line text-lg leading-8 text-slate-700 dark:text-slate-300">{activity.description}</p>
            </>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
