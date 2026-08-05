'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AtsResumePdfTemplate from '@/components/portfolio/templates/AtsResumePdfTemplate';
import { getPortfolio } from '@/lib/api';
import { PortfolioResponse } from '@/lib/types';

export default function AtsExportPage() {
  const params = useParams();
  const id = params.id as string;
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio(id);
        setPortfolio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Generating Executive ATS View...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-rose-600 font-sans p-6 text-center">
        <p className="font-bold">{error || 'Portfolio not found'}</p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white">
      <AtsResumePdfTemplate data={portfolio.parsed_data} />
    </main>
  );
}
