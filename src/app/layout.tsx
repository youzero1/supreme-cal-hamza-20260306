import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Supreme Cal — Social Calculator',
  description: 'The most social calculator app. Calculate, share, and explore.',
  keywords: ['calculator', 'social', 'math', 'share'],
  authors: [{ name: 'Supreme Cal' }],
  openGraph: {
    title: 'Supreme Cal',
    description: 'The most social calculator app',
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
      <body className="bg-brand-dark min-h-screen">
        {children}
      </body>
    </html>
  );
}
