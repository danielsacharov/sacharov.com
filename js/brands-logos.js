document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".section_services-clients-light");
  if (!section) return;

  // White → lighter gray: scrubbed / delayed for smoother feel
  let scrollTimer = null;
  const setScrolled = (on) => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      section.classList.toggle("is-scrolled", on);
    }, on ? 40 : 80);
  };
  if (typeof IntersectionObserver !== "undefined") {
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(entry.isIntersecting && entry.intersectionRatio > 0.28),
      { threshold: [0, 0.15, 0.28, 0.45, 0.65], rootMargin: "-8% 0px -12% 0px" }
    );
    io.observe(section);
  } else {
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      setScrolled(rect.top < vh * 0.65 && rect.bottom > vh * 0.28);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (typeof gsap === "undefined") return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  const reveals = section.querySelectorAll("[data-brands-reveal]");
  if (reveals.length) {
    gsap.set(reveals, { y: 50, opacity: 0 });
    gsap.to(reveals, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger:
        typeof ScrollTrigger !== "undefined"
          ? {
              trigger: section,
              start: "top 85%",
              once: true,
            }
          : undefined,
    });
  }

  // Marquee: auto-loop, drag to scrub, resume on release
  const marquee = section.querySelector(".brands-marquee");
  const track = section.querySelector("[data-brands-marquee]");
  const firstSet = track?.querySelector(".single-marquee_cards");
  if (!track || !firstSet || !marquee) return;

  const DURATION = 20;
  let tween = null;
  let drag = null;

  const loopWidth = () => firstSet.offsetWidth || 1;

  const wrapX = (x) => {
    const w = loopWidth();
    let n = x % w;
    if (n > 0) n -= w;
    return n;
  };

  const startInfinite = () => {
    if (tween) tween.kill();
    tween = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: () => -loopWidth(),
        duration: DURATION,
        ease: "none",
        repeat: -1,
      }
    );
  };

  const resumeFrom = (fromX) => {
    if (tween) tween.kill();
    const w = loopWidth();
    const x = wrapX(fromX);
    const progress = Math.min(0.999, Math.max(0, Math.abs(x) / w));
    const left = 1 - progress;

    if (left < 0.002) {
      gsap.set(track, { x: 0 });
      startInfinite();
      return;
    }

    gsap.set(track, { x });
    tween = gsap.to(track, {
      x: -w,
      duration: DURATION * left,
      ease: "none",
      onComplete: startInfinite,
    });
  };

  startInfinite();

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const currentX = Number(gsap.getProperty(track, "x")) || 0;
    if (tween) tween.pause();
    drag = {
      id: e.pointerId,
      startX: e.clientX,
      baseX: currentX,
      moved: false,
    };
    marquee.classList.add("is-dragging");
    try {
      marquee.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 4) drag.moved = true;
    gsap.set(track, { x: wrapX(drag.baseX + dx) });
  };

  const onPointerUp = (e) => {
    if (!drag || (e.pointerId != null && e.pointerId !== drag.id)) return;
    const wasDrag = drag.moved;
    const x = Number(gsap.getProperty(track, "x")) || 0;
    drag = null;
    marquee.classList.remove("is-dragging");
    resumeFrom(x);
    if (wasDrag) {
      const block = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      marquee.addEventListener("click", block, { capture: true, once: true });
    }
  };

  marquee.addEventListener("pointerdown", onPointerDown);
  marquee.addEventListener("pointermove", onPointerMove);
  marquee.addEventListener("pointerup", onPointerUp);
  marquee.addEventListener("pointercancel", onPointerUp);

  window.addEventListener("resize", () => {
    if (drag) return;
    resumeFrom(Number(gsap.getProperty(track, "x")) || 0);
  });
});
