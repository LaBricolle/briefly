import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase';
import { DigestStory } from '@/lib/summarize';

export const revalidate = 300;

export default async function DigestDetailPage({ params }: { params: { date: string } }) {
  const supabase = getSupabaseAdmin();
  const { data: digest } = await supabase
    .from('digests')
    .select('digest_date, stories')
    .eq('digest_date', params.date)
    .single();

  if (!digest) notFound();

  const stories = digest.stories as DigestStory[];

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link href="/digests" className="text-sm text-gray-500 hover:text-accent">← Tous les briefs</Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-accent">Le brief du jour</p>
        <h1 className="mt-1 text-3xl font-bold capitalize sm:text-4xl">
          {new Date(digest.digest_date + 'T00:00:00').toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </h1>

        <ol className="mt-10 space-y-6">
          {stories.map((story, i) => (
            <li
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {story.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={story.imageUrl} alt="" className="h-48 w-full object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <h2 className="text-lg font-semibold sm:text-xl">{story.title}</h2>
                </div>
                <p className="mt-3 text-gray-700">{story.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {story.sources.map((s, j) => (
                    <a key={j} href={s.url} target="_blank" rel="noreferrer" className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-accent hover:text-accent">{s.name}</a>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="font-semibold text-gray-900">Envie de recevoir ça chaque matin ?</p>
          <Link href="/" className="mt-3 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90">Activer les notifications</Link>
        </div>
      </div>
    </main>
  );
}