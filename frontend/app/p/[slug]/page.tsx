'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MinimalTemplate from '@/components/portfolio/templates/MinimalTemplate';
import ModernTemplate from '@/components/portfolio/templates/ModernTemplate';
import CreativeTemplate from '@/components/portfolio/templates/CreativeTemplate';
import AtsScoreCard from '@/components/portfolio/AtsScoreCard';
import { getPortfolioBySlug } from '@/lib/api';
import { PortfolioResponse } from '@/lib/types';

export default function PublicPortfolioPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolioBySlug(slug);
        setPortfolio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-opacity-30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error || 'Portfolio not found'}</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 underline">← Back to upload</a>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (portfolio.template) {
      case 'modern':
        return (
          <ModernTemplate
            data={portfolio.parsed_data}
            availableForHire={portfolio.available_for_hire}
            darkMode={portfolio.dark_mode}
            photoUrl={portfolio.photo_url}
            customColors={portfolio.custom_colors}
            sectionOrder={portfolio.section_order}
          />
        );
      case 'creative':
        return (
          <CreativeTemplate
            data={portfolio.parsed_data}
            availableForHire={portfolio.available_for_hire}
            darkMode={portfolio.dark_mode}
            photoUrl={portfolio.photo_url}
            customColors={portfolio.custom_colors}
            sectionOrder={portfolio.section_order}
          />
        );
      default:
        return (
          <MinimalTemplate
            data={portfolio.parsed_data}
            availableForHire={portfolio.available_for_hire}
            darkMode={portfolio.dark_mode}
            photoUrl={portfolio.photo_url}
            customColors={portfolio.custom_colors}
            sectionOrder={portfolio.section_order}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-sm">← New portfolio</a>
          <a
            href={`/portfolio/${portfolio.id}`}
            className="text-gray-600 hover:text-gray-700 text-sm underline"
          >
            Edit
          </a>
        </div>
      </div>

      {/* Portfolio Display */}
      <div className="flex gap-6 max-w-7xl mx-auto px-4 py-8">
        {/* Main Portfolio */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {renderTemplate()}
          </div>
        </div>

        {/* ATS Score Sidebar */}
        <div className="w-80">
          <AtsScoreCard score={portfolio.ats_score} feedback={portfolio.ats_feedback} />
        </div>
      </div>
    </div>
  );
}
