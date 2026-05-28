'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download, Eye, X } from 'lucide-react';
import { fadeIn } from '../animations';
import { Button } from '../components/Button';
import api from '../services/api';

const GithubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface ConfigData {
  resumeUrl?: string;
  avatarUrl?: string;
  heroTitle?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export default function Hero() {
  const [config, setConfig] = useState<ConfigData>({});
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/config');
        if (res.data?.success && res.data?.data && res.data.data.length > 0) {
          // Look for configurations
          const cfg = res.data.data.find((c: any) => c.category === 'HeroSettings' || c.key === 'hero');
          if (cfg) {
            setConfig(cfg);
          }
        }
      } catch (err) {
        console.warn('Could not load hero config:', err);
      }
    };
    fetchConfig();
  }, []);

  const resumeLink = config.resumeUrl || '/resume.pdf';
  const displayTitle = config.heroTitle || 'Building Premium';
  const avatarLink = config.avatarUrl || 'https://i.ibb.co.com/cX8qjH0V/a588e708-c5fe-4072-a5a7-5dc79c9cef8a.jpg';
  const githubLink = config.githubUrl || 'https://github.com/masudrana';
  const linkedinLink = config.linkedinUrl || 'https://linkedin.com/in/masudrana';
  const twitterLink = config.twitterUrl || 'https://twitter.com/masudrana';

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background glow spots with reduced intensity shadow */}
      <div className="glow-spot bg-blue-600/5 dark:bg-blue-600/10 top-0 left-1/4" />
      <div className="glow-spot bg-emerald-600/5 dark:bg-emerald-600/10 bottom-0 right-1/4 animate-pulse-slow" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Smooth floating background elements */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-gradient-to-tr from-sky-400/10 to-blue-500/10 rounded-full filter blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-gradient-to-tr from-emerald-400/10 to-teal-500/10 rounded-full filter blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            <motion.div
              variants={fadeIn('down', 0.5)}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-500 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider">Available for new opportunities</span>
            </motion.div>

            <motion.h1
              variants={fadeIn('up', 0.6)}
              initial="hidden"
              animate="show"
              className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-xl lg:max-w-none"
            >
              {displayTitle}{' '}
              <span className="block bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                SaaS Platforms &amp; APIs
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn('up', 0.7)}
              initial="hidden"
              animate="show"
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed"
            >
              Hi, I am <span className="font-semibold text-slate-900 dark:text-white">Masud Rana</span>. A Full-stack Engineer specializing in high-performance cloud APIs, Next.js dashboard interfaces, and interactive Web3 systems.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeIn('up', 0.8)}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-4 justify-center lg:justify-start items-center mb-8"
            >
              <a href="#contact">
                <Button variant="primary" size="lg" className="gap-2 font-bold shadow-xl">
                  Get In Touch
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <div className="flex gap-2">
                <Button variant="secondary" size="lg" className="gap-2 font-bold" onClick={() => setShowResumeModal(true)}>
                  <Eye className="w-5 h-5" />
                  View Resume
                </Button>
                {/* <a href={resumeLink} download="Masud_Rana_Resume.pdf">
                  <Button variant="secondary" size="lg" className="p-3">
                    <Download className="w-5 h-5" />
                  </Button>
                </a> */}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={fadeIn('up', 0.9)}
              initial="hidden"
              animate="show"
              className="flex items-center justify-center lg:justify-start gap-4"
            >
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-all hover:scale-105"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-all hover:scale-105"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a
                href={twitterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-all hover:scale-105"
                aria-label="Twitter / X"
              >
                <TwitterXIcon />
              </a>
            </motion.div>
          </div>

          {/* Visual Avatar Card Grid (Right side) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-80 h-80 sm:w-[380px] sm:h-[380px] rounded-3xl overflow-hidden glass-card p-2 border-slate-200 dark:border-white/10 shadow-2xl flex items-center justify-center transition-all hover:border-sky-500/30"
            >
              <div className="w-full h-full bg-slate-900/10 dark:bg-slate-950/50 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                <Image
                  src={avatarLink}
                  alt="Masud Rana"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Micro Animated floating badge */}
                <div className="absolute top-6 left-6 p-3 rounded-xl glass-card text-center border-slate-200 dark:border-white/15 shadow-lg select-none backdrop-blur-md">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">1+</span>
                  <p className="text-[10px] text-slate-400 text-gray-600 font-medium">Years Experience</p>
                </div>
                <div className="absolute bottom-6 right-6 p-3 rounded-xl glass-card text-center border-slate-200 dark:border-white/15 shadow-lg select-none backdrop-blur-md">
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">05+</span>
                  <p className="text-[10px] text-slate-400 text-gray-600 font-medium">Projects Done</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Resume Modal Viewer */}
      <AnimatePresence>
        {showResumeModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col overflow-hidden relative"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950">
                <h3 className="text-base font-bold text-white">Curriculum Vitae</h3>
                <div className="flex items-center gap-3">
                  <a href={resumeLink} download="Masud_Rana_Resume.pdf">
                    <Button variant="primary" size="sm" className="gap-1.5 py-1.5 font-bold">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </a>
                  <button
                    onClick={() => setShowResumeModal(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white relative">
                <iframe
                  src={resumeLink}
                  className="w-full h-full border-none"
                  title="Masud Rana Resume"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
