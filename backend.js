    (function () {
      try { window.localStorage.setItem('__bb_probe', '1'); window.localStorage.removeItem('__bb_probe'); }
      catch (e) {
        var mem = new Map();
        var shim = {
          getItem: function (k) { return mem.has(String(k)) ? mem.get(String(k)) : null; },
          setItem: function (k, v) { mem.set(String(k), String(v)); },
          removeItem: function (k) { mem.delete(String(k)); },
          clear: function () { mem.clear(); },
          key: function (i) { var ks = Array.from(mem.keys()); return i < ks.length ? ks[i] : null; }
        };
        Object.defineProperty(shim, 'length', { get: function () { return mem.size; } });
        try { Object.defineProperty(window, 'localStorage', { configurable: true, value: shim }); }
        catch (e2) { window.__bbMemoryStore = shim; }
      }
    })();
    (function () {
      if (typeof window.IntersectionObserver !== 'function') {
        window.IntersectionObserver = function (cb) {
          this.observe = function (el) { try { cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }], this); } catch (e) {} };
          this.unobserve = function () {}; this.disconnect = function () {};
          this.takeRecords = function () { return []; };
        };
      }
      if (typeof window.ResizeObserver !== 'function') {
        window.ResizeObserver = function () { this.observe = function () {}; this.unobserve = function () {}; this.disconnect = function () {}; };
      }
    })();
      // guard: the Tailwind CDN may be unavailable offline
      window.tailwind = window.tailwind || { config: {} };
      
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
            display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            obsidian: '#070709',
            brand: {
              orange: '#F97316',
              amber: '#F59E0B',
              coral: '#FB923C',
            }
          }
        }
      }
    };
  (function () {
    var el = document.getElementById('bbSplash');
    if (!el) return;
    function dismiss() {
      el.hidden = true;
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    // Arm immediately; never wait for a logo, font, page load, or service worker.
    var deadline = setTimeout(dismiss, 2100);
    el.addEventListener('click', function () {
      clearTimeout(deadline);
      dismiss();
    });
    try {
      if (sessionStorage.getItem('bb_splash_seen') === '1') {
        clearTimeout(deadline);
        dismiss();
      } else {
        sessionStorage.setItem('bb_splash_seen', '1');
      }
    } catch (e) {}
  })();
    (function () {
      const htmlEl = document.documentElement;
      let motionEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let isLightTheme = false;
      let inDashboard = false;
      let currentHealthScore = 88;
      const formatINR = (num) => '₹' + Math.round(Number(num) || 0).toLocaleString('en-IN');
      const appState = {
        user: {
          name: 'Aarav Sharma',
          business: 'Apex Tech Solutions Pvt. Ltd.',
          gstin: '29AABCA8492K1Z5',
          bank: 'apextech@icici'
        },
        ledger: [
          { type: 'income', title: 'Enterprise SaaS Retainer', amount: 1845000 },
          { type: 'expense', title: 'AWS & Office Lease', amount: 1120000 }
        ],
        invoices: [
          { id: 'INV-2026-101', client: 'Kaveri Retail Marts', base: 122881, gstRate: 18, status: 'Pending' },
          { id: 'INV-2026-102', client: 'Bharath Logistics', base: 69915, gstRate: 18, status: 'Pending' },
          { id: 'INV-2026-103', client: 'Nova FinCorp India', base: 240000, gstRate: 18, status: 'Paid' }
        ],
        inventory: [
          { sku: 'POS-TERM-X1', name: 'Smart UPI POS Terminal', qty: 42, price: 8500 },
          { sku: 'RFID-TAG-500', name: 'Warehouse RFID Tag Pack', qty: 8, price: 3200 }
        ],
        customers: [
          { name: 'Kaveri Retail Marts', gstin: '29AAACK4821M1Z2', due: 145000 },
          { name: 'Bharath Logistics', gstin: '27AABCB9102P1Z9', due: 82500 },
          { name: 'Nova FinCorp India', gstin: '07AAACN7731L1Z4', due: 0 }
        ]
      };

      // ---------------------------------------------------------
      // THEME MODE (12), AUTH MODAL (2), HEALTH SCORE (3) & DASHBOARD (5)
      // ---------------------------------------------------------
      function applyTheme(light) {
        isLightTheme = light;
        htmlEl.classList.toggle('light-theme', isLightTheme);
        htmlEl.classList.toggle('dark', !isLightTheme);
        const icon = document.getElementById('themeIcon');
        const lbl = document.getElementById('themeLabel');
        if (icon) icon.textContent = isLightTheme ? '☀️' : '🌙';
        if (lbl) lbl.textContent = isLightTheme ? 'Light' : 'Dark';
      }
      document.getElementById('themeToggleBtn')?.addEventListener('click', () => applyTheme(!isLightTheme));
      document.getElementById('dashSidebarThemeBtn')?.addEventListener('click', () => applyTheme(!isLightTheme));

      const landingView = document.getElementById('landingView');
      const dashboardView = document.getElementById('dashboardView');
      function switchMainView(showDash) {
        inDashboard = showDash;
        landingView?.classList.toggle('hidden', showDash);
        dashboardView?.classList.toggle('hidden', !showDash);
        if (showDash) renderDashboardData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      document.getElementById('openDashboardBtn')?.addEventListener('click', () => switchMainView(true));
      document.getElementById('heroLaunchDashBtn')?.addEventListener('click', () => switchMainView(true));
      document.getElementById('backToLandingBtn')?.addEventListener('click', () => switchMainView(false));
      document.getElementById('navBrandHome')?.addEventListener('click', () => switchMainView(false));

      // Auth Modal
      const authModal = document.getElementById('authModal');
      document.getElementById('openLoginBtn')?.addEventListener('click', () => authModal?.classList.remove('hidden'));
      document.getElementById('closeAuthModalBtn')?.addEventListener('click', () => authModal?.classList.add('hidden'));
      document.getElementById('tabLoginMode')?.addEventListener('click', () => {
        document.getElementById('signupExtraFields')?.classList.add('hidden');
        document.getElementById('authModalTitle').textContent = 'Welcome Back to BizBuddy';
        document.getElementById('authSubmitBtn').textContent = 'Log In & Open Dashboard';
      });
      document.getElementById('tabSignupMode')?.addEventListener('click', () => {
        document.getElementById('signupExtraFields')?.classList.remove('hidden');
        document.getElementById('authModalTitle').textContent = 'Create Your BizBuddy Account';
        document.getElementById('authSubmitBtn').textContent = 'Create Workspace & Enter';
      });
      // ===== PBKDF2-SHA256 in pure JS (offline / file:// fallback) ==========
      // Pure-JS PBKDF2-SHA256 (RFC 8018). Used only when crypto.subtle is unavailable (file:// APK).
      var bbPbkdf2Sha256 = (function () {
        var K = new Uint32Array([
          0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
          0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
          0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
          0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
          0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
          0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
          0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
          0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
        var W = new Uint32Array(64);
        function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
        function sha256(data) {
          var H = new Int32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
                                  0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
          var len = data.length;
          var padded = new Uint8Array((((len + 9) >> 6) + 1) << 6);
          padded.set(data, 0);
          padded[len] = 0x80;
          var dv = new DataView(padded.buffer);
          var bits = len * 8;
          dv.setUint32(padded.length - 8, Math.floor(bits / 4294967296), false);
          dv.setUint32(padded.length - 4, bits >>> 0, false);
          for (var off = 0; off < padded.length; off += 64) {
            for (var i = 0; i < 16; i++) W[i] = dv.getUint32(off + i * 4, false);
            for (i = 16; i < 64; i++) {
              var s0 = rotr(W[i-15],7) ^ rotr(W[i-15],18) ^ (W[i-15] >>> 3);
              var s1 = rotr(W[i-2],17) ^ rotr(W[i-2],19) ^ (W[i-2] >>> 10);
              W[i] = (W[i-16] + s0 + W[i-7] + s1) | 0;
            }
            var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
            for (i = 0; i < 64; i++) {
              var S1 = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25);
              var ch = (e & f) ^ (~e & g);
              var t1 = (h + S1 + ch + K[i] + W[i]) | 0;
              var S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22);
              var mj = (a & b) ^ (a & c) ^ (b & c);
              var t2 = (S0 + mj) | 0;
              h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
            }
            H[0]=(H[0]+a)|0; H[1]=(H[1]+b)|0; H[2]=(H[2]+c)|0; H[3]=(H[3]+d)|0;
            H[4]=(H[4]+e)|0; H[5]=(H[5]+f)|0; H[6]=(H[6]+g)|0; H[7]=(H[7]+h)|0;
          }
          var out = new Uint8Array(32), odv = new DataView(out.buffer);
          for (i = 0; i < 8; i++) odv.setUint32(i * 4, H[i], false);
          return out;
        }
        function cat(a, b) {
          var o = new Uint8Array(a.length + b.length);
          o.set(a, 0); o.set(b, a.length); return o;
        }
        function hmac(key, msg) {
          if (key.length > 64) key = sha256(key);
          var ipad = new Uint8Array(64), opad = new Uint8Array(64);
          for (var i = 0; i < 64; i++) {
            var k = i < key.length ? key[i] : 0;
            ipad[i] = k ^ 0x36; opad[i] = k ^ 0x5c;
          }
          return sha256(cat(opad, sha256(cat(ipad, msg))));
        }
        return function (pwBytes, salt, iterations, dkLen) {
          var out = new Uint8Array(dkLen);
          var blocks = Math.ceil(dkLen / 32);
          for (var b = 1; b <= blocks; b++) {
            var idx = new Uint8Array([(b >>> 24) & 255, (b >>> 16) & 255, (b >>> 8) & 255, b & 255]);
            var U = hmac(pwBytes, cat(salt, idx));
            var T = U.slice(0);
            for (var i = 1; i < iterations; i++) {
              U = hmac(pwBytes, U);
              for (var j = 0; j < 32; j++) T[j] ^= U[j];
            }
            out.set(T.slice(0, Math.min(32, dkLen - (b - 1) * 32)), (b - 1) * 32);
          }
          return out;
        };
      })();
      // ===== BizBuddy accounts (added) =====================================
      // Local-first auth: PBKDF2-SHA256 via WebCrypto, accounts + workspace
      // data in localStorage. No server, no plaintext passwords.
      const BB = {
        ACCOUNTS: 'bb_accounts_v1',
        SESSION: 'bb_session_v1',
        DATA_PREFIX: 'bb_data_v1:',
        ITER: 150000,
        _read(key, fallback) {
          try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
          catch (e) { return fallback; }
        },
        _write(key, val) {
          try { localStorage.setItem(key, JSON.stringify(val)); return true; }
          catch (e) { return false; }
        },
        accounts() { return this._read(this.ACCOUNTS, {}); },
        saveAccounts(a) { return this._write(this.ACCOUNTS, a); },
        session() { return this._read(this.SESSION, null); },
        setSession(s) { return s ? this._write(this.SESSION, s) : (localStorage.removeItem(this.SESSION), true); },

        async hash(password, saltHex) {
          const enc = new TextEncoder();
          const salt = Uint8Array.from(saltHex.match(/.{2}/g).map(h => parseInt(h, 16)));
          // crypto.subtle is missing on file:// origins (the packaged APK), so use
          // a pure-JS PBKDF2-SHA256 there. Both paths produce identical digests.
          if (globalThis.crypto && crypto.subtle && crypto.subtle.importKey) {
            try {
              const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
              const bits = await crypto.subtle.deriveBits(
                { name: 'PBKDF2', salt, iterations: this.ITER, hash: 'SHA-256' }, key, 256);
              return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
            } catch (e) { /* opaque origin -> fall through */ }
          }
          return Array.from(bbPbkdf2Sha256(enc.encode(password), salt, this.ITER, 32))
            .map(b => b.toString(16).padStart(2, '0')).join('');
        },
        _salt() {
          return Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0')).join('');
        },
        dataKey(email) { return this.DATA_PREFIX + email; },
        loadData(email) {
          const d = this._read(this.dataKey(email), null);
          if (!d) return null;
          appState.user = Object.assign({}, appState.user, d.user || {});
          if (Array.isArray(d.ledger)) appState.ledger = d.ledger;
          if (Array.isArray(d.invoices)) appState.invoices = d.invoices;
          if (Array.isArray(d.inventory)) appState.inventory = d.inventory;
          return d;
        },
        saveData(email) {
          if (!email) return false;
          return this._write(this.dataKey(email), {
            user: appState.user, ledger: appState.ledger,
            invoices: appState.invoices, inventory: appState.inventory,
            savedAt: new Date().toISOString()
          });
        }
      };

      let bbAuthMode = 'signup';   // 'signup' | 'login'
      const bbTabLogin = document.getElementById('tabLoginMode');
      const bbTabSignup = document.getElementById('tabSignupMode');
      const bbAuthErr = document.getElementById('bbAuthError');
      const bbEmailField = document.getElementById('authEmail');
      const bbPassField = document.getElementById('authPassword');

      function bbShowError(msg) {
        if (!bbAuthErr) return;
        bbAuthErr.textContent = msg;
        bbAuthErr.classList.remove('hidden');
      }
      function bbClearError() { bbAuthErr?.classList.add('hidden'); }

      function bbSetMode(mode) {
        bbAuthMode = mode;
        bbClearError();
        const signup = mode === 'signup';
        const title = document.getElementById('authModalTitle');
        const btn = document.getElementById('authSubmitBtn');
        if (title) title.textContent = signup ? 'Create Workspace' : 'Welcome Back';
        if (btn) btn.textContent = signup ? 'Create Workspace & Enter' : 'Log In & Open Dashboard';
        // owner/business/GSTIN are only needed when creating an account
        ['authOwnerName', 'authBizName', 'authGstin'].forEach(id => {
          const wrap = document.getElementById(id)?.closest('div');
          if (wrap) wrap.classList.toggle('hidden', !signup);
        });
        const act = signup ? bbTabSignup : bbTabLogin;
        const oth = signup ? bbTabLogin : bbTabSignup;
        act?.classList.add('bg-orange-500/25', 'text-white');
        act?.classList.remove('text-slate-400');
        oth?.classList.remove('bg-orange-500/25', 'text-white');
        oth?.classList.add('text-slate-400');
      }
      bbTabLogin?.addEventListener('click', () => bbSetMode('login'));
      bbTabSignup?.addEventListener('click', () => bbSetMode('signup'));

      async function bbOpenWorkspace(email) {
        BB.setSession({ email, at: Date.now() });
        const restored = BB.loadData(email);
        const acc = BB.accounts()[email];
        if (acc) {
          appState.user.name = acc.owner || appState.user.name;
          appState.user.business = acc.business || appState.user.business;
          if (acc.gstin) appState.user.gstin = acc.gstin;
          // a first-time account starts empty instead of showing demo numbers
          if (!restored) {
            appState.ledger = [];
            appState.invoices = [];
            appState.inventory = [];
            appState.user.name = acc.owner || 'Owner';
            appState.user.business = acc.business || 'My Business';
            appState.user.gstin = acc.gstin || '';
          }
        }
        authModal?.classList.add('hidden');
        document.body.classList.add('bb-authed');
        switchMainView(true);
      }

      document.getElementById('authForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        bbClearError();
        const btn = document.getElementById('authSubmitBtn');
        const email = (bbEmailField?.value || '').trim().toLowerCase();
        const password = bbPassField?.value || '';
        const owner = document.getElementById('authOwnerName')?.value.trim();
        const biz = document.getElementById('authBizName')?.value.trim();
        const gstin = document.getElementById('authGstin')?.value.trim().toUpperCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bbShowError('Enter a valid email address.');
        if (password.length < 8) return bbShowError('Password must be at least 8 characters.');

        const accounts = BB.accounts();

        if (bbAuthMode === 'signup') {
          if (!owner) return bbShowError('Enter the owner name.');
          if (!biz) return bbShowError('Enter the business name.');
          if (accounts[email]) return bbShowError('An account with this email already exists. Log in instead.');
          if (btn) { btn.disabled = true; btn.textContent = 'Securing…'; }
          const salt = BB._salt();
          const hash = await BB.hash(password, salt);
          accounts[email] = { email, owner, business: biz, gstin: gstin || '', salt, hash,
                              createdAt: new Date().toISOString() };
          if (!BB.saveAccounts(accounts)) {
            if (btn) { btn.disabled = false; btn.textContent = 'Create Workspace & Enter'; }
            return bbShowError('Could not save the account (storage blocked or full).');
          }
          if (btn) { btn.disabled = false; btn.textContent = 'Create Workspace & Enter'; }
          await bbOpenWorkspace(email);
          bbToast('Workspace created. Welcome, ' + owner + '!');
        } else {
          const acc = accounts[email];
          if (btn) { btn.disabled = true; btn.textContent = 'Checking…'; }
          // constant-ish response: verify against a dummy salt when unknown
          const salt = acc ? acc.salt : '00'.repeat(16);
          const hash = await BB.hash(password, salt);
          if (btn) { btn.disabled = false; btn.textContent = 'Log In & Open Dashboard'; }
          if (!acc || acc.hash !== hash) return bbShowError('Incorrect email or password.');
          await bbOpenWorkspace(email);
          bbToast('Welcome back, ' + (acc.owner || 'there') + '!');
        }
      });

      // demo login stays, but is clearly a demo (no account, not persisted)
      document.getElementById('instantDemoLoginBtn')?.addEventListener('click', () => {
        authModal?.classList.add('hidden');
        switchMainView(true);
        bbToast('Demo mode — edits are not saved.');
      });

      // restore an existing session on reload
      (function bbRestoreSession() {
        const s = BB.session();
        if (!s?.email) return;
        const acc = BB.accounts()[s.email];
        if (!acc) return;
        BB.loadData(s.email);
        appState.user.name = acc.owner || appState.user.name;
        appState.user.business = acc.business || appState.user.business;
        if (acc.gstin) appState.user.gstin = acc.gstin;
        document.body.classList.add('bb-authed');
        authModal?.classList.add('hidden');
        switchMainView(true);
      })();

      // toast helper + sign-out
      function bbToast(msg) {
        let t = document.getElementById('bbToast');
        if (!t) {
          t = document.createElement('div');
          t.id = 'bbToast';
          t.className = 'bb-toast';
          document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('bb-toast-show');
        clearTimeout(t._timer);
        t._timer = setTimeout(() => t.classList.remove('bb-toast-show'), 3200);
      }
      window.bbSignOut = function () {
        BB.setSession(null);
        document.body.classList.remove('bb-authed');
        switchMainView(false);
        bbToast('Signed out.');
      };
      // ===== /accounts =====================================================

      // Business Health Score Sliders
      function updateHealthScore() {
        const m = Number(document.getElementById('hsMarginSlider')?.value || 32);
        const g = Number(document.getElementById('hsGstSlider')?.value || 96);
        const d = Number(document.getElementById('hsDuesSlider')?.value || 84);
        if (document.getElementById('hsMarginVal')) document.getElementById('hsMarginVal').textContent = m + '%';
        if (document.getElementById('hsGstVal')) document.getElementById('hsGstVal').textContent = g + '%';
        if (document.getElementById('hsDuesVal')) document.getElementById('hsDuesVal').textContent = d + '%';

        currentHealthScore = Math.min(100, Math.max(35, Math.round(m * 0.65 + g * 0.4 + d * 0.34)));
        if (document.getElementById('healthScoreNumber')) document.getElementById('healthScoreNumber').textContent = String(currentHealthScore);
        if (document.getElementById('ovHealth')) document.getElementById('ovHealth').textContent = `${currentHealthScore} / 100`;
        const ring = document.getElementById('healthScoreRing');
        if (ring) {
          const circumference = 565.48;
          ring.style.strokeDashoffset = String(circumference - (currentHealthScore / 100) * circumference);
        }
        const gradeEl = document.getElementById('healthScoreGrade');
        if (gradeEl) {
          gradeEl.textContent = currentHealthScore >= 85 ? 'AAA · Strong' : currentHealthScore >= 70 ? 'AA · Healthy' : 'B · Needs Focus';
        }
      }
      ['hsMarginSlider', 'hsGstSlider', 'hsDuesSlider'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', updateHealthScore);
      });
      updateHealthScore();

      // Dashboard Sidebar Tabs & Dynamic Rendering
      document.querySelectorAll('.dash-nav-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.dash-nav-item').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          document.querySelectorAll('.dash-panel').forEach((p) => p.classList.add('hidden'));
          document.getElementById(`panel-${btn.dataset.tab}`)?.classList.remove('hidden');
        });
      });

      function renderDashboardData() {
        // ===== BizBuddy autosave (added) =====
        try {
          if (typeof BB !== 'undefined' && BB.saveData) {
            const s = (typeof BB.session === 'function') ? BB.session() : null;
            if (s && s.email) BB.saveData(s.email);
          }
        } catch (e) { /* storage blocked */ }
        // ===== /autosave =====
        const bizHeader = document.getElementById('dashHeaderBizName');
        if (bizHeader) bizHeader.textContent = appState.user.business;

        const inc = appState.ledger.filter((x) => x.type === 'income').reduce((s, x) => s + x.amount, 0);
        const exp = appState.ledger.filter((x) => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
        const dues = appState.customers.reduce((s, c) => s + c.due, 0);

        if (document.getElementById('ovIncome')) document.getElementById('ovIncome').textContent = formatINR(inc);
        if (document.getElementById('ovExpense')) document.getElementById('ovExpense').textContent = formatINR(exp);
        if (document.getElementById('ovProfit')) document.getElementById('ovProfit').textContent = formatINR(inc - exp);
        if (document.getElementById('ovDuesText')) document.getElementById('ovDuesText').textContent = formatINR(dues);

        const ledWrap = document.getElementById('ledgerListWrap');
        if (ledWrap) {
          ledWrap.innerHTML = appState.ledger.map((item) => `
            <div class="flex justify-between items-center p-3 rounded-xl bg-white/[0.05] border border-white/10">
              <span class="font-semibold text-white">${item.title}</span>
              <span class="font-bold ${item.type === 'income' ? 'text-emerald-300' : 'text-rose-300'}">${item.type === 'income' ? '+' : '-'}${formatINR(item.amount)}</span>
            </div>
          `).join('');
        }

        const invWrap = document.getElementById('invoiceListWrap');
        if (invWrap) {
          invWrap.innerHTML = appState.invoices.map((inv, idx) => {
            const total = Math.round(inv.base * (1 + inv.gstRate / 100));
            return `
              <div class="flex flex-wrap justify-between items-center gap-2 p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
                <div><span class="font-bold text-white">${inv.id}</span> · <span class="text-slate-300">${inv.client}</span> <span class="text-orange-300 font-bold ml-2">${formatINR(total)}</span></div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">${inv.status}</span>
                  ${inv.status !== 'Paid' ? `<button type="button" data-pay-inv="${idx}" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold cursor-pointer">Mark Paid</button>` : ''}
                  <button type="button" data-view-inv="${idx}" class="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 font-bold cursor-pointer">PDF / Print</button>
                </div>
              </div>
            `;
          }).join('');
        }

        const txWrap = document.getElementById('txListWrap');
        if (txWrap) {
          txWrap.innerHTML = appState.ledger.map((item, i) => `
            <div class="flex justify-between items-center p-3 rounded-xl bg-white/[0.05]">
              <span>UTR-884920${i + 1} · ${item.title}</span>
              <span class="font-bold ${item.type === 'income' ? 'text-emerald-300' : 'text-rose-300'}">${formatINR(item.amount)}</span>
            </div>
          `).join('');
        }

        const skuWrap = document.getElementById('inventoryListWrap');
        if (skuWrap) {
          skuWrap.innerHTML = appState.inventory.map((it, idx) => `
            <div class="flex justify-between items-center p-3 rounded-xl bg-white/[0.05]">
              <div><span class="font-bold text-white">${it.name}</span> <span class="text-slate-400">(${formatINR(it.price)})</span> ${it.qty <= 10 ? '<span class="ml-2 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">Low Stock</span>' : ''}</div>
              <div class="flex items-center gap-2">
                <button type="button" data-sku-dec="${idx}" class="w-7 h-7 rounded-lg bg-white/10 font-bold cursor-pointer">-</button>
                <span class="font-bold text-white w-8 text-center">${it.qty}</span>
                <button type="button" data-sku-inc="${idx}" class="w-7 h-7 rounded-lg bg-white/10 font-bold cursor-pointer">+</button>
              </div>
            </div>
          `).join('');
        }

        const custWrap = document.getElementById('customerListWrap');
        if (custWrap) {
          custWrap.innerHTML = appState.customers.map((c, idx) => `
            <div class="flex justify-between items-center p-3.5 rounded-2xl bg-white/[0.05]">
              <div><div class="font-bold text-white">${c.name}</div><div class="text-[11px] text-slate-400">GSTIN: ${c.gstin}</div></div>
              <div class="flex items-center gap-3">
                <span class="font-bold ${c.due > 0 ? 'text-amber-300' : 'text-emerald-300'}">${c.due > 0 ? 'Due: ' + formatINR(c.due) : 'Settled'}</span>
                ${c.due > 0 ? `<button type="button" data-settle-cust="${idx}" class="px-3 py-1 rounded-lg bg-orange-500/20 text-orange-300 font-bold cursor-pointer">Settle</button>` : ''}
              </div>
            </div>
          `).join('');
        }
      }

      document.getElementById('profileSaveForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        appState.user.name = document.getElementById('profOwnerInput').value.trim() || appState.user.name;
        appState.user.business = document.getElementById('profBizInput').value.trim() || appState.user.business;
        appState.user.gstin = document.getElementById('profGstinInput').value.trim() || appState.user.gstin;
        appState.user.bank = document.getElementById('profBankInput').value.trim() || appState.user.bank;
        renderDashboardData();
        const b = document.getElementById('profSavedBadge');
        b?.classList.remove('hidden');
        setTimeout(() => b?.classList.add('hidden'), 2500);
      });

      document.getElementById('addLedgerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        appState.ledger.unshift({
          type: document.getElementById('ledType').value,
          title: document.getElementById('ledTitle').value.trim(),
          amount: Number(document.getElementById('ledAmount').value)
        });
        e.target.reset();
        renderDashboardData();
      });

      document.getElementById('createInvoiceForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        appState.invoices.unshift({
          id: `INV-2026-${104 + appState.invoices.length}`,
          client: document.getElementById('invClient').value.trim(),
          base: Number(document.getElementById('invAmount').value),
          gstRate: Number(document.getElementById('invGstRate').value),
          status: 'Pending'
        });
        e.target.reset();
        renderDashboardData();
      });

      document.getElementById('invoiceListWrap')?.addEventListener('click', (e) => {
        const payBtn = e.target.closest('[data-pay-inv]');
        if (payBtn) {
          const inv = appState.invoices[Number(payBtn.dataset.payInv)];
          if (inv) { inv.status = 'Paid'; renderDashboardData(); }
          return;
        }
        const viewBtn = e.target.closest('[data-view-inv]');
        if (viewBtn) {
          const inv = appState.invoices[Number(viewBtn.dataset.viewInv)];
          if (!inv) return;
          const tax = Math.round(inv.base * (inv.gstRate / 100));
          document.getElementById('printableInvoiceArea').innerHTML = `
            <div class="flex justify-between border-b pb-3">
              <div><div class="font-bold text-lg">${appState.user.business}</div><div>GSTIN: ${appState.user.gstin}</div></div>
              <div class="text-right"><div class="font-bold">TAX INVOICE</div><div>${inv.id}</div></div>
            </div>
            <div><strong>Billed To:</strong> ${inv.client}</div>
            <div class="border-t border-b py-3 space-y-1">
              <div class="flex justify-between"><span>Taxable Value</span><span>${formatINR(inv.base)}</span></div>
              <div class="flex justify-between"><span>GST (${inv.gstRate}%)</span><span>${formatINR(tax)}</span></div>
              <div class="flex justify-between font-bold text-base pt-2 border-t"><span>Grand Total</span><span>${formatINR(inv.base + tax)}</span></div>
            </div>
            <div class="text-xs text-slate-600">Pay via UPI: ${appState.user.bank} · Generated by BizBuddy Spatial OS</div>
          `;
          document.getElementById('invoicePreviewModal')?.classList.remove('hidden');
        }
      });

      document.getElementById('closeInvoicePreviewBtn')?.addEventListener('click', () => document.getElementById('invoicePreviewModal')?.classList.add('hidden'));
      document.getElementById('downloadInvoiceFileBtn')?.addEventListener('click', () => window.print());

      document.getElementById('addSkuForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        appState.inventory.unshift({
          sku: 'SKU-' + Math.floor(100 + Math.random() * 900),
          name: document.getElementById('skuName').value.trim(),
          qty: Number(document.getElementById('skuQty').value),
          price: Number(document.getElementById('skuPrice').value)
        });
        e.target.reset();
        renderDashboardData();
      });

      document.getElementById('inventoryListWrap')?.addEventListener('click', (e) => {
        const inc = e.target.closest('[data-sku-inc]');
        const dec = e.target.closest('[data-sku-dec]');
        if (inc) { appState.inventory[Number(inc.dataset.skuInc)].qty++; renderDashboardData(); }
        if (dec) { const it = appState.inventory[Number(dec.dataset.skuDec)]; it.qty = Math.max(0, it.qty - 1); renderDashboardData(); }
      });

      document.getElementById('customerListWrap')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-settle-cust]');
        if (btn) { appState.customers[Number(btn.dataset.settleCust)].due = 0; renderDashboardData(); }
      });

      document.getElementById('fileGstr3bBtn')?.addEventListener('click', () => document.getElementById('gstr3bStatus')?.classList.remove('hidden'));
      document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
        const rows = ['Type,Description,Amount_INR', ...appState.ledger.map((l) => `${l.type},"${l.title}",${l.amount}`)].join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
        a.download = 'bizbuddy-transactions.csv';
        a.click();
      });

      // ---------------------------------------------------------
      // FLOATING 3D SPHERE AI ASSISTANT (FIXED VIEWPORT PIN + FREE 360° DRAG)
      // ---------------------------------------------------------
      const floatingAiContainer = document.getElementById('floatingAiContainer');
      const aiSphereTriggerBtn = document.getElementById('aiSphereTriggerBtn');
      const aiCrystalSphere = document.getElementById('aiCrystalSphere');
      const aiAssistantDrawer = document.getElementById('aiAssistantDrawer');
      const closeAiDrawerBtn = document.getElementById('closeAiDrawerBtn');
      const floatingAiFeed = document.getElementById('floatingAiFeed');
      const dashAiMessages = document.getElementById('dashAiMessages');

      // Clamp & apply fixed viewport coordinates for the 3D AI Sphere
      function clampSpherePosition(left, top) {
        const margin = 12;
        const size = 74;
        const maxLeft = Math.max(margin, window.innerWidth - size - margin);
        const maxTop = Math.max(margin, window.innerHeight - size - margin);
        return {
          left: Math.min(maxLeft, Math.max(margin, left)),
          top: Math.min(maxTop, Math.max(margin, top))
        };
      }

      function positionDrawerRelativeToSphere() {
        if (!floatingAiContainer || !aiAssistantDrawer || aiAssistantDrawer.classList.contains('hidden')) return;
        const sphereRect = floatingAiContainer.getBoundingClientRect();
        const drawerWidth = Math.min(395, window.innerWidth - 24);
        const drawerHeight = aiAssistantDrawer.offsetHeight || 430;
        const gap = 14;
        const margin = 12;

        // Place drawer above sphere if sphere is in lower half, otherwise below sphere
        let top = sphereRect.top > window.innerHeight * 0.52
          ? sphereRect.top - drawerHeight - gap
          : sphereRect.bottom + gap;
        top = Math.min(window.innerHeight - drawerHeight - margin, Math.max(margin, top));

        // Align horizontally with sphere while keeping inside viewport edges
        let left = sphereRect.left + sphereRect.width / 2 - drawerWidth / 2;
        left = Math.min(window.innerWidth - drawerWidth - margin, Math.max(margin, left));

        aiAssistantDrawer.style.left = `${Math.round(left)}px`;
        aiAssistantDrawer.style.top = `${Math.round(top)}px`;
      }

      function setSphereFixedCoords(left, top, persist = true) {
        if (!floatingAiContainer) return;
        const clamped = clampSpherePosition(left, top);
        floatingAiContainer.style.right = 'auto';
        floatingAiContainer.style.bottom = 'auto';
        floatingAiContainer.style.left = `${Math.round(clamped.left)}px`;
        floatingAiContainer.style.top = `${Math.round(clamped.top)}px`;
        positionDrawerRelativeToSphere();
        if (persist) {
          try { localStorage.setItem('bizbuddy_ai_sphere_pos', JSON.stringify(clamped)); } catch (_) {}
        }
      }

      // Restore saved sphere position or anchor cleanly to bottom-right of viewport
      (function initSpherePosition() {
        if (!floatingAiContainer) return;
        try {
          const savedPos = JSON.parse(localStorage.getItem('bizbuddy_ai_sphere_pos') || 'null');
          if (savedPos && typeof savedPos.left === 'number' && typeof savedPos.top === 'number') {
            setSphereFixedCoords(savedPos.left, savedPos.top, false);
            return;
          }
        } catch (_) {}
        setSphereFixedCoords(window.innerWidth - 96, window.innerHeight - 96, false);
      })();

      window.addEventListener('resize', () => {
        if (!floatingAiContainer) return;
        const rect = floatingAiContainer.getBoundingClientRect();
        setSphereFixedCoords(rect.left, rect.top, false);
      });

      // Smooth Mouse & Touch Dragging with Click-vs-Drag Threshold
      let sphereDrag = {
        active: false,
        moved: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        origLeft: 0,
        origTop: 0
      };

      if (aiSphereTriggerBtn && floatingAiContainer) {
        aiSphereTriggerBtn.addEventListener('pointerdown', (e) => {
          if (e.button !== 0 && e.pointerType === 'mouse') return;
          const rect = floatingAiContainer.getBoundingClientRect();
          sphereDrag = {
            active: true,
            moved: false,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            origLeft: rect.left,
            origTop: rect.top
          };
          floatingAiContainer.classList.add('is-dragging');
          try { aiSphereTriggerBtn.setPointerCapture(e.pointerId); } catch (_) {}
        });

        aiSphereTriggerBtn.addEventListener('pointermove', (e) => {
          if (sphereDrag.active && e.pointerId === sphereDrag.pointerId) {
            const dx = e.clientX - sphereDrag.startX;
            const dy = e.clientY - sphereDrag.startY;
            if (!sphereDrag.moved && Math.hypot(dx, dy) > 6) {
              sphereDrag.moved = true;
            }
            if (sphereDrag.moved) {
              setSphereFixedCoords(sphereDrag.origLeft + dx, sphereDrag.origTop + dy, false);
            }
            return;
          }
          // Subtle 3D specular tilt when hovering without dragging
          if (!motionEnabled || !aiCrystalSphere) return;
          const r = aiSphereTriggerBtn.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          aiCrystalSphere.style.animation = 'none';
          aiCrystalSphere.style.transform = `perspective(700px) rotateX(${(-ny * 36).toFixed(1)}deg) rotateY(${(nx * 38).toFixed(1)}deg) scale(1.12)`;
        });

        const endSpherePointer = (e) => {
          if (!sphereDrag.active || e.pointerId !== sphereDrag.pointerId) return;
          const wasDragged = sphereDrag.moved;
          sphereDrag.active = false;
          floatingAiContainer.classList.remove('is-dragging');
          try { aiSphereTriggerBtn.releasePointerCapture(e.pointerId); } catch (_) {}
          if (wasDragged) {
            const rect = floatingAiContainer.getBoundingClientRect();
            setSphereFixedCoords(rect.left, rect.top, true);
          } else {
            toggleFloatingAiDrawer();
          }
        };

        aiSphereTriggerBtn.addEventListener('pointerup', endSpherePointer);
        aiSphereTriggerBtn.addEventListener('pointercancel', endSpherePointer);
        aiSphereTriggerBtn.addEventListener('pointerleave', () => {
          if (sphereDrag.active || !aiCrystalSphere) return;
          aiCrystalSphere.style.transform = '';
          aiCrystalSphere.style.animation = '';
        });
      }

      function toggleFloatingAiDrawer(forceOpen) {
        const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : aiAssistantDrawer.classList.contains('hidden');
        aiAssistantDrawer.classList.toggle('hidden', !shouldOpen);
        if (shouldOpen) {
          requestAnimationFrame(positionDrawerRelativeToSphere);
        }
      }

      closeAiDrawerBtn?.addEventListener('click', () => toggleFloatingAiDrawer(false));
      document.getElementById('heroOpenAiBtn')?.addEventListener('click', () => toggleFloatingAiDrawer(true));
      document.getElementById('healthAiAdviceBtn')?.addEventListener('click', () => {
        toggleFloatingAiDrawer(true);
        askBizBuddyAI(`My Business Health Score is ${currentHealthScore}/100. Give me 3 actionable ways to push it above 95.`, floatingAiFeed);
      });

      function appendChatBubble(container, text, isUser) {
        if (!container) return;
        const div = document.createElement('div');
        div.className = isUser
          ? 'p-3 rounded-2xl bg-gradient-to-r from-orange-500/30 to-amber-500/20 border border-orange-400/40 text-white ml-8'
          : 'p-3 rounded-2xl bg-white/[0.07] border border-white/10 text-slate-200 mr-4 leading-relaxed';
        div.innerHTML = text.replace(/\n/g, '<br/>');
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div;
      }

      function generateSmartFallbackReply(prompt) {
        const p = prompt.toLowerCase();
        const rev = appState.ledger.filter((x) => x.type === 'income').reduce((s, x) => s + x.amount, 0);
        const exp = appState.ledger.filter((x) => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
        const dues = appState.customers.reduce((s, c) => s + c.due, 0);

        if (p.includes('health') || p.includes('score')) {
          return `📊 <strong>Business Health Score (${currentHealthScore}/100):</strong><br/>1. <strong>Collect Pending Dues (${formatINR(dues)}):</strong> Sending UPI intent links to Kaveri Retail Marts & Bharath Logistics boosts liquidity by +4 pts.<br/>2. <strong>Claim 100% GSTR-2B ITC:</strong> Ensure AWS & lease invoices are matched before the 20th.<br/>3. <strong>Maintain >30% Net Margin:</strong> Current net profit stands at <strong>${formatINR(rev - exp)}</strong>.`;
        }
        if (p.includes('gst') || p.includes('tax')) {
          return `🏛️ <strong>GST Summary & Optimization:</strong><br/>• Output GSTR-1 Tax: <strong>₹2,63,000</strong><br/>• Eligible GSTR-2B ITC: <strong>₹2,14,800</strong><br/>• Net Cash Payable: <strong>₹48,200</strong>.<br/>Tip: Reconcile any vendor bills before filing GSTR-3B on the 20th to save up to ₹18,500 in blocked credit.`;
        }
        if (p.includes('due') || p.includes('reminder') || p.includes('whatsapp')) {
          return `🤝 <strong>Pending Customer Dues (${formatINR(dues)}):</strong><br/><em>"Hi Team, gentle reminder from ${appState.user.business} regarding your pending invoice balance. Pay instantly via UPI: ${appState.user.bank}. Thank you!"</em>`;
        }
        return `✨ <strong>BizBuddy AI Snapshot (${appState.user.business}):</strong><br/>• Total Revenue: <strong>${formatINR(rev)}</strong><br/>• Total Expenses: <strong>${formatINR(exp)}</strong><br/>• Net Profit: <strong>${formatINR(rev - exp)}</strong><br/>• Health Score: <strong>${currentHealthScore}/100</strong>.<br/>Ask me about GST filing, profit margins, inventory restocking, or invoice drafting!`;
      }

      async function askBizBuddyAI(question, targetContainer) {
        appendChatBubble(targetContainer, question, true);
        const thinkingEl = appendChatBubble(targetContainer, '⏳ Analyzing live ledgers & GST telemetry...', false);

        const rev = appState.ledger.filter((x) => x.type === 'income').reduce((s, x) => s + x.amount, 0);
        const exp = appState.ledger.filter((x) => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
        const dues = appState.customers.reduce((s, c) => s + c.due, 0);

        const systemPrompt = `You are BizBuddy AI, an expert Indian Chartered Accountant, CFO, and GST Copilot for "${appState.user.business}" (GSTIN: ${appState.user.gstin}). Live metrics: Revenue ₹${rev}, Expenses ₹${exp}, Net Profit ₹${rev - exp}, Business Health Score ${currentHealthScore}/100, Pending Customer Dues ₹${dues}, Net GST Payable ₹48,200. Give concise, practical, bulleted advice in INR (₹).`;

        try {
          const apiKey = "";
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: question }] }],
              systemInstruction: { parts: [{ text: systemPrompt }] }
            })
          });
          if (!res.ok) throw new Error('API fallback');
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!reply) throw new Error('Empty reply');
          thinkingEl.innerHTML = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
        } catch (_) {
          thinkingEl.innerHTML = generateSmartFallbackReply(question);
        }
        targetContainer.scrollTop = targetContainer.scrollHeight;
      }

      document.getElementById('floatingAiForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const inp = document.getElementById('floatingAiInput');
        const q = inp.value.trim();
        if (!q) return;
        inp.value = '';
        askBizBuddyAI(q, floatingAiFeed);
      });

      document.querySelectorAll('.float-ai-chip').forEach((chip) => {
        chip.addEventListener('click', () => askBizBuddyAI(chip.textContent.trim(), floatingAiFeed));
      });

      document.getElementById('dashAiForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const inp = document.getElementById('dashAiInput');
        const q = inp.value.trim();
        if (!q) return;
        inp.value = '';
        askBizBuddyAI(q, dashAiMessages);
      });

      document.querySelectorAll('.dash-ai-prompt').forEach((btn) => {
        btn.addEventListener('click', () => askBizBuddyAI(btn.textContent.trim(), dashAiMessages));
      });

      // Support Form Feedback
      document.getElementById('supportForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('supName').value.trim();
        const topic = document.getElementById('supTopic').value;
        const fb = document.getElementById('supportFeedback');
        fb.textContent = `✓ Priority Ticket #BB-${Math.floor(1000 + Math.random() * 9000)} logged for ${name} (${topic}). A GST specialist will reach out within 4 minutes.`;
        fb.classList.remove('hidden');
        e.target.reset();
      });

      // ---------------------------------------------------------
      // ORIGINAL 3D SPATIAL CANVAS, COVERFLOW, FLIP CARDS, CUBE & MARKET INTEL
      // ---------------------------------------------------------
      const canvas = document.getElementById('spatial3DCanvas');
      const ctx = canvas ? canvas.getContext('2d') : null;
      let cw = 0, ch = 0, pointerNormX = 0, pointerNormY = 0, scrollRatio = 0;

      function resizeCanvas() {
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cw = window.innerWidth;
        ch = window.innerHeight;
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      if (canvas && ctx) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('pointermove', (e) => {
          pointerNormX = (e.clientX / Math.max(1, cw) - 0.5) * 2;
          pointerNormY = (e.clientY / Math.max(1, ch) - 0.5) * 2;
        }, { passive: true });
        window.addEventListener('scroll', () => {
          const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          scrollRatio = Math.min(1, Math.max(0, window.scrollY / docH));
        }, { passive: true });

        // 3D Floating Particles + 3D Golden Currency Coins/Rings
        const particles = Array.from({ length: 76 }, (_, i) => ({
          x: (Math.random() - 0.5) * 1500,
          y: (Math.random() - 0.5) * 1100,
          z: Math.random() * 950 + 140,
          r: Math.random() * 2.2 + 0.9,
          hue: i % 3 === 0 ? '251, 191, 36' : '249, 115, 22',
          speed: 0.3 + Math.random() * 0.55,
          isCoin: i % 11 === 0,
          spin: Math.random() * Math.PI * 2
        }));

        // 3D Crystalline Icosahedron Vertices & Edges
        const phi = (1 + Math.sqrt(5)) / 2;
        const icoVerts = [
          [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
          [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
          [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
        ];
        const icoEdges = [
          [0,11],[0,5],[0,1],[0,7],[0,10],[1,5],[5,11],[11,10],[10,7],[7,1],
          [3,9],[3,4],[3,2],[3,6],[3,8],[4,9],[9,8],[8,6],[6,2],[2,4],
          [1,9],[5,4],[11,2],[10,6],[7,8],[0,5],[1,8],[9,5],[4,11],[2,10]
        ];

        let knotAngle = 0;
        function renderSpatial3D() {
          ctx.clearRect(0, 0, cw, ch);
          const fov = 680;
          const centerX = cw * 0.5 + pointerNormX * 42;
          const centerY = ch * 0.45 + pointerNormY * 32;
          if (motionEnabled) knotAngle += 0.0052;

          const rotA = knotAngle + scrollRatio * 1.6 + pointerNormY * 0.42;
          const rotB = knotAngle * 0.75 + pointerNormX * 0.52;
          const cosA = Math.cos(rotA), sinA = Math.sin(rotA);
          const cosB = Math.cos(rotB), sinB = Math.sin(rotB);

          function project3D(x, y, z, zOffset = 520) {
            const y1 = y * cosA - z * sinA;
            const z1 = y * sinA + z * cosA;
            const x2 = x * cosB + z1 * sinB;
            const z2 = -x * sinB + z1 * cosB + zOffset;
            const scale = fov / Math.max(120, z2);
            return { x: centerX + x2 * scale, y: centerY + y1 * scale, scale, z: z2 };
          }

          // 1. Draw 3D Rotating Icosahedron Wireframe Core
          const icoRadius = Math.min(cw, ch) * 0.16;
          const projIco = icoVerts.map(([vx, vy, vz]) => project3D(vx * icoRadius, vy * icoRadius, vz * icoRadius, 560));
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.22)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let i = 0; i < icoEdges.length; i++) {
            const a = projIco[icoEdges[i][0]];
            const b = projIco[icoEdges[i][1]];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
          ctx.stroke();

          // Glowing Icosahedron Vertex Nodes
          for (let i = 0; i < projIco.length; i++) {
            const v = projIco[i];
            ctx.beginPath();
            ctx.arc(v.x, v.y, 2.6 * v.scale, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
            ctx.fill();
          }

          // 2. Draw 3D Torus-Knot Wireframe Ribbon (p=2, q=3)
          const steps = 150;
          const radiusScale = Math.min(cw, ch) * 0.27;
          ctx.beginPath();
          for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            const r = 2 + Math.cos(3 * t);
            const x = r * Math.cos(2 * t) * radiusScale * 0.45;
            const y = r * Math.sin(2 * t) * radiusScale * 0.45;
            const z = -Math.sin(3 * t) * radiusScale * 0.55;
            const p = project3D(x, y, z, 520);
            if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.24)';
          ctx.lineWidth = 1.35;
          ctx.stroke();

          // 3. Draw 3D Depth Particles & Spinning 3D Golden ₹ Rings
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (motionEnabled) {
              p.z -= p.speed;
              p.spin += 0.03;
              if (p.z < 120) p.z = 1080;
            }
            const scale = fov / p.z;
            const px = centerX + (p.x + pointerNormX * 55) * scale;
            const py = centerY + (p.y + pointerNormY * 45 - scrollRatio * 210) * scale;
            if (px < -30 || px > cw + 30 || py < -30 || py > ch + 30) continue;
            const alpha = Math.min(0.68, (1 - p.z / 1120) * 0.76);

            if (p.isCoin) {
              const rx = Math.max(2, 9 * scale * Math.abs(Math.cos(p.spin)));
              const ry = 9 * scale;
              ctx.beginPath();
              ctx.ellipse(px, py, rx, ry, 0.2, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(251, 191, 36, ${(alpha * 0.9).toFixed(2)})`;
              ctx.lineWidth = 1.3;
              ctx.stroke();
            } else {
              ctx.beginPath();
              ctx.arc(px, py, p.r * scale * 1.4, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${p.hue}, ${alpha.toFixed(2)})`;
              ctx.fill();
            }
          }
          requestAnimationFrame(renderSpatial3D);
        }
        requestAnimationFrame(renderSpatial3D);
      }

      // ---------------------------------------------------------
      // iOS 26 / visionOS LIQUID GLASS PHYSICS CURSOR + 3D PRISM PARALLAX
      // ---------------------------------------------------------
      (function initIosLiquidCursorAndPrisms() {
        const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const lens = document.getElementById('iosGlassLens');
        const core = document.getElementById('iosCursorCore');
        const droplets = Array.from(document.querySelectorAll('.ios-trail-droplet'));
        const prismRig = document.getElementById('spatialPrismRig');

        // Parallax 3D Floating Prisms on Mouse & Scroll
        let prismCurX = 0, prismCurY = 0;
        function updatePrismParallax() {
          if (prismRig && motionEnabled) {
            prismCurX += (pointerNormX - prismCurX) * 0.06;
            prismCurY += (pointerNormY - prismCurY) * 0.06;
            prismRig.style.transform = `rotateY(${(prismCurX * 8).toFixed(2)}deg) rotateX(${(-prismCurY * 6).toFixed(2)}deg) translateY(${(-scrollRatio * 90).toFixed(1)}px)`;
          }
          requestAnimationFrame(updatePrismParallax);
        }
        requestAnimationFrame(updatePrismParallax);

        // Apply 3D Perspective Tilt to Health Score, Trust & Dashboard Cards
        document.querySelectorAll('.liquid-glass:not(.bento-face)').forEach((card) => {
          if (card.closest('#heroStage') || card.closest('.coverflow-stage') || card.closest('.cube-scene')) return;
          card.classList.add('spatial-tilt-3d');
          card.addEventListener('pointermove', (e) => {
            if (!motionEnabled) return;
            const r = card.getBoundingClientRect();
            const nx = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
            const ny = (e.clientY - r.top) / Math.max(1, r.height) - 0.5;
            card.style.transform = `perspective(1200px) rotateX(${(-ny * 4.5).toFixed(2)}deg) rotateY(${(nx * 4.5).toFixed(2)}deg)`;
          });
          card.addEventListener('pointerleave', () => {
            card.style.transform = '';
          });
        });

        if (!isFinePointer || !lens || !core) return;
        htmlEl.classList.add('ios-cursor-active');

        const cursor = {
          tx: -200, ty: -200,
          x: -200, y: -200,
          vx: 0, vy: 0,
          w: 34, h: 34,
          tw: 34, th: 34,
          radius: '9999px',
          hoveredEl: null,
          visible: false
        };

        const trailState = droplets.map(() => ({ x: -200, y: -200 }));

        // Interactive Selectors for iOS / visionOS Magnetic Pointer Morphing
        const interactiveSelector = 'button, a, input, select, summary, [role="button"], .cat-pill, .mi-chip, .mi-seg-btn, .dash-nav-item';

        document.addEventListener('pointermove', (e) => {
          if (e.pointerType !== 'mouse') return;
          cursor.tx = e.clientX;
          cursor.ty = e.clientY;
          if (!cursor.visible) {
            cursor.visible = true;
            cursor.x = e.clientX;
            cursor.y = e.clientY;
            trailState.forEach((t) => { t.x = e.clientX; t.y = e.clientY; });
            lens.classList.add('is-visible');
            core.classList.add('is-visible');
          }

          const target = e.target.closest ? e.target.closest(interactiveSelector) : null;
          if (target && !target.closest('#aiSphereTriggerBtn')) {
            cursor.hoveredEl = target;
            const r = target.getBoundingClientRect();
            const cs = getComputedStyle(target);
            // Magnetic center attraction (iPadOS / visionOS pointer lift)
            const centerX = r.left + r.width / 2;
            const centerY = r.top + r.height / 2;
            cursor.tx = centerX + (e.clientX - centerX) * 0.22;
            cursor.ty = centerY + (e.clientY - centerY) * 0.22;
            cursor.tw = Math.min(r.width + 8, 340);
            cursor.th = Math.min(r.height + 8, 120);
            cursor.radius = cs.borderRadius && cs.borderRadius !== '0px' ? cs.borderRadius : '16px';
            lens.classList.add('is-hugging');
            core.classList.add('is-hugging');
          } else {
            cursor.hoveredEl = null;
            cursor.tw = 34;
            cursor.th = 34;
            cursor.radius = '9999px';
            lens.classList.remove('is-hugging');
            core.classList.remove('is-hugging');
          }
        }, { passive: true });

        document.documentElement.addEventListener('pointerleave', () => {
          cursor.visible = false;
          lens.classList.remove('is-visible');
          core.classList.remove('is-visible');
          droplets.forEach((d) => { d.style.opacity = '0'; });
        });

        // Click Shockwave & Liquid Glass Splash
        document.addEventListener('pointerdown', (e) => {
          if (e.pointerType !== 'mouse' || !motionEnabled) return;
          const layer = document.getElementById('iosLiquidCursorLayer');
          const wave = document.createElement('div');
          wave.className = 'ios-click-wave';
          wave.style.setProperty('--wx', `${e.clientX}px`);
          wave.style.setProperty('--wy', `${e.clientY}px`);
          layer?.appendChild(wave);
          wave.addEventListener('animationend', () => wave.remove());

          // Spawn organic transparent liquid glass droplet ripple
          const drop = document.createElement('div');
          drop.className = 'liquid-spawn-drop';
          drop.style.setProperty('--sx', `${e.clientX}px`);
          drop.style.setProperty('--sy', `${e.clientY}px`);
          layer?.appendChild(drop);
          drop.addEventListener('animationend', () => drop.remove());
        });

        // Inject subtle transparent caustic refraction waves into Liquid Glass cards
        document.querySelectorAll('.liquid-glass').forEach((glassCard) => {
          if (glassCard.querySelector('.caustic-wave-overlay')) return;
          glassCard.classList.add('liquid-caustic-sheen');
          const caustic = document.createElement('div');
          caustic.className = 'caustic-wave-overlay';
          caustic.setAttribute('aria-hidden', 'true');
          glassCard.insertBefore(caustic, glassCard.firstChild);
        });

        function renderIosCursor() {
          if (cursor.visible && motionEnabled) {
            // Spring-damper interpolation for silky iOS physics
            const ax = (cursor.tx - cursor.x) * 0.24;
            const ay = (cursor.ty - cursor.y) * 0.24;
            cursor.vx = (cursor.vx + ax) * 0.68;
            cursor.vy = (cursor.vy + ay) * 0.68;
            cursor.x += cursor.vx;
            cursor.y += cursor.vy;

            cursor.w += (cursor.tw - cursor.w) * 0.24;
            cursor.h += (cursor.th - cursor.h) * 0.24;

            const speed = Math.hypot(cursor.vx, cursor.vy);
            const isHugging = Boolean(cursor.hoveredEl);
            const stretch = isHugging ? 0 : Math.min(speed * 0.028, 0.55);
            const angle = Math.atan2(cursor.vy, cursor.vx);

            lens.style.width = `${cursor.w.toFixed(1)}px`;
            lens.style.height = `${cursor.h.toFixed(1)}px`;
            lens.style.borderRadius = cursor.radius;
            lens.style.transform = `translate3d(${(cursor.x - cursor.w / 2).toFixed(1)}px, ${(cursor.y - cursor.h / 2).toFixed(1)}px, 0) rotate(${angle.toFixed(3)}rad) scale(${(1 + stretch).toFixed(3)}, ${(1 - stretch * 0.48).toFixed(3)}) rotate(${(-angle).toFixed(3)}rad)`;

            core.style.transform = `translate3d(${cursor.tx.toFixed(1)}px, ${cursor.ty.toFixed(1)}px, 0)`;

            // Update 5-node viscous liquid droplet trail
            let leadX = cursor.x;
            let leadY = cursor.y;
            for (let i = 0; i < trailState.length; i++) {
              const node = trailState[i];
              const el = droplets[i];
              const followFactor = 0.34 - i * 0.04;
              node.x += (leadX - node.x) * followFactor;
              node.y += (leadY - node.y) * followFactor;
              const dist = Math.hypot(leadX - node.x, leadY - node.y);
              const size = parseFloat(el.style.width);
              const nodeOpacity = isHugging ? 0 : Math.min(0.65, dist * 0.032) * (1 - i * 0.16);
              el.style.opacity = nodeOpacity.toFixed(2);
              el.style.transform = `translate3d(${(node.x - size / 2).toFixed(1)}px, ${(node.y - size / 2).toFixed(1)}px, 0)`;
              leadX = node.x;
              leadY = node.y;
            }
          }
          requestAnimationFrame(renderIosCursor);
        }
        requestAnimationFrame(renderIosCursor);
      })();

      // Navbar Logo 3D Tilt
      const brandLogoStage = document.getElementById('brandLogoStage');
      const brandLiquidIcon = document.getElementById('brandLiquidIcon');
      if (brandLogoStage && brandLiquidIcon) {
        brandLogoStage.addEventListener('pointermove', (e) => {
          if (!motionEnabled) return;
          const rect = brandLogoStage.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          brandLiquidIcon.style.animation = 'none';
          brandLiquidIcon.style.transform = `rotateX(${(-ny * 34).toFixed(1)}deg) rotateY(${(nx * 36).toFixed(1)}deg) scale(1.1)`;
        });
        brandLogoStage.addEventListener('pointerleave', () => {
          brandLiquidIcon.style.transform = '';
          brandLiquidIcon.style.animation = '';
        });
      }

      // 3D Motion Toggle
      const motionToggleBtn = document.getElementById('motionToggleBtn');
      const motionDot = document.getElementById('motionDot');
      if (motionToggleBtn) {
        motionToggleBtn.addEventListener('click', () => {
          motionEnabled = !motionEnabled;
          htmlEl.classList.toggle('reduced-motion', !motionEnabled);
          motionDot.className = motionEnabled ? 'w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'w-2 h-2 rounded-full bg-amber-400';
        });
      }

      // Specular Glare
      document.querySelectorAll('.glass-glare').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
      });

      // Hero Stage Parallax
      const heroStage = document.getElementById('heroStage');
      const heroRig = document.getElementById('heroRig');
      if (heroStage && heroRig) {
        heroStage.addEventListener('mousemove', (e) => {
          if (!motionEnabled) return;
          const rect = heroStage.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;
          heroRig.style.transform = `rotateX(${(-normY * 18).toFixed(2)}deg) rotateY(${(normX * 22).toFixed(2)}deg)`;
        });
        heroStage.addEventListener('mouseleave', () => { heroRig.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
      }

      // Coverflow Workflow Deck
      const cfItems = Array.from(document.querySelectorAll('.coverflow-item'));
      const cfDotsWrap = document.getElementById('cfDots');
      let cfIndex = 2, cfAutoOrbit = true;

      if (cfItems.length && cfDotsWrap) {
        cfItems.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'h-2 rounded-full transition-all cursor-pointer';
          dot.addEventListener('click', () => { cfIndex = idx; cfAutoOrbit = false; renderCoverflow(); });
          cfDotsWrap.appendChild(dot);
        });
      }

      function renderCoverflow() {
        const total = cfItems.length;
        if (!total) return;
        const spreadX = window.innerWidth < 640 ? 155 : 245;
        cfItems.forEach((item, i) => {
          let offset = i - cfIndex;
          if (offset > Math.floor(total / 2)) offset -= total;
          if (offset < -Math.floor(total / 2)) offset += total;
          const abs = Math.abs(offset);
          item.style.zIndex = String(20 - abs);
          item.style.opacity = String(abs > 2 ? 0 : Math.max(0.32, 1 - abs * 0.28));
          item.style.pointerEvents = abs > 2 ? 'none' : 'auto';
          item.style.transform = `translate3d(${offset * spreadX}px, 0px, ${-abs * 135}px) rotateY(${-offset * 28}deg) scale(${Math.max(0.72, 1 - abs * 0.11)})`;
          item.style.borderColor = offset === 0 ? 'rgba(249, 115, 22, 0.72)' : 'rgba(255, 255, 255, 0.16)';
        });
        if (cfDotsWrap) {
          Array.from(cfDotsWrap.children).forEach((dot, idx) => {
            dot.className = idx === cfIndex ? 'w-7 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all cursor-pointer' : 'w-2 h-2 rounded-full bg-white/25 transition-all cursor-pointer';
          });
        }
      }
      cfItems.forEach((item, idx) => item.addEventListener('click', () => { cfIndex = idx; cfAutoOrbit = false; renderCoverflow(); }));
      document.getElementById('cfPrevBtn')?.addEventListener('click', () => { cfIndex = (cfIndex - 1 + cfItems.length) % cfItems.length; cfAutoOrbit = false; renderCoverflow(); });
      document.getElementById('cfNextBtn')?.addEventListener('click', () => { cfIndex = (cfIndex + 1) % cfItems.length; cfAutoOrbit = false; renderCoverflow(); });
      document.getElementById('cfOrbitBtn')?.addEventListener('click', (e) => { cfAutoOrbit = !cfAutoOrbit; e.target.textContent = cfAutoOrbit ? 'Auto-Orbit: On' : 'Auto-Orbit: Off'; });
      renderCoverflow();
      window.addEventListener('resize', renderCoverflow);
      setInterval(() => { if (cfAutoOrbit && motionEnabled && !inDashboard) { cfIndex = (cfIndex + 1) % cfItems.length; renderCoverflow(); } }, 3600);

      // Bento Flip Cards
      document.querySelectorAll('.bento-card').forEach((card) => {
        const applyCardTransform = (rotX = 0, rotY = 0, lift = 0) => {
          const baseFlip = card.dataset.flipped === 'true' ? 180 : 0;
          card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${(baseFlip + rotY).toFixed(2)}deg) translateY(${lift}px)`;
        };
        card.addEventListener('mousemove', (e) => {
          if (!motionEnabled) return;
          card.classList.add('tilting');
          const rect = card.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;
          applyCardTransform(-normY * 12, normX * 12, -4);
        });
        card.addEventListener('mouseleave', () => { card.classList.remove('tilting'); applyCardTransform(0, 0, 0); });
        card.addEventListener('click', () => { card.classList.remove('tilting'); card.dataset.flipped = String(card.dataset.flipped !== 'true'); applyCardTransform(0, 0, 0); });
      });

      // 3D Category Cube
      const cube = document.getElementById('categoryCube');
      const pills = document.querySelectorAll('.cat-pill');
      const faces = document.querySelectorAll('.cube-face');
      const resumeSpinBtn = document.getElementById('resumeCubeSpinBtn');
      const faceRotations = { front: { x: -10, y: 0 }, back: { x: -10, y: 180 }, right: { x: -10, y: -90 }, left: { x: -10, y: 90 }, top: { x: -90, y: 0 }, bottom: { x: 90, y: 0 } };
      let rotX = -12, rotY = -24, isDragging = false, autoSpin = true, startX = 0, startY = 0;

      function renderCube(smooth = false) {
        if (!cube) return;
        cube.style.transition = smooth ? 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
        cube.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      }
      function animateCubeLoop() {
        if (autoSpin && !isDragging && motionEnabled && !inDashboard) { rotY += 0.32; renderCube(false); }
        requestAnimationFrame(animateCubeLoop);
      }
      requestAnimationFrame(animateCubeLoop);

      if (cube) {
        cube.addEventListener('pointerdown', (e) => { isDragging = true; autoSpin = false; if (resumeSpinBtn) resumeSpinBtn.textContent = 'Resume Auto-Spin'; startX = e.clientX; startY = e.clientY; cube.setPointerCapture(e.pointerId); });
        cube.addEventListener('pointermove', (e) => { if (!isDragging) return; rotY += (e.clientX - startX) * 0.55; rotX = Math.max(-85, Math.min(85, rotX - (e.clientY - startY) * 0.55)); startX = e.clientX; startY = e.clientY; renderCube(false); });
        cube.addEventListener('pointerup', (e) => { isDragging = false; try { cube.releasePointerCapture(e.pointerId); } catch (_) {} });
      }
      pills.forEach((pill) => {
        pill.addEventListener('click', () => {
          const faceKey = pill.dataset.face;
          const target = faceRotations[faceKey];
          if (!target) return;
          autoSpin = false;
          if (resumeSpinBtn) resumeSpinBtn.textContent = 'Resume Auto-Spin';
          rotX = target.x; rotY = target.y;
          faces.forEach((f) => f.classList.toggle('active-face', f.dataset.face === faceKey));
          pills.forEach((p) => {
            p.className = p.dataset.face === faceKey
              ? 'cat-pill active text-left p-3.5 rounded-2xl bg-orange-500/20 border border-orange-400/60 transition-all cursor-pointer'
              : 'cat-pill text-left p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 transition-all cursor-pointer';
          });
          renderCube(true);
        });
      });
      resumeSpinBtn?.addEventListener('click', () => { autoSpin = !autoSpin; resumeSpinBtn.textContent = autoSpin ? 'Auto-Spin Active' : 'Resume Auto-Spin'; });

      // Interactive 3D GST Calculator
      const amountInput = document.getElementById('gstAmountInput');
      const presetBtns = document.querySelectorAll('.preset-amt');
      const slabBtns = document.querySelectorAll('.slab-btn');
      const modeIntraBtn = document.getElementById('modeIntra');
      const modeInterBtn = document.getElementById('modeInter');
      let currentAmount = 125000, currentRate = 18, isInterState = false;

      function updateGSTEngine() {
        const outBaseEl = document.getElementById('outBase');
        if (!outBaseEl) return;
        const base = Math.max(0, Number(currentAmount) || 0);
        const totalTax = (base * currentRate) / 100;
        const total = base + totalTax;
        outBaseEl.textContent = formatINR(base);
        document.getElementById('outTotal').textContent = formatINR(total);
        document.getElementById('slabBaseVal').textContent = formatINR(base);
        document.getElementById('slabTotalVal').textContent = formatINR(total);
        document.getElementById('slabRateTag').textContent = `${currentRate}% GST`;

        const slabTax1 = document.getElementById('slabTax1');
        const slabTax2 = document.getElementById('slabTax2');
        const slabTotal = document.getElementById('slabTotal');
        const zGap = 32 + currentRate * 0.95;

        if (!isInterState) {
          const halfRate = (currentRate / 2).toString().replace(/\.0$/, '');
          const halfTax = totalTax / 2;
          document.getElementById('lblTax1').textContent = `CGST (${halfRate}%)`;
          document.getElementById('outTax1').textContent = formatINR(halfTax);
          document.getElementById('lblTax2').textContent = `SGST (${halfRate}%)`;
          document.getElementById('outTax2').textContent = formatINR(halfTax);
          document.getElementById('boxTax2').classList.remove('opacity-40');
          document.getElementById('slabTax1Lbl').textContent = `CGST (${halfRate}%)`;
          document.getElementById('slabTax1Val').textContent = `+${formatINR(halfTax)}`;
          document.getElementById('slabTax2Lbl').textContent = `SGST (${halfRate}%)`;
          document.getElementById('slabTax2Val').textContent = `+${formatINR(halfTax)}`;
          slabTax1.style.transform = `translateZ(${zGap}px)`;
          slabTax2.style.opacity = '1';
          slabTax2.style.transform = `translateZ(${zGap * 2}px)`;
          slabTotal.style.transform = `translateZ(${zGap * 3}px)`;
        } else {
          document.getElementById('lblTax1').textContent = `IGST (${currentRate}%)`;
          document.getElementById('outTax1').textContent = formatINR(totalTax);
          document.getElementById('lblTax2').textContent = 'SGST (N/A)';
          document.getElementById('outTax2').textContent = '₹0';
          document.getElementById('boxTax2').classList.add('opacity-40');
          document.getElementById('slabTax1Lbl').textContent = `IGST (${currentRate}%)`;
          document.getElementById('slabTax1Val').textContent = `+${formatINR(totalTax)}`;
          slabTax1.style.transform = `translateZ(${zGap * 1.2}px)`;
          slabTax2.style.opacity = '0.12';
          slabTax2.style.transform = `translateZ(${zGap * 1.3}px) scale(0.95)`;
          slabTotal.style.transform = `translateZ(${zGap * 2.4}px)`;
        }
      }

      amountInput?.addEventListener('input', (e) => { currentAmount = parseFloat(e.target.value) || 0; updateGSTEngine(); });
      presetBtns.forEach((btn) => btn.addEventListener('click', () => { currentAmount = Number(btn.dataset.amount); amountInput.value = currentAmount; updateGSTEngine(); }));
      slabBtns.forEach((btn) => btn.addEventListener('click', () => {
        currentRate = Number(btn.dataset.rate);
        slabBtns.forEach((b) => {
          b.className = b === btn
            ? 'slab-btn keep-white py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 border border-white/30 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all cursor-pointer'
            : 'slab-btn py-2.5 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 text-slate-300 transition-all cursor-pointer';
        });
        updateGSTEngine();
      }));
      modeIntraBtn?.addEventListener('click', () => { isInterState = false; modeIntraBtn.className = 'py-2 px-2 rounded-lg text-xs font-bold bg-white/15 text-white border border-white/20 cursor-pointer'; modeInterBtn.className = 'py-2 px-2 rounded-lg text-xs font-bold text-slate-400 cursor-pointer'; updateGSTEngine(); });
      modeInterBtn?.addEventListener('click', () => { isInterState = true; modeInterBtn.className = 'py-2 px-2 rounded-lg text-xs font-bold bg-white/15 text-white border border-white/20 cursor-pointer'; modeIntraBtn.className = 'py-2 px-2 rounded-lg text-xs font-bold text-slate-400 cursor-pointer'; updateGSTEngine(); });
      updateGSTEngine();

      // Trial Signup Form
      document.getElementById('trialForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = document.getElementById('trialEmail').value.trim();
        if (!val) return;
        const fb = document.getElementById('trialFeedback');
        fb.textContent = `Workspace provisioned for ${val}! Check your inbox for your instant BizBuddy Pro magic link.`;
        fb.classList.remove('hidden');
        document.getElementById('trialEmail').value = '';
      });

      // Market Intelligence Studio (2017-2026)
      (function initMarketIntel() {
        const el = (id) => document.getElementById(id);
        if (!el('miForm') || !el('miCanvas')) return;
        const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
        const SALES_SHOCK = [1, 1.01, 1, 0.97, 0.9, 1.04, 1.02, 1, 1];
        const VAL_SHOCK = [1, 1.07, 1.03, 0.86, 1.13, 1.08, 0.97, 1.05, 1];
        const COLORS = [{ rgb: [249, 115, 22], hex: '#F97316' }, { rgb: [251, 191, 36], hex: '#FBBF24' }, { rgb: [251, 113, 133], hex: '#FB7185' }, { rgb: [52, 211, 153], hex: '#34D399' }, { rgb: [56, 189, 248], hex: '#38BDF8' }];
        const DB = [
          { name: 'Information Technology (IT Services)', type: 'sector', kw: 'it software services tech saas', s0: 1000000, s1: 2400000, v0: 1100000, v1: 2900000, cov: 0.3, gs: 0.06, gv: 0.08 },
          { name: 'Pharma & Healthcare', type: 'sector', kw: 'pharma medicine hospital health', s0: 230000, s1: 480000, v0: 500000, v1: 1500000, cov: 0.1, gs: 0.08, gv: 0.1 },
          { name: 'E-Commerce', type: 'sector', kw: 'ecommerce online retail marketplace', s0: 160000, s1: 1000000, v0: 80000, v1: 600000, cov: 0.2, gs: 0.17, gv: 0.2 },
          { name: 'Automobiles & EV', type: 'sector', kw: 'auto automobile car ev electric', s0: 640000, s1: 1500000, v0: 600000, v1: 2000000, cov: 1.3, gs: 0.08, gv: 0.06 },
          { name: 'Renewable Energy', type: 'sector', kw: 'renewable solar wind green energy', s0: 40000, s1: 240000, v0: 30000, v1: 600000, cov: 0.4, gs: 0.22, gv: 0.25 },
          { name: 'Reliance Industries', type: 'company', kw: 'reliance ril jio retail', s0: 300000, s1: 964000, v0: 330000, v1: 1700000, cov: 0.8, gs: 0.07, gv: 0.03 },
          { name: 'Tata Consultancy Services', type: 'company', kw: 'tcs tata it software', s0: 117966, s1: 255324, v0: 490000, v1: 1270000, cov: 0.2, gs: 0.06, gv: 0 },
          { name: 'Titan Company', type: 'company', kw: 'titan jewellery watches tanishq', s0: 14000, s1: 52000, v0: 40000, v1: 300000, cov: 1.2, gs: 0.18, gv: 0.12 }
        ];
        const mi = { mode: 'single', metric: 'sales', scale: 'abs', view: 'bars', items: [], yaw: -0.55, pitch: 0.55, anim: 1, animId: 0, hover: null, hit: [], dragging: false };
        const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
        const fmtN = (n) => Math.round(n).toLocaleString('en-IN');
        const fmtCr = (v) => v >= 1e5 ? '₹' + (v / 1e5).toFixed(2) + ' L Cr' : '₹' + fmtN(v) + ' Cr';
        const fmtPct = (p, d = 1) => (p > 0 ? '+' : '') + p.toFixed(d) + '%';
        const pctClass = (p) => (p >= 0 ? 'text-emerald-300' : 'text-rose-300');
        const yearLbl = (i) => (i === 9 ? '2026E' : String(YEARS[i]));

        function build(e) {
          const sales = [], val = [];
          for (let i = 0; i < 9; i++) {
            let s = e.s0 * Math.pow(e.s1 / e.s0, i / 8);
            let v = e.v0 * Math.pow(e.v1 / e.v0, i / 8);
            if (i > 0 && i < 8) { s *= (1 - (1 - SALES_SHOCK[i]) * e.cov); v *= (1 + (VAL_SHOCK[i] - 1) * 0.8); }
            sales.push(Math.round(s)); val.push(Math.round(v));
          }
          sales.push(Math.round(e.s1 * (1 + e.gs)));
          val.push(Math.round(e.v1 * (1 + e.gv)));
          return { name: e.name, type: e.type, sales, val };
        }
        const vals = (it) => (mi.metric === 'sales' ? it.sales : it.val);
        function stats(arr) {
          const yoy = arr.map((v, i) => (i ? (v / arr[i - 1] - 1) * 100 : null));
          let best = 1, worst = 1;
          for (let i = 1; i < arr.length; i++) { if (yoy[i] > yoy[best]) best = i; if (yoy[i] < yoy[worst]) worst = i; }
          return { yoy, best, worst, total: (arr[9] / arr[0] - 1) * 100, cagr: (Math.pow(arr[9] / arr[0], 1 / 9) - 1) * 100 };
        }
        function addEntry(entry) {
          if (mi.mode === 'single') { mi.items = [build(entry)]; return true; }
          if (mi.items.some((i) => i.name === entry.name) || mi.items.length >= 5) return false;
          mi.items.push(build(entry));
          return true;
        }
        function renderAll() {
          if (!mi.items.length) return;
          el('miTray').innerHTML = mi.items.map((it, idx) => `<span class="mi-chip is-selected"><span class="w-2 h-2 rounded-full" style="background:${COLORS[idx % 5].hex}"></span>${esc(it.name)}<button type="button" data-remove="${idx}" class="ml-1 cursor-pointer">×</button></span>`).join('');
          el('miQuick').innerHTML = DB.map((e) => `<button type="button" data-quick="${esc(e.name)}" class="mi-chip${mi.items.some((i) => i.name === e.name) ? ' is-selected' : ''}">${esc(e.name)}</button>`).join('');
          el('miHeadProject').textContent = el('miProject').value.trim() || 'Q4 Board Market Review';
          el('miHeadTopic').textContent = el('miTopic').value.trim() || '10-Year Growth Comparison · 2017–2026';
          el('miHeadMode').textContent = mi.mode === 'single' ? 'Single Item Mode' : `Multiple Items · ${mi.items.length}`;
          el('miHeadQuality').textContent = 'Indicative Reference Data · 2026E';
          const it = mi.items[0], arr = vals(it), st = stats(arr);
          el('miKpis').innerHTML = `
            <div class="liquid-glass rounded-[22px] p-4"><div class="text-[11px] text-slate-400">2026E Value</div><div class="text-xl font-extrabold text-white mt-1">${fmtCr(arr[9])}</div></div>
            <div class="liquid-glass rounded-[22px] p-4"><div class="text-[11px] text-slate-400">Total Growth</div><div class="text-xl font-extrabold ${pctClass(st.total)} mt-1">${fmtPct(st.total)}</div></div>
            <div class="liquid-glass rounded-[22px] p-4"><div class="text-[11px] text-slate-400">CAGR 2017–2026</div><div class="text-xl font-extrabold ${pctClass(st.cagr)} mt-1">${fmtPct(st.cagr, 2)}</div></div>
            <div class="liquid-glass rounded-[22px] p-4"><div class="text-[11px] text-slate-400">Peak Year</div><div class="text-xl font-extrabold text-emerald-300 mt-1">${yearLbl(st.best)}</div></div>`;
          el('miChartTitle').textContent = `${mi.metric === 'sales' ? 'Sales / Market Size' : 'Valuation'} · ${mi.items.map((x) => x.name).join(' vs ')}`;
          let tbl = `<table class="mi-table w-full text-sm text-slate-200"><thead class="text-[11px] uppercase text-slate-400"><tr><th>Year</th>${mi.items.map((x) => `<th>${esc(x.name)} (₹ Cr)</th>`).join('')}</tr></thead><tbody>`;
          for (let i = 0; i < 10; i++) tbl += `<tr><td class="font-bold text-white">${yearLbl(i)}</td>${mi.items.map((x) => `<td>${fmtN(vals(x)[i])}</td>`).join('')}</tr>`;
          el('miTableWrap').innerHTML = tbl + '</tbody></table>';
          draw();
        }
        function draw() {
          const cv = el('miCanvas'), dpr = Math.min(window.devicePixelRatio || 1, 2);
          const w = cv.clientWidth, h = cv.clientHeight;
          if (!w || !h || !mi.items.length) return;
          cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
          const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
          const M = mi.items.length, N = 10;
          const series = mi.items.map((it) => { const a = vals(it); return mi.scale === 'idx' ? a.map((v) => (v / a[0]) * 100) : a; });
          const maxV = Math.max(...series.flat());
          const S = Math.min(w / 13.5, h / 8), cx = w / 2, cy = h * 0.68, D = 26;
          const cyw = Math.cos(mi.yaw), syw = Math.sin(mi.yaw), cp = Math.cos(mi.pitch), sp = Math.sin(mi.pitch);
          const P = (x, y, z) => { const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw, y2 = y * cp + z1 * sp, z2 = -y * sp + z1 * cp, k = D / (D + z2); return { x: cx + x1 * S * k, y: cy - y2 * S * k }; };
          for (let j = 0; j < M; j++) {
            const col = COLORS[j % 5].hex;
            for (let i = 0; i < N; i++) {
              const hh = Math.max(0.1, (series[j][i] / maxV) * 4.4);
              const x = i - 4.5, z = (j - (M - 1) / 2) * 1.4;
              const p0 = P(x - 0.3, 0, z), p1 = P(x + 0.3, 0, z), p2 = P(x + 0.3, hh, z), p3 = P(x - 0.3, hh, z);
              c.beginPath(); c.moveTo(p0.x, p0.y); c.lineTo(p1.x, p1.y); c.lineTo(p2.x, p2.y); c.lineTo(p3.x, p3.y); c.closePath();
              c.fillStyle = col + 'CC'; c.fill(); c.strokeStyle = 'rgba(255,255,255,0.4)'; c.stroke();
            }
          }
        }
        el('miForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const q = el('miSearch').value.trim().toLowerCase();
          const match = DB.find((d) => d.name.toLowerCase().includes(q) || d.kw.includes(q)) || DB[0];
          addEntry(match); el('miSearch').value = ''; renderAll();
        });
        el('miQuick').addEventListener('click', (e) => {
          const b = e.target.closest('[data-quick]');
          if (!b) return;
          const entry = DB.find((d) => d.name === b.dataset.quick);
          if (entry) { addEntry(entry); renderAll(); }
        });
        el('miTray').addEventListener('click', (e) => {
          const b = e.target.closest('[data-remove]');
          if (b && mi.items.length > 1) { mi.items.splice(Number(b.dataset.remove), 1); renderAll(); }
        });
        el('miModeSeg').addEventListener('click', (e) => {
          const b = e.target.closest('.mi-seg-btn');
          if (!b) return;
          mi.mode = b.dataset.value;
          el('miModeSeg').querySelectorAll('.mi-seg-btn').forEach((x) => x.classList.toggle('is-active', x === b));
          if (mi.mode === 'single') mi.items = mi.items.slice(0, 1);
          renderAll();
        });
        el('miMetricSeg').addEventListener('click', (e) => {
          const b = e.target.closest('.mi-seg-btn');
          if (!b) return;
          mi.metric = b.dataset.value;
          el('miMetricSeg').querySelectorAll('.mi-seg-btn').forEach((x) => x.classList.toggle('is-active', x === b));
          renderAll();
        });
        el('miScaleSeg').addEventListener('click', (e) => {
          const b = e.target.closest('.mi-seg-btn');
          if (!b) return;
          mi.scale = b.dataset.value;
          el('miScaleSeg').querySelectorAll('.mi-seg-btn').forEach((x) => x.classList.toggle('is-active', x === b));
          renderAll();
        });
        el('miResetView').addEventListener('click', () => { mi.yaw = -0.55; mi.pitch = 0.55; draw(); });
        el('miList').innerHTML = DB.map((d) => `<option value="${esc(d.name)}"></option>`).join('');
        addEntry(DB[0]);
        renderAll();
      })();

      // Scroll Reveal Observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));
    })();

  (async function () {
    try {
      // The APK already serves its assets offline; its virtual host has no SW server.
      if (location.hostname === 'appassets.androidplatform.net' ||
          (location.protocol !== 'https:' && location.protocol !== 'http:') ||
          !window.isSecureContext || !('serviceWorker' in navigator)) return;
      await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      // Registration is optional. Neither a thrown error nor a rejected promise blocks startup.
    }
  })();
