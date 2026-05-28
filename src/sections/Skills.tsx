'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { fadeIn, staggerContainer } from '../animations';
import { SectionHeader } from '../components/SectionHeader';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import api from '../services/api';

interface Skill {
  _id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Deployment';
  percentage: number;
  icon: string;
  description?: string;
  projectsCount?: number;
}

const MOCK_SKILLS: Skill[] = [
  { _id: 's1', name: 'React / Next.js', category: 'Frontend', percentage: 95, icon: 'Layout', description: 'Advanced Server Components, Hydration optimizations, routing layouts, and incremental static builds.', projectsCount: 15 },
  { _id: 's2', name: 'TypeScript', category: 'Frontend', percentage: 90, icon: 'Code2', description: 'Strong static type definitions, utility assertions, and compile-time API safety layers.', projectsCount: 22 },
  { _id: 's3', name: 'Tailwind CSS', category: 'Frontend', percentage: 95, icon: 'Paintbrush', description: 'Curated custom design tokens, fluid spacing configs, and glassmorphic responsive viewports.', projectsCount: 30 },
  { _id: 's4', name: 'Framer Motion', category: 'Frontend', percentage: 85, icon: 'Activity', description: 'Smooth spring animations, exit transitions, ticker timelines, and layout identity syncs.', projectsCount: 8 },
  { _id: 's5', name: 'Node.js / Express', category: 'Backend', percentage: 92, icon: 'Server', description: 'Scalable REST APIs, robust authentication middleware, and secure cookie storage sessions.', projectsCount: 18 },
  { _id: 's6', name: 'Socket.io', category: 'Backend', percentage: 80, icon: 'Zap', description: 'Real-time WebSocket event pipelines, room connections, and multi-user dynamic updates.', projectsCount: 6 },
  { _id: 's7', name: 'MongoDB / Mongoose', category: 'Database', percentage: 90, icon: 'Database', description: 'Schema aggregate optimization pipelines, compound indexes, and high-performance collection filters.', projectsCount: 12 },
  { _id: 's8', name: 'PostgreSQL / Prisma', category: 'Database', percentage: 82, icon: 'HardDrive', description: 'Relational data normalized structures, connection pooling, and advanced query optimizations.', projectsCount: 9 },
  { _id: 's9', name: 'Git & GitHub', category: 'Tools', percentage: 90, icon: 'GitBranch', description: 'Continuous integration actions, feature branching, release workflows, and hooks configs.', projectsCount: 40 },
  { _id: 's10', name: 'Docker Containers', category: 'Tools', percentage: 80, icon: 'Box', description: 'Local dev isolated setups, multi-stage production deployment builds, and image management.', projectsCount: 5 },
  { _id: 's11', name: 'Vercel / Netlify', category: 'Deployment', percentage: 95, icon: 'Globe', description: 'Serverless functions edge deployments, preview branch links, and cache invalidation strategies.', projectsCount: 25 },
  { _id: 's12', name: 'AWS (S3/EC2)', category: 'Deployment', percentage: 78, icon: 'Cloud', description: 'Static assets CDN storage distributions, virtual machine instances, and load balancing rules.', projectsCount: 4 },
];

export const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills');
        if (res.data && res.data.success && res.data.data.length > 0) {
          setSkills(res.data.data);
        } else {
          setSkills(MOCK_SKILLS);
        }
      } catch (err) {
        console.warn('API error, using mock skills:', err);
        setSkills(MOCK_SKILLS);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories: Skill['category'][] = ['Frontend', 'Backend', 'Database', 'Tools', 'Deployment'];

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code;
    return <IconComponent className="w-5 h-5" />;
  };

  const getCategoryColor = (cat: Skill['category']) => {
    switch (cat) {
      case 'Frontend': return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
      case 'Backend': return 'text-purple-500 border-purple-500/20 bg-purple-500/5';
      case 'Database': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
      case 'Tools': return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
      case 'Deployment': return 'text-sky-500 border-sky-500/20 bg-sky-500/5';
    }
  };

  return (
    <section id="skills" className="py-20 relative overflow-hidden bg-slate-50/20 dark:bg-gray-950/10">
      <div className="glow-spot bg-blue-600/5 dark:bg-blue-600/10 top-1/4 right-1/4 animate-pulse-slow" />
      <div className="glow-spot bg-emerald-600/5 dark:bg-emerald-600/10 bottom-1/4 left-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Expertise"
          title="Skills & Tech Stack"
          subtitle="A comprehensive layout of technologies I work with daily to scale systems and build frontends."
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {categories.map((category) => {
            const filteredSkills = skills.filter((s) => s.category === category);
            if (filteredSkills.length === 0) return null;

            return (
              <GlassCard
                key={category}
                className="p-6 border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-gray-950/20 flex flex-col gap-6"
              >
                <div className={`flex items-center gap-2 px-3 py-1 rounded-xl w-fit border ${getCategoryColor(category)}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{category}</span>
                </div>

                <motion.div
                  variants={staggerContainer(0.08)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="flex flex-col gap-4"
                >
                  {filteredSkills.map((skill) => (
                    <motion.div
                      key={skill._id}
                      variants={fadeIn('up', 0.4)}
                      onClick={() => setSelectedSkill(skill)}
                      className="flex flex-col gap-1.5 cursor-pointer group"
                    >
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 group-hover:text-sky-500 transition-colors">
                          {renderIcon(skill.icon)}
                          <span className="font-semibold">{skill.name}</span>
                        </div>
                        <span className="font-bold text-slate-500 dark:text-slate-400">{skill.percentage}%</span>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full bg-gradient-to-r ${
                            category === 'Frontend'
                              ? 'from-blue-600 to-sky-400'
                              : category === 'Backend'
                              ? 'from-purple-600 to-pink-500'
                              : category === 'Database'
                              ? 'from-emerald-600 to-teal-400'
                              : category === 'Tools'
                              ? 'from-orange-600 to-yellow-500'
                              : 'from-sky-600 to-cyan-400'
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Skills Detail Modal Popup */}
      <AnimatePresence>
        {selectedSkill && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <LucideIcons.X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 mb-4">
                <div className={`p-3 rounded-xl border ${getCategoryColor(selectedSkill.category)}`}>
                  {renderIcon(selectedSkill.icon)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedSkill.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{selectedSkill.category}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase mb-1">
                    <span>Proficiency Level</span>
                    <span className="text-sky-500">{selectedSkill.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-sky-400"
                      style={{ width: `${selectedSkill.percentage}%` }}
                    />
                  </div>
                </div>

                {selectedSkill.description && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scope of work</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedSkill.description}
                    </p>
                  </div>
                )}

                {selectedSkill.projectsCount !== undefined && (
                  <div className="pt-2 flex justify-between items-center border-t border-slate-200 dark:border-white/5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Total Integrated Projects</span>
                    <span className="text-xs font-bold bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                      {selectedSkill.projectsCount} Projects
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;
