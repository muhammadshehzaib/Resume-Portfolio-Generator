'use client';

interface TemplateSwitcherProps {
  current: string;
  onChange: (template: string) => void;
}

const templates = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'modern', label: 'Modern' },
  { id: 'creative', label: 'Creative' },
];

export default function TemplateSwitcher({ current, onChange }: TemplateSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`min-w-40 rounded-xl border px-4 py-3 text-left transition-all ${
            current === t.id
              ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-sm'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="text-lg font-semibold leading-none">{t.label}</div>
        </button>
      ))}
    </div>
  );
}
