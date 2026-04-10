'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DropZone from '@/components/upload/DropZone';
import UploadProgress from '@/components/upload/UploadProgress';
import { uploadResume } from '@/lib/api';
import Image from 'next/image';

const PlayCircle = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HexagonLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
  </svg>
);

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  const coreFeatures = [
    {
      title: 'Resume Upload + AI Extraction',
      description: 'Upload a PDF and extract name, contact, experience, education, skills, projects, and certifications using advanced LLM pipelines.',
    },
    {
      title: 'ATS Compatibility Scoring',
      description: 'Get a 0-100 ATS score across key criteria with direct and actionable improvements for faster interview conversion.',
    },
    {
      title: 'Portfolio Generation',
      description: 'Instantly create a shareable site in Minimal, Modern, or Creative templates with public UUID links.',
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
    <div className="min-h-screen bg-[#efefef] p-0 sm:p-4 md:p-8 lg:p-12 font-sans text-slate-900 flex flex-col items-center">
      {/* Main Container mirroring the bordered white box in the image */}
      <div className="w-full max-w-[1500px] bg-white border border-gray-200 shadow-xl shadow-black/5 rounded-sm overflow-hidden mb-12 flex flex-col">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between px-6 py-5 md:px-10 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-2 font-bold tracking-widest uppercase text-sm">
            <HexagonLogo />
            <span>ResumeOS</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#solutions" className="hover:text-black transition">Solutions</a>
            <a href="#framework" className="hover:text-black transition">Framework</a>
            <a href="#how-it-works" className="hover:text-black transition">How It Works</a>
            <a href="#case-studies" className="hover:text-black transition">Case Studies</a>
          </nav>

          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#login" className="text-gray-600 hover:text-black transition hidden sm:block">Log In</a>
            <a href="#upload" className="border border-gray-200 px-5 py-2 hover:bg-gray-50 transition rounded-sm flex items-center justify-center min-w-[120px]">Get Started</a>
          </div>
        </header>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 flex-grow border-b border-gray-100">
          {/* Left Column */}
          <div className="px-6 py-12 md:px-14 md:py-24 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col relative justify-center">

            <div className="max-w-[550px] mb-24">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 mt-4">
                AI For High-Stakes Career Leadership
              </p>
              <h1 className="text-5xl md:text-[64px] font-medium tracking-tight leading-[1.05] mb-8">
                When Context Changes, Strategy Follows.
              </h1>
              <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-10">
                When the job market shifts, hesitation is fatal. ResumeOS provides professionals with the real-time context needed to execute career transitions, pivots, and ascensions with total confidence.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a href="#upload" className="bg-black text-white px-8 py-3.5 text-sm font-medium hover:bg-gray-800 transition rounded-sm">
                  Transition Roadmap
                </a>
                <button className="flex items-center border border-gray-300 px-6 py-3.5 text-sm font-medium hover:bg-gray-50 transition rounded-sm">
                  <PlayCircle />
                  View the Framework
                </button>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="mt-auto border border-gray-150 p-6 max-w-[420px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] bg-white lg:absolute lg:bottom-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-stone-200 overflow-hidden shrink-0 filter grayscale border border-gray-200">
                  <Image src="https://ui-avatars.com/api/?name=Elias+Vane&background=random&color=fff" width={48} height={48} alt="Elias Vane" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">Elias Vane</p>
                  <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mt-0.5">CEO, OMNI SYSTEMS</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic leading-[1.7]">
                "...ResumeOS gave us shared context when alignment mattered most. It changed how we made decisions during the transition..."
              </p>
              <div className="flex gap-2 mt-6">
                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Right Column (Halftone Image) */}
          <div
            className="flex items-center justify-center p-12 bg-white relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              backgroundPosition: 'center center'
            }}
          >
            <div className="absolute inset-0 pointer-events-none fade-edges shadow-[inset_0_0_100px_rgba(255,255,255,0.8)] z-10"></div>
            <div className="w-full max-w-xl aspect-square relative z-0">
              <Image
                src="/halftone_eagle.png"
                alt="Dot Matrix Eagle"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subsequent Sections Restyled */}
      <div className="w-full max-w-[1500px] flex flex-col gap-12">
        <section id="upload" className="bg-white border border-gray-200 p-10 md:p-16 flex flex-col md:flex-row gap-12 rounded-sm shadow-xl shadow-black/5">
          <div className="md:w-1/3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Upload Module</p>
            <h2 className="text-3xl font-medium tracking-tight mb-4">Initialize Your Matrix</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">Drop your standard PDF resume to instantly extract ATS-optimized JSON datasets and generate a recruiter-ready portfolio link.</p>
          </div>
          <div className="md:w-2/3 border border-gray-100 shadow-inner bg-gray-50 rounded-sm p-8">
            <DropZone onFileSelect={handleFileSelect} disabled={status !== 'idle'} />
            <div className="mt-8">
              <UploadProgress status={status} error={error} fileName={fileName} />
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-12">
          {/* Core Features */}
          <div className="bg-black text-white p-10 md:p-16 rounded-sm shadow-xl shadow-black/5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Core Systems</p>
            <h2 className="text-3xl font-medium tracking-tight mb-12">Production-ready AI Workflow</h2>
            <div className="space-y-10">
              {coreFeatures.map((feature) => (
                <div key={feature.title} className="border-l border-gray-800 pl-6">
                  <h3 className="text-lg font-medium tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-white border border-gray-200 p-10 md:p-16 rounded-sm shadow-xl shadow-black/5 flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Upgrades</p>
            <h2 className="text-3xl font-medium tracking-tight mb-6">Premium Controls</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Everything needed to position this as a premium capability with upgrade-worthy controls, unlocking advanced tailoring and personalization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              {premiumFeatures.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <span className="text-sm font-medium tracking-tight text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

