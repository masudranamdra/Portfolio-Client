'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CalendarDays, Image as ImageIcon, Mail, Shield, User, Video } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAdmin) router.replace('/admin');
  }, [isAdmin, loading, router]);

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-sky-500">Account</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Dashboard</h1>
          </div>

          <GlassCard className="p-6 md:p-8">
            {loading ? (
              <p className="text-slate-500 dark:text-slate-400">Loading profile...</p>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
                <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white/60 p-6 text-center dark:border-white/10 dark:bg-white/5">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-sky-500/20" />
                  ) : (
                    <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blue-600 via-sky-500 to-emerald-500 text-3xl font-black text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">{user?.name}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Name', value: user?.name, icon: User },
                    { label: 'Email', value: user?.email, icon: Mail },
                    { label: 'Account Type', value: isAdmin ? 'Administrator' : 'User', icon: Shield },
                    { label: 'Joined Date', value: joined, icon: CalendarDays },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                      <item.icon className="h-5 w-5 text-sky-500" />
                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                      <p className="mt-1 break-words font-semibold text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href="/gallery/images">
              <Button variant="secondary" fullWidth className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Gallery
              </Button>
            </Link>
            <Link href="/gallery/videos">
              <Button variant="secondary" fullWidth className="gap-2">
                <Video className="h-4 w-4" />
                Video Gallery
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button fullWidth className="gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
