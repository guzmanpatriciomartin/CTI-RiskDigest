// digestGenerator.js
const Parser = require('rss-parser');
const nodeFetch = require('node-fetch'); // Importa el módulo completo
const fetch = nodeFetch.default || nodeFetch; // **CORRECCIÓN:** Asegura que 'fetch' sea la función callable
const cheerio = require('cheerio');
const { OpenAI } = require('openai');

const parser = new Parser();

const feeds = [
  { title: "Graham Cluley", url: "https://grahamcluley.com/feed/" },
  { title: "Schneier on Security", url: "https://www.schneier.com/tag/cybersecurity/feed/" },
  { title: "KrebsOnSecurity", url: "https://krebsonsecurity.com/feed/" },
  { title: "CSO Online", url: "https://www.csoonline.com/feed/" },
  { title: "Dark Reading", url: "https://www.darkreading.com/rss.xml" },
  { title: "We Live Security (ESET)", url: "https://www.welivesecurity.com/en/rss/feed/" },
  { title: "Sophos News", url: "https://news.sophos.com/en-us/feed/" },
  { title: "Cyberbuilders Substack", url: "https://cyberbuilders.substack.com/feed" },
  { title: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
  { title: "Zero Day Initiative", url: "https://www.zerodayinitiative.com/rss/published/" }
];

function isWithinRange(date, start, end) {
  return date >= start && date <= end;
}

async function scrapeContent(url) {
  try {
    const res = await fetch(url, { timeout: 10000 });
    const html = await res.text();
    const $ = cheerio.load(html);

    // Limpieza más agresiva para obtener solo el contenido principal
    $('script, style, nav, header, footer, .sidebar, .related-posts, .comments, form').remove();

    const text = $('body').text();
    const cleanText = text.replace(/\s+/g, ' ').trim();

    return cleanText.slice(0, 4000); // Limitar para el prompt de IA
  } catch (error) {
    console.error(`  ERROR al hacer scraping de ${url}: ${error.message}`);
    return '';
  }
}

async function generateBrief(url, title, openaiClient) {
  try {
    console.log(`  > Haciendo scraping de: ${url}`);
    const scrapedText = await scrapeContent(url);

    if (!scrapedText || scrapedText.length < 100) {
      console.warn(`  < Contenido insuficiente para ${url}`);
      return "[No se pudo obtener suficiente contenido para generar resumen]";
    }

    const prompt = `A continuación se presenta el texto extraído de un artículo de ciberseguridad titulado "${title}". Proporciona un resumen conciso en español de no más de 100 palabras, destacando los puntos clave e impacto. Asegúrate de que el resumen sea directamente aplicable para evaluar riesgos de ciberseguridad:\n\n${scrapedText}`;

    console.log(`  > Solicitando brief a OpenRouter para: "${title}"`);
    const chatCompletion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo", // Puedes cambiar a otro modelo compatible
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const brief = chatCompletion.choices[0].message.content.trim();
    console.log(`  < Brief generado.`);
    return brief;

  } catch (error) {
    console.error(`  ERROR al generar brief para ${url}: ${error.message}`);
    return `[ERROR al generar brief: ${error.message}]`;
  }
}

/**
 * Genera un digest de noticias de ciberseguridad como un array de objetos JSON.
 * @param {Date} startDate - Fecha de inicio para filtrar noticias.
 * @param {Date} endDate - Fecha de fin para filtrar noticias.
 * @param {string} openRouterApiKey - Clave API de OpenRouter.
 * @returns {Array<Object>} Un array de objetos de noticias.
 */
async function generateDigestData(startDate, endDate, openRouterApiKey) {
  const openai = new OpenAI({
    apiKey: openRouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  let allItems = [];

  for (const feed of feeds) {
    try {
      console.log(`[DIGEST] Procesando fuente: ${feed.title}`);
      const parsedFeed = await parser.parseURL(feed.url);

      const filteredItems = parsedFeed.items
        .filter(item => {
          const pubDate = new Date(item.pubDate);
          if (isNaN(pubDate.getTime())) {
            console.warn(`[DIGEST] Advertencia: Fecha inválida para el ítem "${item.title}"`);
            return false;
          }
          return isWithinRange(pubDate, startDate, endDate);
        })
        .map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          feedTitle: feed.title,
          description: item.contentSnippet || item.description || '' // Usa contentSnippet si está disponible
        }));

      allItems.push(...filteredItems);
    } catch (error) {
      console.error(`[DIGEST] Error al obtener la fuente ${feed.title}: ${error.message}`);
    }
  }

  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  if (allItems.length > 0) {
    console.log(`[DIGEST] Generando briefs para ${allItems.length} artículos...`);
    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i];
      await new Promise(resolve => setTimeout(resolve, 1500)); // Pausa para evitar límites de tasa
      item.brief = await generateBrief(item.link, item.title, openai);
    }
    console.log("[DIGEST] Generación de briefs completada.\n");
  }

  return allItems;
}

module.exports = { generateDigestData };