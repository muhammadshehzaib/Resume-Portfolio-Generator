'use client';

import { ParsedResume, CustomColors } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ModernTemplateProps {
  data: ParsedResume;
  availableForHire?: boolean;
  darkMode?: boolean;
  photoUrl?: string;
  customColors?: CustomColors;
  sectionOrder?: string[];
}

export default function ModernTemplate({
  data,
  availableForHire,
  darkMode,
  photoUrl,
  customColors,
  sectionOrder,
}: ModernTemplateProps) {
  const [activeTechFilter, setActiveTechFilter] = useState<string | null>(null);

  // High contrast background & text pairings for maximum readability
  const mainBgClass = darkMode ? 'bg-[#090d16]' : 'bg-[#f8fafc]';
  const textClass = darkMode ? 'text-white' : 'text-slate-950';
  const secondaryTextClass = darkMode ? 'text-slate-300' : 'text-slate-700';
  const cardBgClass = darkMode
    ? 'bg-[#111827] border-slate-800 hover:border-slate-700 shadow-lg'
    : 'bg-white border-slate-200 hover:border-slate-300 shadow-md';
  const accentColor = customColors?.primaryColor || '#2563eb';

  const DEFAULT_ORDER = ['projects', 'experience', 'skills', 'education', 'certifications'];
  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER;

  const displayName = data.name || 'Portfolio';
  const primaryRole = data.experiences?.[0]?.title;
  const location = data.contact.location;

  const allTechs = Array.from(
    new Set(data.projects.flatMap((p) => p.technologies || []))
  );

  const filteredProjects = activeTechFilter
    ? data.projects.filter((p) => p.technologies?.includes(activeTechFilter))
    : data.projects;

  const sectionMeta: Record<string, { id: string; label: string }> = {
    projects: { id: 'projects', label: 'Selected Work' },
    experience: { id: 'experience', label: 'Work Experience' },
    education: { id: 'education', label: 'Education' },
    skills: { id: 'skills', label: 'Tech Stack' },
    certifications: { id: 'certifications', label: 'Certifications' },
  };

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'projects':
        return data.projects.length > 0 ? (
          <section key="proj" id={sectionMeta.projects.id} className="py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span
                  className="text-xs font-black uppercase tracking-[0.25em] block mb-2"
                  style={{ color: accentColor }}
                >
                  Featured Projects
                </span>
                <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${textClass}`}>
                  Selected Work & Case Studies
                </h2>
              </div>

              {/* Tech Filter Pills */}
              {allTechs.length > 0 && (
                <div className="flex flex-wrap gap-2 max-w-xl no-print">
                  <button
                    onClick={() => setActiveTechFilter(null)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-full transition-all ${
                      activeTechFilter === null
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md'
                        : 'bg-slate-200/80 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-300'
                    }`}
                  >
                    All ({data.projects.length})
                  </button>
                  {allTechs.slice(0, 6).map((tech) => (
                    <button
                      key={tech}
                      onClick={() =>
                        setActiveTechFilter(activeTechFilter === tech ? null : tech)
                      }
                      className={`text-xs font-bold px-3.5 py-2 rounded-full transition-all ${
                        activeTechFilter === tech
                          ? 'text-white shadow-md'
                          : 'bg-slate-200/80 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-300'
                      }`}
                      style={
                        activeTechFilter === tech
                          ? { backgroundColor: accentColor }
                          : {}
                      }
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((proj, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  data-project-name={proj.name}
                  className={`group relative rounded-3xl border p-8 md:p-10 transition-all duration-300 flex flex-col justify-between ${cardBgClass}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3
                        className={`text-2xl font-bold tracking-tight ${textClass}`}
                      >
                        {proj.name}
                      </h3>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:scale-110 transition-all shadow-sm border border-slate-200 dark:border-slate-700"
                          title="View Live Project"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                    <p
                      className={`text-base leading-relaxed mb-8 ${secondaryTextClass} font-medium`}
                    >
                      {proj.description}
                    </p>
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                      {proj.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300/60 dark:border-slate-700"
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

      case 'experience':
        return data.experiences.length > 0 ? (
          <section key="exp" id={sectionMeta.experience.id} className="py-20">
            <div className="mb-12">
              <span
                className="text-xs font-black uppercase tracking-[0.25em] block mb-2"
                style={{ color: accentColor }}
              >
                Career Journey
              </span>
              <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${textClass}`}>
                Professional Experience
              </h2>
            </div>

            <div className="relative border-l-2 border-slate-300 dark:border-slate-700 ml-4 md:ml-8 space-y-12 pl-6 md:pl-10">
              {data.experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div
                    className="absolute -left-[31px] md:-left-[47px] top-2 w-4 h-4 rounded-full border-4 border-white dark:border-[#090d16] shadow-md"
                    style={{ backgroundColor: accentColor }}
                  ></div>

                  <div className={`p-8 md:p-10 rounded-3xl border ${cardBgClass}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className={`text-2xl font-bold ${textClass}`}>{exp.title}</h3>
                        <p className="text-base font-bold tracking-wide mt-1" style={{ color: accentColor }}>
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-slate-700 self-start md:self-auto">
                        {exp.start_date} - {exp.end_date || 'Present'}
                      </span>
                    </div>

                    {exp.description && exp.description.length > 0 && (
                      <ul className="space-y-3 mt-6">
                        {exp.description.map((desc, i) => (
                          <li key={i} className={`text-base leading-relaxed ${secondaryTextClass} font-medium flex items-start gap-3`}>
                            <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400"></span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return data.skills.length > 0 ? (
          <section key="skills" id={sectionMeta.skills.id} className="py-20">
            <div className="text-center mb-12">
              <span
                className="text-xs font-black uppercase tracking-[0.25em] block mb-2"
                style={{ color: accentColor }}
              >
                Technical Competencies
              </span>
              <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${textClass}`}>
                Tools & Technologies
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
              {data.skills.map((skill, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`text-sm md:text-base font-bold px-6 py-3.5 rounded-2xl border ${cardBgClass} ${textClass} flex items-center gap-2.5 cursor-default`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                  {skill}
                </motion.div>
              ))}
            </div>
          </section>
        ) : null;

      case 'education':
        return data.education.length > 0 ? (
          <section key="edu" id={sectionMeta.education.id} className="py-20">
            <div className="mb-12 text-center">
              <span
                className="text-xs font-black uppercase tracking-[0.25em] block mb-2"
                style={{ color: accentColor }}
              >
                Academic Background
              </span>
              <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${textClass}`}>
                Education
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {data.education.map((edu, idx) => (
                <div key={idx} className={`p-8 rounded-3xl border ${cardBgClass}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className={`text-xl font-bold ${textClass}`}>{edu.degree}</h3>
                    {edu.graduation_year && (
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-slate-700">
                        {edu.graduation_year}
                      </span>
                    )}
                  </div>
                  <p className="text-base font-bold mb-2" style={{ color: accentColor }}>
                    {edu.institution}
                  </p>
                  {edu.field && <p className={`text-sm font-medium ${secondaryTextClass}`}>{edu.field}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'certifications':
        return data.certifications.length > 0 ? (
          <section key="certs" id={sectionMeta.certifications.id} className="py-20">
            <div className="mb-12 text-center">
              <span
                className="text-xs font-black uppercase tracking-[0.25em] block mb-2"
                style={{ color: accentColor }}
              >
                Validated Skills
              </span>
              <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${textClass}`}>
                Certifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {data.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border ${cardBgClass} text-center flex items-center justify-center gap-3`}
                >
                  <svg className="w-5 h-5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={`${textClass} text-sm font-bold`}>{cert}</p>
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
    <div className={`min-h-screen ${mainBgClass} selection:bg-blue-500/20 font-sans relative overflow-hidden`}>
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Modern Hero Section */}
        <section id="about" className="relative flex flex-col items-center justify-center text-center pt-24 pb-20 min-h-[70vh]">
          {photoUrl && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 relative group"
            >
              <img
                src={photoUrl}
                alt={displayName}
                className="w-36 h-36 rounded-full object-cover p-1.5 border-2 shadow-2xl transition-transform duration-300"
                style={{ borderColor: accentColor }}
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            {primaryRole && (
              <div
                className="mb-6 inline-flex items-center gap-2 uppercase tracking-[0.3em] font-extrabold text-xs px-5 py-2.5 rounded-full border shadow-sm"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}44`,
                  backgroundColor: `${accentColor}15`,
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                {primaryRole} {location && `| ${location}`}
              </div>
            )}

            <h1 className={`text-5xl md:text-7xl font-black ${textClass} tracking-tight mb-8 leading-[1.1]`}>
              {displayName}
            </h1>

            {data.summary && (
              <p className={`text-lg md:text-xl ${secondaryTextClass} max-w-3xl mx-auto leading-relaxed font-medium mb-10`}>
                {data.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 no-print">
              <a
                href="#projects"
                className="px-8 py-4 rounded-full text-sm font-extrabold text-white shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                style={{ backgroundColor: accentColor }}
              >
                View Selected Work
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <a
                href="#contact"
                className={`px-8 py-4 rounded-full text-sm font-extrabold border ${cardBgClass} ${textClass} hover:scale-105 transition-all duration-300`}
              >
                Get In Touch
              </a>
            </div>

            {availableForHire && (
              <div className="mt-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest no-print">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Available for New Roles
              </div>
            )}
          </motion.div>
        </section>

        {/* Dynamic Ordered Sections */}
        <div>
          {order.map((sectionName) => (
            <div key={sectionName}>{renderSection(sectionName)}</div>
          ))}

          {/* Contact Section */}
          <section id="contact" className="py-24 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-xs font-black uppercase tracking-[0.25em] block mb-2" style={{ color: accentColor }}>
                Get In Touch
              </span>
              <h2 className={`text-4xl md:text-5xl font-black ${textClass} tracking-tight mb-6`}>
                Let's collaborate
              </h2>
              <p className={`${secondaryTextClass} text-lg font-medium mb-10`}>
                Whether you have a full-time role, consulting project, or technical initiative, my inbox is open.
              </p>
              <div className="flex justify-center items-center gap-4 flex-wrap no-print">
                {data.contact.email && (
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="px-7 py-4 rounded-full text-sm font-extrabold text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                    style={{ backgroundColor: accentColor }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {data.contact.email}
                  </a>
                )}
                {data.contact.linkedin && (
                  <a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-7 py-4 rounded-full text-sm font-extrabold border ${cardBgClass} ${textClass} hover:scale-105 transition-transform`}
                  >
                    LinkedIn
                  </a>
                )}
                {data.contact.github && (
                  <a
                    href={data.contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-7 py-4 rounded-full text-sm font-extrabold border ${cardBgClass} ${textClass} hover:scale-105 transition-transform`}
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-8 text-center text-xs font-bold text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        &copy; {new Date().getFullYear()} {displayName}. All rights reserved.
      </footer>
    </div>
  );
}
