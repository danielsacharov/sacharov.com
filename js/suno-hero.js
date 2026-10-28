document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#suno-hero");
  if (!root) return;

  const ta = root.querySelector("textarea");
  if (!ta) return;

  const resize = () => {
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  };

  ta.addEventListener("input", resize);
  resize();
});
