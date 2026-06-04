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

  function isAdminEmail(email) {
    return !!email && ADMINS.indexOf(String(email).toLowerCase().trim()) !== -1;
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
    var CKEY = 'pl_clients_v1', SKEY = 'pl_session_v1';
    function readClients() { try { return JSON.parse(localStorage.getItem(CKEY)) || []; } catch (e) { return []; } }
    function writeClients(a) { try { localStorage.setItem(CKEY, JSON.stringify(a)); } catch (e) {} }
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
        resetPassword: function () { return Promise.resolve(); }
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
      }
    };
  })();

  /* ============================================================
     SUPABASE MODE
     ============================================================ */
  function makeSupabase(sb) {
    function profileFor(user) {
      return sb.from('clients').select('*').eq('email', user.email).maybeSingle()
        .then(function (r) { return r.data; });
    }
    return {
      mode: 'supabase',
      _sb: sb,
      auth: {
        signUp: function (p) {
          return sb.auth.signUp({
            email: p.email, password: p.password,
            options: { data: { full_name: p.full_name, business: p.business, phone: p.phone, tax_id: p.tax_id, tier: p.tier || 'בסיס' } }
          }).then(function (r) {
            if (r.error) throw new Error(r.error.message);
            return { email: p.email, client: null, needsConfirm: !r.data.session };
          });
        },
        signIn: function (p) {
          return sb.auth.signInWithPassword({ email: p.email, password: p.password }).then(function (r) {
            if (r.error) throw new Error('אימייל או סיסמה שגויים.');
            return profileFor(r.data.user).then(function (client) {
              if (client && client.status === 'blocked') {
                return sb.auth.signOut().then(function () { throw new Error('החשבון חסום. אנא צרו קשר עם המשרד.'); });
              }
              return { email: r.data.user.email, client: client };
            });
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
        resetPassword: function (email) {
          return sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/login.html' });
        }
      },
      clients: {
        list: function () {
          return sb.from('clients').select('*').order('created_at', { ascending: false })
            .then(function (r) { if (r.error) throw new Error(r.error.message); return r.data || []; });
        },
        add: function (p) {
          var rec = { full_name: p.full_name || '', business: p.business || '', email: p.email || '', phone: p.phone || '', tax_id: p.tax_id || '', tier: p.tier || 'בסיס', status: p.status || 'invited', notes: p.notes || '' };
          return sb.from('clients').insert(rec).select().single()
            .then(function (r) { if (r.error) throw new Error(r.error.message); return r.data; });
        },
        update: function (id, patch) {
          return sb.from('clients').update(patch).eq('id', id).select().single()
            .then(function (r) { if (r.error) throw new Error(r.error.message); return r.data; });
        },
        setStatus: function (id, status) { return this.update(id, { status: status }); },
        remove: function (id) {
          return sb.from('clients').delete().eq('id', id)
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
      config: CFG
    };
    readyResolve(window.PLBackend);
  }

  if (HAS_SB) {
    loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js')
      .then(function () {
        var sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
        impl = makeSupabase(sb);
        finish();
      })
      .catch(function () { impl = DEMO; finish(); });
  } else {
    finish();
  }

  // expose a tiny early stub so callers can await
  window.PLBackend = window.PLBackend || { ready: ready, mode: HAS_SB ? 'supabase' : 'demo', isDemo: !HAS_SB };
})();
