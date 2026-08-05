'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeJobMatch, generateCoverLetter } from '@/lib/api';
import { JobMatchResponse, CoverLetterResponse } from '@/lib/types';

interface JobMatcherModalProps {
  portfolioId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobMatcherModal({
  portfolioId,
  isOpen,
  onClose,
}: JobMatcherModalProps) {
  const [activeTab, setActiveTab] = useState<'match' | 'coverLetter'>('match');
  const [jobDescription, setJobDescription] = useState('');
  const [matchLoading, setMatchLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchResponse | null>(null);
  const [coverResult, setCoverResult] = useState<CoverLetterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAnalyzeMatch = async () => {
    if (!jobDescription.trim() || matchLoading) return;
    setError(null);
    setMatchLoading(true);

    try {
      const res = await analyzeJobMatch(portfolioId, jobDescription);
      setMatchResult(res);
    } catch (err) {
      console.error('Job Match Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze job match.');
    } finally {
      setMatchLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim() || coverLoading) return;
    setError(null);
    setCoverLoading(true);

    try {
      const res = await generateCoverLetter(portfolioId, jobDescription);
      setCoverResult(res);
      setActiveTab('coverLetter');
    } catch (err) {
      console.error('Cover Letter Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter.');
    } finally {
      setCoverLoading(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (!coverResult?.cover_letter_text) return;
    navigator.clipboard.writeText(coverResult.cover_letter_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCoverLetter = () => {
    if (!coverResult?.cover_letter_text) return;
    const blob = new Blob([coverResult.cover_letter_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${coverResult.company_name || 'Tailored'}_Cover_Letter.txt`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md no-print font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
      >
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                AI Deep Matching
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Keyword Heatmap
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Target Role Matcher & Cover Letter
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6">
          <button
            onClick={() => setActiveTab('match')}
            className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'match'
                ? 'border-indigo-500 text-white font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🎯 Keyword Heatmap & Match
          </button>
          <button
            onClick={() => setActiveTab('coverLetter')}
            className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'coverLetter'
                ? 'border-indigo-500 text-white font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ✉️ Tailored Cover Letter
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-semibold flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Job Description Input Section */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
              Paste Target Job Description (JD)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here (e.g. Senior Full-Stack Engineer requiring React, Node.js, GraphQL, AWS)..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
            />

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button
                onClick={handleAnalyzeMatch}
                disabled={!jobDescription.trim() || matchLoading}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg disabled:opacity-40 transition-all flex items-center gap-2"
              >
                {matchLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing Keyword Heatmap...
                  </>
                ) : (
                  <>
                    🎯 Run Match & Heatmap Analysis
                  </>
                )}
              </button>

              <button
                onClick={handleGenerateCoverLetter}
                disabled={!jobDescription.trim() || coverLoading}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold uppercase tracking-wider border border-slate-700 disabled:opacity-40 transition-all flex items-center gap-2"
              >
                {coverLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Writing Cover Letter...
                  </>
                ) : (
                  <>
                    ✉️ Generate Cover Letter
                  </>
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: Match & Heatmap View */}
          {activeTab === 'match' && (
            <div>
              {!matchResult ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    No Heatmap Analysis Yet
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Paste a job description above and click "Run Match & Heatmap Analysis" to see your match score % and keyword gaps.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score Gauge Card */}
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">
                        Role Compatibility Match
                      </span>
                      <h3 className="text-2xl font-black text-white">
                        {matchResult.match_score >= 80
                          ? '🌟 Excellent Match for this Role!'
                          : matchResult.match_score >= 60
                          ? '⚡ Good Match (Minor Keyword Gaps)'
                          : '⚠️ Needs Keyword Optimization'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Based on target keywords, experience alignment, and skills overlap.
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-4xl font-black text-white leading-none">
                          {matchResult.match_score}%
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                          Match Score
                        </span>
                      </div>
                      <div className="w-20 h-3 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${matchResult.match_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matched Keywords */}
                    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
                          Matched Keywords ({matchResult.matched_skills.length})
                        </h4>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {matchResult.matched_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          >
                            ✓ {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">
                          Missing Keywords ({matchResult.missing_skills.length})
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {matchResult.missing_skills.map((skill, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs"
                          >
                            <div className="font-bold text-amber-300">
                              + {skill.name}
                            </div>
                            {skill.suggestion && (
                              <p className="text-[11px] text-amber-200/70 mt-0.5">
                                💡 {skill.suggestion}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bullet Point Rewrites */}
                  {matchResult.suggested_bullet_rewrites && matchResult.suggested_bullet_rewrites.length > 0 && (
                    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 mb-4">
                        Suggested Targeted Bullet Rewrites
                      </h4>
                      <ul className="space-y-3">
                        {matchResult.suggested_bullet_rewrites.map((bullet, idx) => (
                          <li key={idx} className="text-xs md:text-sm text-slate-300 bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2.5 leading-relaxed">
                            <span className="text-indigo-400 font-bold shrink-0">✨</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Cover Letter View */}
          {activeTab === 'coverLetter' && (
            <div>
              {!coverResult ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    No Cover Letter Generated Yet
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Paste a job description above and click "Generate Cover Letter" to produce a tailored 3-paragraph application letter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-950 p-4 px-6 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block">
                        Tailored Cover Letter
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {coverResult.job_title || 'Role Application'} {coverResult.company_name && `at ${coverResult.company_name}`}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCopyCoverLetter}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5"
                      >
                        {copied ? 'Copied! ✓' : '📋 Copy Text'}
                      </button>
                      <button
                        onClick={handleDownloadCoverLetter}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                      >
                        💾 Download .txt
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {coverResult.cover_letter_text}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
