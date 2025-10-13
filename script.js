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
    },
    "paracetamol": {
    name: "Paracetamol",
    class: "Analgesic, Antipyretic",
    indications: ["Pain", "Fever"],
    mechanism: "Inhibits central COX enzymes → reduces prostaglandin synthesis in the CNS.",
    sideEffects: ["Hepatotoxicity in overdose", "Rash (rare)"],
    contraindications: ["Severe hepatic impairment"],
    interactions: ["Alcohol — increases hepatotoxicity risk", "Warfarin — enhances anticoagulant effect with long-term use"],
    pregnancy: "Safe in pregnancy (Category B)."
    },
  "ibuprofen": {
    name: "Ibuprofen",
    class: "NSAID (Propionic acid derivative)",
    indications: ["Pain", "Fever", "Inflammation", "Arthritis"],
    mechanism: "Reversible inhibition of COX-1 and COX-2 → decreased prostaglandin synthesis.",
    sideEffects: ["Gastric irritation", "Ulceration", "Renal impairment"],
    contraindications: ["Peptic ulcer", "Renal failure", "NSAID hypersensitivity"],
    interactions: ["Warfarin — increased bleeding", "ACE inhibitors — reduced antihypertensive effect"],
    pregnancy: "Avoid in 3rd trimester — risk of ductus arteriosus closure."
  },
  "metformin": {
    name: "Metformin",
    class: "Biguanide (Antidiabetic)",
    indications: ["Type 2 diabetes mellitus"],
    mechanism: "Decreases hepatic glucose production and increases insulin sensitivity.",
    sideEffects: ["GI upset", "Lactic acidosis (rare)", "Vitamin B12 deficiency"],
    contraindications: ["Severe renal impairment", "Metabolic acidosis"],
    interactions: ["Contrast media — increases lactic acidosis risk", "Alcohol — potentiates lactic acidosis"],
    pregnancy: "Generally safe (Category B)."
  },
  "atorvastatin": {
    name: "Atorvastatin",
    class: "HMG-CoA reductase inhibitor (Statin)",
    indications: ["Hypercholesterolemia", "Cardiovascular risk reduction"],
    mechanism: "Inhibits HMG-CoA reductase → reduces cholesterol synthesis in liver.",
    sideEffects: ["Myopathy", "Liver enzyme elevation"],
    contraindications: ["Active liver disease", "Pregnancy"],
    interactions: ["Macrolide antibiotics — increased myopathy risk", "Grapefruit juice — increases serum concentration"],
    pregnancy: "Contraindicated (Category X)."
  },
  "omeprazole": {
    name: "Omeprazole",
    class: "Proton pump inhibitor (PPI)",
    indications: ["GERD", "Peptic ulcer", "Zollinger–Ellison syndrome"],
    mechanism: "Irreversibly inhibits H+/K+ ATPase in gastric parietal cells → suppresses acid secretion.",
    sideEffects: ["Headache", "B12 deficiency (long-term)", "Hypomagnesemia"],
    contraindications: ["Hypersensitivity to PPIs"],
    interactions: ["Clopidogrel — reduced antiplatelet effect", "Warfarin — increases INR"],
    pregnancy: "Considered safe (Category C)."
  },
  "losartan": {
    name: "Losartan",
    class: "Angiotensin II receptor blocker (ARB)",
    indications: ["Hypertension", "Heart failure", "Diabetic nephropathy"],
    mechanism: "Blocks angiotensin II receptors → vasodilation and reduced aldosterone secretion.",
    sideEffects: ["Hyperkalemia", "Dizziness", "Renal impairment"],
    contraindications: ["Pregnancy", "Severe renal artery stenosis"],
    interactions: ["Potassium supplements — hyperkalemia risk", "NSAIDs — reduced antihypertensive effect"],
    pregnancy: "Contraindicated (Category D)."
  },
  "enalapril": {
    name: "Enalapril",
    class: "ACE inhibitor",
    indications: ["Hypertension", "Heart failure", "Diabetic nephropathy"],
    mechanism: "Inhibits ACE → reduces angiotensin II and aldosterone, promotes vasodilation.",
    sideEffects: ["Cough", "Hyperkalemia", "Angioedema"],
    contraindications: ["Pregnancy", "History of angioedema"],
    interactions: ["Potassium-sparing diuretics — hyperkalemia risk", "NSAIDs — reduced antihypertensive effect"],
    pregnancy: "Contraindicated (Category D)."
  },
  "furosemide": {
    name: "Furosemide",
    class: "Loop diuretic",
    indications: ["Edema", "Heart failure", "Hypertension"],
    mechanism: "Inhibits Na⁺/K⁺/2Cl⁻ cotransporter in thick ascending limb → increased sodium and water excretion.",
    sideEffects: ["Hypokalemia", "Dehydration", "Ototoxicity"],
    contraindications: ["Severe electrolyte depletion"],
    interactions: ["Aminoglycosides — increased ototoxicity", "Digoxin — hypokalemia increases toxicity risk"],
    pregnancy: "Use only if necessary (Category C)."
  },
  "hydrochlorothiazide": {
    name: "Hydrochlorothiazide",
    class: "Thiazide diuretic",
    indications: ["Hypertension", "Edema"],
    mechanism: "Inhibits Na⁺/Cl⁻ reabsorption in distal convoluted tubule.",
    sideEffects: ["Hypokalemia", "Hyperuricemia", "Hyponatremia"],
    contraindications: ["Anuria", "Sulfa allergy"],
    interactions: ["Digoxin — increased toxicity risk", "Lithium — increased levels"],
    pregnancy: "Avoid if possible (Category B)."
  },
  "salbutamol": {
    name: "Salbutamol",
    class: "β2-adrenergic agonist (short-acting)",
    indications: ["Asthma", "COPD (bronchospasm)"],
    mechanism: "Stimulates β2-receptors → bronchodilation via smooth muscle relaxation.",
    sideEffects: ["Tremor", "Tachycardia", "Hypokalemia"],
    contraindications: ["Severe cardiac arrhythmia"],
    interactions: ["Beta-blockers — antagonize effects"],
    pregnancy: "Generally safe (Category C)."
  },
  "prednisolone": {
    name: "Prednisolone",
    class: "Corticosteroid",
    indications: ["Inflammatory diseases", "Asthma", "Autoimmune disorders"],
    mechanism: "Binds glucocorticoid receptors → suppresses inflammation and immune response.",
    sideEffects: ["Hyperglycemia", "Osteoporosis", "Cushingoid features"],
    contraindications: ["Systemic fungal infections", "Live vaccines"],
    interactions: ["NSAIDs — GI bleeding risk", "Vaccines — reduced efficacy"],
    pregnancy: "Use if benefits outweigh risks (Category C)."
  },
  "warfarin": {
    name: "Warfarin",
    class: "Vitamin K antagonist (Anticoagulant)",
    indications: ["Atrial fibrillation", "DVT/PE prevention", "Mechanical heart valves"],
    mechanism: "Inhibits vitamin K epoxide reductase → reduces synthesis of clotting factors II, VII, IX, X.",
    sideEffects: ["Bleeding", "Skin necrosis", "Teratogenicity"],
    contraindications: ["Pregnancy", "Bleeding disorders"],
    interactions: ["NSAIDs — increased bleeding", "Antibiotics — potentiate effect"],
    pregnancy: "Contraindicated (Category X)."
  },
  "heparin": {
    name: "Heparin",
    class: "Anticoagulant",
    indications: ["DVT", "PE", "MI prophylaxis"],
    mechanism: "Activates antithrombin III → inhibits thrombin and factor Xa.",
    sideEffects: ["Bleeding", "Heparin-induced thrombocytopenia"],
    contraindications: ["Active bleeding", "Severe thrombocytopenia"],
    interactions: ["Aspirin — increased bleeding risk"],
    pregnancy: "Safe (does not cross placenta)."
  },
  "insulin": {
    name: "Insulin",
    class: "Peptide hormone (Antidiabetic)",
    indications: ["Type 1 diabetes", "Type 2 diabetes (when oral agents fail)"],
    mechanism: "Promotes glucose uptake into cells via GLUT4 transporters.",
    sideEffects: ["Hypoglycemia", "Weight gain"],
    contraindications: ["Hypoglycemia"],
    interactions: ["Beta-blockers — mask hypoglycemia symptoms"],
    pregnancy: "Safe (Category B)."
  },
  "metoprolol": {
    name: "Metoprolol",
    class: "Selective β1-blocker",
    indications: ["Hypertension", "Angina", "Heart failure"],
    mechanism: "Blocks β1-receptors → reduces heart rate and cardiac output.",
    sideEffects: ["Bradycardia", "Fatigue", "Cold extremities"],
    contraindications: ["Severe bradycardia", "Heart block"],
    interactions: ["Verapamil — risk of heart block", "Insulin — masks hypoglycemia"],
    pregnancy: "Use if benefits outweigh risks (Category C)."
  },
  "propranolol": {
    name: "Propranolol",
    class: "Non-selective β-blocker",
    indications: ["Hypertension", "Anxiety", "Migraine prophylaxis", "Thyrotoxicosis"],
    mechanism: "Blocks β1 and β2 receptors → decreases heart rate and contractility.",
    sideEffects: ["Bronchospasm", "Bradycardia", "Fatigue"],
    contraindications: ["Asthma", "Severe bradycardia"],
    interactions: ["Verapamil — additive bradycardia"],
    pregnancy: "Category C — use with caution."
  },
  "nitroglycerin": {
    name: "Nitroglycerin",
    class: "Nitrate vasodilator",
    indications: ["Angina pectoris", "Heart failure"],
    mechanism: "Releases nitric oxide → increases cGMP → smooth muscle relaxation → vasodilation.",
    sideEffects: ["Headache", "Hypotension", "Reflex tachycardia"],
    contraindications: ["Severe anemia", "Use with PDE5 inhibitors"],
    interactions: ["Sildenafil — severe hypotension"],
    pregnancy: "Category C — use with caution."
  },
  "diazepam": {
    name: "Diazepam",
    class: "Benzodiazepine",
    indications: ["Anxiety", "Seizures", "Muscle spasm", "Alcohol withdrawal"],
    mechanism: "Enhances GABA-A receptor activity → increases inhibitory neurotransmission.",
    sideEffects: ["Sedation", "Dependence", "Respiratory depression (high doses)"],
    contraindications: ["Severe hepatic impairment", "Sleep apnea"],
    interactions: ["Alcohol — additive CNS depression", "Opioids — respiratory depression"],
    pregnancy: "Avoid (Category D)."
  },
  "morphine": {
    name: "Morphine",
    class: "Opioid analgesic",
    indications: ["Severe pain", "MI-related pain", "Pulmonary edema (acute)"],
    mechanism: "Mu-opioid receptor agonist → inhibits pain transmission and alters pain perception.",
    sideEffects: ["Respiratory depression", "Constipation", "Sedation", "Dependence"],
    contraindications: ["Respiratory depression", "Head injury"],
    interactions: ["Alcohol — enhances CNS depression", "MAOIs — risk of serotonin syndrome"],
    pregnancy: "Use only if necessary (Category C)."
  },
  "ondansetron": {
    name: "Ondansetron",
    class: "5-HT3 receptor antagonist",
    indications: ["Nausea and vomiting (chemotherapy, postoperative)"],
    mechanism: "Blocks serotonin receptors in the chemoreceptor trigger zone and vagal afferents.",
    sideEffects: ["Constipation", "Headache", "QT prolongation"],
    contraindications: ["Congenital long QT syndrome"],
    interactions: ["SSRIs — risk of serotonin syndrome"],
    pregnancy: "Category B — considered safe."
  },
  "levothyroxine": {
    name: "Levothyroxine",
    class: "Thyroid hormone replacement",
    indications: ["Hypothyroidism"],
    mechanism: "Synthetic T4 converted to active T3 → increases metabolism.",
    sideEffects: ["Tachycardia", "Weight loss (overdose)", "Insomnia"],
    contraindications: ["Untreated adrenal insufficiency"],
    interactions: ["Iron — reduces absorption", "Warfarin — enhances effect"],
    pregnancy: "Safe and required (Category A)."
  },
  "fluoxetine": {
    name: "Fluoxetine",
    class: "SSRI (Antidepressant)",
    indications: ["Depression", "OCD", "Anxiety disorders"],
    mechanism: "Inhibits serotonin reuptake → increases synaptic serotonin levels.",
    sideEffects: ["Insomnia", "Sexual dysfunction", "Nausea"],
    contraindications: ["MAOI use within 14 days"],
    interactions: ["MAOIs — serotonin syndrome", "Warfarin — increases bleeding risk"],
    pregnancy: "Use with caution (Category C)."
  },
  "sertraline": {
    name: "Sertraline",
    class: "SSRI (Antidepressant)",
    indications: ["Depression", "PTSD", "Anxiety"],
    mechanism: "Blocks serotonin reuptake transporter → increases serotonin availability.",
    sideEffects: ["GI upset", "Sexual dysfunction", "Insomnia"],
    contraindications: ["Concurrent MAOI use"],
    interactions: ["MAOIs — serotonin syndrome risk"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "clozapine": {
    name: "Clozapine",
    class: "Atypical antipsychotic",
    indications: ["Treatment-resistant schizophrenia"],
    mechanism: "Blocks D2 and 5-HT2A receptors.",
    sideEffects: ["Agranulocytosis", "Weight gain", "Seizures"],
    contraindications: ["History of agranulocytosis"],
    interactions: ["CYP1A2 inhibitors — increase levels"],
    pregnancy: "Category B — use cautiously."
  },
  "haloperidol": {
    name: "Haloperidol",
    class: "Typical antipsychotic (Butyrophenone)",
    indications: ["Schizophrenia", "Delirium", "Tics"],
    mechanism: "Blocks D2 receptors in mesolimbic pathway.",
    sideEffects: ["Extrapyramidal symptoms", "QT prolongation"],
    contraindications: ["Parkinson’s disease"],
    interactions: ["CYP3A4 inhibitors — increased toxicity"],
    pregnancy: "Category C — use cautiously."
  },
  "phenytoin": {
    name: "Phenytoin",
    class: "Anticonvulsant",
    indications: ["Epilepsy", "Seizures"],
    mechanism: "Blocks voltage-gated Na+ channels → stabilizes neuronal membranes.",
    sideEffects: ["Gingival hyperplasia", "Ataxia", "Nystagmus"],
    contraindications: ["Sinus bradycardia", "AV block"],
    interactions: ["Warfarin — altered metabolism", "Oral contraceptives — decreased efficacy"],
    pregnancy: "Category D — teratogenic."
  },
  "valproate": {
    name: "Valproate",
    class: "Anticonvulsant",
    indications: ["Epilepsy", "Bipolar disorder", "Migraine prophylaxis"],
    mechanism: "Increases GABA concentration and blocks Na+ channels.",
    sideEffects: ["Hepatotoxicity", "Weight gain", "Tremor", "Teratogenicity"],
    contraindications: ["Liver disease", "Pregnancy"],
    interactions: ["Phenytoin — altered metabolism"],
    pregnancy: "Contraindicated (Category D/X)."
  },
  "levetiracetam": {
    name: "Levetiracetam",
    class: "Anticonvulsant",
    indications: ["Epilepsy"],
    mechanism: "Binds SV2A vesicle protein → modulates neurotransmitter release.",
    sideEffects: ["Fatigue", "Irritability", "Dizziness"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Minimal clinically significant interactions"],
    pregnancy: "Category C — use with caution."
  },
  "cetirizine": {
    name: "Cetirizine",
    class: "Second-generation antihistamine",
    indications: ["Allergic rhinitis", "Urticaria"],
    mechanism: "Blocks H1 receptors → reduces allergic symptoms.",
    sideEffects: ["Drowsiness (mild)", "Dry mouth"],
    contraindications: ["Severe renal impairment"],
    interactions: ["Alcohol — additive sedation"],
    pregnancy: "Category B — considered safe."
  },
  "loratadine": {
    name: "Loratadine",
    class: "Second-generation antihistamine",
    indications: ["Allergic rhinitis", "Urticaria"],
    mechanism: "Selectively blocks H1 histamine receptors.",
    sideEffects: ["Headache", "Dry mouth"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Ketoconazole — increases loratadine levels"],
    pregnancy: "Category B — safe."
  },
  "dexamethasone": {
    name: "Dexamethasone",
    class: "Glucocorticoid",
    indications: ["Inflammation", "Allergic reactions", "Cerebral edema"],
    mechanism: "Binds glucocorticoid receptors → suppresses immune response.",
    sideEffects: ["Hyperglycemia", "Immunosuppression", "Osteoporosis"],
    contraindications: ["Systemic fungal infection"],
    interactions: ["NSAIDs — increased ulcer risk"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "azithromycin": {
    name: "Azithromycin",
    class: "Macrolide antibiotic",
    indications: ["Respiratory infections", "Chlamydia", "Skin infections"],
    mechanism: "Binds 50S ribosomal subunit → inhibits bacterial protein synthesis.",
    sideEffects: ["GI upset", "QT prolongation"],
    contraindications: ["Hepatic dysfunction"],
    interactions: ["Warfarin — increases bleeding risk"],
    pregnancy: "Safe (Category B)."
  },
  "ciprofloxacin": {
    name: "Ciprofloxacin",
    class: "Fluoroquinolone antibiotic",
    indications: ["UTI", "GI infections", "Respiratory infections"],
    mechanism: "Inhibits DNA gyrase and topoisomerase IV.",
    sideEffects: ["Tendon rupture", "QT prolongation", "GI upset"],
    contraindications: ["Pregnancy", "Children (cartilage damage)"],
    interactions: ["Antacids — reduce absorption"],
    pregnancy: "Avoid (Category C)."
  },
  "ceftriaxone": {
    name: "Ceftriaxone",
    class: "Third-generation cephalosporin",
    indications: ["Meningitis", "Pneumonia", "UTI", "Gonorrhea"],
    mechanism: "Inhibits bacterial cell wall synthesis (binds PBPs).",
    sideEffects: ["Diarrhea", "Allergic reactions", "Biliary sludge"],
    contraindications: ["Severe penicillin allergy"],
    interactions: ["Calcium IV solutions — precipitation risk"],
    pregnancy: "Safe (Category B)."
  },
  "metronidazole": {
    name: "Metronidazole",
    class: "Nitroimidazole antibiotic",
    indications: ["Anaerobic infections", "Trichomoniasis", "Giardiasis"],
    mechanism: "Forms toxic free radicals → damages bacterial DNA.",
    sideEffects: ["Metallic taste", "Disulfiram-like reaction with alcohol"],
    contraindications: ["Alcohol use", "First trimester pregnancy"],
    interactions: ["Warfarin — increases anticoagulant effect"],
    pregnancy: "Avoid in 1st trimester (Category B)."
  },
  "gentamicin": {
    name: "Gentamicin",
    class: "Aminoglycoside antibiotic",
    indications: ["Severe Gram-negative infections", "Sepsis"],
    mechanism: "Binds 30S ribosomal subunit → inhibits protein synthesis (bactericidal).",
    sideEffects: ["Nephrotoxicity", "Ototoxicity"],
    contraindications: ["Renal impairment"],
    interactions: ["Loop diuretics — increased ototoxicity"],
    pregnancy: "Category D — use only if life-saving."
  },
  "vancomycin": {
    name: "Vancomycin",
    class: "Glycopeptide antibiotic",
    indications: ["MRSA", "C. difficile (oral form)"],
    mechanism: "Inhibits cell wall synthesis by binding D-Ala-D-Ala terminus of peptidoglycan.",
    sideEffects: ["Red man syndrome", "Nephrotoxicity"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Nephrotoxic drugs — additive effects"],
    pregnancy: "Category B — use if necessary."
  },
  "clindamycin": {
    name: "Clindamycin",
    class: "Lincosamide antibiotic",
    indications: ["Anaerobic infections", "Skin infections", "Dental abscesses"],
    mechanism: "Binds 50S ribosomal subunit → inhibits bacterial protein synthesis.",
    sideEffects: ["Diarrhea", "C. difficile colitis"],
    contraindications: ["History of colitis"],
    interactions: ["Erythromycin — antagonistic effect"],
    pregnancy: "Category B — safe."
  },
  "rifampicin": {
    name: "Rifampicin",
    class: "Antitubercular antibiotic",
    indications: ["Tuberculosis", "Meningococcal prophylaxis"],
    mechanism: "Inhibits DNA-dependent RNA polymerase in bacteria.",
    sideEffects: ["Hepatotoxicity", "Orange discoloration of body fluids"],
    contraindications: ["Liver disease"],
    interactions: ["Warfarin — decreased effect", "Oral contraceptives — reduced efficacy"],
    pregnancy: "Category C — use with caution."
  },
  "isoniazid": {
    name: "Isoniazid",
    class: "Antitubercular drug",
    indications: ["Tuberculosis"],
    mechanism: "Inhibits mycolic acid synthesis in mycobacterial cell wall.",
    sideEffects: ["Hepatotoxicity", "Peripheral neuropathy (prevent with B6)"],
    contraindications: ["Liver disease"],
    interactions: ["Phenytoin — increased levels"],
    pregnancy: "Category C — supplement with pyridoxine."
  },
  "chloroquine": {
    name: "Chloroquine",
    class: "Antimalarial",
    indications: ["Malaria", "Rheumatoid arthritis"],
    mechanism: "Prevents heme polymerization → toxic to parasite.",
    sideEffects: ["Retinopathy", "Pruritus"],
    contraindications: ["Psoriasis", "Retinal disease"],
    interactions: ["Antacids — reduce absorption"],
    pregnancy: "Safe (Category C)."
  },
  "acyclovir": {
    name: "Acyclovir",
    class: "Antiviral (Nucleoside analogue)",
    indications: ["Herpes simplex", "Varicella zoster"],
    mechanism: "Inhibits viral DNA polymerase after phosphorylation by viral thymidine kinase.",
    sideEffects: ["Nephrotoxicity (IV)", "GI upset"],
    contraindications: ["Renal impairment"],
    interactions: ["Probenecid — increases acyclovir levels"],
    pregnancy: "Category B — safe."
  },
  "oseltamivir": {
    name: "Oseltamivir",
    class: "Neuraminidase inhibitor (Antiviral)",
    indications: ["Influenza A and B"],
    mechanism: "Inhibits neuraminidase → prevents viral release from host cells.",
    sideEffects: ["Nausea", "Vomiting"],
    contraindications: ["Hypersensitivity"],
    interactions: ["None significant"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "fluconazole": {
    name: "Fluconazole",
    class: "Azole antifungal",
    indications: ["Candidiasis", "Cryptococcal meningitis"],
    mechanism: "Inhibits fungal CYP450 enzyme → impairs ergosterol synthesis.",
    sideEffects: ["Hepatotoxicity", "QT prolongation"],
    contraindications: ["Liver disease"],
    interactions: ["Warfarin — increased INR", "Phenytoin — increased levels"],
    pregnancy: "Avoid in 1st trimester (Category D)."
  },
  "albendazole": {
    name: "Albendazole",
    class: "Anthelmintic",
    indications: ["Helminth infections", "Neurocysticercosis"],
    mechanism: "Inhibits microtubule synthesis in parasites.",
    sideEffects: ["Abdominal pain", "Elevated liver enzymes"],
    contraindications: ["Pregnancy (1st trimester)"],
    interactions: ["Dexamethasone — increases plasma levels"],
    pregnancy: "Avoid in 1st trimester (Category C)."
  },
  "nitrofurantoin": {
    name: "Nitrofurantoin",
    class: "Urinary antiseptic",
    indications: ["UTI (lower tract)"],
    mechanism: "Inhibits bacterial enzymes and damages bacterial DNA.",
    sideEffects: ["Pulmonary fibrosis (chronic use)", "GI upset"],
    contraindications: ["Renal impairment", "Late pregnancy"],
    interactions: ["Antacids — reduce absorption"],
    pregnancy: "Avoid near term (Category B)."
  },
  "omeprazole": {
    name: "Omeprazole",
    class: "PPI (Proton Pump Inhibitor)",
    indications: ["GERD", "Peptic ulcer"],
    mechanism: "Irreversibly inhibits H+/K+ ATPase in gastric parietal cells.",
    sideEffects: ["Headache", "Hypomagnesemia", "B12 deficiency (long-term)"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Clopidogrel — reduces efficacy"],
    pregnancy: "Safe (Category C)."
  },
  "ranitidine": {
    name: "Ranitidine",
    class: "H2 receptor blocker",
    indications: ["Peptic ulcer", "GERD"],
    mechanism: "Blocks H2 receptors → decreases gastric acid secretion.",
    sideEffects: ["Headache", "Dizziness"],
    contraindications: ["Porphyria"],
    interactions: ["Warfarin — increases INR"],
    pregnancy: "Safe (Category B)."
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
    results.innerHTML = `<div class="error">No online data found for "<strong>${escapeHtml(name)}</strong>".<br>Please Wait for Updates.</div>`;
  }

  // ---------- UI bindings ----------
  searchBtn.addEventListener("click", () => doSearch(input.value));
  sampleBtn.addEventListener("click", () => { input.value = "aspirin"; doSearch("aspirin"); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(input.value); });

  // ---------- Init ----------
  renderHistory();
});








