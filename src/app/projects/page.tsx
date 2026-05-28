'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowLeft, Layers } from 'lucide-react';
import Link from 'next/link';
import { SectionHeader } from '../../components/SectionHeader';
import { SkeletonGrid } from '../../components/LoadingSkeleton';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  githubLink: string;
  liveLink: string;
  image: string;
  category: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    _id: 'p1',
    title: 'NovaSaaS - Enterprise AI Dashboard',
    description: 'A premium SaaS dashboard featuring real-time AI usage statistics, predictive model metrics, and team collaboration controls.',
    tags: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'TailwindCSS'],
    githubLink: 'https://github.com/masudrana/novasaas',
    liveLink: 'https://novasaas.demo.com',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    category: 'Fullstack',
  },
  {
    _id: 'p2',
    title: 'AuraPay - Crypto Wallet Extension',
    description: 'A Web3 wallet Chrome extension enabling seamless gasless transactions, instant token swapping, and NFT portfolio management.',
    tags: ['React', 'Solidity', 'Ethers.js', 'TailwindCSS'],
    githubLink: 'https://github.com/masudrana/aurapay',
    liveLink: 'https://aurapay.demo.com',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80',
    category: 'Frontend',
  },
  {
    _id: 'p3',
    title: 'Zenith - Collaborative Project Workspace',
    description: 'Real-time collaborative task planner with Kanban boards, whiteboard drafting, integrated chat room, and file attachment sharing.',
    tags: ['React', 'Express.js', 'Socket.io', 'Mongoose', 'TailwindCSS'],
    githubLink: 'https://github.com/masudrana/zenith',
    liveLink: 'https://zenith.demo.com',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    category: 'Fullstack',
  },
  {
    _id: 'p4',
    title: 'Apex - Performance Analytics SDK',
    description: 'A lightweight npm library for tracking Core Web Vitals, user behaviors, and custom telemetry with sub-millisecond overhead.',
    tags: ['TypeScript', 'Rollup', 'Jest', 'Web Vitals'],
    githubLink: 'https://github.com/masudrana/apex-sdk',
    liveLink: 'https://npmjs.com/package/apex-sdk',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    category: 'Tools',
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        if (res.data && res.data.success && res.data.data.length > 0) {
          setProjects(res.data.data);
        } else {
          setProjects(MOCK_PROJECTS);
        }
      } catch (err) {
        console.warn('API error, using mock projects:', err);
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase()));
    }
  }, [activeCategory, projects]);

  const categories = ['All', 'Fullstack', 'Frontend', 'Backend', 'Tools', 'Deployment'];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 relative overflow-hidden">
        {/* Glow Background */}
        <div className="glow-spot bg-blue-600 top-1/4 left-1/4" />
        <div className="glow-spot bg-emerald-600 bottom-1/4 right-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <SectionHeader
            badge="Showcase"
            title="Projects Catalog"
            subtitle="A complete collection of production-grade full-stack products, web systems, and tools."
          />

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2.5 mb-10 pb-4 border-b border-slate-200 dark:border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeCategory === cat
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : 'bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-transparent dark:border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonGrid count={4} cols={3} />
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((project) => (
                  <motion.div
                    layout
                    key={project._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative flex flex-col justify-between h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-gray-950/20 backdrop-blur-lg hover:border-sky-500/30 transition-all duration-300"
                  >
                    {/* Project Image */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60" />
                      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-sky-400/20">
                        <Layers className="w-3 h-3" />
                        {project.category}
                      </span>
                    </div>

                    {/* Project Info */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <Link href={`/projects/${project._id}`} className="block group/title">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover/title:text-sky-500 transition-colors">
                          {project.title}
                        </h3>
                      </Link>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-white/5">
                          <Link
                            href={`/projects/${project._id}`}
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors"
                          >
                            View Project
                          </Link>
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors"
                            >
                              
                              Code
                            </a>
                          )}
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-semibold text-sky-500 hover:brightness-110 transition-colors ml-auto"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
