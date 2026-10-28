document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".dm-pricing");
  if (!root) return;

  // Tabs: Website / Custom
  const tabs = root.querySelectorAll("[data-pricing-tab]");
  const panels = root.querySelectorAll("[data-pricing-panel]");

  const setTab = (name) => {
    tabs.forEach((tab) => {
      const on = tab.getAttribute("data-pricing-tab") === name;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach((panel) => {
      const on = panel.getAttribute("data-pricing-panel") === name;
      panel.classList.toggle("is-active", on);
      if (on) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setTab(tab.getAttribute("data-pricing-tab")));
  });

  // Monthly / Yearly (Website panel)
  const billingBtns = root.querySelectorAll("[data-billing]");
  const prices = root.querySelectorAll(".dm-pricing__price[data-price-monthly]");

  const setBilling = (mode) => {
    billingBtns.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-billing") === mode);
    });
    prices.forEach((el) => {
      const val = el.getAttribute(`data-price-${mode}`) || el.getAttribute("data-price-monthly");
      if (val) el.textContent = val;
    });
  };

  billingBtns.forEach((btn) => {
    btn.addEventListener("click", () => setBilling(btn.getAttribute("data-billing")));
  });

  // Custom project calculator
  const calc = root.querySelector("[data-project-calc]");
  if (calc) {
    const typeEl = calc.querySelector('[data-calc="type"]');
    const pagesEl = calc.querySelector('[data-calc="pages"]');
    const pagesVal = calc.querySelector("[data-calc-pages-val]");
    const timelineEl = calc.querySelector('[data-calc="timeline"]');
    const minEl = calc.querySelector("[data-calc-min]");
    const maxEl = calc.querySelector("[data-calc-max]");
    const summaryEl = calc.querySelector("[data-calc-summary]");
    const mailEl = calc.querySelector("[data-calc-mailto]");
    const euro = (n) =>
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(n);

    const recalc = () => {
      const typeOpt = typeEl.options[typeEl.selectedIndex];
      const base = Number(typeOpt.dataset.base || 0);
      const pages = Number(pagesEl.value || 1);
      const pageCost = Math.max(0, pages - 4) * 320;
      let addons = 0;
      const addonLabels = [];
      calc.querySelectorAll("[data-calc-addon]").forEach((box) => {
        if (!box.checked) return;
        const val = Number(box.getAttribute("data-calc-addon") || 0);
        addons += val;
        addonLabels.push(box.parentElement.textContent.trim());
      });
      const timeline = Number(timelineEl.value || 1);
      const subtotal = (base + pageCost + addons) * timeline;
      const min = Math.round(subtotal * 0.9);
      const max = Math.round(subtotal * 1.2);

      if (pagesVal) pagesVal.textContent = String(pages);
      if (minEl) minEl.textContent = euro(min);
      if (maxEl) maxEl.textContent = euro(max);

      if (summaryEl) {
        summaryEl.innerHTML = `
          <li><span>Type</span><strong>${typeOpt.textContent}</strong></li>
          <li><span>Pages / screens</span><strong>${pages}</strong></li>
          <li><span>Add-ons</span><strong>${addonLabels.length ? addonLabels.join(", ") : "None"}</strong></li>
          <li><span>Timeline</span><strong>${timelineEl.options[timelineEl.selectedIndex].textContent}</strong></li>
        `;
      }

      if (mailEl) {
        const subject = encodeURIComponent("Custom project quote");
        const body = encodeURIComponent(
          `Hi Daniel,\n\nI'd like a custom quote.\n\nType: ${typeOpt.textContent}\nPages/screens: ${pages}\nAdd-ons: ${
            addonLabels.length ? addonLabels.join(", ") : "None"
          }\nTimeline: ${timelineEl.options[timelineEl.selectedIndex].textContent}\nEstimated range: ${euro(min)} – ${euro(max)}\n\nProject notes:\n`
        );
        mailEl.href = `mailto:daniel@sacharov.com?subject=${subject}&body=${body}`;
      }
    };

    calc.addEventListener("input", recalc);
    calc.addEventListener("change", recalc);
    recalc();
  }

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    const bits = root.querySelectorAll(
      ".dm-pricing__eyebrow, .dm-pricing__title, .dm-pricing__tabs, .dm-pricing__billing, .dm-pricing__card"
    );
    gsap.fromTo(
      bits,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      }
    );
  }
});
