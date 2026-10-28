document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector('#cycle-timeline-04 [swiper="timeline-04"]');
  if (!root || typeof Swiper === "undefined") return;

  new Swiper(root, {
    slidesPerView: 1,
    spaceBetween: 20,
  });
});
