'use client';

import { useState } from 'react';
import { TailorResult } from '@/lib/types';
import { tailorPortfolio } from '@/lib/api';

interface JobCustomizationModalProps {
  portfolioId: string;
  currentSummary?: string;
  currentSkills: string[];
  onClose: () => void;
  onApply: (tailoredSummary: string, highlightedSkills: string[]) => void;
}

export default function JobCustomizationModal({
  portfolioId,
  currentSummary,
  currentSkills: _currentSkills,
  onClose,
  onApply,
}: JobCustomizationModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<TailorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleTailor = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setError(undefined);
    try {
      const data = await tailorPortfolio(portfolioId, jobDescription);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tailoring failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApply(result.tailored_summary, result.highlighted_skills);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customize for a Job</h2>
            <p className="text-sm text-gray-500 mt-1">Paste a job description and AI will tailor your portfolio</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {!result ? (
            /* Input Phase */
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
                placeholder="Paste the full job description here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                The more detail you paste, the better the tailoring. Include the full job requirements.
              </p>
            </div>
          ) : (
            /* Results Phase */
            <div className="space-y-6">
              {/* Tailored Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  Tailored Summary
                </h3>
                {currentSummary && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">CURRENT</p>
                    <p className="text-sm text-gray-600">{currentSummary}</p>
                  </div>
                )}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">TAILORED</p>
                  <p className="text-sm text-gray-800">{result.tailored_summary}</p>
                </div>
              </div>

              {/* Highlighted Skills */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  Most Relevant Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.highlighted_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match Notes */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-1 text-sm">Match Analysis</h3>
                <p className="text-sm text-amber-800">{result.skill_match_notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
          {!result ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTailor}
                disabled={loading || !jobDescription.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Tailor My Portfolio'
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setResult(null); setError(undefined); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Try Another Job
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Discard
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Apply Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
