'use client';

import { ParsedResume, CustomColors } from '@/lib/types';

interface MinimalTemplateProps {
  data: ParsedResume;
  availableForHire?: boolean;
  darkMode?: boolean;
  photoUrl?: string;
  customColors?: CustomColors;
  sectionOrder?: string[];
}

export default function MinimalTemplate({ data, availableForHire, darkMode, photoUrl, customColors, sectionOrder }: MinimalTemplateProps) {
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-slate-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-slate-200';
  const contentTextClass = darkMode ? 'text-gray-300' : 'text-gray-700';
  const accentColor = customColors?.primaryColor || '#3b82f6';

  const DEFAULT_ORDER = ['experience', 'education', 'projects', 'skills', 'certifications'];
  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_ORDER;

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'experience':
        return data.experiences.length > 0 ? (
          <div key="exp" className={`mb-8 pb-6 border-t ${borderClass} print:mb-4 print:pb-2`}>
            <h2 className="text-xl font-serif font-bold mb-4 print:text-lg print:mb-2" style={{ color: accentColor }}>Experience</h2>
            {data.experiences.map((exp, idx) => (
              <div key={idx} className="mb-6 print:mb-3 print:break-inside-avoid">
                <div className="flex justify-between">
                  <h3 className={`font-semibold ${textClass} print:text-sm`}>{exp.title}</h3>
                  <span className={`${secondaryTextClass} text-sm print:text-[10px]`}>{exp.start_date} – {exp.end_date || 'Present'}</span>
                </div>
                <p className={`${secondaryTextClass} print:text-xs font-medium`}>{exp.company}</p>
                {exp.description.length > 0 && (
                  <ul className="mt-2 ml-4 space-y-1 print:mt-1 print:ml-3">
                    {exp.description.map((desc, i) => (
                      <li key={i} className={`${contentTextClass} text-sm print:text-xs`}>• {desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;
      case 'education':
        return data.education.length > 0 ? (
          <div key="edu" className={`mb-8 pb-6 border-t ${borderClass} print:mb-4 print:pb-2`}>
            <h2 className="text-xl font-serif font-bold mb-4 print:text-lg print:mb-2" style={{ color: accentColor }}>Education</h2>
            {data.education.map((edu, idx) => (
              <div key={idx} className="mb-4 print:mb-2 print:break-inside-avoid">
                <div className="flex justify-between">
                  <h3 className={`font-semibold ${textClass} print:text-sm`}>{edu.degree}</h3>
                  {edu.graduation_year && <span className={`${secondaryTextClass} text-sm print:text-[10px]`}>{edu.graduation_year}</span>}
                </div>
                <p className={`${secondaryTextClass} print:text-xs`}>{edu.institution}</p>
                {edu.field && <p className={`text-sm ${contentTextClass} print:text-xs`}>{edu.field}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case 'projects':
        return data.projects.length > 0 ? (
          <div key="proj" className={`mb-8 pb-6 border-t ${borderClass} print:mb-4 print:pb-2`}>
            <h2 className="text-xl font-serif font-bold mb-4 print:text-lg print:mb-2" style={{ color: accentColor }}>Projects</h2>
            {data.projects.map((proj, idx) => (
              <div key={idx} className="mb-4 print:mb-2 print:break-inside-avoid">
                <h3 className={`font-semibold ${textClass} print:text-sm`}>{proj.name}</h3>
                <p className={`${contentTextClass} text-sm print:text-xs`}>{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <p className={`${secondaryTextClass} text-sm mt-1 print:text-[10px] print:mt-0`}>{proj.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        ) : null;
      case 'skills':
        return data.skills.length > 0 ? (
          <div key="skills" className={`mb-8 pb-6 border-t ${borderClass} print:mb-4 print:pb-2`}>
            <h2 className="text-xl font-serif font-bold mb-4 print:text-lg print:mb-2" style={{ color: accentColor }}>Skills</h2>
            <p className={`${contentTextClass} print:text-xs print:leading-relaxed`}>{data.skills.join(' • ')}</p>
          </div>
        ) : null;
      case 'certifications':
        return data.certifications.length > 0 ? (
          <div key="certs" className={`border-t ${borderClass} pt-6 print:pt-2`}>
            <h2 className="text-xl font-serif font-bold mb-4 print:text-lg print:mb-2" style={{ color: accentColor }}>Certifications</h2>
            <ul className="space-y-2 print:space-y-0.5">
              {data.certifications.map((cert, idx) => (
                <li key={idx} className={`${contentTextClass} print:text-xs`}>• {cert}</li>
              ))}
            </ul>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={`${bgClass} p-12 max-w-2xl mx-auto print:bg-white print:text-black print:p-0 print:max-w-none`}>
      {/* Photo */}
      {photoUrl && (
        <div className="text-center mb-8 print:mb-4">
          <img
            src={photoUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 mx-auto print:w-24 print:h-24 print:border-slate-200"
          />
        </div>
      )}

      {/* Header */}
      {data.name && (
        <div className={`text-center mb-8 pb-6 border-b ${borderClass} print:mb-4 print:pb-2 print:border-slate-100`}>
          <h1 className={`text-4xl font-serif font-bold ${textClass} mb-2 print:text-black print:text-3xl`}>{data.name}</h1>
          {data.contact.location && (
            <p className={`${secondaryTextClass} print:text-slate-500 print:text-xs`}>{data.contact.location}</p>
          )}
          {availableForHire && (
            <div className="mt-4 print:hidden">
              <span className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Available for Hire
              </span>
            </div>
          )}
        </div>
      )}

      {/* Contact */}
      <div className={`flex justify-center gap-4 text-sm mb-8 ${secondaryTextClass} print:mb-4 print:text-xs print:text-slate-500`}>
        {data.contact.email && <span className="print:text-black">{data.contact.email}</span>}
        {data.contact.phone && <span>{data.contact.phone}</span>}
        {data.contact.linkedin && <span className="print:hidden">LinkedIn</span>}
        {data.contact.github && <span className="print:hidden">GitHub</span>}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-8 print:mb-4">
          <p className={`${contentTextClass} leading-relaxed print:text-slate-700 print:text-sm`}>{data.summary}</p>
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
  );
}
