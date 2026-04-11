'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DropZone from '@/components/upload/DropZone';
import UploadProgress from '@/components/upload/UploadProgress';
import { uploadResume } from '@/lib/api';
import Image from 'next/image';
import { 
  motion, 
  Variants, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate 
} from "framer-motion";

// --- Components ---

const PlayCircle = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HexagonLogo = () => (
  <motion.svg 
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
    className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
  </motion.svg>
);

// Magnetic Wrapper Component
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Limits the movement to 15px
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

// --- Animations ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } 
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } 
  }
};

// --- Page Component ---

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  // Scroll Parallax Hooks
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const eagleY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const eagleScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const eagleRotate = useTransform(scrollYProgress, [0, 0.5], [0, 15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Mouse Dynamic Light Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(22, 163, 74, 0.05), transparent 80%)`;

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
    <div ref={containerRef} className="min-h-screen bg-[#fafafa] selection:bg-black selection:text-white p-0 lg:p-4 font-sans text-slate-900 flex flex-col items-center overflow-x-hidden">
      
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-[1000]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Dynamic Background Light */}
      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background }} />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="w-full max-w-[1600px] bg-white border border-gray-100 shadow-[0_0_100px_rgba(0,0,0,0.02)] rounded-[2px] overflow-hidden mb-12 flex flex-col relative z-10"
      >
        {/* Header */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="flex items-center justify-between px-8 py-6 md:px-12 border-b border-gray-50 relative z-50 bg-white/80 backdrop-blur-md"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 font-bold tracking-[0.3em] uppercase text-xs cursor-pointer group"
          >
            <HexagonLogo />
            <span className="group-hover:translate-x-1 transition-transform duration-300">ResumeOS</span>
          </motion.div>
          
          <nav className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <motion.a whileHover={{ y: -2, color: "#000" }} href="#solutions" className="transition-colors">Solutions</motion.a>
            <motion.a whileHover={{ y: -2, color: "#000" }} href="#upload" className="transition-colors">Framework</motion.a>
          </nav>
          
          <div className="flex items-center gap-8">
            <Magnetic>
              <motion.a 
                href="#upload" 
                className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] shadow-xl shadow-black/10 hover:shadow-black/20 transition-all"
              >
                Launch App
              </motion.a>
            </Magnetic>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 flex-grow min-h-[90vh] relative border-b border-gray-50">
          {/* Left Column */}
          <div className="px-8 py-20 md:px-20 md:py-32 flex flex-col justify-center relative z-20 overflow-hidden">
            <motion.div 
              style={{ opacity: heroOpacity }}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="max-w-[620px] space-y-12"
            >
              <div>
                <motion.div className="inline-flex items-center gap-4 mb-8">
                  <span className="w-12 h-[1px] bg-black/20"></span>
                  <motion.p variants={itemVariants} className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">
                    Carrier Optimization Protocol // v2.4
                  </motion.p>
                </motion.div>
                
                <div className="overflow-hidden mb-8">
                  <motion.h1 
                    variants={titleVariants}
                    className="text-6xl md:text-[92px] font-medium tracking-tighter leading-[0.95] text-black"
                  >
                    Strategy <br /> over <br /> <span className="italic font-serif text-gray-400">Structure.</span>
                  </motion.h1>
                </div>

                <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-[480px]">
                  When the landscape shifts, the agile survive. We bridge the gap between your history and your future with high-fidelity resume intelligence.
                </motion.p>
              </div>
              
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
                <Magnetic>
                  <motion.a 
                    href="#upload" 
                    className="bg-black text-white px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-[2px] shadow-2xl transition-all"
                  >
                    Get Started Now
                  </motion.a>
                </Magnetic>
                <motion.button 
                  whileHover={{ x: 5 }}
                  className="flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-black group"
                >
                  <motion.span animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                    <PlayCircle />
                  </motion.span>
                  <span className="border-b border-black/20 group-hover:border-black pb-0.5 transition-all">Inside the Framework</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column (Halftone Image with Parallax) */}
          <div className="relative bg-white lg:border-l border-gray-50 flex items-center justify-center overflow-hidden">
            <motion.div 
              style={{ y: eagleY, scale: eagleScale, rotate: eagleRotate }}
              className="w-[85%] max-w-[700px] aspect-square relative z-10"
            >
              <Image
                src="/halftone_eagle.png"
                alt="Motion Eagle"
                fill
                className="object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.1)] mix-blend-multiply"
                priority
              />
              
              {/* Floating tech elements */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 5 + i, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i 
                  }}
                  className="absolute w-24 h-24 border border-black/[0.03] rounded-sm pointer-events-none"
                  style={{ 
                    top: `${20 + i * 30}%`, 
                    right: `${10 + i * 5}%`,
                    opacity: 0.5
                  }}
                />
              ))}
            </motion.div>
            
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
        </div>

        {/* Upload Section - Reveal on Scroll */}
        <motion.section 
          id="upload"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-200px" }}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="px-8 py-32 md:px-20 lg:py-56 flex flex-col lg:flex-row gap-24 items-start bg-white"
        >
          <div className="lg:w-1/3 sticky top-32">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-black flex items-center gap-4">
                <span className="w-8 h-[1px] bg-black"></span>
                Phase 01
              </div>
              <h2 className="text-5xl font-medium tracking-tighter text-black leading-tight">Data <br /> Ingestion.</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our parser decodes your professional history into a standardized semantic structure. Precision is the primary directive.
              </p>
            </motion.div>
          </div>

          <div className="lg:w-2/3 w-full group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="border border-gray-100 p-12 lg:p-20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-white rounded-sm relative overflow-hidden"
            >
              <div className="relative z-10">
                <DropZone onFileSelect={handleFileSelect} disabled={status !== 'idle'} />
                <div className="mt-12">
                  <UploadProgress status={status} error={error} fileName={fileName} />
                </div>
              </div>
              
              {/* Background Glow */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 blur-[100px] rounded-full pointer-events-none"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Solutions Section - Grid Reveal */}
        <section id="solutions" className="px-8 py-32 md:px-20 lg:py-48 grid lg:grid-cols-2 gap-8 lg:gap-1 bg-gray-50/30">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black text-white p-12 md:p-24 flex flex-col justify-between min-h-[600px] rounded-[2px]"
          >
            <div className="space-y-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Core Engine</div>
              <h3 className="text-5xl font-medium tracking-tighter leading-none">Automated <br /> Intelligence.</h3>
              
              <div className="space-y-12">
                {coreFeatures.map((feat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-default"
                  >
                    <h4 className="text-xl font-medium mb-3 group-hover:text-emerald-400 transition-colors">{feat.title}</h4>
                    <p className="text-gray-500 text-sm max-w-sm">{feat.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-100 p-12 md:p-24 flex flex-col justify-between min-h-[600px] rounded-[2px]"
          >
            <div className="space-y-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Parameter Control</div>
              <h3 className="text-5xl font-medium tracking-tighter leading-none text-black">Advanced <br /> Variables.</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
                {premiumFeatures.map((feat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col gap-2"
                  >
                    <span className="text-[9px] font-mono text-gray-300">0{i+1}</span>
                    <span className="text-sm font-bold uppercase tracking-widest text-black/80">{feat}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-16 md:px-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-gray-50">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            ResumeOS // Build 04.26 // {new Date().getFullYear()}
          </div>
          <div className="flex gap-8">
             {['Privacy', 'Terms', 'Contact'].map(link => (
               <motion.a 
                key={link}
                whileHover={{ y: -1, color: "#000" }}
                href="#" 
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300"
               >
                 {link}
               </motion.a>
             ))}
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
