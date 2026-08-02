'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, signupUser } from '@/lib/api';

interface User {
  name: string;
  email: string;
  role: 'job_seeker' | 'recruiter';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('rp_token');
    const storedUser = localStorage.getItem('rp_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('rp_token');
        localStorage.removeItem('rp_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    localStorage.setItem('rp_token', res.access_token);
    const userData: User = { name: res.name, email, role: res.role as any };
    localStorage.setItem('rp_user', JSON.stringify(userData));
    setToken(res.access_token);
    setUser(userData);
    
    // Redirect based on role
    if (res.role === 'recruiter') {
      router.push('/rank');
    } else {
      router.push('/');
    }
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    await signupUser(name, email, password, role);
    // Automatically log in after sign up
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('rp_token');
    localStorage.removeItem('rp_user');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
