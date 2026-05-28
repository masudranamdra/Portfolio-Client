'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Lock, Mail, User, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { GoogleAuthButton } from '../../components/GoogleAuthButton';

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const { register: registerUser, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, router]);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setSubmitting(true);
      const res = await registerUser(data.username, data.email, data.password);
      if (res.success) {
        toast.success('Registration successful!');
        // Router redirect handled by useEffect
      } else {
        toast.error(res.message || 'Registration failed.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-24 pb-12 relative overflow-hidden">
        <div className="glow-spot bg-blue-600 top-1/4 left-1/4" />
        <div className="glow-spot bg-emerald-600 bottom-1/4 right-1/4" />

        <div className="w-full max-w-md px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <GlassCard className="p-8 border-slate-200 dark:border-white/5 bg-white/5 dark:bg-gray-950/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Create Account
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Register to download assets and view media galleries.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Username Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Masud Rana"
                    {...register('username', { required: 'Username is required' })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-sm"
                  />
                </div>
                {errors.username && (
                  <span className="text-[10px] font-semibold text-red-500 mt-1">{errors.username.message}</span>
                )}
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="masud@rana.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-sm"
                  />
                </div>
                {errors.email && (
                  <span className="text-[10px] font-semibold text-red-500 mt-1">{errors.email.message}</span>
                )}
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-sm"
                  />
                </div>
                {errors.password && (
                  <span className="text-[10px] font-semibold text-red-500 mt-1">{errors.password.message}</span>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" disabled={submitting} className="w-full mt-2 gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            <GoogleAuthButton mode="signup" callbackURL="/dashboard" />

            <div className="text-center mt-6">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-sky-500 hover:brightness-110">
                  Sign in here
                </Link>
              </p>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  );
}
