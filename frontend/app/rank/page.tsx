'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rankResumes, getRankingJobs } from '@/lib/api';
import { RankingJobResponse, RankedResumeItem } from '@/lib/types';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

function DebouncedTextarea({ value, onChange, placeholder, className }: { value: string, onChange: (val: string) => void, placeholder?: string, className?: string }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (value !== localValue) setLocalValue(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(localValue);
    }, 300);
    return () => clearTimeout(timeout);
  }, [localValue, onChange]);

  return (
    <textarea
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

export default function RankPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<RankingJobResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRank = async () => {
    if (!jobDescription || files.length === 0) return;

    setStatus('processing');
    setError(null);
    try {
      const data = await rankResumes(jobDescription, files);
      setResult(data);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Ranking failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 flex flex-col items-center">
      <div className="w-full max-w-[1400px] bg-white/95 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-xl mt-4 mb-12 flex flex-col relative z-10 overflow-hidden">
        <Header />

        <main className="p-8 lg:p-16">
          <header className="mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-6"
            >
              Recruitment AI
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-light tracking-tight text-slate-950 mb-6 font-serif leading-[1.1]"
            >
              High-Precision <span className="italic text-emerald-900">Ranking</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 max-w-2xl leading-relaxed"
            >
              Our neural engine analyzes candidate syntax and experience density to rank fit with unprecedented accuracy.
            </motion.p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Input Section */}
            <div className="lg:col-span-5 space-y-10">
              <section className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Target Role Profile</label>
                <DebouncedTextarea
                  value={jobDescription}
                  onChange={setJobDescription}
                  placeholder="Paste the job description here..."
                  className="w-full h-80 p-6 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all resize-none shadow-inner"
                />
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Candidate Pipeline (PDF)</label>
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full p-12 border-2 border-dashed border-slate-200 rounded-xl group-hover:border-emerald-500/50 group-hover:bg-emerald-50/10 transition-all flex flex-col items-center justify-center space-y-4 bg-white/50">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-500">
                      {files.length > 0 ? `${files.length} dossiers queued` : 'Add candidate files'}
                    </span>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        {files.map(f => (
                            <span key={f.name} className="px-3 py-1 bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-600 rounded-md shadow-sm">{f.name}</span>
                        ))}
                    </div>
                  </div>
                </div>
              </section>

              <button
                onClick={handleRank}
                disabled={status === 'processing' || !jobDescription || files.length === 0}
                className="w-full py-5 bg-slate-950 text-white font-bold uppercase tracking-[0.25em] text-[11px] hover:bg-emerald-900 disabled:bg-slate-100 disabled:text-slate-400 transition-all rounded-xl shadow-2xl shadow-emerald-950/20 flex items-center justify-center space-x-3 overflow-hidden group relative"
              >
                {status === 'processing' ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                    />
                    <span>Neural Analysis Active</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Execute Global Ranking</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-7">
              <section className="bg-slate-50/70 p-10 rounded-2xl border border-slate-100 min-h-[700px] shadow-inner relative">
                <div className="absolute top-0 right-0 p-10">
                   {status === 'done' && (
                     <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">Analysis Complete</div>
                   )}
                </div>
                
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-slate-300 text-center space-y-6"
                    >
                      <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium tracking-widest uppercase">Waiting for process parameters...</p>
                    </motion.div>
                  )}

                  {status === 'done' && result && (
                    <motion.div 
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-10"
                    >
                      <header className="flex items-center justify-between border-b border-slate-200 pb-8 mt-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-950">Ranking Matrix</h3>
                        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">{result.results.length} Candidates Scanned</div>
                      </header>
                      
                      <div className="space-y-6">
                        {result.results.sort((a,b) => b.score - a.score).map((item, idx) => (
                          <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.98, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                            className="bg-white/80 border border-white hover:border-emerald-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] transition-all p-8 rounded-2xl relative group"
                          >
                            <div className={`absolute top-0 right-0 p-8 text-5xl font-serif italic ${idx === 0 ? 'text-emerald-500' : 'text-slate-100 group-hover:text-slate-200 transition-colors'}`}>
                              #{idx + 1}
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                              <div className="space-y-2">
                                <h4 className="font-bold text-xl tracking-tight text-slate-900">{item.filename}</h4>
                                <div className="flex items-center space-x-2">
                                   <div className={`w-2 h-2 rounded-full ${item.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Match Density: {item.score}%</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 relative z-10">
                              {item.feedback.map((f, i) => (
                                <p key={i} className="text-sm text-slate-600 font-medium flex items-start leading-relaxed">
                                  <span className={`mr-4 ${idx === 0 ? 'text-emerald-500' : 'text-slate-300'}`}>0{i+1}</span>
                                  {f}
                                </p>
                              ))}
                            </div>
                            
                            {/* Score Bar */}
                            <div className="mt-8 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${item.score}%` }}
                                 transition={{ delay: 0.5 + (idx * 0.1), duration: 1 }}
                                 className={`h-full ${item.score >= 80 ? 'bg-emerald-500' : 'bg-slate-950'}`}
                               />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-red-500 text-center space-y-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
