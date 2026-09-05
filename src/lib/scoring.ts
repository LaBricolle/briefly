import { Article } from './rss';

export type StoryCluster = {
  representativeTitle: string;
  articles: Article[];
  sourceCount: number;
  score: number;
};

const STOPWORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'en', 'à', 'au',
  'aux', 'pour', 'sur', 'dans', 'avec', 'par', 'ce', 'cette', 'ces', 'son',
  'sa', 'ses', 'que', 'qui', 'est', 'sont', 'plus', 'après', 'vers', 'sans',
]);

function significantWords(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // enlève les accents (diacritiques après normalisation NFD)
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w))
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) if (b.has(w)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Regroupe les articles qui parlent probablement du même sujet, en comparant
 * les mots significatifs des titres (heuristique simple, sans IA, pour rester
 * rapide et gratuit). Seuil de similarité choisi empiriquement — à ajuster
 * une fois qu'on a de vrais exemples sous les yeux.
 */
export function clusterArticles(articles: Article[], similarityThreshold = 0.35): StoryCluster[] {
  const clusters: { words: Set<string>; articles: Article[] }[] = [];

  for (const article of articles) {
    const words = significantWords(article.title);
    let bestClusterIndex = -1;
    let bestScore = 0;

    clusters.forEach((cluster, i) => {
      const sim = jaccardSimilarity(words, cluster.words);
      if (sim > bestScore) {
        bestScore = sim;
        bestClusterIndex = i;
      }
    });

    if (bestClusterIndex >= 0 && bestScore >= similarityThreshold) {
      clusters[bestClusterIndex].articles.push(article);
      // Union des mots pour affiner les prochaines comparaisons du cluster
      words.forEach((w) => clusters[bestClusterIndex].words.add(w));
    } else {
      clusters.push({ words, articles: [article] });
    }
  }

  return clusters
    .map((cluster) => {
      const sourceCount = new Set(cluster.articles.map((a) => a.source)).size;
      // Score = nombre de sources différentes (signal principal) + petit bonus
      // de fraîcheur pour départager les ex-aequo.
      const mostRecent = Math.max(
        ...cluster.articles.map((a) => (a.publishedAt ? new Date(a.publishedAt).getTime() : 0))
      );
      const recencyBonus = Number.isFinite(mostRecent) ? mostRecent / 1e13 : 0;
      return {
        representativeTitle: cluster.articles[0].title,
        articles: cluster.articles,
        sourceCount,
        score: sourceCount + recencyBonus,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/** Retourne les N plus gros sujets du jour. */
export function topStories(articles: Article[], n = 5): StoryCluster[] {
  return clusterArticles(articles).slice(0, n);
}
