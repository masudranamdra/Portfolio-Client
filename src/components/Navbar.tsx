'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Image as ImageIcon, Video as VideoIcon, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showAuthExplanation, setShowAuthExplanation] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setIsOpen(false);
    setGalleryDropdownOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Articles', path: '/articles' },
    { name: 'Activities', path: '/#activities' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <div
          className={`glass-navbar rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between transition-all duration-300`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
              Masud Rana
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-medium hover:text-sky-500 transition-colors relative py-2 ${
                  pathname === item.path || (item.path.startsWith('/#') && pathname === '/')
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Gallery Dropdown (Free Data) */}
            <div className="relative">
              <button
                onClick={() => setGalleryDropdownOpen(!galleryDropdownOpen)}
                onBlur={() => setTimeout(() => setGalleryDropdownOpen(false), 200)}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors py-2 focus:outline-none"
              >
                Free Data
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${galleryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {galleryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl glass-card p-2 border border-slate-200 dark:border-white/10 shadow-xl"
                  >
                    <Link
                      href="/gallery/images"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                    >
                      <ImageIcon className="w-4 h-4 text-sky-500" />
                      Image Gallery
                    </Link>
                    <Link
                      href="/gallery/videos"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                    >
                      <VideoIcon className="w-4 h-4 text-emerald-500" />
                      Video Gallery
                    </Link>
                    <Link
                      href="/gallery/documents"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                    >
                      <FileText className="w-4 h-4 text-amber-500" />
                      Document Gallery
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Area */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />

            {/* Auth CTAs */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors focus:outline-none"
                >
                  <User className="w-4 h-4 text-sky-500" />
                  <span className="text-sm font-medium">{user?.username}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl glass-card p-2 border border-slate-200 dark:border-white/10 shadow-xl"
                    >
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4 text-sky-500" />
                          Admin Panel
                        </Link>
                      )}
                      {!isAdmin && (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm" onClick={() => setShowAuthExplanation(true)}>
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Menu Toggler */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-down Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mx-4 sm:mx-8 mt-2 rounded-2xl glass-card border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-40 relative"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-base font-semibold py-2 px-3 rounded-xl transition-all ${
                    pathname === item.path
                      ? 'bg-sky-500/10 text-sky-500'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">
                Free Galleries
              </span>
              <Link
                href="/gallery/images"
                className="flex items-center gap-2 text-base font-semibold py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
              >
                <ImageIcon className="w-5 h-5 text-sky-500" />
                Image Gallery
              </Link>
              <Link
                href="/gallery/videos"
                className="flex items-center gap-2 text-base font-semibold py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
              >
                <VideoIcon className="w-5 h-5 text-emerald-500" />
                Video Gallery
              </Link>
              <Link
                href="/gallery/documents"
                className="flex items-center gap-2 text-base font-semibold py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
              >
                <FileText className="w-5 h-5 text-amber-500" />
                Document Gallery
              </Link>

              <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />

              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div className="px-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-sky-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {user?.username}
                    </span>
                  </div>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="secondary" fullWidth size="sm">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="danger" fullWidth size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="primary" fullWidth size="sm" onClick={() => { setIsOpen(false); setShowAuthExplanation(true); }}>
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Get Started Modal with Login Explanation */}
      <AnimatePresence>
        {showAuthExplanation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden"
            >
              <button
                onClick={() => setShowAuthExplanation(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6 pt-4">
                <div className="inline-flex p-3 rounded-full bg-sky-500/10 text-sky-500 mb-4">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Why Join the System?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Creating an account enables safe and high-performance access to private developer content, downloadable assets, and premium media galleries.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/register" onClick={() => setShowAuthExplanation(false)} className="w-full">
                  <Button variant="primary" fullWidth className="py-2.5 font-bold">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setShowAuthExplanation(false)} className="w-full">
                  <Button variant="secondary" fullWidth className="py-2.5 font-bold">
                    Sign In to Existing Profile
                  </Button>
                </Link>
              </div>

              <div className="mt-6 text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Secure OAuth 2.0 Integration
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;
