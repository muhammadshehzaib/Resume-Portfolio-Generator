'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPortfolioAnalytics } from '@/lib/api';
import { AnalyticsResponse } from '@/lib/types';

interface AnalyticsDashboardProps {
  portfolioId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyticsDashboard({ portfolioId, isOpen, onClose }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen, portfolioId]);

  async function loadAnalytics() {
    try {
      setLoading(true);
      const analytics = await getPortfolioAnalytics(portfolioId);
      setData(analytics);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  // Simple SVG Area Chart Generator
  const renderAreaChart = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return null;
    
    const width = 600;
    const height = 150;
    const maxY = Math.max(...points.map(p => p.y), 5); // Minimum height of 5 views
    
    // Scale points to SVG space
    const scaledPoints = points.map((p, i) => ({
      x: (i / (points.length - 1)) * width,
      y: height - (p.y / maxY) * height
    }));

    // Path string
    const d = `M ${scaledPoints[0].x} ${scaledPoints[0].y} ` + 
              scaledPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + 
              ` L ${width} ${height} L 0 ${height} Z`;

    const lineD = `M ${scaledPoints[0].x} ${scaledPoints[0].y} ` + 
                  scaledPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          initial={{ d: `M 0 ${height} L ${width} ${height} L ${width} ${height} L 0 ${height} Z` }}
          animate={{ d }}
          transition={{ duration: 1, ease: "easeOut" }}
          fill="url(#chartGradient)"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          d={lineD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Circles for points */}
        {scaledPoints.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 no-print">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/5 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-slate-50 dark:border-white/5">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Portfolio Analytics</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Track your global reach and engagement</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gathering Data...</p>
              </div>
            ) : error ? (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{error}</p>
              </div>
            ) : data && (
              <div className="space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Total Views</p>
                    <p className="text-5xl font-black text-blue-600 leading-none">{data.total_views}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Unique Visitors</p>
                    <p className="text-5xl font-black text-emerald-600 leading-none">{data.unique_visitors}</p>
                  </div>
                </div>

                {/* Chart Section */}
                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">7-Day Engagement Trend</h3>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Total Views</span>
                       </div>
                    </div>
                  </div>
                  <div className="h-[200px] w-full">
                    {renderAreaChart(data.time_series.map(t => ({ x: 0, y: t.views })))}
                  </div>
                  <div className="flex justify-between mt-4 px-2">
                    {data.time_series.map((t, i) => (
                      <span key={i} className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Geo Breakdown */}
                <div className="space-y-6">
                   <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">Geographic Origin</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.geographic_stats.length > 0 ? data.geographic_stats.map((stat, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-white/[0.02]">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-lg shadow-sm">
                                 {getFlagEmoji(stat.country)}
                              </div>
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{stat.country}</span>
                           </div>
                           <span className="text-sm font-black text-blue-500">{stat.count} views</span>
                        </div>
                      )) : (
                        <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl">
                           <p className="text-sm font-medium text-slate-400">No geographic data available yet.</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 text-center">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Updated in real-time &bull; Powered by Antigravity Analytics
             </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function getFlagEmoji(countryName: string) {
  // Simple subset of major flags or fallbacks
  const flags: Record<string, string> = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Pakistan': '🇵🇰',
    'India': '🇮🇳',
    'Canada': '🇨🇦',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Japan': '🇯🇵',
    'United Arab Emirates': '🇦🇪'
  };
  return flags[countryName] || '🌍';
}
