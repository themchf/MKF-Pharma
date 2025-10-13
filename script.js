// MKF Pharma - script.js (online-first, developer-editable local DB)
// - Primary data source: OpenFDA drug label API (https://api.fda.gov/drug/label)
// - If OpenFDA does not return results, the app falls back to DEV_LOCAL_DB
// - Developer-only local DB: edit DEV_LOCAL_DB below to add more drugs (no public add UI)

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Developer local DB (edit this object ONLY as a developer) ----------
  // Add more drug objects here keyed by lowercase name or common generic.
  // Example: 'metformin': { name: 'Metformin', class: 'Biguanide', ... }
  const DEV_LOCAL_DB = {
    const DRUG_DB = {
  "aspirin": {
    name: "Aspirin",
    class: "Salicylate (NSAID)",
    indications: ["Pain", "Fever", "Inflammation", "Low-dose for MI prevention"],
    mechanism: "Irreversible inhibition of COX-1 and COX-2 → reduced prostaglandins & thromboxane A2.",
    usage: "Oral: 325–650 mg every 4–6 hours for pain/fever; 75–100 mg daily for cardiovascular prevention.",
    sideEffects: ["Gastrointestinal bleeding", "Tinnitus at high doses", "Allergic reactions", "Reye syndrome in children"],
    contraindications: ["Active peptic ulcer disease", "Bleeding disorders", "Known salicylate hypersensitivity"],
    interactions: ["Anticoagulants (warfarin) — increased bleeding", "Other NSAIDs — reduced cardioprotective effect"],
    pregnancy: "Avoid in late pregnancy — risk of premature ductus arteriosus closure (Category D near term)."
  },
  "amoxicillin": {
    name: "Amoxicillin",
    class: "Beta-lactam antibiotic (Penicillin)",
    indications: ["Respiratory tract infections", "UTIs", "Skin infections", "H. pylori eradication (with clarithromycin)"],
    mechanism: "Inhibits bacterial cell wall synthesis by binding PBPs → bactericidal.",
    usage: "Oral: 250–500 mg every 8 hours or 875 mg every 12 hours depending on infection.",
    sideEffects: ["Diarrhea", "Rash", "Allergic reactions", "Rare hepatotoxicity"],
    contraindications: ["Penicillin allergy"],
    interactions: ["Methotrexate — reduced clearance", "Oral contraceptives — minor reduced efficacy"],
    pregnancy: "Generally safe (Category B)."
  },
  "paracetamol": {
    name: "Paracetamol",
    class: "Analgesic, Antipyretic",
    indications: ["Pain", "Fever"],
    mechanism: "Inhibits central COX enzymes → reduces prostaglandin synthesis in the CNS.",
    usage: "Oral/IV: 500–1000 mg every 6 hours; maximum 4 g/day in adults.",
    sideEffects: ["Hepatotoxicity in overdose", "Skin rash (rare)"],
    contraindications: ["Severe hepatic impairment"],
    interactions: ["Alcohol — increased liver toxicity", "Warfarin — prolonged INR with chronic use"],
    pregnancy: "Generally safe in pregnancy (Category B)."
  },
  "ibuprofen": {
    name: "Ibuprofen",
    class: "NSAID (Propionic acid derivative)",
    indications: ["Pain", "Fever", "Inflammation", "Arthritis"],
    mechanism: "Reversible inhibition of COX-1 and COX-2 → decreased prostaglandin synthesis.",
    usage: "Oral: 200–400 mg every 6–8 hours; maximum 1200 mg/day OTC or 3200 mg/day prescription.",
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
    usage: "Oral: 500–1000 mg twice daily with meals; maximum 2 g/day (IR) or 2.5 g/day (ER).",
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
    usage: "Oral: 10–80 mg once daily, preferably in the evening.",
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
    usage: "Oral: 20–40 mg once daily before breakfast; duration depends on indication.",
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
    usage: "Oral: 25–100 mg once daily; adjust based on response.",
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
    usage: "Oral: 5–20 mg once or twice daily; adjust according to BP response.",
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
    usage: "Oral: 20–80 mg/day; IV: 20–40 mg every 6–12 hours; adjust per response.",
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
    usage: "Oral: 12.5–50 mg once daily; adjust based on BP response.",
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
    usage: "Inhaler: 100–200 mcg every 4–6 hours as needed; nebulizer: 2.5 mg every 6–8 hours.",
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
    usage: "Oral: 5–60 mg/day depending on condition; taper gradually if long-term.",
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
    usage: "Oral: 2–10 mg once daily; adjust per INR target.",
    sideEffects: ["Bleeding", "Skin necrosis", "Teratogenicity"],
    contraindications: ["Pregnancy", "Bleeding disorders"],
    interactions: ["NSAIDs — increased bleeding", "Antibiotics — potentiate effect"],
    pregnancy: "Contraindicated (Category X)."
  }  ,
  "clopidogrel": {
    name: "Clopidogrel",
    class: "Antiplatelet (P2Y12 inhibitor)",
    indications: ["Acute coronary syndrome", "Post-PCI", "Stroke prevention"],
    mechanism: "Irreversibly inhibits P2Y12 receptor → prevents ADP-mediated platelet aggregation.",
    usage: "Oral: 75 mg once daily; 300 mg loading dose for acute events.",
    sideEffects: ["Bleeding", "Thrombocytopenia", "Rash"],
    contraindications: ["Active bleeding", "Hypersensitivity"],
    interactions: ["Omeprazole — reduces efficacy", "NSAIDs — increased bleeding risk"],
    pregnancy: "Use if benefits outweigh risks (Category B)."
  },
  "heparin": {
    name: "Heparin",
    class: "Anticoagulant",
    indications: ["DVT/PE prophylaxis", "Acute coronary syndrome"],
    mechanism: "Activates antithrombin III → inhibits thrombin and factor Xa.",
    usage: "IV: 5000 units loading dose, then 1000 units/hr; adjust per aPTT.",
    sideEffects: ["Bleeding", "Heparin-induced thrombocytopenia", "Osteoporosis (long-term)"],
    contraindications: ["Active bleeding", "Severe thrombocytopenia"],
    interactions: ["NSAIDs — increased bleeding risk", "Other anticoagulants"],
    pregnancy: "Safe (Category C)."
  },
  "ceftriaxone": {
    name: "Ceftriaxone",
    class: "Third-generation cephalosporin",
    indications: ["Meningitis", "Pneumonia", "UTI", "Gonorrhea"],
    mechanism: "Inhibits bacterial cell wall synthesis (binds PBPs).",
    usage: "IV/IM: 1–2 g once daily; adjust for severe infections.",
    sideEffects: ["Diarrhea", "Allergic reactions", "Biliary sludge"],
    contraindications: ["Severe penicillin allergy"],
    interactions: ["Calcium IV solutions — precipitation risk"],
    pregnancy: "Safe (Category B)."
  },
  "gentamicin": {
    name: "Gentamicin",
    class: "Aminoglycoside antibiotic",
    indications: ["Severe Gram-negative infections", "Sepsis"],
    mechanism: "Binds 30S ribosomal subunit → inhibits protein synthesis.",
    usage: "IV/IM: 3–5 mg/kg/day in 2–3 divided doses; adjust for renal function.",
    sideEffects: ["Nephrotoxicity", "Ototoxicity"],
    contraindications: ["Renal impairment", "Myasthenia gravis"],
    interactions: ["Loop diuretics — increased ototoxicity"],
    pregnancy: "Category D — use only if life-saving."
  },
  "vancomycin": {
    name: "Vancomycin",
    class: "Glycopeptide antibiotic",
    indications: ["MRSA", "C. difficile (oral)"],
    mechanism: "Inhibits cell wall synthesis by binding D-Ala-D-Ala terminus.",
    usage: "IV: 15 mg/kg every 12 hours; oral: 125–500 mg every 6 hours for C. difficile.",
    sideEffects: ["Red man syndrome", "Nephrotoxicity", "Ototoxicity"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Nephrotoxic drugs — additive effect"],
    pregnancy: "Category B — use if necessary."
  },
  "clindamycin": {
    name: "Clindamycin",
    class: "Lincosamide antibiotic",
    indications: ["Anaerobic infections", "Skin infections", "Dental abscesses"],
    mechanism: "Binds 50S ribosomal subunit → inhibits protein synthesis.",
    usage: "Oral: 150–450 mg every 6–8 hours; IV: 600–900 mg every 8 hours.",
    sideEffects: ["Diarrhea", "C. difficile colitis", "Rash"],
    contraindications: ["History of colitis"],
    interactions: ["Erythromycin — antagonistic"],
    pregnancy: "Category B — safe."
  },
  "metronidazole": {
    name: "Metronidazole",
    class: "Nitroimidazole antibiotic",
    indications: ["Anaerobic infections", "Trichomoniasis", "Giardiasis"],
    mechanism: "Forms toxic free radicals → damages bacterial DNA.",
    usage: "Oral/IV: 500 mg every 8 hours for 7–10 days.",
    sideEffects: ["Metallic taste", "Disulfiram-like reaction with alcohol"],
    contraindications: ["Alcohol use", "1st trimester pregnancy"],
    interactions: ["Warfarin — increases INR"],
    pregnancy: "Avoid in 1st trimester (Category B)."
  },
  "rifampicin": {
    name: "Rifampicin",
    class: "Antitubercular antibiotic",
    indications: ["Tuberculosis", "Meningococcal prophylaxis"],
    mechanism: "Inhibits DNA-dependent RNA polymerase.",
    usage: "Oral: 10 mg/kg/day; usual adult dose 600 mg once daily.",
    sideEffects: ["Hepatotoxicity", "Orange discoloration of urine/tears"],
    contraindications: ["Liver disease", "Concurrent hepatotoxic drugs"],
    interactions: ["Warfarin — decreased effect", "Oral contraceptives — reduced efficacy"],
    pregnancy: "Category C — use with caution."
  },
  "isoniazid": {
    name: "Isoniazid",
    class: "Antitubercular drug",
    indications: ["Tuberculosis"],
    mechanism: "Inhibits mycolic acid synthesis in mycobacterial cell wall.",
    usage: "Oral: 5 mg/kg/day; maximum 300 mg/day.",
    sideEffects: ["Hepatotoxicity", "Peripheral neuropathy"],
    contraindications: ["Liver disease", "Previous hypersensitivity"],
    interactions: ["Phenytoin — increased levels"],
    pregnancy: "Category C — supplement with pyridoxine."
  },
  "chloroquine": {
    name: "Chloroquine",
    class: "Antimalarial",
    indications: ["Malaria", "Rheumatoid arthritis", "Lupus erythematosus"],
    mechanism: "Prevents heme polymerization → toxic to parasite.",
    usage: "Oral: 600 mg base initially, then 300 mg after 6, 24, 48 hours for malaria.",
    sideEffects: ["Retinopathy", "Pruritus", "GI upset"],
    contraindications: ["Retinal disease", "Psoriasis"],
    interactions: ["Antacids — reduce absorption"],
    pregnancy: "Safe (Category C)."
  },
  "acyclovir": {
    name: "Acyclovir",
    class: "Antiviral (Nucleoside analogue)",
    indications: ["HSV infections", "Varicella zoster"],
    mechanism: "Inhibits viral DNA polymerase after phosphorylation by viral thymidine kinase.",
    usage: "Oral: 200–800 mg 5 times daily; IV: 5–10 mg/kg every 8 hours.",
    sideEffects: ["Nephrotoxicity (IV)", "GI upset"],
    contraindications: ["Renal impairment"],
    interactions: ["Probenecid — increases levels"],
    pregnancy: "Category B — safe."
  },
  "oseltamivir": {
    name: "Oseltamivir",
    class: "Neuraminidase inhibitor",
    indications: ["Influenza A & B"],
    mechanism: "Inhibits neuraminidase → prevents viral release.",
    usage: "Oral: 75 mg twice daily for 5 days (treatment), 75 mg once daily for 10 days (prophylaxis).",
    sideEffects: ["Nausea", "Vomiting", "Headache"],
    contraindications: ["Hypersensitivity"],
    interactions: ["None significant"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "fluconazole": {
    name: "Fluconazole",
    class: "Azole antifungal",
    indications: ["Candidiasis", "Cryptococcal meningitis"],
    mechanism: "Inhibits fungal CYP450 enzyme → impairs ergosterol synthesis.",
    usage: "Oral/IV: 150–400 mg/day depending on infection.",
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
    usage: "Oral: 400 mg once daily for 3–5 days; longer for cysticercosis.",
    sideEffects: ["Abdominal pain", "Elevated liver enzymes"],
    contraindications: ["1st trimester pregnancy"],
    interactions: ["Dexamethasone — increases levels"],
    pregnancy: "Avoid in 1st trimester (Category C)."
  },
  "nitrofurantoin": {
    name: "Nitrofurantoin",
    class: "Urinary antiseptic",
    indications: ["Lower UTIs"],
    mechanism: "Damages bacterial DNA via reactive intermediates.",
    usage: "Oral: 100 mg twice daily for 5–7 days.",
    sideEffects: ["Pulmonary fibrosis (long-term)", "GI upset"],
    contraindications: ["Renal impairment", "Late pregnancy"],
    interactions: ["Antacids — reduce absorption"],
    pregnancy: "Avoid near term (Category B)."
  },
  "levothyroxine": {
    name: "Levothyroxine",
    class: "Thyroid hormone",
    indications: ["Hypothyroidism", "Goiter", "Myxedema"],
    mechanism: "Synthetic T4 → converted to T3, regulates metabolism.",
    usage: "Oral: 25–200 mcg daily; adjust per TSH.",
    sideEffects: ["Hyperthyroidism if overdosed", "Palpitations", "Insomnia"],
    contraindications: ["Untreated thyrotoxicosis", "Acute MI"],
    interactions: ["Iron supplements — reduce absorption", "Warfarin — increased anticoagulation"],
    pregnancy: "Category A — safe."
  },
  "levetiracetam": {
    name: "Levetiracetam",
    class: "Antiepileptic",
    indications: ["Partial seizures", "Generalized tonic-clonic seizures"],
    mechanism: "Binds SV2A → modulates neurotransmitter release.",
    usage: "Oral: 500–1500 mg twice daily; IV: 500–1500 mg every 12 hours.",
    sideEffects: ["Somnolence", "Irritability", "Dizziness"],
    contraindications: ["Hypersensitivity"],
    interactions: ["None significant"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "lamotrigine": {
    name: "Lamotrigine",
    class: "Antiepileptic",
    indications: ["Partial and generalized seizures", "Bipolar disorder"],
    mechanism: "Inhibits voltage-gated Na+ channels → stabilizes neuronal membranes.",
    usage: "Oral: 25–200 mg daily (titration required).",
    sideEffects: ["Rash", "Stevens–Johnson syndrome", "Dizziness"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Valproate — increases lamotrigine levels"],
    pregnancy: "Category C — monitor risk/benefit."
  },
  "diazepam": {
    name: "Diazepam",
    class: "Benzodiazepine",
    indications: ["Anxiety", "Seizures", "Muscle spasm"],
    mechanism: "Enhances GABA-A receptor activity → CNS depression.",
    usage: "Oral: 2–10 mg 2–4 times daily; IV/IM for seizures 5–10 mg.",
    sideEffects: ["Drowsiness", "Dependence", "Respiratory depression"],
    contraindications: ["Severe respiratory insufficiency", "Sleep apnea"],
    interactions: ["Alcohol — additive CNS depression", "CYP3A4 inhibitors"],
    pregnancy: "Category D — avoid if possible."
  },
  "lorazepam": {
    name: "Lorazepam",
    class: "Benzodiazepine",
    indications: ["Anxiety", "Status epilepticus", "Sedation"],
    mechanism: "Enhances GABA-A receptor activity.",
    usage: "Oral: 1–3 mg/day in divided doses; IV: 4 mg slowly for status epilepticus.",
    sideEffects: ["Sedation", "Dependence", "Respiratory depression"],
    contraindications: ["Severe respiratory insufficiency"],
    interactions: ["Alcohol — additive CNS depression", "CYP3A4 inhibitors"],
    pregnancy: "Category D — avoid if possible."
  },
  "montelukast": {
    name: "Montelukast",
    class: "Leukotriene receptor antagonist",
    indications: ["Asthma", "Allergic rhinitis"],
    mechanism: "Blocks leukotriene D4 receptor → reduces bronchoconstriction and inflammation.",
    usage: "Oral: 10 mg once daily in evening (adults).",
    sideEffects: ["Headache", "GI upset", "Mood changes"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Phenobarbital — may reduce levels"],
    pregnancy: "Category B — safe."
  },
  "salmeterol": {
    name: "Salmeterol",
    class: "β2-agonist (long-acting)",
    indications: ["Asthma (maintenance)", "COPD"],
    mechanism: "Stimulates β2 receptors → bronchodilation.",
    usage: "Inhaler: 50 mcg twice daily.",
    sideEffects: ["Tremor", "Palpitations", "Hypokalemia"],
    contraindications: ["Acute asthma attack"],
    interactions: ["Beta-blockers — reduce effect"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "allopurinol": {
    name: "Allopurinol",
    class: "Xanthine oxidase inhibitor",
    indications: ["Gout", "Hyperuricemia", "Kidney stones prevention"],
    mechanism: "Inhibits xanthine oxidase → reduces uric acid production.",
    usage: "Oral: 100–300 mg daily; adjust per uric acid levels.",
    sideEffects: ["Rash", "Hepatotoxicity", "GI upset"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Azathioprine — increased toxicity", "Mercaptopurine — increased effect"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "digoxin": {
    name: "Digoxin",
    class: "Cardiac glycoside",
    indications: ["Heart failure", "Atrial fibrillation"],
    mechanism: "Inhibits Na+/K+ ATPase → increases intracellular Ca²⁺ → positive inotropy.",
    usage: "Oral/IV: 0.125–0.25 mg daily; monitor serum levels.",
    sideEffects: ["Arrhythmias", "GI upset", "Visual disturbances"],
    contraindications: ["Ventricular fibrillation"],
    interactions: ["Diuretics — hypokalemia increases toxicity", "Amiodarone — increases levels"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "spironolactone": {
    name: "Spironolactone",
    class: "Potassium-sparing diuretic, aldosterone antagonist",
    indications: ["Heart failure", "Hypertension", "Edema", "Hyperaldosteronism"],
    mechanism: "Blocks aldosterone receptor → reduces Na⁺ reabsorption & K⁺ excretion.",
    usage: "Oral: 25–100 mg/day.",
    sideEffects: ["Hyperkalemia", "Gynecomastia", "Menstrual irregularities"],
    contraindications: ["Hyperkalemia", "Anuria", "Renal failure"],
    interactions: ["ACE inhibitors — hyperkalemia risk", "NSAIDs — reduce efficacy"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "ranitidine": {
    name: "Ranitidine",
    class: "H2 receptor blocker",
    indications: ["Peptic ulcer", "GERD"],
    mechanism: "Blocks H2 receptors → decreases gastric acid secretion.",
    usage: "Oral: 150 mg twice daily or 300 mg at bedtime.",
    sideEffects: ["Headache", "Dizziness", "Constipation/diarrhea"],
    contraindications: ["Porphyria"],
    interactions: ["Warfarin — increased INR"],
    pregnancy: "Safe (Category B)."
  },
  "sertraline": {
    name: "Sertraline",
    class: "SSRI",
    indications: ["Depression", "Panic disorder", "OCD", "PTSD"],
    mechanism: "Inhibits serotonin reuptake → increases CNS serotonin.",
    usage: "Oral: 50–200 mg once daily.",
    sideEffects: ["Nausea", "Insomnia", "Sexual dysfunction"],
    contraindications: ["MAOI use", "Hypersensitivity"],
    interactions: ["MAOIs — serotonin syndrome", "NSAIDs — bleeding risk"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "escitalopram": {
    name: "Escitalopram",
    class: "SSRI",
    indications: ["Depression", "Generalized anxiety disorder"],
    mechanism: "Selective serotonin reuptake inhibitor.",
    usage: "Oral: 10–20 mg once daily.",
    sideEffects: ["Nausea", "Headache", "Insomnia", "Sexual dysfunction"],
    contraindications: ["MAOI use", "Hypersensitivity"],
    interactions: ["MAOIs — serotonin syndrome", "NSAIDs — bleeding risk"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "dexamethasone": {
    name: "Dexamethasone",
    class: "Corticosteroid",
    indications: ["Inflammatory conditions", "Cerebral edema", "Allergic reactions"],
    mechanism: "Binds glucocorticoid receptor → suppresses inflammation & immune response.",
    usage: "Oral/IV: 0.5–9 mg/day depending on condition; taper if long-term.",
    sideEffects: ["Hyperglycemia", "Osteoporosis", "Immunosuppression"],
    contraindications: ["Systemic fungal infections"],
    interactions: ["NSAIDs — increased GI risk", "Vaccines — reduced efficacy"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  "hydrocortisone": {
    name: "Hydrocortisone",
    class: "Corticosteroid",
    indications: ["Adrenal insufficiency", "Inflammation", "Allergic reactions"],
    mechanism: "Mimics cortisol → regulates metabolism, inflammation, & immune response.",
    usage: "Oral: 15–30 mg/day in divided doses; IV: 100–500 mg for acute conditions.",
    sideEffects: ["Hyperglycemia", "Edema", "Immunosuppression"],
    contraindications: ["Systemic fungal infections"],
    interactions: ["NSAIDs — increased GI risk", "Vaccines — reduced efficacy"],
    pregnancy: "Category C — use if benefits outweigh risks."
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
// ---------- Usage ----------
let usageText = "—";
const possibleUsageFields = [
  "dosage_and_administration",
  "indications_and_usage",
  "how_supplied",
  "general_precautions",
  "warnings",
  "precautions"
];

// Find first non-empty field
for (const field of possibleUsageFields) {
  const val = info[field];
  if (Array.isArray(val) && val.length > 0) {
    usageText = val.join("\n\n");
    break;
  } else if (typeof val === "string" && val.trim().length > 0) {
    usageText = val;
    break;
  }
}
    results.appendChild(makeRow("Usage", arrayToHtmlList(usageArr.length ? usageArr : "—")));
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
    results.appendChild(makeRow("Usage", arrayToHtmlList(drugObj.usage)));
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

    // 2) Fallback: DEV_LOCAL_DB (developer can add entries here in script.js)
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











