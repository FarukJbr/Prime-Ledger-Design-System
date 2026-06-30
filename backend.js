/* ============================================================
   PRIME LEDGER — Unified backend layer (backend.js)
   ------------------------------------------------------------
   API אחיד לאימות (auth) ולניהול לקוחות (clients).
   • אם config.js מכיל מפתחות Supabase → עובד מול הענן האמיתי.
   • אחרת → מצב הדגמה מקומי (localStorage) כדי שהכל יעבוד מיד.

   טען אחרי config.js. השאר הקוד באתר משתמש ב‑window.PLBackend.
   ============================================================ */
(function () {
  var CFG = window.PL_CONFIG || {};
  var HAS_SB = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
  var ADMINS = (CFG.ADMIN_EMAILS || []).map(function (e) { return String(e).toLowerCase().trim(); });

  // Merged admin set: starts from config.js, gets extra emails from the DB `admins` table at boot.
  var ADMIN_SET = {};
  ADMINS.forEach(function (e) { if (e) ADMIN_SET[e] = true; });

  function isAdminEmail(email) {
    if (!email) return false;
    return ADMIN_SET[String(email).toLowerCase().trim()] === true;
  }

  // Translate raw Supabase auth errors into clear Hebrew (so the real reason is never hidden).
  function authErr(msg) {
    var m = String(msg || '').toLowerCase();
    if (m.indexOf('email not confirmed') !== -1 || m.indexOf('not confirmed') !== -1)
      return { code: 'unconfirmed', message: 'החשבון קיים אבל המייל עדיין לא אומת — אשרו את המייל, או בקשו שליחה מחדש למטה.' };
    if (m.indexOf('already registered') !== -1 || m.indexOf('already exists') !== -1 || m.indexOf('user already') !== -1)
      return { code: 'exists', message: 'כתובת האימייל כבר רשומה. נסו להתחבר או לאפס סיסמה.' };
    if (m.indexOf('invalid login') !== -1 || m.indexOf('invalid credentials') !== -1)
      return { code: 'bad', message: 'אימייל או סיסמה שגויים.' };
    if (m.indexOf('rate limit') !== -1 || m.indexOf('too many') !== -1)
      return { code: 'rate', message: 'יותר מדי ניסיונות. המתינו דקה ונסו שוב.' };
    return { code: 'other', message: msg || 'אירעה שגיאה. נסו שוב.' };
  }

  /* ---------- helpers ---------- */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('load fail ' + src)); };
      document.head.appendChild(s);
    });
  }
  function uid(p) { return (p || 'cl') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function nowISO() { return new Date().toISOString(); }

  /* ============================================================
     DEMO MODE  (localStorage)
     ============================================================ */
  var DEMO = (function () {
    var CKEY = 'pl_clients_v1', SKEY = 'pl_session_v1', AKEY = 'pl_admins_v1', LKEY = 'pl_leads_v1';
    function readClients() { try { return JSON.parse(localStorage.getItem(CKEY)) || []; } catch (e) { return []; } }
    function writeClients(a) { try { localStorage.setItem(CKEY, JSON.stringify(a)); } catch (e) {} }
    function readAdmins() { try { return JSON.parse(localStorage.getItem(AKEY)) || []; } catch (e) { return []; } }
    function writeAdmins(a) { try { localStorage.setItem(AKEY, JSON.stringify(a)); } catch (e) {} }
    function readLeads() { try { return JSON.parse(localStorage.getItem(LKEY)) || []; } catch (e) { return []; } }
    function writeLeads(a) { try { localStorage.setItem(LKEY, JSON.stringify(a)); } catch (e) {} }
    function session() { try { return localStorage.getItem(SKEY) || null; } catch (e) { return null; } }
    function setSession(email) { try { email ? localStorage.setItem(SKEY, email) : localStorage.removeItem(SKEY); } catch (e) {} }

    // seed a couple of example clients on first run
    (function seed() {
      if (localStorage.getItem(CKEY)) return;
      writeClients([
        { id: uid(), full_name: 'דנה כהן', business: 'אורban סטודיו', email: 'dana@urban.co.il', phone: '053-1234567', tax_id: '514882345', tier: 'צמיחה', status: 'active', notes: '', created_at: nowISO(), password: 'demo1234' },
        { id: uid(), full_name: 'יוסי לוי', business: 'לוי עיצובים', email: 'yossi@levi.co.il', phone: '054-7654321', tax_id: '038112233', tier: 'בסיס', status: 'active', notes: '', created_at: nowISO(), password: 'demo1234' }
      ]);
    })();

    // seed example leads on first run
    (function seedLeads() {
      if (localStorage.getItem(LKEY)) return;
      writeLeads([
        { id: uid('ld'), full_name: 'דנה כהן', business: 'אורban סטודיו', email: 'dana@urban.co.il', phone: '053-1234567', topic: 'הנהלת חשבונות', message: 'מעוניינת בחבילת צמיחה לעסק שלי.', status: 'new', created_at: nowISO() },
        { id: uid('ld'), full_name: 'יוסי לוי', business: 'לוי עיצובים', email: 'yossi@levi.co.il', phone: '054-7654321', topic: 'בניית אתר / מערכת', message: 'צריך אתר תדמית לעסק.', status: 'new', created_at: nowISO() }
      ]);
    })();

    function byEmail(email) {
      email = String(email || '').toLowerCase().trim();
      return readClients().filter(function (c) { return (c.email || '').toLowerCase() === email; })[0] || null;
    }

    return {
      mode: 'demo',
      auth: {
        signUp: function (p) {
          return new Promise(function (res, rej) {
            if (byEmail(p.email)) return rej(new Error('כתובת האימייל כבר רשומה במערכת.'));
            var list = readClients();
            var rec = {
              id: uid(), full_name: p.full_name || '', business: p.business || '',
              email: p.email, phone: p.phone || '', tax_id: p.tax_id || '',
              tier: p.tier || 'בסיס', status: 'active', notes: '', created_at: nowISO(),
              password: p.password
            };
            list.push(rec); writeClients(list); setSession(rec.email);
            res({ email: rec.email, client: rec });
          });
        },
        signIn: function (p) {
          return new Promise(function (res, rej) {
            var c = byEmail(p.email);
            if (!c || c.password !== p.password) return rej(new Error('אימייל או סיסמה שגויים.'));
            if (c.status === 'blocked') return rej(new Error('החשבון חסום. אנא צרו קשר עם המשרד.'));
            setSession(c.email); res({ email: c.email, client: c });
          });
        },
        signOut: function () { setSession(null); return Promise.resolve(); },
        session: function () {
          var em = session(); if (!em) return Promise.resolve(null);
          var c = byEmail(em); if (!c) { setSession(null); return Promise.resolve(null); }
          return Promise.resolve({ email: em, client: c, isAdmin: isAdminEmail(em) });
        },
        resetPassword: function () { return Promise.resolve(); },
        resendConfirm: function () { return Promise.resolve(); },
        updatePassword: function (newPassword) {
          var em = session(); if (!em) return Promise.reject(new Error('אין חיבור פעיל.'));
          var list = readClients(); list.forEach(function (c) { if ((c.email || '').toLowerCase() === em.toLowerCase()) c.password = newPassword; });
          writeClients(list); return Promise.resolve(true);
        }
      },
      clients: {
        list: function () { return Promise.resolve(readClients().slice().sort(function (a, b) { return (b.created_at || '').localeCompare(a.created_at || ''); })); },
        add: function (p) {
          var list = readClients();
          if (byEmail(p.email)) return Promise.reject(new Error('כתובת האימייל כבר קיימת.'));
          var rec = { id: uid(), full_name: p.full_name || '', business: p.business || '', email: p.email || '', phone: p.phone || '', tax_id: p.tax_id || '', tier: p.tier || 'בסיס', status: p.status || 'active', notes: p.notes || '', created_at: nowISO(), password: p.password || 'changeme' };
          list.push(rec); writeClients(list); return Promise.resolve(rec);
        },
        update: function (id, patch) {
          var list = readClients(), found = null;
          list.forEach(function (c) { if (c.id === id) { Object.assign(c, patch); found = c; } });
          writeClients(list); return Promise.resolve(found);
        },
        setStatus: function (id, status) { return this.update(id, { status: status }); },
        remove: function (id) { writeClients(readClients().filter(function (c) { return c.id !== id; })); return Promise.resolve(); }
      },
      admins: {
        list: function () {
          var fromCfg = ADMINS.map(function (e) { return { email: e, source: 'config' }; });
          var fromLs = readAdmins().map(function (e) { return { email: e, source: 'local' }; });
          return Promise.resolve(fromCfg.concat(fromLs));
        },
        add: function (email) {
          email = String(email || '').toLowerCase().trim();
          if (!email) return Promise.reject(new Error('יש להזין אימייל.'));
          var a = readAdmins(); if (a.indexOf(email) === -1) { a.push(email); writeAdmins(a); }
          ADMIN_SET[email] = true; return Promise.resolve({ email: email });
        },
        remove: function (email) {
          email = String(email || '').toLowerCase().trim();
          writeAdmins(readAdmins().filter(function (e) { return e !== email; }));
          if (ADMINS.indexOf(email) === -1) delete ADMIN_SET[email];
          return Promise.resolve();
        }
      },
      leads: {
        list: function () { return Promise.resolve(readLeads().slice().sort(function (a, b) { return (b.created_at || '').localeCompare(a.created_at || ''); })); },
        add: function (p) {
          var rec = { id: uid('ld'), full_name: p.full_name || '', business: p.business || '', email: p.email || '', phone: p.phone || '', topic: p.topic || '', message: p.message || '', status: 'new', created_at: nowISO() };
          var l = readLeads(); l.push(rec); writeLeads(l); return Promise.resolve(rec);
        },
        setStatus: function (id, status) { var l = readLeads(); l.forEach(function (x) { if (x.id === id) x.status = status; }); writeLeads(l); return Promise.resolve(); },
        remove: function (id) { writeLeads(readLeads().filter(function (x) { return x.id !== id; })); return Promise.resolve(); }
      }
    };
  })();

  /* ============================================================
     SUPABASE MODE
     ============================================================ */
  function makeSupabase(sb) {
    // Adapter: profiles (the financial portal's real, single source of truth
    // for clients) is mapped to the OLD "clients" shape that admin.html /
    // admin.js already expect (business/tier/status) — so neither of those
    // files needed to change at all. business<->company_name, tier<->plan,
    // status<->blocked are the only field-name differences.
    function clientFromProfile(p) {
      if (!p) return null;
      return {
        id: p.id, full_name: p.full_name || '', business: p.company_name || '',
        email: p.email || '', phone: p.phone || '', tax_id: p.tax_id || '',
        tier: p.plan === 'pro' ? 'צמיחה' : 'בסיס', status: p.blocked ? 'blocked' : 'active',
        notes: '', created_at: p.created_at
      };
    }
    function profileFor(user) {
      // profiles has no email column (email lives on auth.users) — join by id.
      return sb.from('profiles').select('*').eq('id', user.id).maybeSingle()
        .then(function (r) { return clientFromProfile(r.data ? Object.assign({}, r.data, { email: user.email }) : null); });
    }
    return {
      mode: 'supabase',
      _sb: sb,
      auth: {
        signUp: function (p) {
          // options.data keys (full_name/business/phone/tax_id) are read
          // directly by the portal-side DB trigger that auto-creates the
          // matching profiles row the instant this signUp succeeds — see
          // handle_new_unified_user() in the portal's Supabase project.
          return sb.auth.signUp({
            email: p.email, password: p.password,
            options: { data: { full_name: p.full_name, business: p.business, phone: p.phone, tax_id: p.tax_id, usage_type: 'biz' } }
          }).then(function (r) {
            if (r.error) { var e = authErr(r.error.message); var err = new Error(e.message); err.code = e.code; throw err; }
            return { email: p.email, client: null, needsConfirm: !r.data.session };
          });
        },
        signIn: function (p) {
          return sb.auth.signInWithPassword({ email: p.email, password: p.password }).then(function (r) {
            if (r.error) { var e = authErr(r.error.message); var err = new Error(e.message); err.code = e.code; throw err; }
            return profileFor(r.data.user).then(function (client) {
              if (client && client.status === 'blocked') {
                return sb.auth.signOut().then(function () { throw new Error('החשבון חסום. אנא צרו קשר עם המשרד.'); });
              }
              return { email: r.data.user.email, client: client, isAdmin: isAdminEmail(r.data.user.email) };
            });
          });
        },
        resendConfirm: function (email) {
          return sb.auth.resend({ type: 'signup', email: email }).then(function (r) {
            if (r.error) throw new Error(authErr(r.error.message).message);
          });
        },
        signOut: function () { return sb.auth.signOut(); },
        session: function () {
          return sb.auth.getSession().then(function (r) {
            var s = r.data.session; if (!s) return null;
            return profileFor(s.user).then(function (client) {
              return { email: s.user.email, client: client, isAdmin: isAdminEmail(s.user.email) };
            });
          });
        },
        updatePassword: function (newPassword) {
          return sb.auth.updateUser({ password: newPassword }).then(function (r) {
            if (r.error) throw new Error(authErr(r.error.message).message);
            return true;
          });
        },
        resetPassword: function (email) {
          return sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname.replace(/[^/]*$/, '') + 'reset-password.html' });
        }
      },
      clients: {
        // Reuses the portal's own admin_list_users() RPC — it already joins
        // profiles with auth.users correctly (profiles has no email column
        // of its own), so this is the same tested code path the portal's
        // own admin panel uses, not a new parallel query.
        list: function () {
          return sb.rpc('admin_list_users')
            .then(function (r) {
              if (r.error) throw new Error(r.error.message);
              return (r.data || []).filter(function(u){ return u.role !== 'admin'; }).map(function (u) {
                return {
                  id: u.id, full_name: u.full_name || '', business: u.company_name || '',
                  email: u.email || '', phone: u.phone || '', tax_id: u.tax_id || '',
                  tier: u.plan === 'pro' ? 'צמיחה' : 'בסיס', status: u.blocked ? 'blocked' : 'active',
                  notes: '', created_at: u.created_at
                };
              });
            });
        },
        // Manually pre-adding a not-yet-registered client ("invited" status)
        // no longer applies: profiles always require a real auth.users
        // account first (the FK they're built on). Use the portal's own
        // admin panel ("הוסף לקוח חדש") to create a full account directly.
        add: function () {
          return Promise.reject(new Error('הוספת לקוח ידנית עברה לפאנל הניהול בפורטל (portal.primels.co.il) — שם זה יוצר חשבון מלא ומיידי, לא רק רשומה ממתינה.'));
        },
        update: function (id, patch) {
          var dbPatch = {};
          if (patch.full_name !== undefined) dbPatch.full_name = patch.full_name;
          if (patch.business !== undefined) dbPatch.company_name = patch.business;
          if (patch.phone !== undefined) dbPatch.phone = patch.phone;
          if (patch.tax_id !== undefined) dbPatch.tax_id = patch.tax_id;
          if (patch.status !== undefined) dbPatch.blocked = (patch.status === 'blocked');
          if (patch.tier !== undefined) dbPatch.plan = (patch.tier === 'בסיס') ? 'free' : 'pro';
          return sb.from('profiles').update(dbPatch).eq('id', id).select().single()
            .then(function (r) { if (r.error) throw new Error(r.error.message); return clientFromProfile(r.data); });
        },
        setStatus: function (id, status) { return this.update(id, { status: status }); },
        // Deleting a client account (auth.users + profiles together) needs
        // elevated privileges this anon-key client doesn't have — use the
        // portal's own admin panel to block/manage accounts instead.
        remove: function () {
          return Promise.reject(new Error('מחיקת לקוח עוברת דרך פאנל הניהול בפורטל (portal.primels.co.il) — אפשר לחסום מכאן, אך למחוק שם.'));
        }
      },
      admins: {
        list: function () {
          return sb.from('admins').select('*').order('created_at', { ascending: true })
            .then(function (r) { if (r.error) throw new Error(r.error.message); return r.data || []; });
        },
        add: function (email) {
          email = String(email || '').toLowerCase().trim();
          if (!email) return Promise.reject(new Error('\u05d9\u05e9 \u05dc\u05d4\u05d6\u05d9\u05df \u05d0\u05d9\u05de\u05d9\u05d9\u05dc.'));
          return sb.from('admins').insert({ email: email }).select().single()
            .then(function (r) { if (r.error) throw new Error(r.error.message); ADMIN_SET[email] = true; return r.data; });
        },
        remove: function (email) {
          email = String(email || '').toLowerCase().trim();
          return sb.from('admins').delete().eq('email', email)
            .then(function (r) { if (r.error) throw new Error(r.error.message); delete ADMIN_SET[email]; });
        }
      },
      leads: {
        // site_leads (not the old "leads" table) — inserting here also
        // triggers an instant WhatsApp notification to the office, the same
        // way upgrade requests and chat messages already do inside the portal.
        list: function () {
          return sb.from('site_leads').select('*').order('created_at', { ascending: false })
            .then(function (r) { if (r.error) throw new Error(r.error.message); return r.data || []; });
        },
        add: function (p) {
          var rec = { full_name: p.full_name || '', business: p.business || '', email: p.email || '', phone: p.phone || '', topic: p.topic || '', message: p.message || '', status: 'new' };
          // No .select() return — public visitors can INSERT but not SELECT leads (RLS), so a returning-select would fail.
          return sb.from('site_leads').insert(rec)
            .then(function (r) { if (r.error) throw new Error(r.error.message); return rec; });
        },
        setStatus: function (id, status) {
          return sb.from('site_leads').update({ status: status }).eq('id', id).select().single()
            .then(function (r) { if (r.error) throw new Error(r.error.message); return r.data; });
        },
        remove: function (id) {
          return sb.from('site_leads').delete().eq('id', id)
            .then(function (r) { if (r.error) throw new Error(r.error.message); });
        }
      }
    };
  }

  /* ============================================================
     BOOTSTRAP
     ============================================================ */
  var impl = DEMO;
  var readyResolve;
  var ready = new Promise(function (res) { readyResolve = res; });

  function finish() {
    window.PLBackend = {
      mode: impl.mode,
      ready: ready,
      isDemo: impl.mode === 'demo',
      isAdminEmail: isAdminEmail,
      auth: impl.auth,
      clients: impl.clients,
      admins: impl.admins,
      leads: impl.leads,
      config: CFG
    };
    readyResolve(window.PLBackend);
  }

  if (HAS_SB) {
    loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js')
      .then(function () {
        var sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
        impl = makeSupabase(sb);
        // Best-effort: merge admin emails stored in the DB so admin rights survive even without config.js.
        return sb.from('admins').select('email').then(function (r) {
          if (!r.error && r.data) r.data.forEach(function (row) { if (row && row.email) ADMIN_SET[String(row.email).toLowerCase().trim()] = true; });
        }).catch(function () {}).then(finish);
      })
      .catch(function () { impl = DEMO; finish(); });
  } else {
    finish();
  }

  // expose a tiny early stub so callers can await
  window.PLBackend = window.PLBackend || { ready: ready, mode: HAS_SB ? 'supabase' : 'demo', isDemo: !HAS_SB };
})();
