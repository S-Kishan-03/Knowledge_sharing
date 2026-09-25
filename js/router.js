/**
 * Hash-based router for client-side navigation on GitHub Pages
 */

const Router = {
  routes: {},

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  },

  register(path, handler) {
    this.routes[path] = handler;
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    const route = parts[0];
    const param = parts[1];

    if (route === 'topic' && param) {
      if (this.routes['topic']) {
        this.routes['topic'](param);
      }
    } else if (route === 'category' && param) {
      if (this.routes['category']) {
        this.routes['category'](param);
      }
    } else {
      if (this.routes['home']) {
        this.routes['home']();
      }
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  navigate(hash) {
    window.location.hash = hash;
  }
};
