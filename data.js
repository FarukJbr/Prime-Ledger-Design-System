/* ============================================================
   PRIME LEDGER — Shared data store (data.js)
   Single source of truth for services, pricing, add-ons, forms
   and site settings. The public site renders FROM this; the
   admin panel EDITS this. Persisted to localStorage so the
   owner's changes show up across the site (prototype-level CMS).
   Load this BEFORE chrome.js / page scripts.
   ============================================================ */
(function () {
  var KEY = 'pl_data_v2';

  var DEFAULTS = {
    settings: {
      brandName: 'פתרונות פריים לדג׳ר',
      tagline: 'הנהלת חשבונות, חשבות שכר ופתרונות פיננסיים',
      phoneSales: '053-926-5062',
      phoneSupport: '055-502-7988',
      email: 'info@primels.co.il',
      address: 'רח׳ העסקים 10, תל אביב',
      hours: 'א׳–ה׳ 09:00–18:00'
    },

    services: [
      { id: 'svc-0', icon: 'calculator', title: 'הנהלת חשבונות', short: 'ניהול ספרים מסודר, דיווחים שוטפים ושקט נפשי מול הרשויות.', desc: 'ניהול ספרים מסודר, דיווחים שוטפים לרשויות ותמונה ברורה של הכסף — בלי כאב ראש ובלי הפתעות.', features: ['רישום הכנסות והוצאות שוטף', 'דיווחי מע״מ, מקדמות וניכויים', 'הכנת דוחות שנתיים והתאמות בנק', 'ליווי שוטף מול רואה החשבון'], visible: true },
      { id: 'svc-1', icon: 'wallet', title: 'חשבות שכר', short: 'שכר מדויק בזמן, תלושים, טפסים וניהול זכויות העובדים.', desc: 'שכר מדויק שמשולם בזמן, תלושים ברורים וניהול מלא של זכויות העובדים — אתם רגועים, הצוות מרוצה.', features: ['הפקת תלושי שכר חודשיים', 'דיווחי 102, 126 וטופס 161', 'ניהול פנסיה, קרנות וביטוחים', 'ייעוץ בעלויות מעביד'], visible: true },
      { id: 'svc-2', icon: 'briefcase', title: 'ייעוץ עסקי', short: 'אסטרטגיה, תמחור ותוכניות עבודה שמזיזות את העסק קדימה.', desc: 'אסטרטגיה, תמחור ותוכניות עבודה מבוססות נתונים — כדי שהעסק יזוז קדימה בכיוון הנכון.', features: ['בניית תוכנית עסקית ומפת דרכים', 'אסטרטגיית תמחור ורווחיות', 'ניתוח מתחרים ושוק', 'ליווי שוטף של בעלי העסק'], visible: true },
      { id: 'svc-3', icon: 'line-chart', title: 'ייעוץ פיננסי', short: 'תזרים, גיוס מימון וליווי פיננסי שמבוסס על נתונים אמיתיים.', desc: 'תזרים בריא, גיוס מימון נכון וליווי פיננסי שמבוסס על הנתונים שלכם — לא על תחושות בטן.', features: ['תכנון וניהול תזרים מזומנים', 'ליווי גיוס אשראי ומימון', 'בניית תקציב ובקרת ביצוע', 'דוחות ניהוליים חודשיים'], visible: true },
      { id: 'svc-4', icon: 'megaphone', title: 'שיווק ופרסום', short: 'קמפיינים, מיתוג ונוכחות דיגיטלית שמביאה לקוחות.', desc: 'מיתוג, קמפיינים ונוכחות דיגיטלית שמביאים לקוחות אמיתיים — עם מדידה של כל שקל.', features: ['אסטרטגיית מיתוג ומסרים', 'קמפיינים בגוגל ובסושיאל', 'ניהול תוכן ורשתות חברתיות', 'דוחות ביצועים שקופים'], visible: true },
      { id: 'svc-5', icon: 'handshake', title: 'מכירות', short: 'בניית תהליכי מכירה, CRM ומשפך שממיר עניין להכנסה.', desc: 'בניית תהליך מכירה מסודר, הטמעת CRM ומשפך שממיר עניין להכנסה — בלי לאבד אף ליד בדרך.', features: ['מיפוי ובניית משפך מכירות', 'הטמעת מערכת CRM', 'תסריטי שיחה והדרכת צוות', 'מעקב המרות ושיפור מתמיד'], visible: true },
      { id: 'svc-6', icon: 'scale', title: 'פתרונות ציות', short: 'עמידה ברגולציה, אבטחת מידע ומניעת סיכונים — בראש שקט.', desc: 'עמידה ברגולציה, אבטחת מידע וניהול סיכונים — כדי שתישנו בשקט ותתמקדו בעסק.', features: ['בדיקת עמידה ברגולציה', 'מדיניות פרטיות והגנת מידע', 'נהלי ציות וניהול סיכונים', 'ביקורת תקופתית ועדכונים'], visible: true }
    ],

    tiers: [
      { id: 'tier-basic', name: 'בסיס', desc: 'לעוסק פטור ולעסק קטן בתחילת הדרך.', priceM: 390, priceY: 3900, popular: false, visible: true,
        features: [ ['הנהלת חשבונות חד־צדדית', true], ['דיווחי מע״מ ומקדמות', true], ['דוח שנתי', true], ['פורטל לקוח אישי', true], ['חשבות שכר', false], ['ייעוץ פיננסי שוטף', false] ] },
      { id: 'tier-growth', name: 'צמיחה', desc: 'לעוסק מורשה ולעסק שגדל ומעסיק.', priceM: 690, priceY: 6900, popular: true, visible: true,
        features: [ ['הנהלת חשבונות כפולה', true], ['כל הדיווחים לרשויות', true], ['חשבות שכר עד 5 עובדים', true], ['ייעוץ פיננסי רבעוני', true], ['דוחות ניהוליים חודשיים', true], ['פורטל + תמיכה מועדפת', true] ] },
      { id: 'tier-full', name: 'מלא', desc: 'לחברה בע״מ ולעסק עם פעילות ענפה.', priceM: 1290, priceY: 12900, popular: false, visible: true,
        features: [ ['כל מה שבחבילת צמיחה', true], ['חשבות שכר ללא הגבלה', true], ['ייעוץ עסקי ופיננסי שוטף', true], ['פתרונות ציות ורגולציה', true], ['מנהל לקוח ייעודי', true], ['פגישות חודשיות קבועות', true] ] }
    ],

    addons: [
      { id: 'add-mkt', icon: 'megaphone', title: 'חבילת שיווק ופרסום', desc: 'אסטרטגיה, קמפיינים וניהול תוכן', price: 'החל מ‑₪2,500 / חודש' },
      { id: 'add-biz', icon: 'briefcase', title: 'ייעוץ עסקי ממוקד', desc: 'תוכנית עסקית או ליווי נקודתי', price: '₪450 / שעה' },
      { id: 'add-sales', icon: 'handshake', title: 'הקמת מערך מכירות', desc: 'משפך, CRM והדרכת צוות', price: 'החל מ‑₪6,900' },
      { id: 'add-web', icon: 'code-xml', title: 'בניית אתר / מערכת', desc: 'אפיון, עיצוב ופיתוח — הצעת מחיר אישית', price: 'לפי פרויקט' }
    ],

    forms: [
      { id: 'fc-acc', cat: 'הנהלת חשבונות', icon: 'calculator', files: [ ['טופס פתיחת תיק עוסק', 'PDF · 240KB', 'pdf'], ['ריכוז הוצאות חודשי', 'XLSX · 38KB', 'xls'], ['בקשה לאישור ניהול ספרים', 'PDF · 180KB', 'pdf'], ['טופס דיווח תקופתי', 'PDF · 210KB', 'pdf'] ] },
      { id: 'fc-pay', cat: 'חשבות שכר', icon: 'wallet', files: [ ['טופס 101 לעובד', 'PDF · 320KB', 'pdf'], ['דיווח שעות חודשי', 'XLSX · 42KB', 'xls'], ['טופס תיאום מס', 'PDF · 195KB', 'pdf'], ['הצהרת עובד חדש', 'DOCX · 56KB', 'doc'] ] },
      { id: 'fc-tax', cat: 'מיסים והחזרים', icon: 'receipt', files: [ ['בקשה להחזר מס', 'PDF · 280KB', 'pdf'], ['טופס 106 — ריכוז שנתי', 'PDF · 165KB', 'pdf'], ['הצהרת הון', 'XLSX · 88KB', 'xls'] ] },
      { id: 'fc-biz', cat: 'עסקי וכללי', icon: 'briefcase', files: [ ['תבנית הצעת מחיר', 'DOCX · 64KB', 'doc'], ['חוזה התקשרות לדוגמה', 'PDF · 310KB', 'pdf'], ['תבנית תוכנית עסקית', 'DOCX · 120KB', 'doc'], ['טופס פתיחת חשבון לקוח', 'PDF · 150KB', 'pdf'] ] }
    ]
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var data;
  try { data = JSON.parse(localStorage.getItem(KEY)); } catch (e) { data = null; }
  if (!data || !data.services || !data.tiers) { data = clone(DEFAULTS); }

  window.PLData = {
    data: data,
    DEFAULTS: DEFAULTS,
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) {} },
    reset: function () { this.data = clone(DEFAULTS); this.save(); },
    uid: function (p) { return (p || 'id') + '-' + Math.random().toString(36).slice(2, 7); }
  };
})();
