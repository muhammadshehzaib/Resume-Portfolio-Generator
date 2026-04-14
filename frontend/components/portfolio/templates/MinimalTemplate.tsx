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

export default function MinimalTemplate({ data, availableForHire, darkMode, photoUrl, customColors, sectionOrder }: MinimalTemplateProps) {
  const bgClass = darkMode ? 'bg-zinc-950' : 'bg-white';
  const textClass = darkMode ? 'text-zinc-100' : 'text-zinc-900';
  const secondaryTextClass = darkMode ? 'text-zinc-500' : 'text-zinc-400';
  const borderClass = darkMode ? 'border-zinc-800' : 'border-zinc-100';
  const accentColor = customColors?.primaryColor || '#18181b';

  const DEFAULT_ORDER = ['experience', 'education', 'projects', 'skills', 'certifications'];
  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER;

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'experience':
        return data.experiences.length > 0 ? (
          <section key="exp" id="experience" className="py-20 border-b border-zinc-100/50">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-12 text-zinc-300">Experience</h2>
            <div className="space-y-16">
              {data.experiences.map((exp, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-3xl"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
                     <h3 className={`text-2xl font-serif font-medium ${textClass}`}>{exp.title}</h3>
                     <span className="text-sm text-zinc-400 font-serif italic">{exp.company}</span>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-zinc-300 mb-6">
                    {exp.start_date} — {exp.end_date || 'Present'}
                  </div>
                  {exp.description.length > 0 && (
                    <div className="space-y-4">
                      {exp.description.map((desc, i) => (
                        <p key={i} className={`text-lg leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'} font-light`}>
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
          <section key="edu" id="education" className="py-20 border-b border-zinc-100/50">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-12 text-zinc-300">Education</h2>
            <div className="grid md:grid-cols-2 gap-12">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className={`text-xl font-serif font-medium ${textClass} mb-2`}>{edu.degree}</h3>
                  <p className="text-zinc-500 mb-4">{edu.institution}</p>
                  <div className="text-xs font-mono text-zinc-300">{edu.graduation_year}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'projects':
        return data.projects.length > 0 ? (
          <section key="proj" id="projects" className="py-20 border-b border-zinc-100/50">
             <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-12 text-zinc-300">Case Studies</h2>
             <div className="space-y-20">
              {data.projects.map((proj, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <h3 className={`text-4xl md:text-5xl font-serif font-medium ${textClass} mb-6 tracking-tight`}>{proj.name}</h3>
                  <p className={`text-xl leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'} font-light max-w-4xl mb-8`}>
                    {proj.description}
                  </p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                       {proj.technologies.map((tech, i) => (
                         <span key={i} className="text-xs font-bold uppercase tracking-widest text-zinc-300">
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
          <section key="skills" id="skills" className="py-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-12 text-zinc-300">Expertise</h2>
            <div className="columns-2 md:columns-3 gap-12 space-y-4">
              {data.skills.map((skill, idx) => (
                <p key={idx} className={`text-lg ${textClass} font-light`}>{skill}</p>
              ))}
            </div>
          </section>
        ) : null;
      case 'certifications':
        return null; // Grouped or simplified for minimal look
      default:
        return null;
    }
  };

  return (
    <div className={`${bgClass} min-h-screen selection:bg-zinc-200 selection:text-black`}>
      {/* Editorial Header / Hero */}
      <header id="about" className="pt-20 pb-24 px-6 md:px-20 border-b border-zinc-100/50 text-center">
        {photoUrl && (
          <div className="mb-16">
            <img
              src={photoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border border-zinc-200 p-1 mx-auto"
            />
          </div>
        )}
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className={`text-5xl md:text-7xl font-serif font-medium ${textClass} mb-10 tracking-tighter`}>
            {data.name}
          </h1>
          <p className={`text-lg md:text-xl leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-500'} font-serif italic max-w-4xl mx-auto`}>
            {data.summary}
          </p>
        </motion.div>
        
        {availableForHire && (
           <div className="mt-16 flex items-center justify-center gap-4 no-print">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-emerald-500">Open for Engagement</span>
           </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="px-6 md:px-20 max-w-screen-xl mx-auto">
        <div className="py-20 border-b border-zinc-100/50 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-6 text-zinc-300">Contact</h2>
              <div className="space-y-4">
                {data.contact.email && <p className={`text-xl ${textClass} font-light`}>{data.contact.email}</p>}
                {data.contact.phone && <p className={`text-lg ${secondaryTextClass} font-light`}>{data.contact.phone}</p>}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-6 text-zinc-300">Network</h2>
              <div className="flex gap-8">
                {data.contact.linkedin && <a href={data.contact.linkedin} className={`text-sm font-bold uppercase tracking-widest ${textClass} border-b border-black pb-1`}>LinkedIn</a>}
                {data.contact.github && <a href={data.contact.github} className={`text-sm font-bold uppercase tracking-widest ${textClass} border-b border-black pb-1`}>GitHub</a>}
              </div>
            </div>
        </div>

        {/* Dynamic Sections */}
        {order.map((sectionName) => (
          <div key={sectionName}>
            {renderSection(sectionName)}
          </div>
        ))}
      </main>

      <footer className="py-40 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[1em] text-zinc-200 mb-4">Edition {new Date().getFullYear()}</div>
        <p className={`text-sm ${secondaryTextClass} font-light italic`}>Designed with the discipline of minimalism.</p>
      </footer>
    </div>
  );
}

