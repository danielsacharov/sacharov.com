document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#cob-hero .pb-row-hero-slider__slider");
  if (!root || typeof Swiper === "undefined") return;

  new Swiper(root, {
    speed: 250,
    allowTouchMove: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: "#cob-hero .pb-row-hero-slider__nextBtn",
      prevEl: "#cob-hero .pb-row-hero-slider__prevBtn",
    },
  });
});
