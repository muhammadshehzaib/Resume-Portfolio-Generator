'use client';

import { ParsedResume, CustomColors } from '@/lib/types';

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
          <div key="exp" className="mb-12">
            <div className="text-xs font-mono mb-6 uppercase tracking-widest" style={{ color: accentColor }}>
              → EXPERIENCE
            </div>
            <div className="space-y-8">
              {data.experiences.map((exp, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-1 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-full flex-shrink-0" />
                  <div className="pb-8">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                      <span className="text-gray-400 text-sm">{exp.start_date} – {exp.end_date || 'Present'}</span>
                    </div>
                    <p className="font-semibold mb-2" style={{ color: accentColor }}>{exp.company}</p>
                    {exp.description.length > 0 && (
                      <ul className="space-y-1">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="text-gray-300 text-sm">▪ {desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case 'projects':
        return data.projects.length > 0 ? (
          <div key="proj" className="mb-12">
            <div className="text-xs font-mono mb-6 uppercase tracking-widest" style={{ color: accentColor }}>
              → PROJECTS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="bg-zinc-900 border border-violet-500 border-opacity-30 p-6 rounded-lg hover:border-opacity-100 transition-all">
                  <h3 className="text-lg font-bold text-white mb-2">{proj.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="text-xs bg-cyan-500 bg-opacity-20 text-cyan-300 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case 'education':
        return data.education.length > 0 ? (
          <div key="edu" className="mb-12">
            <div className="text-xs font-mono mb-6 uppercase tracking-widest" style={{ color: accentColor }}>
              → EDUCATION
            </div>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="border-l-2 border-violet-500 pl-4">
                  <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                  <p style={{ color: accentColor }}>{edu.institution}</p>
                  {edu.field && <p className="text-gray-400 text-sm">{edu.field}</p>}
                  {edu.graduation_year && <p className="text-gray-500 text-sm">{edu.graduation_year}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case 'skills':
      case 'certifications':
        return null; // These are in the header grid
      default:
        return null;
    }
  };
  return (
    <div className="bg-zinc-950 text-white min-h-screen print:bg-white print:text-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 p-16 text-center print:bg-white print:bg-none print:text-black print:p-8 print:border-b-2 print:border-slate-100">
        {photoUrl && (
          <div className="mb-8 print:mb-4">
            <img
              src={photoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white mx-auto print:border-slate-200 print:w-24 print:h-24"
            />
          </div>
        )}
        {data.name && (
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-cyan-200 print:text-black print:bg-none print:from-black print:to-black">
            {data.name}
          </h1>
        )}
        {data.summary && (
          <p className="text-xl text-gray-200 max-w-2xl mx-auto print:text-slate-600 print:text-sm">{data.summary}</p>
        )}
        {availableForHire && (
          <div className="mt-6 print:hidden">
            <span className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Available for Hire
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-12 print:py-8">
        {/* Contact & Skills in Grid */}
        <div className="grid grid-cols-2 gap-8 mb-12 print:mb-8 print:gap-4">
          {/* Contact */}
          <div>
            <div className="text-xs font-mono mb-3 uppercase tracking-widest" style={{ color: accentColor }}>
              → CONTACT
            </div>
            <div className="space-y-2 print:space-y-1">
              {data.contact.email && <p className="text-gray-300 print:text-slate-600 print:text-xs">{data.contact.email}</p>}
              {data.contact.phone && <p className="text-gray-300 print:text-slate-600 print:text-xs">{data.contact.phone}</p>}
              {data.contact.location && <p className="text-gray-300 print:text-slate-600 print:text-xs">{data.contact.location}</p>}
              {data.contact.linkedin && <p className="print:hidden"><a href={data.contact.linkedin} className="text-cyan-400 hover:text-cyan-300">LinkedIn</a></p>}
              {data.contact.github && <p className="print:hidden"><a href={data.contact.github} className="text-cyan-400 hover:text-cyan-300">GitHub</a></p>}
            </div>
          </div>

          {/* Top Skills */}
          {data.skills.length > 0 && (
            <div>
              <div className="text-xs font-mono mb-3 uppercase tracking-widest" style={{ color: accentColor }}>
                → SKILLS
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills.slice(0, 8).map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-violet-500 to-cyan-500 px-3 py-1 rounded-lg text-sm font-medium print:bg-slate-100 print:bg-none print:text-slate-700 print:text-xs print:border print:border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Sections */}
        <div className="print:space-y-0 text-white print:text-black">
          {order.map((sectionName) => (
            <div key={sectionName} className="print:bg-white print:text-black">
              {renderSection(sectionName)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
