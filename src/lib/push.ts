import webpush from 'web-push';
import { getSupabaseAdmin } from './supabase';
import { DigestStory } from './summarize';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT as string,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
  );
  configured = true;
}

/**
 * Envoie la notification "Briefly du jour" à tous les abonnés enregistrés.
 * Un abonnement expiré/invalide (410/404) est supprimé silencieusement plutôt
 * que de faire planter tout l'envoi.
 */
export async function notifyAllSubscribers(stories: DigestStory[]) {
  ensureConfigured();
  const supabase = getSupabaseAdmin();

  const { data: subscribers, error } = await supabase.from('subscribers').select('*');
  if (error) throw error;
  if (!subscribers || subscribers.length === 0) return { sent: 0, removed: 0 };

  const payload = JSON.stringify({
    title: "Briefly — l'actu du jour",
    body: stories
      .slice(0, 3)
      .map((s) => `• ${s.title}`)
      .join('\n'),
    url: '/',
  });

  let sent = 0;
  let removed = 0;

  await Promise.all(
    subscribers.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
        sent++;
        await supabase
          .from('subscribers')
          .update({ last_notified_at: new Date().toISOString() })
          .eq('id', sub.id);
      } catch (err: any) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabase.from('subscribers').delete().eq('id', sub.id);
          removed++;
        } else {
          console.error('Échec envoi notification à', sub.id, err?.message || err);
        }
      }
    })
  );

  return { sent, removed };
}
