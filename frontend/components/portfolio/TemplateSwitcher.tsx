'use client';

interface TemplateSwitcherProps {
  current: string;
  onChange: (template: string) => void;
}

const templates = [
  { id: 'minimal', label: 'Minimal', description: 'Clean & editorial' },
  { id: 'modern', label: 'Modern', description: 'Two-column sidebar' },
  { id: 'creative', label: 'Creative', description: 'Bold & asymmetric' },
];

export default function TemplateSwitcher({ current, onChange }: TemplateSwitcherProps) {
  return (
    <div className="flex gap-2 mb-6">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2 rounded-lg transition-all ${
            current === t.id
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <div className="font-semibold">{t.label}</div>
          <div className="text-xs opacity-75">{t.description}</div>
        </button>
      ))}
    </div>
  );
}
