'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface ForgotPasswordFormInputs {
  email: string;
}

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      setSubmitting(true);
      const res = await forgotPassword(data.email);
      if (res.success) {
        setSent(true);
        toast.success('Password reset link sent to your email!');
      } else {
        toast.error(res.message || 'Failed to request password reset.');
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
      <main className="min-h-screen flex items-center justify-center pt-24 pb-12 relative overflow-hidden bg-slate-50 dark:bg-gray-950">
        <div className="glow-spot bg-blue-600/10 top-1/4 left-1/4" />
        <div className="glow-spot bg-emerald-600/10 bottom-1/4 right-1/4" />

        <div className="w-full max-w-md px-4 relative z-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>

          <GlassCard className="p-8 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-gray-950/20 backdrop-blur-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Forgot Password
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {sent
                  ? 'We have sent password recovery instructions to your email.'
                  : 'Enter your email address to receive a secure recovery link.'}
              </p>
            </div>

            {sent ? (
              <div className="flex flex-col gap-4 text-center">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  Check your spam/junk folder if you don't receive it within a few minutes.
                </div>
                <Button onClick={() => setSent(false)} variant="secondary" className="w-full">
                  Resend Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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

                {/* Submit */}
                <Button type="submit" disabled={submitting} className="w-full mt-2 gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reset Instructions
                    </>
                  )}
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  );
}
