'use client';

import { ParsedResume, CustomColors } from '@/lib/types';
import { motion } from 'framer-motion';

interface MinimalTemplateProps {
  data: ParsedResume;
  availableForHire?: boolean;
  darkMode?: boolean;
  photoUrl?: string;
  customColors?: CustomColors;
  sectionOrder?: string[];
}

export default function MinimalTemplate({
  data,
  availableForHire,
  darkMode,
  photoUrl,
  customColors,
  sectionOrder,
}: MinimalTemplateProps) {
  const bgClass = darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900';
  const textClass = darkMode ? 'text-zinc-100' : 'text-zinc-900';
  const secondaryTextClass = darkMode ? 'text-zinc-400' : 'text-zinc-600';
  const borderClass = darkMode ? 'border-zinc-800' : 'border-zinc-200/60';
  const accentColor = customColors?.primaryColor || '#18181b';

  const DEFAULT_ORDER = ['experience', 'education', 'projects', 'skills', 'certifications'];
  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER;

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'experience':
        return data.experiences.length > 0 ? (
          <section key="exp" id="experience" className={`py-16 border-b ${borderClass}`}>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-12 font-sans" style={{ color: accentColor }}>
              Work History
            </h2>
            <div className="space-y-14">
              {data.experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="max-w-4xl"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-3">
                    <h3 className={`text-2xl md:text-3xl font-serif font-medium ${textClass}`}>
                      {exp.title}
                    </h3>
                    <span className="text-xs uppercase tracking-widest font-mono text-zinc-400">
                      {exp.start_date} - {exp.end_date || 'Present'}
                    </span>
                  </div>
                  <p className="text-base font-serif italic text-zinc-400 mb-6">{exp.company}</p>
                  {exp.description && exp.description.length > 0 && (
                    <div className="space-y-3">
                      {exp.description.map((desc, i) => (
                        <p
                          key={i}
                          className={`text-base md:text-lg leading-relaxed ${secondaryTextClass} font-light`}
                        >
                          {desc}
                        </p>
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
          <section key="edu" id="education" className={`py-16 border-b ${borderClass}`}>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-10 text-zinc-400 font-sans">
              Education
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className={`text-xl font-serif font-medium ${textClass} mb-2`}>
                    {edu.degree}
                  </h3>
                  <p className="text-zinc-400 font-serif italic mb-2">{edu.institution}</p>
                  {edu.graduation_year && (
                    <div className="text-xs font-mono text-zinc-400">{edu.graduation_year}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return data.projects.length > 0 ? (
          <section key="proj" id="projects" className={`py-16 border-b ${borderClass}`}>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-12 text-zinc-400 font-sans">
              Case Studies & Projects
            </h2>
            <div className="space-y-16">
              {data.projects.map((proj, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group"
                >
                  <div className="flex items-baseline justify-between gap-6 mb-4">
                    <h3
                      className={`text-3xl md:text-5xl font-serif font-medium ${textClass} tracking-tight group-hover:translate-x-1 transition-transform`}
                    >
                      {proj.name}
                    </h3>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`shrink-0 text-xs font-bold uppercase tracking-[0.25em] ${
                          darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-black'
                        } border-b border-current pb-1 transition-colors`}
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  <p className={`text-lg md:text-xl leading-relaxed ${secondaryTextClass} font-light max-w-4xl mb-6`}>
                    {proj.description}
                  </p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {proj.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className={`text-xs font-mono px-3 py-1 rounded-md border ${
                            darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-300' : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                          }`}
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

      case 'skills':
        return data.skills.length > 0 ? (
          <section key="skills" id="skills" className="py-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-10 text-zinc-400 font-sans">
              Core Stack & Expertise
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className={`text-xs md:text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                    darkMode
                      ? 'bg-zinc-900/60 text-zinc-200 border-zinc-800 hover:border-zinc-700'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ) : null;

      case 'certifications':
        return null;
      default:
        return null;
    }
  };

  return (
    <div className={`${bgClass} min-h-screen selection:bg-zinc-200 selection:text-black font-sans`}>
      {/* Editorial Header / Hero */}
      <header id="about" className={`pt-20 pb-16 border-b ${borderClass} text-center`}>
        <div className="max-w-5xl mx-auto px-6 md:px-20">
          {photoUrl && (
            <div className="mb-10">
              <img
                src={photoUrl}
                alt={data.name || 'Profile'}
                className="w-28 h-28 rounded-full object-cover border p-1 mx-auto shadow-md"
                style={{ borderColor: darkMode ? '#3f3f46' : '#e4e4e7' }}
              />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className={`text-5xl md:text-7xl font-serif font-medium ${textClass} mb-6 tracking-tight`}>
              {data.name}
            </h1>
            {data.summary && (
              <p className={`text-lg md:text-2xl leading-relaxed ${secondaryTextClass} font-serif italic`}>
                {data.summary}
              </p>
            )}
          </motion.div>

          {availableForHire && (
            <div className="mt-10 flex items-center justify-center gap-3 no-print">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-emerald-500">
                Open for Engagement
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-6 md:px-20 max-w-5xl mx-auto">
        <section id="contact" className={`py-14 border-b ${borderClass} grid md:grid-cols-2 gap-12`}>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-zinc-400 font-sans">
              Contact
            </h2>
            <div className="space-y-3">
              {data.contact.email && <p className={`text-xl ${textClass} font-light`}>{data.contact.email}</p>}
              {data.contact.phone && <p className={`text-base ${secondaryTextClass} font-light`}>{data.contact.phone}</p>}
              {data.contact.location && <p className="text-xs font-mono text-zinc-400">{data.contact.location}</p>}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-zinc-400 font-sans">
              Network
            </h2>
            <div className="flex gap-8">
              {data.contact.linkedin && (
                <a
                  href={data.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-sm font-bold uppercase tracking-widest ${textClass} border-b border-current pb-1`}
                >
                  LinkedIn
                </a>
              )}
              {data.contact.github && (
                <a
                  href={data.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-sm font-bold uppercase tracking-widest ${textClass} border-b border-current pb-1`}
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Dynamic Sections */}
        {order.map((sectionName) => (
          <div key={sectionName}>{renderSection(sectionName)}</div>
        ))}
      </main>

      <footer className="py-32 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.8em] text-zinc-400 mb-3">
          Edition {new Date().getFullYear()}
        </div>
        <p className={`text-sm ${secondaryTextClass} font-light italic font-serif`}>
          Designed with editorial precision.
        </p>
      </footer>
    </div>
  );
}
