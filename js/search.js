/**
 * Client-Side Search Module for MechWiki
 * Uses pre-built search-index.json for instant full-text search
 * No external dependencies - pure vanilla JS
 */

const Search = {
  index: null,
  documents: null,
  loaded: false,
  loadingPromise: null,

  async init() {
    if (this.loaded) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      try {
        const response = await fetch('data/search-index.json');
        if (!response.ok) throw new Error('Failed to load search index');
        const data = await response.json();
        this.index = data.index;
        this.documents = data.documents;
        this.loaded = true;
        console.log(`🔍 Search index loaded: ${this.documents.length} documents, ${Object.keys(this.index).length} tokens`);
      } catch (err) {
        console.error('Search index load failed:', err);
        this.loaded = false;
      }
    })();

    return this.loadingPromise;
  },

  // Search query string, return ranked results
  search(query, limit = 20) {
    if (!this.loaded || !query?.trim()) return [];

    const tokens = this.tokenize(query);
    if (tokens.length === 0) return [];

    // Score documents by token frequency
    const scores = new Map();

    for (const token of tokens) {
      const docIndices = this.index[token];
      if (!docIndices) continue;

      for (const docIndex of docIndices) {
        scores.set(docIndex, (scores.get(docIndex) || 0) + 1);
      }
    }

    // Sort by score descending
    const ranked = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([docIndex, score]) => ({
        ...this.documents[docIndex],
        score,
      }));

    return ranked;
  },

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1);
  },

  // Get suggestions for autocomplete
  getSuggestions(query, limit = 5) {
    const results = this.search(query, limit);
    return results.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      url: r.url,
    }));
  },
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Search;
}