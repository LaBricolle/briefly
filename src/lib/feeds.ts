// Liste des flux RSS français utilisés pour le MVP.
// Actu générale, plusieurs sensibilités éditoriales pour un scoring plus robuste
// (un sujet repris par plusieurs sources différentes = plus susceptible d'être "gros").
export const FEEDS: { name: string; url: string }[] = [
  { name: 'Franceinfo', url: 'https://www.franceinfo.fr/titres.rss' },
  { name: 'Le Monde', url: 'https://www.lemonde.fr/rss/une.xml' },
  { name: 'Le Figaro', url: 'https://www.lefigaro.fr/rss/figaro_actualites.xml' },
  { name: 'Libération', url: 'https://www.liberation.fr/arc/outboundfeeds/rss/?outputType=xml' },
  { name: 'BFMTV', url: 'https://www.bfmtv.com/rss/news-24-7/' },
  { name: 'Ouest-France', url: 'https://www.ouest-france.fr/rss-en-continu.xml' },
];
