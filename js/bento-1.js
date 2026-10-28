document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;

  const section = document.querySelector(".section_features-home-c");
  if (!section) return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  section.querySelectorAll("[count-up]").forEach((el) => {
    const raw = el.textContent.trim();
    const target = parseFloat(raw);
    const suffix = raw.replace(/[\d,.]/g, "");
    const counter = { val: 0 };

    const tl = gsap.timeline({
      scrollTrigger:
        typeof ScrollTrigger !== "undefined"
          ? {
              trigger: el,
              start: "top 80%",
              once: true,
            }
          : undefined,
    });

    tl.fromTo(
      el,
      { filter: "blur(6px)" },
      { filter: "blur(0px)", duration: 2.25, ease: "power2.out" },
      0
    );
    tl.to(
      counter,
      {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(counter.val).toLocaleString() + suffix;
        },
      },
      0
    );
  });
});
