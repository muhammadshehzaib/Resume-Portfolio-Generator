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
  const mainBgClass = darkMode ? 'bg-[#0f172a]' : 'bg-gray-50';
  const contentBgClass = darkMode ? 'bg-[#1e293b]' : 'bg-white';
  const textClass = darkMode ? 'text-slate-100' : 'text-slate-900';
  const secondaryTextClass = darkMode ? 'text-slate-400' : 'text-slate-500';
  const borderClass = darkMode ? 'border-slate-800' : 'border-slate-200';
  const accentColor = customColors?.primaryColor || '#3b82f6';

  const DEFAULT_ORDER = ['projects', 'experience', 'skills', 'certifications'];
  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER;

  const displayName = data.name || 'Portfolio';
  const primaryRole = data.experiences?.[0]?.title;
  const location = data.contact.location;

  const sectionMeta: Record<string, { id: string; label: string }> = {
    projects: { id: 'projects', label: 'Projects' },
    experience: { id: 'experience', label: 'Work' },
    education: { id: 'education', label: 'Background' },
    skills: { id: 'skills', label: 'Skills' },
    certifications: { id: 'certifications', label: 'Certifications' },
  };

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'experience':
        return data.experiences.length > 0 ? (
          <section key="exp" id={sectionMeta.experience.id} className="mb-12">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-4">
              Work <span className="h-px bg-slate-200 flex-1"></span>
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`${contentBgClass} p-6 rounded-xl border ${borderClass} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className={`text-lg font-bold ${textClass}`}>{exp.title}</h3>
                      <p className="font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                      {exp.start_date} – {exp.end_date || 'Present'}
                    </span>
                  </div>
                  {exp.description.length > 0 && (
                    <ul className="space-y-2">
                      {exp.description.map((desc, i) => (
                        <li key={i} className={`${secondaryTextClass} text-sm flex gap-3`}>
                          <span className="text-slate-300">•</span> {desc}
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
          <section key="edu" id={sectionMeta.education.id} className="mb-12">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-4">
              Background <span className="h-px bg-slate-200 flex-1"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className={`${contentBgClass} p-6 rounded-xl border ${borderClass} shadow-sm`}>
                  <h3 className={`font-bold ${textClass} mb-1`}>{edu.degree}</h3>
                  <p className="text-sm font-medium mb-3" style={{ color: accentColor }}>{edu.institution}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-medium">{edu.field}</span>
                    <span className="text-xs font-bold text-slate-300">{edu.graduation_year}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'projects':
        return data.projects.length > 0 ? (
          <section key="proj" id={sectionMeta.projects.id} className="mb-12">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-4">
              Selected Projects <span className="h-px bg-slate-200 flex-1"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map((proj, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={`${contentBgClass} p-6 rounded-xl border ${borderClass} shadow-sm group hover:shadow-md transition-all`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-lg font-bold ${textClass} mb-2 group-hover:text-blue-500 transition-colors`}>{proj.name}</h3>
                    {proj.url && (
                      <a
                        href={proj.url}
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit
                      </a>
                    )}
                  </div>
                  <p className={`${secondaryTextClass} text-sm mb-6 line-clamp-4`}>{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
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
          <section key="skills" id={sectionMeta.skills.id} className="mb-12">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-4">
              Toolbox <span className="h-px bg-slate-200 flex-1"></span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border ${borderClass} ${darkMode ? 'bg-slate-900/40 text-slate-200' : 'bg-white text-slate-700'}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ) : null;
      case 'certifications':
        return data.certifications.length > 0 ? (
          <section key="certs" id={sectionMeta.certifications.id} className="mb-12">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-4">
              Certifications <span className="h-px bg-slate-200 flex-1"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.certifications.map((cert, idx) => (
                <div key={idx} className={`${contentBgClass} p-4 rounded-xl border ${borderClass}`}>
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

  const contactSection = (
    <section key="contact" id="contact" className="mb-12">
      <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-4">
        Contact <span className="h-px bg-slate-200 flex-1"></span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${contentBgClass} p-6 rounded-xl border ${borderClass}`}>
          <p className={`text-sm font-semibold ${textClass} mb-1`}>Let’s build something</p>
          <p className={`${secondaryTextClass} text-sm`}>
            {data.contact.email ? 'Best way to reach me is email.' : 'Find me online.'}
          </p>
          <div className="mt-5 space-y-2">
            {data.contact.email && (
              <a href={`mailto:${data.contact.email}`} className="block text-sm font-semibold" style={{ color: accentColor }}>
                {data.contact.email}
              </a>
            )}
            {data.contact.website && (
              <a href={data.contact.website} className="block text-sm text-slate-500 hover:text-slate-800" target="_blank" rel="noreferrer">
                Website
              </a>
            )}
            {data.contact.linkedin && (
              <a href={data.contact.linkedin} className="block text-sm text-slate-500 hover:text-slate-800" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            {data.contact.github && (
              <a href={data.contact.github} className="block text-sm text-slate-500 hover:text-slate-800" target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
          </div>
        </div>
        <div className={`${contentBgClass} p-6 rounded-xl border ${borderClass}`}>
          <p className={`text-sm font-semibold ${textClass} mb-1`}>Location</p>
          <p className={`${secondaryTextClass} text-sm`}>{location || 'Remote / Worldwide'}</p>
          {availableForHire && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Available
            </div>
          )}
        </div>
      </div>
    </section>
  );

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

  return (
    <div className={`flex min-h-screen ${mainBgClass} selection:bg-blue-500/10`}>
      {/* Fixed Sidebar */}
      <aside className={`w-80 h-screen sticky top-0 border-r ${borderClass} ${contentBgClass} p-10 flex flex-col no-print hidden lg:flex`}>
        <div className="mb-10 text-center">
          {photoUrl ? (
            <div className="relative inline-block mb-6">
              <img
                src={photoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover shadow-2xl"
              />
              {availableForHire && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
              )}
            </div>
          ) : (
             <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
               <span className="text-2xl font-bold text-slate-300">{data.name?.charAt(0)}</span>
             </div>
          )}
          <h1 className={`text-xl font-bold ${textClass} tracking-tight`}>{displayName}</h1>
          <p className="text-xs font-medium uppercase tracking-widest mt-2" style={{ color: accentColor }}>
            {primaryRole || location || 'Designer & Engineer'}
          </p>
        </div>

        <nav className="space-y-1 mb-10 flex-1">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className={`block px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                item.id === 'about' ? 'bg-slate-50 text-blue-600' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="space-y-6">
           <div>
             <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">Connection</h3>
             <div className="space-y-3">
               {data.contact.email && (
                 <a href={`mailto:${data.contact.email}`} className="flex items-center gap-3 text-xs text-slate-500 hover:text-blue-500 transition-colors truncate">
                   <span className="w-5 text-center">@</span> {data.contact.email}
                 </a>
               )}
               {data.contact.linkedin && (
                 <a href={data.contact.linkedin} className="flex items-center gap-3 text-xs text-slate-500 hover:text-blue-500 transition-colors">
                   <span className="w-5 text-center">LN</span> LinkedIn
                 </a>
               )}
               {data.contact.github && (
                 <a href={data.contact.github} className="flex items-center gap-3 text-xs text-slate-500 hover:text-blue-500 transition-colors">
                   <span className="w-5 text-center">GH</span> GitHub
                 </a>
               )}
             </div>
           </div>

           {data.skills.length > 0 && (
             <div>
               <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">Core Tech</h3>
               <div className="flex flex-wrap gap-2">
                 {data.skills.slice(0, 10).map((skill, i) => (
                   <span key={i} className="text-[9px] font-bold px-2 py-1 bg-slate-50 text-slate-400 rounded-md border border-slate-100">
                     {skill}
                   </span>
                 ))}
               </div>
             </div>
           )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <div id="about" className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <h2 className={`text-4xl lg:text-5xl font-extrabold ${textClass} leading-tight mb-6 tracking-tighter`}>
              Hi, I’m {displayName}.
            </h2>
            {(primaryRole || location) && (
              <p className={`${secondaryTextClass} text-sm font-bold uppercase tracking-widest mb-6`}>
                {primaryRole ? primaryRole : 'Builder'}{primaryRole && location ? ' · ' : ''}{location || ''}
              </p>
            )}
            {data.summary && (
              <p className={`${secondaryTextClass} text-lg lg:text-xl leading-relaxed max-w-3xl font-medium line-clamp-6`}>
                {data.summary}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3 no-print">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                View Projects
              </a>
              <a
                href="#contact"
                className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold border ${borderClass} ${darkMode ? 'text-slate-200 hover:bg-slate-900/30' : 'text-slate-800 hover:bg-slate-50'}`}
              >
                Contact
              </a>
            </div>
          </motion.div>

          {/* Dynamic Sections */}
          {order.map((sectionName) => (
            <div key={sectionName}>
              {renderSection(sectionName)}
            </div>
          ))}

          {contactSection}
        </div>

        <footer className="mt-24 pt-10 border-t border-slate-200">
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 flex items-center gap-4">
             <span className="w-8 h-px bg-slate-100"></span> 
             Personal Portfolio — Edition {new Date().getFullYear()}
           </p>
        </footer>
      </main>
    </div>
  );
}
