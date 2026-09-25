/**
 * Main Application Module
 * Initializes theme, fetches master index data, populates sidebar, and sets up global search.
 */

let masterIndexData = null;

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  await loadIndexData();
  await Search.init();  // Initialize search index
  setupRouter();
  setupGlobalSearch();
  setupMobileSidebar();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('mechwiki_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('mechwiki_theme', newTheme);
      updateThemeButton(newTheme);
    });
  }
}

function updateThemeButton(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.innerText = theme === 'dark' ? '🌙' : '☀️';
  }
}

// Fetch Index JSON (metadata only - full content loaded on demand)
async function loadIndexData() {
  try {
    const response = await fetch('data/index.json');
    if (!response.ok) throw new Error('Failed to load topic index.');
    masterIndexData = await response.json();
    renderSidebar(masterIndexData);
  } catch (err) {
    console.error('Error loading index:', err);
  }
}

function renderSidebar(data) {
  const container = document.getElementById('sidebar-categories');
  if (!container || !data) return;

  container.innerHTML = data.categories.map(cat => {
    const catTopics = data.topics.filter(t => t.categoryId === cat.id);
    const topicCount = catTopics.length;
    return `
      <div class="sidebar-category-group" data-category="${cat.id}">
        <button class="sidebar-category-title" 
                onclick="toggleSidebarCategory('${cat.id}')"
                aria-expanded="true"
                aria-controls="sidebar-topics-${cat.id}">
          <span class="cat-icon">${Renderer.getIcon(cat.icon)}</span>
          <span>${cat.name}</span>
          <span class="category-count">${topicCount}</span>
          <span class="category-chevron" aria-hidden="true">▼</span>
        </button>
        <ul id="sidebar-topics-${cat.id}" class="sidebar-topic-list" role="list">
          ${catTopics.map(t => `
            <li class="sidebar-topic-item" data-topic-id="${t.id}" onclick="selectSidebarTopic('${t.id}')">
              <span class="topic-dot"></span>
              <span class="topic-name">${t.title}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');
}

function toggleSidebarCategory(categoryId) {
  const group = document.querySelector(`.sidebar-category-group[data-category="${categoryId}"]`);
  const list = document.getElementById(`sidebar-topics-${categoryId}`);
  const button = group?.querySelector('.sidebar-category-title');
  const chevron = button?.querySelector('.category-chevron');
  
  if (!group || !list || !button) return;
  
  const isCollapsed = list.classList.toggle('collapsed');
  button.setAttribute('aria-expanded', !isCollapsed);
  if (chevron) {
    chevron.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0)';
  }
}

function selectSidebarTopic(topicId) {
  Router.navigate(`topic/${topicId}`);
  const sidebar = document.getElementById('app-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  if (sidebar?.classList.contains('open')) {
    sidebar.classList.remove('open');
    toggleBtn?.setAttribute('aria-expanded', 'false');
  }
}

// Router Setup
function setupRouter() {
  Router.register('home', () => {
    if (masterIndexData) Renderer.renderHome(masterIndexData);
  });

  Router.register('category', (catId) => {
    if (masterIndexData) Renderer.renderHome(masterIndexData, catId);
  });

  Router.register('topic', (topicId) => {
    Renderer.renderTopic(topicId);
  });

  Router.init();
}

function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('search-results');
  if (!searchInput) return;

  let debounceTimer;
  let selectedIndex = -1;

  function showResults(results) {
    if (!searchResults || results.length === 0) {
      searchResults?.classList.add('hidden');
      searchResults.hidden = true;
      return;
    }

    searchResults.innerHTML = results.map((r, i) => `
      <div class="search-result-item" data-index="${i}" data-topic-id="${r.id}" role="option">
        <span class="search-result-title">${r.title}</span>
        <span class="search-result-category">${r.category}</span>
      </div>
    `).join('');

    searchResults.classList.remove('hidden');
    searchResults.hidden = false;
    selectedIndex = -1;
  }

  function hideResults() {
    if (searchResults) {
      searchResults.classList.add('hidden');
      searchResults.hidden = true;
    }
    selectedIndex = -1;
  }

  function selectResult(index) {
    const items = searchResults?.querySelectorAll('.search-result-item');
    if (!items || index < 0 || index >= items.length) return;
    
    const topicId = items[index].dataset.topicId;
    hideResults();
    searchInput.value = '';
    selectSidebarTopic(topicId);
  }

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const query = e.target.value.trim();

      if (query.length === 0) {
        hideResults();
        if (masterIndexData) {
          Renderer.renderHome(masterIndexData);
        }
        return;
      }

      const results = Search.search(query, 8);
      showResults(results);
    }, 120);
  });

  searchInput.addEventListener('keydown', (e) => {
    const items = searchResults?.querySelectorAll('.search-result-item');
    if (!items || items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectResult(selectedIndex);
    } else if (e.key === 'Escape') {
      hideResults();
      searchInput.blur();
    }
  });

  searchResults?.addEventListener('click', (e) => {
    const item = e.target.closest('.search-result-item');
    if (item) {
      const index = parseInt(item.dataset.index, 10);
      selectResult(index);
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
      hideResults();
    }
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim() && Search.loaded) {
      const results = Search.search(searchInput.value.trim(), 8);
      showResults(results);
    }
  });
}

// Mobile Sidebar Toggle with Focus Trap
function setupMobileSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.getElementById('app-sidebar');
  let lastFocusedElement = null;

  if (toggleBtn && sidebar) {
    const focusableElements = () => sidebar.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    function trapFocus(e) {
      if (!sidebar.classList.contains('open')) return;
      const elements = focusableElements();
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      } else if (e.key === 'Escape') {
        closeSidebar();
      }
    }

    function openSidebar() {
      sidebar.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      lastFocusedElement = document.activeElement;
      document.addEventListener('keydown', trapFocus);
      // Focus first focusable element in sidebar
      setTimeout(() => {
        const elements = focusableElements();
        if (elements.length > 0) elements[0].focus();
      }, 0);
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', trapFocus);
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }

    toggleBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !toggleBtn.contains(e.target)) {
        closeSidebar();
      }
    });

    // Close sidebar on navigation
    window.addEventListener('hashchange', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });
  }
}