import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabase';

export const revalidate = 300; // 5 minutes

export default async function DigestsListPage() {
  const supabase = getSupabaseAdmin();
  const { data: digests } = await supabase
    .from('digests')
    .select('digest_date')
    .order('digest_date', { ascending: false })
    .limit(60);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-gray-500 underline hover:text-accent">
        ← Retour
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Les briefs précédents</h1>

      {(!digests || digests.length === 0) && (
        <p className="mt-6 text-gray-600">Aucun brief pour l’instant — reviens demain !</p>
      )}

      <ul className="mt-8 space-y-3">
        {digests?.map((d) => (
          <li key={d.digest_date}>
            <Link
              href={`/digests/${d.digest_date}`}
              className="block rounded-lg border border-gray-200 px-4 py-3 hover:border-accent"
            >
              {new Date(d.digest_date + 'T00:00:00').toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
