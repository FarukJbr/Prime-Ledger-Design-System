/* ============================================================
   PRIME LEDGER — Backend configuration (config.js)
   ------------------------------------------------------------
   זהו הקובץ היחיד שצריך לערוך כדי לחבר את האתר ל‑Supabase.
   עד שתמלא את שני הערכים למטה — האתר עובד במצב "הדגמה"
   (Demo): ההרשמות, ההתחברויות והלקוחות נשמרים בדפדפן בלבד.

   כדי לעבור למסד נתונים אמיתי בענן:
   1. פתח פרויקט ב‑https://supabase.com  (ראה setup-supabase.html)
   2. Project Settings → API → העתק את:
        • Project URL      →  הדבק ב‑SUPABASE_URL
        • anon public key  →  הדבק ב‑SUPABASE_ANON_KEY
   3. הוסף את האימייל שלך ל‑ADMIN_EMAILS כדי לקבל הרשאות ניהול.
   ============================================================ */
window.PL_CONFIG = {
  // --- הדבק כאן אחרי פתיחת פרויקט Supabase ---
  SUPABASE_URL: 'https://qdgtpvttzirntpjogjnp.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3RwdnR0emlybnRwam9nam5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjY4NDIsImV4cCI6MjA5NjAwMjg0Mn0.raZvWccQRo9zzT6DfH7OeD3tCTAeX0CzD5bBFpKDcCU',

  // --- מי מקבל גישת מנהל לפאנל (admin.html) ---
  // הזן את כתובות האימייל של המנהלים. גם בטבלת admins במסד.
  ADMIN_EMAILS: ['faruq@primels.co.il'],

  // טקסט שיוצג כשהמערכת במצב הדגמה (ללא Supabase)
  DEMO_NOTE: 'מצב הדגמה — הנתונים נשמרים בדפדפן זה בלבד. חברו Supabase להפעלה אמיתית.'
};
