'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authClient, signIn, signOut, signUp, useSession } from '../lib/auth-client';
import { isAdminEmail } from '../lib/admin';

export function normalizeEmail(email: string): string {
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return email.trim().toLowerCase();
  let [local, domain] = parts;
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.split('+')[0].replace(/\./g, '');
    domain = 'gmail.com';
  }
  return `${local}@${domain}`;
}

interface User {
  _id?: string;
  id: string;
  username: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: Date | string;
  role: 'admin' | 'user';
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  checkAuthSession: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (password: string, token: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthSession = async () => {
    await session.refetch();
  };

  useEffect(() => {
    const authUser = session.data?.user;
    if (!authUser) {
      setUser(null);
      setLoading(session.isPending);
      return;
    }

    setUser({
      id: authUser.id,
      _id: authUser.id,
      username: authUser.name || authUser.email.split('@')[0],
      name: authUser.name || authUser.email.split('@')[0],
      email: authUser.email,
      image: authUser.image,
      createdAt: authUser.createdAt,
      role: isAdminEmail(authUser.email) ? 'admin' : 'user',
    });
    setLoading(false);
  }, [session.data, session.isPending]);

  const login = async (email: string, password: string) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const res = await signIn.email({ email: normalizedEmail, password });
      if (!res.error) {
        await session.refetch();
        return { success: true };
      }
      return { success: false, message: res.error.message || 'Invalid email or password' };
    } catch (error: any) {
      const msg = error?.message || 'Invalid email or password';
      return { success: false, message: msg };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const res = await signUp.email({
        name: username,
        email: normalizedEmail,
        password,
      });

      if (!res.error) {
        await session.refetch();
        return { success: true };
      }

      const message = res.error.message?.toLowerCase().includes('already')
        ? 'An account with this email already exists.'
        : res.error.message || 'Please check your details and try again.';

      return { success: false, message };
    } catch (error: any) {
      const msg = error?.message || 'Email already exists or invalid details';
      return { success: false, message: msg };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const res = await authClient.requestPasswordReset({
        email: normalizedEmail,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (res.error) {
        return { success: false, message: res.error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Could not send verification email' };
    }
  };

  const resetPassword = async (password: string, token: string) => {
    try {
      const res = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (res.error) {
        return { success: false, message: res.error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Could not reset password' };
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout request error:', err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        checkAuthSession,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
export type { User };
