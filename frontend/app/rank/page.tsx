'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rankResumes, getRankingJobs } from '@/lib/api';
import { RankingJobResponse, RankedResumeItem } from '@/lib/types';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

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
      <div className="w-full max-w-[1400px] bg-white border border-gray-100 shadow-sm rounded-sm mt-4 mb-12 flex flex-col relative z-10 overflow-hidden">
        <Header />

        <main className="p-8 lg:p-16">
          <header className="mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-normal tracking-tight text-black mb-4 font-serif italic"
            >
              Bulk Resume Ranking
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-500 max-w-2xl"
            >
              Upload multiple resumes and provide a job description. Our AI will analyze and rank candidates based on their fit.
            </motion.p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <section className="space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wider text-slate-400">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wider text-slate-400">Resumes (PDF only)</label>
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full p-8 border-2 border-dashed border-slate-200 rounded-sm group-hover:border-black transition-colors flex flex-col items-center justify-center space-y-2">
                    <span className="text-slate-400">
                      {files.length > 0 ? `${files.length} files selected` : 'Click or drag files here'}
                    </span>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {files.map(f => (
                            <span key={f.name} className="px-2 py-1 bg-slate-100 text-xs text-slate-600 rounded-sm">{f.name}</span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRank}
                disabled={status === 'processing' || !jobDescription || files.length === 0}
                className="w-full py-4 bg-black text-white font-medium hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center space-x-2"
              >
                {status === 'processing' ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Analyzing Resumes...</span>
                  </>
                ) : (
                  <span>Start AI Ranking</span>
                )}
              </button>
            </section>

            {/* Results Section */}
            <section className="bg-slate-50/50 p-8 rounded-sm border border-slate-100 min-h-[500px]">
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-slate-400 text-center"
                  >
                    <p>Results will appear here after processing.</p>
                  </motion.div>
                )}

                {status === 'done' && result && (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-medium">Ranking Results</h3>
                    <div className="space-y-4">
                      {result.results.sort((a,b) => b.score - a.score).map((item, idx) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white p-6 border border-slate-200 shadow-sm relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-black" />
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-medium text-lg">{item.filename}</h4>
                              <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Candidate {idx + 1}</p>
                            </div>
                            <div className="text-2xl font-serif italic">
                              {item.score}<span className="text-sm font-sans not-italic text-slate-400 ml-1">/100</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {item.feedback.map((f, i) => (
                              <p key={i} className="text-sm text-slate-600 flex items-start">
                                <span className="mr-2 text-black">•</span>
                                {f}
                              </p>
                            ))}
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
                    className="h-full flex flex-col items-center justify-center text-red-500 text-center"
                  >
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
