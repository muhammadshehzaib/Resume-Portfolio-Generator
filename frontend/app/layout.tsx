import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000'
  ),
  title: 'ResumeOS | AI Resume Portfolio SaaS',
  description:
    'Turn resumes into ATS-ready portfolio websites with AI extraction, live editing, analytics, and shareable links.',
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
