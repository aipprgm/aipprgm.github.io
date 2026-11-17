// Live timeline stats from the community data sheet.
// Reads only date, In/Outland and "requested documents" columns, and shows only totals and medians:
// names and other personal details in the sheet are never read or displayed.
(function (root) {
  const SHEET_CSV = "https://docs.google.com/spreadsheets/d/196yaxpNtzI4H4cKhUyBKqiNAOzwaX27alAjOFr4V9Dk/export?format=csv";
  const STAGES = ["Applied", "AOR", "ADR / PAL", "FD", "P1", "P2", "eCOPR"];
  const RECENT = 60; // use the most recent N reports for each step

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

  // "4/15", "04/15" or "PA-07/30, ..." -> [month, day]
  function md(s) {
    const m = /(\d{1,2})\/(\d{1,2})/.exec(s || "");
    if (!m) return null;
    const mo = +m[1], d = +m[2];
    return mo >= 1 && mo <= 12 && d >= 1 && d <= 31 ? [mo, d] : null;
  }

  // Dates have no year, so place each stage after the previous one (rolling into next year if needed).
  function toDays(cells) {
    const out = []; let prev = null, year = 0;
    for (const c of cells) {
      const v = md(c);
      if (!v) { out.push(null); continue; }
      let t = Date.UTC(2000 + year, v[0] - 1, v[1]) / 864e5;
      if (prev !== null && t < prev - 3) { year++; t = Date.UTC(2000 + year, v[0] - 1, v[1]) / 864e5; }
      out.push(t); prev = t;
    }
    return out;
  }

  const pct = (a, p) => { const s = [...a].sort((x, y) => x - y), i = (s.length - 1) * p, lo = Math.floor(i); return Math.round(s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo)); };

  function analyse(text) {
    const rows = parseCSV(text);
    const h = rows.findIndex((r) => r.some((c) => c.trim() === "AOR"));
    if (h < 0) throw new Error("header not found");
    const head = rows[h].map((c) => c.trim());
    const col = (name) => head.findIndex((c) => c.toLowerCase().startsWith(name.toLowerCase()));
    const idx = STAGES.map(col);
    const docsCol = col("Please update the list of requested");
    const whereCol = col("In or Outland");
    const data = rows.slice(h + 1).filter((r) => md(r[idx[0]]) && md(r[idx[1]]));

    const timelines = data.map((r) => toDays(idx.map((i) => (i >= 0 ? r[i] : ""))));
    function step(from, to) {
      const a = STAGES.indexOf(from), b = STAGES.indexOf(to);
      const days = timelines.filter((t) => t[a] !== null && t[b] !== null).map((t) => t[b] - t[a]).filter((d) => d >= 0 && d < 730);
      const recent = days.slice(-RECENT);
      return recent.length >= 5 ? { median: pct(recent, 0.5), low: pct(recent, 0.25), high: pct(recent, 0.75), n: recent.length, total: days.length } : null;
    }

    const docs = data.map((r) => (docsCol >= 0 ? r[docsCol] : "").toLowerCase()).filter((s) => s.trim());
    const noAdr = docs.filter((s) => /no\s*adr|^\s*(none|nil|n\/a)\s*$/.test(s)).length;
    const adrDocs = docs.filter((s) => !/no\s*adr|^\s*(none|nil|n\/a)\s*$/.test(s));
    const KINDS = [
      ["Schedule A (IMM 5669)", /schedule\s*a|5669/],
      ["Pay stubs", /pay\s*-?\s*stub|payslip|pay slip/],
      ["Employment / reference letter", /reference|employment letter|letter of employment|employer letter|job letter/],
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
      applicants: data.length,
      inland: data.filter((r) => /in\s*land|inland/i.test(r[whereCol] || "")).length,
      steps: {
        "Applied>AOR": step("Applied", "AOR"),
        "AOR>ADR / PAL": step("AOR", "ADR / PAL"),
        "ADR / PAL>FD": step("ADR / PAL", "FD"),
        "FD>P1": step("FD", "P1"),
        "P1>P2": step("P1", "P2"),
        "P2>eCOPR": step("P2", "eCOPR"),
        "Applied>eCOPR": step("Applied", "eCOPR"),
      },
      adr: { reports: docs.length, noAdr, withAdr: adrDocs.length, kinds },
    };
  }

  async function load() {
    const res = await fetch(SHEET_CSV);
    if (!res.ok) throw new Error(res.status);
    return analyse(await res.text());
  }

  root.SheetStats = { load, analyse };
})(typeof window !== "undefined" ? window : globalThis);
