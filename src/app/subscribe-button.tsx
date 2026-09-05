'use client';

import { useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type Status = 'idle' | 'loading' | 'subscribed' | 'error' | 'unsupported' | 'denied';

export default function SubscribeButton() {
  const [status, setStatus] = useState<Status>('idle');

  async function subscribe() {
    setStatus('loading');

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      if (!res.ok) throw new Error('Échec de l’enregistrement côté serveur');
      setStatus('subscribed');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  if (status === 'subscribed') {
    return <p className="text-sm text-green-700">✓ Notifications activées. À demain matin !</p>;
  }
  if (status === 'unsupported') {
    return (
      <p className="text-sm text-gray-500">
        Ton navigateur ne supporte pas les notifications push. Sur iPhone, ajoute d’abord ce
        site à l’écran d’accueil, puis réessaie.
      </p>
    );
  }
  if (status === 'denied') {
    return (
      <p className="text-sm text-gray-500">
        Notifications refusées. Tu peux les réactiver dans les réglages de ton navigateur.
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={subscribe}
        disabled={status === 'loading'}
        className="cta-pulse rounded-full bg-accent px-7 py-3.5 text-white font-medium shadow-lg shadow-blue-500/20 transition hover:scale-105 hover:opacity-90 disabled:opacity-50"
      >
        {status === 'loading' ? 'Activation…' : 'Activer les notifications'}
      </button>
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600">Une erreur est survenue, réessaie.</p>
      )}
    </div>
  );
}
