/* Prime Ledger Portal — view templates. Each returns an HTML string. */
window.PortalViews = {

  overview: () => `
    <div class="view">
      <div class="view-head"><h1>שלום, דנה 👋</h1><p>הנה תמונת המצב של העסק שלכם להיום, 1 ביוני 2026.</p></div>

      <div class="grid-4" style="margin-bottom:18px">
        <div class="pcard kpi"><div class="kico" style="background:var(--brand-50);color:var(--brand-600)"><i data-lucide="wallet"></i></div><div class="kl">החזר מס צפוי</div><div class="kv" style="color:var(--brand-600)">₪4,200</div><div class="kt up"><i data-lucide="trending-up"></i>מוכן למימוש</div></div>
        <div class="pcard kpi"><div class="kico" style="background:var(--success-bg);color:var(--success)"><i data-lucide="file-check"></i></div><div class="kl">מסמכים החודש</div><div class="kv">23</div><div class="kt up"><i data-lucide="trending-up"></i>+5 מהחודש שעבר</div></div>
        <div class="pcard kpi"><div class="kico" style="background:var(--accent-50);color:var(--accent-600)"><i data-lucide="calendar-clock"></i></div><div class="kl">פגישה הבאה</div><div class="kv" style="font-size:22px;padding-top:6px">12 ביוני</div><div class="kt" style="color:var(--ink-3)">ייעוץ פיננסי · 10:00</div></div>
        <div class="pcard kpi"><div class="kico" style="background:var(--n-100);color:var(--ink-2)"><i data-lucide="badge-check"></i></div><div class="kl">סטטוס מנוי</div><div class="kv" style="font-size:22px;padding-top:6px">צמיחה</div><div class="kt up"><i data-lucide="circle-check"></i>פעיל</div></div>
      </div>

      <div class="grid-2" style="margin-bottom:18px">
        <div class="pcard">
          <div class="pcard-head"><h3>פעילות אחרונה</h3><span class="pbadge pb-info">החודש</span></div>
          <div class="lrow"><div class="lic" style="background:var(--success-bg);color:var(--success)"><i data-lucide="file-check"></i></div><div class="lmain"><b>דוח מע"מ Q1 הוגש</b><small>לפני 2 ימים</small></div><span class="pbadge pb-ok">בוצע</span></div>
          <div class="lrow"><div class="lic"><i data-lucide="upload"></i></div><div class="lmain"><b>העלית 4 קבלות</b><small>לפני 4 ימים</small></div><i data-lucide="chevron-left" class="laction"></i></div>
          <div class="lrow"><div class="lic" style="background:var(--accent-50);color:var(--accent-600)"><i data-lucide="calendar-plus"></i></div><div class="lmain"><b>נקבעה פגישת ייעוץ</b><small>לפני שבוע</small></div><i data-lucide="chevron-left" class="laction"></i></div>
        </div>
        <div class="pcard pcard-pad">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><h3 style="font-family:var(--font-display);font-size:19px;font-weight:700;margin:0">תזרים — 6 חודשים</h3><span class="pbadge pb-ok"><span class="bd" style="background:var(--success)"></span>חיובי</span></div>
          <p style="color:var(--ink-3);font-size:13.5px;margin:0 0 18px">יתרה ממוצעת ₪82,400</p>
          <div style="display:flex;align-items:flex-end;gap:12px;height:150px">
            ${[45,62,53,78,68,92].map((h,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px"><div style="width:100%;height:${h*1.4}px;border-radius:6px 6px 0 0;background:${i===5?'var(--brand-500)':'var(--brand-200)'}"></div><small style="font-size:11px;color:var(--ink-3);font-weight:600">${['ינו','פבר','מרץ','אפר','מאי','יונ'][i]}</small></div>`).join('')}
          </div>
        </div>
      </div>

      <div class="pcard">
        <div class="pcard-head"><h3>משימות שדורשות את תשומת ליבכם</h3></div>
        <div class="lrow"><div class="lic" style="background:var(--warning-bg);color:var(--warning)"><i data-lucide="pen-line"></i></div><div class="lmain"><b>דוח רבעוני Q2 ממתין לחתימה</b><small>נדרשת חתימה דיגיטלית עד 15 ביוני</small></div><button class="btn btn-primary btn-sm">חתימה</button></div>
        <div class="lrow"><div class="lic" style="background:var(--brand-50);color:var(--brand-600)"><i data-lucide="upload-cloud"></i></div><div class="lmain"><b>חסרות קבלות לחודש מאי</b><small>העלו את המסמכים להשלמת הדיווח</small></div><button class="btn btn-secondary btn-sm">העלאה</button></div>
      </div>
    </div>`,

  subscription: () => `
    <div class="view">
      <div class="view-head"><h1>המנוי שלי</h1><p>ניהול החבילה, החיוב וההטבות שלכם.</p></div>
      <div class="plan-banner" style="margin-bottom:20px">
        <div class="pb-l"><div class="ptier">החבילה הנוכחית</div><h2>צמיחה</h2><div class="ppr">₪690 / חודש · חיוב הבא ב‑1 ביולי 2026</div></div>
        <div class="pb-r"><span class="pbadge pb-ok" style="background:rgba(255,255,255,.2);color:#fff;margin-bottom:10px"><span class="bd" style="background:#fff"></span>פעיל</span><br><button class="btn" style="background:#fff;color:var(--brand-600)">שדרוג חבילה</button></div>
      </div>
      <div class="grid-2" style="margin-bottom:20px">
        <div class="pcard pcard-pad">
          <h3 style="font-family:var(--font-display);font-size:18px;margin:0 0 16px">מה כלול בחבילה</h3>
          ${['הנהלת חשבונות כפולה','כל הדיווחים לרשויות','חשבות שכר עד 5 עובדים','ייעוץ פיננסי רבעוני','דוחות ניהוליים חודשיים','תמיכה מועדפת'].map(f=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;font-size:14.5px"><i data-lucide="check-circle-2" style="width:18px;height:18px;color:var(--success)"></i>${f}</div>`).join('')}
        </div>
        <div class="pcard pcard-pad">
          <h3 style="font-family:var(--font-display);font-size:18px;margin:0 0 6px">ניצול החודש</h3>
          <p style="color:var(--ink-3);font-size:13.5px;margin:0 0 20px">מתאפס ב‑1 בכל חודש</p>
          <div style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;font-size:14px;font-weight:600;margin-bottom:8px"><span>תלושי שכר</span><span dir="ltr">4 / 5</span></div><div class="prog"><span style="width:80%"></span></div></div>
          <div style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;font-size:14px;font-weight:600;margin-bottom:8px"><span>שעות ייעוץ</span><span dir="ltr">2.5 / 4</span></div><div class="prog"><span style="width:62%;background:var(--accent-500)"></span></div></div>
          <div><div style="display:flex;justify-content:space-between;font-size:14px;font-weight:600;margin-bottom:8px"><span>אחסון מסמכים</span><span dir="ltr">1.2GB / 10GB</span></div><div class="prog"><span style="width:12%;background:var(--success)"></span></div></div>
        </div>
      </div>
      <div class="pcard">
        <div class="pcard-head"><h3>חבילות אחרות</h3><a href="pricing.html" style="color:var(--brand-600);font-weight:700;font-size:14px">השוואה מלאה ←</a></div>
        <div class="lrow"><div class="lmain"><b>בסיס</b><small>₪390 / חודש · לעסק קטן</small></div><button class="btn btn-secondary btn-sm">מעבר לחבילה</button></div>
        <div class="lrow"><div class="lmain"><b>מלא</b><small>₪1,290 / חודש · חשבות שכר ללא הגבלה + מנהל ייעודי</small></div><button class="btn btn-primary btn-sm">שדרוג</button></div>
      </div>
    </div>`,

  appointments: () => `
    <div class="view">
      <div class="view-head"><h1>פגישות וזמינות</h1><p>קבעו פגישה עם הצוות או צפו בפגישות הקרובות.</p></div>
      <div class="grid-2" style="align-items:start">
        <div class="pcard pcard-pad">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><h3 style="font-family:var(--font-display);font-size:18px;margin:0">יוני 2026</h3><div style="display:flex;gap:6px"><button class="p-icon-btn"><i data-lucide="chevron-right"></i></button><button class="p-icon-btn"><i data-lucide="chevron-left"></i></button></div></div>
          <div class="cal" id="cal"></div>
          <div style="margin-top:20px"><div style="font-size:13.5px;font-weight:700;margin-bottom:10px">שעות פנויות · 12 ביוני</div>
            <div class="slots" id="slots">
              <button class="slot" onclick="pickSlot(this)">09:00</button>
              <button class="slot on" onclick="pickSlot(this)">10:00</button>
              <button class="slot taken" disabled>11:00</button>
              <button class="slot" onclick="pickSlot(this)">13:00</button>
              <button class="slot" onclick="pickSlot(this)">14:30</button>
              <button class="slot taken" disabled>16:00</button>
            </div>
          </div>
          <button class="btn btn-primary btn-block" style="margin-top:18px" onclick="alert('הפגישה נקבעה! נשלח אישור למייל.')">אישור פגישה · 12 ביוני, 10:00</button>
        </div>
        <div>
          <div class="pcard" style="margin-bottom:18px">
            <div class="pcard-head"><h3>הפגישות הקרובות</h3></div>
            <div class="lrow"><div class="lic" style="background:var(--brand-50);color:var(--brand-600);flex-direction:column;font-family:var(--font-display);font-weight:900"><span style="font-size:16px;line-height:1">12</span><span style="font-size:9px">יונ</span></div><div class="lmain"><b>ייעוץ פיננסי רבעוני</b><small>10:00–11:00 · זום · עם רו"ח אבי</small></div><span class="pbadge pb-ok">מאושר</span></div>
            <div class="lrow"><div class="lic" style="background:var(--accent-50);color:var(--accent-600);flex-direction:column;font-family:var(--font-display);font-weight:900"><span style="font-size:16px;line-height:1">28</span><span style="font-size:9px">יונ</span></div><div class="lmain"><b>סקירת דוחות חצי שנתית</b><small>14:00–15:00 · במשרד</small></div><span class="pbadge pb-pend">ממתין</span></div>
          </div>
          <div class="pcard pcard-pad">
            <h3 style="font-family:var(--font-display);font-size:18px;margin:0 0 14px">סוג הפגישה</h3>
            ${[['ייעוץ פיננסי','30–60 דק׳','video'],['פגישת מס','45 דק׳','receipt'],['סקירת דוחות','60 דק׳','bar-chart-3']].map((m,i)=>`<div class="pay-method ${i===0?'active':''}" style="margin-bottom:10px;cursor:pointer"><div class="lic" style="background:var(--n-100);color:var(--ink-2)"><i data-lucide="${m[2]}"></i></div><div class="lmain"><b>${m[0]}</b><small>${m[1]}</small></div>${i===0?'<i data-lucide="check-circle-2" style="color:var(--brand-500)"></i>':''}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  documents: () => `
    <div class="view">
      <div class="view-head" style="display:flex;justify-content:space-between;align-items:flex-end"><div><h1>מסמכים</h1><p>כל הדוחות, התלושים והקבלות שלכם.</p></div><button class="btn btn-primary"><i data-lucide="upload"></i>העלאת מסמך</button></div>
      <div class="grid-3" style="margin-bottom:18px">
        <div class="pcard kpi" style="padding:18px"><div class="kl">סה"כ מסמכים</div><div class="kv" style="font-size:26px">142</div></div>
        <div class="pcard kpi" style="padding:18px"><div class="kl">ממתינים לחתימה</div><div class="kv" style="font-size:26px;color:var(--warning)">3</div></div>
        <div class="pcard kpi" style="padding:18px"><div class="kl">אחסון בשימוש</div><div class="kv" style="font-size:26px">1.2<span style="font-size:15px">GB</span></div></div>
      </div>
      <div class="pcard pcard-pad">
        <table class="dtable">
          <thead><tr><th>מסמך</th><th>קטגוריה</th><th>תאריך</th><th>סטטוס</th><th></th></tr></thead>
          <tbody>
            ${[['דוח רבעוני Q2 2026','דוחות','08.06.26','חתימה','pend'],['תלוש שכר — מאי','שכר','01.06.26','מוכן','ok'],['דוח מע"מ Q1','מיסים','15.04.26','הוגש','ok'],['קבלות מאי (אצווה)','הוצאות','30.05.26','מעובד','info'],['מאזן בוחן','דוחות','20.05.26','מוכן','ok']].map(d=>`
            <tr><td><div class="dfile"><div class="dfi"><i data-lucide="file-text"></i></div><b>${d[0]}</b></div></td><td style="color:var(--ink-3)">${d[1]}</td><td style="color:var(--ink-3)" dir="ltr">${d[2]}</td><td><span class="pbadge ${d[4]==='ok'?'pb-ok':d[4]==='pend'?'pb-pend':'pb-info'}">${d[3]}</span></td><td style="text-align:end"><button class="p-icon-btn"><i data-lucide="download"></i></button></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`,

  payments: () => `
    <div class="view">
      <div class="view-head"><h1>תשלומים</h1><p>אמצעי תשלום, היסטוריית חיובים וחשבוניות.</p></div>
      <div class="grid-2" style="align-items:start;margin-bottom:18px">
        <div class="pcard pcard-pad">
          <h3 style="font-family:var(--font-display);font-size:18px;margin:0 0 16px">אמצעי תשלום</h3>
          <div class="pay-method active" style="margin-bottom:12px"><div class="cc-logo">VISA</div><div class="lmain"><b dir="ltr">•••• 4821</b><small>בתוקף עד 09/27</small></div><span class="pbadge pb-info">ראשי</span></div>
          <div class="pay-method" style="margin-bottom:16px"><div class="cc-logo" style="background:var(--n-700)">MC</div><div class="lmain"><b dir="ltr">•••• 7290</b><small>בתוקף עד 03/26</small></div></div>
          <button class="btn btn-secondary btn-block"><i data-lucide="plus"></i>הוספת כרטיס אשראי</button>
          <div style="display:flex;align-items:center;gap:8px;margin-top:16px;font-size:12.5px;color:var(--ink-3);justify-content:center"><i data-lucide="lock" style="width:14px;height:14px"></i>תשלומים מאובטחים בתקן PCI-DSS</div>
        </div>
        <div class="pcard pcard-pad">
          <h3 style="font-family:var(--font-display);font-size:18px;margin:0 0 16px">החיוב הבא</h3>
          <div style="background:var(--n-50);border:1px solid var(--border);border-radius:var(--r-md);padding:20px;text-align:center;margin-bottom:14px">
            <div style="font-family:var(--font-display);font-weight:900;font-size:40px;color:var(--brand-600)">₪807</div>
            <div style="color:var(--ink-3);font-size:13.5px">כולל מע"מ · 1 ביולי 2026</div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:7px 0"><span class="muted">חבילת צמיחה</span><span dir="ltr">₪690</span></div>
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:7px 0"><span class="muted">מע"מ 17%</span><span dir="ltr">₪117</span></div>
        </div>
      </div>
      <div class="pcard">
        <div class="pcard-head"><h3>היסטוריית חיובים</h3></div>
        ${[['1 ביוני 2026','חבילת צמיחה','₪807','שולם'],['1 במאי 2026','חבילת צמיחה','₪807','שולם'],['1 באפריל 2026','חבילת צמיחה + ייעוץ','₪1,257','שולם']].map(p=>`<div class="lrow"><div class="lic" style="background:var(--success-bg);color:var(--success)"><i data-lucide="check"></i></div><div class="lmain"><b>${p[1]}</b><small>${p[0]}</small></div><b style="font-family:var(--font-display);font-size:17px" dir="ltr">${p[2]}</b><button class="p-icon-btn"><i data-lucide="download"></i></button></div>`).join('')}
      </div>
    </div>`,

  settings: () => `
    <div class="view">
      <div class="view-head"><h1>הגדרות</h1><p>ניהול הפרופיל, ההתראות והאבטחה.</p></div>
      <div class="set-tabs">
        <button class="set-tab on">פרופיל</button>
        <button class="set-tab">התראות</button>
        <button class="set-tab">אבטחה</button>
      </div>
      <div class="grid-2" style="align-items:start">
        <div class="pcard pcard-pad">
          <h3 style="font-family:var(--font-display);font-size:18px;margin:0 0 18px">פרטי הפרופיל</h3>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:22px"><div class="p-av" style="width:64px;height:64px;font-size:26px">ד</div><div><button class="btn btn-secondary btn-sm">החלפת תמונה</button></div></div>
          <div class="field-row"><label>שם מלא</label><input value="דנה כהן"></div>
          <div class="field-row"><label>אימייל</label><input value="dana@urban-studio.co.il" dir="ltr"></div>
          <div class="field-row"><label>טלפון</label><input value="054-000-0000" dir="ltr"></div>
          <div class="field-row"><label>שם העסק</label><input value="אורban סטודיו בע\u05f4מ"></div>
          <button class="btn btn-primary" style="margin-top:6px">שמירת שינויים</button>
        </div>
        <div class="pcard pcard-pad">
          <h3 style="font-family:var(--font-display);font-size:18px;margin:0 0 6px">העדפות התראה</h3>
          <p style="color:var(--ink-3);font-size:13.5px;margin:0 0 8px">בחרו אילו עדכונים תרצו לקבל</p>
          <div class="set-row"><div class="sl"><b>מועדי דיווח</b><small>תזכורות לפני מועדי הגשה לרשויות</small></div><button class="switch on" onclick="this.classList.toggle('on')"></button></div>
          <div class="set-row"><div class="sl"><b>מסמכים חדשים</b><small>כשמסמך מוכן או דורש חתימה</small></div><button class="switch on" onclick="this.classList.toggle('on')"></button></div>
          <div class="set-row"><div class="sl"><b>פגישות</b><small>תזכורת 24 שעות לפני</small></div><button class="switch on" onclick="this.classList.toggle('on')"></button></div>
          <div class="set-row"><div class="sl"><b>ניוזלטר חודשי</b><small>טיפים ועדכוני רגולציה</small></div><button class="switch" onclick="this.classList.toggle('on')"></button></div>
          <div class="set-row"><div class="sl"><b>הצעות שיווקיות</b><small>מבצעים ושירותים חדשים</small></div><button class="switch" onclick="this.classList.toggle('on')"></button></div>
        </div>
      </div>
    </div>`,
};
