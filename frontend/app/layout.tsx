import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000'
  ),
  title: 'Resume Portfolio Generator',
  description: 'Upload your resume, AI extracts info, generates a beautiful portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
