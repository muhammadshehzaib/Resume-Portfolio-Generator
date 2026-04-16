'use client';

import { ParsedResume, CustomColors } from '@/lib/types';
import { motion } from 'framer-motion';

interface ModernTemplateProps {
  data: ParsedResume;
  availableForHire?: boolean;
  darkMode?: boolean;
  photoUrl?: string;
  customColors?: CustomColors;
  sectionOrder?: string[];
}

export default function ModernTemplate({ data, availableForHire, darkMode, photoUrl, customColors, sectionOrder }: ModernTemplateProps) {
  const mainBgClass = darkMode ? 'bg-[#0a0a0a]' : 'bg-white';
  const contentBgClass = darkMode ? 'bg-white/[0.02]' : 'bg-slate-50/50';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const secondaryTextClass = darkMode ? 'text-slate-400' : 'text-slate-500';
  const borderClass = darkMode ? 'border-white/[0.05]' : 'border-slate-100';
  const accentColor = customColors?.primaryColor || '#3b82f6';

  const DEFAULT_ORDER = ['projects', 'experience', 'skills', 'education', 'certifications'];
  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER;

  const displayName = data.name || 'Portfolio';
  const primaryRole = data.experiences?.[0]?.title;
  const location = data.contact.location;

  const sectionMeta: Record<string, { id: string; label: string }> = {
    projects: { id: 'projects', label: 'Work' },
    experience: { id: 'experience', label: 'Experience' },
    education: { id: 'education', label: 'Education' },
    skills: { id: 'skills', label: 'Skills' },
    certifications: { id: 'certifications', label: 'Certifications' },
  };

  const navItems = [
    { id: 'about', label: 'About', show: true },
    ...order
      .map((sectionName) => {
        const meta = sectionMeta[sectionName];
        if (!meta) return null;
        const show =
          (sectionName === 'projects' && data.projects.length > 0) ||
          (sectionName === 'experience' && data.experiences.length > 0) ||
          (sectionName === 'education' && data.education.length > 0) ||
          (sectionName === 'skills' && data.skills.length > 0) ||
          (sectionName === 'certifications' && data.certifications.length > 0);
        return { id: meta.id, label: meta.label, show };
      })
      .filter(Boolean) as Array<{ id: string; label: string; show: boolean }>,
    { id: 'contact', label: 'Contact', show: true },
  ].filter((item) => item.show);

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'experience':
        return data.experiences.length > 0 ? (
          <section key="exp" id={sectionMeta.experience.id} className="py-24">
            <h2 className={`text-4xl font-extrabold ${textClass} tracking-tight mb-16 text-center`}>
              Experience
            </h2>
            <div className="max-w-4xl mx-auto space-y-8">
              {data.experiences.map((exp, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative ${contentBgClass} p-8 md:p-10 rounded-3xl border ${borderClass} group hover:border-[#3b82f6]/30 transition-colors duration-500`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold ${textClass} mb-1 group-hover:text-current transition-colors duration-300`} style={{ '--tw-text-opacity': '1' } as any}>{exp.title}</h3>
                      <p className="font-semibold text-lg" style={{ color: accentColor }}>{exp.company}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${borderClass} ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {exp.start_date} – {exp.end_date || 'Present'}
                    </div>
                  </div>
                  {exp.description.length > 0 && (
                    <ul className="space-y-3 mt-6">
                      {exp.description.map((desc, i) => (
                        <li key={i} className={`${secondaryTextClass} text-base leading-relaxed flex gap-4`}>
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }}></span> 
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        ) : null;
      case 'education':
        return data.education.length > 0 ? (
          <section key="edu" id={sectionMeta.education.id} className="py-24 border-t border-slate-100 dark:border-white/5">
            <h2 className={`text-4xl font-extrabold ${textClass} tracking-tight mb-16 text-center`}>
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {data.education.map((edu, idx) => (
                <div key={idx} className={`${contentBgClass} p-8 rounded-3xl border ${borderClass}`}>
                  <h3 className={`text-xl font-bold ${textClass} mb-2`}>{edu.degree}</h3>
                  <p className="text-base font-medium mb-4" style={{ color: accentColor }}>{edu.institution}</p>
                  <div className={`flex items-center justify-between mt-8 pt-6 border-t ${borderClass}`}>
                    <span className={`text-sm ${secondaryTextClass} font-medium`}>{edu.field}</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{edu.graduation_year}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'projects':
        return data.projects.length > 0 ? (
          <section key="proj" id={sectionMeta.projects.id} className="py-24">
            <h2 className={`text-4xl font-extrabold ${textClass} tracking-tight mb-16 text-center`}>
              Selected Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {data.projects.map((proj, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`${contentBgClass} p-8 rounded-3xl border ${borderClass} group hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className={`text-2xl font-bold ${textClass}`}>{proj.name}</h3>
                    {proj.url && (
                      <a
                        href={proj.url}
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        target="_blank"
                        rel="noreferrer"
                        title="Visit Project"
                      >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                  </div>
                  <p className={`${secondaryTextClass} text-base mb-8 leading-relaxed`}>{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${borderClass} ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
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
      case 'skills':
        return data.skills.length > 0 ? (
          <section key="skills" id={sectionMeta.skills.id} className="py-24 border-t border-slate-100 dark:border-white/5">
            <h2 className={`text-4xl font-extrabold ${textClass} tracking-tight mb-16 text-center`}>
              Expertise
            </h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto px-4">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className={`text-sm md:text-base font-semibold px-6 py-3 rounded-2xl border ${borderClass} ${contentBgClass} ${textClass} shadow-sm hover:scale-105 hover:bg-white dark:hover:bg-white/10 transition-all duration-300`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ) : null;
      case 'certifications':
        return data.certifications.length > 0 ? (
          <section key="certs" id={sectionMeta.certifications.id} className="py-24">
            <h2 className={`text-4xl font-extrabold ${textClass} tracking-tight mb-16 text-center`}>
              Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {data.certifications.map((cert, idx) => (
                <div key={idx} className={`${contentBgClass} p-6 rounded-2xl border ${borderClass} text-center`}>
                  <p className={`${textClass} text-sm font-semibold`}>{cert}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${mainBgClass} selection:bg-blue-500/20 font-sans`}>
      {/* Dynamic Top Nav */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${borderClass} bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl no-print`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-md" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                 <span className="text-lg font-bold" style={{ color: accentColor }}>{displayName.charAt(0)}</span>
              </div>
            )}
            <span className={`text-lg font-extrabold tracking-tight ${textClass}`}>{displayName}</span>
          </div>
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          {availableForHire && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Available
            </div>
          )}
        </div>
      </header>

      <main className="pt-20">
        {/* Massive Hero Section */}
        <section id="about" className="relative flex flex-col items-center justify-center text-center px-6 min-h-[85vh] overflow-hidden">
          {/* Subtle Background Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-4xl mx-auto"
          >
            {primaryRole && (
              <div className="mb-6 inline-flex uppercase tracking-[0.3em] font-bold text-xs px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-sm" style={{ color: accentColor }}>
                {primaryRole} {location && `— ${location}`}
              </div>
            )}
            
            <h1 className={`text-6xl sm:text-7xl md:text-8xl font-black ${textClass} tracking-tighter mb-8 leading-[1.1]`} style={{ fontFeatureSettings: '"salt"' }}>
              {displayName.split(' ')[0]} <br className="md:hidden" /> is <br className="hidden md:block" /> Building <br className="md:hidden" /> digital <br className="hidden md:block" /> experiences.
            </h1>

            {data.summary && (
              <p className={`text-lg md:text-2xl ${secondaryTextClass} max-w-2xl mx-auto leading-relaxed font-light mb-12`}>
                {data.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 no-print">
              <a
                href="#projects"
                className="px-8 py-4 rounded-full text-sm font-bold text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300"
                style={{ backgroundColor: accentColor }}
              >
                View Selected Work
              </a>
              <a
                href="#contact"
                className={`px-8 py-4 rounded-full text-sm font-bold border ${borderClass} ${contentBgClass} ${textClass} hover:-translate-y-1 transition-all duration-300 shadow-sm`}
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </section>

        {/* Dynamic Sections */}
        <div className="px-6 relative z-10">
          {order.map((sectionName) => (
            <div key={sectionName}>
              {renderSection(sectionName)}
            </div>
          ))}

          {/* Contact Section */}
          <section id="contact" className="py-24 border-t border-slate-100 dark:border-white/5">
             <div className="max-w-3xl mx-auto text-center">
                <h2 className={`text-5xl font-extrabold ${textClass} tracking-tight mb-8`}>
                  Let's collaborate
                </h2>
                <p className={`${secondaryTextClass} text-lg mb-12`}>
                  Whether you have a project in mind or just want to chat, I'm always open to new opportunities.
                </p>
                <div className="flex justify-center gap-6 no-print">
                  {data.contact.email && (
                    <a href={`mailto:${data.contact.email}`} className="flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:scale-110 transition-transform text-slate-800 dark:text-white" title="Email">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </a>
                  )}
                  {data.contact.linkedin && (
                    <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:scale-110 transition-transform text-slate-800 dark:text-white" title="LinkedIn">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  )}
                  {data.contact.github && (
                    <a href={data.contact.github} target="_blank" rel="noreferrer" className="flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:scale-110 transition-transform text-slate-800 dark:text-white" title="GitHub">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                    </a>
                  )}
                </div>
             </div>
          </section>
        </div>
      </main>

      <footer className="py-8 text-center text-sm font-medium text-slate-500 border-t border-slate-100 dark:border-white/5">
        &copy; {new Date().getFullYear()} {displayName}. All rights reserved.
      </footer>
    </div>
  );
}
