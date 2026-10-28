document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".em-vf-5");
  if (!root || typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  root.querySelectorAll(".home-b-about-image").forEach((wrap) => {
    const img = wrap.querySelector(".image-cover.parallax");
    if (!img) return;
    gsap.fromTo(
      img,
      { yPercent: -15 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      }
    );
  });
});
