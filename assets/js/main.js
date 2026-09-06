/* =========================================================
   Portfolio — main.js
   1) 테마 전환 (라이트 / 다크)
   2) 모바일 네비게이션 토글
   3) 헤더 스크롤 상태 + 스크롤 진행 바
   4) 스크롤 스파이 (현재 섹션 메뉴 강조)
   5) 등장 애니메이션 (순차 등장)
   6) 푸터 연도 자동 표기
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("primaryNav");
  var navToggle = document.getElementById("navToggle");
  var themeToggle = document.getElementById("themeToggle");
  var progressBar = document.getElementById("scrollProgress");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1) 테마 전환 ---------- */
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set === "dark" || set === "light") return set;
    return systemDark.matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0e1116" : "#ffffff");
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  /* ---------- 2) 모바일 네비게이션 ---------- */
  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "메뉴 열기");
  }

  function toggleNav() {
    if (!nav || !navToggle) return;
    var open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  }

  if (navToggle) navToggle.addEventListener("click", toggleNav);

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  document.addEventListener("click", function (e) {
    if (!nav || !nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || (navToggle && navToggle.contains(e.target))) return;
    closeNav();
  });

  var mqDesktop = window.matchMedia("(min-width: 761px)");
  var onDesktopChange = function (e) { if (e.matches) closeNav(); };
  if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", onDesktopChange);
  else if (mqDesktop.addListener) mqDesktop.addListener(onDesktopChange);

  /* ---------- 3) 헤더 상태 + 진행 바 ---------- */
  var ticking = false;

  function updateOnScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);

    if (progressBar) {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressBar.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateOnScroll);
  }, { passive: true });
  updateOnScroll();

  /* ---------- 4) 스크롤 스파이 ---------- */
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (en) { return en.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- 5) 등장 애니메이션 ---------- */
  // 섹션 라벨(번호 밑줄)도 같은 방식으로 등장시킵니다.
  var revealItems = Array.prototype.slice.call(
    document.querySelectorAll(".reveal, .section-aside")
  );

  function revealAll() {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        // 한 번에 들어온 요소들에 시차를 줘 순서대로 올라오게 합니다.
        var shown = entries.filter(function (en) { return en.isIntersecting; });
        shown.forEach(function (entry, i) {
          entry.target.style.transitionDelay = Math.min(i, 8) * 60 + "ms";
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 6) 푸터 연도 ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
