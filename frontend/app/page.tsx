'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DropZone from '@/components/upload/DropZone';
import UploadProgress from '@/components/upload/UploadProgress';
import { uploadResume } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  const coreFeatures = [
    {
      title: 'Resume Upload + AI Extraction',
      description:
        'Upload a PDF and extract name, contact, experience, education, skills, projects, and certifications using Ollama, OpenAI, or HuggingFace.',
    },
    {
      title: 'ATS Compatibility Scoring',
      description:
        'Get a 0-100 ATS score across key criteria with direct and actionable improvements for faster interview conversion.',
    },
    {
      title: 'Portfolio Generation',
      description:
        'Instantly create a shareable site in Minimal, Modern, or Creative templates with public UUID links and recruiter-ready rendering.',
    },
  ];

  const premiumFeatures = [
    'Profile photo upload (Cloudinary)',
    'Custom colors per portfolio',
    'Drag-to-reorder sections',
    'Dark / light mode toggle',
    'Preview mode for recruiter view',
    'Available-for-hire badge',
    'Custom slug URLs',
    'QR code generator',
  ];

  const handleFileSelect = async (file: File) => {
    setFileName(file.name);
    setStatus('uploading');
    setError(undefined);

    try {
      const portfolio = await uploadResume(file);
      setStatus('done');
      setTimeout(() => {
        router.push(`/portfolio/${portfolio.id}`);
      }, 500);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-12 animate-rise-in rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-900 text-sm font-bold text-teal-50">
                RO
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">ResumeOS</p>
                <p className="text-xs text-slate-500">Resume-to-Portfolio SaaS</p>
              </div>
            </div>
            <a
              href="#upload"
              className="rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Start Free
            </a>
          </div>
        </div>

        <section className="mb-20 grid gap-8 lg:grid-cols-2">
          <div className="animate-rise-in">
            <p className="mb-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Built for hiring outcomes
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Sell your profile like a product. Convert resumes into standout portfolio sites.
            </h1>
            <p className="mb-6 max-w-xl text-lg text-slate-600">
              One upload gives you AI extraction, ATS scoring, live editing, customization, analytics, and public links
              ready to share with recruiters and clients.
            </p>
            <div className="grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <p className="text-2xl font-bold text-slate-900">3</p>
                <p className="text-xs text-slate-500">Templates</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <p className="text-2xl font-bold text-slate-900">8+</p>
                <p className="text-xs text-slate-500">Premium Controls</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <p className="text-2xl font-bold text-slate-900">100</p>
                <p className="text-xs text-slate-500">Point ATS Scale</p>
              </div>
            </div>
          </div>

          <div
            id="upload"
            className="animate-rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-emerald-100/50 md:p-8"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Launch your portfolio</p>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Upload Resume PDF</h2>
            <DropZone onFileSelect={handleFileSelect} disabled={status !== 'idle'} />
            <UploadProgress status={status} error={error} fileName={fileName} />
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold text-slate-900">Core Features</h2>
            <p className="text-sm text-slate-500">Production-ready AI workflow</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {coreFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Premium Customization</h2>
            <p className="mb-6 text-sm text-slate-600">
              Everything needed to position this as a premium SaaS plan with upgrade-worthy controls.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {premiumFeatures.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-teal-900 p-6 text-slate-100">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">AI Features</p>
            <h3 className="mb-5 text-2xl font-bold">Job Tailoring + Suggestions</h3>
            <p className="mb-6 text-sm text-slate-200">
              Match portfolios to specific job descriptions and apply instant AI improvement recommendations.
            </p>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-white/10 p-3">AI customizes content for each role</div>
              <div className="rounded-lg bg-white/10 p-3">Recommendations for clarity and impact</div>
              <div className="rounded-lg bg-white/10 p-3">Configurable LLM backend provider</div>
            </div>
          </div>
        </section>

        <section className="mb-16 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Analytics + Social Reach</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <p className="rounded-lg bg-slate-50 p-3">View count tracking per portfolio</p>
              <p className="rounded-lg bg-slate-50 p-3">Open Graph meta tags for LinkedIn and social previews</p>
              <p className="rounded-lg bg-slate-50 p-3">Shareable UUID links and custom slugs</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 p-3">FastAPI + SQLAlchemy + SQLite</div>
              <div className="rounded-lg border border-slate-200 p-3">Next.js 15 + React 19 + Tailwind</div>
              <div className="rounded-lg border border-slate-200 p-3">pdfplumber extraction pipeline</div>
              <div className="rounded-lg border border-slate-200 p-3">Cloudinary media storage</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Go Live in Minutes</p>
          <h2 className="mb-3 text-3xl font-bold text-slate-900">From resume upload to publish-ready portfolio</h2>
          <p className="mb-6 text-slate-600">Use this as your public SaaS landing and your in-product onboarding at the same time.</p>
          <a
            href="#upload"
            className="inline-flex rounded-full bg-teal-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Upload Resume
          </a>
        </section>
      </div>
    </div>
  );
}
