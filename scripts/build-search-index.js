#!/usr/bin/env node
/**
 * Build Search Index for MechWiki
 * Generates a FlexSearch-compatible index from all topic JSON files.
 * Run: node scripts/build-search-index.js
 * Output: data/search-index.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOPICS_DIR = path.join(ROOT, 'data', 'topics');
const INDEX_PATH = path.join(ROOT, 'data', 'index.json');
const OUTPUT_PATH = path.join(ROOT, 'data', 'search-index.json');

// Simple tokenizer for FlexSearch-like index
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

function extractSearchableText(topic) {
  const parts = [
    topic.title,
    topic.summary,
    topic.category,
    ...(topic.tags || []),
    topic.infobox?.title || '',
    topic.infobox?.siUnits || '',
    topic.infobox?.primaryFields || '',
    topic.infobox?.keyConstants || '',
    ...(topic.infobox?.keyFormulas?.map(f => f.label + ' ' + f.math) || []),
    ...topic.sections.map(s => s.heading + ' ' + s.content),
    ...(topic.keyTakeaways || []),
  ];
  return parts.join(' ');
}

function buildIndex() {
  console.log('🔍 Building search index...');

  // Load master index for metadata
  const indexData = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));

  const documents = [];
  const tokenMap = new Map(); // token -> Set of doc indices

  for (const topicMeta of indexData.topics) {
    const topicPath = path.join(TOPICS_DIR, `${topicMeta.id}.json`);
    if (!fs.existsSync(topicPath)) {
      console.warn(`⚠️  Missing topic file: ${topicMeta.id}.json`);
      continue;
    }

    const topic = JSON.parse(fs.readFileSync(topicPath, 'utf-8'));
    const text = extractSearchableText(topic);
    const tokens = tokenize(text);

    const docIndex = documents.length;
    documents.push({
      id: topic.id,
      title: topic.title,
      category: topic.category,
      categoryId: topic.categoryId,
      summary: topic.summary,
      tags: topic.tags,
      difficulty: topic.difficulty,
      readTime: topic.readTime,
      icon: topic.icon,
      url: `#topic/${topic.id}`,
    });

    // Build inverted index
    for (const token of tokens) {
      if (!tokenMap.has(token)) {
        tokenMap.set(token, new Set());
      }
      tokenMap.get(token).add(docIndex);
    }
  }

  // Convert Sets to Arrays for JSON serialization
  const index = {};
  for (const [token, docSet] of tokenMap) {
    index[token] = Array.from(docSet);
  }

  const output = {
    version: 1,
    generated: new Date().toISOString(),
    documentCount: documents.length,
    documents,
    index,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`✅ Search index written to ${OUTPUT_PATH}`);
  console.log(`   Documents: ${documents.length}`);
  console.log(`   Unique tokens: ${Object.keys(index).length}`);
  console.log(`   File size: ${(fs.statSync(OUTPUT_PATH).size / 1024).toFixed(1)} KB`);
}

buildIndex();