/* ============================================================
   PRIME LEDGER — data.js  (Supabase-backed CMS, v3)
   ------------------------------------------------------------
   Replaces the old localStorage-only prototype.
   • Exposes window.PLData.data synchronously (with DEFAULTS so
     pricing-render.js / services-render.js / index.html never
     break even before the async fetch completes).
   • Fires a custom "pl:data-ready" DOM event after the live
     data arrives from Supabase, so pages can re-render.
   Load this BEFORE chrome.js / page scripts.
   ============================================================ */
(function () {
  var SB_URL = 'https://urpzikwromhwtuffkhyr.supabase.co';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycHppa3dyb21od3R1ZmZraHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5Njk4MDEsImV4cCI6MjA5NTU0NTgwMX0.lnnmGDSkQ8hPR0QGP2WnJAhDO2qIZSfJWaXh15c7Obo';

  /* ---- shape helpers: map DB rows → old PLData shape ---- */
  function mapService(r) {
    return { id:r.id, icon:r.icon||'', title:r.title||'', short:r.short||'',
      desc:r.description||'', features:r.features||[], visible:r.visible!==false };
  }
  function mapTier(r) {
    return { id:r.id, name:r.name||'', desc:r.description||'',
      priceM:Number(r.price_month)||0, priceY:Number(r.price_year)||0,
      popular:!!r.popular, visible:r.visible!==false, features:r.features||[] };
  }
  function mapAddon(r) {
    return { id:r.id, icon:r.icon||'', title:r.title||'', desc:r.description||'',
      price:r.price_label||'' };
  }
  function mapForm(r) {
    return { id:r.id, cat:r.category||'', icon:r.icon||'', files:r.files||[] };
  }
  function mapSettings(r) {
    return { brandName:r.brand_name||'', tagline:r.tagline||'',
      phoneSales:r.phone_sales||'', phoneSupport:r.phone_support||'',
      email:r.email||'', address:r.address||'', hours:r.hours||'',
      social_whatsapp:r.social_whatsapp||'', social_facebook:r.social_facebook||'',
      social_instagram:r.social_instagram||'', social_linkedin:r.social_linkedin||'',
      social_tiktok:r.social_tiktok||'', social_youtube:r.social_youtube||'',
      social_lishka:r.social_lishka||'' };
  }

  /* ---- hard-coded fallback (same content as before, used until fetch) ---- */
  var DEFAULTS = {
    settings:{ brandName:'פתרונות פריים לדג׳ר', tagline:'הנהלת חשבונות, חשבות שכר ופתרונות פיננסיים',
      phoneSales:'053-926-5062', phoneSupport:'055-502-7988',
      email:'info@primels.co.il', address:'רח׳ העסקים 10, תל אביב', hours:'א׳–ה׳ 09:00–18:00' },
    services:[
      {id:'svc-0',icon:'calculator',title:'הנהלת חשבונות',short:'ניהול ספרים מסודר, דיווחים שוטפים ושקט נפשי מול הרשויות.',desc:'ניהול ספרים מסודר, דיווחים שוטפים לרשויות ותמונה ברורה של הכסף.',features:['רישום הכנסות והוצאות שוטף','דיווחי מע״מ, מקדמות וניכויים','הכנת דוחות שנתיים והתאמות בנק','ליווי שוטף מול רואה החשבון'],visible:true},
      {id:'svc-1',icon:'wallet',title:'חשבות שכר',short:'שכר מדויק בזמן, תלושים, טפסים וניהול זכויות העובדים.',desc:'שכר מדויק שמשולם בזמן, תלושים ברורים וניהול מלא של זכויות העובדים.',features:['הפקת תלושי שכר חודשיים','דיווחי 102, 126 וטופס 161','ניהול פנסיה, קרנות וביטוחים','ייעוץ בעלויות מעביד'],visible:true},
      {id:'svc-2',icon:'briefcase',title:'ייעוץ עסקי',short:'אסטרטגיה, תמחור ותוכניות עבודה שמזיזות את העסק קדימה.',desc:'אסטרטגיה, תמחור ותוכניות עבודה מבוססות נתונים.',features:['בניית תוכנית עסקית ומפת דרכים','אסטרטגיית תמחור ורווחיות','ניתוח מתחרים ושוק','ליווי שוטף של בעלי העסק'],visible:true},
      {id:'svc-3',icon:'line-chart',title:'ייעוץ פיננסי',short:'תזרים, גיוס מימון וליווי פיננסי שמבוסס על נתונים אמיתיים.',desc:'תזרים בריא, גיוס מימון נכון וליווי פיננסי שמבוסס על הנתונים שלכם.',features:['תכנון וניהול תזרים מזומנים','ליווי גיוס אשראי ומימון','בניית תקציב ובקרת ביצוע','דוחות ניהוליים חודשיים'],visible:true},
      {id:'svc-4',icon:'megaphone',title:'שיווק ופרסום',short:'קמפיינים, מיתוג ונוכחות דיגיטלית שמביאה לקוחות.',desc:'מיתוג, קמפיינים ונוכחות דיגיטלית שמביאים לקוחות אמיתיים.',features:['אסטרטגיית מיתוג ומסרים','קמפיינים בגוגל ובסושיאל','ניהול תוכן ורשתות חברתיות','דוחות ביצועים שקופים'],visible:true},
      {id:'svc-5',icon:'handshake',title:'מכירות',short:'בניית תהליכי מכירה, CRM ומשפך שממיר עניין להכנסה.',desc:'בניית תהליך מכירה מסודר, הטמעת CRM ומשפך שממיר עניין להכנסה.',features:['מיפוי ובניית משפך מכירות','הטמעת מערכת CRM','תסריטי שיחה והדרכת צוות','מעקב המרות ושיפור מתמיד'],visible:true},
      {id:'svc-6',icon:'scale',title:'פתרונות ציות',short:'עמידה ברגולציה, אבטחת מידע ומניעת סיכונים — בראש שקט.',desc:'עמידה ברגולציה, אבטחת מידע וניהול סיכונים.',features:['בדיקת עמידה ברגולציה','מדיניות פרטיות והגנת מידע','נהלי ציות וניהול סיכונים','ביקורת תקופתית ועדכונים'],visible:true}
    ],
    tiers:[
      {id:'tier-basic',name:'בסיס',desc:'לעוסק פטור ולעסק קטן בתחילת הדרך.',priceM:390,priceY:3900,popular:false,visible:true,features:[['הנהלת חשבונות חד־צדדית',true],['דיווחי מע״מ ומקדמות',true],['דוח שנתי',true],['פורטל לקוח אישי',true],['חשבות שכר',false],['ייעוץ פיננסי שוטף',false]]},
      {id:'tier-growth',name:'צמיחה',desc:'לעוסק מורשה ולעסק שגדל ומעסיק.',priceM:690,priceY:6900,popular:true,visible:true,features:[['הנהלת חשבונות כפולה',true],['כל הדיווחים לרשויות',true],['חשבות שכר עד 5 עובדים',true],['ייעוץ פיננסי רבעוני',true],['דוחות ניהוליים חודשיים',true],['פורטל + תמיכה מועדפת',true]]},
      {id:'tier-full',name:'מלא',desc:'לחברה בע״מ ולעסק עם פעילות ענפה.',priceM:1290,priceY:12900,popular:false,visible:true,features:[['כל מה שבחבילת צמיחה',true],['חשבות שכר ללא הגבלה',true],['ייעוץ עסקי ופיננסי שוטף',true],['פתרונות ציות ורגולציה',true],['מנהל לקוח ייעודי',true],['פגישות חודשיות קבועות',true]]}
    ],
    addons:[
      {id:'add-mkt',icon:'megaphone',title:'חבילת שיווק ופרסום',desc:'אסטרטגיה, קמפיינים וניהול תוכן',price:'החל מ‑₪2,500 / חודש'},
      {id:'add-biz',icon:'briefcase',title:'ייעוץ עסקי ממוקד',desc:'תוכנית עסקית או ליווי נקודתי',price:'₪450 / שעה'},
      {id:'add-sales',icon:'handshake',title:'הקמת מערך מכירות',desc:'משפך, CRM והדרכת צוות',price:'החל מ‑₪6,900'},
      {id:'add-web',icon:'code-xml',title:'בניית אתר / מערכת',desc:'אפיון, עיצוב ופיתוח — הצעת מחיר אישית',price:'לפי פרויקט'}
    ],
    forms:[
      {id:'fc-acc',cat:'הנהלת חשבונות',icon:'calculator',files:[['טופס פתיחת תיק עוסק','PDF · 240KB','pdf'],['ריכוז הוצאות חודשי','XLSX · 38KB','xls'],['בקשה לאישור ניהול ספרים','PDF · 180KB','pdf'],['טופס דיווח תקופתי','PDF · 210KB','pdf']]},
      {id:'fc-pay',cat:'חשבות שכר',icon:'wallet',files:[['טופס 101 לעובד','PDF · 320KB','pdf'],['דיווח שעות חודשי','XLSX · 42KB','xls'],['טופס תיאום מס','PDF · 195KB','pdf'],['הצהרת עובד חדש','DOCX · 56KB','doc']]},
      {id:'fc-tax',cat:'מיסים והחזרים',icon:'receipt',files:[['בקשה להחזר מס','PDF · 280KB','pdf'],['טופס 106 — ריכוז שנתי','PDF · 165KB','pdf'],['הצהרת הון','XLSX · 88KB','xls']]},
      {id:'fc-biz',cat:'עסקי וכללי',icon:'briefcase',files:[['תבנית הצעת מחיר','DOCX · 64KB','doc'],['חוזה התקשרות לדוגמה','PDF · 310KB','pdf'],['תבנית תוכנית עסקית','DOCX · 120KB','doc'],['טופס פתיחת חשבון לקוח','PDF · 150KB','pdf']]}
    ]
  };

  /* ---- expose synchronously with defaults so pages render immediately ---- */
  window.PLData = {
    data: JSON.parse(JSON.stringify(DEFAULTS)),
    DEFAULTS: DEFAULTS,
    save: function () { /* no-op: writes go through the admin panel → Supabase */ },
    reset: function () { this.data = JSON.parse(JSON.stringify(DEFAULTS)); },
    uid: function (p) { return (p||'id')+'-'+Math.random().toString(36).slice(2,7); }
  };

  /* ---- async fetch from Supabase (public read, anon key is safe here) ---- */
  function sbGet(table, order) {
    var url = SB_URL+'/rest/v1/'+table+'?select=*&order='+order+'&visible=eq.true';
    return fetch(url, { headers:{
      'apikey': SB_ANON, 'Authorization': 'Bearer '+SB_ANON
    }}).then(function(r){ return r.json(); });
  }
  function sbGetOne(table) {
    return fetch(SB_URL+'/rest/v1/'+table+'?select=*&id=eq.1', { headers:{
      'apikey': SB_ANON, 'Authorization': 'Bearer '+SB_ANON
    }}).then(function(r){ return r.json(); });
  }

  Promise.all([
    sbGetOne('site_settings'),
    sbGet('site_services','sort_order'),
    sbGet('site_tiers','sort_order'),
    sbGet('site_addons','sort_order'),
    sbGet('site_forms','sort_order')
  ]).then(function(results) {
    var settings = results[0];
    var services = results[1];
    var tiers    = results[2];
    var addons   = results[3];
    var forms    = results[4];

    if (settings && settings[0]) window.PLData.data.settings = mapSettings(settings[0]);
    if (services && services.length) window.PLData.data.services = services.map(mapService);
    if (tiers    && tiers.length)    window.PLData.data.tiers    = tiers.map(mapTier);
    if (addons   && addons.length)   window.PLData.data.addons   = addons.map(mapAddon);
    if (forms    && forms.length)    window.PLData.data.forms     = forms.map(mapForm);

    /* notify pages that live data is ready — they re-render if they listen */
    document.dispatchEvent(new CustomEvent('pl:data-ready', { detail: window.PLData.data }));
  }).catch(function(e) {
    console.warn('[PLData] Supabase fetch failed, using defaults.', e);
    document.dispatchEvent(new CustomEvent('pl:data-ready', { detail: window.PLData.data }));
  });

})();
