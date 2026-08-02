'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-black selection:text-white font-sans text-slate-900 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[1600px] bg-white border border-gray-100 shadow-[0_0_100px_rgba(0,0,0,0.02)] rounded-[2px] overflow-hidden flex flex-col min-h-[90vh]">
        <Header />

        <div className="flex-1 flex items-center justify-center py-12 px-6 lg:px-8 bg-gray-50/50">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-[4px] border border-gray-100 shadow-md">
            <div>
              <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-center text-xs text-gray-500 uppercase tracking-widest">
                Sign in to your account
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-[2px]">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-[2px] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-[2px] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-[10px] font-bold uppercase tracking-widest rounded-[2px] text-white bg-black hover:bg-zinc-800 focus:outline-none disabled:opacity-50 transition-all shadow-lg shadow-black/10"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>

              <div className="text-center text-xs text-gray-500 mt-4">
                Don't have an account?{' '}
                <Link href="/signup" className="font-bold text-black hover:underline">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
