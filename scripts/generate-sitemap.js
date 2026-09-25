#!/usr/bin/env node
/**
 * Generate SEO Artifacts for MechWiki
 * Creates sitemap.xml, robots.txt, and injects meta tags
 * Run: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'data', 'index.json');
const OUTPUT_DIR = ROOT; // GitHub Pages serves from root

// Configuration - update with your actual GitHub Pages URL
const SITE_URL = process.env.SITE_URL || 'https://YOUR_USERNAME.github.io/YOUR_REPO_NAME';
const BASE_PATH = process.env.BASE_PATH || ''; // e.g., '/REPO_NAME' for project pages

function getFullUrl(route) {
  return `${SITE_URL}${BASE_PATH}${route}`;
}

function generateSitemap(indexData) {
  const urls = [
    { url: getFullUrl('/'), changefreq: 'weekly', priority: 1.0 },
    { url: getFullUrl('/#home'), changefreq: 'weekly', priority: 0.9 },
  ];

  // Add category pages
  for (const cat of indexData.categories) {
    urls.push({
      url: getFullUrl(`/#category/${cat.id}`),
      changefreq: 'weekly',
      priority: 0.7,
    });
  }

  // Add topic pages
  for (const topic of indexData.topics) {
    urls.push({
      url: getFullUrl(`/#topic/${topic.id}`),
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: topic.lastUpdated,
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

function generateRobotsTxt() {
  return `# MechWiki - Robots.txt
User-agent: *
Allow: /

Sitemap: ${getFullUrl('/sitemap.xml')}

# Crawl-delay for respectful crawling
Crawl-delay: 10
`;
}

function generateJsonLd(indexData) {
  // Generate JSON-LD for each topic (can be embedded in topic pages)
  const structuredData = {};

  for (const topic of indexData.topics) {
    structuredData[topic.id] = {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: topic.title,
      description: topic.summary,
      url: getFullUrl(`/#topic/${topic.id}`),
      about: {
        '@type': 'Thing',
        name: topic.category,
      },
      educationalLevel: topic.difficulty,
      timeRequired: `PT${topic.readTime.replace(' min', 'M')}`,
      keywords: topic.tags.join(', '),
      publisher: {
        '@type': 'Organization',
        name: 'MechWiki',
      },
      license: 'https://creativecommons.org/licenses/by/4.0/',
    };
  }

  return structuredData;
}

function generateOpenGraphMeta(topic) {
  return {
    'og:title': topic.title,
    'og:description': topic.summary,
    'og:type': 'article',
    'og:url': getFullUrl(`/#topic/${topic.id}`),
    'og:image': getFullUrl('/assets/og-default.png'), // Placeholder
    'twitter:card': 'summary_large_image',
    'twitter:title': topic.title,
    'twitter:description': topic.summary,
    'twitter:image': getFullUrl('/assets/og-default.png'),
  };
}

function main() {
  console.log('🔍 Generating SEO artifacts...');

  const indexData = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));

  // Generate sitemap.xml
  const sitemap = generateSitemap(indexData);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);
  console.log('✅ sitemap.xml generated');

  // Generate robots.txt
  const robots = generateRobotsTxt();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), robots);
  console.log('✅ robots.txt generated');

  // Generate JSON-LD structured data for topics
  const jsonLd = generateJsonLd(indexData);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'data', 'structured-data.json'), JSON.stringify(jsonLd, null, 2));
  console.log('✅ data/structured-data.json generated');

  // Generate Open Graph meta tags for each topic
  const ogMeta = {};
  for (const topic of indexData.topics) {
    ogMeta[topic.id] = generateOpenGraphMeta(topic);
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'data', 'og-meta.json'), JSON.stringify(ogMeta, null, 2));
  console.log('✅ data/og-meta.json generated');

  console.log('\n📋 Next steps:');
  console.log('1. Update SITE_URL in this script or set SITE_URL env var');
  console.log('2. Add og-default.png to assets/');
  console.log('3. Inject JSON-LD and OG meta in renderer.js renderTopic()');
}

main();