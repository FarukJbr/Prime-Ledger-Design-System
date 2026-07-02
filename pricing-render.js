/* pricing.html — renders tiers + add-ons from PLData */
(function () {
  var d = window.PLData.data;
  var cycle = 'month';
  var ils = function (n) { return '₪' + n.toLocaleString('he-IL'); };

  function tierCard(t) {
    var price = cycle === 'month' ? t.priceM : Math.round(t.priceY / 12);
    var feats = (t.features || []).map(function (f) {
      var on = f[1];
      return '<li class="' + (on ? '' : 'off') + '"><i data-lucide="' + (on ? 'check' : 'minus') + '"></i>' + f[0] + '</li>';
    }).join('');
    return '<div class="tier' + (t.popular ? ' pop' : '') + '">' +
      (t.popular ? '<span class="tier-tag">הכי פופולרי</span>' : '') +
      '<h3>' + t.name + '</h3>' +
      '<p class="desc">' + t.desc + '</p>' +
      '<div class="price"><b>' + price.toLocaleString('he-IL') + '</b><span>₪ / חודש</span></div>' +
      '<ul>' + feats + '</ul>' +
      '<a class="btn ' + (t.popular ? 'btn-primary' : 'btn-secondary') + ' btn-block" href="contact.html">' + (t.popular ? 'בחירה בחבילה' : 'מתחילים') + '</a>' +
    '</div>';
  }

  function addonRow(a, i) {
    var bg = i % 4 === 0 ? 'background:var(--accent-50);color:var(--accent-600)' : i % 4 === 3 ? 'background:var(--sky-400);color:#fff' : '';
    return '<div class="addon-row"><div class="icon-chip" style="' + bg + '"><i data-lucide="' + a.icon + '"></i></div>' +
      '<div><b>' + a.title + '</b><p>' + a.desc + '</p></div>' +
      '<div class="ap">' + a.price + '</div></div>';
  }

  function render() {
    var tiers = d.tiers.filter(function (t) { return t.visible !== false; });
    document.getElementById('tiersRoot').innerHTML = tiers.map(tierCard).join('');
    document.getElementById('addonsRoot').innerHTML = d.addons.map(addonRow).join('');
    if (window.lucide) lucide.createIcons();
  }

  window.setCycle = function (c) {
    cycle = c;
    document.querySelectorAll('.toggle button').forEach(function (b) { b.classList.toggle('on', b.dataset.cycle === c); });
    render();
  };

  render();

  /* Re-render when Supabase data arrives (data.js fires this after async fetch) */
  document.addEventListener('pl:data-ready', function() {
    d = window.PLData.data;
    render();
  });
})();
