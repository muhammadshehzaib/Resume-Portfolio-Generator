'use client';

import { motion } from "framer-motion";

export default function Footer() {
  return (
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
  );
}
