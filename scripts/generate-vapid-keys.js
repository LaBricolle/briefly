// Génère une paire de clés VAPID pour le Web Push.
// Usage : npm run generate-vapid-keys
// Copie les valeurs affichées dans ton .env.local (et dans Vercel en prod).
const webpush = require('web-push');

const keys = webpush.generateVAPIDKeys();

console.log('\nAjoute ceci à ton .env.local :\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}\n`);
