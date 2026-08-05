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

export default function CreativeTemplate({
  data,
  availableForHire,
  photoUrl,
  customColors,
  sectionOrder,
}: CreativeTemplateProps) {
  const accentColor = customColors?.primaryColor || '#06b6d4';

  const DEFAULT_ORDER = ['experience', 'education', 'projects', 'skills', 'certifications'];
  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER;

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'experience':
        return data.experiences.length > 0 ? (
          <section key="exp" id="experience" className="py-24 border-b border-white/[0.04]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xs font-mono mb-12 uppercase tracking-[0.4em] flex items-center gap-3"
              style={{ color: accentColor }}
            >
              <span className="w-6 h-[1px]" style={{ backgroundColor: accentColor }}></span>
              / Experience Timeline
            </motion.div>
            <div className="space-y-12">
              {data.experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group relative p-8 md:p-10 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/15 transition-all duration-300 backdrop-blur-md"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2">
                    <h3 className="text-3xl font-bold text-white group-hover:translate-x-1 transition-transform">
                      {exp.title}
                    </h3>
                    <span className="text-zinc-500 font-mono text-xs tracking-wider px-3 py-1 rounded-full bg-zinc-800/80 border border-white/5">
                      {exp.start_date} — {exp.end_date || 'PRESENT'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-[2px]" style={{ backgroundColor: accentColor }}></span>
                    <p className="text-lg font-bold tracking-wide text-zinc-300">{exp.company}</p>
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className="space-y-3">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="text-zinc-400 text-sm md:text-base leading-relaxed flex gap-3">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }}></span>
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
          <section key="proj" id="projects" className="py-24 border-b border-white/[0.04]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xs font-mono mb-12 uppercase tracking-[0.4em] flex items-center gap-3"
              style={{ color: accentColor }}
            >
              <span className="w-6 h-[1px]" style={{ backgroundColor: accentColor }}></span>
              / Selected Case Studies
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((proj, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-3xl hover:border-cyan-500/40 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden"
                >
                  {/* Subtle Corner Glow */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl rounded-full pointer-events-none group-hover:opacity-30 transition-opacity"
                    style={{ backgroundColor: accentColor }}
                  ></div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-1 w-12 rounded-full" style={{ backgroundColor: accentColor }}></div>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 flex items-center gap-1.5"
                        >
                          Explore
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform">
                      {proj.name}
                    </h3>
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 font-light">
                      {proj.description}
                    </p>
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {proj.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 text-zinc-300 px-3 py-1 rounded-lg border border-white/5"
                        >
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
              className="text-xs font-mono mb-12 uppercase tracking-[0.4em] flex items-center gap-3"
              style={{ color: accentColor }}
            >
              <span className="w-6 h-[1px]" style={{ backgroundColor: accentColor }}></span>
              / Education & Background
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
              {data.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden"
                >
                  <div className="w-1 h-full absolute left-0 top-0" style={{ backgroundColor: accentColor }}></div>
                  <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                  <p className="text-zinc-400 font-medium mb-3">{edu.institution}</p>
                  {edu.graduation_year && (
                    <span className="text-xs font-mono text-zinc-500 tracking-wider">
                      Graduated: {edu.graduation_year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
      case 'certifications':
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#08080c] text-white min-h-screen selection:bg-cyan-500/30 selection:text-white relative overflow-hidden font-sans">
      {/* Dynamic Background Glow Spheres */}
      <div
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] opacity-20 blur-[160px] rounded-full pointer-events-none"
        style={{ backgroundColor: accentColor }}
      ></div>
      <div
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] opacity-15 blur-[160px] rounded-full pointer-events-none"
        style={{ backgroundColor: accentColor }}
      ></div>

      {/* Hero Section */}
      <section
        id="about"
        className="relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden px-6 py-24 text-center z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          {photoUrl && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-10 relative inline-block"
            >
              <img
                src={photoUrl}
                alt={data.name || 'Profile'}
                className="w-36 h-36 rounded-full object-cover border-2 p-1 bg-zinc-900 shadow-2xl transition-transform duration-500 hover:scale-105"
                style={{ borderColor: `${accentColor}88` }}
              />
            </motion.div>
          )}

          {data.name && (
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/30">
              {data.name}
            </h1>
          )}

          {data.summary && (
            <p className="text-lg md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed font-light tracking-tight px-4 mb-10">
              {data.summary}
            </p>
          )}

          {availableForHire && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md no-print"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 12px ${accentColor}` }}
              ></span>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-zinc-300">
                STATUS: AVAILABLE FOR ENGAGEMENT
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Bento Grid Skills & Reach */}
        <section id="contact" className="py-20 border-b border-white/[0.04]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Skill Bento */}
            <div className="md:col-span-2 bg-zinc-900/40 border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-xl">
              <div className="text-xs font-mono mb-8 uppercase tracking-[0.4em]" style={{ color: accentColor }}>
                / Core Competencies
              </div>
              <div className="flex flex-wrap gap-3">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-sm md:text-base font-bold text-zinc-300 bg-white/5 border border-white/5 px-4 py-2 rounded-2xl hover:bg-white/10 hover:text-white transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Bento */}
            <div className="bg-zinc-900/60 border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-xl flex flex-col justify-between group hover:border-white/15 transition-all">
              <div>
                <div className="text-xs font-mono mb-8 uppercase tracking-[0.4em]" style={{ color: accentColor }}>
                  / Connect
                </div>
                <div className="space-y-4">
                  {data.contact.email && (
                    <div className="text-xl md:text-2xl font-bold tracking-tight text-white break-all">
                      {data.contact.email}
                    </div>
                  )}
                  {data.contact.location && (
                    <div className="text-xs font-mono text-zinc-500">{data.contact.location}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-8 no-print">
                {data.contact.linkedin && (
                  <a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:bg-white hover:text-black transition-all"
                  >
                    LinkedIn
                  </a>
                )}
                {data.contact.github && (
                  <a
                    href={data.contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:bg-white hover:text-black transition-all"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Sections */}
        <div className="pb-32">
          {order.map((sectionName) => (
            <div key={sectionName}>{renderSection(sectionName)}</div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-white/[0.04]">
        <div className="text-xs font-mono mb-2 uppercase tracking-[0.5em] text-zinc-600">
          Digital Portfolio — {new Date().getFullYear()}
        </div>
        <div className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
          © {data.name}
        </div>
      </footer>
    </div>
  );
}
