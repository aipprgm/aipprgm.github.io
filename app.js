// AIP Applicant Hub.
// To change content, edit TASKS (the "What do you need?" list) or RESOURCES (sheets, guides, IRCC links).
const REPO = "aipprgm/aipprgm.github.io"; // used to list files in /files
const DEADLINE_DAYS = 90;
const IRCC = "https://www.canada.ca/en/immigration-refugees-citizenship";

// Ordered by how often the group asks about each topic.
const TASKS = [
  { title: "Track my application", desc: "Check your status, and compare AOR, medical and PPR dates with others", href: "#res-aip-sheet",
    keys: "status portal tracker aor ppr ita gcms timeline processing" },
  { title: "Work permit (C18) or SOWP", desc: "C18 rules, plus the restoration, reconsideration and SOWP tracker", href: "#res-c18-tracker",
    keys: "work permit wp c18 sowp spouse spousal open restoration reconsideration language test" },
  { title: "PR confirmation and landing", desc: "Official AIP guidance on confirmation of PR (COPR) and landing", href: `${IRCC}/services/immigrate-canada/atlantic-immigration.html`,
    keys: "pr card landing copr confirmation permanent residence" },
  { title: "How long will it take?", desc: "IRCC processing times, and the group's real timelines", href: `${IRCC}/services/application/check-processing-times.html`,
    keys: "timeline how long processing time wait" },
  { title: "Medical exam", desc: "IRCC instructions for immigration medical exams", href: `${IRCC}/services/application/medical-police/medical-exams.html`,
    keys: "medical exam panel physician upfront" },
  { title: "My job or employer changed", desc: "Documents to send and your 90-day deadline", href: "#job-change",
    keys: "job change employer endorsement imm 0157 offer sold new employer role" },
  { title: "Contact IRCC", desc: "The IRCC web form for questions and updates to your file", href: `${IRCC}/corporate/contact-ircc/web-form.html`,
    keys: "webform web form contact address change update" },
  { title: "Ask the group", desc: "Join the WhatsApp group and ask anything", href: "#community",
    keys: "whatsapp group ask help admin" },
];

const RESOURCES = [
  { group: "Community sheets", id: "res-aip-sheet", title: "AIP data sheet",
    desc: "Timelines and progress shared by applicants.", gsheet: "196yaxpNtzI4H4cKhUyBKqiNAOzwaX27alAjOFr4V9Dk",
    keys: "timeline aor ppr tracker data" },
  { group: "Community sheets", id: "res-c18-tracker", tag: "New", title: "C18 restoration / reconsideration SOWP tracker",
    desc: "C18 work permit restoration and reconsideration cases, and spousal open work permits.", gsheet: "1ejD3q611FMy7XxIAktmnq83-FH3eX2OSwlhWTzB-aTE",
    keys: "c18 restoration reconsideration sowp spouse work permit" },
  { group: "Guides", id: "res-wp-guide", tag: "In progress", title: "AIP Work Permit Guide",
    desc: "Step-by-step community guide to the AIP work permit.", gdoc: "1f0PJof9dz6Kk0lFj6KCNZFI00cgXm9rhN2PBHky-NoU",
    keys: "work permit guide c18 how to" },
  { group: "Official IRCC pages", title: "Atlantic Immigration Program",
    desc: "Eligibility, designated employers and how to apply.", url: `${IRCC}/services/immigrate-canada/atlantic-immigration.html`,
    keys: "official eligibility apply" },
  { group: "Official IRCC pages", title: "If your job changes or your company is sold",
    desc: "What to do when your responsibilities, employer or its owner changes.",
    url: `${IRCC}/corporate/publications-manuals/operational-bulletins-manuals/permanent-residence/economic-classes/atlantic-immigration-program/other.html`,
    keys: "job change sold employer endorsement" },
  { group: "Official IRCC pages", title: "C18 work permit exemption code",
    desc: "Rules for the AIP work permit, including the language test.",
    url: `${IRCC}/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/special-initiatives-pilot-project/exemption-code-c18.html#s2.2.1`,
    keys: "c18 work permit language test" },
  { group: "Official IRCC pages", title: "Check processing times",
    desc: "IRCC's current estimates for each application type.", url: `${IRCC}/services/application/check-processing-times.html`,
    keys: "processing time timeline" },
  { group: "Official IRCC pages", title: "Check your application status",
    desc: "Sign in to see where your application is.", url: `${IRCC}/services/application/check-status.html`,
    keys: "status tracker portal" },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ext = (href) => href.startsWith("http") ? ' target="_blank" rel="noopener"' : "";

/* ---------- Theme ---------- */
const saved = store.get("theme");
if (saved) document.documentElement.dataset.theme = saved;
$("#theme-toggle").addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  store.set("theme", next);
});

/* ---------- Tasks ---------- */
$("#tasks").innerHTML = TASKS.map((t, i) => `<li><a href="${t.href}"${ext(t.href)}>
  <span class="task-num">${i + 1}</span>
  <span><span class="task-title">${esc(t.title)}</span><span class="task-desc">${esc(t.desc)}</span></span></a></li>`).join("");

/* ---------- Resources ---------- */
function links(r) {
  if (r.gsheet) { const b = `https://docs.google.com/spreadsheets/d/${r.gsheet}`;
    return { open: `${b}/edit?usp=sharing`, preview: `${b}/preview`, download: `${b}/export?format=xlsx`, dl: "Download Excel" }; }
  if (r.gdoc) { const b = `https://docs.google.com/document/d/${r.gdoc}`;
    return { open: `${b}/edit?usp=sharing`, preview: `${b}/preview`, download: `${b}/export?format=pdf`, dl: "Download PDF" }; }
  return { open: r.url };
}
const groups = [...new Set(RESOURCES.map((r) => r.group))];
$("#res-groups").innerHTML = groups.map((g) => `<div><h3>${esc(g)}</h3><ul class="rows">${
  RESOURCES.map((r, i) => [r, i]).filter(([r]) => r.group === g).map(([r, i]) => {
    const l = links(r);
    return `<li class="row"${r.id ? ` id="${r.id}"` : ""}>
      <div class="row-main"><span class="row-title"><a href="${l.open}" target="_blank" rel="noopener">${esc(r.title)}</a></span>${r.tag ? `<span class="tag">${esc(r.tag)}</span>` : ""}
      <span class="row-desc">${esc(r.desc)}</span></div>
      <div class="row-actions">${l.preview ? `<button class="link-btn" data-preview="${i}">Preview</button>` : ""}${l.download ? `<a href="${l.download}">${l.dl}</a>` : ""}</div>
    </li>`;
  }).join("")}</ul></div>`).join("");

/* ---------- Preview ---------- */
const pv = $("#preview"), frame = $("#preview-frame");
$("#res-groups").addEventListener("click", (e) => {
  const b = e.target.closest("[data-preview]"); if (!b) return;
  const r = RESOURCES[b.dataset.preview], l = links(r);
  $("#preview-title").textContent = r.title; $("#preview-open").href = l.open; frame.src = l.preview; pv.showModal();
});
$("#preview-close").addEventListener("click", () => pv.close());
pv.addEventListener("click", (e) => { if (e.target === pv) pv.close(); });
pv.addEventListener("close", () => { frame.src = "about:blank"; });

/* ---------- Job change ---------- */
function currentList() { return $(`.checklist[data-key="${$('input[name="change"]:checked').value}"]`); }
function updateProgress() {
  const boxes = $$("input", currentList()), done = boxes.filter((b) => b.checked).length;
  $("#progress-text").textContent = done === boxes.length ? "All documents ready" : `${done} of ${boxes.length} ready`;
}
$$('input[name="change"]').forEach((r) => r.addEventListener("change", () => {
  $$(".checklist").forEach((l) => { l.hidden = l.dataset.key !== r.value; });
  $("#new-hint").hidden = r.value !== "new";
  updateProgress();
}));
$$(".checklist input").forEach((b) => {
  b.checked = store.get("chk-" + b.dataset.item) === "1";
  b.addEventListener("change", () => { store.set("chk-" + b.dataset.item, b.checked ? "1" : "0"); updateProgress(); });
});
updateProgress();

const dateInput = $("#change-date");
function renderDeadline() {
  const box = $("#deadline"); box.classList.remove("warn", "late");
  if (!dateInput.value) return;
  store.set("change-date", dateInput.value);
  const [y, m, d] = dateInput.value.split("-").map(Number);
  const start = new Date(y, m - 1, d), deadline = new Date(y, m - 1, d + DEADLINE_DAYS);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const left = Math.round((deadline - today) / 864e5);
  const used = Math.min(Math.max((today - start) / 864e5 / DEADLINE_DAYS, 0), 1);
  const when = deadline.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  $("#bar-fill").style.width = used * 100 + "%";
  if (left < 0) {
    box.classList.add("late");
    $("#deadline-date").textContent = `Deadline passed ${-left} day${left === -1 ? "" : "s"} ago (${when}).`;
    $("#deadline-note").textContent = "Contact IRCC or a licensed representative as soon as possible.";
  } else {
    if (left <= 21) box.classList.add("warn");
    $("#deadline-date").textContent = `Send by ${when}: ${left} day${left === 1 ? "" : "s"} left.`;
    $("#deadline-note").textContent = "Counted as 90 calendar days. Confirm your exact deadline with IRCC.";
  }
}
dateInput.max = new Date().toISOString().slice(0, 10);
dateInput.value = store.get("change-date") || "";
dateInput.addEventListener("input", renderDeadline);
renderDeadline();

/* ---------- Files from the repo's /files folder ---------- */
const FILES = [];
(async () => {
  const list = $("#file-list");
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/files`);
    if (!res.ok) throw new Error(res.status);
    const files = (await res.json()).filter((f) => f.type === "file" && /\.(pdf|xlsx?|docx?)$/i.test(f.name));
    if (!files.length) { list.innerHTML = '<li class="row muted">No files yet.</li>'; return; }
    list.innerHTML = files.map((f) => {
      const name = f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      const size = f.size > 1e6 ? (f.size / 1e6).toFixed(1) + " MB" : Math.ceil(f.size / 1e3) + " KB";
      FILES.push({ title: name, desc: "File", href: `files/${encodeURIComponent(f.name)}`, keys: "pdf file document" });
      return `<li class="row"><span class="row-main"><span class="file-type">${f.name.split(".").pop().toUpperCase()}</span><a href="files/${encodeURIComponent(f.name)}" target="_blank" rel="noopener">${esc(name)}</a></span><span class="hint">${size}</span></li>`;
    }).join("");
  } catch {
    list.innerHTML = '<li class="row muted">Files could not be loaded right now. Please try again later.</li>';
  }
})();

/* ---------- Search (press / or Ctrl/Cmd+K) ---------- */
const SECTIONS = [
  { title: "Start here", desc: "What do you need?", href: "#start", keys: "help start" },
  { title: "C18 language test notice", desc: "Apply or renew with a valid language test", href: "#top", keys: "c18 language test ielts celpip clb tef" },
  { title: "Your 90-day deadline", desc: "Job changes", href: "#job-change", keys: "deadline 90 days job change" },
  { title: "Files", desc: "PDFs shared by the group", href: "#files", keys: "pdf files download" },
];
function index() {
  return [
    ...TASKS.map((t) => ({ ...t, desc: t.desc })),
    ...RESOURCES.map((r) => ({ title: r.title, desc: r.group, href: r.id ? "#" + r.id : links(r).open, keys: r.keys + " " + r.desc })),
    ...SECTIONS, ...FILES,
  ];
}
const sDlg = $("#search"), sIn = $("#search-input"), sOut = $("#search-results");
let hits = [], sel = 0;
function renderSearch() {
  const words = sIn.value.toLowerCase().split(/\s+/).filter(Boolean);
  hits = index().filter((x) => { const hay = `${x.title} ${x.desc} ${x.keys || ""}`.toLowerCase(); return words.every((w) => hay.includes(w)); }).slice(0, 12);
  sel = 0;
  sOut.innerHTML = hits.length
    ? hits.map((h, i) => `<li><a href="${h.href}"${ext(h.href)} role="option" aria-selected="${i === sel}">${esc(h.title)}<small>${esc(h.desc)}</small></a></li>`).join("")
    : '<li class="none">Nothing found. Try another word, or ask the group.</li>';
}
function openSearch() { sIn.value = ""; renderSearch(); sDlg.showModal(); sIn.focus(); }
$("#open-search").addEventListener("click", openSearch);
$("#open-search-m").addEventListener("click", openSearch);
$("#search-close").addEventListener("click", () => sDlg.close());
sDlg.addEventListener("click", (e) => { if (e.target === sDlg || e.target.closest("a")) sDlg.close(); });
sIn.addEventListener("input", renderSearch);
sIn.addEventListener("keydown", (e) => {
  const opts = $$("a", sOut);
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault(); if (!opts.length) return;
    sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length;
    opts.forEach((o, i) => o.setAttribute("aria-selected", i === sel)); opts[sel].scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter" && opts[sel]) { e.preventDefault(); opts[sel].click(); }
});
document.addEventListener("keydown", (e) => {
  const typing = /input|textarea|select/i.test(document.activeElement.tagName);
  if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) { e.preventDefault(); openSearch(); }
});

/* ---------- Highlight the section in view ---------- */
const navMap = new Map();
$$('.nav-links a, .bottom-bar a').forEach((a) => {
  const id = a.getAttribute("href").slice(1);
  navMap.set(id, [...(navMap.get(id) || []), a]);
});
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    $$(".current").forEach((a) => { a.classList.remove("current"); a.removeAttribute("aria-current"); });
    (navMap.get(en.target.id) || []).forEach((a) => { a.classList.add("current"); a.setAttribute("aria-current", "true"); });
  }), { rootMargin: "-40% 0px -55% 0px" });
  navMap.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
}
