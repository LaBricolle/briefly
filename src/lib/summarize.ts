import Anthropic from '@anthropic-ai/sdk';
import { StoryCluster } from './scoring';

export type DigestStory = {
  title: string;
  summary: string;
  imageUrl: string | null;
  sources: { name: string; url: string }[];
};

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Demande à Claude de rédiger, pour chaque sujet retenu, un titre clair et
 * un résumé de 2-3 phrases basé UNIQUEMENT sur les titres/extraits fournis
 * (pas d'invention de faits qui ne seraient pas dans les articles sources).
 */
export async function summarizeStories(clusters: StoryCluster[]): Promise<DigestStory[]> {
  const inputForModel = clusters.map((cluster, i) => ({
    id: i,
    articles: cluster.articles.slice(0, 5).map((a) => ({
      source: a.source,
      title: a.title,
      extrait: a.contentSnippet,
    })),
  }));

  const prompt = `Tu es le rédacteur en chef de "Briefly", une newsletter qui résume en français les
plus grosses actualités du jour en France.

Voici ${clusters.length} sujets d'actualité, chacun avec les titres et extraits de plusieurs
articles qui en parlent. Pour CHAQUE sujet, rédige :
- un titre court et clair (pas un titre putaclic)
- un résumé neutre de 2 à 3 phrases, basé uniquement sur les informations fournies

Réponds UNIQUEMENT avec un tableau JSON de cette forme, sans texte autour :
[{"id": 0, "title": "...", "summary": "..."}, ...]

Sujets :
${JSON.stringify(inputForModel, null, 2)}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  const raw = textBlock && 'text' in textBlock ? textBlock.text : '[]';

  let parsed: { id: number; title: string; summary: string }[] = [];
  try {
    // Le modèle répond en théorie avec du JSON pur, mais on nettoie au cas où
    // il aurait ajouté un ```json autour.
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch (err) {
    console.error('Impossible de parser la réponse de Claude:', raw);
    throw err;
  }

  return parsed.map((item) => {
    const cluster = clusters[item.id];
    // On prend la première image trouvée parmi les articles du sujet.
    const imageUrl = cluster.articles.find((a) => a.imageUrl)?.imageUrl || null;
    return {
      title: item.title,
      summary: item.summary,
      imageUrl,
      sources: cluster.articles.slice(0, 3).map((a) => ({ name: a.source, url: a.link })),
    };
  });
}