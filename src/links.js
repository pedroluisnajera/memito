export const CATEGORIES = ['Memes', 'Videos', 'Cars', 'Shopping', 'Read later', 'Other'];

export function looksLikeUrl(text) {
  const t = text.trim();
  return /^(https?:\/\/|www\.)\S+$/i.test(t) || /^[\w-]+(\.[\w-]+)+\/\S*$/i.test(t);
}

export function normalizeUrl(text) {
  const t = text.trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

export function hostname(url) {
  const m = url.match(/^https?:\/\/([^/?#]+)/i);
  return m ? m[1].replace(/^www\./, '') : url;
}

// A simple first guess of the category from the website. Phase 3 can replace this with AI.
const RULES = [
  { category: 'Videos', hosts: ['youtube.com', 'youtu.be', 'tiktok.com', 'vimeo.com', 'twitch.tv'] },
  { category: 'Memes', hosts: ['instagram.com', '9gag.com', 'reddit.com', 'x.com', 'twitter.com', 'facebook.com'] },
  { category: 'Cars', hosts: ['encuentra24.com', 'autotrader.com', 'cars.com', 'carmax.com', 'autos', 'carros'] },
  { category: 'Shopping', hosts: ['amazon.', 'temu.com', 'shein.com', 'aliexpress.com', 'mercadolibre.', 'ebay.'] },
  { category: 'Read later', hosts: ['medium.com', 'substack.com', 'wikipedia.org', 'news', 'prensalibre.com'] },
];

export function guessCategory(url) {
  const host = hostname(url).toLowerCase();
  const full = url.toLowerCase();
  for (const rule of RULES) {
    if (rule.hosts.some((h) => host.includes(h) || (rule.category === 'Cars' && full.includes(h)))) {
      return rule.category;
    }
  }
  return 'Other';
}
