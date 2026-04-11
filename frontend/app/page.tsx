'use client';

import DropZone from '@/components/upload/DropZone';
import UploadProgress from '@/components/upload/UploadProgress';
import { uploadResume } from '@/lib/api';
import { motion, Variants } from "framer-motion";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PlayCircle = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HexagonLogo = () => (
  <motion.svg
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
    className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
  </motion.svg>
);

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const eagleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.4
    }
  },
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[1500px] bg-white border border-gray-200 shadow-2xl shadow-black/5 rounded-sm overflow-hidden mb-12 flex flex-col"
      >

        {/* Header */}
        <motion.header
          variants={headerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center justify-between px-6 py-5 md:px-10 border-b border-gray-100 gap-4 relative z-20 bg-white"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 font-bold tracking-widest uppercase text-sm cursor-pointer"
          >
            <HexagonLogo />
            <span>ResumeOS</span>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500">
            <motion.a whileHover={{ y: -2, color: "#000" }} href="#solutions" className="hover:text-black transition">Solutions</motion.a>
            <motion.a whileHover={{ y: -2, color: "#000" }} href="#upload" className="hover:text-black transition">Framework</motion.a>
          </nav>

          <div className="flex items-center gap-6 text-sm font-medium">
            <motion.a
              whileHover={{ scale: 1.05, backgroundColor: "#f9fafb", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
              whileTap={{ scale: 0.95 }}
              href="#upload"
              className="border border-gray-200 px-6 py-2.5 transition rounded-sm flex items-center justify-center min-w-[120px] shadow-sm"
            >
              Get Started
            </motion.a>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 flex-grow border-b border-gray-100 relative z-10">
          {/* Left Column */}
          <div className="px-6 py-12 md:px-14 md:py-24 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col bg-white relative z-10 min-h-[700px]">

            <div className="max-w-[550px] flex flex-col flex-grow">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-10"
              >
                <div>
                  <motion.p variants={itemVariants} className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 px-1 border-l-2 border-gray-100 ml-1">
                    AI For High-Stakes Career Leadership
                  </motion.p>

                  <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-[72px] font-medium tracking-tight leading-[1.02] mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900"
                  >
                    When Context Changes, Strategy Follows.
                  </motion.h1>

                  <motion.p variants={itemVariants} className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-[480px]">
                    When the job market shifts, hesitation is fatal. ResumeOS provides professionals with the real-time context needed to execute career transitions, pivots, and ascensions with total confidence.
                  </motion.p>
                </div>

                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5 relative z-[100]">
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2, backgroundColor: "#222" }}
                    whileTap={{ scale: 0.98 }}
                    href="#upload"
                    className="bg-black text-white px-10 py-5 text-sm font-medium shadow-2xl shadow-black/20 transition-all rounded-sm duration-300 relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10 uppercase tracking-widest">Transition Roadmap</span>
                    <motion.div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2, backgroundColor: "#fafafa" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center border border-gray-300 px-10 py-5 text-sm font-medium transition rounded-sm bg-white hover:bg-gray-50 uppercase tracking-widest"
                  >
                    <PlayCircle />
                    View the Framework
                  </motion.button>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-12 flex items-center gap-8 grayscale opacity-40">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Trusted by leaders from</div>
                  <div className="flex gap-6 items-center">
                    <div className="font-serif italic text-lg opacity-80">Forbes</div>
                    <div className="font-sans font-bold text-lg">Wired</div>
                    <div className="font-serif font-black text-lg">Fortune</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          {/* End of Left Column */}

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
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: 'linear-gradient(to bottom, transparent 80%, rgba(0,0,0,0.03) 100%)',
                backgroundSize: '100% 24px',
                opacity: 0.1
              }}
            />
            <div className="absolute inset-0 pointer-events-none fade-edges shadow-[inset_0_0_100px_rgba(255,255,255,0.8)] z-20"></div>

            <motion.div
              variants={eagleVariants}
              initial="hidden"
              animate={["show", "float"]}
              whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
              className="w-full max-w-xl aspect-square relative z-0 origin-center cursor-crosshair"
            >
              <Image
                src="/halftone_eagle.png"
                alt="Dot Matrix Eagle"
                fill
                className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] mix-blend-multiply transition-all duration-700 hover:drop-shadow-[0_35px_60px_rgba(0,0,0,0.25)]"
                priority
              />

              {/* Subtle accent circles */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-40 h-40 border border-gray-200 rounded-full"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Subsequent Sections Restyled */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[1500px] flex flex-col gap-12"
      >
        <motion.section
          id="upload"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white border border-gray-200 p-10 md:p-16 lg:p-24 flex flex-col md:flex-row gap-12 lg:gap-24 rounded-sm shadow-2xl shadow-black/5 items-center relative overflow-hidden group"
        >
          <div className="md:w-1/3 relative z-10">
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Ingestion Module</motion.p>
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-4xl font-medium tracking-tight mb-6">Initialize Your Matrix</motion.h2>
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-gray-500 text-base leading-relaxed mb-8">Drop your standard PDF resume to instantly formulate ATS-optimized JSON representations and generate an interactive portfolio.</motion.p>

            <div className="flex flex-col gap-4">
              {['Instant PDF parsing', 'Auto-tagging experience', 'Skills vectorization'].map((text, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={text}
                  className="flex items-center gap-3 text-sm font-medium text-gray-400"
                >
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  {text}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="md:w-2/3 w-full border border-gray-100 shadow-2xl bg-gray-50/30 rounded-sm p-8 lg:p-12 relative z-10 backdrop-blur-sm transition-all duration-500 group-hover:bg-gray-50/50">
            <motion.div
              whileHover={{ transform: "translateY(-4px)" }}
              className="transition-transform duration-300"
            >
              <DropZone onFileSelect={handleFileSelect} disabled={status !== 'idle'} />
            </motion.div>
            <div className="mt-8">
              <UploadProgress status={status} error={error} fileName={fileName} />
            </div>

            {/* Interactive Terminal Flair */}
            <div className="mt-8 pt-6 border-t border-gray-200/50 text-[10px] font-mono text-gray-400 uppercase tracking-widest flex justify-between px-2">
              <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>System Status: {status === 'idle' ? 'Awaiting Input' : status}</motion.p>
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'idle' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'idle' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
                Active
              </span>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        </motion.section>

        <section id="solutions" className="grid lg:grid-cols-2 gap-12">
          {/* Core Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            className="bg-black text-white p-10 md:p-16 lg:p-20 rounded-sm shadow-2xl overflow-hidden relative transition-all duration-500"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[100px] origin-bottom-left"
            />

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 relative z-10 opacity-70">Core Systems</p>
            <h2 className="text-4xl font-medium tracking-tight mb-16 relative z-10">Production-ready AI Workflow</h2>
            <div className="space-y-12 relative z-10">
              {coreFeatures.map((feature, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * i, duration: 0.6, ease: "easeOut" }}
                  key={feature.title}
                  className="border-l-2 border-gray-800 pl-8 hover:border-white transition-colors duration-500 group/feat"
                >
                  <h3 className="text-xl font-medium tracking-tight mb-3 group-hover/feat:translate-x-1 transition-transform duration-300">{feature.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed max-w-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Premium Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
            className="bg-white border border-gray-200 p-10 md:p-16 lg:p-20 rounded-sm shadow-xl shadow-black/5 flex flex-col transition-all duration-500"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 opacity-70">Upgrades</p>
            <h2 className="text-4xl font-medium tracking-tight mb-8">Premium Controls</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-sm">
              Everything needed to position this as a premium capability with upgrade-worthy controls, unlocking advanced tailoring.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 mt-auto">
              {premiumFeatures.map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ x: 8 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.5 }}
                  key={item}
                  className="flex items-center gap-4 cursor-default group/item"
                >
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], backgroundColor: ["#000", "#555", "#000"] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 bg-black rounded-full"
                  />
                  <span className="text-base font-medium tracking-tight text-gray-700 group-hover/item:text-black transition-colors duration-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </motion.div>

      {/* Visual Footer Spacer */}
      <footer className="w-full max-w-[1500px] py-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300"
        >
          ResumeOS © 2026 // Distributed Career Context
        </motion.div>
      </footer>
    </div>
  );
}
