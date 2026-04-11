'use client';

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from 'next/image';
import { PlayCircle } from '../shared/Icons';
import Magnetic from '../shared/Magnetic';
import { containerVariants, itemVariants, titleVariants } from '../../lib/animations';

interface HeroProps {
  scrollYProgress: MotionValue<number>;
  heroOpacity: MotionValue<number>;
}

export default function Hero({ scrollYProgress, heroOpacity }: HeroProps) {
  const eagleY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const eagleScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const eagleRotate = useTransform(scrollYProgress, [0, 0.5], [0, 15]);

  return (
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
        
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
    </div>
  );
}
