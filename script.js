// MKF Pharma - script.js (online-first, developer-editable local DB)
// - Primary data source: OpenFDA drug label API (https://api.fda.gov/drug/label)
// - If OpenFDA does not return results, the app falls back to DEV_LOCAL_DB
// - Developer-only local DB: edit DEV_LOCAL_DB below to add more drugs (no public add UI)

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Developer local DB (edit this object ONLY as a developer) ----------
  // Add more drug objects here keyed by lowercase name or common generic.
  // Example: 'metformin': { name: 'Metformin', class: 'Biguanide', ... }
  const DEV_LOCAL_DB = {
    "aspirin": {
      name: "Aspirin",
      class: "Salicylate (NSAID)",
      indications: ["Pain", "Fever", "Inflammation", "Low-dose for MI prevention"],
      mechanism: "Irreversible inhibition of COX-1 and COX-2 → reduced prostaglandins & thromboxane A2.",
      sideEffects: ["Gastrointestinal bleeding", "Tinnitus at high doses", "Allergic reactions", "Reye syndrome in children"],
      contraindications: ["Active peptic ulcer disease", "Bleeding disorders", "Known salicylate hypersensitivity"],
      interactions: ["Anticoagulants (warfarin) — increased bleeding", "Other NSAIDs — reduced cardioprotective effect"],
      pregnancy: "Avoid in late pregnancy — risk of premature ductus arteriosus closure (Category D near term)."
    },
    "amoxicillin": {
      name: "Amoxicillin",
      class: "Beta-lactam antibiotic (Aminopenicillin)",
      indications: ["Bacterial infections (otitis media, sinusitis, pneumonia, UTI, skin)"],
      mechanism: "Inhibits bacterial cell-wall synthesis by binding PBPs → lysis.",
      sideEffects: ["Hypersensitivity reactions (rash, anaphylaxis)", "Gastrointestinal upset", "Superinfection (candida)"],
      contraindications: ["History of penicillin anaphylaxis"],
      interactions: ["Methotrexate — increased toxicity risk", "Allopurinol — increased rash risk"],
      pregnancy: "Generally considered safe (Category B)."
    }
    // <-- Add more entries here as needed (developer-only)
  };

  // ---------- DOM elements ----------
  const input = document.getElementById("drug-input");
  const searchBtn = document.getElementById("search-btn");
  const sampleBtn = document.getElementById("sample-btn");
  const results = document.getElementById("results");
  const historyList = document.getElementById("history-list");

  // ---------- Helpers ----------
  const setVisible = (el, visible) => el.classList.toggle("hidden", !visible);
  const clean = s => (s || "").toString().trim();
  const arrayToHtmlList = arr => {
    if (!arr) return "<span class='small-muted'>—</span>";
    if (Array.isArray(arr)) return "<ul style='margin:6px 0;padding-left:18px;'>" + arr.map(i => `<li>${escapeHtml(i)}</li>`).join("") + "</ul>";
    // sometimes API returns a string with newlines: convert to paragraphs
    return `<div style="white-space:pre-wrap">${escapeHtml(arr)}</div>`;
  };
  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  function makeRow(title, valHtml) {
    const div = document.createElement("div");
    div.className = "result-row";
    div.innerHTML = `<div class="result-name">${escapeHtml(title)}</div><div class="result-val">${valHtml}</div>`;
    return div;
  }

  // History (localStorage)
  function renderHistory() {
    const hist = JSON.parse(localStorage.getItem("mkf_history") || "[]");
    historyList.innerHTML = "";
    hist.forEach(name => {
      const item = document.createElement("div");
      item.className = "history-item";
      const left = document.createElement("div");
      left.textContent = name;
      const right = document.createElement("div");
      const btn = document.createElement("button");
      btn.textContent = "Open";
      btn.addEventListener("click", () => {
        input.value = name;
        doSearch(name);
      });
      right.appendChild(btn);
      item.appendChild(left);
      item.appendChild(right);
      historyList.appendChild(item);
    });
  }
  function pushHistory(name) {
    if (!name) return;
    let hist = JSON.parse(localStorage.getItem("mkf_history") || "[]");
    hist = hist.filter(h => h.toLowerCase() !== name.toLowerCase());
    hist.unshift(name);
    localStorage.setItem("mkf_history", JSON.stringify(hist.slice(0, 30)));
    renderHistory();
  }

  // ---------- Core: search with OpenFDA (fallback to DEV_LOCAL_DB) ----------
  async function fetchOpenFDA(name) {
    // OpenFDA label search: search brand_name OR generic_name
    // NOTE: rate-limited. No API key required for basic use.
    const q = encodeURIComponent(name);
    const url = `https://api.fda.gov/drug/label.json?search=brand_name:${q}+OR+generic_name:${q}&limit=1`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`OpenFDA ${resp.status}`);
    const json = await resp.json();
    return json.results && json.results[0];
  }

  function renderFromOpenFDA(info, queryName) {
    results.innerHTML = "";
    const title = (info.openfda && (info.openfda.brand_name || info.openfda.generic_name))
      ? (info.openfda.brand_name || info.openfda.generic_name).join(", ")
      : queryName;
    const header = document.createElement("div");
    header.className = "field-title";
    header.textContent = title;
    results.appendChild(header);

    const pharmClass = info.openfda && info.openfda.pharm_class_epc ? info.openfda.pharm_class_epc.join(", ") : (info.pharm_class ? info.pharm_class : "—");
    results.appendChild(makeRow("Drug Class", escapeHtml(pharmClass)));

    results.appendChild(makeRow("Indications", arrayToHtmlList(info.indications_and_usage || info.indications || "—")));
    results.appendChild(makeRow("Mechanism of Action", arrayToHtmlList(info.mechanism_of_action || "—")));
    results.appendChild(makeRow("Side Effects (Adverse Reactions)", arrayToHtmlList(info.adverse_reactions || info.adverse_reaction || "—")));
    results.appendChild(makeRow("Contraindications", arrayToHtmlList(info.contraindications || "—")));
    results.appendChild(makeRow("Interactions", arrayToHtmlList(info.drug_interactions || "—")));

    // pregnancy info often under 'use_in_specific_populations' or 'pregnancy'
    const preg = info.pregnancy || info.use_in_specific_populations || "—";
    results.appendChild(makeRow("Pregnancy / Use in Pregnancy", arrayToHtmlList(preg)));

    pushHistory(title);
  }

  function renderFromLocal(drugObj) {
    results.innerHTML = "";
    const header = document.createElement("div");
    header.className = "field-title";
    header.textContent = drugObj.name || "Unknown";
    results.appendChild(header);

    results.appendChild(makeRow("Drug Class", escapeHtml(drugObj.class || "—")));
    results.appendChild(makeRow("Indications", arrayToHtmlList(drugObj.indications)));
    results.appendChild(makeRow("Mechanism of Action", arrayToHtmlList(drugObj.mechanism)));
    results.appendChild(makeRow("Side Effects", arrayToHtmlList(drugObj.sideEffects)));
    results.appendChild(makeRow("Contraindications", arrayToHtmlList(drugObj.contraindications)));
    results.appendChild(makeRow("Interactions", arrayToHtmlList(drugObj.interactions)));
    results.appendChild(makeRow("Pregnancy Risk", arrayToHtmlList(drugObj.pregnancy)));
    pushHistory(drugObj.name);
  }

  async function doSearch(rawName) {
    const name = clean(rawName);
    if (!name) {
      results.innerHTML = `<div class="error">Please enter a drug name.</div>`;
      return;
    }

    setVisible(results, true);
    results.innerHTML = `<div class="muted">Searching online (OpenFDA)...</div>`;

    // 1) Try OpenFDA
    try {
      const info = await fetchOpenFDA(name);
      if (info) {
        renderFromOpenFDA(info, name);
        return;
      }
      // if no info found, fall through to local
    } catch (err) {
      // log but continue to local fallback
      console.warn("OpenFDA failed:", err.message);
    }

    // 2) Fallback: Please Wait for Updates.
    const key = name.toLowerCase();
    if (DEV_LOCAL_DB[key]) {
      renderFromLocal(DEV_LOCAL_DB[key]);
      return;
    }

    // 3) Not found
    results.innerHTML = `<div clas="error">No online data found for "<strong>${escapeHtml(name)}</strong>".<br>Please Wait for Updates.</div>`;
  }

  // ---------- UI bindings ----------
  searchBtn.addEventListener("click", () => doSearch(input.value));
  sampleBtn.addEventListener("click", () => { input.value = "aspirin"; doSearch("aspirin"); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(input.value); });

  // ---------- Init ----------
  renderHistory();
});




