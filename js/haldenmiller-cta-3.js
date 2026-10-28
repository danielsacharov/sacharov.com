document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".hm-cta-3");
  if (!root || typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  const headline = root.querySelector(".headline-cta-a");
  const cards = root.querySelectorAll(".card-cta-a");

  if (headline) {
    gsap.fromTo(
      headline,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      }
    );
  }

  if (cards.length) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      }
    );
  }
});
