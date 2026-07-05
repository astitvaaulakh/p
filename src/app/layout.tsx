import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '1minproduct — Discover Amazing Products',
  description:
    'Discover top-rated Amazon products curated for you. Browse by category and find your next favorite product in under a minute.',
  keywords: 'amazon products, affiliate, best products, online shopping, deals',
  openGraph: {
    title: '1minproduct — Discover Amazing Products',
    description: 'Discover top-rated Amazon products curated for you.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
