document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const ambition = document.querySelector(".ambition");
  const footer = document.querySelector(".jop-footer");
  if (!ambition && !footer) return;

  gsap.registerPlugin(ScrollTrigger);

  initJourneyWords();
  initJourneyScale();
  initMarquees();
  initFooterReveal();
});

function initJourneyWords() {
  const container = document.getElementById("journeyWords");
  if (!container) return;

  const text = container.getAttribute("data-words") || container.textContent || "";
  const words = text.trim().split(/\s+/);
  container.innerHTML = words
    .map(
      (word) =>
        `<span class="ambition__word">
          <span class="ambition__word-ghost">${word}</span>
          <span class="ambition__word-visible">${word}</span>
        </span>`
    )
    .join("");

  ScrollTrigger.create({
    trigger: container,
    start: "top 80%",
    end: "top 15%",
    scrub: true,
    onUpdate: (self) => {
      const spans = container.querySelectorAll(".ambition__word");
      const total = spans.length || 1;
      spans.forEach((span, i) => {
        const start = i / total;
        const end = start + 1 / total;
        const p = self.progress;
        let op = 0;
        if (p >= end) op = 1;
        else if (p > start) op = (p - start) / (end - start);
        span.querySelector(".ambition__word-visible").style.opacity = String(op);
      });
    },
  });
}

function initJourneyScale() {
  const journey = document.querySelector(".ambition__panel");
  if (!journey) return;

  gsap.fromTo(
    journey,
    { scale: 0.9 },
    {
      scale: 0.98,
      ease: "none",
      scrollTrigger: {
        trigger: journey,
        start: "top bottom",
        end: "center center",
        scrub: 0.6,
      },
    }
  );
}

function initMarquees() {
  document.querySelectorAll("[data-marquee]").forEach((section) => {
    const track = section.querySelector("[data-marquee-track]");
    const img = section.querySelector("[data-marquee-img]");
    if (!track) return;

    gsap.fromTo(
      track,
      { x: 200 },
      {
        x: -1000,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    if (img) {
      gsap.fromTo(
        img,
        { rotate: 0 },
        {
          rotate: 300,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  });
}

function initFooterReveal() {
  const line = document.getElementById("footerLine");
  if (!line) return;

  ScrollTrigger.create({
    trigger: line,
    start: "top 90%",
    once: true,
    onEnter: () => {
      line.classList.add("is-visible");
      document.querySelectorAll(".jop-footer [data-reveal]").forEach((el) => {
        el.classList.add("is-visible");
      });
    },
  });
}
