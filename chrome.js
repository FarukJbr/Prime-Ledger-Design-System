/* Prime Ledger — shared site chrome (header + footer). Injects into #site-header / #site-footer. */
(function () {
  var SET = (window.PLData && window.PLData.data && window.PLData.data.settings) || {};
  var SVCNAMES = (window.PLData && window.PLData.data && window.PLData.data.services) || [];
  var NAV = [
    { href: 'index.html', label: 'בית' },
    { href: 'services.html', label: 'שירותים' },
    { href: 'pricing.html', label: 'מחירון' },
    { href: 'guide.html', label: 'מדריך' },
    { href: 'simulators.html', label: 'סימולטורים' },
    { href: 'forms.html', label: 'טפסים' },
    { href: 'faq.html', label: 'שאלות' },
    { href: 'about.html', label: 'אודות' },
    { href: 'blog.html', label: 'בלוג' },
    { href: 'contact.html', label: 'צור קשר' },
  ];
  var MORE = [
    { href: 'terms.html', label: 'תנאי שימוש', icon: 'shield-check' },
  ];
  var SERVICES = [
    'הנהלת חשבונות', 'חשבות שכר', 'ייעוץ עסקי', 'ייעוץ פיננסי',
    'שיווק ופרסום', 'מכירות', 'פתרונות ציות'
  ];

  var here = (location.pathname.split('/').pop() || 'index.html');
  if (here === '') here = 'index.html';
  var isActive = function (h) { return h === here || (here === 'index.html' && h === 'index.html'); };
  var BRAND_SHORT = 'פריים לדג׳ר';
  var BRAND_FULL = SET.brandName || 'פתרונות פריים לדג׳ר';

  // ---------- HEADER ----------
  var navLinks = NAV.map(function (n) {
    return '<a href="' + n.href + '"' + (isActive(n.href) ? ' class="active"' : '') + '>' + n.label + '</a>';
  }).join('');
  var moreLinks = MORE.map(function (m) {
    return '<a href="' + m.href + '"><i data-lucide="' + m.icon + '"></i>' + m.label + '</a>';
  }).join('');
  var mobileLinks = NAV.concat(MORE).map(function (n) {
    return '<a href="' + n.href + '"' + (isActive(n.href) ? ' style="color:var(--brand-600)"' : '') + '>' + n.label + '</a>';
  }).join('') + '<a href="https://portal.primels.co.il" style="color:var(--brand-600)">כניסה לפורטל ←</a>';

  var header =
    '<header class="site-header"><div class="wrap header-inner">' +
      '<a class="brand" href="index.html"><span class="logo-mark" role="img" aria-label="' + BRAND_FULL + '"></span><div><b>' + BRAND_SHORT + '</b><small>Prime Ledger Solutions</small></div></a>' +
      '<nav class="nav">' + navLinks +
      '</nav>' +
      '<div class="header-cta">' +
        '<a class="btn btn-primary" href="https://portal.primels.co.il"><i data-lucide="lock"></i>כניסה לפורטל</a>' +
        '<button class="burger" type="button" aria-label="תפריט"><i data-lucide="menu"></i></button>' +
      '</div>' +
    '</div></header>' +
    '<div class="mobile-menu">' + mobileLinks + '</div>';

  // ---------- FOOTER (built as a function so it can be re-called when settings load) ----------
  function buildFooter(set, svcs) {
    set = set || {};
    svcs = svcs || [];
    var svcSource = (svcs.length
      ? svcs.filter(function(s){return s.visible!==false;}).map(function(s){return {t:s.title,id:s.id};})
      : SERVICES.map(function(s,i){return {t:s,id:'svc-'+i};}));
    var svcLinks = svcSource.map(function (s) {
      return '<a href="services.html#' + s.id + '">' + s.t + '</a>';
    }).join('');

    // Social links — each only rendered if a URL is configured
    function socialLink(url, label, svgPath, isWhatsApp) {
      if (!url) return '';
      // WhatsApp: convert phone number to wa.me link if it looks like a number
      var href = url;
      if (isWhatsApp && /^[0-9+\s-]+$/.test(url.trim())) {
        href = 'https://wa.me/' + url.replace(/\D/g,'');
      } else if (url && !/^https?:\/\//.test(url) && !isWhatsApp) {
        href = 'https://' + url;
      }
      return '<a href="' + href + '" target="_blank" rel="noopener" aria-label="' + label + '">' + svgPath + '</a>';
    }

    var SVG_LI  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 22 10.9 22 14.3V21h-4v-5.9c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z"/></svg>';
    var SVG_IG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>';
    var SVG_FB  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7c0-1 .3-1.5 1.6-1.5H17V2.2C16.5 2.1 15.4 2 14.5 2 11.9 2 10 3.6 10 6.5V9H7.5v3.5H10V22h4v-9.5h2.7l.4-3.5z"/></svg>';
    var SVG_WA  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.5 12.6l-.3.4.7 2.5-2.5-.7-.4.2A8 8 0 1 1 12 4zm-3 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.4-.3-.2-1.5-.8-1.8-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.1-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4z"/></svg>';
    var SVG_TT  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 3a3.8 3.8 0 0 1-2.6-1.1A3.8 3.8 0 0 1 16 0h-3v16.4a2.3 2.3 0 0 1-2.3 2 2.3 2.3 0 0 1-2.3-2.3 2.3 2.3 0 0 1 2.3-2.3c.2 0 .5 0 .7.1V11a6.1 6.1 0 0 0-.7 0A5.8 5.8 0 0 0 4.9 16.7a5.8 5.8 0 0 0 5.8 5.8 5.8 5.8 0 0 0 5.8-5.8V8.6a7.3 7.3 0 0 0 4.3 1.4V7a3.8 3.8 0 0 1-1.2-.1z"/></svg>';
    var SVG_YT  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 6.4a2.9 2.9 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8 1 12 1 12s0 4 .5 5.6a2.9 2.9 0 0 0 2 2C5.1 20 12 20 12 20s6.9 0 8.5-.4a2.9 2.9 0 0 0 2-2C23 16 23 12 23 12s0-4-.5-5.6zm-13 9V8.6l5.7 3.4-5.7 3.4z"/></svg>';
    var SVG_LSH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/><line x1="12" y1="12" x2="12" y2="15"/><circle cx="12" cy="11.5" r="1"/></svg>';

    var socialHtml =
      socialLink(set.social_linkedin,  'LinkedIn',  SVG_LI,  false) +
      socialLink(set.social_instagram, 'Instagram', SVG_IG,  false) +
      socialLink(set.social_facebook,  'Facebook',  SVG_FB,  false) +
      socialLink(set.social_tiktok,    'TikTok',    SVG_TT,  false) +
      socialLink(set.social_youtube,   'YouTube',   SVG_YT,  false) +
      socialLink(set.social_whatsapp,  'WhatsApp',  SVG_WA,  true)  +
      socialLink(set.social_lishka,    'לשכת מנהלי חשבונות', SVG_LSH, false);

    return (
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<div style="display:flex;align-items:center;gap:11px"><span class="logo-mark is-white" style="width:38px;height:38px"></span><b>' + BRAND_SHORT + '</b></div>' +
            '<p>בית תוכן עסקי אחד — הנהלת חשבונות, ייעוץ, שיווק ובניית אתרים. מהרעיון ועד ההשקה.</p>' +
            (socialHtml ? '<div class="footer-social" style="margin-top:20px">' + socialHtml + '</div>' : '') +
          '</div>' +
          '<div><h4>השירותים שלנו</h4>' + svcLinks + '</div>' +
          '<div><h4>החברה</h4><a href="about.html">אודות</a><a href="guide.html">מדריך מקצועי</a><a href="pricing.html">מחירון</a></div>' +
          '<div><h4>תמיכה</h4><a href="contact.html">צור קשר</a><a href="faq.html">שאלות ותשובות</a><a href="forms.html">טפסים להורדה</a><a href="simulators.html">סימולטורים</a><a href="terms.html">תנאי שימוש</a></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© 2026 ' + (set.brandName || set.brand_name || 'פריים לדג׳ר') + ' · כל הזכויות שמורות</span>' +
          '<span dir="ltr">' + (set.phoneSales || set.phone_sales || '053-926-5062') + ' · ' + (set.email || 'info@primels.co.il') + '</span>' +
        '</div>' +
      '</div></footer>'
    );
  }

  var h = document.getElementById('site-header');
  var f = document.getElementById('site-footer');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = buildFooter(SET, SVCNAMES);

  // Re-render footer when Supabase data arrives (data.js fires this)
  document.addEventListener('pl:data-ready', function(e) {
    var liveData = e.detail || (window.PLData && window.PLData.data) || {};
    var newFooter = buildFooter(liveData.settings, liveData.services);
    var existingFooter = document.querySelector('footer.site-footer');
    if (existingFooter) existingFooter.outerHTML = newFooter;
  });

  // ---------- INTERACTIONS ----------
  document.addEventListener('click', function (e) {
    var moreBtn = e.target.closest('.menu-more > button');
    var more = document.querySelector('.menu-more');
    if (moreBtn && more) { more.classList.toggle('open'); e.stopPropagation(); return; }
    if (more && !e.target.closest('.menu-more')) more.classList.remove('open');

    if (e.target.closest('.burger')) {
      document.querySelector('.mobile-menu').classList.toggle('open');
    }
    if (e.target.closest('.mobile-menu a')) {
      document.querySelector('.mobile-menu').classList.remove('open');
    }
  });

  // ---------- ENHANCEMENTS (motion) ----------
  document.documentElement.classList.add('has-js');

  // scroll progress bar (top of viewport)
  var prog = document.createElement('div');
  prog.className = 'scroll-progress';
  document.body.appendChild(prog);
  var tickProg = function () {
    var st = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(st / h, 1) : 0) + ')';
  };
  window.addEventListener('scroll', tickProg, { passive: true });
  window.addEventListener('resize', tickProg); tickProg();

  // header elevation on scroll
  var hdr = document.querySelector('.site-header');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // count-up for numerals tagged with data-count
  function countUp(el) {
    if (el.dataset.counted) return; el.dataset.counted = '1';
    var raw = el.getAttribute('data-count') || el.textContent;
    var m = String(raw).match(/^(\D*?)([\d,]+(?:\.\d+)?)(\D*)$/);
    if (!m) return;
    var pre = m[1], suf = m[3], numStr = m[2].replace(/,/g, '');
    var hasComma = m[2].indexOf(',') !== -1;
    var dec = (numStr.split('.')[1] || '').length;
    var target = parseFloat(numStr); if (isNaN(target)) return;
    el.classList.add('counting');
    var dur = 1500, start = null;
    var fmt = function (v) { var s = dec ? v.toFixed(dec) : Math.round(v); if (hasComma) s = Number(s).toLocaleString('en-US'); return pre + s + suf; };
    requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(step); else el.textContent = pre + m[2] + suf;
    });
  }

  // scroll reveal — auto-tag groups (staggered, directional) + standalone blocks
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // grids: children rise & stagger
  ['.svc-grid', '.proc', '.vals', '.team', '.quotes', '.stats', '.why-grid', '.promise-grid', '.diff', '.cred-chips', '.hero-trust', '.ah-trust', '.sim-cards'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (child, i) {
        if (!child.classList.contains('reveal-up')) child.classList.add('reveal-up');
        child.style.transitionDelay = Math.min(i, 7) * 80 + 'ms';
      });
    });
  });
  // work/portfolio thumbnails zoom in
  document.querySelectorAll('.grid.works > *, .work').forEach(function (el, i) {
    el.classList.add('reveal-zoom');
    el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
  });
  // headings slide up; side panels slide in from the sides
  document.querySelectorAll('.sec-head, .newsletter, [data-reveal]').forEach(function (el) { el.classList.add('reveal-up'); });
  document.querySelectorAll('.sim-band').forEach(function (el) { el.classList.add('reveal-scale'); });

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        if (en.target.matches('[data-count]')) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal-up, .reveal-zoom, .reveal-scale, [data-count]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal-up, .reveal-zoom, .reveal-scale').forEach(function (el) { el.classList.add('in'); });
  }

  // gentle parallax on decorative blobs + hero mock (rAF-throttled)
  if (!reduce) {
    var parEls = [];
    document.querySelectorAll('.hero-blob, .page-hero .blob').forEach(function (el) { parEls.push({ el: el, k: 0.12 }); });
    document.querySelectorAll('.mock').forEach(function (el) { parEls.push({ el: el, k: -0.05 }); });
    if (parEls.length) {
      var raf = false;
      var doPar = function () {
        var y = window.scrollY || 0;
        parEls.forEach(function (p) { p.el.style.transform = 'translate3d(0,' + (y * p.k).toFixed(1) + 'px,0)'; });
        raf = false;
      };
      window.addEventListener('scroll', function () { if (!raf) { raf = true; requestAnimationFrame(doPar); } }, { passive: true });
    }
  }

  // hero headline: split into rising words (premium entrance)
  if (!reduce) {
    document.querySelectorAll('.hero h1.h-display, .page-hero h1.h1').forEach(function (h) {
      if (h.dataset.split) return; h.dataset.split = '1';
      var i = 0;
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (tok) {
              if (/^\s+$/.test(tok) || tok === '') { frag.appendChild(document.createTextNode(tok)); return; }
              var s = document.createElement('span');
              s.className = 'hw'; s.style.setProperty('--i', i++); s.textContent = tok;
              frag.appendChild(s);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1 && n.tagName !== 'BR') {
            walk(n);
          }
        });
      };
      walk(h);
      // trigger the staggered transition on the next frame; safety net flips all visible after 1.6s
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          h.querySelectorAll('.hw').forEach(function (s) { s.classList.add('in'); });
        });
      });
      setTimeout(function () { h.querySelectorAll('.hw').forEach(function (s) { s.classList.add('in'); }); }, 1600);
    });
  }

  // subtle 3D tilt on cards (pointer-driven, inline transform so it never fights reveals)
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.card-hover').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        if (!card.classList.contains('in') && card.classList.contains('reveal-zoom')) return;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add('tilting');
        card.style.transform = 'perspective(900px) rotateY(' + (px * 6).toFixed(2) + 'deg) rotateX(' + (-py * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }

  if (window.lucide) lucide.createIcons();
})();

// ── Auto-load tracker.js on every page ──
(function(){
  if (document.querySelector('script[src*="tracker.js"]')) return;
  var t = document.createElement('script');
  t.src = 'tracker.js';
  t.defer = true;
  document.head.appendChild(t);
})();