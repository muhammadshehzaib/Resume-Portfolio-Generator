import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DropZone from '@/components/upload/DropZone';
import UploadProgress from '@/components/upload/UploadProgress';
import { uploadResume } from '@/lib/api';
import Image from 'next/image';
import { motion, Variants, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Elias Vane",
    role: "CEO, OMNI SYSTEMS",
    content: "...ResumeOS gave us shared context when alignment mattered most. It changed how we made decisions during the transition...",
    image: "https://ui-avatars.com/api/?name=Elias+Vane&background=random&color=fff"
  },
  {
    name: "Sarah Chen",
    role: "VP Engineering, TechFlow",
    content: "The speed at which we could generate professional portfolios for our entire leadership team was incredible. A total game changer for our rebranding.",
    image: "https://ui-avatars.com/api/?name=Sarah+Chen&background=random&color=fff"
  },
  {
    name: "Marcus Thorne",
    role: "Managing Director, Global Strategy",
    content: "In our industry, presentation is everything. ResumeOS ensures our candidate output is always world-class and perfectly tailored.",
    image: "https://ui-avatars.com/api/?name=Marcus+Thorne&background=random&color=fff"
  }
];

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

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const paginate = (newDirection: number) => {
    setCurrentTestimonial((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

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
        <header className="flex flex-wrap items-center justify-between px-6 py-5 md:px-10 border-b border-gray-100 gap-4 relative z-20 bg-white">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 font-bold tracking-widest uppercase text-sm cursor-pointer"
          >
            <HexagonLogo />
            <span>ResumeOS</span>
          </motion.div>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500">
            <motion.a whileHover={{ y: -2 }} href="#solutions" className="hover:text-black transition">Solutions</motion.a>
            <motion.a whileHover={{ y: -2 }} href="#framework" className="hover:text-black transition">Framework</motion.a>
            <motion.a whileHover={{ y: -2 }} href="#how-it-works" className="hover:text-black transition">How It Works</motion.a>
            <motion.a whileHover={{ y: -2 }} href="#case-studies" className="hover:text-black transition">Case Studies</motion.a>
          </nav>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <motion.a 
              whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }} 
              whileTap={{ scale: 0.95 }}
              href="#upload" 
              className="border border-gray-200 px-6 py-2.5 transition rounded-sm flex items-center justify-center min-w-[120px] shadow-sm hover:shadow-md"
            >
              Get Started
            </motion.a>
          </div>
        </header>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 flex-grow border-b border-gray-100 relative z-10">
          {/* Left Column */}
          <div className="px-6 py-12 md:px-14 md:py-24 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col bg-white relative z-10 min-h-[700px]">
            
            <div className="max-w-[550px] flex flex-col flex-grow">
              <motion.div 
                 variants={containerVariants}
                 initial="hidden"
                 animate="show"
                 className="space-y-8"
              >
                <div>
                  <motion.p variants={itemVariants} className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                    AI For High-Stakes Career Leadership
                  </motion.p>
                  
                  <motion.h1 
                    variants={itemVariants} 
                    className="text-5xl md:text-[64px] font-medium tracking-tight leading-[1.05] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900"
                  >
                    When Context Changes, Strategy Follows.
                  </motion.h1>

                  <motion.p variants={itemVariants} className="text-gray-500 text-lg md:text-xl leading-relaxed">
                    When the job market shifts, hesitation is fatal. ResumeOS provides professionals with the real-time context needed to execute career transitions, pivots, and ascensions with total confidence.
                  </motion.p>
                </div>
                
                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 relative z-[100]">
                  <motion.a 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="#upload" 
                    className="bg-black text-white px-8 py-4 text-sm font-medium shadow-xl shadow-black/10 transition-all rounded-sm duration-300 relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10">Transition Roadmap</span>
                  </motion.a>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2, backgroundColor: "#fafafa" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center border border-gray-300 px-8 py-4 text-sm font-medium transition rounded-sm bg-white hover:bg-gray-50"
                  >
                    <PlayCircle />
                    View the Framework
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Testimonial Card - Forced to the bottom */}
              <div className="mt-auto pt-20">
                <div className="max-w-md bg-white border border-gray-200 p-8 shadow-xl shadow-black/[0.03] rounded-sm relative z-20">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gray-100 overflow-hidden filter grayscale rounded-sm border border-gray-200 shrink-0">
                          <Image 
                            src={testimonials[currentTestimonial].image || ""} 
                            width={48} 
                            height={48} 
                            alt={testimonials[currentTestimonial].name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-bold text-base tracking-tight">{testimonials[currentTestimonial].name}</p>
                          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">{testimonials[currentTestimonial].role}</p>
                        </div>
                      </div>
                      <p className="text-base text-gray-600 italic leading-relaxed">
                        "{testimonials[currentTestimonial].content}"
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    <div className="flex gap-4">
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentTestimonial(i)}
                          className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentTestimonial ? 'bg-black w-10' : 'bg-gray-200 w-2.5 hover:bg-gray-400'}`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => paginate(-1)} className="p-3 border border-gray-100 rounded-sm hover:bg-gray-50 hover:border-black transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                       </button>
                       <button onClick={() => paginate(1)} className="p-3 border border-gray-100 rounded-sm hover:bg-gray-50 hover:border-black transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
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
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ 
                 opacity: { delay: 0.4, duration: 1.2 },
                 scale: { delay: 0.4, duration: 1.2 }
               }}
               whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
               className="w-full max-w-xl aspect-square relative z-0 origin-center"
            >
              <Image
                src="/halftone_eagle.png"
                alt="Dot Matrix Eagle"
                fill
                className="object-contain drop-shadow-2xl mix-blend-multiply"
                priority
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
        <section id="upload" className="bg-white border border-gray-200 p-10 md:p-16 flex flex-col md:flex-row gap-12 rounded-sm shadow-xl shadow-black/5 items-center relative overflow-hidden group">
          <div className="md:w-1/3 relative z-10">
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Ingestion Module</motion.p>
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-3xl font-medium tracking-tight mb-4">Initialize Your Matrix</motion.h2>
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-gray-500 text-sm leading-relaxed mb-6">Drop your standard PDF resume to instantly formulate ATS-optimized JSON representations and generate an interactive portfolio.</motion.p>
          </div>
          <div className="md:w-2/3 w-full border border-gray-200/60 shadow-inner bg-gray-50/50 rounded-sm p-8 relative z-10 backdrop-blur-sm transition-all duration-500 group-hover:bg-gray-50/80">
            <DropZone onFileSelect={handleFileSelect} disabled={status !== 'idle'} />
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
          
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </section>

        <section className="grid lg:grid-cols-2 gap-12">
          {/* Core Features */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-black text-white p-10 md:p-16 rounded-sm shadow-2xl overflow-hidden relative transition-transform duration-500"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl origin-bottom-left" 
            />
            
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 relative z-10">Core Systems</p>
            <h2 className="text-3xl font-medium tracking-tight mb-12 relative z-10">Production-ready AI Workflow</h2>
            <div className="space-y-10 relative z-10">
              {coreFeatures.map((feature, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.6, ease: "easeOut" }}
                  key={feature.title} 
                  className="border-l-2 border-gray-800 pl-6 hover:border-gray-500 transition-colors duration-300"
                >
                  <h3 className="text-lg font-medium tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Premium Features */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-200 p-10 md:p-16 rounded-sm shadow-xl shadow-black/5 flex flex-col transition-transform duration-500"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Upgrades</p>
            <h2 className="text-3xl font-medium tracking-tight mb-6">Premium Controls</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Everything needed to position this as a premium capability with upgrade-worthy controls, unlocking advanced tailoring and personalization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mt-auto">
              {premiumFeatures.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ x: 5 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.5 }}
                  key={item} 
                  className="flex items-center gap-3 cursor-default"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1] }} 
                    transition={{ repeat: Infinity, duration: 4, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-black rounded-full"
                  />
                  <span className="text-sm font-medium tracking-tight text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
