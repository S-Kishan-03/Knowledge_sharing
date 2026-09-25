/**
 * Article & UI Renderer Module
 * Consumes topic JSON objects and builds modern, dynamic HTML elements.
 */

const Renderer = {
  seoData: null,
  ogMeta: null,

  async loadSEOData() {
    if (this.seoData && this.ogMeta) return;
    try {
      const [seoRes, ogRes] = await Promise.all([
        fetch('data/structured-data.json'),
        fetch('data/og-meta.json'),
      ]);
      if (seoRes.ok) this.seoData = await seoRes.json();
      if (ogRes.ok) this.ogMeta = await ogRes.json();
    } catch (err) {
      console.warn('SEO data not available:', err);
    }
  },

  injectSEOMeta(topic) {
    document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]').forEach(el => el.remove());

    if (this.ogMeta?.[topic.id]) {
      const og = this.ogMeta[topic.id];
      for (const [property, content] of Object.entries(og)) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    }

    if (this.seoData?.[topic.id]) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(this.seoData[topic.id]);
      document.head.appendChild(script);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${window.location.pathname}#topic/${topic.id}`;
  },
  // Render Home Dashboard View
  renderHome(indexData, activeCategory = null, searchQuery = '', preFilteredTopics = null, searchResults = null) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    let filteredTopics = preFilteredTopics ?? indexData.topics;

    if (activeCategory) {
      filteredTopics = filteredTopics.filter(t => t.categoryId === activeCategory);
    }

    if (searchQuery.trim() && !preFilteredTopics) {
      const q = searchQuery.toLowerCase().trim();
      filteredTopics = filteredTopics.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(q))
      );
    }

    const categoriesHTML = indexData.categories.map(cat => `
      <div class="category-card ${activeCategory === cat.id ? 'active' : ''}" onclick="Router.navigate('category/${cat.id}')">
        <div class="category-icon">${this.getIcon(cat.icon)}</div>
        <div class="category-info">
          <h3>${cat.name}</h3>
          <p>${cat.description}</p>
        </div>
      </div>
    `).join('');

    const topicsHTML = filteredTopics.map(topic => `
      <article class="topic-card" onclick="Router.navigate('topic/${topic.id}')">
        <div class="topic-card-header">
          <span class="category-badge">${topic.category}</span>
          <span class="difficulty-badge ${topic.difficulty.toLowerCase()}">${topic.difficulty}</span>
        </div>
        <h3 class="topic-card-title">${topic.title}</h3>
        <p class="topic-card-summary">${topic.summary}</p>
        <div class="topic-card-footer">
          <span class="read-time">⏱️ ${topic.readTime}</span>
          <div class="topic-tags">
            ${topic.tags.slice(0, 3).map(t => `<span class="tag">#${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

    mainContent.innerHTML = `
      <section class="hero-section">
        <div class="hero-badge">💡 Interactive Knowledge Hub</div>
        <h1 class="hero-title">Mechanical Engineering Wiki</h1>
        <p class="hero-subtitle">Explore data-driven topics, interactive formula calculators, and rich visual engineering references.</p>
        
        <div class="hero-stats">
          <div class="stat-pill"><span class="stat-num">${indexData.topics.length}</span> Topics</div>
          <div class="stat-pill"><span class="stat-num">${indexData.categories.length}</span> Disciplines</div>
          <div class="stat-pill"><span class="stat-num">${Calculators.getCount()}</span> Live Calculators</div>
          <div class="stat-pill"><span class="stat-num">100%</span> Open Access</div>
        </div>
      </section>

      <section class="section-container">
        <div class="section-header">
          <h2>Engineering Disciplines</h2>
          ${activeCategory ? `<button class="btn-secondary" onclick="Router.navigate('home')">Show All</button>` : ''}
        </div>
        <div class="categories-grid">
          ${categoriesHTML}
        </div>
      </section>

      <section class="section-container">
        <div class="section-header">
          <h2>${activeCategory ? 'Filtered Topics' : 'Featured Topics'} (${filteredTopics.length})</h2>
          ${searchQuery ? `<span class="search-indicator">Search results for: "${searchQuery}"</span>` : ''}
        </div>
        ${filteredTopics.length > 0 ? `
          <div class="topics-grid">
            ${topicsHTML}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No topics found</h3>
            <p>Try searching for a different keyword like "stress", "heat", "fluid", or "gear".</p>
          </div>
        `}
      </section>
    `;
  },

  // Render Deep Dive Topic View
  async renderTopic(topicId) {
    await this.loadSEOData();
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="loading-spinner-container">
        <div class="spinner"></div>
        <p>Loading topic content...</p>
      </div>
    `;

    try {
      const response = await fetch(`data/topics/${topicId}.json`);
      if (!response.ok) throw new Error('Topic not found');
      const topic = await response.json();

      this.injectSEOMeta(topic);

      // Render Infobox
      const infoboxHTML = topic.infobox ? `
        <aside class="wiki-infobox">
          <div class="infobox-header">
            <span class="infobox-symbol">${topic.infobox.imageSymbol || '⚙️'}</span>
            <h3>${topic.infobox.title}</h3>
          </div>
          <div class="infobox-body">
            ${topic.infobox.keyFormulas ? `
              <div class="infobox-section">
                <h4>Key Formulas</h4>
                <div class="infobox-formulas">
                  ${topic.infobox.keyFormulas.map(f => `
                    <div class="formula-row">
                      <span class="formula-label">${f.label}:</span>
                      <span class="formula-math">$$\\small ${f.math}$$</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            <div class="infobox-meta">
              <div class="meta-item">
                <span class="meta-label">SI Units:</span>
                <span class="meta-val">${topic.infobox.siUnits}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Primary Fields:</span>
                <span class="meta-val">${topic.infobox.primaryFields}</span>
              </div>
              ${topic.infobox.keyConstants ? `
                <div class="meta-item">
                  <span class="meta-label">Constants:</span>
                  <span class="meta-val">${topic.infobox.keyConstants}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </aside>
      ` : '';

      // Render Sections & Markdown
      const sectionsHTML = topic.sections.map(sec => {
        let contentHTML = marked.parse(sec.content || '');
        contentHTML = this.parseWikiLinks(contentHTML);

        return `
          <section id="${sec.id}" class="topic-section">
            <h2 class="section-title">${sec.heading}</h2>
            <div class="section-content">${contentHTML}</div>
            ${sec.calculator ? `<div id="calc-container-${sec.id}" class="embedded-calc"></div>` : ''}
          </section>
        `;
      }).join('');

      // Render Table of Contents
      const tocHTML = topic.sections.map(sec => `
        <li><a href="#${sec.id}" class="toc-link" onclick="event.preventDefault(); document.getElementById('${sec.id}').scrollIntoView({behavior:'smooth'});">${sec.heading}</a></li>
      `).join('');

      // Key Takeaways
      const takeawaysHTML = topic.keyTakeaways ? `
        <div class="takeaways-box">
          <h3>📌 Key Engineering Takeaways</h3>
          <ul>
            ${topic.keyTakeaways.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      ` : '';

      // Related Topics (resolved via master index metadata)
      const relatedTopicsHTML = topic.relatedTopics?.length ? (() => {
        const meta = topic.relatedTopics
          .map(id => masterIndexData?.topics.find(t => t.id === id))
          .filter(Boolean)
          .map(t => ({ id: t.id, title: t.title }));
        if (!meta.length) return '';
        return `
          <div class="related-topics-box">
            <h3>🔗 Related Topics</h3>
            <div class="related-topics-grid">
              ${meta.map(r => `
                <div class="related-topic-card" onclick="Router.navigate('topic/${r.id}')">
                  <span>${r.title}</span>
                  <span class="related-topic-arrow">→</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      })() : '';

      mainContent.innerHTML = `
        <div class="topic-view-container">
          <nav class="breadcrumb">
            <a href="#home">Home</a> &rsaquo; 
            <a href="#category/${topic.categoryId}">${topic.category}</a> &rsaquo; 
            <span>${topic.title}</span>
          </nav>

          <header class="topic-header">
            <div class="topic-meta">
              <span class="category-badge">${topic.category}</span>
              <span class="difficulty-badge ${topic.difficulty.toLowerCase()}">${topic.difficulty}</span>
              <span class="read-time">⏱️ ${topic.readTime}</span>
            </div>
            <h1 class="topic-title">${topic.title}</h1>
            <p class="topic-summary">${topic.summary}</p>
          </header>

          <div class="topic-body-wrapper">
            <div class="topic-main-column">
              ${infoboxHTML}
              <div class="topic-sections">
                ${sectionsHTML}
              </div>
              ${takeawaysHTML}
              ${relatedTopicsHTML}
            </div>

            <aside class="topic-toc-sidebar">
              <div class="toc-sticky-card">
                <h4>Table of Contents</h4>
                <ul class="toc-list">
                  ${tocHTML}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      `;

      // Render KaTeX Math Equations
      if (window.renderMathInElement) {
        renderMathInElement(mainContent, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        });
      }

      // Initialize Calculators if embedded
      topic.sections.forEach(sec => {
        if (sec.calculator) {
          Calculators.render(sec.calculator, `calc-container-${sec.id}`);
        }
      });

      // Update Sidebar Navigation state
      this.highlightActiveSidebar(topicId);

      // Scrollspy: highlight the TOC link of the section crossing the reading band
      const sectionEls = mainContent.querySelectorAll('.topic-section[id]');
      if (sectionEls.length && 'IntersectionObserver' in window) {
        const tocLinks = mainContent.querySelectorAll('.toc-link');
        tocLinks[0]?.classList.add('active');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            tocLinks.forEach(link => link.classList.remove('active'));
            const match = mainContent.querySelector(`.toc-link[href="#${entry.target.id}"]`);
            if (match) match.classList.add('active');
          });
        }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
        sectionEls.forEach(sec => observer.observe(sec));
      }

    } catch (err) {
      mainContent.innerHTML = `
        <div class="error-state">
          <h3>Error Loading Topic</h3>
          <p>${err.message}</p>
          <button class="btn-primary" onclick="Router.navigate('home')">Return Home</button>
        </div>
      `;
    }
  },

  parseWikiLinks(htmlText) {
    // Replaces [[topic-id|Display Name]] or [[Display Name]] with router links
    return htmlText.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
      const parts = p1.split('|');
      const target = parts[0].trim();
      const label = parts[1] ? parts[1].trim() : target;
      return `<a href="#topic/${target}" class="wiki-link">${label}</a>`;
    });
  },

  highlightActiveSidebar(topicId) {
    document.querySelectorAll('.sidebar-topic-item').forEach(el => {
      el.classList.toggle('active', el.dataset.topicId === topicId);
    });
  },

  getIcon(iconName) {
    const icons = {
      flame: '🔥',
      droplet: '💧',
      shield: '🏗️',
      cog: '⚙️',
      zap: '⚡',
      waves: '🌊',
      activity: '📊',
      settings: '🔧',
      design: '📐',
      computer: '🖥️',
      factory: '🏭',
      ruler: '📏',
      bulb: '💡',
      pen: '🖊️',
      trend: '📈',
      robot: '🤖',
      machining: '⚒️',
      spec: '📋',
      scale: '⚖️',
      blueprint: '🗺️',
      microscope: '🔬',
      bearing: '🛞',
      bolt: '🔩',
      coil: '🌀',
      chain: '⛓️',
      linkage: '🦾',
      fatigue: '📉',
      thermometer: '🌡️',
      target: '🎯',
      flask: '🧪',
      clamp: '🗜️',
      forge: '🔥',
      weld: '🤝',
      compass: '🧭',
      quality: '✅',
      printer: '🖨️'
    };
    return icons[iconName] || '📖';
  }
};
