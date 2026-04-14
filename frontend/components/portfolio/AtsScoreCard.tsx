'use client';

interface AtsScoreCardProps {
  score: number;
  feedback: string[];
}

export default function AtsScoreCard({ score, feedback }: AtsScoreCardProps) {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-600';
    if (s >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">ATS Compatibility Score</h3>

      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className={`text-5xl font-bold ${getColor(score)}`}>{score}</div>
          <div className="text-sm text-gray-600">out of 100</div>
        </div>
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              score >= 80
                ? 'bg-green-500'
                : score >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {feedback.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Suggestions for improvement:</h4>
          <ul className="space-y-2">
            {feedback.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-700">
                <span className="text-blue-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
