import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Le navigateur envoie l'objet PushSubscription renvoyé par
// pushManager.subscribe() : { endpoint, keys: { p256dh, auth } }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { endpoint, keys } = body || {};

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'Abonnement push invalide' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('subscribers')
    .upsert(
      { endpoint, p256dh: keys.p256dh, auth: keys.auth },
      { onConflict: 'endpoint' }
    );

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Impossible d'enregistrer l'abonnement" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
