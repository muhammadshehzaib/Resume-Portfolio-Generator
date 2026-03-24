'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  portfolioId: string;
  slug?: string;
  onClose: () => void;
}

export default function QRCodeModal({ portfolioId, slug, onClose }: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL;

  if (!portfolioUrl) {
    console.error('NEXT_PUBLIC_PORTFOLIO_URL environment variable is not set');
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <p className="text-red-600 mb-4">Error: Portfolio URL is not configured.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const url = slug ? `${portfolioUrl}/p/${slug}` : `${portfolioUrl}/portfolio/${portfolioId}`;

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg') as SVGElement;
    if (!svg) return;

    // Create a canvas element and draw the SVG onto it
    const canvas = document.createElement('canvas');
    const size = 200 + 32; // QR code size + padding
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG to image and draw on canvas
    const svgString = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = slug ? `portfolio-${slug}.png` : `portfolio-${portfolioId}.png`;
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* QR Code Display */}
          <div className="flex justify-center mb-6">
            <div
              ref={qrRef}
              className="p-4 bg-white border-2 border-gray-200 rounded-lg"
            >
              <QRCodeSVG
                value={url}
                size={200}
                level="H"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </div>

          {/* URL Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Portfolio URL:</p>
            <p className="text-sm font-mono text-gray-900 break-all">{url}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 text-center mb-6">
            Download this QR code to share on business cards, printed resumes, or at networking events.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
