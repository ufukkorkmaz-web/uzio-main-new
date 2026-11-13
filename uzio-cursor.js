/* Uzio cursor helper: shows a spinning ring next to the cursor while something is loading.
   The cursors themselves are pure CSS (uzio-cursor.css). API: UzioCursor.busy('some-key', true | false) */
(function () {
  'use strict';
  var doc = document, docEl = doc.documentElement;
  var fine = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches); /* no ring on touch screens */
  var owners = {}, loader = null, raf = 0, active = false, inside = false, fading = null;
  var x = 0, y = 0, lx = 0, ly = 0;

  function ensure() {
    if (loader || !doc.body) return loader;
    loader = doc.createElement('div');
    loader.className = 'uz-loader'; loader.setAttribute('aria-hidden', 'true'); loader.innerHTML = '<i></i>';
    doc.body.appendChild(loader);
    return loader;
  }
  function frame() {
    raf = 0;
    if (!loader) return;
    lx += (x - lx) * 0.34; ly += (y - ly) * 0.34; /* a little spring so the ring feels alive */
    loader.style.transform = 'translate3d(' + (lx + 13) + 'px,' + (ly + 13) + 'px,0)';
    if (active || fading) raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf) raf = requestAnimationFrame(frame); }
  function show() { if (!loader) return; lx = x; ly = y; loader.classList.add('on'); start(); }

  function busy(key, on) {
    owners[key] = !!on;
    var any = false;
    for (var k in owners) if (owners[k]) { any = true; break; }
    if (any === active) return;
    active = any;
    docEl.classList.toggle('uz-busy', any);
    if (!fine || !ensure()) return;
    clearTimeout(fading); fading = null;
    if (any) { if (inside) show(); }
    else { loader.classList.remove('on'); fading = setTimeout(function () { fading = null; }, 320); }
  }

  if (fine) {
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      x = e.clientX; y = e.clientY;
      if (!inside) { inside = true; if (active && ensure()) show(); }
    }, { passive: true });
    docEl.addEventListener('mouseleave', function () { inside = false; if (loader) loader.classList.remove('on'); });
  }

  /* the page itself is loading */
  if (doc.readyState !== 'complete') {
    busy('page', true);
    window.addEventListener('load', function () { setTimeout(function () { busy('page', false); }, 600); });
  }
  /* following a link to another page: the old page stays up while the next one loads */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    if (a.origin === location.origin && a.pathname !== location.pathname) busy('nav', true);
  });
  window.addEventListener('pageshow', function () { busy('nav', false); });

  window.UzioCursor = { busy: busy };
})();
