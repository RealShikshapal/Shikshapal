/* ShikshaPal Explainer — chapter shell (v2)
   Drives:
   - Auto-assign slugified IDs to H2/H3/H4 inside .exp-main (deep-link friendly)
   - Mobile sidebar drawer toggle (hamburger / overlay / Escape / link-click-to-close)
   - Reading progress bar driven by document scroll
*/
(function () {
  'use strict';

  function slug(s) {
    return s.trim().toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);
  }

  function ensureIds() {
    var main = document.querySelector('.exp-main');
    if (!main) return;
    var headings = main.querySelectorAll('h2, h3, h4');
    var seen = {};
    headings.forEach(function (h) {
      if (!h.id) {
        var base = slug(h.textContent || '') || 'section';
        var unique = base, n = 2;
        while (seen[unique] || document.getElementById(unique)) {
          unique = base + '-' + n++;
        }
        h.id = unique;
      }
      seen[h.id] = true;
    });
  }

  function setupDrawer() {
    var sidebar = document.querySelector('.exp-sidebar');
    var hamburger = document.querySelector('.exp-hamburger');
    var overlay = document.querySelector('.exp-overlay');
    var closeBtn = document.querySelector('.exp-sidebar .x');
    if (!sidebar || !hamburger) return;

    function open() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('on');
      document.body.classList.add('nav-locked');
    }
    function close() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('on');
      document.body.classList.remove('nav-locked');
    }
    hamburger.addEventListener('click', open);
    if (overlay) overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    sidebar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 1000px)').matches) close();
      });
    });
  }

  function setupProgress() {
    var bar = document.querySelector('.exp-progress > i');
    if (!bar) return;
    var ticking = false;
    function update() {
      var st = window.scrollY || document.documentElement.scrollTop;
      var dh = document.documentElement.scrollHeight - window.innerHeight;
      var pct = dh > 0 ? Math.max(0, Math.min(1, st / dh)) : 0;
      bar.style.width = (pct * 100).toFixed(2) + '%';
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function init() {
    ensureIds();
    setupDrawer();
    setupProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
