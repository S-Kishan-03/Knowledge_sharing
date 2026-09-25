#!/usr/bin/env node
/**
 * Validate MechWiki Topic JSON Files Against Schema
 * Run: node scripts/validate-topics.js
 * Exit code: 0 = all valid, 1 = validation errors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(ROOT, 'data', 'schema', 'topic.schema.json');
const INDEX_PATH = path.join(ROOT, 'data', 'index.json');
const TOPICS_DIR = path.join(ROOT, 'data', 'topics');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'));
const validate = ajv.compile(schema);

function validateTopic(topic, topicId) {
  const valid = validate(topic);
  if (!valid) {
    console.error(`\n❌ ${topicId}.json - Validation failed:`);
    for (const err of validate.errors) {
      const field = err.instancePath || err.schemaPath;
      console.error(`   ${field}: ${err.message}`);
    }
    return false;
  }
  return true;
}

function validateAll() {
  console.log('🔍 Validating topic JSON files...\n');

  const indexData = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
  let allValid = true;
  let validatedCount = 0;

  for (const topicMeta of indexData.topics) {
    const topicPath = path.join(TOPICS_DIR, `${topicMeta.id}.json`);
    if (!fs.existsSync(topicPath)) {
      console.error(`❌ ${topicMeta.id}.json - File not found`);
      allValid = false;
      continue;
    }

    const topic = JSON.parse(fs.readFileSync(topicPath, 'utf-8'));

    // Cross-reference: ensure IDs match
    if (topic.id !== topicMeta.id) {
      console.error(`❌ ${topicMeta.id}.json - ID mismatch: file has "${topic.id}", index expects "${topicMeta.id}"`);
      allValid = false;
      continue;
    }

    // Cross-reference: ensure categoryId matches
    if (topic.categoryId !== topicMeta.categoryId) {
      console.error(`❌ ${topicMeta.id}.json - categoryId mismatch: file has "${topic.categoryId}", index expects "${topicMeta.categoryId}"`);
      allValid = false;
      continue;
    }

    if (validateTopic(topic, topicMeta.id)) {
      console.log(`✅ ${topicMeta.id}.json`);
      validatedCount++;
    } else {
      allValid = false;
    }
  }

  // Check for orphaned topic files not in index
  const indexIds = new Set(indexData.topics.map(t => t.id));
  const topicFiles = fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith('.json'));
  for (const file of topicFiles) {
    const id = file.replace('.json', '');
    if (!indexIds.has(id)) {
      console.warn(`⚠️  ${file} - Not referenced in index.json (orphaned)`);
    }
  }

  console.log(`\n${allValid ? '✅' : '❌'} Validation ${allValid ? 'passed' : 'failed'}: ${validatedCount}/${indexData.topics.length} topics valid`);
  return allValid;
}

const success = validateAll();
process.exit(success ? 0 : 1);