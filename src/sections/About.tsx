'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations';
import { GlassCard } from '../components/GlassCard';
import { SectionHeader } from '../components/SectionHeader';
import { Award, Briefcase, Users, Code } from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { label: 'Years Experience', value: '1+', icon: Briefcase, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Completed Projects', value: '5+', icon: Code, color: 'text-sky-500 bg-sky-500/10' },
    { label: 'Happy Clients', value: '3+', icon: Users, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Certifications', value: '10+', icon: Award, color: 'text-orange-500 bg-orange-500/10' },
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="glow-spot bg-sky-600 top-1/2 right-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="About Me"
          title="My Journey & Mission"
          subtitle="Combining mathematical logic with modern user-experience principles to craft premium cloud platforms."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Stats Bento Grid (Left side) */}
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-5 grid grid-cols-2 gap-4"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={idx} animateHover className="flex flex-col justify-between p-5 min-h-[140px] border-slate-200 dark:border-white/5">
                  <div className={`p-2.5 rounded-xl w-fit ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </motion.div>

          {/* Biography Text (Right side) */}
          <motion.div
            variants={fadeIn('left', 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="glass-card p-8 border-slate-200 dark:border-white/5 bg-white/5 dark:bg-gray-950/20">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Who is Masud Rana?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                I am a dedicated software engineer with a deep passion for writing clean, structured, and performant code. Over the last 5 years, I have architected custom SaaS solutions, gasless crypto interfaces, real-time sync systems, and optimized backend databases.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                My mission is to help companies transform complex workflows into beautiful, intuitive digital experiences. I specialize in the MERN/Next.js stack, leveraging serverless computing and modern container pipelines to deployment platforms like AWS, Vercel, and Render.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassCard className="p-5 border-slate-200 dark:border-white/5">
                <span className="text-sm font-bold text-sky-500">Aesthetics & Performance</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  I believe in ultra-responsive designs, glassmorphism UI palettes, and fluid spring micro-animations.
                </p>
              </GlassCard>
              <GlassCard className="p-5 border-slate-200 dark:border-white/5">
                <span className="text-sm font-bold text-emerald-500">Security & Scalability</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Using secure cookies, authorization checks, and indexes on Mongoose schemas to build durable APIs.
                </p>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default About;
