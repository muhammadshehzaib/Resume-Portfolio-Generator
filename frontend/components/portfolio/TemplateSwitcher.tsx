'use client';

interface TemplateSwitcherProps {
  current: string;
  onChange: (template: string) => void;
}

const templates = [
  {
    id: 'modern',
    label: 'Modern',
    badge: 'SaaS Showcase',
    desc: 'Glassmorphic Tech-Lead Layout',
  },
  {
    id: 'creative',
    label: 'Creative',
    badge: 'Neo-Bento',
    desc: 'Cyberpunk & Bento Grid',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    badge: 'Editorial',
    desc: 'Serif & Monocle Luxury',
  },
];

export default function TemplateSwitcher({ current, onChange }: TemplateSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {templates.map((t) => {
        const isActive = current === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all ${
              isActive
                ? 'border-slate-900 bg-slate-900 text-white shadow-md scale-[1.02]'
                : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100 hover:border-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {t.label}
                </span>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {t.badge}
                </span>
              </div>
              <p
                className={`text-[10px] font-bold mt-0.5 ${
                  isActive ? 'text-slate-200' : 'text-slate-600'
                }`}
              >
                {t.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
