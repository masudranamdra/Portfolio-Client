'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Award } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { GlassCard } from '../components/GlassCard';
import { fadeIn, staggerContainer } from '../animations';

interface TimelineItem {
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  achievements?: string[];
}

export const Experience: React.FC = () => {
  const experiences: TimelineItem[] = [
    {
      title: 'Senior Software Engineer',
      subtitle: 'Apex Digital Labs',
      duration: '2023 - Present',
      description: 'Lead engineer for microservice APIs and dashboard redesign. Integrated web3 payments and speed-optimized PostgreSQL queries.',
      achievements: ['Decreased API latency by 45%', 'Mentored 4 junior engineers', 'Designed visual bento components'],
    },
    {
      title: 'Full Stack Developer',
      subtitle: 'Zenith Tech Systems',
      duration: '2021 - 2023',
      description: 'Built collaborative real-time Kanban platforms. Structured MongoDB pipeline aggregation scripts to populate client statistics dashboards.',
      achievements: ['Integrated Socket.io workflows', 'Configured secure cookie sessions', 'Deployed AWS S3 assets storage'],
    },
    {
      title: 'Frontend Engineer',
      subtitle: 'ByteCloud Co.',
      duration: '2019 - 2021',
      description: 'Created pixel-perfect landing interfaces. Utilized Tailwind CSS frameworks and Framer Motion micro-animations to increase lead conversion rates.',
      achievements: ['Increased page SEO speed scoring to 98', 'Created reusable UI components systems'],
    }
  ];

  const education: TimelineItem[] = [
    {
      title: 'Diploma in Computer Science',
      subtitle: 'Global Institute Of Science and Technology,Dinajpur',
      duration: '2023 - 2024',
      description: 'Specialization in Software Engineering and Database Design. This Diploma program provided me with a strong foundation in computer science principles and software engineering practices.',
    },
    {
      title: 'MERN Stack Web Development',
      subtitle: 'Programming Hero',
      duration: '2026 Batch-13',
      description: 'This is a 06-month intensive program on JavaScript and modern web development. It covers the fundamentals of programming, data structures, algorithms, and advanced JavaScript concepts, as well as modern web development tools and frameworks.',
    }
  ];

  const certifications = [
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025' },
    { name: ' MongoDB Certified Developer Associate', issuer: 'MongoDB Inc', date: '2024' },
    { name: 'Certified Scrum Developer', issuer: 'Scrum Alliance', date: '2022' },
  ];

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      <div className="glow-spot bg-blue-600 top-1/2 left-1/4" />
      <div className="glow-spot bg-emerald-600 bottom-1/4 right-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Timeline"
          title="Education & Experience"
          subtitle="A summary of my professional milestones, academic achievements, and cloud credentials."
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Experience Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Work Experience</h3>
            </div>

            <motion.div
              variants={staggerContainer(0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="relative pl-6 border-l-2 border-slate-200 dark:border-white/10 flex flex-col gap-8"
            >
              {experiences.map((item, idx) => (
                <motion.div key={idx} variants={fadeIn('up', 0.5)} className="relative">
                  {/* Timeline Indicator Ring */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-50 dark:bg-gray-950 border-2 border-blue-500 z-10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </span>

                  <GlassCard className="p-6 border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-gray-950/10">
                    <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.subtitle}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{item.description}</p>
                    
                    {item.achievements && (
                      <ul className="list-disc pl-4 space-y-1">
                        {item.achievements.map((ach, aIdx) => (
                          <li key={aIdx} className="text-xs text-slate-500 dark:text-slate-400">{ach}</li>
                        ))}
                      </ul>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Education & Certs Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Education & Certifications</h3>
            </div>

            <motion.div
              variants={staggerContainer(0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="relative pl-6 border-l-2 border-slate-200 dark:border-white/10 flex flex-col gap-8 mb-8"
            >
              {education.map((item, idx) => (
                <motion.div key={idx} variants={fadeIn('up', 0.5)} className="relative">
                  {/* Timeline Indicator Ring */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-50 dark:bg-gray-950 border-2 border-emerald-500 z-10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </span>

                  <GlassCard className="p-6 border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-gray-950/10">
                    <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.subtitle}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Certifications Widgets */}
            <div className="flex items-center gap-3 mb-6 mt-12">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Credentials</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, idx) => (
                <GlassCard key={idx} className="p-4 flex gap-3 items-center border-slate-200 dark:border-white/5">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{cert.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{cert.issuer} • {cert.date}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Experience;
