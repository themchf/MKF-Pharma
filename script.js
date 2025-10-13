// MKF Pharma - Improved script.js
// Clean version with working search + add-drug section

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("drug-input");
  const searchBtn = document.getElementById("search-btn");
  const results = document.getElementById("results");
  const addDrugForm = document.getElementById("add-drug-form");
  const addDrugBtn = document.getElementById("add-drug-btn");

  // ----------------- Local Database -----------------
  const drugs = JSON.parse(localStorage.getItem("mkf_drugs") || "{}");

  // Default sample data
  if (Object.keys(drugs).length === 0) {
    drugs["aspirin"] = {
      name: "Aspirin",
      class: "NSAID (Salicylate)",
      mechanism:
        "Irreversibly inhibits COX-1 and COX-2 enzymes, reducing prostaglandin and thromboxane A2 synthesis.",
      sideEffects: "Gastrointestinal bleeding, nausea, tinnitus, Reye’s syndrome in children.",
      contraindications: "Active ulcers, bleeding disorders, viral infections in children.",
      interactions: "Warfarin, ibuprofen, alcohol (increases bleeding risk).",
      usage: "Oral; dose depends on indication (analgesic, antiplatelet, or antipyretic).",
      prescription: "OTC (low dose); prescription for higher doses.",
    };
    localStorage.setItem("mkf_drugs", JSON.stringify(drugs));
  }

  // ----------------- Search Function -----------------
  function searchDrug() {
    const name = input.value.trim().toLowerCase();
    if (!name) {
      results.innerHTML = `<p class="error">Please enter a drug name.</p>`;
      return;
    }

    const drug = drugs[name];
    if (!drug) {
      results.innerHTML = `<p class="error">Drug not found. Try adding it below.</p>`;
      return;
    }

    results.innerHTML = `
      <h2>${drug.name}</h2>
      <div><strong>Class:</strong> ${drug.class}</div>
      <div><strong>Mechanism:</strong> ${drug.mechanism}</div>
      <div><strong>Side Effects:</strong> ${drug.sideEffects}</div>
      <div><strong>Contraindications:</strong> ${drug.contraindications}</div>
      <div><strong>Interactions:</strong> ${drug.interactions}</div>
      <div><strong>Usage:</strong> ${drug.usage}</div>
      <div><strong>Prescription:</strong> ${drug.prescription}</div>
    `;
  }

  // Attach search button
  searchBtn.addEventListener("click", searchDrug);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchDrug();
  });

  // ----------------- Add New Drug Section -----------------
  addDrugBtn.addEventListener("click", () => {
    addDrugForm.classList.toggle("hidden");
  });

  addDrugForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(addDrugForm);
    const newDrug = {};
    for (const [key, value] of formData.entries()) {
      newDrug[key] = value.trim() || "—";
    }

    const nameKey = newDrug.name.toLowerCase();
    drugs[nameKey] = newDrug;
    localStorage.setItem("mkf_drugs", JSON.stringify(drugs));

    results.innerHTML = `<p class="success">✅ ${newDrug.name} added successfully!</p>`;
    addDrugForm.reset();
  });
});
