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
})();
