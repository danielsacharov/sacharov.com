document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-nexia-about]");
  if (!root || typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  const reveals = root.querySelectorAll("[data-nexia-reveal]");
  if (!reveals.length) return;

  gsap.set(reveals, { opacity: 0, y: 28 });
  gsap.to(reveals, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger: root,
      start: "top 75%",
      once: true,
    },
  });
});
