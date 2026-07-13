/* ==========================================================================
   Crescendo — shared shell injection + interactions (vanilla JS).
   Header, footer, search overlay, subscribe modal and the back-to-top button
   are injected here so there is a single source of truth across all 7 pages.
   Page-specific behaviours (reviews sort, chart likes, scroll reveal) attach
   only when their target elements exist.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- icons -------------------------------------------------------------- */
  var IC = {
    search: '<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>',
    searchDim: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>',
    envelope: '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/></svg>',
    menu: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>',
    up: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>',
    fb: '<svg width="19" height="19" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>',
    ig: '<svg width="19" height="19" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>',
    tw: '<svg width="19" height="19" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>'
  };

  /* ---- navigation model --------------------------------------------------- */
  var NAV = [
    { label: 'Music', href: 'music.html', key: 'music' },
    { label: 'Reviews', href: 'reviews.html', key: 'reviews' },
    { label: 'Interviews', href: 'reviews.html', key: 'interviews' },
    { label: 'Charts', href: 'charts.html', key: 'charts' }
  ];

  function headerHTML(active) {
    var btn = 'flex items-center justify-center w-[38px] h-[38px] rounded-md border border-hair-12 text-muted transition-colors cursor-pointer bg-transparent';
    var desktopItems = NAV.map(function (it) {
      var on = it.key === active;
      return '<div class="relative py-4">' +
        '<a href="' + it.href + '" class="text-[13px] tracking-[0.18em] uppercase transition-colors hover:text-cyan ' + (on ? 'text-text font-semibold' : 'text-muted') + '">' + it.label + '</a>' +
        (on ? '<span class="absolute left-0 right-0 bottom-0 h-0.5 bg-signature"></span>' : '') +
        '</div>';
    }).join('');
    var mobileItems = NAV.map(function (it) {
      var on = it.key === active;
      return '<a href="' + it.href + '" class="block px-6 py-3 text-[13px] tracking-[0.18em] uppercase border-b border-hair-soft transition-colors hover:text-cyan ' + (on ? 'text-text' : 'text-muted') + '">' + it.label + '</a>';
    }).join('');

    return '' +
    '<header class="bg-header border-b border-hair-soft relative z-40">' +
      '<div class="max-w-shell mx-auto flex items-center justify-between gap-4 px-6 py-3.5">' +
        '<div class="flex items-center gap-2">' +
          '<button id="nav-toggle" aria-label="Menu" class="min-[761px]:hidden ' + btn + ' hover:text-cyan hover:border-cyan">' + IC.menu + '</button>' +
          '<button id="search-btn" title="Search" aria-label="Search" class="' + btn + ' hover:text-cyan hover:border-cyan">' + IC.search + '</button>' +
        '</div>' +
        '<a href="index.html" class="flex items-center gap-3">' +
          '<img src="images/logo.png" alt="Crescendo logo" class="h-10 w-auto block">' +
          '<span class="text-[26px] font-bold tracking-[0.22em] text-text">CRESCENDO</span>' +
        '</a>' +
        '<button id="subscribe-btn" title="Subscribe" aria-label="Subscribe" class="' + btn + ' hover:text-magenta hover:border-magenta">' + IC.envelope + '</button>' +
      '</div>' +
      '<div class="h-0.5 bg-rule"></div>' +
      '<nav class="max-w-shell mx-auto hidden min-[761px]:flex justify-center gap-14 px-6">' + desktopItems + '</nav>' +
      '<nav id="mobile-nav" class="hidden min-[761px]:!hidden bg-header border-t border-hair-soft">' + mobileItems + '</nav>' +
    '</header>';
  }

  function footerHTML() {
    var link = 'text-muted hover:text-text transition-colors';
    var social = 'text-dim hover:text-cyan transition-colors';
    return '' +
    '<footer class="bg-header border-t border-hair-soft px-6 pt-10 pb-7">' +
      '<div class="max-w-shell mx-auto">' +
        '<div class="flex flex-wrap items-center justify-between gap-5">' +
          '<a href="index.html" class="flex items-center gap-3">' +
            '<img src="images/logo.png" alt="Crescendo logo" class="h-[34px] w-auto block">' +
            '<span class="text-[19px] font-semibold tracking-[0.18em] uppercase">crescendo</span>' +
          '</a>' +
          '<ul class="flex flex-wrap gap-7 list-none m-0 p-0 text-[13px]">' +
            '<li><a href="#" class="' + link + '">About</a></li>' +
            '<li><a href="#" class="' + link + '">Privacy Policy</a></li>' +
            '<li><a href="#" class="' + link + '">Contact</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="h-px bg-hair my-[26px]"></div>' +
        '<div class="flex flex-wrap items-center justify-between gap-4">' +
          '<span class="text-[13px] text-dim">© 2026 <a href="index.html" class="text-muted hover:text-cyan transition-colors">Crescendo™</a> — All rights reserved.</span>' +
          '<div class="flex gap-[22px]">' +
            '<a href="#" title="Facebook" class="' + social + '">' + IC.fb + '</a>' +
            '<a href="#" title="Instagram" class="' + social + '">' + IC.ig + '</a>' +
            '<a href="#" title="Twitter" class="' + social + '">' + IC.tw + '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  function overlaysHTML() {
    var overlayBase = 'hidden fixed inset-0 z-[60] bg-[color:var(--overlay)] backdrop-blur-[4px]';
    return '' +
    /* search */
    '<div id="search-overlay" class="' + overlayBase + ' items-start justify-center pt-[18vh]">' +
      '<div class="w-[min(560px,90vw)] flex items-center gap-3 bg-elevated border border-hair-12 rounded-[10px] pl-[18px] pr-1.5 py-1.5 shadow-overlay">' +
        '<span class="text-muted flex">' + IC.searchDim + '</span>' +
        '<input id="search-input" type="text" placeholder="Search artists, reviews, charts…" class="flex-1 bg-transparent border-0 outline-none text-text font-sans text-base py-3">' +
        '<button data-close class="bg-transparent border-0 text-muted hover:text-text cursor-pointer text-[13px] px-3.5 py-2.5 font-sans">ESC</button>' +
      '</div>' +
    '</div>' +
    /* subscribe */
    '<div id="subscribe-overlay" class="' + overlayBase + ' items-center justify-center">' +
      '<div data-subscribe-box class="w-[min(440px,90vw)] bg-elevated border border-hair-12 rounded-panel p-8 shadow-overlay">' +
        '<div class="text-xs tracking-[0.2em] text-cyan uppercase mb-2.5">Newsletter</div>' +
        '<div class="text-[22px] font-semibold mb-1.5">Never miss a drop</div>' +
        '<p class="mt-0 mb-5 text-sm text-muted leading-relaxed">New reviews, charts and interviews in your inbox. No spam, unsubscribe anytime.</p>' +
        '<div data-form class="flex gap-2">' +
          '<input type="email" placeholder="you@email.com" class="flex-1 min-w-0 bg-bg border border-hair-12 rounded-btn outline-none text-text font-sans text-sm px-3.5 py-3">' +
          '<button data-subscribe class="bg-signature border-0 rounded-btn text-header font-bold text-sm px-[18px] py-3 cursor-pointer font-sans hover:brightness-110 transition">Subscribe</button>' +
        '</div>' +
        '<div data-success class="hidden p-3.5 rounded-btn border border-hair-cyan text-cyan text-sm text-center">You\'re on the list. Talk soon.</div>' +
      '</div>' +
    '</div>' +
    /* back to top */
    '<button id="back-to-top" aria-label="Back to top" class="hidden fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-elevated border border-hair-12 text-muted hover:text-cyan hover:border-cyan items-center justify-center shadow-menu transition-colors cursor-pointer">' + IC.up + '</button>';
  }

  /* ---- helpers ------------------------------------------------------------ */
  function show(el) { if (el) { el.classList.remove('hidden'); el.classList.add('flex'); } }
  function hide(el) { if (el) { el.classList.add('hidden'); el.classList.remove('flex'); } }

  var openOverlay = null;
  function focusables(root) {
    return Array.prototype.slice.call(
      root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }

  /* ---- boot --------------------------------------------------------------- */
  function boot() {
    var active = document.body.getAttribute('data-page') || '';
    document.body.insertAdjacentHTML('afterbegin', headerHTML(active));
    document.body.insertAdjacentHTML('beforeend', footerHTML() + overlaysHTML());

    var searchOverlay = document.getElementById('search-overlay');
    var searchInput = document.getElementById('search-input');
    var subscribeOverlay = document.getElementById('subscribe-overlay');
    var mobileNav = document.getElementById('mobile-nav');
    var backToTop = document.getElementById('back-to-top');

    function closeOverlays() {
      hide(searchOverlay);
      hide(subscribeOverlay);
      openOverlay = null;
    }

    /* search */
    var searchBtn = document.getElementById('search-btn');
    if (searchBtn) searchBtn.addEventListener('click', function () {
      hide(subscribeOverlay);
      show(searchOverlay);
      openOverlay = searchOverlay;
      if (searchInput) searchInput.focus();
    });

    /* subscribe (header modal) */
    var subscribeBtn = document.getElementById('subscribe-btn');
    if (subscribeBtn) subscribeBtn.addEventListener('click', function () {
      hide(searchOverlay);
      // reset modal to form state each open
      var form = subscribeOverlay.querySelector('[data-form]');
      var ok = subscribeOverlay.querySelector('[data-success]');
      if (form) form.classList.remove('hidden');
      if (form) form.classList.add('flex');
      if (ok) ok.classList.add('hidden');
      show(subscribeOverlay);
      openOverlay = subscribeOverlay;
    });

    /* subscribe submit -> success (modal + any sidebar box) */
    wireSubscribeBoxes();

    /* backdrop + ESC-button closes */
    [searchOverlay, subscribeOverlay].forEach(function (ov) {
      if (!ov) return;
      ov.addEventListener('click', function (e) {
        if (e.target === ov || e.target.hasAttribute('data-close')) closeOverlays();
      });
    });

    /* Esc key + focus trap */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeOverlays(); closeMobileNav(); }
      if (e.key === 'Tab' && openOverlay) {
        var f = focusables(openOverlay);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* mobile nav */
    function closeMobileNav() { if (mobileNav) mobileNav.classList.add('hidden'); }
    var navToggle = document.getElementById('nav-toggle');
    if (navToggle && mobileNav) navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('hidden');
    });

    /* back to top */
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      var onScroll = function () {
        if (window.pageYOffset > 200) show(backToTop); else hide(backToTop);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* page-specific */
    wireReviewsSort();
    wireChartLikes();
    wireScrollReveal();
  }

  /* ---- subscribe boxes (header modal + reviews sidebar) ------------------- */
  function wireSubscribeBoxes() {
    var btns = document.querySelectorAll('[data-subscribe]');
    Array.prototype.forEach.call(btns, function (btn) {
      btn.addEventListener('click', function () {
        var scope = btn.closest('[data-subscribe-box]') || document;
        var form = scope.querySelector('[data-form]');
        var ok = scope.querySelector('[data-success]');
        if (form) { form.classList.add('hidden'); form.classList.remove('flex'); }
        if (ok) { ok.classList.remove('hidden'); }
      });
    });
  }

  /* ---- reviews sort dropdown --------------------------------------------- */
  function wireReviewsSort() {
    var grid = document.getElementById('reviews-grid');
    var sortBtn = document.getElementById('sort-btn');
    var menu = document.getElementById('sort-menu');
    if (!grid || !sortBtn || !menu) return;
    var label = document.getElementById('sort-label');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
    var LABELS = { latest: 'Latest', oldest: 'Oldest', az: 'A – Z' };
    var current = 'latest';

    function apply(sort) {
      current = sort;
      var sorted = cards.slice();
      if (sort === 'latest') sorted.sort(function (a, b) { return (+b.dataset.date) - (+a.dataset.date); });
      else if (sort === 'oldest') sorted.sort(function (a, b) { return (+a.dataset.date) - (+b.dataset.date); });
      else if (sort === 'az') sorted.sort(function (a, b) { return a.dataset.title.localeCompare(b.dataset.title); });
      sorted.forEach(function (c) { grid.appendChild(c); });
      if (label) label.textContent = LABELS[sort];
      Array.prototype.slice.call(menu.querySelectorAll('[data-sort]')).forEach(function (opt) {
        var on = opt.getAttribute('data-sort') === sort;
        opt.classList.toggle('text-cyan', on);
        opt.classList.toggle('text-text', !on);
      });
    }

    sortBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('hidden');
    });
    menu.addEventListener('click', function (e) {
      var opt = e.target.closest('[data-sort]');
      if (!opt) return;
      apply(opt.getAttribute('data-sort'));
      menu.classList.add('hidden');
    });
    document.addEventListener('click', function () { menu.classList.add('hidden'); });

    apply('latest');
  }

  /* ---- chart like toggles ------------------------------------------------- */
  function wireChartLikes() {
    var btns = document.querySelectorAll('.like-btn');
    Array.prototype.forEach.call(btns, function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        var liked = b.classList.toggle('is-liked');
        b.setAttribute('aria-pressed', liked ? 'true' : 'false');
      });
    });
  }

  /* ---- scroll reveal ------------------------------------------------------ */
  function wireScrollReveal() {
    var els = document.querySelectorAll('[data-fade]');
    if (!els.length) return;
    Array.prototype.forEach.call(els, function (el) {
      el.classList.add(el.getAttribute('data-fade') === 'sm' ? 'reveal--sm' : 'reveal');
    });
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('is-visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    Array.prototype.forEach.call(els, function (el) { obs.observe(el); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
