/* services.html — renders service blocks + deep-detail modal */
(function () {
  var d = window.PLData.data;
  var root = document.getElementById('svcRoot');
  if (!root) return;

  // ── modal markup (injected once) ──
  if (!document.getElementById('svc-modal')) {
    var m = document.createElement('div');
    m.innerHTML =
      '<div id="svc-modal-bg" onclick="closeSvcModal()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:900;backdrop-filter:blur(4px)"></div>' +
      '<div id="svc-modal" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.96);z-index:901;width:min(680px,94vw);max-height:88vh;overflow-y:auto;background:#fff;border-radius:20px;box-shadow:0 32px 80px rgba(0,0,0,.22);direction:rtl;transition:transform .2s">' +
        '<div id="svc-modal-inner"></div>' +
      '</div>';
    document.body.appendChild(m.children[0]);
    document.body.appendChild(m.children[0]);
  }

  window.openSvcModal = function(sId) {
    var s = (d.services || []).find(function(x){ return x.id === sId; });
    if (!s) return;
    var feats = (s.features || []).map(function(f){
      return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #f0f0f0">' +
        '<span style="width:22px;height:22px;border-radius:50%;background:#eef4fb;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="#0054a8" stroke-width="2.5" style="width:13px;height:13px"><polyline points="20 6 9 17 4 12"/></svg></span>' +
        '<span style="font-size:15px;color:#333;line-height:1.55">' + f + '</span></div>';
    }).join('');

    var extraLink = s.id === 'svc-6'
      ? '<a href="compliance.html" style="display:inline-flex;align-items:center;gap:6px;border:1.5px solid rgba(0,84,168,.35);color:#0054a8;padding:11px 20px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none">קרא עוד על שירותי הציות ←</a>'
      : '';

    document.getElementById('svc-modal-inner').innerHTML =
      '<div style="padding:28px 28px 0;display:flex;justify-content:space-between;align-items:flex-start">' +
        '<div style="display:flex;align-items:center;gap:14px">' +
          '<div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#eef4fb,#ddeeff);display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
            '<i data-lucide="' + (s.icon||'briefcase') + '" style="width:24px;height:24px;color:#0054a8"></i>' +
          '</div>' +
          '<h2 style="font-size:22px;font-weight:800;margin:0;color:#1a1a2e">' + s.title + '</h2>' +
        '</div>' +
        '<button onclick="closeSvcModal()" style="background:none;border:none;cursor:pointer;padding:4px;border-radius:8px;color:#666;font-size:22px;line-height:1;flex-shrink:0">✕</button>' +
      '</div>' +
      '<div style="padding:0 28px">' +
        '<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 20px">' + (s.desc || s.short || '') + '</p>' +
        '<div style="font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#0054a8;margin-bottom:6px">מה כלול בשירות</div>' +
        '<div style="margin-bottom:24px">' + feats + '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;padding-bottom:28px">' +
          '<a href="contact.html" style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#0054a8,#2579d8);color:#fff;padding:12px 22px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 4px 14px rgba(0,84,168,.25)">קביעת שיחת ייעוץ ←</a>' +
          extraLink +
        '</div>' +
      '</div>';

    document.getElementById('svc-modal-bg').style.display = 'block';
    var modal = document.getElementById('svc-modal');
    modal.style.display = 'block';
    modal.scrollTop = 0;
    setTimeout(function(){ modal.style.transform = 'translate(-50%,-50%) scale(1)'; }, 10);
    if (window.lucide) lucide.createIcons();
    document.body.style.overflow = 'hidden';
  };

  window.closeSvcModal = function() {
    var modal = document.getElementById('svc-modal');
    modal.style.transform = 'translate(-50%,-50%) scale(.96)';
    setTimeout(function(){
      modal.style.display = 'none';
      document.getElementById('svc-modal-bg').style.display = 'none';
      document.body.style.overflow = '';
    }, 180);
  };

  // close on Escape
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') window.closeSvcModal(); });

  // ── render block ──
  function block(s, idx) {
    var dark = idx % 3 === 2;
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

    // "קרא עוד" button that opens modal
    var pageMap = {'svc-0':'accounting.html','svc-1':'payroll.html','svc-2':'business.html','svc-3':'finance.html','svc-4':'marketing.html','svc-5':'sales.html','svc-6':'compliance.html'};
    var pagePath = pageMap[s.id] || 'contact.html';
    var moreBtn = '<a href="' + pagePath + '" style="display:inline-flex;align-items:center;gap:6px;background:none;border:1.5px solid rgba(0,84,168,.3);color:#0054a8;padding:9px 18px;border-radius:8px;font-weight:600;font-size:13.5px;text-decoration:none;transition:.2s" onmouseover="this.style.background=\'rgba(0,84,168,.06)\'" onmouseout="this.style.background=\'none\'">דף מלא <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>';

    var complianceExtra = s.id === 'svc-6'
      ? '<a href="compliance.html" style="display:inline-flex;align-items:center;gap:5px;color:#0054a8;font-size:13.5px;font-weight:600;text-decoration:none;border-bottom:1.5px solid rgba(0,84,168,.25);padding-bottom:1px">דף ציות מלא ←</a>'
      : '';

    return '<section class="svc-block" id="' + s.id + '">' +
        '<div><div class="icon-chip"><i data-lucide="' + s.icon + '"></i></div>' +
          '<h2>' + s.title + '</h2>' +
          '<p class="lead">' + (s.desc || s.short || '') + '</p>' +
          '<ul class="svc-incl">' + feats + '</ul>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
            '<a class="btn btn-primary" href="contact.html">לשיחת ייעוץ <i data-lucide="arrow-left"></i></a>' +
            moreBtn + complianceExtra +
          '</div>' +
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

  function render() {
    d = window.PLData.data;
    root.innerHTML = d.services.filter(function (s) { return s.visible !== false; }).map(block).join('') + webBlock;
    if (window.lucide) lucide.createIcons();
  }

  render();
  document.addEventListener('pl:data-ready', render);
})();
