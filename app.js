// Ничего внешнего: переключение языка, демонстрация острова, мелочи по скроллу.

(function () {
  'use strict';

  // класс ставим первым делом: без него секции не прячутся и страница
  // остаётся читаемой, даже если дальше что-то в скрипте сломается
  document.documentElement.classList.add('js');

  // ── язык ────────────────────────────────────────────────────
  var nodes = document.querySelectorAll('[data-en]');
  var button = document.getElementById('lang');

  function apply(lang) {
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.dataset.ru === undefined) el.dataset.ru = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.ru;
    }
    document.documentElement.lang = lang;
    button.textContent = lang === 'en' ? 'RU' : 'EN';
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  var saved;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  // без сохранённого выбора идём от языка браузера
  var start = saved || (/^ru\b/i.test(navigator.language || '') ? 'ru' : 'en');
  if (start === 'en') apply('en');

  button.addEventListener('click', function () {
    apply(document.documentElement.lang === 'en' ? 'ru' : 'en');
  });

  // ── остров в герое: он есть только на визитке ───────────────
  var island = document.getElementById('island');
  if (island) {
    var pinned = false;                     // раскрыт кликом, а не наведением

    var toggle = function () {
      pinned = !pinned;
      island.classList.toggle('open', pinned);
    };
    island.addEventListener('click', toggle);
    island.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    island.addEventListener('mouseenter', function () { island.classList.add('open'); });
    island.addEventListener('mouseleave', function () {
      if (!pinned) island.classList.remove('open');
    });

    // короткий показ при загрузке, чтобы было видно, что пилюля живая
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTimeout(function () { if (!pinned) island.classList.add('open'); }, 900);
      setTimeout(function () { if (!pinned) island.classList.remove('open'); }, 3400);
    }
  }

  // ── секции проявляются при подходе ──────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    for (var j = 0; j < reveals.length; j++) reveals[j].classList.add('in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  for (var k = 0; k < reveals.length; k++) io.observe(reveals[k]);
})();
