export async function GET() {
  const baseUrl = 'https://arbo-servis.cz';

  // Define static pages
  const staticPages = [
    '',
    '/nabizene-sluzby',
    '/zajem-o-sluzbu',
    '/o-nas',
    '/cena',
    '/reference',
    '/kontakt',
  ];

  // Create sitemap entries
  const sitemapEntries = [
    // Static pages
    ...staticPages.map(page => ({
      url: `${baseUrl}${page}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: page === '' ? 1.0 : 0.8,
    })),
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
