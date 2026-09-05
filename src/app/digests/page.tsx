import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabase';

export const revalidate = 300; // 5 minutes

function NewspaperIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9h6M7 12h6M7 15h4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function DigestsListPage() {
  const supabase = getSupabaseAdmin();
  const { data: digests } = await supabase
    .from('digests')
    .select('digest_date')
    .order('digest_date', { ascending: false })
    .limit(60);

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent"
        >
          <img src="/logo.png" alt="" className="h-5 w-auto" />
          <span className="ml-1">← Retour à l'accueil</span>
        </Link>

        <h1 className="mt-8 text-3xl font-bold sm:text-4xl">Tous les briefs</h1>
        <p className="mt-2 text-gray-600">
          L'essentiel de l'actu française, jour après jour.
        </p>

        {(!digests || digests.length === 0) && (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
            <p className="text-gray-600">Aucun brief pour l'instant — reviens demain !</p>
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {digests?.map((d) => (
            <li key={d.digest_date}>
              <Link
                href={`/digests/${d.digest_date}`}
                className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                    <NewspaperIcon />
                  </span>
                  <span className="font-medium capitalize text-gray-900">
                    {new Date(d.digest_date + 'T00:00:00').toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </span>
                <span className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-accent">
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}