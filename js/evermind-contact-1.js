document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".em-contact-1");
  if (!root) return;

  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

    const left = root.querySelector(".contact-left");
    const right = root.querySelector(".contact-right");
    const targets = [left, right].filter(Boolean);
    if (targets.length) {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 75%", once: true },
        }
      );
    }

    root.querySelectorAll(".cta-main.secondary-dark").forEach((btn) => {
      const prev = btn.querySelector(".icon-button.prev");
      const curr = btn.querySelector(".icon-button.current");
      if (!prev || !curr) return;
      btn.addEventListener("mouseenter", () => {
        gsap.to(curr, { x: 20, opacity: 0, duration: 0.35, ease: "power2.out" });
        gsap.fromTo(prev, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(prev, { x: -20, opacity: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(curr, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
      });
    });
  }

  // Custom checkbox UI
  root.querySelectorAll(".w-checkbox").forEach((label) => {
    const input = label.querySelector('input[type="checkbox"]');
    const box = label.querySelector(".w-checkbox-input");
    if (!input || !box) return;
    const sync = () => box.classList.toggle("w--redirected-checked", input.checked);
    label.addEventListener("click", (e) => {
      if (e.target === input) return;
      e.preventDefault();
      input.checked = !input.checked;
      sync();
    });
    input.addEventListener("change", sync);
    sync();
  });

  // Mailto form submit
  const form = root.querySelector("form.form-contact");
  if (!form) return;
  const done = root.querySelector(".w-form-done");
  const fail = root.querySelector(".w-form-fail");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (fail) fail.classList.remove("is-visible");
    const name = (form.querySelector('[name="name"]') || {}).value || "";
    const email = (form.querySelector('[name="Email"]') || {}).value || "";
    const budget = (form.querySelector('[name="Budget"]') || {}).value || "";
    const message =
      (form.querySelector('[name="Describe-your-project-vision"]') || {}).value || "";
    const checkbox = form.querySelector('[name="Checkbox"]');
    if (checkbox && !checkbox.checked) {
      if (fail) fail.classList.add("is-visible");
      return;
    }
    const subject = encodeURIComponent(`Project inquiry from ${name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\n${message}`
    );
    window.location.href = `mailto:daniel@sacharov.com?subject=${subject}&body=${body}`;
    form.style.display = "none";
    if (done) done.classList.add("is-visible");
  });
});
