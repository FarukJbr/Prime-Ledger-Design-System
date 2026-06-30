/* ============================================================
   PRIME LEDGER — Backend configuration (config.js)
   ------------------------------------------------------------
   זהו הקובץ היחיד שצריך לערוך כדי לחבר את האתר ל‑Supabase.

   *** מעודכן: מצביע על אותו פרויקט Supabase של הפורטל הפיננסי ***
   (portal.primels.co.il) — אותו מסד נתונים, אותה הרשמה/כניסה לשני
   המקומות. מי שנרשם כאן באתר מקבל אוטומטית גם חשבון פורטל (מנוי חינמי).
   ============================================================ */
window.PL_CONFIG = {
  SUPABASE_URL: 'https://urpzikwromhwtuffkhyr.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycHppa3dyb21od3R1ZmZraHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5Njk4MDEsImV4cCI6MjA5NTU0NTgwMX0.lnnmGDSkQ8hPR0QGP2WnJAhDO2qIZSfJWaXh15c7Obo',

  // --- מי מקבל גישת מנהל לפאנל (admin.html) ---
  // חייב להתאים לחשבון עם role='admin' בפועל בפורטל הפיננסי — כרגע זה
  // admin@primels.co.il בלבד. גיבוי כפול: כל אימייל כאן הוא מנהל בצד
  // הממשק — *וגם* כל שורה בטבלת admins ב‑Supabase (לבדיקות בצד השרת/RLS).
  ADMIN_EMAILS: ['admin@primels.co.il'],

  // --- קבלת פניות מטופס "צור קשר" במייל (אופציונלי בנוסף להתראת הוואטסאפ) ---
  CONTACT_ACCESS_KEY: '',
  CONTACT_TO_EMAIL: 'info@primels.co.il',

  DEMO_NOTE: 'מצב הדגמה — הנתונים נשמרים בדפדפן זה בלבד. חברו Supabase להפעלה אמיתית.'
};
