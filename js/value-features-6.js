document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".section_bg-slider");
  if (!section) return;

  const mask = section.querySelector(".mask_bg-slider");
  const track = section.querySelector("[data-vf-track]");
  const originalSlides = [...section.querySelectorAll(".slide_bg-slider:not([data-vf-clone])")];
  const bgs = [...section.querySelectorAll("[data-vf-bg]")];
  const prevBtn = section.querySelector("[data-vf-prev]");
  const nextBtn = section.querySelector("[data-vf-next]");
  if (!mask || !track || originalSlides.length === 0) return;

  track.querySelectorAll("[data-vf-clone]").forEach((el) => el.remove());

  const n = originalSlides.length;
  const GAP = 16;
  const AUTOPLAY_MS = 2000;
  const DRAG_THRESHOLD = 48;

  const cloneSlide = (slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("data-vf-clone", "true");
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    return clone;
  };

  const prependFrag = document.createDocumentFragment();
  const appendFrag = document.createDocumentFragment();
  originalSlides.forEach((slide) => {
    prependFrag.appendChild(cloneSlide(slide));
    appendFrag.appendChild(cloneSlide(slide));
  });
  track.insertBefore(prependFrag, track.firstChild);
  track.appendChild(appendFrag);

  let index = n;
  let timer = null;
  let locked = false;
  let drag = null;

  const step = () => mask.clientWidth + GAP;

  const measure = () => {
    const w = mask.clientWidth;
    section.style.setProperty("--vf-slide-w", `${w}px`);
    return step();
  };

  const setTransform = (i, animate, offsetPx = 0) => {
    if (!animate) track.style.transition = "none";
    else track.style.transition = "";
    track.style.transform = `translate3d(${-i * measure() + offsetPx}px, 0, 0)`;
    if (!animate) {
      void track.offsetWidth;
      track.style.transition = "";
    }
  };

  const realIndex = (i) => ((i % n) + n) % n;

  const setBg = (i) => {
    const real = realIndex(i);
    bgs.forEach((bg, bi) => bg.classList.toggle("is-active", bi === real));
  };

  const goTo = (i, animate = true) => {
    index = i;
    setTransform(index, animate, 0);
    setBg(index);
  };

  const normalize = () => {
    locked = false;
    if (index >= 2 * n) goTo(index - n, false);
    else if (index < n) goTo(index + n, false);
  };

  const onTransitionEnd = (e) => {
    if (e.target !== track || e.propertyName !== "transform") return;
    normalize();
  };

  track.addEventListener("transitionend", onTransitionEnd);

  const next = () => {
    if (locked || drag) return;
    locked = true;
    goTo(index + 1, true);
    window.setTimeout(() => {
      if (locked) normalize();
    }, 700);
  };

  const prev = () => {
    if (locked || drag) return;
    locked = true;
    goTo(index - 1, true);
    window.setTimeout(() => {
      if (locked) normalize();
    }, 700);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    stop();
    timer = setInterval(next, AUTOPLAY_MS);
  };

  prevBtn?.addEventListener("click", () => {
    prev();
    start();
  });
  nextBtn?.addEventListener("click", () => {
    next();
    start();
  });

  // Mouse / touch drag
  const onPointerDown = (e) => {
    if (locked) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    stop();
    drag = {
      startX: e.clientX,
      lastX: e.clientX,
      moved: false,
      id: e.pointerId,
    };
    mask.classList.add("is-dragging");
    track.style.transition = "none";
    try {
      mask.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 4) drag.moved = true;
    drag.lastX = e.clientX;
    setTransform(index, false, dx);
  };

  const onPointerUp = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.startX;
    const wasDrag = drag.moved;
    drag = null;
    mask.classList.remove("is-dragging");
    track.style.transition = "";

    if (wasDrag && Math.abs(dx) >= DRAG_THRESHOLD) {
      locked = true;
      if (dx < 0) goTo(index + 1, true);
      else goTo(index - 1, true);
      window.setTimeout(() => {
        if (locked) normalize();
      }, 700);
    } else {
      goTo(index, true);
    }
    start();
  };

  mask.addEventListener("pointerdown", onPointerDown);
  mask.addEventListener("pointermove", onPointerMove);
  mask.addEventListener("pointerup", onPointerUp);
  mask.addEventListener("pointercancel", onPointerUp);

  // Prevent accidental click-through after drag
  mask.addEventListener(
    "click",
    (e) => {
      if (mask.dataset.suppressClick === "1") {
        e.preventDefault();
        e.stopPropagation();
        mask.dataset.suppressClick = "0";
      }
    },
    true
  );

  section.addEventListener("mouseenter", stop);
  section.addEventListener("mouseleave", () => {
    if (!drag) start();
  });
  window.addEventListener("resize", () => goTo(n + realIndex(index), false));

  goTo(n, false);
  start();
});
