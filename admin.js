/* Prime Ledger — Admin panel controller (admin.js)
   Full CRUD over PLData. Persists to localStorage; public site reads same store. */
(function () {
  var D = window.PLData;
  var scroll = document.getElementById('aScroll');
  var titleEl = document.getElementById('aTitle');
  var TITLES = { dashboard: 'לוח בקרה', services: 'שירותים', pricing: 'מחירון ותוספות', forms: 'טפסים', clients: 'לקוחות', leads: 'פניות', settings: 'פרטים והגדרות' };
  var ICONS = ['calculator','wallet','briefcase','line-chart','megaphone','handshake','scale','code-xml','receipt','bar-chart-3','shield-check','users','file-text','trending-up','building-2','globe','zap','target','heart-handshake','sheet','file','folder'];

  function esc(s){ return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function ils(n){ return '₪'+Number(n).toLocaleString('he-IL'); }
  function icons(){ if(window.lucide) lucide.createIcons(); }
  function flash(){ var s=document.getElementById('saved'); s.classList.add('show'); setTimeout(function(){s.classList.remove('show');},1400); }
  function commit(){ D.save(); flash(); }

  /* ---------------- MODAL ---------------- */
  var ov=document.getElementById('modalOv'), mBody=document.getElementById('modalBody'), mTitle=document.getElementById('modalTitle');
  var saveCb=null;
  function openModal(title, html, onSave){ mTitle.textContent=title; mBody.innerHTML=html; saveCb=onSave; ov.classList.add('open'); icons(); }
  function closeModal(){ ov.classList.remove('open'); saveCb=null; }
  document.getElementById('modalClose').onclick=closeModal;
  document.getElementById('modalCancel').onclick=closeModal;
  document.getElementById('modalSave').onclick=function(){ if(saveCb && saveCb()===false) return; closeModal(); };
  ov.addEventListener('click',function(e){ if(e.target===ov) closeModal(); });

  function iconOptions(sel){ return ICONS.map(function(i){return '<option value="'+i+'"'+(i===sel?' selected':'')+'>'+i+'</option>';}).join(''); }
  function val(id){ var e=document.getElementById(id); return e?e.value.trim():''; }

  /* ---------------- VIEWS ---------------- */
  var VIEWS = {};

  VIEWS.dashboard = function(){
    var d=D.data;
    var revenue = d.tiers.reduce(function(s,t){return s+t.priceM;},0); // illustrative
    return '<div class="a-view">'+
      '<div class="a-grid4">'+
        kpi('users','לקוחות פעילים','450','var(--brand-50)','var(--brand-600)')+
        kpi('trending-up','הכנסה חודשית','₪286K','var(--success-bg)','var(--success)')+
        kpi('inbox','פניות חדשות','4','var(--accent-50)','var(--accent-600)')+
        kpi('grid-3x3','שירותים פעילים',String(d.services.filter(function(s){return s.visible!==false;}).length),'var(--n-100)','var(--ink-2)')+
      '</div>'+
      '<div class="a-card"><div class="a-card-h"><h3>פעולות מהירות</h3></div><div class="a-card-b" style="padding:16px 20px;display:flex;gap:10px;flex-wrap:wrap">'+
        '<button class="btn btn-secondary" onclick="ADMIN.go(\'services\')"><i data-lucide="grid-3x3"></i>ניהול שירותים</button>'+
        '<button class="btn btn-secondary" onclick="ADMIN.go(\'pricing\')"><i data-lucide="tag"></i>עריכת מחירים</button>'+
        '<button class="btn btn-secondary" onclick="ADMIN.go(\'forms\')"><i data-lucide="file-down"></i>ניהול טפסים</button>'+
        '<button class="btn btn-secondary" onclick="ADMIN.go(\'settings\')"><i data-lucide="settings"></i>פרטי קשר</button>'+
      '</div></div>'+
      '<div class="a-card"><div class="a-card-h"><h3>פניות אחרונות</h3><button class="btn btn-ghost btn-sm" onclick="ADMIN.go(\'leads\')">לכל הפניות</button></div><div class="a-card-b">'+
        leadRow('דנה כהן','עניין בחבילת צמיחה','לפני שעה')+leadRow('יוסי לוי','בניית אתר לעסק','לפני 3 שעות')+leadRow('מירב אזולאי','שאלה על החזר מס','אתמול')+
      '</div></div>'+
    '</div>';
  };
  function kpi(ic,l,v,bg,fg){ return '<div class="a-kpi"><div class="ic" style="background:'+bg+';color:'+fg+'"><i data-lucide="'+ic+'"></i></div><div class="l">'+l+'</div><div class="v">'+v+'</div></div>'; }
  function leadRow(n,m,t){ return '<div class="a-item"><div class="a-ic" style="background:var(--accent-50);color:var(--accent-600)"><i data-lucide="user"></i></div><div class="a-main"><b>'+esc(n)+'</b><small>'+esc(m)+'</small></div><span style="color:var(--ink-3);font-size:13px">'+t+'</span></div>'; }

  /* ----- SERVICES ----- */
  VIEWS.services = function(){
    var rows = D.data.services.map(function(s,i){
      return '<div class="a-item"><div class="a-ic"><i data-lucide="'+esc(s.icon)+'"></i></div>'+
        '<div class="a-main"><b>'+esc(s.title)+'</b><small>'+esc(s.short||'')+'</small></div>'+
        '<div class="a-acts">'+
          '<button class="a-sw'+(s.visible!==false?' on':'')+'" title="הצגה באתר" onclick="ADMIN.toggleSvc('+i+')"></button>'+
          '<button class="a-iconbtn" title="עריכה" onclick="ADMIN.editSvc('+i+')"><i data-lucide="pencil"></i></button>'+
          '<button class="a-iconbtn danger" title="מחיקה" onclick="ADMIN.delSvc('+i+')"><i data-lucide="trash-2"></i></button>'+
        '</div></div>';
    }).join('');
    return '<div class="a-view"><div class="a-card"><div class="a-card-h"><h3>השירותים שלנו ('+D.data.services.length+')</h3>'+
      '<button class="btn btn-primary btn-sm" onclick="ADMIN.editSvc(-1)"><i data-lucide="plus"></i>שירות חדש</button></div>'+
      '<div class="a-card-b">'+rows+'</div></div>'+
      '<p class="muted" style="font-size:13px;text-align:center">השינויים נשמרים אוטומטית ומשתקפים בעמוד "השירותים" ובדף הבית.</p></div>';
  };
  function svcModalHtml(s){
    var feats=(s.features||[]).map(function(f){return featRow(f);}).join('');
    return '<div class="a-mfld"><label>שם השירות</label><input id="m_title" value="'+esc(s.title)+'"></div>'+
      '<div class="a-mfld"><label>אייקון</label><select id="m_icon">'+iconOptions(s.icon)+'</select></div>'+
      '<div class="a-mfld"><label>תיאור קצר (לכרטיס בדף הבית)</label><input id="m_short" value="'+esc(s.short||'')+'"></div>'+
      '<div class="a-mfld"><label>תיאור מלא (לעמוד השירותים)</label><textarea id="m_desc" rows="3">'+esc(s.desc||'')+'</textarea></div>'+
      '<div class="a-mfld"><label>מה כלול (נקודות)</label><div id="m_feats">'+feats+'</div>'+
      '<button class="a-addbtn" onclick="ADMIN.addFeat(\'m_feats\')"><i data-lucide="plus"></i>הוספת נקודה</button></div>';
  }
  function featRow(v){ return '<div class="a-feat-row"><input class="m_feat" value="'+esc(v)+'"><button class="a-iconbtn danger" onclick="this.parentNode.remove()"><i data-lucide="x"></i></button></div>'; }

  /* ----- PRICING ----- */
  VIEWS.pricing = function(){
    var tiers=D.data.tiers.map(function(t,i){
      var feats=t.features.filter(function(f){return f[1];}).length;
      return '<div class="a-tier'+(t.popular?' pop':'')+'"><h4>'+esc(t.name)+(t.popular?' <span style="font-size:11px;background:var(--brand-500);color:#fff;padding:2px 8px;border-radius:999px">פופולרי</span>':'')+'</h4>'+
        '<div class="pp">'+ils(t.priceM)+'<small>/חודש</small></div>'+
        '<div class="ft">'+feats+' תכונות פעילות · שנתי '+ils(t.priceY)+'</div>'+
        '<div class="a-acts"><button class="a-iconbtn" onclick="ADMIN.editTier('+i+')"><i data-lucide="pencil"></i></button>'+
        '<button class="a-iconbtn danger" onclick="ADMIN.delTier('+i+')"><i data-lucide="trash-2"></i></button></div></div>';
    }).join('');
    var addons=D.data.addons.map(function(a,i){
      return '<div class="a-item"><div class="a-ic" style="background:var(--accent-50);color:var(--accent-600)"><i data-lucide="'+esc(a.icon)+'"></i></div>'+
        '<div class="a-main"><b>'+esc(a.title)+'</b><small>'+esc(a.desc)+'</small></div>'+
        '<span style="font-weight:700;color:var(--brand-600);margin-inline-end:8px;white-space:nowrap">'+esc(a.price)+'</span>'+
        '<div class="a-acts"><button class="a-iconbtn" onclick="ADMIN.editAddon('+i+')"><i data-lucide="pencil"></i></button>'+
        '<button class="a-iconbtn danger" onclick="ADMIN.delAddon('+i+')"><i data-lucide="trash-2"></i></button></div></div>';
    }).join('');
    return '<div class="a-view">'+
      '<div class="a-card"><div class="a-card-h"><h3>חבילות מנוי</h3><button class="btn btn-primary btn-sm" onclick="ADMIN.editTier(-1)"><i data-lucide="plus"></i>חבילה חדשה</button></div>'+
        '<div class="a-card-b" style="padding:18px 20px"><div class="a-tiers">'+tiers+'</div></div></div>'+
      '<div class="a-card"><div class="a-card-h"><h3>תוספות ושירותים נוספים</h3><button class="btn btn-primary btn-sm" onclick="ADMIN.editAddon(-1)"><i data-lucide="plus"></i>תוספת חדשה</button></div>'+
        '<div class="a-card-b">'+addons+'</div></div></div>';
  };
  function tierModalHtml(t){
    var feats=(t.features||[]).map(function(f){return tierFeatRow(f[0],f[1]);}).join('');
    return '<div class="a-mfld"><label>שם החבילה</label><input id="m_name" value="'+esc(t.name)+'"></div>'+
      '<div class="a-mfld"><label>תיאור</label><input id="m_desc" value="'+esc(t.desc)+'"></div>'+
      '<div style="display:flex;gap:12px"><div class="a-mfld" style="flex:1"><label>מחיר חודשי (₪)</label><input id="m_pm" type="number" value="'+t.priceM+'"></div>'+
      '<div class="a-mfld" style="flex:1"><label>מחיר שנתי (₪)</label><input id="m_py" type="number" value="'+t.priceY+'"></div></div>'+
      '<div class="a-checkrow"><input type="checkbox" id="m_pop"'+(t.popular?' checked':'')+'><label for="m_pop" style="margin:0">סמן כחבילה הפופולרית</label></div>'+
      '<div class="a-mfld" style="margin-top:10px"><label>תכונות (✓ = כלול בחבילה)</label><div id="m_tfeats">'+feats+'</div>'+
      '<button class="a-addbtn" onclick="ADMIN.addTierFeat()"><i data-lucide="plus"></i>הוספת תכונה</button></div>';
  }
  function tierFeatRow(t,on){ return '<div class="a-feat-row"><input type="checkbox" class="tf_on"'+(on?' checked':'')+' style="width:auto"><input class="tf_t" value="'+esc(t)+'"><button class="a-iconbtn danger" onclick="this.parentNode.remove()"><i data-lucide="x"></i></button></div>'; }

  /* ----- FORMS ----- */
  VIEWS.forms = function(){
    var cats=D.data.forms.map(function(c,ci){
      var files=c.files.map(function(f,fi){
        return '<div class="a-item" style="padding:11px 0"><div class="a-ic" style="width:34px;height:34px;background:var(--danger-bg);color:var(--danger)"><i data-lucide="file"></i></div>'+
          '<div class="a-main"><b style="font-size:14.5px">'+esc(f[0])+'</b><small>'+esc(f[1])+'</small></div>'+
          '<div class="a-acts"><button class="a-iconbtn" onclick="ADMIN.editFile('+ci+','+fi+')"><i data-lucide="pencil"></i></button>'+
          '<button class="a-iconbtn danger" onclick="ADMIN.delFile('+ci+','+fi+')"><i data-lucide="trash-2"></i></button></div></div>';
      }).join('');
      return '<div class="a-card"><div class="a-card-h"><h3 style="font-size:16px;display:flex;align-items:center;gap:9px"><i data-lucide="'+esc(c.icon)+'" style="width:18px;height:18px;color:var(--brand-600)"></i>'+esc(c.cat)+'</h3>'+
        '<div style="display:flex;gap:6px"><button class="btn btn-secondary btn-sm" onclick="ADMIN.editFile('+ci+',-1)"><i data-lucide="plus"></i>טופס</button>'+
        '<button class="a-iconbtn danger" title="מחיקת קטגוריה" onclick="ADMIN.delCat('+ci+')"><i data-lucide="trash-2"></i></button></div></div>'+
        '<div class="a-card-b">'+(files||'<p class="muted" style="padding:8px 0;font-size:13px">אין טפסים בקטגוריה זו.</p>')+'</div></div>';
    }).join('');
    return '<div class="a-view"><div style="display:flex;justify-content:flex-end;margin-bottom:16px"><button class="btn btn-primary btn-sm" onclick="ADMIN.editCat(-1)"><i data-lucide="plus"></i>קטגוריה חדשה</button></div>'+cats+'</div>';
  };

  /* ----- CLIENTS (real, backed by PLBackend) ----- */
  var TIERS_LIST = ['בסיס','צמיחה','מלא'];
  function statusBadge(st){
    var map={ active:['פעיל','var(--success-bg)','var(--success)'], blocked:['חסום','var(--danger-bg)','var(--danger)'], invited:['מוזמן','var(--warning-bg)','var(--warning)'] };
    var m=map[st]||map.active;
    return '<span class="pbadge" style="font-size:12px;padding:4px 10px;border-radius:999px;font-weight:700;background:'+m[1]+';color:'+m[2]+'">'+m[0]+'</span>';
  }
  VIEWS.clients = function(){
    var demo = window.PLBackend && window.PLBackend.isDemo;
    return '<div class="a-view"><div class="a-card">'+
      '<div class="a-card-h"><h3>לקוחות <span id="clCount" class="muted" style="font-weight:600;font-size:14px"></span></h3>'+
        '<div style="display:flex;gap:8px;align-items:center">'+
          '<div class="a-search" style="display:flex;align-items:center;gap:7px;border:1.5px solid var(--border-strong);border-radius:var(--r-md);padding:6px 11px;background:var(--surface)"><i data-lucide="search" style="width:16px;height:16px;color:var(--ink-4)"></i><input id="clSearch" placeholder="חיפוש לקוח..." oninput="ADMIN.filterClients()" style="border:none;outline:none;background:none;font-family:inherit;font-size:14px;width:150px"></div>'+
          '<button class="btn btn-primary btn-sm" onclick="ADMIN.editClient(null)"><i data-lucide="user-plus"></i>לקוח חדש</button>'+
        '</div></div>'+
      '<div class="a-card-b" style="padding:14px 20px"><div id="clWrap"><p class="muted" style="padding:18px 0;text-align:center">טוען לקוחות…</p></div></div></div>'+
      (demo?'<p class="muted" style="font-size:13px;text-align:center">מצב הדגמה — הלקוחות נשמרים בדפדפן זה בלבד. חברו Supabase לנתונים אמיתיים בענן.</p>':'')+
      '</div>';
  };
  var _clients=[];
  function renderClientRows(list){
    var wrap=document.getElementById('clWrap'); if(!wrap) return;
    var cnt=document.getElementById('clCount'); if(cnt) cnt.textContent='('+list.length+')';
    if(!list.length){ wrap.innerHTML='<p class="muted" style="padding:18px 0;text-align:center">אין לקוחות להצגה.</p>'; return; }
    var tr=list.map(function(c){
      var blocked=c.status==='blocked';
      return '<tr'+(blocked?' style="opacity:.6"':'')+'>'+
        '<td><b>'+esc(c.full_name||'—')+'</b><div style="font-size:12.5px;color:var(--ink-4)" dir="ltr">'+esc(c.email||'')+'</div></td>'+
        '<td style="color:var(--ink-3)">'+esc(c.business||'—')+'</td>'+
        '<td><span class="tag">'+esc(c.tier||'—')+'</span></td>'+
        '<td>'+statusBadge(c.status)+'</td>'+
        '<td style="text-align:end;white-space:nowrap">'+
          '<button class="a-iconbtn" title="'+(blocked?'ביטול חסימה':'חסימה')+'" onclick="ADMIN.toggleBlock(\''+c.id+'\')"><i data-lucide="'+(blocked?'lock-open':'ban')+'"></i></button>'+
          '<button class="a-iconbtn" title="עריכה" onclick="ADMIN.editClient(\''+c.id+'\')"><i data-lucide="pencil"></i></button>'+
          '<button class="a-iconbtn danger" title="מחיקה" onclick="ADMIN.delClient(\''+c.id+'\')"><i data-lucide="trash-2"></i></button>'+
        '</td></tr>';
    }).join('');
    wrap.innerHTML='<table class="a-table"><thead><tr><th>לקוח</th><th>עסק</th><th>חבילה</th><th>סטטוס</th><th></th></tr></thead><tbody>'+tr+'</tbody></table>';
    icons();
  }
  function clientModalHtml(c){
    c=c||{};
    var tierOpts=TIERS_LIST.map(function(t){return '<option'+(t===c.tier?' selected':'')+'>'+t+'</option>';}).join('');
    var stOpts=[['active','פעיל'],['blocked','חסום'],['invited','מוזמן']].map(function(s){return '<option value="'+s[0]+'"'+(s[0]===(c.status||'active')?' selected':'')+'>'+s[1]+'</option>';}).join('');
    var demoNew = window.PLBackend && window.PLBackend.isDemo && !c.id;
    var realNew = window.PLBackend && !window.PLBackend.isDemo && !c.id;
    return '<div style="display:flex;gap:12px"><div class="a-mfld" style="flex:1"><label>שם מלא</label><input id="c_name" value="'+esc(c.full_name||'')+'"></div>'+
      '<div class="a-mfld" style="flex:1"><label>שם העסק</label><input id="c_biz" value="'+esc(c.business||'')+'"></div></div>'+
      '<div style="display:flex;gap:12px"><div class="a-mfld" style="flex:1"><label>אימייל</label><input id="c_email" type="email" dir="ltr" value="'+esc(c.email||'')+'"></div>'+
      '<div class="a-mfld" style="flex:1"><label>טלפון</label><input id="c_phone" dir="ltr" value="'+esc(c.phone||'')+'"></div></div>'+
      '<div style="display:flex;gap:12px"><div class="a-mfld" style="flex:1"><label>ח.פ / ע.מ</label><input id="c_tax" dir="ltr" value="'+esc(c.tax_id||'')+'"></div>'+
      '<div class="a-mfld" style="flex:1"><label>חבילה</label><select id="c_tier">'+tierOpts+'</select></div>'+
      '<div class="a-mfld" style="flex:1"><label>סטטוס</label><select id="c_status">'+stOpts+'</select></div></div>'+
      '<div class="a-mfld"><label>הערות פנימיות</label><textarea id="c_notes" rows="2">'+esc(c.notes||'')+'</textarea></div>'+
      (demoNew ? '<div class="a-mfld"><label>סיסמה זמנית (להדגמה)</label><input id="c_pw" value="changeme"></div>' : '')+
      (realNew ? '<p class="muted" style="font-size:12.5px;margin:2px 0 0">הלקוח יקבל סטטוס "מוזמן" עד שישלים הרשמה באתר עם אותה כתובת אימייל.</p>' : '');
  }
  VIEWS.leads = function(){
    var rows=[['דנה כהן','053-1234567','עניין בחבילת צמיחה','חדש'],['יוסי לוי','054-7654321','בניית אתר לעסק','חדש'],['מירב אזולאי','052-9988776','שאלה על החזר מס','בטיפול'],['רן דוד','050-1122334','ייעוץ פיננסי','חדש']];
    var tr=rows.map(function(r){return '<div class="a-item"><div class="a-ic" style="background:var(--accent-50);color:var(--accent-600)"><i data-lucide="user"></i></div><div class="a-main"><b>'+r[0]+' · <span dir="ltr" style="font-weight:600;color:var(--ink-3)">'+r[1]+'</span></b><small>'+r[2]+'</small></div><span class="pbadge" style="font-size:12px;padding:4px 10px;border-radius:999px;font-weight:700;'+(r[3]==='חדש'?'background:var(--brand-50);color:var(--brand-600)':'background:var(--warning-bg);color:var(--warning)')+'">'+r[3]+'</span><button class="a-iconbtn" style="margin-inline-start:8px"><i data-lucide="mail"></i></button></div>';}).join('');
    return '<div class="a-view"><div class="a-card"><div class="a-card-h"><h3>פניות מהאתר</h3><span class="muted" style="font-size:13px">נתוני דוגמה</span></div><div class="a-card-b">'+tr+'</div></div></div>';
  };

  /* ----- SETTINGS ----- */
  VIEWS.settings = function(){
    var s=D.data.settings;
    return '<div class="a-view"><div class="a-card"><div class="a-card-h"><h3>פרטי העסק ויצירת קשר</h3></div>'+
      '<div class="a-form">'+
        fld('שם העסק','set_brand',s.brandName)+
        fld('סלוגן / תיאור','set_tag',s.tagline)+
        fld('טלפון — שירות ומכירות','set_psales',s.phoneSales)+
        fld('טלפון — תמיכה','set_psup',s.phoneSupport)+
        fld('אימייל','set_email',s.email)+
        fld('שעות פעילות','set_hours',s.hours)+
        '<div class="a-fld full"><label>כתובת</label><input id="set_addr" value="'+esc(s.address)+'"></div>'+
        '<div class="a-fld full"><button class="btn btn-primary" onclick="ADMIN.saveSettings()"><i data-lucide="save"></i>שמירת פרטים</button></div>'+
      '</div></div>'+
      '<p class="muted" style="font-size:13px;text-align:center">הפרטים משתקפים בכותרת התחתונה ובעמוד "צור קשר" בכל האתר.</p></div>';
  };
  function fld(l,id,v){ return '<div class="a-fld"><label>'+l+'</label><input id="'+id+'" value="'+esc(v||'')+'" dir="auto"></div>'; }

  /* ---------------- ACTIONS ---------------- */
  window.ADMIN = {
    go: function(v){ render(v); document.querySelectorAll('.a-link').forEach(function(b){b.classList.toggle('active',b.dataset.v===v);}); },
    addFeat: function(boxId){ document.getElementById(boxId).insertAdjacentHTML('beforeend', featRow('')); icons(); },
    addTierFeat: function(){ document.getElementById('m_tfeats').insertAdjacentHTML('beforeend', tierFeatRow('',true)); icons(); },

    toggleSvc: function(i){ var s=D.data.services[i]; s.visible=s.visible===false; commit(); render('services'); },
    editSvc: function(i){
      var isNew=i<0; var s=isNew?{title:'',icon:'briefcase',short:'',desc:'',features:[''],visible:true}:D.data.services[i];
      openModal(isNew?'שירות חדש':'עריכת שירות', svcModalHtml(s), function(){
        var title=val('m_title'); if(!title){ alert('יש להזין שם שירות'); return false; }
        var feats=[].map.call(document.querySelectorAll('#m_feats .m_feat'),function(e){return e.value.trim();}).filter(Boolean);
        var obj={ id:isNew?D.uid('svc'):s.id, icon:val('m_icon'), title:title, short:val('m_short'), desc:val('m_desc'), features:feats, visible:isNew?true:s.visible };
        if(isNew) D.data.services.push(obj); else D.data.services[i]=obj;
        commit(); render('services');
      });
    },
    delSvc: function(i){ if(confirm('למחוק את "'+D.data.services[i].title+'"?')){ D.data.services.splice(i,1); commit(); render('services'); } },

    editTier: function(i){
      var isNew=i<0; var t=isNew?{name:'',desc:'',priceM:0,priceY:0,popular:false,features:[['',true]],visible:true}:D.data.tiers[i];
      openModal(isNew?'חבילה חדשה':'עריכת חבילה', tierModalHtml(t), function(){
        var name=val('m_name'); if(!name){ alert('יש להזין שם חבילה'); return false; }
        var ts=document.querySelectorAll('#m_tfeats .a-feat-row');
        var feats=[].map.call(ts,function(r){ return [r.querySelector('.tf_t').value.trim(), r.querySelector('.tf_on').checked]; }).filter(function(f){return f[0];});
        var obj={ id:isNew?D.uid('tier'):t.id, name:name, desc:val('m_desc'), priceM:+val('m_pm')||0, priceY:+val('m_py')||0, popular:document.getElementById('m_pop').checked, features:feats, visible:isNew?true:t.visible };
        if(obj.popular) D.data.tiers.forEach(function(x){x.popular=false;});
        if(isNew) D.data.tiers.push(obj); else D.data.tiers[i]=obj;
        commit(); render('pricing');
      });
    },
    delTier: function(i){ if(confirm('למחוק את חבילת "'+D.data.tiers[i].name+'"?')){ D.data.tiers.splice(i,1); commit(); render('pricing'); } },

    editAddon: function(i){
      var isNew=i<0; var a=isNew?{icon:'briefcase',title:'',desc:'',price:''}:D.data.addons[i];
      openModal(isNew?'תוספת חדשה':'עריכת תוספת',
        '<div class="a-mfld"><label>שם</label><input id="m_at" value="'+esc(a.title)+'"></div>'+
        '<div class="a-mfld"><label>אייקון</label><select id="m_ai">'+iconOptions(a.icon)+'</select></div>'+
        '<div class="a-mfld"><label>תיאור</label><input id="m_ad" value="'+esc(a.desc)+'"></div>'+
        '<div class="a-mfld"><label>מחיר (טקסט חופשי)</label><input id="m_ap" value="'+esc(a.price)+'" placeholder="למשל: החל מ‑₪2,500 / חודש"></div>',
        function(){ var t=val('m_at'); if(!t){alert('יש להזין שם');return false;}
          var obj={ id:isNew?D.uid('add'):a.id, icon:val('m_ai'), title:t, desc:val('m_ad'), price:val('m_ap') };
          if(isNew) D.data.addons.push(obj); else D.data.addons[i]=obj; commit(); render('pricing'); });
    },
    delAddon: function(i){ if(confirm('למחוק את "'+D.data.addons[i].title+'"?')){ D.data.addons.splice(i,1); commit(); render('pricing'); } },

    editCat: function(i){
      var isNew=i<0; var c=isNew?{cat:'',icon:'folder',files:[]}:D.data.forms[i];
      openModal(isNew?'קטגוריה חדשה':'עריכת קטגוריה',
        '<div class="a-mfld"><label>שם הקטגוריה</label><input id="m_cn" value="'+esc(c.cat)+'"></div>'+
        '<div class="a-mfld"><label>אייקון</label><select id="m_ci">'+iconOptions(c.icon)+'</select></div>',
        function(){ var n=val('m_cn'); if(!n){alert('יש להזין שם');return false;}
          if(isNew) D.data.forms.push({id:D.uid('fc'),cat:n,icon:val('m_ci'),files:[]}); else {c.cat=n;c.icon=val('m_ci');}
          commit(); render('forms'); });
    },
    delCat: function(i){ if(confirm('למחוק את קטגוריית "'+D.data.forms[i].cat+'" וכל הטפסים בה?')){ D.data.forms.splice(i,1); commit(); render('forms'); } },
    editFile: function(ci,fi){
      var isNew=fi<0; var f=isNew?['','PDF · 0KB','pdf']:D.data.forms[ci].files[fi];
      openModal(isNew?'טופס חדש':'עריכת טופס',
        '<div class="a-mfld"><label>שם הטופס</label><input id="m_fn" value="'+esc(f[0])+'"></div>'+
        '<div class="a-mfld"><label>סוג קובץ</label><select id="m_ft"><option value="pdf"'+(f[2]==='pdf'?' selected':'')+'>PDF</option><option value="xls"'+(f[2]==='xls'?' selected':'')+'>Excel</option><option value="doc"'+(f[2]==='doc'?' selected':'')+'>Word</option></select></div>'+
        '<div class="a-mfld"><label>פרטי קובץ (גודל)</label><input id="m_fs" value="'+esc(f[1])+'" placeholder="PDF · 240KB"></div>',
        function(){ var n=val('m_fn'); if(!n){alert('יש להזין שם');return false;}
          var rec=[n,val('m_fs'),val('m_ft')];
          if(isNew) D.data.forms[ci].files.push(rec); else D.data.forms[ci].files[fi]=rec; commit(); render('forms'); });
    },
    delFile: function(ci,fi){ if(confirm('למחוק טופס זה?')){ D.data.forms[ci].files.splice(fi,1); commit(); render('forms'); } },

    saveSettings: function(){
      var s=D.data.settings;
      s.brandName=val('set_brand'); s.tagline=val('set_tag'); s.phoneSales=val('set_psales');
      s.phoneSupport=val('set_psup'); s.email=val('set_email'); s.hours=val('set_hours'); s.address=val('set_addr');
      commit();
    },

    /* ----- CLIENT ACTIONS (PLBackend) ----- */
    loadClients: function(){
      window.PLBackend.ready.then(function(B){
        return B.clients.list();
      }).then(function(list){
        _clients=list||[]; ADMIN.filterClients();
      }).catch(function(e){
        var w=document.getElementById('clWrap'); if(w) w.innerHTML='<p class="muted" style="padding:18px 0;text-align:center;color:var(--danger)">שגיאה בטעינת לקוחות: '+esc(e.message)+'</p>';
      });
    },
    filterClients: function(){
      var q=(val('clSearch')||'').toLowerCase();
      var list=_clients.filter(function(c){
        if(!q) return true;
        return ((c.full_name||'')+' '+(c.business||'')+' '+(c.email||'')+' '+(c.phone||'')).toLowerCase().indexOf(q)!==-1;
      });
      renderClientRows(list);
    },
    editClient: function(id){
      var c = id ? _clients.filter(function(x){return x.id===id;})[0] : null;
      openModal(id?'עריכת לקוח':'לקוח חדש', clientModalHtml(c), function(){
        var email=val('c_email');
        if(!val('c_name')){ alert('יש להזין שם'); return false; }
        if(!email){ alert('יש להזין אימייל'); return false; }
        var patch={ full_name:val('c_name'), business:val('c_biz'), email:email, phone:val('c_phone'), tax_id:val('c_tax'), tier:val('c_tier'), status:val('c_status'), notes:val('c_notes') };
        var pwEl=document.getElementById('c_pw'); if(pwEl) patch.password=pwEl.value;
        var btn=document.getElementById('modalSave'); btn.disabled=true;
        window.PLBackend.ready.then(function(B){
          return id ? B.clients.update(id, patch) : B.clients.add(patch);
        }).then(function(){ btn.disabled=false; closeModal(); flash(); ADMIN.loadClients(); })
          .catch(function(e){ btn.disabled=false; alert('שגיאה: '+e.message); });
        return false; // we close manually after async
      });
    },
    toggleBlock: function(id){
      var c=_clients.filter(function(x){return x.id===id;})[0]; if(!c) return;
      var next = c.status==='blocked' ? 'active' : 'blocked';
      var verb = next==='blocked' ? 'לחסום' : 'לבטל את החסימה של';
      if(!confirm(verb+' את "'+(c.full_name||c.email)+'"?')) return;
      window.PLBackend.ready.then(function(B){ return B.clients.setStatus(id, next); })
        .then(function(){ flash(); ADMIN.loadClients(); })
        .catch(function(e){ alert('שגיאה: '+e.message); });
    },
    delClient: function(id){
      var c=_clients.filter(function(x){return x.id===id;})[0]; if(!c) return;
      if(!confirm('למחוק לצמיתות את "'+(c.full_name||c.email)+'"? פעולה זו אינה הפיכה.')) return;
      window.PLBackend.ready.then(function(B){ return B.clients.remove(id); })
        .then(function(){ flash(); ADMIN.loadClients(); })
        .catch(function(e){ alert('שגיאה: '+e.message); });
    }
  };

  /* ---------------- ROUTER ---------------- */
  function render(v){ titleEl.textContent=TITLES[v]||''; scroll.innerHTML=VIEWS[v](); scroll.scrollTop=0; icons(); if(v==='clients') ADMIN.loadClients(); }
  document.querySelectorAll('.a-link').forEach(function(b){ b.onclick=function(){ ADMIN.go(b.dataset.v); document.getElementById('aside').classList.remove('open'); }; });
  document.getElementById('aburger').onclick=function(){ document.getElementById('aside').classList.toggle('open'); };
  document.getElementById('resetBtn').onclick=function(){ if(confirm('לשחזר את כל התוכן לברירת המחדל? פעולה זו תמחק את כל השינויים שביצעת.')){ D.reset(); render('services'); ADMIN.go('services'); } };

  render('dashboard');

  /* ---------------- ACCESS GUARD ---------------- */
  // In live Supabase mode, require an admin session. In demo mode the panel is open (prototype).
  window.PLBackend.ready.then(function(B){
    if (B.isDemo) return;
    B.auth.session().then(function(s){
      if (!s || !s.isAdmin) { location.href = 'login.html'; }
    });
  });
  // Wire logout link to actually sign out
  var logoutLink = document.querySelector('.a-foot a[href="login.html"]');
  if (logoutLink) logoutLink.addEventListener('click', function(e){
    e.preventDefault();
    window.PLBackend.ready.then(function(B){ return B.auth.signOut(); }).then(function(){ location.href='login.html'; });
  });
})();
