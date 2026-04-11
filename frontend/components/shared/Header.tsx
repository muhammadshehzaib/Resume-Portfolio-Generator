'use client';

import { motion } from "framer-motion";
import { HexagonLogo } from "./Icons";
import Magnetic from "./Magnetic";

export default function Header() {
  return (
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
  );
}
