'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Button } from '../../../components/Button';
import api from '../../../services/api';
import { SkeletonCard } from '../../../components/LoadingSkeleton';

// Custom SVG icon for GitHub
const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  githubLink: string;
  liveLink: string;
  image: string;
  category: string;
  startDate?: string;
  endDate?: string;
  team?: number;
}

const MOCK_PROJECTS: Record<string, Project> = {
  'p1': {
    _id: 'p1',
    title: 'NovaSaaS - Enterprise AI Dashboard',
    description: 'A premium SaaS dashboard featuring real-time AI usage statistics, predictive model metrics, and team collaboration controls.',
    longDescription: 'NovaSaaS is a comprehensive enterprise-grade SaaS platform designed for AI teams and enterprises. It features real-time analytics, predictive model monitoring, team collaboration tools, billing management, and advanced integrations. Built with cutting-edge technologies and optimized for scale, it handles millions of requests daily with sub-100ms latency.',
    tags: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'TailwindCSS', 'Framer Motion', 'Socket.io'],
    githubLink: 'https://github.com/masudrana/novasaas',
    liveLink: 'https://novasaas.demo.com',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    category: 'Fullstack',
    startDate: 'Jan 2024',
    endDate: 'Present',
    team: 8,
  },
  'p2': {
    _id: 'p2',
    title: 'AuraPay - Crypto Wallet Extension',
    description: 'A Web3 wallet Chrome extension enabling seamless gasless transactions, instant token swapping, and NFT portfolio management.',
    longDescription: 'AuraPay revolutionizes Web3 interactions with a powerful browser extension that brings secure, intuitive crypto management to everyday users. Features include gasless transactions, 1-click token swaps, NFT gallery, portfolio tracking, and integration with major DeFi protocols.',
    tags: ['React', 'Solidity', 'Ethers.js', 'TailwindCSS', 'Web3', 'Smart Contracts'],
    githubLink: 'https://github.com/masudrana/aurapay',
    liveLink: 'https://aurapay.demo.com',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=80',
    category: 'Frontend',
    startDate: 'Nov 2023',
    endDate: 'Mar 2024',
    team: 4,
  },
  'p3': {
    _id: 'p3',
    title: 'Zenith - Collaborative Project Workspace',
    description: 'Real-time collaborative task planner with Kanban boards, whiteboard drafting, integrated chat room, and file attachment sharing.',
    longDescription: 'Zenith is a powerful project management suite designed for distributed teams. It combines Kanban boards, real-time collaboration, video chat, whiteboarding, and file sharing in a single platform. Built with WebSockets for real-time sync and optimized for both desktop and mobile.',
    tags: ['React', 'Express.js', 'Socket.io', 'Mongoose', 'TailwindCSS', 'Redis'],
    githubLink: 'https://github.com/masudrana/zenith',
    liveLink: 'https://zenith.demo.com',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: 'Fullstack',
    startDate: 'Aug 2023',
    endDate: 'Dec 2023',
    team: 6,
  },
  'p4': {
    _id: 'p4',
    title: 'Apex - Performance Analytics SDK',
    description: 'A lightweight npm library for tracking Core Web Vitals, user behaviors, and custom telemetry with sub-millisecond overhead.',
    longDescription: 'Apex is a production-ready npm package for comprehensive web performance monitoring. It automatically tracks Core Web Vitals, custom events, and user interactions with minimal overhead. Used by 500+ companies tracking billions of metrics.',
    tags: ['TypeScript', 'Rollup', 'Jest', 'Web Vitals', 'Performance'],
    githubLink: 'https://github.com/masudrana/apex-sdk',
    liveLink: 'https://npmjs.com/package/apex-sdk',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    category: 'Tools',
    startDate: 'May 2023',
    endDate: 'Aug 2023',
    team: 2,
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        if (res.data?.success && res.data?.data) {
          setProject(res.data.data);
        } else {
          setProject(MOCK_PROJECTS[id] || MOCK_PROJECTS['p1']);
        }
      } catch (err) {
        console.warn('Failed to fetch project:', err);
        setProject(MOCK_PROJECTS[id] || MOCK_PROJECTS['p1']);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <SkeletonCard />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <Link href="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 relative overflow-hidden">
        <div className="glow-spot bg-blue-600 top-1/4 left-1/4" />
        <div className="glow-spot bg-emerald-600 bottom-1/4 right-1/4" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Link>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
              <motion.img
                src={project.image}
                alt={project.title}
                className="w-full h-96 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
                  {project.category}
                </span>
              </div>

              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {project.title}
              </h1>

              <p className="text-lg text-slate-400">{project.description}</p>
            </div>
          </motion.div>

          {/* Project Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {project.startDate && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-semibold text-slate-400">Duration</span>
                </div>
                <p className="text-sm text-white">{project.startDate} - {project.endDate}</p>
              </div>
            )}

            {project.team && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-semibold text-slate-400">Team Size</span>
                </div>
                <p className="text-sm text-white">{project.team} developers</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <GithubIcon />
                <span className="text-sm font-semibold text-slate-400">Repository</span>
              </div>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sky-400 hover:text-sky-300 break-all"
              >
                View on GitHub
              </a>
            </div>
          </motion.div>

          {/* Full Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-invert max-w-none mb-12"
          >
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {project.longDescription || project.description}
            </p>
          </motion.div>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Technologies Used</h2>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border border-sky-500/20 text-sky-300 text-sm font-semibold hover:border-sky-500/40 transition-colors"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Demo
              </Button>
            </a>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="secondary" className="w-full">
                <GithubIcon />
                <span className="ml-2">View Source Code</span>
              </Button>
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
