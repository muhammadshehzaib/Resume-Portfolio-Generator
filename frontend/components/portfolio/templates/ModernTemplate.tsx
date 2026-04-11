'use client';

import { ParsedResume, CustomColors } from '@/lib/types';

interface ModernTemplateProps {
  data: ParsedResume;
  availableForHire?: boolean;
  darkMode?: boolean;
  photoUrl?: string;
  customColors?: CustomColors;
  sectionOrder?: string[];
}

export default function ModernTemplate({ data, availableForHire, darkMode, photoUrl, customColors, sectionOrder }: ModernTemplateProps) {
  const mainBgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const contentBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const accentColor = customColors?.primaryColor || '#3b82f6';

  const DEFAULT_ORDER = ['experience', 'education', 'projects', 'skills', 'certifications'];
  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER;

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'experience':
        return data.experiences.length > 0 ? (
          <div key="exp" className="mb-8">
            <h2 className="text-sm font-semibold mb-4" style={{ color: accentColor }}>EXPERIENCE</h2>
            {data.experiences.map((exp, idx) => (
              <div key={idx} className={`mb-6 ${contentBgClass} p-4 rounded-lg border ${borderClass}`}>
                <div className="flex justify-between mb-1">
                  <h3 className={`font-semibold ${textClass}`}>{exp.title}</h3>
                  <span className={`${secondaryTextClass} text-sm`}>{exp.start_date} – {exp.end_date || 'Present'}</span>
                </div>
                <p className="font-medium mb-2" style={{ color: accentColor }}>{exp.company}</p>
                {exp.description.length > 0 && (
                  <ul className="space-y-1">
                    {exp.description.map((desc, i) => (
                      <li key={i} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>• {desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;
      case 'education':
        return data.education.length > 0 ? (
          <div key="edu" className="mb-8">
            <h2 className="text-sm font-semibold mb-4" style={{ color: accentColor }}>EDUCATION</h2>
            {data.education.map((edu, idx) => (
              <div key={idx} className={`mb-4 ${contentBgClass} p-4 rounded-lg border ${borderClass}`}>
                <h3 className={`font-semibold ${textClass}`}>{edu.degree}</h3>
                <p style={{ color: accentColor }}>{edu.institution}</p>
                {edu.field && <p className={`text-sm ${secondaryTextClass}`}>{edu.field}</p>}
                {edu.graduation_year && <p className={`text-sm ${secondaryTextClass}`}>{edu.graduation_year}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case 'projects':
        return data.projects.length > 0 ? (
          <div key="proj" className="mb-8">
            <h2 className="text-sm font-semibold mb-4" style={{ color: accentColor }}>PROJECTS</h2>
            {data.projects.map((proj, idx) => (
              <div key={idx} className={`mb-4 ${contentBgClass} p-4 rounded-lg border ${borderClass}`}>
                <h3 className={`font-semibold ${textClass}`}>{proj.name}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mt-1`}>{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proj.technologies.map((tech, i) => (
                      <span key={i} className="text-white text-xs px-2 py-1 rounded" style={{ backgroundColor: accentColor, opacity: 0.8 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null;
      case 'skills':
      case 'certifications':
        return null; // Skills and certifications are in sidebar for modern template
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${mainBgClass} min-h-screen print:bg-white print:block`}>
      {/* Sidebar */}
      <div style={{ backgroundColor: accentColor }} className="w-80 text-white p-8 print:w-full print:bg-white print:text-black print:p-0 print:mb-8 print:border-b-2 print:border-slate-100">
        {photoUrl && (
          <div className="mb-6 text-center print:text-left print:flex print:items-center print:gap-4">
            <img
              src={photoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-3 border-white mx-auto print:mx-0 print:w-20 print:h-20 print:border-slate-200"
            />
            {data.name && (
              <h1 className="hidden print:block text-4xl font-bold">{data.name}</h1>
            )}
          </div>
        )}
        {data.name && (
          <h1 className="text-3xl font-bold mb-2 print:hidden">{data.name}</h1>
        )}
        {data.contact.location && (
          <p className="mb-6 print:mb-2 print:text-sm" style={{ color: '#fbbf24' }}>{data.contact.location}</p>
        )}
        {availableForHire && (
          <div className="mb-6 print:hidden">
            <span className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Available for Hire
            </span>
          </div>
        )}

        {/* Contact Info (Inline for print) */}
        <div className="mb-8 print:mb-4 print:flex print:flex-wrap print:gap-x-6 print:gap-y-1">
          <h3 className="text-sm font-semibold mb-3 print:hidden" style={{ color: 'rgba(255,255,255,0.7)' }}>CONTACT</h3>
          <div className="space-y-2 text-sm print:contents">
            {data.contact.email && <p className="print:text-xs">{data.contact.email}</p>}
            {data.contact.phone && <p className="print:text-xs">{data.contact.phone}</p>}
            {data.contact.linkedin && <p className="print:hidden"><a href={data.contact.linkedin} className="text-blue-300 hover:text-blue-200">LinkedIn</a></p>}
            {data.contact.github && <p className="print:hidden"><a href={data.contact.github} className="text-blue-300 hover:text-blue-200">GitHub</a></p>}
          </div>
        </div>

        {/* Skills (Inline pills for print) */}
        {data.skills.length > 0 && (
          <div className="print:mb-4">
            <h3 className="text-sm font-semibold mb-3 print:text-xs print:mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>SKILLS</h3>
            <div className="flex flex-wrap gap-2 print:gap-1">
              {data.skills.slice(0, 12).map((skill, idx) => (
                <span key={idx} className="text-white text-xs px-2 py-1 rounded-full print:bg-slate-100 print:text-slate-700 print:border print:border-slate-200" style={{ backgroundColor: accentColor }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 max-w-3xl print:p-0 print:max-w-none">
        {data.summary && (
          <div className="mb-8 print:mb-6">
            <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>ABOUT</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed print:text-sm print:text-slate-700`}>{data.summary}</p>
          </div>
        )}

        {/* Dynamic Sections */}
        <div className="print:space-y-4">
          {order.map((sectionName) => (
             <div key={sectionName} className="print:break-inside-avoid">
               {renderSection(sectionName)}
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
