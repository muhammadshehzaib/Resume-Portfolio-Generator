'use client';

import { useState, useEffect } from 'react';
import { SuggestionResult } from '@/lib/types';
import { getPortfolioSuggestions } from '@/lib/api';

interface SuggestionsModalProps {
  portfolioId: string;
  onClose: () => void;
}

export default function SuggestionsModal({
  portfolioId,
  onClose,
}: SuggestionsModalProps) {
  const [result, setResult] = useState<SuggestionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleAnalyze = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const data = await getPortfolioSuggestions(portfolioId);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // Auto-analyze on mount
  useEffect(() => {
    if (!result && !loading && !error) {
      handleAnalyze();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Portfolio Analysis</h2>
            <p className="text-sm text-gray-500 mt-1">Get AI-powered suggestions to improve your portfolio</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={handleAnalyze}
                className="mt-3 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {loading && !result && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-opacity-30 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-gray-600 text-center">Analyzing your portfolio...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Overall Quality Score</p>
                  <p className="text-4xl font-bold text-blue-600">{result.overall_score}/100</p>
                </div>
              </div>

              {/* Issues Section */}
              {result.issues.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🔴</span>
                    <h3 className="font-semibold text-red-900">Critical Issues to Fix</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.issues.map((issue, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-red-800">
                        <span className="font-bold mt-1">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements Section */}
              {result.improvements.length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🟡</span>
                    <h3 className="font-semibold text-yellow-900">Suggestions for Improvement</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-yellow-800">
                        <span className="font-bold mt-1">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Positives Section */}
              {result.positives.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🟢</span>
                    <h3 className="font-semibold text-green-900">What's Working Well</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.positives.map((positive, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-green-800">
                        <span className="font-bold mt-1">•</span>
                        <span>{positive}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
                <p className="font-medium mb-2">💡 Pro Tip:</p>
                <p>Start by fixing the critical issues, then work through the suggestions in order. Make sure to update your portfolio after changes and re-run this analysis to see your improvement!</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
          {result && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            >
              Analyze Again
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {result ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
