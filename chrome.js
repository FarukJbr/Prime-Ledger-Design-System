/* Prime Ledger — shared site chrome (header + footer). Injects into #site-header / #site-footer. */
(function () {
  var SET = (window.PLData && window.PLData.data && window.PLData.data.settings) || {};
  var SVCNAMES = (window.PLData && window.PLData.data && window.PLData.data.services) || [];
  var NAV = [
    { href: 'index.html', label: 'בית' },
    { href: 'services.html', label: 'שירותים' },
    { href: 'pricing.html', label: 'מחירון' },
    { href: 'examples.html', label: 'דוגמאות' },
    { href: 'guide.html', label: 'מדריך' },
    { href: 'simulators.html', label: 'סימולטורים' },
    { href: 'forms.html', label: 'טפסים' },
    { href: 'faq.html', label: 'שאלות' },
    { href: 'about.html', label: 'אודות' },
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

  // ---------- HEADER ----------
  var navLinks = NAV.map(function (n) {
    return '<a href="' + n.href + '"' + (isActive(n.href) ? ' class="active"' : '') + '>' + n.label + '</a>';
  }).join('');
  var moreLinks = MORE.map(function (m) {
    return '<a href="' + m.href + '"><i data-lucide="' + m.icon + '"></i>' + m.label + '</a>';
  }).join('');
  var mobileLinks = NAV.concat(MORE).map(function (n) {
    return '<a href="' + n.href + '"' + (isActive(n.href) ? ' style="color:var(--brand-600)"' : '') + '>' + n.label + '</a>';
  }).join('') + '<a href="login.html" style="color:var(--brand-600)">כניסה לפורטל ←</a>';

  var header =
    '<header class="site-header"><div class="wrap header-inner">' +
      '<a class="brand" href="index.html"><img src="assets/logo-mark.png" alt="פתרונות פריים לדג׳ר"><div><b>' + (SET.brandName || 'פתרונות פריים לדג׳ר') + '</b><small>Prime Ledger Solutions</small></div></a>' +
      '<nav class="nav">' + navLinks +
      '</nav>' +
      '<div class="header-cta">' +
        '<a class="btn btn-primary" href="login.html"><i data-lucide="lock"></i>כניסה לפורטל</a>' +
        '<button class="burger" type="button" aria-label="תפריט"><i data-lucide="menu"></i></button>' +
      '</div>' +
    '</div></header>' +
    '<div class="mobile-menu">' + mobileLinks + '</div>';

  // ---------- FOOTER ----------
  var svcSource = (SVCNAMES.length ? SVCNAMES.filter(function(s){return s.visible!==false;}).map(function(s){return {t:s.title,id:s.id};}) : SERVICES.map(function(s,i){return {t:s,id:'svc-'+i};}));
  var svcLinks = svcSource.map(function (s) {
    return '<a href="services.html#' + s.id + '">' + s.t + '</a>';
  }).join('');
  var footer =
    '<footer class="site-footer"><div class="wrap">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<div style="display:flex;align-items:center;gap:11px"><img src="assets/logo-mark-white.png" style="width:38px" alt=""><b>' + (SET.brandName || 'פריים לדג׳ר') + '</b></div>' +
          '<p>בית תוכן עסקי אחד — הנהלת חשבונות, ייעוץ, שיווק ובניית אתרים. מהרעיון ועד ההשקה.</p>' +
          '<div class="footer-social" style="margin-top:20px">' +
            '<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 22 10.9 22 14.3V21h-4v-5.9c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z"/></svg></a>' +
            '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a>' +
            '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7c0-1 .3-1.5 1.6-1.5H17V2.2C16.5 2.1 15.4 2 14.5 2 11.9 2 10 3.6 10 6.5V9H7.5v3.5H10V22h4v-9.5h2.7l.4-3.5z"/></svg></a>' +
            '<a href="#" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.5 12.6l-.3.4.7 2.5-2.5-.7-.4.2A8 8 0 1 1 12 4zm-3 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.4-.3-.2-1.5-.8-1.8-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.1-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4z"/></svg></a>' +
          '</div>' +
        '</div>' +
        '<div><h4>השירותים שלנו</h4>' + svcLinks + '</div>' +
        '<div><h4>החברה</h4><a href="about.html">אודות</a><a href="examples.html">דוגמאות עבודות</a><a href="guide.html">מדריך מקצועי</a><a href="pricing.html">מחירון</a></div>' +
        '<div><h4>תמיכה</h4><a href="contact.html">צור קשר</a><a href="faq.html">שאלות ותשובות</a><a href="forms.html">טפסים להורדה</a><a href="simulators.html">סימולטורים</a><a href="terms.html">תנאי שימוש</a></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© 2026 ' + (SET.brandName || 'פריים לדג׳ר') + ' · כל הזכויות שמורות</span>' +
        '<span dir="ltr">' + (SET.phoneSales || '053-926-5062') + ' · ' + (SET.email || 'info@primels.co.il') + '</span>' +
      '</div>' +
    '</div></footer>';

  var h = document.getElementById('site-header');
  var f = document.getElementById('site-footer');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

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

  // ---------- REVEAL on scroll ----------
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.style.animationPlayState = 'running'; io.unobserve(en.target); } });
    }, { threshold: 0.12 });
  }

  if (window.lucide) lucide.createIcons();
})();
