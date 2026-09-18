/* Winter Arc — drobne usprawnienia interfejsu. */

(function () {
  'use strict';

  // Ostrzeżenie o niezapisanych zmianach.
  document.querySelectorAll('form').forEach(function (form) {
    if (!form.querySelector('button[type=submit]')) return;
    var dirty = false;
    form.addEventListener('input', function () { dirty = true; });
    form.addEventListener('submit', function () { dirty = false; });
    window.addEventListener('beforeunload', function (e) {
      if (dirty) { e.preventDefault(); e.returnValue = ''; }
    });
  });

  // Klik w checkbox z klawiatury na całej karcie filaru.
  document.querySelectorAll('label.check').forEach(function (l) {
    l.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        var cb = l.querySelector('input[type=checkbox]');
        if (cb && e.target === l) { cb.checked = !cb.checked; e.preventDefault(); }
      }
    });
  });

  // Automatyczne rozciąganie pól tekstowych.
  document.querySelectorAll('textarea').forEach(function (ta) {
    var fit = function () {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight + 2, 400) + 'px';
    };
    ta.addEventListener('input', fit);
    fit();
  });
})();
