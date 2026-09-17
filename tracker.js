/* Prime Ledger — visitor tracker v1
   Tracks: page, referrer, channel, device, browser, UTM params.
   NO PII stored — session_id is random, no name/email/IP saved. */
(function () {
  var SB_URL  = 'https://urpzikwromhwtuffkhyr.supabase.co';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycHppa3dyb21od3R1ZmZraHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5Njk4MDEsImV4cCI6MjA5NTU0NTgwMX0.lnnmGDSkQ8hPR0QGP2WnJAhDO2qIZSfJWaXh15c7Obo';

  // ── Session ID (random per browser session, resets on tab close) ──
  var sid = sessionStorage.getItem('pl_sid');
  if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('pl_sid', sid); }

  // ── Channel detection ──
  var params = new URLSearchParams(location.search);
  var utmSrc = params.get('utm_source') || '';
  var utmMed = params.get('utm_medium') || '';
  var utmCamp = params.get('utm_campaign') || '';
  var ref = document.referrer || '';

  function detectChannel() {
    if (utmSrc) return utmSrc.toLowerCase();
    if (!ref) return 'direct';
    if (/google|bing|yahoo|yandex|duckduck/i.test(ref)) return 'search';
    if (/facebook|fb\.com|fb\.me/i.test(ref)) return 'facebook';
    if (/instagram/i.test(ref)) return 'instagram';
    if (/linkedin/i.test(ref)) return 'linkedin';
    if (/whatsapp|wa\.me/i.test(ref)) return 'whatsapp';
    if (/t\.co|twitter|x\.com/i.test(ref)) return 'twitter';
    if (/tiktok/i.test(ref)) return 'tiktok';
    if (/youtube/i.test(ref)) return 'youtube';
    if (/primels\.co\.il|portal\.primels\.co\.il/i.test(ref)) return 'internal';
    return 'other';
  }

  // ── Device detection ──
  function detectDevice() {
    var ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  // ── Browser detection ──
  function detectBrowser() {
    var ua = navigator.userAgent;
    if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) return 'chrome';
    if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'safari';
    if (/firefox/i.test(ua)) return 'firefox';
    if (/edge|edg/i.test(ua)) return 'edge';
    return 'other';
  }

  // ── Page name ──
  var page = location.pathname.split('/').pop() || 'index.html';
  if (!page || page === '') page = 'index.html';

  // ── Send to Supabase (fire-and-forget) ──
  try {
    fetch(SB_URL + '/rest/v1/site_visits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SB_ANON,
        'Authorization': 'Bearer ' + SB_ANON,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        page:         page,
        referrer:     ref.slice(0, 250),
        channel:      detectChannel(),
        device:       detectDevice(),
        browser:      detectBrowser(),
        session_id:   sid,
        utm_source:   utmSrc,
        utm_medium:   utmMed,
        utm_campaign: utmCamp
      })
    });
  } catch (e) { /* silent fail — never block the page */ }

  /* ============================================================
     prime_analytics_events — additive, does not touch site_visits above.
     Anon-safe (allow-listed event_name/source_app via RLS+CHECK on the
     table itself), fire-and-forget, never throws, never blocks the page.
     ============================================================ */
  var utmCont = params.get('utm_content') || '';

  // Channel taxonomy required for prime_analytics_events / site_leads / profiles:
  // google_organic | google_ads | facebook | instagram | whatsapp | tiktok |
  // referral | email | direct | portal | unknown
  function detectChannelV2() {
    var src = (utmSrc || '').toLowerCase();
    var med = (utmMed || '').toLowerCase();
    if (src) {
      if (src.indexOf('google') !== -1) return /cpc|ppc|paid|ads?/.test(med) ? 'google_ads' : 'google_organic';
      if (src.indexOf('facebook') !== -1 || src.indexOf('fb') !== -1) return 'facebook';
      if (src.indexOf('instagram') !== -1 || src === 'ig') return 'instagram';
      if (src.indexOf('whatsapp') !== -1 || src === 'wa') return 'whatsapp';
      if (src.indexOf('tiktok') !== -1) return 'tiktok';
      if (med === 'email' || src.indexOf('email') !== -1 || src.indexOf('newsletter') !== -1) return 'email';
    }
    if (med === 'email') return 'email';
    if (med === 'cpc' || med === 'ppc' || med === 'paid') return 'google_ads';
    if (!ref) return 'direct';
    if (/(^|\/\/)([a-z0-9-]+\.)*google\./i.test(ref)) return 'google_organic';
    if (/facebook\.com|fb\.com|fb\.me/i.test(ref)) return 'facebook';
    if (/instagram\.com/i.test(ref)) return 'instagram';
    if (/whatsapp\.com|wa\.me/i.test(ref)) return 'whatsapp';
    if (/tiktok\.com/i.test(ref)) return 'tiktok';
    if (/(^|\/\/)([a-z0-9-]+\.)*(primels\.co\.il)/i.test(ref)) return 'portal';
    if (/^https?:\/\//i.test(ref)) return 'referral';
    return 'unknown';
  }

  // Long-lived anonymous visitor id (separate from the per-tab session id above)
  var aid;
  try {
    aid = localStorage.getItem('pl_aid');
    if (!aid) { aid = 'a-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); localStorage.setItem('pl_aid', aid); }
  } catch (e) { aid = null; }

  // First-touch attribution — captured once, kept until the visitor converts.
  // Read later by contact.html (lead form) and, on the portal side, at signup.
  var ATTR_KEY = 'pl_attribution_v1';
  function readAttr() { try { return JSON.parse(localStorage.getItem(ATTR_KEY)) || null; } catch (e) { return null; } }
  function writeAttr(a) { try { localStorage.setItem(ATTR_KEY, JSON.stringify(a)); } catch (e) {} }
  var landingPage = location.pathname.split('/').pop() || 'index.html';
  if (!landingPage) landingPage = 'index.html';
  var channelV2 = detectChannelV2();
  if (!readAttr()) {
    writeAttr({
      channel: channelV2,
      utm_source: utmSrc || null,
      utm_medium: utmMed || null,
      utm_campaign: utmCamp || null,
      utm_content: utmCont || null,
      referrer: ref ? ref.slice(0, 500) : null,
      landing_page: landingPage
    });
  }

  function deviceType() { return detectDevice(); }

  function sendAnalyticsEvent(eventName, extra) {
    try {
      var body = {
        event_name: eventName,
        source_app: 'website',
        session_id: sid,
        anonymous_id: aid,
        path: location.pathname || '/',
        page_title: (document && document.title) ? document.title.slice(0, 200) : null,
        referrer: ref ? ref.slice(0, 500) : null,
        channel: channelV2,
        utm_source: utmSrc || null,
        utm_medium: utmMed || null,
        utm_campaign: utmCamp || null,
        utm_content: utmCont || null,
        device_type: deviceType(),
        browser: detectBrowser(),
        metadata: (extra && extra.metadata) || {}
      };
      if (extra) {
        if (extra.channel) body.channel = extra.channel;
        if (extra.path) body.path = extra.path;
      }
      fetch(SB_URL + '/rest/v1/prime_analytics_events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SB_ANON,
          'Authorization': 'Bearer ' + SB_ANON,
          'Prefer': 'return=minimal' // no RETURNING → no SELECT-back RLS needed for the anon insert-only policy
        },
        body: JSON.stringify(body)
      });
    } catch (e) { /* silent fail — analytics must never break the site */ }
  }

  // page_view — every page load
  sendAnalyticsEvent('page_view');

  // session_start — once per browser tab session
  try {
    if (!sessionStorage.getItem('pl_ss_fired')) {
      sessionStorage.setItem('pl_ss_fired', '1');
      sendAnalyticsEvent('session_start');
    }
  } catch (e) {}

  // Exposed for other pages/scripts (e.g. contact.html lead form) —
  // never throws, always returns a usable object.
  window.PLTracker = {
    sessionId: sid,
    anonymousId: aid,
    getAttribution: function () { return readAttr() || { channel: 'unknown', utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, referrer: null, landing_page: landingPage }; },
    track: function (eventName, extra) { sendAnalyticsEvent(eventName, extra); }
  };
})();
