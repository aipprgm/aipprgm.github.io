// AIP Applicant Hub. Edit RESOURCES to add or change cards.
const REPO = "aipprgm/aipprgm.github.io"; // used to list PDFs in /files
const DEADLINE_DAYS = 90;

const RESOURCES = [
  {
    type: "doc", icon: "📘", badge: "In progress",
    title: "AIP Work Permit Guide",
    text: "Step-by-step community guide to the AIP work permit. Still being written, so check back often.",
    gdoc: "1f0PJof9dz6Kk0lFj6KCNZFI00cgXm9rhN2PBHky-NoU",
  },
  {
    type: "sheet", icon: "📊",
    title: "AIP data sheet",
    text: "Shared applicant data: timelines and progress reported by the community.",
    gsheet: "196yaxpNtzI4H4cKhUyBKqiNAOzwaX27alAjOFr4V9Dk",
  },
  {
    type: "sheet", icon: "📈", badge: "New",
    title: "AIP data sheet (new)",
    text: "The newest community spreadsheet. Open it online or download it as Excel.",
    gsheet: "1ejD3q611FMy7XxIAktmnq83-FH3eX2OSwlhWTzB-aTE",
  },
  {
    type: "ircc", icon: "🍁",
    title: "If your job changes or your company is sold",
    text: "IRCC instructions for AIP applicants whose responsibilities change or whose employer is sold.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/permanent-residence/economic-classes/atlantic-immigration-program/other.html",
  },
  {
    type: "ircc", icon: "🍁",
    title: "C18 work permit exemption code",
    text: "IRCC rules for the C18 (AIP) work permit, including language test requirements.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/special-initiatives-pilot-project/exemption-code-c18.html#s2.2.1",
  },
  {
    type: "ircc", icon: "🍁",
    title: "Atlantic Immigration Program (official)",
    text: "The official IRCC overview of the program: eligibility, employers and how to apply.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/atlantic-immigration.html",
  },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

/* ---------- Theme ---------- */
const savedTheme = store.get("theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
$("#theme-toggle").addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  const next = dark ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  store.set("theme", next);
});

/* ---------- Mobile menu ---------- */
const menuBtn = $(".menu-btn"), navLinks = $("#nav-links");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") { navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); }
});

/* ---------- Job change: tabs + checklist ---------- */
const tabs = $$('[role="tab"]');
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    $("#" + t.getAttribute("aria-controls")).hidden = !on;
  });
  updateProgress();
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    next.focus(); selectTab(next);
  });
});
$$(".checklist input").forEach((box) => {
  box.checked = store.get("chk-" + box.dataset.item) === "1";
  box.addEventListener("change", () => { store.set("chk-" + box.dataset.item, box.checked ? "1" : "0"); updateProgress(); });
});
function updateProgress() {
  const panel = $(".checklist:not([hidden])");
  const boxes = $$("input", panel);
  const done = boxes.filter((b) => b.checked).length;
  $("#progress-text").textContent = done === boxes.length ? "✓ All documents ready" : `${done} of ${boxes.length} ready`;
}
updateProgress();

/* ---------- 90-day deadline ---------- */
const dateInput = $("#change-date");
const CIRC = 2 * Math.PI * 52;
function renderDeadline() {
  const box = $("#countdown");
  box.classList.remove("warn", "late");
  if (!dateInput.value) return;
  store.set("change-date", dateInput.value);
  const [y, m, d] = dateInput.value.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const deadline = new Date(y, m - 1, d + DEADLINE_DAYS);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const left = Math.round((deadline - today) / 864e5);
  const used = Math.min(Math.max((today - start) / 864e5 / DEADLINE_DAYS, 0), 1);

  $("#deadline-date").textContent = deadline.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "long", day: "numeric" });
  $("#ring-fg").style.strokeDashoffset = CIRC * used;
  if (left < 0) {
    box.classList.add("late");
    $("#days-left").innerHTML = `${-left}<small>days late</small>`;
    $("#deadline-note").textContent = "This deadline has passed. Contact IRCC or a licensed representative as soon as possible.";
  } else {
    if (left <= 21) box.classList.add("warn");
    $("#days-left").innerHTML = `${left}<small>${left === 1 ? "day" : "days"} left</small>`;
    $("#deadline-note").textContent = "Counted as 90 calendar days. Confirm your exact deadline with IRCC.";
  }
}
dateInput.max = new Date().toISOString().slice(0, 10);
dateInput.value = store.get("change-date") || "";
dateInput.addEventListener("input", renderDeadline);
renderDeadline();

/* ---------- Resources ---------- */
function links(r) {
  if (r.gsheet) return {
    open: `https://docs.google.com/spreadsheets/d/${r.gsheet}/edit?usp=sharing`,
    preview: `https://docs.google.com/spreadsheets/d/${r.gsheet}/preview`,
    download: `https://docs.google.com/spreadsheets/d/${r.gsheet}/export?format=xlsx`,
    downloadLabel: "Download Excel",
  };
  if (r.gdoc) return {
    open: `https://docs.google.com/document/d/${r.gdoc}/edit?usp=sharing`,
    preview: `https://docs.google.com/document/d/${r.gdoc}/preview`,
    download: `https://docs.google.com/document/d/${r.gdoc}/export?format=pdf`,
    downloadLabel: "Download PDF",
  };
  return { open: r.url };
}
function esc(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

const cards = $("#cards");
cards.innerHTML = RESOURCES.map((r, i) => {
  const l = links(r);
  return `<article class="card reveal" data-type="${r.type}" data-text="${esc((r.title + " " + r.text).toLowerCase())}">
    <div class="card-top"><span class="card-icon ${r.type}" aria-hidden="true">${r.icon}</span>${r.badge ? `<span class="badge">${r.badge}</span>` : ""}</div>
    <h3>${esc(r.title)}</h3>
    <p>${esc(r.text)}</p>
    <div class="card-actions">
      <a class="primary" href="${l.open}" target="_blank" rel="noopener">Open</a>
      ${l.preview ? `<button data-preview="${i}">Preview</button>` : ""}
      ${l.download ? `<a href="${l.download}">${l.downloadLabel}</a>` : ""}
    </div>
  </article>`;
}).join("");
$("#stat-resources").textContent = RESOURCES.length;

let filter = "all";
function applyFilter() {
  const q = $("#search").value.trim().toLowerCase();
  let shown = 0;
  $$(".card", cards).forEach((c) => {
    const ok = (filter === "all" || c.dataset.type === filter) && (!q || c.dataset.text.includes(q));
    c.hidden = !ok; if (ok) shown++;
  });
  $("#cards-empty").hidden = shown > 0;
}
$("#search").addEventListener("input", applyFilter);
$$(".chip").forEach((chip) => chip.addEventListener("click", () => {
  $$(".chip").forEach((c) => c.classList.toggle("active", c === chip));
  filter = chip.dataset.filter; applyFilter();
}));

/* ---------- Preview dialog ---------- */
const dlg = $("#preview"), frame = $("#preview-frame");
cards.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-preview]");
  if (!btn) return;
  const r = RESOURCES[btn.dataset.preview], l = links(r);
  $("#preview-title").textContent = r.title;
  $("#preview-open").href = l.open;
  frame.src = l.preview;
  dlg.showModal();
});
$("#preview-close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener("close", () => { frame.src = "about:blank"; });

/* ---------- Files: auto-list PDFs from the repo's /files folder ---------- */
(async function loadFiles() {
  const list = $("#file-list");
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/files`);
    if (!res.ok) throw new Error(res.status);
    const files = (await res.json()).filter((f) => f.type === "file" && /\.(pdf|xlsx?|docx?)$/i.test(f.name));
    if (!files.length) { list.innerHTML = '<li class="muted">No files yet. Check back soon.</li>'; return; }
    list.innerHTML = files.map((f) => {
      const ext = f.name.split(".").pop().toUpperCase();
      const name = f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      const kb = f.size > 1e6 ? (f.size / 1e6).toFixed(1) + " MB" : Math.ceil(f.size / 1e3) + " KB";
      return `<li><a href="files/${encodeURIComponent(f.name)}" target="_blank" rel="noopener"><span class="pdf">${ext}</span>${esc(name)}<span class="size">${kb}</span></a></li>`;
    }).join("");
  } catch {
    list.innerHTML = '<li class="muted">Files could not be loaded right now. Please try again later.</li>';
  }
})();

/* ---------- Reveal on scroll ---------- */
const io = "IntersectionObserver" in window && new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.08 });
$$(".reveal, .tool-panel, .alert, .community").forEach((el) => {
  el.classList.add("reveal");
  io ? io.observe(el) : el.classList.add("in");
});
