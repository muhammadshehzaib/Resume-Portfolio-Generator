'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadResume } from '@/lib/api';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useMotionValue, 
  useMotionTemplate 
} from "framer-motion";

// Components
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Hero from '@/components/home/Hero';
import IngestionModule from '@/components/home/IngestionModule';
import FeatureGrid from '@/components/home/FeatureGrid';

// Content
import { CORE_FEATURES, PREMIUM_FEATURES } from '@/lib/constants';

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

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Removed expensive mouse follow light effect for performance
  // const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(22, 163, 74, 0.05), transparent 80%)`;
  const background = "none";

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

      {/* Dynamic Background Light - Removed for performance */}
      {/* <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background }} /> */}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="w-full max-w-[1600px] bg-white border border-gray-100 shadow-[0_0_100px_rgba(0,0,0,0.02)] rounded-[2px] overflow-hidden mb-12 flex flex-col relative z-10"
      >
        <Header />
        
        <Hero scrollYProgress={scrollYProgress} heroOpacity={heroOpacity} />

        <IngestionModule 
          status={status} 
          error={error} 
          fileName={fileName} 
          onFileSelect={handleFileSelect} 
        />

        <FeatureGrid coreFeatures={CORE_FEATURES} premiumFeatures={PREMIUM_FEATURES} />

        <Footer />
      </motion.div>
    </div>
  );
}
