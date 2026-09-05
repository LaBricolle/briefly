import Parser from 'rss-parser';
import { FEEDS } from './feeds';

export type Article = {
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
  contentSnippet: string;
};

const parser = new Parser({
  timeout: 10_000,
  headers: { 'User-Agent': 'BrieflyBot/0.1 (+https://example.com)' },
});

/**
 * Récupère tous les flux RSS configurés. Un flux qui échoue (timeout, RSS mort)
 * ne fait pas planter les autres : on log et on continue avec ce qu'on a.
 */
export async function fetchAllArticles(): Promise<Article[]> {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);
      return (parsed.items || []).map((item) => ({
        title: (item.title || '').trim(),
        link: item.link || '',
        source: feed.name,
        publishedAt: item.isoDate || item.pubDate || null,
        contentSnippet: (item.contentSnippet || item.content || '').slice(0, 500),
      }));
    })
  );

  const articles: Article[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    } else {
      console.error('Flux RSS indisponible:', result.reason?.message || result.reason);
    }
  }

  // On ne garde que les articles publiés dans les dernières 30h
  // (couvre les décalages entre flux + le cas où le job tourne un peu en retard).
  const cutoff = Date.now() - 30 * 60 * 60 * 1000;
  return articles.filter((a) => {
    if (!a.title || !a.link) return false;
    if (!a.publishedAt) return true; // certains flux n'ont pas toujours de date fiable
    const t = new Date(a.publishedAt).getTime();
    return Number.isNaN(t) || t >= cutoff;
  });
}
