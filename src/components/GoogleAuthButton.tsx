'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { signIn, useSession } from '../lib/auth-client';
import { isAdminEmail } from '../lib/admin';

interface GoogleAuthButtonProps {
  mode: 'signin' | 'signup';
  callbackURL?: string;
}

export const GoogleAuthButton = ({ mode, callbackURL = '/dashboard' }: GoogleAuthButtonProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.data?.user) {
      const targetUrl = isAdminEmail(session.data.user.email) ? '/admin' : callbackURL;
      router.push(targetUrl);
    }
  }, [session.data?.user, callbackURL, router]);

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const adminCallbackURL = '/admin';
      const defaultCallbackURL = callbackURL;
      
      await signIn.social({
        provider: 'google',
        callbackURL: defaultCallbackURL,
        errorCallbackURL: mode === 'signin' ? '/login' : '/register',
        newUserCallbackURL: defaultCallbackURL,
      });
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Google authentication could not be started.');
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={loading}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/10 disabled:pointer-events-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
        </svg>
      )}
      {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
    </button>
  );
};
