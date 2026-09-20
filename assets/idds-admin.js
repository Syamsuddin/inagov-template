/**
 * IDDS Admin Dashboard JavaScript Toolkit — idds-ui-pack 1.3.0
 * Tanpa dependensi. Semua warna chart dibaca dari token CSS (computed),
 * sehingga ikut berubah saat tema/brand diganti.
 *
 * Modul: Theme & Brand · Sidebar · Dropdown · Modal · Tabs · Search (Ctrl+K)
 *        Toast · Chart (line/bar/donut, data-*) · Accordion · Tooltip (CSS)
 *        OTP · Password (meter/show) · Stepper · Dropzone · Tabel (sort,
 *        filter, bulk) · Chat · Mail · Card collapse · Alert dismiss
 *
 * API global: window.InaToast, window.InaModal, window.InaChart
 */
(function () {
  'use strict';

  var STORAGE = { theme: 'idds-theme', brand: 'idds-brand', sidebar: 'idds-sidebar' };
  var BRANDS = ['hss', 'inagov', 'panrb', 'bkn', 'lan', 'inapas', 'inaku', 'bgn'];

  /* ---- helpers ---- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  // Basis relatif aset: dihitung dari src skrip ini agar laman di pages/<modul>/ tetap menemukan assets/
  var ASSET_BASE = (function () {
    var el = document.currentScript; var src = el ? (el.getAttribute('src') || '') : '';
    var i = src.indexOf('assets/'); return i >= 0 ? src.slice(0, i) : '';
  })();
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function debounce(fn, wait) {
    var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, wait); };
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c];
    });
  }
  function readJsonAttr(el, name, fallback) {
    var raw = el.getAttribute(name);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }
  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* private mode */ } }
  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  /* Peta peran warna → token semantik (dipakai chart & legend) */
  var ROLE_TOKEN = {
    brand: '--ina-background-brand',
    success: '--ina-content-positive',
    warning: '--ina-content-warning',
    danger: '--ina-content-negative',
    info: '--ina-content-guide',
    neutral: '--ina-stroke-secondary'
  };
  function roleColor(role) {
    // fallback: warna teks dokumen bila token tidak terdefinisi (tanpa hex literal)
    return cssVar(ROLE_TOKEN[role] || ROLE_TOKEN.brand) || getComputedStyle(document.body).color;
  }

  /* ============================================================
   * 1. Theme (Light/Dark) & Brand Switcher — persist ke localStorage
   * ============================================================ */
  function initThemeAndBrand() {
    var html = document.documentElement;
    var theme = load(STORAGE.theme) || html.getAttribute('data-theme') || 'light';
    var brand = load(STORAGE.brand) || html.getAttribute('data-brand') || 'hss';
    if (BRANDS.indexOf(brand) === -1) brand = 'hss';

    html.setAttribute('data-theme', theme);
    html.setAttribute('data-brand', brand);
    syncThemeIcons(theme);

    $$('.ina-brand-select').forEach(function (select) {
      select.value = brand;
      select.addEventListener('change', function () {
        var next = this.value;
        html.setAttribute('data-brand', next);
        store(STORAGE.brand, next);
        $$('.ina-brand-select').forEach(function (s) { s.value = next; });
        InaToast.show('Brand diubah ke ' + this.options[this.selectedIndex].text, 'info');
        setTimeout(InaChart.redrawAll, 120);
      });
    });

    $$('[data-toggle-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = (html.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        store(STORAGE.theme, next);
        syncThemeIcons(next);
        InaToast.show('Mode tampilan: ' + (next === 'dark' ? 'Gelap' : 'Terang'), 'info');
        setTimeout(InaChart.redrawAll, 120);
      });
    });
  }

  function syncThemeIcons(theme) {
    $$('[data-toggle-theme]').forEach(function (btn) {
      var sun = $('.ina-icon-sun', btn), moon = $('.ina-icon-moon', btn);
      if (sun) sun.style.display = theme === 'dark' ? '' : 'none';
      if (moon) moon.style.display = theme === 'dark' ? 'none' : '';
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  /* ============================================================
   * 2. Sidebar: collapse (desktop, persist), drawer (mobile), accordion menu
   * ============================================================ */
  function initSidebar() {
    var app = $('.ina-app');
    var sidebar = $('.ina-sidebar');
    var backdrop = $('.ina-sidebar-backdrop');
    if (!app || !sidebar) return;

    if (load(STORAGE.sidebar) === 'collapsed' && window.innerWidth > 1024) {
      app.classList.add('ina-sidebar-collapsed');
    }

    function openMobile(open) {
      sidebar.classList.toggle('ina-mobile-open', open);
      if (backdrop) backdrop.classList.toggle('ina-open', open);
    }

    $$('[data-toggle-sidebar], [data-toggle-sidebar-mobile]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (window.innerWidth > 1024 && btn.hasAttribute('data-toggle-sidebar')) {
          var collapsed = app.classList.toggle('ina-sidebar-collapsed');
          store(STORAGE.sidebar, collapsed ? 'collapsed' : 'expanded');
        } else {
          openMobile(!sidebar.classList.contains('ina-mobile-open'));
        }
      });
    });

    if (backdrop) backdrop.addEventListener('click', function () { openMobile(false); });

    // Menu berjenjang (accordion): hanya satu grup terbuka, kecuali yang aktif
    $$('.ina-nav-item[data-submenu] > .ina-nav-link').forEach(function (link) {
      link.setAttribute('aria-expanded', link.parentElement.classList.contains('ina-open') ? 'true' : 'false');
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var item = this.closest('.ina-nav-item');
        var willOpen = !item.classList.contains('ina-open');
        if (app.classList.contains('ina-sidebar-collapsed') && window.innerWidth > 1024) {
          app.classList.remove('ina-sidebar-collapsed');
          store(STORAGE.sidebar, 'expanded');
          willOpen = true;
        }
        item.classList.toggle('ina-open', willOpen);
        this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    // Buka otomatis grup yang memuat tautan aktif
    $$('.ina-submenu-link.ina-active').forEach(function (a) {
      var item = a.closest('.ina-nav-item');
      if (item) {
        item.classList.add('ina-open');
        var trig = $(':scope > .ina-nav-link', item);
        if (trig) { trig.classList.add('ina-active'); trig.setAttribute('aria-expanded', 'true'); }
      }
    });

    window.addEventListener('resize', debounce(function () {
      if (window.innerWidth > 1024) openMobile(false);
    }, 150));
  }

  /* ============================================================
   * 3. Dropdown
   * ============================================================ */
  function initDropdowns() {
    $$('[data-toggle-dropdown]').forEach(function (trigger) {
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var parent = this.closest('.ina-dropdown');
        if (!parent) return;
        var isOpen = parent.classList.contains('ina-open');
        closeAllDropdowns();
        parent.classList.toggle('ina-open', !isOpen);
        this.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });
    });
    document.addEventListener('click', closeAllDropdowns);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAllDropdowns(); });
  }
  function closeAllDropdowns() {
    $$('.ina-dropdown.ina-open').forEach(function (d) {
      d.classList.remove('ina-open');
      var t = $('[data-toggle-dropdown]', d);
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  /* ============================================================
   * 4. Modal — API InaModal.open(id) / close(id|el) / closeAll()
   * ============================================================ */
  var lastFocused = null;
  var InaModal = {
    open: function (id) {
      var el = typeof id === 'string' ? document.getElementById(id) : id;
      if (!el) return;
      lastFocused = document.activeElement;
      el.classList.add('ina-open');
      el.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var focusable = $('input:not([type=hidden]), select, textarea, button:not([data-modal-close])', el);
      setTimeout(function () { (focusable || el).focus && (focusable || el).focus(); }, 60);
    },
    close: function (id) {
      var el = typeof id === 'string' ? document.getElementById(id) : (id || $('.ina-modal-overlay.ina-open'));
      if (!el) return;
      el.classList.remove('ina-open');
      el.setAttribute('aria-hidden', 'true');
      if (!$('.ina-modal-overlay.ina-open')) document.body.style.overflow = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    },
    closeAll: function () {
      $$('.ina-modal-overlay.ina-open').forEach(function (m) { InaModal.close(m); });
    }
  };

  function initModals() {
    $$('.ina-modal-overlay').forEach(function (overlay) {
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.addEventListener('click', function (e) { if (e.target === this) InaModal.close(this); });
    });
    $$('[data-modal-target]').forEach(function (btn) {
      btn.addEventListener('click', function () { InaModal.open(this.getAttribute('data-modal-target')); });
    });
    $$('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { InaModal.close(this.closest('.ina-modal-overlay')); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var open = $$('.ina-modal-overlay.ina-open');
        if (open.length) InaModal.close(open[open.length - 1]);
      }
    });
  }

  /* ============================================================
   * 5. Tabs
   * ============================================================ */
  function initTabs() {
    $$('[data-tab-group]').forEach(function (group) {
      var buttons = $$('[data-tab-target]', group);
      group.setAttribute('role', 'tablist');
      buttons.forEach(function (btn) {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', btn.classList.contains('ina-active') ? 'true' : 'false');
        btn.addEventListener('click', function () {
          var targetId = this.getAttribute('data-tab-target');
          buttons.forEach(function (b) {
            b.classList.remove('ina-active');
            b.setAttribute('aria-selected', 'false');
            var c = document.getElementById(b.getAttribute('data-tab-target'));
            if (c) c.classList.remove('ina-active');
          });
          this.classList.add('ina-active');
          this.setAttribute('aria-selected', 'true');
          var active = document.getElementById(targetId);
          if (active) active.classList.add('ina-active');
          InaChart.redrawAll();
        });
      });
    });
  }

  /* ============================================================
   * 6. Pencarian global (Ctrl+K / Cmd+K) + filter tautan pintas
   * ============================================================ */
  function initSearchShortcut() {
    var modal = document.getElementById('searchModal');
    if (!modal) return;
    window.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        InaModal.open(modal);
      }
    });
    var input = $('input', modal);
    var items = $$('[data-search-item]', modal);
    if (input && items.length) {
      input.addEventListener('input', function () {
        var q = this.value.toLowerCase();
        items.forEach(function (it) {
          it.style.display = it.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
        });
      });
    }
  }

  /* ============================================================
   * 7. Toast — InaToast.show(pesan, tipe) ; tipe: info|success|warning|danger
   * ============================================================ */
  var InaToast = {
    show: function (message, type, duration) {
      type = type || 'info';
      duration = duration || 3500;
      var container = $('.ina-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'ina-toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
      }
      // Toast guide: "Batasi satu toast aktif dalam satu waktu" — yang lama diganti, bukan ditumpuk
      $$('.ina-toast', container).forEach(function (t) { t.remove(); });
      var toast = document.createElement('div');
      toast.className = 'ina-toast ina-toast-' + type;
      toast.setAttribute('role', 'status');
      toast.innerHTML = '<span>' + escapeHtml(message) + '</span>' +
        '<button type="button" class="ina-toast-close" aria-label="Tutup">' +
        '<svg class="ina-icon ina-icon-16" aria-hidden="true" viewBox="0 0 24 24"><path d="M18 6l-12 12M6 6l12 12"/></svg></button>';
      $('.ina-toast-close', toast).addEventListener('click', function () { toast.remove(); });
      container.appendChild(toast);
      setTimeout(function () {
        if (!toast.parentElement) return;
        toast.style.transition = 'opacity ' + (cssVar('--ina-duration-base') || '200ms') + ' ease';
        toast.style.opacity = '0';
        setTimeout(function () { toast.remove(); }, 220);
      }, duration);
      return toast;
    }
  };

  /* ============================================================
   * 8. Chart kanvas ringan — data via atribut:
   *    data-chart="line|bar|donut"
   *    data-labels='["Jan","Feb"]'
   *    data-series='[{"label":"Pagu","values":[1,2],"role":"brand"}]'   (line/bar)
   *    data-values='[45,25,20,10]' data-roles='["brand","success"]'     (donut)
   *    data-max="140"  (opsional; default = maks data dibulatkan)
   * ============================================================ */
  var DEFAULTS = {
    line: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      series: [{ label: 'Kunjungan', values: [45, 52, 58, 63, 72, 68, 85, 92, 88, 95, 105, 118], role: 'brand' }]
    },
    bar: {
      labels: ['Disdik', 'Dinkes', 'PUPR', 'Bapenda', 'Kominfo', 'Setda'],
      series: [
        { label: 'Pagu', values: [30, 45, 55, 70, 65, 80], role: 'brand' },
        { label: 'Realisasi', values: [25, 40, 50, 62, 58, 76], role: 'success' }
      ]
    },
    donut: { values: [45, 25, 20, 10], roles: ['brand', 'success', 'warning', 'danger'] }
  };

  function setupCanvas(canvas) {
    var parent = canvas.parentElement;
    var w = parent.clientWidth || 300;
    var h = parent.clientHeight || 240;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }

  function chartFont() {
    return (cssVar('--ina-type-caption-small-size') || '11px') + ' ' + (cssVar('--ina-font-family') || 'Inter, sans-serif');
  }

  function niceMax(v) {
    if (v <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / mag;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return step * mag;
  }

  function drawGrid(ctx, pad, w, h, maxVal, textColor, gridColor, steps) {
    steps = steps || 4;
    var gh = h - pad.top - pad.bottom;
    ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
    ctx.font = chartFont(); ctx.fillStyle = textColor; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (var i = 0; i <= steps; i++) {
      var y = pad.top + (gh / steps) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      var val = maxVal - (maxVal / steps) * i;
      ctx.fillText(formatNum(val), pad.left - 8, y);
    }
  }

  function formatNum(v) {
    if (Math.abs(v) >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'k';
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  }

  function drawLineChart(canvas) {
    var c = setupCanvas(canvas), ctx = c.ctx, w = c.w, h = c.h;
    var labels = readJsonAttr(canvas, 'data-labels', DEFAULTS.line.labels);
    var series = readJsonAttr(canvas, 'data-series', DEFAULTS.line.series);
    var gridColor = cssVar('--ina-stroke-primary'), textColor = cssVar('--ina-content-secondary');
    var pad = { top: 16, right: 16, bottom: 28, left: 40 };
    var gw = w - pad.left - pad.right, gh = h - pad.top - pad.bottom;
    var allMax = Math.max.apply(null, series.map(function (s) { return Math.max.apply(null, s.values); }));
    var maxVal = parseFloat(canvas.getAttribute('data-max')) || niceMax(allMax * 1.1);

    drawGrid(ctx, pad, w, h, maxVal, textColor, gridColor);

    var stepX = labels.length > 1 ? gw / (labels.length - 1) : gw;
    series.forEach(function (s, si) {
      var color = roleColor(s.role || ['brand', 'success', 'warning', 'info'][si % 4]);
      var pts = s.values.map(function (v, i) {
        return { x: pad.left + i * stepX, y: pad.top + gh - (v / maxVal) * gh };
      });
      // area
      if (s.fill !== false) {
        // area transparan lewat globalAlpha — warna tetap dari token, tanpa rgba literal
        ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = color; ctx.beginPath();
        pts.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
        ctx.lineTo(pts[pts.length - 1].x, h - pad.bottom); ctx.lineTo(pts[0].x, h - pad.bottom); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      // garis
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.beginPath();
      pts.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
      ctx.stroke();
      // titik
      ctx.fillStyle = color;
      pts.forEach(function (p) { ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill(); });
    });

    // label X (lewati bila terlalu rapat)
    ctx.fillStyle = textColor; ctx.font = chartFont(); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    var skip = Math.ceil((labels.length * 34) / gw);
    labels.forEach(function (l, i) { if (i % skip === 0) ctx.fillText(l, pad.left + i * stepX, h - 8); });
  }

  function drawBarChart(canvas) {
    var c = setupCanvas(canvas), ctx = c.ctx, w = c.w, h = c.h;
    var labels = readJsonAttr(canvas, 'data-labels', DEFAULTS.bar.labels);
    var series = readJsonAttr(canvas, 'data-series', DEFAULTS.bar.series);
    var gridColor = cssVar('--ina-stroke-primary'), textColor = cssVar('--ina-content-secondary');
    var pad = { top: 16, right: 16, bottom: 28, left: 40 };
    var gw = w - pad.left - pad.right, gh = h - pad.top - pad.bottom;
    var allMax = Math.max.apply(null, series.map(function (s) { return Math.max.apply(null, s.values); }));
    var maxVal = parseFloat(canvas.getAttribute('data-max')) || niceMax(allMax * 1.1);

    drawGrid(ctx, pad, w, h, maxVal, textColor, gridColor);

    var groupW = gw / labels.length;
    var gap = 4;
    var barW = Math.max(6, Math.min(28, (groupW * 0.7 - gap * (series.length - 1)) / series.length));
    var totalW = barW * series.length + gap * (series.length - 1);

    labels.forEach(function (lbl, i) {
      var x0 = pad.left + i * groupW + (groupW - totalW) / 2;
      series.forEach(function (s, si) {
        var color = roleColor(s.role || ['brand', 'success', 'warning', 'info'][si % 4]);
        var v = s.values[i] || 0;
        var bh = (v / maxVal) * gh;
        var x = x0 + si * (barW + gap), y = pad.top + gh - bh;
        ctx.fillStyle = color;
        roundRect(ctx, x, y, barW, bh, 3);
      });
      ctx.fillStyle = textColor; ctx.font = chartFont(); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(lbl, pad.left + i * groupW + groupW / 2, h - 8);
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath(); ctx.fill();
  }

  function drawDonutChart(canvas) {
    var parent = canvas.parentElement;
    var size = Math.min(parent.clientWidth || 180, parent.clientHeight || 180);
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size * dpr); canvas.height = Math.round(size * dpr);
    canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
    var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size);

    var values = readJsonAttr(canvas, 'data-values', DEFAULTS.donut.values);
    var roles = readJsonAttr(canvas, 'data-roles', DEFAULTS.donut.roles);
    var total = values.reduce(function (a, b) { return a + b; }, 0) || 1;
    var cx = size / 2, cy = size / 2, outer = size / 2 - 6, inner = outer * 0.66;
    var start = -Math.PI / 2;
    var gapAngle = 0.03;

    values.forEach(function (v, i) {
      var ang = (v / total) * Math.PI * 2;
      ctx.fillStyle = roleColor(roles[i] || 'neutral');
      ctx.beginPath();
      ctx.arc(cx, cy, outer, start + gapAngle / 2, start + ang - gapAngle / 2);
      ctx.arc(cx, cy, inner, start + ang - gapAngle / 2, start + gapAngle / 2, true);
      ctx.closePath(); ctx.fill();
      start += ang;
    });

    // teks tengah
    var center = canvas.getAttribute('data-center');
    if (center) {
      ctx.fillStyle = cssVar('--ina-content-primary'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'bold ' + (cssVar('--ina-type-h4-size') || '20px') + ' ' + (cssVar('--ina-font-family') || 'sans-serif');
      ctx.fillText(center, cx, cy - 6);
      var sub = canvas.getAttribute('data-center-sub');
      if (sub) { ctx.fillStyle = cssVar('--ina-content-secondary'); ctx.font = chartFont(); ctx.fillText(sub, cx, cy + 12); }
    }
  }

  var InaChart = {
    redrawAll: function () {
      $$('canvas[data-chart]').forEach(function (canvas) {
        if (!canvas.offsetParent) return; // tersembunyi (tab nonaktif)
        var type = canvas.getAttribute('data-chart');
        if (type === 'line') drawLineChart(canvas);
        else if (type === 'bar') drawBarChart(canvas);
        else if (type === 'donut') drawDonutChart(canvas);
      });
    }
  };

  function initCharts() {
    InaChart.redrawAll();
    window.addEventListener('resize', debounce(InaChart.redrawAll, 200));
  }

  /* ============================================================
   * 9. Accordion generik (.ina-accordion-item > .ina-accordion-trigger)
   * ============================================================ */
  function initAccordions() {
    $$('.ina-accordion-trigger').forEach(function (trig) {
      var item = trig.closest('.ina-accordion-item');
      trig.setAttribute('aria-expanded', item.classList.contains('ina-open') ? 'true' : 'false');
      trig.addEventListener('click', function () {
        var acc = item.closest('.ina-accordion');
        var single = acc && acc.hasAttribute('data-single');
        var willOpen = !item.classList.contains('ina-open');
        if (single) $$('.ina-accordion-item', acc).forEach(function (i) {
          i.classList.remove('ina-open');
          $('.ina-accordion-trigger', i).setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('ina-open', willOpen);
        trig.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }

  /* ============================================================
   * 10. OTP 6 digit: auto-maju, backspace mundur, tempel, timer kirim ulang
   * ============================================================ */
  function initOtp() {
    var group = $('.ina-otp-group');
    if (!group) return;
    var inputs = $$('.ina-otp-input', group);
    inputs.forEach(function (inp, i) {
      inp.setAttribute('inputmode', 'numeric');
      inp.setAttribute('autocomplete', 'one-time-code');
      inp.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(-1);
        if (this.value && inputs[i + 1]) inputs[i + 1].focus();
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !this.value && inputs[i - 1]) { inputs[i - 1].focus(); inputs[i - 1].value = ''; e.preventDefault(); }
        if (e.key === 'ArrowLeft' && inputs[i - 1]) inputs[i - 1].focus();
        if (e.key === 'ArrowRight' && inputs[i + 1]) inputs[i + 1].focus();
      });
      inp.addEventListener('paste', function (e) {
        var text = (e.clipboardData ? e.clipboardData.getData('text') : '').replace(/\D/g, '');
        if (!text) return;
        e.preventDefault();
        text.split('').slice(0, inputs.length - i).forEach(function (ch, k) { inputs[i + k].value = ch; });
        var next = inputs[Math.min(i + text.length, inputs.length - 1)];
        next.focus();
      });
    });

    var timerEl = document.getElementById('otpTimer');
    var resendBtn = document.getElementById('otpResend');
    if (!timerEl) return;
    var total = parseInt(timerEl.getAttribute('data-seconds') || '60', 10);
    var left = total, handle;
    function render() {
      var m = Math.floor(left / 60), s = left % 60;
      timerEl.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      if (resendBtn) resendBtn.disabled = left > 0;
    }
    function tick() { left -= 1; render(); if (left <= 0) clearInterval(handle); }
    function start() { left = total; render(); clearInterval(handle); handle = setInterval(tick, 1000); }
    start();
    if (resendBtn) resendBtn.addEventListener('click', function () {
      InaToast.show('Kode OTP baru telah dikirim ulang.', 'success');
      inputs.forEach(function (x) { x.value = ''; }); inputs[0].focus(); start();
    });
  }

  /* ============================================================
   * 11. Kata sandi: meter kekuatan & tampil/sembunyi
   * ============================================================ */
  function passwordScore(v) {
    var s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v) && v.length >= 12) s++;
    return v.length ? Math.max(1, s) : 0;
  }
  function initPassword() {
    $$('[data-password-strength]').forEach(function (input) {
      var meter = document.getElementById(input.getAttribute('data-password-strength'));
      if (!meter) return;
      var label = $('[data-strength-label]', meter.parentElement) || document.getElementById(meter.id + 'Label');
      var names = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
      input.addEventListener('input', function () {
        var lvl = passwordScore(this.value);
        meter.setAttribute('data-level', String(lvl));
        if (label) label.textContent = this.value ? 'Kekuatan sandi: ' + names[lvl] : 'Minimal 8 karakter, kombinasi huruf besar, kecil, dan angka.';
      });
    });
    $$('[data-toggle-password]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById(this.getAttribute('data-toggle-password'));
        if (!input) return;
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        this.setAttribute('aria-pressed', show ? 'true' : 'false');
        this.setAttribute('aria-label', show ? 'Sembunyikan sandi' : 'Tampilkan sandi');
        var eye = $('.ina-icon-eye', this), off = $('.ina-icon-eye-off', this);
        if (eye) eye.style.display = show ? 'none' : '';
        if (off) off.style.display = show ? '' : 'none';
      });
    });
  }

  /* ============================================================
   * 12. Stepper wizard ([data-stepper] → .ina-step + .ina-step-panel)
   * ============================================================ */
  function initSteppers() {
    $$('[data-stepper]').forEach(function (root) {
      var steps = $$('.ina-step', root), panels = $$('.ina-step-panel', root);
      var idx = Math.max(0, steps.findIndex(function (s) { return s.classList.contains('ina-active'); }));
      function render() {
        steps.forEach(function (s, i) {
          s.classList.toggle('ina-active', i === idx);
          s.classList.toggle('ina-done', i < idx);
          var ind = $('.ina-step-indicator', s);
          if (ind) ind.innerHTML = i < idx ? '<svg class="ina-icon ina-icon-14" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12l5 5l10 -10"/></svg>' : String(i + 1);
        });
        panels.forEach(function (p, i) { p.classList.toggle('ina-active', i === idx); });
        $$('[data-step-prev]', root).forEach(function (b) { b.disabled = idx === 0; });
        $$('[data-step-next]', root).forEach(function (b) { b.textContent = idx === steps.length - 1 ? (b.getAttribute('data-finish-label') || 'Selesai') : (b.getAttribute('data-next-label') || 'Lanjut'); });
      }
      $$('[data-step-next]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          if (idx < steps.length - 1) { idx++; render(); }
          else InaToast.show(root.getAttribute('data-finish-message') || 'Pengajuan berhasil dikirim.', 'success');
        });
      });
      $$('[data-step-prev]', root).forEach(function (b) {
        b.addEventListener('click', function () { if (idx > 0) { idx--; render(); } });
      });
      render();
    });
  }

  /* ============================================================
   * 13. Dropzone berkas
   * ============================================================ */
  function formatBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(2) + ' MB';
  }
  function initDropzones() {
    $$('.ina-dropzone').forEach(function (zone) {
      var input = $('input[type=file]', zone);
      var list = document.getElementById(zone.getAttribute('data-file-list'));
      function addFiles(files) {
        Array.prototype.forEach.call(files, function (f) {
          if (!list) return;
          var item = document.createElement('div');
          item.className = 'ina-file-item';
          item.innerHTML =
            '<svg class="ina-icon ina-icon-20 ina-text-brand" aria-hidden="true" viewBox="0 0 24 24"><path d="M14 3v4a1 1 0 0 0 1 1h4M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/></svg>' +
            '<span class="ina-file-item-name">' + escapeHtml(f.name) + '</span>' +
            '<span class="ina-caption-small ina-tabular ina-text-muted">' + formatBytes(f.size) + '</span>' +
            '<button type="button" class="ina-alert-close" aria-label="Hapus berkas"><svg class="ina-icon ina-icon-16" aria-hidden="true" viewBox="0 0 24 24"><path d="M18 6l-12 12M6 6l12 12"/></svg></button>';
          $('button', item).addEventListener('click', function () { item.remove(); });
          list.appendChild(item);
        });
        if (files.length) InaToast.show(files.length + ' berkas ditambahkan ke antrean unggah.', 'success');
      }
      zone.addEventListener('click', function () { if (input) input.click(); });
      zone.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && input) { e.preventDefault(); input.click(); } });
      ['dragenter', 'dragover'].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('ina-dragover'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('ina-dragover'); });
      });
      zone.addEventListener('drop', function (e) { addFiles(e.dataTransfer.files); });
      if (input) input.addEventListener('change', function () { addFiles(this.files); this.value = ''; });
    });
  }

  /* ============================================================
   * 14. Tabel: pencarian, filter kolom, sort header, bulk checkbox
   * ============================================================ */
  function applyTableFilters(table) {
    if (!table) return;
    var scope = table.closest('.ina-card') || document;
    var search = ($('[data-table-search], #tableSearchInput', scope) || {}).value || '';
    var q = search.toLowerCase();
    var filters = $$('[data-table-filter]', scope).map(function (s) {
      return { col: parseInt(s.getAttribute('data-table-filter'), 10), val: s.value.toLowerCase() };
    }).filter(function (f) { return f.val; });
    var rows = $$('tbody tr:not(.ina-table-empty)', table);
    var visible = 0;
    rows.forEach(function (row) {
      var ok = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
      filters.forEach(function (f) {
        var cell = row.children[f.col];
        if (ok && cell && cell.textContent.toLowerCase().indexOf(f.val) === -1) ok = false;
      });
      row.style.display = ok ? '' : 'none';
      if (ok) visible++;
    });
    var empty = $('tbody .ina-table-empty', table);
    if (empty) empty.style.display = visible ? 'none' : '';
    var counter = $('[data-table-count]', scope);
    if (counter) counter.textContent = String(visible);
  }

  function sortTable(table, th) {
    var idx = Array.prototype.indexOf.call(th.parentElement.children, th);
    var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th[data-sort]', table).forEach(function (h) { h.removeAttribute('aria-sort'); });
    th.setAttribute('aria-sort', dir);
    var tbody = $('tbody', table);
    var rows = $$('tr:not(.ina-table-empty)', tbody);
    var type = th.getAttribute('data-sort');
    function key(row) {
      var cell = row.children[idx];
      var raw = (cell.getAttribute('data-value') || cell.textContent).trim();
      if (type === 'number') return parseFloat(raw.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0;
      return raw.toLowerCase();
    }
    rows.sort(function (a, b) {
      var ka = key(a), kb = key(b);
      var r = ka < kb ? -1 : ka > kb ? 1 : 0;
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
    var empty = $('.ina-table-empty', tbody);
    if (empty) tbody.appendChild(empty);
  }

  function updateBulkBar(table) {
    var scope = table.closest('.ina-card') || document;
    var bar = $('.ina-bulk-bar', scope);
    var checked = $$('.ina-table-row-checkbox:checked', table);
    $$('.ina-table-row-checkbox', table).forEach(function (cb) {
      var row = cb.closest('tr'); if (row) row.classList.toggle('ina-row-selected', cb.checked);
    });
    if (bar) {
      bar.classList.toggle('ina-open', checked.length > 0);
      var n = $('[data-bulk-count]', bar); if (n) n.textContent = String(checked.length);
    }
    var all = $('#selectAllRows, [data-select-all]', scope);
    if (all) {
      var total = $$('.ina-table-row-checkbox', table).length;
      all.indeterminate = checked.length > 0 && checked.length < total;
      all.checked = total > 0 && checked.length === total;
    }
  }

  function initTableInteractions() {
    $$('.ina-table').forEach(function (table) {
      var scope = table.closest('.ina-card') || document;

      $$('[data-table-search], #tableSearchInput', scope).forEach(function (inp) {
        inp.addEventListener('input', debounce(function () { applyTableFilters(table); }, 120));
      });
      $$('[data-table-filter]', scope).forEach(function (sel) {
        sel.addEventListener('change', function () { applyTableFilters(table); });
      });
      $$('th[data-sort]', table).forEach(function (th) {
        th.setAttribute('tabindex', '0');
        th.addEventListener('click', function () { sortTable(table, th); });
        th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sortTable(table, th); } });
      });

      var all = $('#selectAllRows, [data-select-all]', scope);
      if (all) all.addEventListener('change', function () {
        var on = this.checked;
        $$('.ina-table-row-checkbox', table).forEach(function (cb) {
          if (cb.closest('tr').style.display !== 'none') cb.checked = on;
        });
        updateBulkBar(table);
      });
      $$('.ina-table-row-checkbox', table).forEach(function (cb) {
        cb.addEventListener('change', function () { updateBulkBar(table); });
      });
      $$('[data-bulk-clear]', scope).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('.ina-table-row-checkbox', table).forEach(function (cb) { cb.checked = false; });
          updateBulkBar(table);
        });
      });
      $$('[data-bulk-delete]', scope).forEach(function (b) {
        b.addEventListener('click', function () {
          var n = $$('.ina-table-row-checkbox:checked', table).length;
          var modal = document.getElementById(b.getAttribute('data-bulk-delete'));
          var cnt = modal && $('[data-confirm-count]', modal);
          if (cnt) cnt.textContent = String(n);
          if (modal) InaModal.open(modal);
        });
      });
      $$('[data-confirm-delete]', document).forEach(function (b) {
        if (b.__inaBound) return; b.__inaBound = true;
        b.addEventListener('click', function () {
          var rows = $$('.ina-table-row-checkbox:checked', table).map(function (cb) { return cb.closest('tr'); });
          rows.forEach(function (r) { r.remove(); });
          updateBulkBar(table); applyTableFilters(table);
          InaModal.close(b.closest('.ina-modal-overlay'));
          InaToast.show(rows.length + ' data berhasil dihapus (simulasi).', 'success');
        });
      });
      // tombol hapus per baris
      $$('[data-row-delete]', table).forEach(function (b) {
        b.addEventListener('click', function () {
          var row = this.closest('tr');
          var modal = document.getElementById(this.getAttribute('data-row-delete'));
          if (!modal) { row.remove(); return; }
          var cnt = $('[data-confirm-count]', modal); if (cnt) cnt.textContent = '1';
          $$('.ina-table-row-checkbox', table).forEach(function (cb) { cb.checked = false; });
          var cb = $('.ina-table-row-checkbox', row); if (cb) cb.checked = true;
          updateBulkBar(table);
          InaModal.open(modal);
        });
      });
    });
  }

  /* ============================================================
   * 15. Chat: kirim pesan, balasan simulasi, ganti kontak, filter kontak
   * ============================================================ */
  function initChatApp() {
    var input = document.getElementById('chatMessageInput');
    var sendBtn = document.getElementById('chatSendBtn');
    var list = document.getElementById('chatMessages');
    if (!input || !sendBtn || !list) return;

    var REPLIES = [
      'Terima kasih atas informasinya. Dokumen sedang ditindaklanjuti oleh tim verifikator.',
      'Baik, kami catat. Mohon lampirkan berkas pendukung melalui e-Office.',
      'Siap, akan kami koordinasikan dengan bidang terkait hari ini.',
      'Diterima. Rapat lanjutan dijadwalkan pukul 14.00 WITA.'
    ];
    function timeNow() { return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); }
    function bubble(text, out, who) {
      var el = document.createElement('div');
      el.className = 'ina-message-bubble ' + (out ? 'ina-message-outgoing' : 'ina-message-incoming');
      el.innerHTML = (who && !out ? '<span class="ina-message-sender">' + escapeHtml(who) + '</span>' : '') +
        '<div class="ina-message-text">' + escapeHtml(text) + '</div>' +
        '<span class="ina-message-time">' + timeNow() + (out ? ' · Terkirim <svg class="ina-icon ina-icon-14" aria-hidden="true" viewBox="0 0 24 24"><path d="M7 12l5 5l10 -10M2 12l5 5m5 -5l5 -5"/></svg>' : '') + '</span>';
      list.appendChild(el); list.scrollTop = list.scrollHeight;
    }
    function send() {
      var text = input.value.trim(); if (!text) return;
      bubble(text, true); input.value = ''; input.focus();
      var typing = document.getElementById('chatTyping');
      if (typing) typing.classList.remove('ina-hidden');
      setTimeout(function () {
        if (typing) typing.classList.add('ina-hidden');
        var who = (document.getElementById('chatActiveUserName') || {}).textContent || 'Kontak';
        bubble(REPLIES[Math.floor(Math.random() * REPLIES.length)], false, who);
      }, 1200);
    }
    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

    var items = $$('.ina-chat-item');
    items.forEach(function (item) {
      item.setAttribute('tabindex', '0');
      function activate() {
        items.forEach(function (i) { i.classList.remove('ina-active'); });
        item.classList.add('ina-active');
        var name = ($('.ina-user-name', item) || {}).textContent || 'Kontak';
        var header = document.getElementById('chatActiveUserName'); if (header) header.textContent = name;
        var av = document.getElementById('chatActiveAvatar'); var src = $('.ina-avatar', item);
        if (av && src) av.textContent = src.firstChild.textContent.trim();
        var badge = $('.ina-badge', item); if (badge) badge.remove();
        if (window.innerWidth <= 768) list.scrollIntoView({ behavior: 'smooth' });
      }
      item.addEventListener('click', activate);
      item.addEventListener('keydown', function (e) { if (e.key === 'Enter') activate(); });
    });

    var search = document.getElementById('chatSearchInput');
    if (search) search.addEventListener('input', function () {
      var q = this.value.toLowerCase();
      items.forEach(function (i) { i.style.display = i.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none'; });
    });
    list.scrollTop = list.scrollHeight;
  }

  /* ============================================================
   * 16. Mail / e-Office: folder, daftar, pembaca, filter
   * ============================================================ */
  function initMailApp() {
    var items = $$('.ina-mail-item');
    if (!items.length) return;

    function showMail(item) {
      items.forEach(function (i) { i.classList.remove('ina-active'); });
      item.classList.add('ina-active'); item.classList.remove('ina-unread');
      var map = { mailDetailSubject: '.ina-mail-subject', mailDetailSender: '.ina-mail-sender' };
      Object.keys(map).forEach(function (id) {
        var t = document.getElementById(id), s = $(map[id], item);
        if (t && s) t.textContent = s.textContent.trim();
      });
      var num = document.getElementById('mailDetailNumber');
      if (num && item.getAttribute('data-number')) num.textContent = item.getAttribute('data-number');
      var body = document.getElementById('mailDetailBody');
      var tpl = item.getAttribute('data-body') && document.getElementById(item.getAttribute('data-body'));
      if (body && tpl) body.innerHTML = tpl.innerHTML;
      var av = document.getElementById('mailDetailAvatar');
      if (av && item.getAttribute('data-avatar')) av.textContent = item.getAttribute('data-avatar');
      updateFolderBadges();
      if (window.innerWidth <= 768) { var d = $('.ina-mail-detail-panel'); if (d) d.scrollIntoView({ behavior: 'smooth' }); }
    }
    items.forEach(function (item) {
      item.setAttribute('tabindex', '0');
      item.addEventListener('click', function () { showMail(item); });
      item.addEventListener('keydown', function (e) { if (e.key === 'Enter') showMail(item); });
    });

    function updateFolderBadges() {
      $$('[data-mail-folder]').forEach(function (btn) {
        var f = btn.getAttribute('data-mail-folder');
        var n = $$('.ina-mail-item.ina-unread[data-folder="' + f + '"]').length;
        var b = $('.ina-badge', btn);
        if (b) { b.textContent = String(n); b.style.display = n ? '' : 'none'; }
      });
    }

    $$('[data-mail-folder]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var folder = this.getAttribute('data-mail-folder');
        $$('[data-mail-folder]').forEach(function (b) { b.classList.remove('ina-active'); });
        this.classList.add('ina-active');
        var title = document.getElementById('mailListTitle');
        if (title) title.textContent = ($('.ina-nav-link-text', this) || this).textContent.trim();
        var first = null;
        items.forEach(function (i) {
          var ok = i.getAttribute('data-folder') === folder;
          i.style.display = ok ? '' : 'none';
          if (ok && !first) first = i;
        });
        var empty = document.getElementById('mailListEmpty');
        if (empty) empty.classList.toggle('ina-hidden', !!first);
        var detail = $('.ina-mail-detail-panel');
        if (detail) detail.classList.toggle('ina-hidden', !first);
        if (first) showMail(first);
      });
    });

    var filter = document.getElementById('mailFilterInput');
    if (filter) filter.addEventListener('input', function () {
      var q = this.value.toLowerCase();
      var active = ($('[data-mail-folder].ina-active') || {}).getAttribute ? $('[data-mail-folder].ina-active').getAttribute('data-mail-folder') : null;
      items.forEach(function (i) {
        var inFolder = !active || i.getAttribute('data-folder') === active;
        i.style.display = inFolder && i.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
      });
    });
    updateFolderBadges();
  }

  /* ============================================================
   * 17. Card collapse, alert dismiss, toast demo, confirm generik
   * ============================================================ */
  function initMisc() {
    $$('[data-card-collapse]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = this.closest('.ina-card');
        var collapsed = card.classList.toggle('ina-card-collapsed');
        this.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        var ic = $('.ina-icon', this); if (ic) ic.style.transform = collapsed ? 'rotate(180deg)' : '';
      });
    });
    $$('[data-card-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () { var c = this.closest('.ina-card'); if (c) c.remove(); });
    });
    $$('[data-alert-dismiss]').forEach(function (btn) {
      btn.addEventListener('click', function () { var a = this.closest('.ina-alert'); if (a) a.remove(); });
    });
    $$('[data-toast]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        InaToast.show(this.getAttribute('data-toast'), this.getAttribute('data-toast-type') || 'info');
      });
    });
    // form demo: submit → toast, tanpa navigasi
    $$('form[data-demo-submit]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        InaToast.show(this.getAttribute('data-demo-submit'), 'success');
      });
    });
    // kartu yang bisa diklik: Enter/Spasi = klik (aksesibilitas keyboard)
    $$('.ina-card-clickable[tabindex]').forEach(function (c) {
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); } });
    });
    // tautan navigasi demo
    $$('[data-go]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); window.location.href = this.getAttribute('data-go'); });
    });
    // switch: umpan balik toast opsional
    $$('.ina-switch input[data-switch-label]').forEach(function (sw) {
      sw.addEventListener('change', function () {
        InaToast.show(this.getAttribute('data-switch-label') + ': ' + (this.checked ? 'Aktif' : 'Nonaktif'), this.checked ? 'success' : 'warning');
      });
    });
    // jam sistem di footer / header
    var clock = document.getElementById('inaClock');
    if (clock) {
      function tickClock() {
        clock.textContent = new Date().toLocaleString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WITA';
      }
      tickClock(); setInterval(tickClock, 30000);
    }
  }

  /* ============================================================
   * 16. Chip (choice/filter) + paginasi kartu di luar tabel
   *   <div class="ina-chip" data-chip-group="single" data-chip-filter="#grid">
   *     <button class="ina-chip-item ina-active" data-value="">Semua</button> …
   *   <div id="grid" data-paginate="12"> <article data-category="…"> …
   *   <nav class="ina-pagination-bar" data-pagination-for="#grid">
   * ============================================================ */

  /* ============================================================
   * 16. Tree view ([data-tree-toggle] → li.ina-collapsed) — pohon kinerja, unit kerja
   * ============================================================ */
  function initTrees() {
    $$('[data-tree-toggle]').forEach(function (btn) {
      var li = btn.closest('li'); if (!li) return;
      btn.setAttribute('aria-expanded', li.classList.contains('ina-collapsed') ? 'false' : 'true');
      btn.addEventListener('click', function () {
        var collapsed = li.classList.toggle('ina-collapsed');
        this.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      });
    });
  }

  function initChips() {
    $$('[data-chip-group]').forEach(function (group) {
      var single = group.getAttribute('data-chip-group') !== 'multi';
      var items = $$('.ina-chip-item', group);
      items.forEach(function (it, i) {
        it.setAttribute('aria-pressed', it.classList.contains('ina-active') ? 'true' : 'false');
        it.setAttribute('tabindex', i === 0 ? '0' : '-1');
        it.addEventListener('click', function () {
          if (single) {
            items.forEach(function (x) { x.classList.remove('ina-active'); x.setAttribute('aria-pressed', 'false'); });
            this.classList.add('ina-active'); this.setAttribute('aria-pressed', 'true');
          } else {
            var on = this.classList.toggle('ina-active'); this.setAttribute('aria-pressed', on ? 'true' : 'false');
          }
          applyChipFilter(group);
        });
        it.addEventListener('keydown', function (e) {
          var k = items.indexOf(this), n = null;
          if (e.key === 'ArrowRight') n = items[(k + 1) % items.length];
          if (e.key === 'ArrowLeft') n = items[(k - 1 + items.length) % items.length];
          if (n) { e.preventDefault(); items.forEach(function (x) { x.setAttribute('tabindex', '-1'); }); n.setAttribute('tabindex', '0'); n.focus(); }
        });
      });
    });
  }
  function applyChipFilter(group) {
    var sel = group.getAttribute('data-chip-filter'); if (!sel) return;
    var target = $(sel); if (!target) return;
    var active = $$('.ina-chip-item.ina-active', group).map(function (x) { return x.getAttribute('data-value') || ''; }).filter(Boolean);
    $$('[data-category]', target).forEach(function (el) {
      el.hidden = false;
      el.classList.toggle('ina-chip-filtered', active.length > 0 && active.indexOf(el.getAttribute('data-category')) === -1);
    });
    var bar = $('[data-pagination-for="' + sel + '"]');
    if (bar) renderPagination(bar, target, 1);
  }
  function renderPagination(bar, target, page) {
    var size = parseInt(bar.getAttribute('data-page-size') || target.getAttribute('data-paginate') || '12', 10);
    var items = $$('[data-category]', target).filter(function (el) { return !el.classList.contains('ina-chip-filtered'); });
    $$('[data-category]', target).forEach(function (el) { el.hidden = el.classList.contains('ina-chip-filtered'); });
    var pages = Math.max(1, Math.ceil(items.length / size));
    page = Math.min(Math.max(1, page), pages);
    items.forEach(function (el, i) { el.hidden = Math.floor(i / size) !== page - 1; });
    bar.setAttribute('data-page', String(page));
    var input = $('.ina-page-input', bar), total = $('[data-page-total]', bar), nums = $('[data-page-numbers]', bar);
    if (input) { input.value = page; input.max = pages; }
    if (total) total.textContent = pages;
    if (nums) {
      nums.innerHTML = '';
      for (var i = 1; i <= pages; i++) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'ina-page-btn' + (i === page ? ' ina-active' : '');
        b.textContent = i; if (i === page) b.setAttribute('aria-current', 'page');
        b.setAttribute('data-page-go', i); nums.appendChild(b);
      }
    }
    $$('[data-page-nav]', bar).forEach(function (b) {
      var d = b.getAttribute('data-page-nav');
      b.disabled = (d === 'first' || d === 'prev') ? page === 1 : page === pages;
    });
    var empty = $('[data-pagination-empty]', target.parentElement || document);
    if (empty) empty.hidden = items.length > 0;
    target.hidden = items.length === 0;
  }
  function initPaginationBars() {
    $$('[data-pagination-for]').forEach(function (bar) {
      var target = $(bar.getAttribute('data-pagination-for')); if (!target) return;
      var pageOf = function () { return parseInt(bar.getAttribute('data-page') || '1', 10); };
      bar.addEventListener('click', function (e) {
        var go = e.target.closest('[data-page-go]'), nav = e.target.closest('[data-page-nav]');
        if (go) renderPagination(bar, target, parseInt(go.getAttribute('data-page-go'), 10));
        if (nav) {
          var d = nav.getAttribute('data-page-nav'), p = pageOf();
          renderPagination(bar, target, d === 'first' ? 1 : d === 'prev' ? p - 1 : d === 'next' ? p + 1 : 9999);
        }
      });
      var input = $('.ina-page-input', bar);
      if (input) input.addEventListener('change', function () { renderPagination(bar, target, parseInt(this.value, 10) || 1); });
      var sizeSel = $('[data-page-size-select]', bar);
      if (sizeSel) sizeSel.addEventListener('change', function () { bar.setAttribute('data-page-size', this.value); renderPagination(bar, target, 1); });
      renderPagination(bar, target, 1);
    });
  }

  /* ============================================================
   * 17. Detail artikel (artikel.html?id=N) — pola Blog Post, data dari assets/artikel-data.js
   * ============================================================ */
  function kartuArtikel(a) {
    return '<article class="ina-card ina-card-basic ina-card-clickable" data-category="' + a.kategori + '">' +
      '<div class="ina-card-media"><img src="' + ASSET_BASE + a.gambar + '" alt="" width="328" height="202" loading="lazy"></div>' +
      '<div class="ina-card-body ina-gap-2">' +
      '<div class="ina-flex ina-items-center ina-justify-between ina-gap-2"><span class="ina-badge ina-badge-sm ' +
      ({ layanan: 'ina-badge-soft-info', kebijakan: 'ina-badge-soft-warning', panduan: 'ina-badge-soft-success' }[a.kategori] || 'ina-badge-soft-neutral') +
      '">' + escapeHtml(a.kategoriLabel) + '</span><span class="ina-caption-small ina-text-muted ina-tabular ina-nowrap">' + escapeHtml(a.tanggal) + '</span></div>' +
      '<h3 class="ina-card-title ina-clamp-1"><a href="artikel.html?id=' + a.id + '" class="ina-card-link">' + escapeHtml(a.judul) + '</a></h3>' +
      '<p class="ina-card-desc ina-clamp-2">' + escapeHtml(a.ringkasan) + '</p></div></article>';
  }
  function initArtikelDetail() {
    var root = $('[data-artikel-detail]');
    if (!root || !window.INA_ARTIKEL) return;
    var id = parseInt(new URLSearchParams(window.location.search).get('id') || '1', 10);
    var a = window.INA_ARTIKEL.filter(function (x) { return x.id === id; })[0];
    var empty = $('[data-artikel-empty]');
    if (!a) { root.hidden = true; if (empty) empty.hidden = false; return; }
    if (empty) empty.hidden = true;
    var kata = a.isi.join(' ').replace(/<[^>]+>/g, '').split(/\s+/).length;
    var menit = Math.max(1, Math.round(kata / 200));
    document.title = a.judul + ' — IDDS Admin Dashboard Pemkab HSS';
    var set = function (sel, html) { var el = $(sel, root); if (el) el.innerHTML = html; };
    set('[data-a="judul"]', escapeHtml(a.judul));
    set('[data-a="ringkasan"]', escapeHtml(a.ringkasan));
    set('[data-a="penulis"]', escapeHtml(a.penulis));
    var av = $('[data-a="avatar"]', root); if (av) av.textContent = (a.penulis || 'P').trim().charAt(0).toUpperCase();
    set('[data-a="tanggal"]', escapeHtml(a.tanggal));
    set('[data-a="baca"]', menit + ' menit baca');
    set('[data-a="kategori"]', escapeHtml(a.kategoriLabel));
    var badge = $('[data-a="kategori"]', root);
    if (badge) badge.className = 'ina-badge ina-badge-md ina-fit ' + ({ layanan: 'ina-badge-soft-info', kebijakan: 'ina-badge-soft-warning', panduan: 'ina-badge-soft-success' }[a.kategori] || 'ina-badge-soft-neutral');
    var img = $('[data-a="gambar"]', root); if (img) { img.src = ASSET_BASE + a.gambar; img.alt = a.judul; }
    set('[data-a="sumber"]', 'Sumber: ' + escapeHtml(a.sumber));
    // isi artikel: teks dari berkas data paket (sudah tepercaya); <b> dipertahankan, tag lain dibuang
    set('[data-a="isi"]', a.isi.map(function (p) { return '<p>' + p.replace(/<(?!\/?b>)[^>]+>/g, '') + '</p>'; }).join(''));
    var crumb = $('[data-a="crumb"]'); if (crumb) { crumb.textContent = a.judul; crumb.title = a.judul; }
    // artikel terkait: kategori sama, maksimal 3 (Blog Section: 3–4 per baris)
    var terkait = window.INA_ARTIKEL.filter(function (x) { return x.kategori === a.kategori && x.id !== a.id; }).slice(0, 3);
    var wrap = $('[data-a="terkait"]');
    if (wrap) { wrap.innerHTML = terkait.map(kartuArtikel).join(''); if (!terkait.length && wrap.parentElement) wrap.parentElement.hidden = true; }
  }

  /* ---- ekspos & jalankan ---- */
  window.InaToast = InaToast;
  window.InaModal = InaModal;
  window.InaChart = InaChart;

  document.addEventListener('DOMContentLoaded', function () {
    initThemeAndBrand();
    initSidebar();
    initDropdowns();
    initModals();
    initTabs();
    initSearchShortcut();
    initCharts();
    initAccordions();
    initOtp();
    initPassword();
    initSteppers();
    initDropzones();
    initTableInteractions();
    initChatApp();
    initMailApp();
    initMisc();
    initChips();
    initTrees();
    initPaginationBars();
    initArtikelDetail();
  });
})();
