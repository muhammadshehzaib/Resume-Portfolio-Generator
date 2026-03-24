'use client';

import { useState } from 'react';

interface ShareButtonProps {
  portfolioId: string;
  slug?: string;
}

export default function ShareButton({ portfolioId, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || window.location.origin;
    const url = slug ? `${portfolioUrl}/p/${slug}` : `${portfolioUrl}/portfolio/${portfolioId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}
