import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Briefly — les 5 actus du jour',
  description:
    "Une notification par jour avec les 5 actus les plus importantes en France, résumées simplement.",
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        {children}
        <script
          // Enregistre le service worker (notifications push) dès que possible.
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(console.error);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
