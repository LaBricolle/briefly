import Link from 'next/link';
import SubscribeButton from './subscribe-button';
import { FEEDS } from '@/lib/feeds';

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="M8 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AddSquareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0" strokeLinecap="round" />
    </svg>
  );
}

function NewspaperIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      <path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9h6M7 12h6M7 15h4" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" strokeLinecap="round" />
    </svg>
  );
}

const howItWorks = [
  {
    icon: <NewspaperIcon />,
    title: "On surveille l'actu",
    text: "Chaque jour, plusieurs médias français sont passés au crible pour repérer les sujets qui reviennent le plus.",
  },
  {
    icon: <SparkleIcon />,
    title: "On résume à l'essentiel",
    text: "Les 5 sujets les plus importants sont résumés en quelques phrases claires, sans jargon.",
  },
  {
    icon: <BellIcon />,
    title: "Tu reçois la notif",
    text: "Une seule notification chaque matin. Tu lis, tu sais l'essentiel, tu passes à autre chose.",
  },
];

const iosSteps = [
  {
    icon: <ShareIcon />,
    title: "1. Ouvre le menu Partager",
    text: "Dans Safari, appuie sur l'icône Partager (le carré avec la flèche) en bas de l'écran.",
  },
  {
    icon: <AddSquareIcon />,
    title: "2. Ajoute à l'écran d'accueil",
    text: 'Fais défiler les options et choisis "Sur l\'écran d\'accueil", puis appuie sur "Ajouter".',
  },
  {
    icon: <BellIcon />,
    title: "3. Active les notifications",
    text: "Ouvre Briefly depuis l'icône sur ton écran d'accueil (pas depuis Safari), puis autorise les notifications.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper">
      {/* Hero */}
      <section className="relative px-6 pt-14 pb-16">
        {/* Blobs décoratifs en fond */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"></div>
          <div
            className="blob absolute top-10 right-1/4 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl"
            style={{ animationDelay: '-6s' }}
          ></div>
        </div>

        <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <img src="/logo.png" alt="Briefly" className="h-16 w-auto sm:h-20" />
          <h1 className="mt-6 text-4xl font-bold sm:text-5xl">L'actu du jour, en 5 titres.</h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            Chaque matin, une seule notification qui résume les 5 actualités les plus importantes
            en France. Pas de flux infini, pas de scroll.
          </p>

          <div className="mt-8">
            <SubscribeButton />
          </div>

          <Link
            href="/digests"
            className="mt-4 text-sm font-medium text-accent underline underline-offset-2 hover:opacity-80"
          >
            Voir un exemple de résumé →
          </Link>

          {/* Exemple concret : à quoi ressemble la notification + le résumé reçu chaque jour */}
          <div className="mt-10 w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
              Exemple, à quoi ça ressemble
            </p>

            {/* Mockup notification iPhone */}
            <div className="mx-auto mt-4 max-w-sm rounded-2xl border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-start gap-3">
                <img src="/logo.png" alt="" className="mt-0.5 h-6 w-6 rounded-md object-contain" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">Briefly</p>
                    <p className="shrink-0 text-xs text-gray-400">7:00</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-700">
                    Ton résumé du jour : vague de chaleur exceptionnelle cette semaine, hausse du
                    prix de l'énergie, rentrée scolaire, nouvel iPhone dévoilé, alerte pollution.
                  </p>
                </div>
              </div>
            </div>

            {/* Mockup d'un des 5 titres du résumé, avec image comme dans un vrai brief */}
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
              <img
                src="/exemple-brief.jpg"
                alt=""
                className="h-40 w-full object-cover sm:h-48"
              />
              <div className="p-4">
                <p className="text-sm font-semibold text-gray-900">
                  1. Une vague de chaleur exceptionnelle va toucher la France cette semaine
                </p>
                <p className="mt-1.5 text-sm text-gray-600">
                  Plusieurs départements sont placés en vigilance orange, avec des températures
                  attendues au-delà de 38°C dès mercredi. Les autorités appellent à la prudence,
                  notamment pour les personnes âgées et les jeunes enfants.
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <span className="text-xs text-gray-400 underline">Franceinfo</span>
                  <span className="text-xs text-gray-400 underline">Ouest-France</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs italic text-gray-400">
              Exemple illustratif — les vrais résumés et leurs photos sont générés chaque matin à
              partir de l'actualité du jour.
            </p>
          </div>

          {/* Guide iOS, juste sous le bouton */}
          <div className="mt-10 w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
            <p className="text-center text-sm font-semibold text-gray-900">
              Sur iPhone, une étape de plus est nécessaire pour recevoir les notifications
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {iosSteps.map((step) => (
                <div key={step.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-accent">
                    {step.icon}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{step.title}</p>
                  <p className="mt-1 text-xs text-gray-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bandeau sources défilant */}
      <section className="border-y border-gray-100 bg-white py-5">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
          L'actu passée au crible, chaque jour
        </p>
        <div className="marquee-wrap marquee-mask overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-10">
            <span className="flex items-center gap-10">
              {FEEDS.map((feed) => (
                <span key={feed.name} className="text-lg font-semibold text-gray-400">
                  {feed.name}
                </span>
              ))}
            </span>
            <span className="flex items-center gap-10" aria-hidden="true">
              {FEEDS.map((feed) => (
                <span key={feed.name} className="text-lg font-semibold text-gray-400">
                  {feed.name}
                </span>
              ))}
            </span>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-b border-gray-100 bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold">Comment ça marche</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {howItWorks.map((step) => (
              <div
                key={step.title}
                className="group rounded-2xl p-4 text-center transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                  {step.icon}
                </div>
                <p className="mt-3 font-semibold">{step.title}</p>
                <p className="mt-1 text-sm text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-10 text-center">
        <Link href="/digests" className="text-sm text-gray-500 underline hover:text-accent">
          Voir les briefs des jours précédents
        </Link>
      </footer>
    </main>
  );
}