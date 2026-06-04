/* services.html — renders service blocks from PLData */
(function () {
  var d = window.PLData.data;
  var root = document.getElementById('svcRoot');
  if (!root) return;

  function block(s, idx) {
    var dark = idx % 3 === 2; // every 3rd panel is a dark gradient
    var feats = (s.features || []).map(function (f) {
      return '<li><i data-lucide="check-circle-2"></i>' + f + '</li>';
    }).join('');
    var visual = dark
      ? '<div class="svc-visual dark"><span class="eyebrow" style="color:#fff">' + s.title + '</span>' +
          '<div style="display:flex;align-items:flex-end;gap:10px;height:120px;margin-top:8px">' +
          '<div style="flex:1;height:45%;background:rgba(255,255,255,.25);border-radius:6px 6px 0 0"></div>' +
          '<div style="flex:1;height:62%;background:rgba(255,255,255,.35);border-radius:6px 6px 0 0"></div>' +
          '<div style="flex:1;height:80%;background:rgba(255,255,255,.55);border-radius:6px 6px 0 0"></div>' +
          '<div style="flex:1;height:100%;background:var(--sky-400);border-radius:6px 6px 0 0"></div></div></div>'
      : '<div class="svc-visual"><div style="font-family:var(--font-mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--brand-600);margin-bottom:4px">מה כלול</div>' +
          (s.features || []).slice(0, 4).map(function (f) {
            return '<div class="vrow" style="background:var(--surface)"><div class="icon-chip" style="width:36px;height:36px;background:var(--brand-50);color:var(--brand-600)"><i data-lucide="check"></i></div><div style="flex:1"><b style="font-size:14.5px">' + f + '</b></div></div>';
          }).join('') + '</div>';

    return '<section class="svc-block" id="' + s.id + '">' +
        '<div><div class="icon-chip"><i data-lucide="' + s.icon + '"></i></div>' +
          '<h2>' + s.title + '</h2>' +
          '<p class="lead">' + (s.desc || s.short || '') + '</p>' +
          '<ul class="svc-incl">' + feats + '</ul>' +
          '<a class="btn btn-primary" href="contact.html">לשיחת ייעוץ <i data-lucide="arrow-left"></i></a>' +
        '</div>' + visual +
      '</section>';
  }

  var webBlock =
    '<section class="svc-block" id="svc-web" style="border-bottom:none">' +
      '<div><div class="icon-chip accent"><i data-lucide="code-xml"></i></div>' +
        '<h2>בניית אתרים ומערכות</h2>' +
        '<p class="lead">החטיבה הדיגיטלית שלנו בונה אתרי תדמית, חנויות ומערכות ניהול מותאמות אישית — מהאפיון ועד ההשקה.</p>' +
        '<ul class="svc-incl"><li><i data-lucide="check-circle-2"></i>אתרי תדמית ונחיתה</li><li><i data-lucide="check-circle-2"></i>חנויות אונליין וסליקה</li><li><i data-lucide="check-circle-2"></i>מערכות ניהול ופורטלים</li><li><i data-lucide="check-circle-2"></i>אפליקציות לעסק</li></ul>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-accent" href="contact.html">דברו איתנו <i data-lucide="arrow-left"></i></a></div>' +
      '</div>' +
      '<div class="svc-visual dark">' +
        '<div class="mock-top" style="background:rgba(255,255,255,.06);border:none;border-radius:8px;margin:-6px -6px 6px"><i style="background:rgba(255,255,255,.3)"></i><i style="background:rgba(255,255,255,.3)"></i><i style="background:rgba(255,255,255,.3)"></i><span class="mt-title" style="color:rgba(255,255,255,.5)" dir="ltr">yoursite.co.il</span></div>' +
        '<div style="height:54px;border-radius:8px;background:var(--grad-brand)"></div>' +
        '<div style="display:flex;gap:8px"><div style="flex:1;height:40px;border-radius:8px;background:rgba(255,255,255,.12)"></div><div style="flex:1;height:40px;border-radius:8px;background:rgba(255,255,255,.12)"></div><div style="flex:1;height:40px;border-radius:8px;background:rgba(255,255,255,.12)"></div></div>' +
        '<div style="height:14px;width:70%;border-radius:5px;background:rgba(255,255,255,.18)"></div>' +
        '<div style="height:14px;width:50%;border-radius:5px;background:rgba(255,255,255,.12)"></div>' +
      '</div>' +
    '</section>';

  root.innerHTML = d.services.filter(function (s) { return s.visible !== false; }).map(block).join('') + webBlock;
  if (window.lucide) lucide.createIcons();
})();
