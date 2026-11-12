// Filters on the Projects section:
// - skill tags (on cards and in Skills) show only projects that use that skill
// - origin chips (EPFL, ETH, Personal) beside the header show projects from that place
// One filter is active at a time; "Show all" or Escape clears it.
(function () {
  const section = document.getElementById("projects");
  if (!section) return;

  const cards = [...section.querySelectorAll(".card")];
  const others = section.querySelector(".other-builds");
  const status = section.querySelector(".filter-status");
  const prefix = status.querySelector(".filter-prefix");
  const label = status.querySelector("strong");
  let active = null; // { type: "tag" | "origin", value, text }

  function matches(card) {
    if (!active) return true;
    if (active.type === "tag") return (card.dataset.tags || "").split(" ").includes(active.value);
    return card.dataset.origin === active.value;
  }

  function apply(next) {
    active = next;
    cards.forEach((c) => { c.hidden = !matches(c); });
    if (others) others.hidden = active !== null;
    document.querySelectorAll(".tag").forEach((b) => {
      b.setAttribute("aria-pressed", String(!!active && active.type === "tag" && b.dataset.tag === active.value));
    });
    document.querySelectorAll(".origin").forEach((b) => {
      b.setAttribute("aria-pressed", String(!!active && active.type === "origin" && b.dataset.origin === active.value));
    });
    status.hidden = active === null;
    if (active) {
      prefix.textContent = active.type === "tag" ? "Projects tagged" : "Projects from";
      label.textContent = active.text;
    }
  }

  const same = (a, b) => a && b && a.type === b.type && a.value === b.value;

  document.addEventListener("click", (e) => {
    const tag = e.target.closest(".tag");
    const origin = e.target.closest(".origin");
    if (tag || origin) {
      const next = tag
        ? { type: "tag", value: tag.dataset.tag, text: "#" + tag.dataset.tag }
        : { type: "origin", value: origin.dataset.origin, text: origin.dataset.label };
      const button = tag || origin;
      const inProjects = section.contains(button);
      // Clicking the active one again clears it, except from Skills (always jumps to projects).
      apply(inProjects && same(active, next) ? null : next);
      if (inProjects) status.scrollIntoView({ block: "nearest" });
      else section.scrollIntoView({ block: "start" });
      return;
    }
    if (e.target.closest(".filter-clear")) apply(null);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && active) apply(null);
  });

  apply(null);
})();
