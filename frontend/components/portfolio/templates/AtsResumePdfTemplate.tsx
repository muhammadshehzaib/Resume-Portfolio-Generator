'use client';

import { ParsedResume } from '@/lib/types';

interface AtsResumePdfTemplateProps {
  data: ParsedResume;
}

function cleanText(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/—/g, ' - ')
    .replace(/–/g, '-')
    .replace(/\s+-\s+/g, ' - ')
    .trim();
}

export default function AtsResumePdfTemplate({ data }: AtsResumePdfTemplateProps) {
  const contact = data.contact || {};
  const contactItems = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin ? `LinkedIn: ${contact.linkedin.replace(/^https?:\/\//, '')}` : null,
    contact.github ? `GitHub: ${contact.github.replace(/^https?:\/\//, '')}` : null,
    contact.website ? `Portfolio: ${contact.website.replace(/^https?:\/\//, '')}` : null,
  ].filter(Boolean).map(item => cleanText(item));

  return (
    <div className="w-full bg-white text-slate-950 font-sans p-6 md:p-8 max-w-4xl mx-auto leading-normal print:p-0 print:m-0 print:max-w-none print:bg-white text-[11.5px]">
      {/* Global Print Stylesheet for Seamless Page Flow */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm 12mm;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
          }
          * {
            opacity: 1 !important;
            transform: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          section, div {
            break-inside: auto !important;
            page-break-inside: auto !important;
          }
          h1, h2, h3 {
            break-after: avoid;
            page-break-after: avoid;
          }
          li {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* HEADER SECTION */}
      <header className="border-b-2 border-slate-950 pb-3 mb-4">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-950 mb-1">
          {cleanText(data.name) || 'Candidate Name'}
        </h1>
        {contactItems.length > 0 && (
          <div className="text-[10.5px] font-medium text-slate-700 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {contactItems.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span>{item}</span>
                {idx < contactItems.length - 1 && <span className="text-slate-400 font-bold">•</span>}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* PROFESSIONAL SUMMARY */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-slate-800 leading-relaxed text-justify">
            {cleanText(data.summary)}
          </p>
        </section>
      )}

      {/* TECHNICAL SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
            Technical Skills & Competencies
          </h2>
          <div className="text-slate-800 leading-normal">
            <span className="font-bold text-slate-950">Core Stack: </span>
            {data.skills.map(s => cleanText(s)).join(' • ')}
          </div>
        </section>
      )}

      {/* WORK EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-0.5 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3">
            {data.experiences.map((exp, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div>
                    <span className="font-bold text-slate-950 text-[12.5px]">
                      {cleanText(exp.title) || 'Role Title'}
                    </span>
                    {exp.company && (
                      <span className="text-slate-700 font-medium"> | {cleanText(exp.company)}</span>
                    )}
                  </div>
                  {(exp.start_date || exp.end_date) && (
                    <span className="text-[10px] font-bold text-slate-600 shrink-0">
                      {cleanText(exp.start_date)} {exp.start_date && exp.end_date ? '-' : ''} {cleanText(exp.end_date) || 'Present'}
                    </span>
                  )}
                </div>

                {exp.description && exp.description.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800">
                    {exp.description.map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-0.5 leading-normal">
                        {cleanText(bullet)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* KEY PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-0.5 mb-2">
            Key Projects
          </h2>
          <div className="space-y-2.5">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-950 text-[12px]">
                      {cleanText(proj.name)}
                    </span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-[10px] text-slate-600 font-mono">
                        ({proj.technologies.map(t => cleanText(t)).join(', ')})
                      </span>
                    )}
                  </div>
                  {proj.url && (
                    <span className="text-[10px] font-medium text-slate-600 underline">
                      {cleanText(proj.url).replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-800 leading-normal pl-2 border-l-2 border-slate-200">
                    {cleanText(proj.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION & CERTIFICATIONS */}
      {((data.education && data.education.length > 0) || (data.certifications && data.certifications.length > 0)) && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-0.5 mb-2">
            Education & Certifications
          </h2>

          {data.education && data.education.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {data.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-950">{cleanText(edu.degree) || 'Degree'}</span>
                    {edu.field && <span> in {cleanText(edu.field)}</span>}
                    {edu.institution && <span className="text-slate-700">, {cleanText(edu.institution)}</span>}
                  </div>
                  {edu.graduation_year && (
                    <span className="text-[10px] font-bold text-slate-600">{cleanText(edu.graduation_year)}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <div className="text-slate-800">
              <span className="font-bold text-slate-950">Certifications: </span>
              {data.certifications.map(c => cleanText(c)).join(' • ')}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
