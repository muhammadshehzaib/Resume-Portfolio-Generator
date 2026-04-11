'use client';

import { motion } from "framer-motion";

interface FeatureGridProps {
  coreFeatures: Array<{ title: string; description: string }>;
  premiumFeatures: string[];
}

export default function FeatureGrid({ coreFeatures, premiumFeatures }: FeatureGridProps) {
  return (
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
  );
}
