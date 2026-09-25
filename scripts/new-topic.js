#!/usr/bin/env node
/**
 * Create New MechWiki Topic
 * Interactive CLI to scaffold a new topic with proper structure
 * Run: node scripts/new-topic.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'data', 'index.json');
const TOPICS_DIR = path.join(ROOT, 'data', 'topics');

const CATEGORIES = [
  { id: 'thermal', name: 'Thermal & Energy Engineering', icon: 'flame' },
  { id: 'fluids', name: 'Fluid Mechanics & Hydraulics', icon: 'droplet' },
  { id: 'solids', name: 'Solid Mechanics & Materials', icon: 'shield' },
  { id: 'machine-design', name: 'Machine Design & Kinematics', icon: 'cog' },
  { id: 'product-design', name: 'Product Design & CAD', icon: 'design' },
  { id: 'cae', name: 'Simulation & Analysis (CAE)', icon: 'computer' },
  { id: 'manufacturing', name: 'Manufacturing & CAM', icon: 'factory' },
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const CALCULATORS = [
  'carnot_calculator',
  'bernoulli_calculator',
  'stress_calculator',
  'gear_calculator',
  'machining_calculator',
  'gdnt_position_calculator',
  'none',
];

const ICONS = [
  'flame', 'droplet', 'shield', 'cog', 'design', 'computer', 'factory',
  'zap', 'waves', 'activity', 'settings', 'ruler', 'bulb', 'pen', 'trend',
  'robot', 'machining', 'spec', 'scale', 'blueprint', 'microscope', 'bearing',
  'bolt', 'coil', 'chain', 'linkage', 'fatigue', 'thermometer', 'target',
  'flask', 'clamp', 'forge', 'weld', 'compass', 'quality', 'printer', 'code'
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function prompt(rl, question, options = {}) {
  const { required = true, validate, default: def } = options;
  while (true) {
    const suffix = def ? ` [${def}]` : '';
    const answer = await rl.question(`${question}${suffix}: `);
    const value = answer.trim() || def;
    if (!required && !value) return '';
    if (validate && !validate(value)) {
      console.log('   Invalid input, please try again.');
      continue;
    }
    return value;
  }
}

async function selectFromList(rl, question, items, key = 'id') {
  console.log(`\n${question}`);
  items.forEach((item, i) => {
    const label = item[key] || item;
    console.log(`  ${i + 1}. ${label}`);
  });
  while (true) {
    const answer = await rl.question(`Select (1-${items.length}): `);
    const idx = parseInt(answer.trim(), 10) - 1;
    if (idx >= 0 && idx < items.length) return items[idx];
    console.log('   Invalid selection, please try again.');
  }
}

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           MechWiki - New Topic Creator                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Load existing index
  const indexData = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
  const existingIds = new Set(indexData.topics.map(t => t.id));

  // Get topic details
  const title = await prompt(rl, 'Topic title', { required: true });
  const id = slugify(title);

  if (existingIds.has(id)) {
    console.error(`\n❌ Topic with ID "${id}" already exists!`);
    process.exit(1);
  }

  const category = await selectFromList(rl, 'Select category:', CATEGORIES, 'name');
  const difficulty = await selectFromList(rl, 'Difficulty:', DIFFICULTIES);
  const readTime = await prompt(rl, 'Estimated read time (e.g., "8 min")', { default: '8 min', validate: v => /^\d+ min$/.test(v) });
  const summary = await prompt(rl, 'One-line summary (20-300 chars)', { required: true, validate: v => v.length >= 20 && v.length <= 300 });
  const icon = await selectFromList(rl, 'Select icon:', ICONS);

  // Tags
  console.log('\nEnter tags (comma-separated, max 10):');
  const tagsInput = await prompt(rl, 'Tags', { required: false });
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean).slice(0, 10) : [];

  // Infobox
  console.log('\n--- Infobox ---');
  const infoboxTitle = await prompt(rl, 'Infobox title', { default: `${title} Quick Specs` });
  const infoboxSymbol = await prompt(rl, 'Infobox symbol (emoji)', { default: '⚙️' });
  const siUnits = await prompt(rl, 'SI Units', { default: 'Various' });
  const primaryFields = await prompt(rl, 'Primary fields', { default: 'Mechanical Engineering' });

  // Key formulas
  console.log('\nKey formulas (enter blank label to finish):');
  const keyFormulas = [];
  while (true) {
    const label = await prompt(rl, `  Formula label (or Enter to finish)`, { required: false });
    if (!label) break;
    const math = await prompt(rl, `  LaTeX math for "${label}"`, { required: true });
    keyFormulas.push({ label, math });
  }

  // Key constants (optional)
  const keyConstants = await prompt(rl, 'Key constants (optional)', { required: false });

  // Sections
  console.log('\n--- Sections ---');
  const sections = [];
  let sectionNum = 1;
  while (true) {
    console.log(`\nSection ${sectionNum} (Enter blank heading to finish):`);
    const heading = await prompt(rl, '  Heading', { required: false });
    if (!heading) break;

    const sectionId = slugify(heading);
    const content = await prompt(rl, '  Content (Markdown, supports $$LaTeX$$ and [[wiki-links]])', { required: true });

    // Calculator selection
    const calc = await selectFromList(rl, '  Embed calculator?', CALCULATORS);
    const calculator = calc === 'none' ? undefined : calc;

    sections.push({
      id: sectionId,
      heading,
      content,
      ...(calculator && { calculator }),
    });
    sectionNum++;
  }

  // Key takeaways
  console.log('\n--- Key Takeaways (Enter blank to finish) ---');
  const keyTakeaways = [];
  while (true) {
    const takeaway = await prompt(rl, `  Takeaway ${keyTakeaways.length + 1}`, { required: false });
    if (!takeaway) break;
    keyTakeaways.push(takeaway);
  }

  // Related topics
  console.log('\n--- Related Topics (Enter blank to finish) ---');
  const availableTopics = indexData.topics.filter(t => t.id !== id).map(t => t.id);
  const relatedTopics = [];
  while (true) {
    const related = await selectFromList(rl, `  Related topic (${relatedTopics.length} added, Enter to finish):`, 
      [{ id: 'done', name: '✓ Done' }, ...availableTopics.map(id => ({ id, name: id }))], 'name');
    if (related.id === 'done') break;
    relatedTopics.push(related.id);
  }

  // Build topic object
  const now = new Date().toISOString().split('T')[0];
  const topic = {
    id,
    title,
    category: category.name,
    categoryId: category.id,
    readTime,
    difficulty,
    icon,
    summary,
    tags,
    lastUpdated: now,
    schemaVersion: 1,
    infobox: {
      title: infoboxTitle,
      imageSymbol: infoboxSymbol,
      keyFormulas,
      siUnits,
      primaryFields,
      ...(keyConstants && { keyConstants }),
    },
    sections,
    keyTakeaways,
    ...(relatedTopics.length && { relatedTopics }),
  };

  // Save topic file
  const topicPath = path.join(TOPICS_DIR, `${id}.json`);
  fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2));
  console.log(`\n✅ Created ${topicPath}`);

  // Update index.json
  indexData.topics.push({
    id,
    title,
    category: category.name,
    categoryId: category.id,
    readTime,
    difficulty,
    icon,
    summary,
    tags,
    lastUpdated: now,
  });
  fs.writeFileSync(INDEX_PATH, JSON.stringify(indexData, null, 2));
  console.log(`✅ Updated ${INDEX_PATH}`);

  // Rebuild search index
  console.log('\n🔄 Rebuilding search index...');
  const { execSync } = await import('child_process');
  execSync('node scripts/build-search-index.js', { stdio: 'inherit', cwd: ROOT });

  console.log('\n🎉 Topic created successfully!');
  console.log(`   View at: #topic/${id}`);
  console.log('\nNext steps:');
  console.log('1. Review the generated JSON files');
  console.log('2. Run `npm run validate` to verify');
  console.log('3. Preview locally with `python -m http.server 8000`');

  rl.close();
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});