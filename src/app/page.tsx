import Link from 'next/link';
import SubscribeButton from './subscribe-button';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">Briefly</p>
      <h1 className="text-4xl font-bold sm:text-5xl">L’actu du jour, en 5 titres.</h1>
      <p className="mt-4 max-w-md text-lg text-gray-600">
        Chaque matin, une seule notification qui résume les 5 actualités les plus importantes
        en France. Pas de flux infini, pas de scroll.
      </p>

      <div className="mt-8">
        <SubscribeButton />
      </div>

      <Link href="/digests" className="mt-10 text-sm text-gray-500 underline hover:text-accent">
        Voir les briefs des jours précédents
      </Link>
    </main>
  );
}
