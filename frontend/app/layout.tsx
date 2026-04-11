import type { Metadata } from 'next';
import { Outfit, Newsreader } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
});

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
      <body className={`${outfit.variable} ${newsreader.variable} font-sans bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
