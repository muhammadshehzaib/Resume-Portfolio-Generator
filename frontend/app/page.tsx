'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DropZone from '@/components/upload/DropZone';
import UploadProgress from '@/components/upload/UploadProgress';
import { uploadResume } from '@/lib/api';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const PlayCircle = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HexagonLogo = () => (
  <svg 
    className="w-6 h-6 gsap-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
  </svg>
);

export default function Home() {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  useGSAP(() => {
    // 1. Hero Content Entrance Staggered
    gsap.from('.gsap-hero-item', {
      opacity: 0,
      y: 40,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });

    // 2. Feature Items Entrance Staggered
    gsap.from('.gsap-feature-item', {
      opacity: 0,
      x: -30,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.5
    });

    // 3. Premium Upgrades Items
    gsap.from('.gsap-upgrade-item', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 0.7
    });

    // 4. Testimonial Card Entrance & Idle
    gsap.from('.gsap-testimonial', {
      opacity: 0,
      x: -40,
      duration: 1,
      ease: 'power3.out',
      delay: 1.2,
      onComplete: () => {
        gsap.to('.gsap-testimonial', {
          y: -10,
          yoyo: true,
          repeat: -1,
          duration: 3,
          ease: 'sine.inOut'
        });
      }
    });

    // 5. Halftone Eagle Entrance & Idle
    gsap.from('.gsap-eagle', {
      opacity: 0,
      scale: 0.85,
      rotation: -5,
      duration: 1.5,
      ease: 'power3.out',
      delay: 0.4,
      onComplete: () => {
        gsap.to('.gsap-eagle', {
          y: -20,
          rotation: 3,
          yoyo: true,
          repeat: -1,
          duration: 4,
          ease: 'sine.inOut'
        });
      }
    });

    // 6. Dot Matrix Eagle Background Overlay Movement
    gsap.to('.gsap-matrix-bg', {
      backgroundPosition: "0px 24px",
      repeat: -1,
      duration: 3,
      ease: 'none'
    });

    // 7. Background Pulsing Glow
    gsap.to('.gsap-bg-glow', {
      scale: 1.15,
      opacity: 0.04,
      yoyo: true,
      repeat: -1,
      duration: 6,
      ease: 'sine.inOut'
    });

    // 8. Testimonial active indicator pulse
    gsap.to('.gsap-test-indicator', {
      scale: 1.3,
      opacity: 0.5,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: 'sine.inOut'
    });

    // 9. Interactive Terminal system status pulse
    gsap.to('.gsap-pulse-text', {
      opacity: 0.4,
      yoyo: true,
      repeat: -1,
      duration: 1.5,
      ease: 'power1.inOut'
    });

    // 10. Core systems decorative orb rotation
    gsap.to('.gsap-orb', {
      rotation: 360,
      repeat: -1,
      duration: 30,
      ease: 'none'
    });

  }, { scope: container });

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
    <div ref={container} className="min-h-screen bg-[#efefef] p-0 sm:p-4 md:p-8 lg:p-12 font-sans text-slate-900 flex flex-col items-center overflow-x-hidden">
      {/* Main Container mirroring the bordered white box in the image */}
      <div className="w-full max-w-[1500px] bg-white border border-gray-200 shadow-2xl shadow-black/5 rounded-sm overflow-hidden mb-12 flex flex-col">
        
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between px-6 py-5 md:px-10 border-b border-gray-100 gap-4 relative z-20 bg-white">
          <div className="flex items-center gap-2 font-bold tracking-widest uppercase text-sm cursor-pointer hover:opacity-75 transition-opacity">
            <HexagonLogo />
            <span>ResumeOS</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#solutions" className="hover:text-black transition hover:-translate-y-0.5 inline-block">Solutions</a>
            <a href="#framework" className="hover:text-black transition hover:-translate-y-0.5 inline-block">Framework</a>
            <a href="#how-it-works" className="hover:text-black transition hover:-translate-y-0.5 inline-block">How It Works</a>
            <a href="#case-studies" className="hover:text-black transition hover:-translate-y-0.5 inline-block">Case Studies</a>
          </nav>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <a 
              href="#upload" 
              className="border border-gray-200 px-6 py-2.5 transition rounded-sm flex items-center justify-center min-w-[120px] shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-95"
            >
              Get Started
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 flex-grow border-b border-gray-100 relative z-10">
          {/* Left Column */}
          <div className="px-6 py-12 md:px-14 md:py-24 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col relative justify-center bg-white z-10 overflow-hidden">
            
            <div className="max-w-[550px] mb-24 relative z-10">
              <p className="gsap-hero-item text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 mt-4">
                AI For High-Stakes Career Leadership
              </p>
              <h1 className="gsap-hero-item text-5xl md:text-[64px] font-medium tracking-tight leading-[1.05] mb-8 relative">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600">When Context Changes, Strategy Follows.</span>
              </h1>
              <p className="gsap-hero-item text-gray-500 text-lg md:text-xl leading-relaxed mb-10">
                When the job market shifts, hesitation is fatal. ResumeOS provides professionals with the real-time context needed to execute career transitions, pivots, and ascensions with total confidence.
              </p>
              
              <div className="gsap-hero-item flex flex-wrap items-center gap-4">
                <a 
                  href="#upload" 
                  className="bg-black text-white px-8 py-4 text-sm font-medium shadow-xl shadow-black/10 transition-all rounded-sm duration-300 relative overflow-hidden group hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  <span className="relative">Transition Roadmap</span>
                </a>
                <button 
                  className="flex items-center border border-gray-300 px-6 py-4 text-sm font-medium transition rounded-sm hover:bg-gray-50 hover:-translate-y-0.5 active:scale-95"
                >
                  <PlayCircle />
                  View the Framework
                </button>
              </div>
            </div>

            {/* Background flourish */}
            <div className="gsap-bg-glow absolute top-0 left-0 w-[150%] h-[150%] pointer-events-none bg-[radial-gradient(circle_at_top_left,black,transparent_50%)] opacity-[0.02]"></div>

            {/* Testimonial Card */}
            <div className="gsap-testimonial mt-auto border border-gray-150 p-6 max-w-[420px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] bg-white lg:absolute lg:bottom-12 z-20 cursor-default transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
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
                <div className="gsap-test-indicator w-1.5 h-1.5 rounded-full bg-black"></div>
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
            <div 
              className="gsap-matrix-bg absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: 'linear-gradient(to bottom, transparent 80%, rgba(0,0,0,0.03) 100%)',
                backgroundSize: '100% 24px'
              }}
            />
            <div className="absolute inset-0 pointer-events-none fade-edges shadow-[inset_0_0_100px_rgba(255,255,255,0.8)] z-20"></div>
            
            <div className="gsap-eagle w-full max-w-xl aspect-square relative z-0 origin-center hover:scale-105 transition-transform duration-500 will-change-transform">
              <Image
                src="/halftone_eagle.png"
                alt="Dot Matrix Eagle"
                fill
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] mix-blend-multiply"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subsequent Sections Restyled */}
      <div className="w-full max-w-[1500px] flex flex-col gap-12">
        <section id="upload" className="bg-white border border-gray-200 p-10 md:p-16 flex flex-col md:flex-row gap-12 rounded-sm shadow-xl shadow-black/5 items-center relative overflow-hidden group">
          <div className="md:w-1/3 relative z-10">
            <p className="gsap-feature-item text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Ingestion Module</p>
            <h2 className="gsap-feature-item text-3xl font-medium tracking-tight mb-4">Initialize Your Matrix</h2>
            <p className="gsap-feature-item text-gray-500 text-sm leading-relaxed mb-6">Drop your standard PDF resume to instantly formulate ATS-optimized JSON representations and generate an interactive portfolio.</p>
          </div>
          <div className="md:w-2/3 w-full border border-gray-200/60 shadow-inner bg-gray-50/50 rounded-sm p-8 relative z-10 backdrop-blur-sm transition-all duration-500 group-hover:bg-gray-50/80">
            <DropZone onFileSelect={handleFileSelect} disabled={status !== 'idle'} />
            <div className="mt-8">
              <UploadProgress status={status} error={error} fileName={fileName} />
            </div>
            
            {/* Interactive Terminal Flair */}
            <div className="mt-8 pt-6 border-t border-gray-200/50 text-[10px] font-mono text-gray-400 uppercase tracking-widest flex justify-between px-2">
              <p className="gsap-pulse-text font-bold">System Status: {status === 'idle' ? 'Awaiting Input' : status}</p>
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'idle' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'idle' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
                Active
              </span>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </section>

        <section className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Core Features */}
          <div className="bg-black text-white p-10 md:p-16 rounded-sm shadow-2xl overflow-hidden relative group transition-transform duration-500 hover:-translate-y-1">
            <div className="gsap-orb absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl origin-bottom-left" />
            
            <p className="gsap-feature-item text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 relative z-10">Core Systems</p>
            <h2 className="gsap-feature-item text-3xl font-medium tracking-tight mb-12 relative z-10">Production-ready AI Workflow</h2>
            <div className="space-y-10 relative z-10">
              {coreFeatures.map((feature, i) => (
                <div key={feature.title} className="gsap-feature-item border-l-2 border-gray-800 pl-6 hover:border-gray-500 transition-colors duration-300">
                  <h3 className="text-lg font-medium tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-white border border-gray-200 p-10 md:p-16 rounded-sm shadow-xl shadow-black/5 flex flex-col transition-transform duration-500 hover:-translate-y-1">
            <p className="gsap-feature-item text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Upgrades</p>
            <h2 className="gsap-feature-item text-3xl font-medium tracking-tight mb-6">Premium Controls</h2>
            <p className="gsap-feature-item text-gray-500 text-sm leading-relaxed mb-10">
              Everything needed to position this as a premium capability with upgrade-worthy controls, unlocking advanced tailoring and personalization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mt-auto">
              {premiumFeatures.map((item, i) => (
                <div key={item} className="gsap-upgrade-item flex items-center gap-3 cursor-default group/item">
                  <div className="w-1.5 h-1.5 bg-black rounded-full group-hover/item:scale-150 transition-transform duration-300" />
                  <span className="text-sm font-medium tracking-tight text-gray-700 group-hover/item:text-black transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
