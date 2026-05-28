'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, Layers, X, Code, Eye } from 'lucide-react';
import { fadeIn, staggerContainer } from '../animations';
import { GlassCard } from '../components/GlassCard';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';
import { SkeletonGrid } from '../components/LoadingSkeleton';
import api from '../services/api';

const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

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
    _id: 'mock-1',
    title: 'NovaSaaS - Enterprise AI Dashboard',
    description: 'A premium SaaS dashboard featuring real-time AI usage statistics, predictive model metrics, and team collaboration controls.',
    tags: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'TailwindCSS'],
    githubLink: 'https://github.com/masudrana/novasaas',
    liveLink: 'https://novasaas.demo.com',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    category: 'Fullstack',
  },
  {
    _id: 'mock-2',
    title: 'AuraPay - Crypto Wallet Extension',
    description: 'A Web3 wallet Chrome extension enabling seamless gasless transactions, instant token swapping, and NFT portfolio management.',
    tags: ['React', 'Solidity', 'Ethers.js', 'TailwindCSS'],
    githubLink: 'https://github.com/masudrana/aurapay',
    liveLink: 'https://aurapay.demo.com',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80',
    category: 'Frontend',
  },
  {
    _id: 'mock-3',
    title: 'Zenith - Collaborative Project Workspace',
    description: 'Real-time collaborative task planner with Kanban boards, whiteboard drafting, integrated chat room, and file attachment sharing.',
    tags: ['React', 'Express.js', 'Socket.io', 'Mongoose', 'TailwindCSS'],
    githubLink: 'https://github.com/masudrana/zenith',
    liveLink: 'https://zenith.demo.com',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    category: 'Fullstack',
  }
];

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects?featured=true');
        if (res.data && res.data.success && res.data.data.length > 0) {
          setProjects(res.data.data.slice(0, 3));
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

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="glow-spot bg-blue-600/5 dark:bg-blue-600/10 top-1/4 left-1/4" />
      <div className="glow-spot bg-emerald-600/5 dark:bg-emerald-600/10 bottom-1/4 right-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <SectionHeader
            badge="Portfolio"
            title="Featured Works"
            subtitle="Explore some of my latest enterprise projects, tool SDKs, and design components."
          />
          <Link href="/projects">
            <Button variant="secondary" className="gap-2 shrink-0">
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={3} cols={3} />
        ) : (
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div
                key={project._id}
                variants={fadeIn('up', 0.5)}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setSelectedProject(project)}
                className="group relative flex flex-col justify-between h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-gray-950/20 backdrop-blur-lg hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 cursor-pointer"
              >
                {/* Project Image */}
                <div className="h-48 overflow-hidden relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-sky-400/20">
                    <Layers className="w-3 h-3" />
                    {project.category}
                  </span>
                </div>

                {/* Project Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-500 transition-colors">
                      {project.title}
                    </h3>
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

                    {/* Action trigger */}
                    <div className="flex items-center text-xs font-semibold text-sky-500 group-hover:gap-1.5 transition-all pt-4 border-t border-slate-200 dark:border-white/5">
                      <Eye className="w-4 h-4 mr-1.5" />
                      View Details & Demo
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Details Popup Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 text-white p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-slate-950/80 px-2.5 py-1 rounded-full border border-sky-400/20 mb-2">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{selectedProject.title}</h3>
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Overview</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stack / Technologies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-white/5">
                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="secondary" fullWidth className="gap-2 font-bold py-2.5">
                        <Code className="w-4 h-4" />
                        Github Repository
                      </Button>
                    </a>
                  )}
                  {selectedProject.liveLink && (
                    <a
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="primary" fullWidth className="gap-2 font-bold py-2.5">
                        <ExternalLink className="w-4 h-4" />
                        Launch Live Demo
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
