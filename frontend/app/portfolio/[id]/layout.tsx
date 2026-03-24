import type { Metadata } from 'next';
import { getPortfolioMeta } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const portfolio = await getPortfolioMeta(id);
    const name = portfolio.parsed_data.name || 'My Portfolio';
    const summary =
      portfolio.parsed_data.summary || 'View this professional portfolio';
    const baseUrl =
      process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000';
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const photoUrl = portfolio.photo_url
      ? `${apiUrl}${portfolio.photo_url}`
      : undefined;

    const pageUrl = portfolio.slug
      ? `${baseUrl}/p/${portfolio.slug}`
      : `${baseUrl}/portfolio/${id}`;

    return {
      title: `${name} — Portfolio`,
      description: summary,
      openGraph: {
        title: `${name} — Portfolio`,
        description: summary,
        url: pageUrl,
        type: 'profile',
        ...(photoUrl && {
          images: [
            {
              url: photoUrl,
              width: 400,
              height: 400,
              alt: `${name}'s profile photo`,
            },
          ],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} — Portfolio`,
        description: summary,
        ...(photoUrl && { images: [photoUrl] }),
      },
    };
  } catch {
    return {
      title: 'Portfolio',
      description: 'Professional portfolio',
    };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
