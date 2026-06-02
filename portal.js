/* Prime Ledger Portal — controller */
(function () {
  const scroll = document.getElementById('pscroll');

  function buildCalendar() {
    const cal = document.getElementById('cal');
    if (!cal) return;
    const dows = ['א','ב','ג','ד','ה','ו','ש'];
    let html = dows.map(d => `<div class="dow">${d}</div>`).join('');
    // June 2026 starts on a Monday (index 1). 30 days. Pad start.
    const startPad = 1; // Sunday=0; June 1 2026 is Monday
    for (let i = 0; i < startPad; i++) html += `<div class="cell muted"></div>`;
    const events = { 12: 1, 28: 1 };
    for (let d = 1; d <= 30; d++) {
      const cls = ['cell'];
      if (d === 1) cls.push('today');
      if (events[d]) cls.push('has');
      if (d === 12) cls.push('sel');
      html += `<div class="${cls.join(' ')}" onclick="this.parentNode.querySelectorAll('.sel').forEach(e=>e.classList.remove('sel'));this.classList.add('sel')">${d}</div>`;
    }
    cal.innerHTML = html;
  }

  function render(view) {
    scroll.innerHTML = window.PortalViews[view]();
    scroll.scrollTop = 0;
    if (view === 'appointments') buildCalendar();
    if (window.lucide) lucide.createIcons();
  }

  // nav
  document.querySelectorAll('.p-link').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.p-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.view);
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  // mobile sidebar
  document.getElementById('pburger').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // settings tabs (delegated)
  scroll.addEventListener('click', (e) => {
    const tab = e.target.closest('.set-tab');
    if (tab) { tab.parentNode.querySelectorAll('.set-tab').forEach(t => t.classList.remove('on')); tab.classList.add('on'); }
    const pm = e.target.closest('.pay-method[onclick],.pay-method');
  });

  // slot picker (global)
  window.pickSlot = function (el) {
    el.parentNode.querySelectorAll('.slot').forEach(s => s.classList.remove('on'));
    el.classList.add('on');
  };

  // ---- Access guard + personalized greeting ----
  function applyClient(client, email) {
    if (!client) return;
    const nameEl = document.querySelector('.p-user b');
    const subEl = document.querySelector('.p-user-info small');
    const avEl = document.querySelector('.p-av');
    const name = client.full_name || email || '';
    if (nameEl) nameEl.textContent = name;
    if (subEl) subEl.textContent = client.business ? ('חברת ' + client.business) : (email || '');
    if (avEl && name) avEl.textContent = name.trim().charAt(0);
  }

  window.PLBackend.ready.then(function (B) {
    // logout
    const logout = document.querySelector('.p-logout');
    if (logout) logout.addEventListener('click', function (e) {
      e.preventDefault();
      B.auth.signOut().then(function () { location.href = 'login.html'; });
    });
    // guard: live mode requires a session; demo mode greets if signed in
    B.auth.session().then(function (s) {
      if (s) { applyClient(s.client, s.email); }
      else if (!B.isDemo) { location.href = 'login.html'; }
    });
  });

  render('overview');
})();
