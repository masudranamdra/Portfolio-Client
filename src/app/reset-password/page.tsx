'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Lock, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';


interface ResetPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

function ResetPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();

  const newPassword = watch('password');

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    if (!token) {
      toast.error('Invalid or missing password reset token.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await resetPassword(data.password, token);
      if (res.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        toast.error(res.message || 'Failed to reset password.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassCard className="p-8 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-gray-950/20 backdrop-blur-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Reset Password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {success
            ? 'Your password has been changed. Redirecting to login...'
            : 'Please choose a secure new password.'}
        </p>
      </div>

      {success ? (
        <div className="flex flex-col items-center gap-4 py-6">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
          <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
            Redirecting in a few seconds...
          </p>
        </div>
      ) : !token ? (
        <div className="text-center py-6 text-red-500 font-semibold text-sm">
          No reset token found in URL. Please request a new password reset link.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              New Password
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

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === newPassword || 'Passwords do not match',
                })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-sm"
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-[10px] font-semibold text-red-500 mt-1">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={submitting} className="w-full mt-2 gap-2">
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      )}
    </GlassCard>
  );
}

export default function ResetPasswordPage() {
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

          <Suspense fallback={
            <div className="flex justify-center p-8 bg-white/50 rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
