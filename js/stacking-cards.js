document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const list = document.querySelector("[data-stacking-list]");
  if (!list) return;

  gsap.registerPlugin(ScrollTrigger);

  const card1 = list.querySelector(".stacking-card._1");
  const card2 = list.querySelector(".stacking-card._2");
  const card3 = list.querySelector(".stacking-card._3");
  if (!card1 || !card2 || !card3) return;

  // Franco / Webflow IX2 "Stacking Cards" (scroll progress keyframes):
  // 20% → card1 scale 1 / brightness 100%
  // 30% → card1 scale 0.7 / brightness 50%
  // 50% → card2 scale 1 / brightness 100%
  // 60% → card2 scale 0.8 / brightness 50%
  // 70% → card3 scale 1
  // 80% → card3 scale 0.85
  gsap.set([card1, card2, card3], {
    transformOrigin: "50% 0%",
    force3D: true,
  });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: list,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.95,
    },
  });

  tl.fromTo(
    card1,
    { scale: 1, filter: "brightness(100%)" },
    { scale: 1, filter: "brightness(100%)", duration: 0.2 },
    0
  )
    .to(card1, { scale: 0.7, filter: "brightness(50%)", duration: 0.1 }, 0.2)
    .fromTo(
      card2,
      { scale: 1, filter: "brightness(100%)" },
      { scale: 1, filter: "brightness(100%)", duration: 0.2 },
      0.3
    )
    .to(card2, { scale: 0.8, filter: "brightness(50%)", duration: 0.1 }, 0.5)
    .fromTo(card3, { scale: 1 }, { scale: 1, duration: 0.1 }, 0.6)
    .to(card3, { scale: 0.85, duration: 0.1 }, 0.7)
    .to({}, { duration: 0.2 }, 0.8);
});
