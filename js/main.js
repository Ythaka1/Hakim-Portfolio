/* ============================================================
   HAKIM WAITHAKA CASTRO — PORTFOLIO
   Custom cursor · preloader · reveals · works scroll animation
   Zero dependencies.
   ============================================================ */

(() => {
  "use strict";

  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- custom cursor: orbiting star + lagging ring ---------- */
  if (finePointer && !reduceMotion) {
    body.classList.add("has-custom-cursor");

    const star = document.createElement("div");
    star.className = "cursor-star";
    star.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z"/></svg>';

    const ring = document.createElement("div");
    ring.className = "cursor-ring";

    body.append(star, ring);

    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { x: mouse.x, y: mouse.y };

    addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    addEventListener("mousedown", () => body.classList.add("cursor-down"));
    addEventListener("mouseup", () => body.classList.remove("cursor-down"));

    // Hover state via delegation so page-transition swaps keep working
    addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .work-panel")) body.classList.add("cursor-hover");
    });
    addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .work-panel")) body.classList.remove("cursor-hover");
    });

    (function cursorLoop() {
      ringPos.x = lerp(ringPos.x, mouse.x, 0.16);
      ringPos.y = lerp(ringPos.y, mouse.y, 0.16);
      star.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      requestAnimationFrame(cursorLoop);
    })();
  }

  /* ---------- preloader ---------- */
  const preloader = document.querySelector(".preloader");
  const finishLoad = () => {
    if (preloader) preloader.classList.add("is-done");
    body.classList.add("is-ready");
  };
  if (preloader && !reduceMotion && !sessionStorage.getItem("hakim-seen")) {
    sessionStorage.setItem("hakim-seen", "1");
    setTimeout(finishLoad, 1600);
  } else {
    // Repeat visits within the session skip the wait
    requestAnimationFrame(() => requestAnimationFrame(finishLoad));
  }

  /* ---------- page transition veil ---------- */
  const veil = document.querySelector(".veil");
  if (veil) {
    document.querySelectorAll('a[href$=".html"], a[href="/"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || link.target === "_blank" || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        veil.classList.add("is-in");
        setTimeout(() => (location.href = href), reduceMotion ? 0 : 520);
      });
    });
  }

  /* ---------- scroll reveals ---------- */
  const revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- Nairobi clock in the footer ---------- */
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const tick = () => {
      clock.textContent = new Intl.DateTimeFormat("en-KE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Africa/Nairobi",
      }).format(new Date()) + " NBO";
    };
    tick();
    setInterval(tick, 30_000);
  }

  /* ---------- works page: parallax drift + velocity skew ---------- */
  const panels = document.querySelectorAll(".work-panel");
  if (panels.length && !reduceMotion) {
    let lastY = scrollY;
    let velocity = 0;

    (function worksLoop() {
      velocity = lerp(velocity, scrollY - lastY, 0.12);
      lastY = scrollY;
      const vh = innerHeight;
      const skew = Math.max(-4, Math.min(4, velocity * 0.06));

      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > vh + 80) return;
        // -1 (below viewport) … 1 (above viewport)
        const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        const bg = panel.querySelector(".work-panel__bg");
        if (bg) bg.style.transform = `translateY(${progress * -9}%) scale(1.06)`;
        panel.style.transform = `skewY(${skew}deg) scale(${1 - Math.abs(progress) * 0.05})`;
      });

      requestAnimationFrame(worksLoop);
    })();
  }
})();
