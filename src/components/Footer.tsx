'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Heart } from 'lucide-react';

// Custom SVG icons for social links (brand icons removed from lucide-react v1.x)
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

const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/masudrana' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://linkedin.com/in/masudrana' },
    { name: 'Twitter', icon: TwitterIcon, url: 'https://twitter.com/masudrana' },
    { name: 'Email', icon: Mail, url: 'mailto:masud@rana.com' },
  ];

  const quickLinks = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
    { name: 'Blog', url: '/blog' },
    { name: 'Image Gallery', url: '/gallery/images' },
    { name: 'Video Gallery', url: '/gallery/videos' },
  ];

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-gray-950/50 backdrop-blur-md py-12 overflow-hidden">
      {/* Subtle Glows */}
      <div className="glow-spot bg-blue-500 -bottom-48 -left-48" />
      <div className="glow-spot bg-emerald-500 -bottom-48 -right-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 bg-clip-text text-transparent mb-4 inline-block">
              Masud Rana
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-2">
              Building premium digital experiences, SaaS platforms, and scaling serverless architectures with state-of-the-art designs.
            </p>
          </div>

          {/* Shortcuts */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Connect */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Connect With Me
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-all focus:outline-none"
                    aria-label={link.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              Available for consulting, speaking, and contract work.
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-white/10 my-6" />

        {/* Copy Area */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} Masud Rana. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> using Next.js & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
