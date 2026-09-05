/* =========================================================
   Portfolio — main.js
   1) 모바일 네비게이션 토글
   2) 헤더 스크롤 상태
   3) 스크롤 스파이 (현재 섹션 메뉴 강조)
   4) 등장 애니메이션 (IntersectionObserver)
   5) 푸터 연도 자동 표기
   ========================================================= */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("primaryNav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1) 모바일 네비게이션 ---------- */
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

  // 데스크톱으로 넓어지면 모바일 메뉴 상태 초기화
  var mqDesktop = window.matchMedia("(min-width: 761px)");
  var onDesktopChange = function (e) { if (e.matches) closeNav(); };
  if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", onDesktopChange);
  else if (mqDesktop.addListener) mqDesktop.addListener(onDesktopChange);

  /* ---------- 2) 헤더 스크롤 상태 ---------- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3) 스크롤 스파이 ---------- */
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

  /* ---------- 4) 등장 애니메이션 ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function revealAll() {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 5) 푸터 연도 ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
