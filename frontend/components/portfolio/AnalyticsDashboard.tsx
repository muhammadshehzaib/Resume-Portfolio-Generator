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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 no-print font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 flex flex-col text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 md:p-8 bg-slate-950 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Recruiter Intelligence
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Real-time Tracking
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                Advanced Analytics & Recruiter Feed
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling Recruiter Telemetry...</p>
              </div>
            ) : error ? (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <p className="text-rose-400 font-semibold">{error}</p>
              </div>
            ) : data && (
              <div className="space-y-8">
                {/* TOP CARDS: Engagement Score Gauge & Quick Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Recruiter Engagement Score */}
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-7xl text-indigo-400 select-none">
                      {data.recruiter_engagement_score}%
                    </div>
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 block mb-1">
                        Recruiter Engagement Score
                      </span>
                      <div className="text-4xl font-black text-white leading-none">
                        {data.recruiter_engagement_score}%
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        {data.recruiter_engagement_score >= 80
                          ? '🔥 High attraction lead score'
                          : data.recruiter_engagement_score >= 60
                          ? '⚡ Strong recruiter interest'
                          : '👀 Steady portfolio views'}
                      </p>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-4">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${data.recruiter_engagement_score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Total Views */}
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
                        Total Views
                      </span>
                      <div className="text-4xl font-black text-white leading-none">
                        {data.total_views}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center justify-between pt-4 border-t border-slate-800/80">
                      <span>Unique Visitors</span>
                      <span className="font-bold text-white">{data.unique_visitors}</span>
                    </div>
                  </div>

                  {/* Primary Traffic Channel */}
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
                        Primary Source
                      </span>
                      <div className="text-2xl font-black text-white leading-tight">
                        {Object.keys(data.referral_breakdown || {})[0] || 'Direct'}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center justify-between pt-4 border-t border-slate-800/80">
                      <span>Top Device</span>
                      <span className="font-bold text-white">
                        {Object.keys(data.device_breakdown || {})[0] || 'Desktop'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RECRUITER ACTIVITY FEED & PROJECT CLICK HEATMAP */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recruiter Feed */}
                  <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                          Live Recruiter Activity Feed
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {data.recruiter_feed.length} Sessions Captured
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {data.recruiter_feed.length === 0 ? (
                        <p className="text-xs text-slate-500 py-8 text-center">
                          No visitor sessions recorded yet. Share your portfolio link on LinkedIn to start tracking recruiters!
                        </p>
                      ) : (
                        data.recruiter_feed.map((feed) => (
                          <div
                            key={feed.id}
                            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-1.5 hover:border-slate-700 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                                📍 Recruiter in {feed.location}
                              </span>
                              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                {feed.engagement_score}% Fit Score
                              </span>
                            </div>

                            <p className="text-slate-300 leading-normal">
                              Spent <span className="font-bold text-emerald-400">{feed.duration_formatted}</span> reviewing your portfolio
                              {feed.clicked_projects.length > 0 && (
                                <span> — reviewed project <span className="font-bold text-indigo-400">{feed.clicked_projects.join(', ')}</span></span>
                              )}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                              <span>
                                {feed.device_type} • via {feed.referrer}
                              </span>
                              <span>{feed.timestamp_ago}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Project Click Heatmap Leaderboard */}
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4 pb-3 border-b border-slate-800">
                        Project Click Leaderboard
                      </h3>

                      <div className="space-y-4">
                        {data.project_clicks.length === 0 ? (
                          <p className="text-xs text-slate-500 py-8 text-center">
                            No project clicks recorded yet.
                          </p>
                        ) : (
                          data.project_clicks.map((item, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-200">
                                <span>{item.project_name}</span>
                                <span className="text-indigo-400">{item.clicks} clicks ({item.percentage}%)</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-indigo-500 h-full rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
                        Device Distribution
                      </span>
                      <div className="flex gap-2">
                        {Object.entries(data.device_breakdown || {}).map(([dev, count], i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            {dev}: {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* GEOGRAPHIC ORIGIN */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4">
                    Geographic Origin Breakdown
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {data.geographic_stats.map((stat, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-2 text-slate-200">
                          {getFlagEmoji(stat.country)} {stat.country}
                        </span>
                        <span className="text-indigo-400">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 px-8 bg-slate-950 border-t border-slate-800 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
              Live Recruiter Telemetry &bull; Powered by Antigravity Analytics
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function getFlagEmoji(countryName: string) {
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
