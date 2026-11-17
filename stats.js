// Live timeline stats from the community data sheet.
// Reads the 2024, 2025 and 2026 applicant tabs. Each tab has its own layout and date style, so columns are
// found by header name. Only date, In/Outland and "requested documents" columns are read, and only totals,
// medians and percentages are returned: names and other personal details are never read or displayed.
(function (root) {
  const SHEET = "196yaxpNtzI4H4cKhUyBKqiNAOzwaX27alAjOFr4V9Dk";
  const TABS = [{ gid: 0, year: 2024 }, { gid: 662151693, year: 2025 }, { gid: 382056044, year: 2026 }];
  const STAGES = ["Applied", "AOR", "ADR", "PAL", "FD", "P1", "P2", "eCOPR"];
  // Header names per stage across the tabs. The 2024 tab has one "ADR / PAL" column; it is read as PAL.
  const HEADERS = {
    Applied: ["applied", "apply"], AOR: ["aor"], ADR: ["adr"], PAL: ["pal", "adr / pal"], FD: ["fd"],
    P1: ["p1"], P2: ["p2"], eCOPR: ["ecopr"], WPApply: ["wp apply"], WPApproved: ["wp approved", "wp apprpved"],
    Where: ["in or outland"], Docs: ["please update the list of requested", "adr requested"],
  };
  const RECENT = 60; // use the N most recently completed reports for each step
  const MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");
  const DAY = 864e5;
  const today = () => Math.floor(Date.now() / DAY);

  function parseCSV(text) {
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
      else cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  const day = (y, m, d) => (m >= 1 && m <= 12 && d >= 1 && d <= 31 ? Date.UTC(y, m - 1, d) / DAY : null);
  const yr = (y) => (+y < 100 ? 2000 + +y : +y);

  // One cell -> { t: day number } when it has a year, { m, d } when it doesn't, or null.
  // Handles "Feb-18/26", "Dec-19-25", "28/03/2026" (day first), "4/15" and "PA-07/30" (month first, no year).
  function cellDate(s) {
    s = (s || "").trim().toLowerCase();
    let m = /([a-z]{3})[a-z]*[-\s]?(\d{1,2})[\/\-,\s]+(\d{2,4})\b/.exec(s);
    if (m && MONTHS.includes(m[1])) { const t = day(yr(m[3]), MONTHS.indexOf(m[1]) + 1, +m[2]); return t === null ? null : { t }; }
    m = /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/.exec(s);
    if (m) { const t = day(yr(m[3]), +m[2], +m[1]); return t === null ? null : { t }; }
    m = /(\d{1,2})\/(\d{1,2})/.exec(s);
    if (m && +m[1] <= 12 && +m[2] <= 31) return { m: +m[1], d: +m[2] };
    return null;
  }

  // Cells in stage order -> day numbers. A date without a year takes the year that places it on or
  // after the previous stage (the first one takes the tab's year). Future dates are dropped.
  function rowDays(cells, baseYear) {
    const out = []; let prev = null;
    for (const c of cells) {
      const v = cellDate(c);
      let t = null;
      if (v && v.t !== undefined) t = v.t;
      else if (v) {
        const y = prev === null ? baseYear : new Date(prev * DAY).getUTCFullYear();
        t = day(y, v.m, v.d);
        if (prev !== null && t < prev - 3) t = day(y + 1, v.m, v.d);
      }
      if (t !== null && t > today() + 1) t = null;
      out.push(t);
      if (t !== null) prev = t;
    }
    return out;
  }

  function readTab(text, tab) {
    const rows = parseCSV(text);
    const h = rows.findIndex((r) => r.some((c) => c.trim() === "AOR"));
    if (h < 0) return [];
    const head = rows[h].map((c) => c.trim().toLowerCase().replace(/\s+/g, " "));
    const col = (k) => {
      for (const name of HEADERS[k]) {
        const i = k === "Docs" ? head.findIndex((c) => c.startsWith(name)) : head.indexOf(name);
        if (i >= 0) return i;
      }
      return -1;
    };
    const idx = STAGES.map(col), wa = col("WPApply"), wb = col("WPApproved"), docs = col("Docs"), where = col("Where");
    const get = (r, i) => (i >= 0 ? r[i] || "" : "");
    return rows.slice(h + 1).map((r) => {
      const days = rowDays(idx.map((i) => get(r, i)), tab.year);
      if (days[0] === null) return null; // no applied date: a repeated header or an empty row
      const wp = rowDays([get(r, wa), get(r, wb)], new Date(days[0] * DAY).getUTCFullYear());
      return { tab: tab.year, days, wp, docs: get(r, docs).toLowerCase().trim(), inland: /in\s*land/i.test(get(r, where)) };
    }).filter(Boolean);
  }

  const pct = (a, p) => { const s = [...a].sort((x, y) => x - y), i = (s.length - 1) * p, lo = Math.floor(i); return Math.round(s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo)); };
  // pairs: [date reached, days taken]. Keeps the most recently reached ones, so numbers show today's speed.
  const summary = (pairs) => {
    const recent = pairs.sort((a, b) => a[0] - b[0]).slice(-RECENT).map((p) => p[1]);
    return recent.length >= 5 ? { median: pct(recent, 0.5), low: pct(recent, 0.25), high: pct(recent, 0.75), n: recent.length } : null;
  };

  function analyse(texts) {
    const people = texts.flatMap((t, i) => (t ? readTab(t, TABS[i]) : []));
    const at = (p, s) => p.days[STAGES.indexOf(s)];
    const later = (p, s) => STAGES.slice(STAGES.indexOf(s) + 1).some((x) => at(p, x) !== null);
    const now = today();

    function step(from, to) {
      const pairs = people.filter((p) => at(p, from) !== null && at(p, to) !== null)
        .map((p) => [at(p, to), at(p, to) - at(p, from)]).filter(([, d]) => d >= 0 && d < 900);
      const s = summary(pairs);
      if (!s) return null;
      // Applicants who reached `from` in the last 2 years and are still waiting for `to`.
      const waiting = people.filter((p) => at(p, from) !== null && at(p, to) === null && !later(p, to) && now - at(p, from) < 730)
        .map((p) => now - at(p, from));
      s.waiting = waiting.length;
      s.waitingMedian = waiting.length >= 5 ? pct(waiting, 0.5) : null;
      return s;
    }
    const keys = [["Applied", "AOR"], ["AOR", "ADR"], ["AOR", "PAL"], ["PAL", "FD"], ["FD", "P1"], ["P1", "P2"], ["P2", "eCOPR"],
      ["Applied", "PAL"], ["Applied", "FD"], ["Applied", "P1"], ["Applied", "eCOPR"], ["AOR", "FD"], ["AOR", "P1"], ["AOR", "eCOPR"]];
    const steps = Object.fromEntries(keys.map(([a, b]) => [`${a}>${b}`, step(a, b)]));

    // C18 work permit: application to approval.
    const wp = summary(people.filter((p) => p.wp[0] !== null && p.wp[1] !== null)
      .map((p) => [p.wp[1], p.wp[1] - p.wp[0]]).filter(([, d]) => d >= 0 && d < 900));

    // What moved: stage dates reported in the last 7 days, with the range of applied dates they went to.
    const moved = STAGES.slice(1).map((s) => {
      const hits = people.filter((p) => at(p, s) !== null && now - at(p, s) <= 7 && now >= at(p, s));
      const applied = hits.map((p) => at(p, "Applied")).sort((a, b) => a - b);
      return { stage: s, count: hits.length, from: applied[0], to: applied[applied.length - 1] };
    }).filter((m) => m.count > 0);

    // Cohorts by month applied. Only tabs with full dates (2025 on); months with at least 5 reports.
    const groups = new Map();
    people.filter((p) => p.tab >= 2025).forEach((p) => {
      const d = new Date(at(p, "Applied") * DAY), k = d.getUTCFullYear() * 12 + d.getUTCMonth();
      groups.set(k, [...(groups.get(k) || []), p]);
    });
    const reached = (p, s) => at(p, s) !== null || later(p, s);
    const cohorts = [...groups.entries()].sort((a, b) => a[0] - b[0]).filter(([, ps]) => ps.length >= 5).map(([k, ps]) => ({
      year: Math.floor(k / 12), month: k % 12, n: ps.length,
      AOR: ps.filter((p) => reached(p, "AOR")).length, PAL: ps.filter((p) => reached(p, "PAL")).length,
      FD: ps.filter((p) => reached(p, "FD")).length, P1: ps.filter((p) => reached(p, "P1")).length,
      P2: ps.filter((p) => reached(p, "P2")).length, eCOPR: ps.filter((p) => at(p, "eCOPR") !== null).length,
    }));

    const noAdrRe = /no\s*adr|^\s*(none|nil|n\/a|-)\s*$/;
    const docs = people.map((p) => p.docs).filter(Boolean);
    const adrDocs = docs.filter((s) => !noAdrRe.test(s));
    const KINDS = [
      ["Schedule A (IMM 5669)", /schedule\s*a|5669/],
      ["Pay stubs", /pay\s*-?\s*stub|payslip|pay slip/],
      ["Employment / reference letter", /reference|ref letter|employment letter|letter of employment|employer letter|job letter/],
      ["Offer of Employment (IMM 0157)", /0157|offer of employment/],
      ["Family Information (IMM 5406)", /5406|family info/],
      ["Education documents", /degree|transcript|education|\beca\b|\bwes\b/],
      ["Tax records (T4 / NOA)", /\bt4\b|\bnoa\b|notice of assessment|tax/],
      ["Military service (IMM 5546)", /5546|military/],
      ["Police certificate", /police|pcc/],
    ];
    const kinds = KINDS.map(([label, re]) => ({ label, count: adrDocs.filter((s) => re.test(s)).length }))
      .filter((k) => k.count > 0).sort((a, b) => b.count - a.count);

    return {
      applicants: people.length, today: now, steps, wp, moved, cohorts,
      adr: { reports: docs.length, noAdr: docs.length - adrDocs.length, withAdr: adrDocs.length, kinds },
    };
  }

  async function load() {
    const texts = await Promise.all(TABS.map(async (t) => {
      try {
        const res = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET}/export?format=csv&gid=${t.gid}`);
        return res.ok ? await res.text() : "";
      } catch { return ""; }
    }));
    if (!texts.some(Boolean)) throw new Error("sheet unavailable");
    return analyse(texts);
  }

  root.SheetStats = { load, analyse, STAGES, DAY };
})(typeof window !== "undefined" ? window : globalThis);
