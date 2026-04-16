'use client';

import { ParsedResume, CustomColors } from '@/lib/types';
import { motion } from 'framer-motion';

interface CreativeTemplateProps {
  data: ParsedResume;
  availableForHire?: boolean;
  darkMode?: boolean;
  photoUrl?: string;
  customColors?: CustomColors;
  sectionOrder?: string[];
}

export default function CreativeTemplate({ data, availableForHire, photoUrl, customColors, sectionOrder }: CreativeTemplateProps) {
  const accentColor = customColors?.primaryColor || '#06b6d4';

  const DEFAULT_ORDER = ['experience', 'education', 'projects', 'skills', 'certifications'];
  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER;

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'experience':
        return data.experiences.length > 0 ? (
          <section key="exp" id="experience" className="py-24 border-b border-white/[0.03]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-mono mb-12 uppercase tracking-[0.5em] text-zinc-500"
            >
              / Experience
            </motion.div>
            <div className="space-y-12">
              {data.experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                    <h3 className="text-3xl font-bold text-white group-hover:text-zinc-400 transition-colors">{exp.title}</h3>
                    <span className="text-zinc-600 font-mono text-xs tracking-tighter">{exp.start_date} — {exp.end_date || 'PRESENT'}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-[1px] bg-zinc-800"></span>
                    <p className="text-lg font-medium text-zinc-500 italic">{exp.company}</p>
                  </div>
                  {exp.description.length > 0 && (
                    <ul className="space-y-4">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="text-zinc-400 text-sm leading-relaxed flex gap-3">
                          <span className="text-zinc-700 mt-1">▹</span>
                          {desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        ) : null;
      case 'projects':
        return data.projects.length > 0 ? (
          <section key="proj" id="projects" className="py-24 border-b border-white/[0.03]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-mono mb-12 uppercase tracking-[0.5em] text-zinc-500"
            >
              / Case Studies
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((proj, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-zinc-900/20 backdrop-blur-sm border border-white/[0.02] p-10 rounded-2xl hover:border-white/10 transition-all group"
                >
                  <div className="h-0.5 w-12 bg-zinc-800 mb-8 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform">{proj.name}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="text-[9px] font-bold uppercase tracking-widest bg-white/10 text-zinc-400 px-3 py-1 rounded-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        ) : null;
      case 'education':
        return data.education.length > 0 ? (
          <section key="edu" id="education" className="py-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-mono mb-12 uppercase tracking-[0.5em] text-zinc-500"
            >
              / Education
            </motion.div>
            <div className="grid md:grid-cols-2 gap-12">
              {data.education.map((edu, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-zinc-800"></div>
                  <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                  <p className="text-zinc-500 font-medium mb-2">{edu.institution}</p>
                  <p className="text-zinc-700 text-sm font-mono tracking-tighter">{edu.graduation_year}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'skills':
      case 'certifications':
        return null; // Integrated into bento or separate flows
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-zinc-800 selection:text-white">

      {/* Subtle Grain Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Hero Section */}
      <section id="about" className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        {/* Abstract Background Elements (Minimal) */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/[0.01] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/[0.01] blur-[120px] rounded-full"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {photoUrl && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12 relative inline-block"
            >
              <img
                src={photoUrl}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 rounded-full border border-white/5 scale-110 opacity-30"></div>
            </motion.div>
          )}

          {data.name && (
            <h1 className="text-7xl md:text-[120px] font-black tracking-tighter leading-none mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              {data.name.split(' ').map((word, i) => (
                <span key={i} className="block pb-2">{word}</span>
              ))}
            </h1>
          )}

          {data.summary && (
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed font-light tracking-tight px-4">
              {data.summary}
            </p>
          )}

          {availableForHire && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 flex items-center justify-center gap-3 no-print"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 12px ${accentColor}66` }}
              ></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-600">Status: Available</span>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Bento Grid Skills & Info */}
        <section id="contact" className="py-24 border-b border-white/[0.03]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Skill Bento */}
            <div className="md:col-span-2 bg-white/[0.01] border border-white/5 p-12 rounded-3xl">
              <div className="text-[10px] font-mono mb-12 uppercase tracking-[0.5em] text-zinc-700">/ Core Stack</div>
              <div className="flex flex-wrap gap-x-10 gap-y-6">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-2xl font-bold text-zinc-500 hover:text-white transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Bento - Refined (No AI Colors) */}
            <div className="bg-zinc-900 border border-white/5 p-12 rounded-3xl flex flex-col justify-between group hover:bg-zinc-800/80 transition-all duration-500">
              <div>
                <div className="text-[10px] font-mono mb-12 uppercase tracking-[0.5em] text-zinc-600">/ Reach</div>
                <div className="space-y-6">
                  {data.contact.email && <div className="text-2xl font-bold tracking-tight text-white">{data.contact.email}</div>}
                  {data.contact.location && <div className="text-sm font-mono text-zinc-500">{data.contact.location}</div>}
                </div>
              </div>
              <div className="flex gap-4 mt-12">
                {data.contact.linkedin && (
                  <a href={data.contact.linkedin} className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <span className="text-[10px] font-bold">LN</span>
                  </a>
                )}
                {data.contact.github && (
                  <a href={data.contact.github} className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <span className="text-[10px] font-bold">GH</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Template Sections */}
        <div className="pb-32">
          {order.map((sectionName) => (
            <div key={sectionName}>
              {renderSection(sectionName)}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="py-32 text-center border-t border-white/[0.03]">
        <div className="text-[10px] font-mono mb-4 uppercase tracking-[1em] text-zinc-800">Bespoke Portfolio — MMXVI</div>
        <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">© {new Date().getFullYear()} {data.name}</div>
      </footer>
    </div>
  );
}
