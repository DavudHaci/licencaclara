const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("#site-nav");

toggle?.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

const dialog = document.getElementById("age-dialog");
const pending = { href: "" };

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-outbound]");
  if (!link || !dialog) return;
  if (localStorage.getItem("lc-age") === "18") return;
  event.preventDefault();
  pending.href = link.href;
  dialog.showModal();
});

document.getElementById("age-accept")?.addEventListener("click", () => {
  localStorage.setItem("lc-age", "18");
  if (pending.href) window.open(pending.href, "_blank", "noopener,noreferrer");
  pending.href = "";
});

document.getElementById("age-decline")?.addEventListener("click", () => {
  pending.href = "";
});

document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const buttons = [...group.querySelectorAll("[data-filter]")];
  const table = document.querySelector(group.dataset.filterGroup);
  if (!table) return;
  const rows = [...table.querySelectorAll("tbody tr")];
  const empty = table.parentElement.querySelector(".filter-empty");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      const value = button.dataset.filter;
      let visible = 0;
      rows.forEach((row) => {
        const tags = (row.dataset.tags || "").split(" ");
        const show = value === "todos" || tags.includes(value);
        row.hidden = !show;
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible !== 0;
    });
  });
});
