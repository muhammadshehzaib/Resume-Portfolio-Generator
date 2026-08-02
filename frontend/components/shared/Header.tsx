'use client';

import { motion } from "framer-motion";
import { HexagonLogo } from "./Icons";
import Magnetic from "./Magnetic";
import { useAuth } from "@/components/auth/AuthContext";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className="flex items-center justify-between px-8 py-6 md:px-12 border-b border-gray-50 relative z-50 bg-white/95"
    >
      <Link href="/" className="flex items-center gap-3 font-bold tracking-[0.3em] uppercase text-xs cursor-pointer group">
        <HexagonLogo />
        <span className="group-hover:translate-x-1 transition-transform duration-300">ResumeOS</span>
      </Link>
      
      <nav className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
        <motion.a whileHover={{ y: -2, color: "#000" }} href="/" className="transition-colors">Overview</motion.a>
        
        {(!user || user.role === 'recruiter') && (
          <motion.a 
            whileHover={{ y: -2, color: "#000" }} 
            href={user ? "/rank" : "/login"} 
            className="transition-colors text-black"
          >
            Rank Resumes
          </motion.a>
        )}
        
        {(!user || user.role === 'job_seeker') && (
          <motion.a whileHover={{ y: -2, color: "#000" }} href="/#upload" className="transition-colors">
            {user ? "Build Portfolio" : "Framework"}
          </motion.a>
        )}
      </nav>
      
      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-[2px]">
              {user.name} ({user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'})
            </span>
            <button 
              onClick={logout} 
              className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Magnetic>
              <Link 
                href="/signup" 
                className="bg-black text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] shadow-xl shadow-black/10 hover:shadow-zinc-800 hover:bg-zinc-800 transition-all"
              >
                Sign Up
              </Link>
            </Magnetic>
          </div>
        )}
      </div>
    </motion.header>
  );
}
