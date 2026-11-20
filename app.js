// AIP Applicant Hub.
// To change content, edit TASKS (the "What do you need?" list) or RESOURCES (sheets, guides, IRCC links).
const REPO = "aipprgm/aipprgm.github.io"; // used to list files in /files
const DEADLINE_DAYS = 90;
const IRCC = "https://www.canada.ca/en/immigration-refugees-citizenship";

// Ordered by how often the group asks about each topic.
const TASKS = [
  { title: "Track my application", desc: "AIP has no online status tracker. Compare your dates with others in the data sheet", href: "#res-aip-sheet",
    keys: "status portal tracker aor ppr ita gcms timeline processing" },
  { title: "Work permit (C18) or SOWP", desc: "C18 checklist for first applications and renewals", href: "#c18",
    keys: "work permit wp c18 wpsl support letter referral imm 0156 renew renewal extension language test" },
  { title: "PR confirmation and landing", desc: "Official AIP guidance on confirmation of PR (COPR) and landing", href: `${IRCC}/services/immigrate-canada/atlantic-immigration.html`,
    keys: "pr card landing copr confirmation permanent residence" },
  { title: "How long will it take?", desc: "IRCC processing times (choose Atlantic Immigration Program), and the group's real timelines", href: `${IRCC}/services/application/check-processing-times.html`,
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
  { group: "Guides", title: "Settle in Canada FAQ (eCOPR)", tag: "Inland",
    desc: "Community FAQ on eCOPR and virtual landing for applicants already in Canada.", url: "https://settleincanada.netlify.app/faq",
    keys: "ecopr virtual landing portal 1 portal 2 inland pr card faq" },
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
  { title: "What's usually in an ADR", desc: "Additional Document Request: common items", href: "#adr", keys: "adr additional document request schedule a pay stubs reference letter imm 5669 imm 5406 family information" },
  { title: "Start here", desc: "What do you need?", href: "#start", keys: "help start" },
  { title: "C18 work permit checklist", desc: "Documents, fees and renewals", href: "#c18", keys: "c18 work permit wpsl support letter referral imm 0156 offer of employment number compliance fee renew extension language test ielts celpip clb tef eca bowp" },
  { title: "Your 90-day deadline", desc: "Job changes", href: "#job-change", keys: "deadline 90 days job change" },
  { title: "Abbreviations", desc: "AOR, PAL, ADR, FD, WPSL, SOWP and more", href: "#journey", keys: "glossary terms abbreviations meaning aor pal adr fd ppr copr ecopr wpsl sowp bowp eca clb teer" },
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
    ? hits.map((h, i) => `<li><a href="${h.href}"${ext(h.href)} class="${i === sel ? "active" : ""}">${esc(h.title)}<small>${esc(h.desc)}</small></a></li>`).join("")
    : '<li class="none">Nothing found. Try another word, or ask the group.</li>';
  $("#search-status").textContent = hits.length ? `${hits.length} result${hits.length === 1 ? "" : "s"}. Use the arrow keys and Enter.` : "No results.";
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
    opts.forEach((o, i) => o.classList.toggle("active", i === sel)); $("#search-status").textContent = opts[sel].textContent; opts[sel].scrollIntoView({ block: "nearest" });
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

/* ---------- Journey map ---------- */
// General stages of the AIP PR route. Order of medicals/biometrics can vary; always follow IRCC's letters.
// The last stages differ: applicants inside Canada land virtually (Portal 1, Portal 2, eCOPR) with no PPR;
// applicants outside Canada get PPR, then COPR and landing at a port of entry.
const AIP = `${IRCC}/services/immigrate-canada/atlantic-immigration.html`;
const FAQ = "https://settleincanada.netlify.app/faq";
const COMMON = [
  { short: "Job offer", title: "Job offer, or already working for a designated employer",
    text: "Your job offer, or the job you already have, must be with an employer designated by an Atlantic province.",
    links: [["Official AIP page", AIP]] },
  { short: "Endorsement", title: "Provincial endorsement",
    text: "Your employer works with the province to endorse your job offer.",
    links: [["Official AIP page", AIP], ["If your job changes", "#job-change"]] },
  { short: "Work permit", title: "C18 work permit (if you need one)",
    text: "Some applicants get a C18 work permit to work for their employer while PR is processed. Most members apply for PR first. IRCC only requires it if your endorsement certificate has expired: you must have applied for PR before it expired.",
    links: [["C18 checklist", "#c18"], ["C18 tracker", "#res-c18-tracker"], ["Work Permit Guide", "#res-wp-guide"]] },
  { short: "Apply for PR", title: "Submit your PR application",
    text: "You apply online for permanent residence with your endorsement and documents.",
    links: [["Official AIP page", AIP]] },
  { short: "AOR", stat: ["Applied>AOR"],  title: "Acknowledgement of receipt (AOR)",
    text: "IRCC confirms it received your application. AIP has no online status tracker: watch your linked application in your GCKey account, and compare dates in the data sheet.",
    links: [["AIP data sheet", "#res-aip-sheet"], ["IRCC processing times (choose AIP)", `${IRCC}/services/application/check-processing-times.html`]] },
  { short: "Medicals & biometrics", title: "Medical exam and biometrics",
    text: "IRCC asks for your medical exam and biometrics. The order can vary, so follow the letters you receive.",
    links: [["Medical exams", `${IRCC}/services/application/medical-police/medical-exams.html`], ["AIP data sheet", "#res-aip-sheet"]] },
  { short: "PAL", stat: ["AOR>PAL"],  title: "Pre-Arrival Letter (PAL)",
    text: "IRCC's letter inviting you to free pre-arrival settlement services. Your file is still in processing; the group often sees it after eligibility checks.",
    links: [["AIP data sheet", "#res-aip-sheet"], ["Ask the group", "#community"]] },
  { short: "ADR (optional)", stat: ["AOR>ADR"],  optional: true, title: "Additional Document Request (ADR), if you get one",
    text: "Not everyone gets one, and it can come before or after PAL. IRCC asks for updated documents through your portal. Answer by the deadline in the letter.",
    links: [["What ADRs usually ask for", "#adr"], ["Ask the group", "#community"]] },
  { short: "Final decision", stat: ["PAL>FD"],  title: "Final decision (FD)",
    text: "IRCC finishes reviewing your file and approves it. Inside Canada, the PR portal invitation follows; outside Canada, a request for your passport (PPR).",
    links: [["AIP data sheet", "#res-aip-sheet"], ["Ask the group", "#community"]] },
];
const ENDINGS = {
  inland: [
    { short: "Portal 1 & 2", stat: ["FD>P1", "P1>P2"],  title: "PR portal: Portal 1 and Portal 2",
      text: "Inside Canada, you land virtually. In Portal 1 you confirm you are in Canada; in Portal 2 you send your photo and address.",
      links: [["eCOPR FAQ", FAQ], ["Ask the group", "#community"]] },
    { short: "eCOPR", stat: ["P2>eCOPR", "Applied>eCOPR"],  title: "eCOPR: you are a permanent resident",
      text: "Your electronic Confirmation of Permanent Residence arrives in the portal. That is your virtual landing. Welcome!",
      links: [["eCOPR FAQ", FAQ], ["Ask the group", "#community"]] },
  ],
  outland: [
    { short: "PPR", title: "Final steps (PPR)",
      text: "IRCC asks for final details and documents before confirming your PR.",
      links: [["Contact IRCC", `${IRCC}/corporate/contact-ircc/web-form.html`], ["AIP data sheet", "#res-aip-sheet"], ["Ask the group", "#community"]] },
    { short: "COPR & landing", title: "Confirmation of PR and landing",
      text: "Outside Canada, you receive your COPR and complete landing when you arrive at a port of entry. Welcome!",
      links: [["Official AIP page", AIP], ["Ask the group", "#community"]] },
  ],
};
const stopsEl = $("#stops"), card = $("#stage-card"), done = $("#route-done"), routeEl = $("#route");
let where = store.get("where") === "outland" ? "outland" : "inland";
let STAGES = [], stage = null;
const len = done.getTotalLength ? done.getTotalLength() : 1200;
done.style.setProperty("--len", len); done.style.setProperty("--off", len);
const linkHtml = (ls) => `<p class="stage-links">${ls.map(([t, h]) => `<a href="${h}"${ext(h)}>${esc(t)}</a>`).join("")}</p>`;

function buildRoute() {
  STAGES = [...COMMON, ...ENDINGS[where]];
  routeEl.style.setProperty("--n", STAGES.length);
  stopsEl.innerHTML = STAGES.map((s, i) =>
    `<li><button class="stop${s.optional ? " optional" : ""}" role="radio" aria-checked="false" tabindex="-1" data-i="${i}"><span class="dot"></span>${esc(s.short)}</button></li>`).join("");
  if (stage !== null) setStage(Math.min(stage, STAGES.length - 1), false);
  else { card.innerHTML = ""; $(".stop", stopsEl).tabIndex = 0; }
}
let STATS = null;
const stepName = (k) => k.replace(">", " → ");
function statHtml(s) {
  if (!STATS || !s.stat) return "";
  const rows = s.stat.map((k) => [k, STATS.steps[k]]).filter(([, v]) => v);
  if (!rows.length) return "";
  return `<div class="stat"><p class="stat-label">From the group's data sheet</p>${rows.map(([k, v]) =>
    `<p><strong>${stepName(k)}: about ${v.median} days</strong> <span>usually ${v.low}–${v.high} days</span></p>`).join("")}
    ${s.stat[0] === "Applied>AOR" && rows[0][1].waitingMedian ? `<p>${rows[0][1].waiting} members are still waiting for their AOR, about ${rows[0][1].waitingMedian} days so far.</p>` : ""}
    <p class="stat-note">Based on the ${rows[0][1].n} most recent reports. Every file is different.</p></div>`;
}
function setStage(i, save = true, scroll = true) {
  stage = i;
  $$(".stop", stopsEl).forEach((b, j) => {
    b.setAttribute("aria-checked", j === i); b.tabIndex = j === i ? 0 : -1; b.classList.toggle("done", j < i);
  });
  done.style.setProperty("--off", len * (1 - (i + 0.5) / STAGES.length));
  const s = STAGES[i], n = STAGES[i + 1];
  card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
  card.innerHTML = `<div><p class="label">You are here · ${i + 1} of ${STAGES.length}</p><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${statHtml(s)}${linkHtml(s.links)}</div>` +
    (n ? `<div class="next"><p class="label">Up next</p><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p>${linkHtml(n.links)}</div>`
       : `<div class="next"><p class="label">Done</p><h3>You made it</h3><p>Share your timeline in the data sheet to help the next applicant.</p>${linkHtml([["AIP data sheet", "#res-aip-sheet"]])}</div>`);
  if (save) store.set("stage", i);
  seaLevel();
  if (scroll) $$(".stop", stopsEl)[i].scrollIntoView({ block: "nearest", inline: "center", behavior: save ? "smooth" : "auto" });
}
// The route line is wavy, so its height differs at each stage. Find where the
// line is under the ship (drawn 34px left of the current stop's centre) and
// set --sea on that list item so the ship, waves and wake sit on the line.
const routePath = $("#route-path");
function seaLevel() {
  $$(".stops li", stopsEl).forEach((li) => li.style.removeProperty("--sea"));
  const b = $('.stop[aria-checked="true"]', stopsEl), ctm = routePath.getScreenCTM && routePath.getScreenCTM();
  if (!b || !ctm) return;
  const r = b.getBoundingClientRect(), x = r.left + r.width / 2 - 34, L = routePath.getTotalLength();
  let best = null;
  for (let k = 0; k <= 200; k++) {
    const p = routePath.getPointAtLength(L * k / 200), s = new DOMPoint(p.x, p.y).matrixTransform(ctm);
    if (!best || Math.abs(s.x - x) < Math.abs(best.x - x)) best = s;
  }
  b.parentElement.style.setProperty("--sea", `${Math.round(best.y - (r.top + 19))}px`);
}
let seaFrame;
addEventListener("resize", () => { cancelAnimationFrame(seaFrame); seaFrame = requestAnimationFrame(seaLevel); });
stopsEl.addEventListener("click", (e) => { const b = e.target.closest(".stop"); if (b) setStage(+b.dataset.i); });
stopsEl.addEventListener("keydown", (e) => {
  if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  const cur = +document.activeElement.dataset.i, next = Math.max(0, Math.min(STAGES.length - 1, cur + (e.key === "ArrowRight" ? 1 : -1)));
  e.preventDefault(); setStage(next); $$(".stop", stopsEl)[next].focus();
});
$$('input[name="where"]').forEach((r) => {
  r.checked = r.value === where;
  r.addEventListener("change", () => { where = r.value; store.set("where", where); buildRoute(); });
});
const savedStage = store.get("stage");
if (savedStage !== null) stage = +savedStage;
buildRoute();
SECTIONS.push({ title: "Your AIP journey", desc: "Pick your stage and see what's next", href: "#journey",
  keys: "journey stage next step route where am i aor ppr copr ecopr portal 1 portal 2 landing inland outland" });

/* ---------- Menu (tablet and phone) ---------- */
const menuBtn = $("#menu-btn"), menu = $("#mobile-menu");
function setMenu(open, focusBack = false) {
  menu.hidden = !open; menuBtn.setAttribute("aria-expanded", open);
  if (open) $("a", menu).focus(); else if (focusBack) menuBtn.focus();
}
menuBtn.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) setMenu(false, true); });
document.addEventListener("click", (e) => { if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false); });
$$("a", menu).forEach((a) => { const id = a.getAttribute("href").slice(1); navMap.set(id, [...(navMap.get(id) || []), a]); });

/* ---------- My document tracker (saved on this device) ---------- */
const DOC_LISTS = {
  c18: { label: "C18 first application", items: [
    "Work Permit Support Letter (WPSL) from the province",
    "Offer of employment number from my employer (starts with “A”)",
    "Signed IMM 0156 undertaking",
    "Education credentials (plus an ECA if I studied outside Canada)",
    "Language test results less than 2 years old",
    "Proof of work experience (letters of employment)",
    "The above combined into one “Client information” PDF, 4 MB max",
    "Passport valid for at least 2 more years",
    "Digital photo",
    "Current permit, if I'm in Canada",
    "$155 fee ready (plus $85 for biometrics if asked)",
  ] },
  c18renew: { label: "C18 renewal", items: [
    "New offer of employment number (employer pays the $230 fee again)",
    "My AOR, if my endorsement certificate has expired",
    "Passport valid for at least 2 more years",
    "Updated WPSL and a new IMM 0156, only if I changed employer",
    "$155 fee ready",
  ] },
  adr: { label: "ADR", items: [
    "Updated Schedule A (IMM 5669), dates checked against my original",
    "Employment reference letter on letterhead (duties, hours, wage, start date)",
    "Pay stubs for the last 6 months",
    "T4s or notices of assessment",
    "Military service details (IMM 5546), if it applies",
    "Updated IMM 0157 or endorsement, if my job changed",
    "Family Information form (IMM 5406)",
    "Police certificates, if asked",
    "Letter of explanation for any gaps or corrections",
  ] },
  job: { label: "Job change", items: [
    "Updated provincial endorsement certificate",
    "Updated Offer of Employment form (IMM 0157)",
    "Both sent to IRCC by web form within 90 days of the change",
  ] },
};
(function docTracker() {
  const pick = $("#docs-pick"), list = $("#docs-list"), prog = $("#docs-progress");
  pick.insertAdjacentHTML("beforeend", Object.entries(DOC_LISTS).map(([k, l]) =>
    `<label><input type="radio" name="docs" value="${k}"> ${esc(l.label)}</label>`).join(""));
  let cur = DOC_LISTS[store.get("docs-list")] ? store.get("docs-list") : "c18";
  const key = (i) => `doc-${cur}-${i}`;
  function render() {
    $$('input[name="docs"]', pick).forEach((r) => { r.checked = r.value === cur; });
    list.innerHTML = DOC_LISTS[cur].items.map((t, i) =>
      `<li><label><input type="checkbox" data-i="${i}"${store.get(key(i)) === "1" ? " checked" : ""}> ${esc(t)}</label></li>`).join("");
    count();
  }
  function count() {
    const n = $$("input:checked", list).length, all = DOC_LISTS[cur].items.length;
    prog.textContent = n === all ? `All ${all} ready.` : `${n} of ${all} ready`;
  }
  pick.addEventListener("change", (e) => { cur = e.target.value; store.set("docs-list", cur); render(); });
  list.addEventListener("change", (e) => { store.set(key(e.target.dataset.i), e.target.checked ? "1" : "0"); count(); });
  $("#docs-clear").addEventListener("click", () => { DOC_LISTS[cur].items.forEach((_, i) => store.set(key(i), "0")); render(); });
  $("#docs-print").addEventListener("click", () => {
    document.body.classList.add("print-docs"); window.print(); document.body.classList.remove("print-docs");
  });
  render();
})();
SECTIONS.push({ title: "My document tracker", desc: "Tick off C18, ADR and job-change documents", href: "#my-docs",
  keys: "my documents tracker checklist tick progress print c18 renewal adr job change" });

/* ---------- Live tracker: estimate, weekly movement, cohorts ---------- */
const DAY_MS = 864e5;
const fmtDay = (d) => new Date(d * DAY_MS).toLocaleDateString("en-CA", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" });
const fmtMonth = (d) => new Date(d * DAY_MS).toLocaleDateString("en-CA", { timeZone: "UTC", month: "short", year: "numeric" });
const STAGE_NAMES = { AOR: "AOR", ADR: "ADR", PAL: "PAL", FD: "Final decision", P1: "Portal 1", P2: "Portal 2", eCOPR: "eCOPR" };
const MOVED_NAMES = { AOR: ["AOR", "AORs"], ADR: ["ADR", "ADRs"], PAL: ["PAL", "PALs"], FD: ["final decision", "final decisions"], P1: ["Portal 1 invitation", "Portal 1 invitations"], P2: ["Portal 2 completed", "Portal 2s completed"], eCOPR: ["eCOPR", "eCOPRs"] };
const EST_TARGETS = { Applied: ["AOR", "PAL", "FD", "P1", "eCOPR"], AOR: ["PAL", "FD", "P1", "eCOPR"] };

const BUFFER_MIN = 1.15; // at least 15% on the late end of every range
// IRCC's numbers for the month an application was sent; finish = IRCC's update date + months left.
function irccMonth(appliedDay) {
  const ir = STATS && STATS.ircc;
  if (!ir) return null;
  const d = new Date(appliedDay * DAY_MS), m = ir.months[`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`];
  if (!m) return null;
  return { ...m, finish: m.left !== null && ir.updated ? ir.updated + Math.round(m.left * 30.44) : null };
}

// Your place in the queue (IRCC plus Data Sheet): IRCC's people-ahead and months-left for one application month,
// a combined eCOPR estimate from both sources, the group's progress for that month and this week's PAL months.
// The month is picked with two short native selects (Year, Month) rather than one long list:
// they stay small as months are added and work with keyboards, screen readers and phone pickers.
let queueBound = false, queueSet = null;
const MONTH_NAMES = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2000, i)).toLocaleDateString("en-CA", { timeZone: "UTC", month: "long" }));
function renderQueue(st) {
  const ir = st.ircc, box = $("#queue");
  if (!ir || !Object.keys(ir.months).length) { box.hidden = true; return; }
  const ySel = $("#queue-year"), mSel = $("#queue-mon"), out = $("#queue-out");
  const keys = Object.keys(ir.months).filter((k) => k >= "2024-01").sort();
  const years = [...new Set(keys.map((k) => k.slice(0, 4)))];
  // Month options for a year: only months IRCC has published.
  const fillMonths = (y, want) => {
    const ms = keys.filter((k) => k.startsWith(y)).map((k) => k.slice(5));
    mSel.innerHTML = ms.map((m) => `<option value="${m}">${MONTH_NAMES[+m - 1]}</option>`).join("");
    mSel.value = ms.includes(want) ? want : ms[ms.length - 1];
  };
  const set = (k) => {
    if (!keys.includes(k)) return false;
    ySel.value = k.slice(0, 4); fillMonths(k.slice(0, 4), k.slice(5)); return true;
  };
  const current = ySel.value && mSel.value ? `${ySel.value}-${mSel.value}` : null;
  ySel.innerHTML = years.map((y) => `<option value="${y}">${y}</option>`).join("");
  if (!set(current) && !set(store.get("queue-month") || "")) set(keys[Math.max(0, keys.length - 13)]);
  function show() {
    const st = STATS, ir = st.ircc;
    const k = `${ySel.value}-${mSel.value}`, m = ir.months[k];
    if (!m) return;
    store.set("queue-month", k);
    const c = st.cohorts.find((x) => `${x.year}-${String(x.month + 1).padStart(2, "0")}` === k);
    const behind = m.ahead && ir.waiting ? Math.max(0, Math.min(100, Math.round((1 - m.ahead / ir.waiting) * 100))) : null;
    const finish = m.left !== null && ir.updated ? ir.updated + Math.round(m.left * 30.44) : null;
    const pal = st.moved.find((x) => x.stage === "PAL");
    // Combined eCOPR estimate: the early end is the group's typical total from the middle of the month,
    // the late end is the later of IRCC's finish date and the group's slow end.
    const mid = Date.UTC(+k.slice(0, 4), +k.slice(5) - 1, 15) / DAY_MS, g = st.steps["Applied>eCOPR"];
    const early = g ? Math.max(mid + g.median, st.today) : null;
    const late = g ? Math.max(mid + g.high, finish || 0) : finish;
    const combined = !late ? "" : late < st.today
      ? "Combined estimate: by both IRCC's numbers and the data sheet, most of this month should be finishing now."
      : `Combined estimate for eCOPR: ${early && fmtMonth(early) !== fmtMonth(late) ? `${fmtMonth(early)} – ${fmtMonth(late)}` : `around ${fmtMonth(late)}`}.`;
    const facts = [
      combined,
      finish ? `IRCC: about ${m.left} months left as of ${fmtDay(ir.updated)}, so around ${fmtMonth(finish)}.` : "IRCC says it needs more time on applications from this month.",
      ir.processing ? `IRCC's current AIP processing time is about ${ir.processing} months, with about ${ir.waiting.toLocaleString("en-CA")} people waiting.` : "",
      c ? `Data sheet: ${c.n} members applied this month. ${Math.round((c.AOR / c.n) * 100)}% have their AOR, ${Math.round((c.PAL / c.n) * 100)}% their PAL, ${Math.round((c.FD / c.n) * 100)}% a final decision and ${Math.round((c.eCOPR / c.n) * 100)}% their eCOPR.` : "Data sheet: not enough members from this month yet.",
      pal ? `Data sheet: this week, PALs went to members who applied ${fmtMonth(pal.from) === fmtMonth(pal.to) ? fmtMonth(pal.from) : `${fmtMonth(pal.from)} – ${fmtMonth(pal.to)}`}.` : "",
    ].filter(Boolean);
    out.innerHTML = `<p class="queue-big">${m.ahead ? `About ${m.ahead.toLocaleString("en-CA")} people ahead` : "Position not published"}</p>
      ${behind !== null ? `<p class="hint">${behind < 1 ? "This is the newest month in IRCC's queue." : `You're further along than about ${behind}% of the AIP queue.`}</p><div class="bar" aria-hidden="true"><span style="width:${behind}%"></span></div>` : ""}
      <ul class="queue-facts">${facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <p class="source">Source: <a href="${IRCC}/services/application/check-processing-times.html" target="_blank" rel="noopener">IRCC processing times</a> (Atlantic Immigration Program) and the group's data sheet. The combined estimate runs from the group's typical time to the later of IRCC's estimate and the group's slow end.</p>`;
  }
  if (!queueBound) {
    queueBound = true;
    ySel.addEventListener("change", () => { fillMonths(ySel.value, mSel.value); show(); });
    mSel.addEventListener("change", show);
  }
  queueSet = (k) => { if (set(k)) show(); };
  show();
  box.hidden = false;
}

let trackerBound = false;
function renderTracker(st) {
  const base = () => $('input[name="est-base"]:checked').value;
  const estDate = $("#est-date"), out = $("#est-out");
  function estimate() {
    const st = STATS;
    store.set("est-base", base()); store.set("est-date", estDate.value);
    markCohort();
    if (!estDate.value) { out.innerHTML = '<li class="muted">Pick a date to see estimates.</li>'; return; }
    const from = Math.floor(Date.parse(estDate.value) / DAY_MS);
    if (queueSet) {
      const d = new Date((base() === "Applied" ? from : from - (st.steps["Applied>AOR"]?.median || 0)) * DAY_MS);
      queueSet(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
    }
    // Buffer: group data leans fast, because members who wait longest often stop updating the sheet.
    // So the late end of each range is stretched by `stretch`: IRCC's own estimate for the application
    // month divided by the group's typical total, and never less than BUFFER_MIN.
    const applied = base() === "Applied" ? from : from - (st.steps["Applied>AOR"]?.median || 0);
    const official = irccMonth(applied);
    const total = st.steps[`${base()}>eCOPR`]?.median; // group's typical time from the date entered to eCOPR
    const stretch = Math.max(BUFFER_MIN, official?.finish && total ? (official.finish - from) / total : 0);
    const head = official ? `<li class="official"><strong>IRCC's estimate for ${fmtMonth(applied)} applications</strong><span>${
      official.left !== null ? `About ${official.left} months left as of ${fmtDay(st.ircc.updated)}, so around ${fmtMonth(official.finish)}.`
        : "IRCC says it needs more time on applications from this month."}${official.ahead ? ` About ${official.ahead.toLocaleString("en-CA")} people ahead.` : ""}</span></li>` : "";
    out.innerHTML = head + EST_TARGETS[base()].map((t) => {
      const s = st.steps[`${base()}>${t}`];
      if (!s) return "";
      const lo = from + s.low, mid = from + s.median, hi = from + Math.max(s.high, Math.round(s.median * stretch));
      const late = hi < st.today;
      const note = late ? "Past the usual range, even with the buffer. Check with the group."
        : mid < st.today ? "You're in the usual window now." : `Most likely around ${fmtDay(mid)}.`;
      return `<li${late ? ' class="late"' : ""}><strong>${STAGE_NAMES[t]}: ${fmtDay(lo)} – ${fmtDay(hi)}</strong><span>${note}</span></li>`;
    }).join("") + `<li class="muted"><span>Ranges start at the group's typical times. The late end adds a buffer (${Math.round((stretch - 1) * 100)}% here)${
      official?.finish ? " based on IRCC's estimate" : ""}, because members who wait longest often stop updating the sheet.</span></li>`;
  }
  if (!trackerBound) { // first load only, so a refresh never overwrites what the reader typed
    trackerBound = true;
    const savedBase = store.get("est-base");
    if (savedBase) $$('input[name="est-base"]').forEach((r) => { r.checked = r.value === savedBase; });
    estDate.value = store.get("est-date") || "";
    $$('input[name="est-base"]').forEach((r) => r.addEventListener("change", estimate));
    estDate.addEventListener("input", estimate);
  }

  $("#moved").innerHTML = st.moved.length
    ? st.moved.map((m) => `<li><strong>${m.count}</strong>${MOVED_NAMES[m.stage][m.count === 1 ? 0 : 1]}<span>To members who applied ${fmtMonth(m.from) === fmtMonth(m.to) ? fmtMonth(m.from) : `${fmtMonth(m.from)} – ${fmtMonth(m.to)}`}</span></li>`).join("")
    : '<li class="muted">No new dates reported in the last 7 days.</li>';

  const pctCell = (n, of) => { const p = Math.round((n / of) * 100); return `<td class="pct" style="--p:${p}%">${p}%</td>`; };
  $("#cohorts").innerHTML = `<caption class="sr-only">Share of members who reached each stage, by month applied</caption>
    <thead><tr><th scope="col">Applied</th><th scope="col">Members</th><th scope="col">AOR</th><th scope="col">ADR</th><th scope="col">PAL</th><th scope="col">Final decision</th><th scope="col">P1</th><th scope="col">P2</th><th scope="col">eCOPR</th></tr></thead>
    <tbody>${st.cohorts.map((c) => `<tr data-k="${c.year * 12 + c.month}"><th scope="row">${new Date(Date.UTC(c.year, c.month)).toLocaleDateString("en-CA", { timeZone: "UTC", month: "short", year: "numeric" })}</th><td>${c.n}</td>${pctCell(c.AOR, c.n)}${pctCell(c.ADR, c.n)}${pctCell(c.PAL, c.n)}${pctCell(c.FD, c.n)}${pctCell(c.P1, c.n)}${pctCell(c.P2, c.n)}${pctCell(c.eCOPR, c.n)}</tr>`).join("")}</tbody>`;
  function markCohort() {
    const d = base() === "Applied" && estDate.value ? new Date(estDate.value) : null;
    const k = d ? d.getUTCFullYear() * 12 + d.getUTCMonth() : -1;
    $$("#cohorts tbody tr").forEach((tr) => tr.classList.toggle("mine", +tr.dataset.k === k));
  }
  renderQueue(st);
  estimate();
  const time = new Date().toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
  $("#tracker-status").textContent = `Updated at ${time} · refreshes every 10 minutes while this page is open.`;
  $("#tracker-tools").hidden = false;
  $("#cohort-box").hidden = !st.cohorts.length;
}
SECTIONS.push({ title: "Your place in the queue (IRCC plus Data Sheet)", desc: "People ahead, months left and a combined estimate", href: "#queue",
  keys: "queue people ahead line position months left ircc processing time official 26 months waiting" });
SECTIONS.push({ title: "Live tracker", desc: "Estimate your dates, see what moved this week and how your month is doing", href: "#tracker",
  keys: "tracker estimate estimator prediction when will i get aor pal fd ecopr how long cohort month this week moved progress" });

/* ---------- Live numbers from the community data sheet ---------- */
// Loads on open, then every 10 minutes while the tab is visible, and when the reader returns to a stale tab.
const REFRESH_MS = 10 * 60e3;
let lastLoad = 0, loading = false;
function loadStats() {
  if (!window.SheetStats || loading) return;
  loading = true;
  SheetStats.load().then((st) => {
  const first = !STATS;
  STATS = st; lastLoad = Date.now();
  renderTracker(st);
  const badge = $("#live-badge");
  badge.textContent = `Live timelines from ${st.applicants} applicants in the group sheet.`;
  badge.hidden = false;
  if (stage !== null) setStage(stage, false, first);
  const a = st.adr, top = a.kinds[0] ? a.kinds[0].count : 1;
  if (a.withAdr >= 10) {
    const box = $("#adr-live");
    box.innerHTML = `<h3>Live from the data sheet</h3>
      <p class="hint">${a.withAdr} members listed what their ADR asked for. Each bar shows how many were asked for that item.</p>
      <ul class="bars">${a.kinds.map((k) => `<li><span class="bar-label">${esc(k.label)}</span>
        <span class="bar-track" aria-hidden="true"><span style="width:${(k.count / top) * 100}%"></span></span>
        <span class="bar-num">${k.count} <span class="sr-only">of ${a.withAdr}</span>(${Math.round((k.count / a.withAdr) * 100)}%)</span></li>`).join("")}</ul>`;
    box.hidden = false;
  }
}).catch(() => {
  // Sheet unavailable: the page works without live numbers, and keeps the last numbers it had.
  if (!STATS) $("#tracker-status").textContent = "Live data can't be loaded right now. Please try again later.";
}).finally(() => { loading = false; });
}
loadStats();
setInterval(() => { if (!document.hidden) loadStats(); }, REFRESH_MS);
document.addEventListener("visibilitychange", () => { if (!document.hidden && Date.now() - lastLoad > REFRESH_MS) loadStats(); });

// Footer postcard: stamp the postmark with today's date, e.g. "19 NOV 2026"
{
  const pm = document.getElementById("pm-date"), d = new Date();
  if (pm) pm.textContent = `${d.getDate()} ${["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][d.getMonth()]} ${d.getFullYear()}`;
}

// Header compass: when you jump to a section, the needle spins to point at it,
// then swings back to north once the page has scrolled there.
{
  const needle = document.querySelector(".compass .needle");
  let rot = 0, back;
  if (needle) document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]'), t = a && document.getElementById(a.getAttribute("href").slice(1));
    if (!t || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = needle.ownerSVGElement.getBoundingClientRect(), r = t.getBoundingClientRect();
    const deg = Math.atan2(r.left + 40 - (c.left + c.width / 2), -(r.top - (c.top + c.height / 2))) * 180 / Math.PI;
    rot = Math.ceil(rot / 360) * 360 + 360 + ((deg + 360) % 360);
    needle.style.rotate = rot + "deg";
    clearTimeout(back);
    back = setTimeout(() => { rot = Math.ceil(rot / 360) * 360; needle.style.rotate = rot + "deg"; }, 1400);
  });
}
