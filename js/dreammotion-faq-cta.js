document.addEventListener("DOMContentLoaded", () => {
  const faq = document.querySelector(".dm-faq");
  if (faq) {
    faq.querySelectorAll(".dm-faq__item").forEach((item) => {
      const btn = item.querySelector(".dm-faq__q");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const open = item.classList.contains("is-open");
        faq.querySelectorAll(".dm-faq__item.is-open").forEach((el) => {
          el.classList.remove("is-open");
          const b = el.querySelector(".dm-faq__q");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".dm-faq, .dm-cta").forEach((root) => {
    const bits = root.querySelectorAll(
      ".dm-faq__eyebrow, .dm-faq__title, .dm-faq__item, .dm-cta__eyebrow, .dm-cta__title, .dm-cta__desc, .dm-cta__btn, .dm-cta__visual"
    );
    if (!bits.length) return;
    gsap.fromTo(
      bits,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      }
    );
  });
});
