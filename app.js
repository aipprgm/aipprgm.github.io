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
  { group: "Guides", id: "res-wp-guide", tag: "Checked Nov 2026", title: "AIP Work Permit Guide",
    desc: "Step-by-step community guide to the C18 work permit, checked against IRCC on 20 November 2026.", gdoc: "1f0PJof9dz6Kk0lFj6KCNZFI00cgXm9rhN2PBHky-NoU",
    keys: "work permit guide c18 how to renewal extension passport spouse sowp maintained status medical fees checklist imm 0156 support letter" },
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
  { title: "C18 work permit checklist", desc: "Documents, fees and renewals", href: "#c18", keys: "c18 work permit wpsl support letter referral imm 0156 offer of employment number compliance fee renew renewal extension language test ielts celpip clb tef eca bowp passport expiry spouse sowp open work permit maintained status implied status medical exam imm 5710 imm 1295 2 years" },
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
  card.innerHTML = `<div><p class="label">You are here · ${i + 1} of ${STAGES.length}</p><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${statHtml(s)}${linkHtml(s.links)}<button class="pc-share" type="button" data-postcard>Make a progress postcard</button></div>` +
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

/* ---------- Living lighthouse: the hero beam turns faster when members report new dates today ---------- */
function liveLighthouse(st) {
  const today = st.daily ? st.daily[st.daily.length - 1] : 0, week = st.daily ? st.daily.slice(-7).reduce((a, b) => a + b, 0) : 0;
  $(".intro").style.setProperty("--turn", today >= 5 ? "2.4s" : today >= 1 ? "3.6s" : "6s");
  const live = $("#lh-live");
  live.textContent = today ? `${today} new date${today === 1 ? "" : "s"} reported in the group today` : week ? `${week} new dates reported in the group this week` : "";
  live.hidden = !live.textContent;
}

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
  liveLighthouse(st);
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

/* ---------- Expiry radar: dates stay on this device ---------- */
{
  const DAY = 864e5, fields = $$("[data-radar]"), out = $("#radar-out"), track = $("#radar-track");
  const toDay = (v) => (v ? Math.floor(Date.parse(v) / DAY) : null);
  const nice = (d) => new Date(d * DAY).toLocaleDateString("en-CA", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" });
  const plus2y = (v) => { const d = new Date(v); d.setUTCFullYear(d.getUTCFullYear() + 2); return Math.floor(d / DAY); };
  let reminders = [];
  function render() {
    const v = Object.fromEntries(fields.map((f) => [f.dataset.radar, f.value]));
    fields.forEach((f) => store.set("radar-" + f.dataset.radar, f.value));
    const now = Math.floor(Date.now() / DAY), wp = toDay(v.wp), pass = toDay(v.passport);
    const items = [];
    if (wp !== null) items.push({ label: "Work permit", end: wp, lead: 120,
      text: "Ask your employer for a new offer number and the $230 fee about 4 months ahead. If you apply before it expires, from inside Canada, you can keep working while IRCC decides.",
      remind: [[wp - 120, "Start C18 renewal: ask employer for a new offer number"], [wp - 30, "Last month to apply to renew your C18"]] });
    if (pass !== null) items.push({ label: "Passport", end: pass, lead: 180,
      text: (wp !== null && pass < wp + 730 ? "It ends before a full 2-year renewal would. Renew your passport before you apply, or your next permit will be cut short. " : "")
        + "Your work permit can't be valid past this date.",
      remind: [[pass - 180, "Renew your passport (it limits your work permit)"]] });
    if (v.lang) { const e = plus2y(v.lang); items.push({ label: "Language test", end: e, lead: 60,
      text: "Valid for a first C18 application until this date. Renewals with the same employer don't need it.",
      remind: [[e - 30, "Language test results expire in 30 days"]] }); }
    const endo = toDay(v.endo);
    if (endo !== null) items.push({ label: "Endorsement", end: endo, lead: 60,
      text: "Apply for PR before this date. After it expires, you'll need your AOR to get or renew a C18.",
      remind: [[endo - 60, "Endorsement expires in 60 days: has your PR application gone in?"]] });
    items.sort((a, b) => a.end - b.end);
    reminders = items.flatMap((i) => [...i.remind, [i.end, `${i.label} expires`]]).filter(([d]) => d >= now);
    items.forEach((i) => { const left = i.end - now; i.cls = left < 0 ? "late" : left <= i.lead ? "soon" : ""; i.left = left; });
    out.innerHTML = items.map((i) => `<li class="${i.cls}"><strong>${i.label}: ${i.left < 0 ? `expired ${nice(i.end)}` : `${nice(i.end)} · ${i.left} days left`}</strong><span>${i.text}</span></li>`).join("");
    track.querySelectorAll(".rt-pin").forEach((e) => e.remove());
    let prev = -99, lvl = 0; // stack labels that would overlap
    items.forEach((i) => { const pin = document.createElement("span"), x = Math.min(100, Math.max(0, (i.left / 730) * 100));
      lvl = x - prev < 14 ? (lvl + 1) % 3 : 0; prev = x;
      pin.className = "rt-pin " + i.cls; pin.textContent = i.label; pin.style.left = `${x}%`; if (x < 10 || x > 90) pin.style.translate = x < 10 ? "-6px 0" : "calc(-100% + 6px) 0"; pin.style.justifyItems = x < 10 ? "start" : x > 90 ? "end" : ""; pin.style.setProperty("--lvl", lvl); track.append(pin); });
    track.hidden = !items.length; $("#radar-actions").hidden = !reminders.length;
  }
  fields.forEach((f) => { f.value = store.get("radar-" + f.dataset.radar) || ""; f.addEventListener("input", render); });
  render();
  // Calendar file: one all-day event per reminder. Built in the browser and downloaded; nothing is uploaded.
  $("#radar-ics").addEventListener("click", () => {
    const ymd = (d) => new Date(d * DAY).toISOString().slice(0, 10).replace(/-/g, "");
    const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const ev = reminders.map(([d, t], k) => ["BEGIN:VEVENT", `UID:aip-radar-${d}-${k}@aipprgm.github.io`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(d)}`, `DTEND;VALUE=DATE:${ymd(d + 1)}`, `SUMMARY:${t}`, "DESCRIPTION:From the AIP Applicant Hub expiry radar: https://aipprgm.github.io/#tools", "END:VEVENT"].join("\r\n"));
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AIP Applicant Hub//Expiry radar//EN", ...ev, "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "aip-reminders.ics";
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
}
SECTIONS.push({ title: "Expiry radar", desc: "Work permit, passport, language test and endorsement dates, with calendar reminders", href: "#tools",
  keys: "expiry expire expires renew renewal reminder calendar passport work permit language test endorsement deadline radar dates" });

/* ---------- IRCC letter decoder: pattern matching in the browser, nothing is sent ---------- */
{
  const R = [
    { re: /procedural fairness/i, warn: true, name: "Procedural fairness letter",
      what: "IRCC has a concern that could lead to a refusal, and is giving you a chance to answer it.",
      next: "Reply by the deadline with everything it asks for and a clear explanation. Many members get help from a licensed consultant or lawyer.", href: "#community" },
    { re: /\brefus(ed|al)\b|unable to approve|does not meet the requirements/i, warn: true, name: "Refusal",
      what: "IRCC has refused the application named in the letter.",
      next: "Read the reasons closely. Ask the group about reconsideration or reapplying. If it's a work permit, check your status straight away.", href: "#community" },
    { re: /acknowledg(e)?ment of receipt|we (have )?received your application/i, name: "Acknowledgement of Receipt (AOR)",
      what: "IRCC has your application and has started processing it.",
      next: "Save your application number. Add your AOR date to the group's data sheet, then watch your account; there's no AIP status tracker.", href: "#journey" },
    { re: /medical (exam|examination|instructions|request)|panel physician|upfront medical/i, name: "Medical exam request",
      what: "IRCC wants you, and any family members listed, to have an immigration medical exam.",
      next: "Book with an IRCC panel physician. The letter gives the deadline, often 30 days.", href: "#journey" },
    { re: /biometric/i, name: "Biometrics instruction letter",
      what: "IRCC wants your fingerprints and photo, unless you gave them in the last 10 years.",
      next: "Book a biometrics appointment and bring the letter. The letter gives the deadline, often 30 days.", href: "#journey" },
    { re: /pre-?arrival|settlement services/i, name: "Pre-Arrival Letter (PAL)",
      what: "An invitation to free settlement services. Your PR file is still being processed.",
      next: "Nothing to send. Add the date to the data sheet; the group often sees this after eligibility checks.", href: "#journey" },
    { re: /additional (documents?|information)|submit the following|request for (documents?|information)|document request|please provide/i, name: "Additional Document Request (ADR)",
      what: "IRCC needs updated or missing documents for your file.",
      next: "Send exactly what the letter lists, through the portal, by its deadline.", href: "#adr" },
    { re: /final decision|decision (has been|was) made|approved in principle/i, name: "Final decision",
      what: "IRCC has finished reviewing your PR application.",
      next: "Inside Canada, watch for the PR portal invitation. Outside Canada, watch for the passport request.", href: "#journey" },
    { re: /physically (present )?in canada|permanent residence portal|pr portal|portal 1/i, name: "PR portal (Portal 1)",
      what: "IRCC is asking you to confirm you're in Canada so you can land virtually.",
      next: "Confirm in the portal as soon as you can. The Portal 2 request for your photo and address follows.", href: "#journey" },
    { re: /portal 2|(upload|submit) (a |your )?(digital )?photo|mailing address/i, name: "PR portal (Portal 2)",
      what: "IRCC wants your photo and mailing address for your PR card.",
      next: "Upload a photo that meets IRCC's specs and confirm your address.", href: "#journey" },
    { re: /confirmation of permanent residence|\be?copr\b/i, name: "Confirmation of Permanent Residence",
      what: "You are, or are about to become, a permanent resident.",
      next: "Inside Canada, the eCOPR is your landing. Check every detail and report errors to IRCC. Welcome!", href: "#journey" },
    { re: /passport request|submit your passport|ready for visa/i, name: "Passport request (PPR)",
      what: "IRCC is ready to put your visa or COPR in your passport.",
      next: "Follow the letter's instructions for sending your passport, by its deadline.", href: "#journey" },
    { re: /work permit.{0,60}(approved|issued)|letter of introduction/i, name: "Work permit approval",
      what: "Your work permit has been approved.",
      next: "Inside Canada it's mailed or added to your account; outside, show the letter at the border. Check the employer, job and dates.", href: "#c18" },
  ];
  const WORDS = { thirty: 30, sixty: 60, ninety: 90, fifteen: 15, "forty-five": 45, seven: 7, ten: 10, fourteen: 14 };
  const out = $("#dec-out"), inp = $("#dec-in");
  const deadline = (t) => {
    const m = /within\s+(\d{1,3}|thirty|sixty|ninety|fifteen|forty-five|seven|ten|fourteen)\s*(\(\d+\)\s*)?(calendar\s+)?days/i.exec(t);
    const dates = t.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g) || [];
    const bits = [];
    if (m) { const n = +m[1] || WORDS[m[1].toLowerCase()];
      const d = new Date(); d.setDate(d.getDate() + n);
      bits.push(`You have <strong>${n} days</strong>, counted from the date on the letter. If that's today, the deadline is ${d.toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}.`); }
    if (dates.length) bits.push(`Dates in the letter: ${[...new Set(dates)].map(esc).join(", ")}.`);
    return bits.length ? `<p class="when">${bits.join(" ")}</p>` : "";
  };
  inp.addEventListener("input", () => {
    const t = inp.value.trim();
    if (t.length < 20) { out.innerHTML = ""; return; }
    const hits = R.filter((r) => r.re.test(t)).slice(0, 3);
    out.innerHTML = (hits.length ? hits.map((h) => `<div class="dec-card${h.warn ? " warn" : ""}"><h4>${h.name}</h4><p>${h.what}</p><p><strong>Next:</strong> ${h.next} <a href="${h.href}">More</a></p></div>`).join("")
      : '<div class="dec-card"><h4>Not sure what this is</h4><p>It doesn\'t match a letter we know. <a href="#community">Ask the group</a>, and remove personal details before sharing.</p></div>')
      + deadline(t);
  });
}
SECTIONS.push({ title: "IRCC letter decoder", desc: "Paste an IRCC email to see what it means and what to do next", href: "#tools",
  keys: "letter email decoder decode meaning what does it mean ircc message portal procedural fairness refusal medical biometrics pal adr copr" });

/* ---------- Progress postcard: drawn on a canvas in the browser, then shared or downloaded ---------- */
{
  const LEAF = "M16 2 18 6 20 5 19.5 11 23 8 24 10 28 9 26.5 13 28 14 22.5 19 23.5 21.5 17 20.5 17 27 15 27 15 20.5 8.5 21.5 9.5 19 4 14 5.5 13 4 9 8 10 9 8 12.5 11 12 5 14 6Z";
  const MON = "JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split(" ");
  function draw() {
    const W = 1200, H = 630, c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d"), serif = "Literata, Georgia, serif", sans = "-apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
    const ink = "#1f2a30", spruce = "#2f5d50", buoy = "#a8402c", muted = "#55626a", n = STAGES.length, s = STAGES[stage];
    g.fillStyle = "#f6f4ee"; g.fillRect(0, 0, W, H);
    g.strokeStyle = "#c9c1ae"; g.setLineDash([10, 8]); g.lineWidth = 3; g.strokeRect(24, 24, W - 48, H - 48); g.setLineDash([]);
    g.fillStyle = muted; g.font = `600 26px ${sans}`; g.fillText("GREETINGS FROM THE AIP ROUTE", 70, 100);
    g.fillStyle = ink; g.font = `600 78px ${serif}`; g.fillText(s.short.replace(" (optional)", ""), 70, 190);
    g.font = `400 32px ${sans}`; g.fillStyle = muted; g.fillText(`Stage ${stage + 1} of ${n} · ${where === "inland" ? "Inside Canada" : "Outside Canada"}`, 70, 245);
    const from = store.get("est-base") === "Applied" && store.get("est-date") ? Math.floor(Date.parse(store.get("est-date")) / 864e5) : null;
    if (from !== null) { const d = Math.floor(Date.now() / 864e5) - from; if (d >= 0) { g.fillStyle = spruce; g.font = `600 34px ${sans}`; g.fillText(`Day ${d} since I applied`, 70, 300); } }
    // Route: a wavy line with a dot per stage; done stages in spruce, the current one in buoy red.
    const x0 = 90, x1 = W - 90, y = 440, xs = (i) => x0 + ((x1 - x0) * i) / (n - 1), yy = (x) => y + Math.sin((x - x0) / 95) * 18;
    g.lineWidth = 6; g.lineCap = "round";
    for (const [to, col] of [[n - 1, "#ddd8cc"], [stage, spruce]]) { g.strokeStyle = col; g.beginPath();
      for (let x = x0; x <= xs(to); x += 4) x === x0 ? g.moveTo(x, yy(x)) : g.lineTo(x, yy(x)); g.stroke(); }
    STAGES.forEach((_, i) => { g.beginPath(); g.arc(xs(i), yy(xs(i)), i === stage ? 15 : 9, 0, 7);
      g.fillStyle = i === stage ? buoy : i < stage ? spruce : "#fffdf8"; g.fill(); g.lineWidth = 4; g.strokeStyle = i <= stage ? (i === stage ? buoy : spruce) : "#c9c1ae"; g.stroke(); });
    g.fillStyle = ink; g.font = `600 22px ${sans}`; g.textAlign = "center";
    g.fillText(s.short.replace(" (optional)", ""), Math.min(Math.max(xs(stage), 140), W - 140), yy(xs(stage)) + 52);
    // Stamp with the maple leaf, and a postmark with today's date.
    g.textAlign = "left"; g.fillStyle = "#fffdf8"; g.fillRect(W - 230, 60, 150, 180); g.strokeStyle = buoy; g.lineWidth = 3; g.setLineDash([6, 5]); g.strokeRect(W - 230, 60, 150, 180); g.setLineDash([]);
    g.save(); g.translate(W - 197, 80); g.scale(2.6, 2.6); g.fillStyle = buoy; g.fill(new Path2D(LEAF)); g.restore();
    g.fillStyle = buoy; g.font = `700 20px ${sans}`; g.textAlign = "center"; g.fillText("CANADA", W - 155, 222);
    const t = new Date(); g.strokeStyle = "rgba(43,76,111,.55)"; g.lineWidth = 3; g.beginPath(); g.arc(W - 300, 200, 58, 0, 7); g.stroke();
    g.fillStyle = "rgba(43,76,111,.7)"; g.font = `700 17px ${sans}`; g.fillText("AIP HUB", W - 300, 194); g.fillText(`${t.getDate()} ${MON[t.getMonth()]} ${t.getFullYear()}`, W - 300, 218);
    g.textAlign = "left"; g.fillStyle = muted; g.font = `400 24px ${sans}`; g.fillText("aipprgm.github.io · AIP Applicant Hub", 70, H - 64);
    return c;
  }
  card.addEventListener("click", async (e) => {
    if (!e.target.closest("[data-postcard]") || stage === null) return;
    const blob = await new Promise((r) => draw().toBlob(r, "image/png"));
    const file = new File([blob], "aip-progress-postcard.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: "My AIP progress, via aipprgm.github.io" }); return; } catch (err) { if (err.name === "AbortError") return; }
    }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
}
SECTIONS.push({ title: "Progress postcard", desc: "Make an image of your stage to share with the group", href: "#journey",
  keys: "share postcard image picture progress whatsapp stage" });
