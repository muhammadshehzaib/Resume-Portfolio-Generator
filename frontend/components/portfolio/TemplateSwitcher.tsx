'use client';

interface TemplateSwitcherProps {
  current: string;
  onChange: (template: string) => void;
}

const templates = [
  {
    id: 'modern',
    label: 'Modern',
    badge: 'Glassmorphic',
    desc: 'SaaS & Tech Lead Showcase',
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
                ? 'border-slate-900 bg-slate-900 text-white shadow-md dark:border-white dark:bg-white dark:text-slate-900 scale-[1.02]'
                : 'border-slate-200/80 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">{t.label}</span>
                <span
                  className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {t.badge}
                </span>
              </div>
              <p
                className={`text-[10px] font-medium mt-0.5 ${
                  isActive ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'
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
