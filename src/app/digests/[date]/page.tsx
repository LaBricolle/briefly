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
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/digests" className="text-sm text-gray-500 underline hover:text-accent">
        ← Tous les briefs
      </Link>
      <h1 className="mt-4 text-3xl font-bold">
        {new Date(digest.digest_date + 'T00:00:00').toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </h1>

      <ol className="mt-8 space-y-8">
        {stories.map((story, i) => (
          <li key={i}>
            <h2 className="text-xl font-semibold">
              {i + 1}. {story.title}
            </h2>
            <p className="mt-2 text-gray-700">{story.summary}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {story.sources.map((s, j) => (
                <a
                  key={j}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent underline"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
