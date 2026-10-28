document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#klarheit-team-03");
  if (!root) return;

  const grids = root.querySelectorAll('[cursor-follow="grid"]');

  grids.forEach((grid) => {
    const cards = Array.from(grid.children);

    cards.forEach((card) => {
      card.style.willChange = "transform";
      card.style.transformStyle = "preserve-3d";
      card.style.transition = "transform 0.18s linear";
    });

    grid.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      cards.forEach((card) => {
        const bounds = card.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 450;
        const strength = Math.max(0, 1 - distance / maxDistance);
        const moveX = dx * 0.03 * strength;
        const moveY = dy * 0.03 * strength;
        const rotateY = dx * 0.015 * strength;
        const rotateX = -dy * 0.015 * strength;

        card.style.transform = `
          perspective(1000px)
          translate3d(${moveX}px, ${moveY}px, 0)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
    });

    grid.addEventListener("mouseleave", () => {
      cards.forEach((card) => {
        card.style.transform = `
          perspective(1000px)
          translate3d(0, 0, 0)
          rotateX(0deg)
          rotateY(0deg)
        `;
      });
    });
  });
});
