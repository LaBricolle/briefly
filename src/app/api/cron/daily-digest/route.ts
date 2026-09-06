import { NextRequest, NextResponse } from 'next/server';
import { fetchAllArticles } from '@/lib/rss';
import { topStories } from '@/lib/scoring';
import { summarizeStories } from '@/lib/summarize';
import { notifyAllSubscribers } from '@/lib/push';
import { getSupabaseAdmin } from '@/lib/supabase';

export const maxDuration = 60; // secondes — laisse le temps à Claude + RSS de répondre

/**
 * Pipeline complet du jour :
 * RSS -> clustering/scoring -> résumé IA -> stockage -> notification push.
 * Appelé par le cron Vercel (voir vercel.json), protégé par CRON_SECRET.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const articles = await fetchAllArticles();
    if (articles.length === 0) {
      return NextResponse.json({ error: 'Aucun article récupéré' }, { status: 502 });
    }

    const clusters = topStories(articles, 5);
    const stories = await summarizeStories(clusters);

    const supabase = getSupabaseAdmin();
    const today = new Date().toISOString().slice(0, 10);
    const { error: upsertError } = await supabase
      .from('digests')
      .upsert({ digest_date: today, stories }, { onConflict: 'digest_date' });

    if (upsertError) throw upsertError;

    const { sent, removed } = await notifyAllSubscribers(stories, today);

    return NextResponse.json({
      ok: true,
      date: today,
      storiesCount: stories.length,
      notificationsSent: sent,
      subscribersRemoved: removed,
    });
  } catch (err: any) {
    console.error('Erreur pipeline daily-digest:', err);
    return NextResponse.json({ error: err?.message || 'Erreur inconnue' }, { status: 500 });
  }
}