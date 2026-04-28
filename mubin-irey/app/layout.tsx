import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mubin & Irey | Wedding Invitation',
  description: 'An elegant maroon and cream wedding invitation website.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
