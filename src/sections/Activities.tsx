'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import api from '../services/api';

interface Activity {
  _id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    _id: 'a1',
    title: 'Keynote Speaker at TechCon 2025',
    description: 'Delivered a talk on "The Future of Serverless React and Edge Compute Frameworks" to an audience of over 500 developers.',
    date: '2025-11-12T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    category: 'Public Speaking',
  },
  {
    _id: 'a2',
    title: 'Won First Place at HackDiff 2025',
    description: 'Led a team of 4 to design and develop AuraPay - a smart account wallet, taking home the grand prize for web3 integration.',
    date: '2025-06-20T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    category: 'Hackathon',
  },
  {
    _id: 'a3',
    title: 'AWS Certified Solutions Architect',
    description: 'Successfully passed the AWS Solutions Architect - Associate exam, validating proficiency in designing secure distributed cloud systems.',
    date: '2025-02-15T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&w=800&q=80',
    category: 'Certification',
  }
];

export const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get('/activities');
        if (res.data && res.data.success && res.data.data.length > 0) {
          setActivities(res.data.data);
        } else {
          setActivities(MOCK_ACTIVITIES);
        }
      } catch (err) {
        console.warn('API error, using mock activities:', err);
        setActivities(MOCK_ACTIVITIES);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading || activities.length === 0) {
    return null;
  }

  // Duplicate items to ensure smooth infinite loop scroll
  const doubleActivities = [...activities, ...activities, ...activities];

  return (
    <section id="activities" className="py-20 relative overflow-hidden bg-slate-50/10 dark:bg-gray-950/5">
      <div className="glow-spot bg-blue-600/5 dark:bg-blue-600/10 top-1/2 left-1/4" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Community"
          title="Activities & Engagements"
          subtitle="A timeline of workshops, developer talks, and hackathons I participated in."
          center
        />

        <div className="relative mt-12 max-w-4xl mx-auto h-[460px] overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 backdrop-blur-md px-6 sm:px-8 py-4">
          <div className="absolute left-[39px] sm:left-[47px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500/10 via-sky-500/50 to-sky-500/10 z-0 pointer-events-none" />
          
          <div
            className="flex flex-col gap-8 py-8 animate-marquee-vertical hover:[animation-play-state:paused]"
          >
            {doubleActivities.map((act, index) => (
              <div key={`${act._id}-${index}`} className="relative pl-10 sm:pl-12">
                {/* Point Indicator */}
                <span className="absolute left-[1px] sm:left-[9px] top-4 w-5 h-5 rounded-full bg-white dark:bg-slate-950 border-2 border-sky-500 z-10 flex items-center justify-center shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                </span>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Text Details */}
                  <div className="md:col-span-8 text-left">
                    <div className="flex flex-wrap gap-3 items-center text-[10px] mb-2 font-bold">
                      <span className="inline-flex items-center gap-1 text-sky-500 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20 uppercase tracking-wider">
                        <Tag className="w-3 h-3" />
                        {act.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(act.date)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                      {act.description}
                    </p>
                  </div>

                  {/* Event Photo */}
                  {act.image && (
                    <div className="hidden md:block md:col-span-4 h-28 rounded-xl overflow-hidden relative border border-slate-200 dark:border-white/10 group shadow-md">
                      <Image
                        src={act.image}
                        alt={act.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <ImageIcon className="w-6 h-6 text-white animate-float" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
