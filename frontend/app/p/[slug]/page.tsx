'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MinimalTemplate from '@/components/portfolio/templates/MinimalTemplate';
import ModernTemplate from '@/components/portfolio/templates/ModernTemplate';
import CreativeTemplate from '@/components/portfolio/templates/CreativeTemplate';
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
    <main className="w-full min-h-screen">
      {renderTemplate()}
    </main>
  );
}
