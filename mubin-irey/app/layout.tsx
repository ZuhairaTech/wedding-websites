import type { Metadata } from 'next';
import './globals.css';

export const metadata = {
  title: "Majlis Perkahwinan Mubin & Irey",
  description:
    "Dengan penuh kesyukuran, kami menjemput anda ke majlis perkahwinan kami.",

  openGraph: {
    title: "Majlis Perkahwinan Mubin & Irey",
    description:
      "Sabtu, 4 September 2026 | Kampung Bendang Pak Yong, Tumpat, Kelantan",
    url: "https://mubin-irey.vercel.app",
    siteName: "Mubin & Irey",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ms_MY",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Majlis Perkahwinan Mubin & Irey",
    description:
      "Sabtu, 4 September 2026 | Kampung Bendang Pak Yong, Tumpat, Kelantan",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

