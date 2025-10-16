// -------------------- MKF Pharma - script.js --------------------
// Local Drug Database Version with full clinical fields
// Includes: Class, Indications, Mechanism, Usage, Side Effects, Contraindications, Interactions, Pregnancy
// Also saves search history permanently using localStorage

const DEV_LOCAL_DB = {
  "aspirin": {
    name: "Aspirin",
    class: "Salicylate (NSAID)",
    indications: ["Pain", "Fever", "Inflammation", "Low-dose for MI prevention"],
    mechanism: "Irreversible inhibition of COX-1 and COX-2 → decreased prostaglandin and thromboxane synthesis.",
    usage: "Take 1 tablet (325–650 mg) every 4–6 hours as needed for pain or fever; do not exceed 4 g/day.",
    sideEffects: ["Gastrointestinal bleeding", "Ulceration", "Nausea", "Tinnitus (at high doses)"],
    contraindications: ["Peptic ulcer disease", "Bleeding disorders", "Children with viral infections (risk of Reye’s syndrome)"],
    interactions: ["Warfarin", "Corticosteroids", "Alcohol", "Other NSAIDs"],
    pregnancy: "Avoid in the third trimester due to risk of premature closure of the ductus arteriosus."
  },

  "amoxicillin": {
    name: "Amoxicillin",
    class: "Beta-lactam antibiotic (penicillin class)",
    indications: ["Bacterial infections", "Otitis media", "Sinusitis", "Pneumonia"],
    mechanism: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins → cell lysis.",
    usage: "Take 500 mg every 8 hours or 875 mg every 12 hours; complete full course as prescribed.",
    sideEffects: ["Rash", "Diarrhea", "Nausea", "Allergic reactions (anaphylaxis rare)"],
    contraindications: ["Hypersensitivity to penicillins or beta-lactams"],
    interactions: ["Methotrexate (increased toxicity)", "Oral contraceptives (reduced effectiveness)"],
    pregnancy: "Generally considered safe (Category B)."
  },

  "metformin": {
    name: "Metformin",
    class: "Biguanide (antidiabetic)",
    indications: ["Type 2 diabetes mellitus", "Polycystic ovary syndrome (off-label)"],
    mechanism: "Decreases hepatic glucose production, decreases intestinal absorption of glucose, and improves insulin sensitivity.",
    usage: "Start with 500 mg once daily with meals; gradually increase to 1000 mg twice daily as tolerated.",
    sideEffects: ["Nausea", "Diarrhea", "Abdominal discomfort", "Rare: lactic acidosis"],
    contraindications: ["Severe renal impairment (eGFR < 30 mL/min/1.73 m²)", "Metabolic acidosis", "Severe hepatic disease"],
    interactions: ["Alcohol", "Iodinated contrast media (hold before and after imaging)", "Cimetidine"],
    pregnancy: "Generally safe; used in gestational diabetes under supervision."
  },
  
  "ibuprofen": {
    name: "Ibuprofen",
    class: "NSAID (propionic acid derivative)",
    indications: ["Pain", "Fever", "Inflammation", "Arthritis"],
    mechanism: "Reversibly inhibits COX-1 and COX-2, decreasing prostaglandin synthesis.",
    usage: "200–400 mg orally every 6–8 hours as needed (max 3200 mg/day).",
    sideEffects: ["Gastric irritation", "Ulceration", "Renal impairment"],
    contraindications: ["Peptic ulcer", "Severe renal impairment", "NSAID hypersensitivity"],
    interactions: ["Warfarin", "ACE inhibitors", "Aspirin (reduces cardioprotective effect)"],
    pregnancy: "Avoid in 3rd trimester due to risk of ductus arteriosus closure."
  },
  
  "omeprazole": {
    name: "Omeprazole",
    class: "Proton pump inhibitor (PPI)",
    indications: ["GERD", "Peptic ulcer disease", "Zollinger–Ellison syndrome"],
    mechanism: "Irreversibly inhibits H+/K+ ATPase in gastric parietal cells, suppressing acid secretion.",
    usage: "20–40 mg orally once daily before breakfast.",
    sideEffects: ["Headache", "B12 deficiency (long-term use)", "Hypomagnesemia"],
    contraindications: ["Hypersensitivity to omeprazole"],
    interactions: ["Clopidogrel", "Warfarin", "Ketoconazole"],
    pregnancy: "Generally considered safe (Category C)."
  },
  
  "atorvastatin": {
    name: "Atorvastatin",
    class: "HMG-CoA reductase inhibitor (statin)",
    indications: ["Hypercholesterolemia", "Cardiovascular risk reduction"],
    mechanism: "Inhibits HMG-CoA reductase, reducing hepatic cholesterol synthesis.",
    usage: "10–80 mg orally once daily in the evening.",
    sideEffects: ["Myalgia", "Liver enzyme elevation", "Rhabdomyolysis (rare)"],
    contraindications: ["Active liver disease", "Pregnancy", "Lactation"],
    interactions: ["Macrolide antibiotics", "Grapefruit juice", "Cyclosporine"],
    pregnancy: "Contraindicated (Category X)."
  },
  
  "losartan": {
    name: "Losartan",
    class: "Angiotensin II receptor blocker (ARB)",
    indications: ["Hypertension", "Heart failure", "Diabetic nephropathy"],
    mechanism: "Blocks angiotensin II type 1 receptors → vasodilation and reduced aldosterone secretion.",
    usage: "50 mg orally once daily; may increase to 100 mg/day.",
    sideEffects: ["Dizziness", "Hyperkalemia", "Fatigue"],
    contraindications: ["Pregnancy", "Severe hepatic impairment"],
    interactions: ["Potassium-sparing diuretics", "NSAIDs", "Lithium"],
    pregnancy: "Contraindicated — fetal toxicity risk (Category D)."
  },
  
  "enalapril": {
    name: "Enalapril",
    class: "ACE inhibitor",
    indications: ["Hypertension", "Heart failure", "Diabetic nephropathy"],
    mechanism: "Inhibits ACE → decreased angiotensin II and aldosterone production.",
    usage: "5–20 mg orally once or twice daily.",
    sideEffects: ["Cough", "Hyperkalemia", "Angioedema"],
    contraindications: ["History of angioedema", "Pregnancy", "Bilateral renal artery stenosis"],
    interactions: ["Potassium supplements", "NSAIDs", "Diuretics"],
    pregnancy: "Contraindicated — teratogenic (Category D)."
  },
  
  "furosemide": {
    name: "Furosemide",
    class: "Loop diuretic",
    indications: ["Edema", "Heart failure", "Hypertension"],
    mechanism: "Inhibits Na+/K+/2Cl− cotransporter in the thick ascending loop of Henle.",
    usage: "20–80 mg orally once or twice daily; adjust as needed.",
    sideEffects: ["Hypokalemia", "Dehydration", "Ototoxicity"],
    contraindications: ["Severe electrolyte imbalance", "Sulfa allergy"],
    interactions: ["Aminoglycosides", "NSAIDs", "Digoxin"],
    pregnancy: "Use with caution (Category C)."
  },
  
  "hydrochlorothiazide": {
    name: "Hydrochlorothiazide",
    class: "Thiazide diuretic",
    indications: ["Hypertension", "Edema"],
    mechanism: "Inhibits NaCl reabsorption in the distal convoluted tubule.",
    usage: "12.5–50 mg orally once daily.",
    sideEffects: ["Hypokalemia", "Hyponatremia", "Hyperuricemia"],
    contraindications: ["Anuria", "Sulfa allergy"],
    interactions: ["Lithium", "NSAIDs", "Antidiabetics"],
    pregnancy: "Use with caution (Category B)."
  },
  
  "prednisolone": {
    name: "Prednisolone",
    class: "Glucocorticoid",
    indications: ["Inflammatory disorders", "Asthma", "Autoimmune diseases"],
    mechanism: "Suppresses inflammation and immune response by modulating gene expression.",
    usage: "5–60 mg orally per day depending on condition; taper gradually if long-term.",
    sideEffects: ["Immunosuppression", "Weight gain", "Hyperglycemia"],
    contraindications: ["Systemic fungal infections"],
    interactions: ["NSAIDs", "Vaccines", "Diuretics"],
    pregnancy: "Category C — use only if benefits outweigh risks."
  },
  
  "salbutamol": {
    name: "Salbutamol",
    class: "Short-acting beta-2 agonist (SABA)",
    indications: ["Asthma", "COPD", "Exercise-induced bronchospasm"],
    mechanism: "Stimulates beta-2 receptors → bronchodilation via smooth muscle relaxation.",
    usage: "Inhalation: 100–200 µg as needed up to 4 times daily.",
    sideEffects: ["Tremor", "Tachycardia", "Hypokalemia"],
    contraindications: ["Severe cardiac disease"],
    interactions: ["Beta-blockers", "MAOIs", "Diuretics (potassium loss)"],
    pregnancy: "Generally safe (Category C)."
  },
  
  "budesonide": {
    name: "Budesonide",
    class: "Inhaled corticosteroid",
    indications: ["Asthma", "COPD maintenance therapy"],
    mechanism: "Reduces airway inflammation by inhibiting cytokine production and immune cell recruitment.",
    usage: "Inhalation: 200–400 µg twice daily; max 1600 µg/day.",
    sideEffects: ["Oral thrush", "Hoarseness", "Systemic effects (rare)"],
    contraindications: ["Untreated infections"],
    interactions: ["Ketoconazole", "Ritonavir"],
    pregnancy: "Category B — preferred inhaled corticosteroid in pregnancy."
  },
  
  "insulin glargine": {
    name: "Insulin Glargine",
    class: "Long-acting insulin analog",
    indications: ["Type 1 and Type 2 diabetes mellitus"],
    mechanism: "Binds insulin receptors → facilitates glucose uptake and glycogen synthesis.",
    usage: "Subcutaneous: once daily at the same time each day; dose individualized.",
    sideEffects: ["Hypoglycemia", "Weight gain", "Injection site reactions"],
    contraindications: ["Hypoglycemia", "Insulin allergy"],
    interactions: ["Beta-blockers", "Alcohol", "Corticosteroids"],
    pregnancy: "Safe under supervision (Category C)."
  },
  
  "warfarin": {
    name: "Warfarin",
    class: "Vitamin K antagonist (anticoagulant)",
    indications: ["Atrial fibrillation", "DVT", "PE", "Mechanical heart valves"],
    mechanism: "Inhibits vitamin K epoxide reductase → decreased synthesis of clotting factors II, VII, IX, and X.",
    usage: "2–10 mg orally daily, adjusted to maintain INR 2–3.",
    sideEffects: ["Bleeding", "Skin necrosis", "Teratogenicity"],
    contraindications: ["Pregnancy", "Active bleeding", "Recent surgery"],
    interactions: ["NSAIDs", "Antibiotics", "Amiodarone"],
    pregnancy: "Contraindicated (Category X)."
  },
  
  "heparin": {
    name: "Heparin",
    class: "Anticoagulant (unfractionated)",
    indications: ["DVT/PE prevention and treatment", "ACS"],
    mechanism: "Activates antithrombin III → inhibits thrombin and factor Xa.",
    usage: "IV/SC: dosing depends on indication (e.g., 5000 units SC q8–12h).",
    sideEffects: ["Bleeding", "Heparin-induced thrombocytopenia (HIT)"],
    contraindications: ["Active bleeding", "History of HIT"],
    interactions: ["NSAIDs", "Aspirin", "Thrombolytics"],
    pregnancy: "Safe in pregnancy (Category C)."
  },
  
  "enoxaparin": {
    name: "Enoxaparin",
    class: "Low molecular weight heparin (LMWH)",
    indications: ["DVT prevention/treatment", "ACS"],
    mechanism: "Inhibits factor Xa via antithrombin III activation.",
    usage: "40 mg SC daily for prophylaxis; 1 mg/kg SC q12h for treatment.",
    sideEffects: ["Bleeding", "Thrombocytopenia (rare)"],
    contraindications: ["Active bleeding", "HIT history"],
    interactions: ["NSAIDs", "Aspirin"],
    pregnancy: "Safe (Category B)."
  },
  
  "clopidogrel": {
    name: "Clopidogrel",
    class: "Antiplatelet (P2Y12 inhibitor)",
    indications: ["MI prevention", "Stroke prevention", "Post-stent therapy"],
    mechanism: "Irreversibly blocks ADP receptor on platelets, preventing activation and aggregation.",
    usage: "75 mg orally once daily.",
    sideEffects: ["Bleeding", "Rash", "GI discomfort"],
    contraindications: ["Active bleeding", "Severe liver impairment"],
    interactions: ["Omeprazole", "NSAIDs"],
    pregnancy: "Category B — use if benefits outweigh risks."
  },
  
  "levothyroxine": {
    name: "Levothyroxine",
    class: "Synthetic thyroid hormone (T4)",
    indications: ["Hypothyroidism", "Myxedema coma"],
    mechanism: "Replaces endogenous thyroxine, regulating metabolism and growth.",
    usage: "25–150 µg orally once daily before breakfast.",
    sideEffects: ["Palpitations", "Weight loss", "Insomnia (overdose)"],
    contraindications: ["Untreated adrenal insufficiency"],
    interactions: ["Iron", "Calcium", "Warfarin"],
    pregnancy: "Safe; dose adjustment often required (Category A)."
  },
  
  "sertraline": {
    name: "Sertraline",
    class: "SSRI (antidepressant)",
    indications: ["Depression", "Anxiety", "OCD", "PTSD"],
    mechanism: "Selectively inhibits serotonin reuptake in the CNS.",
    usage: "50–200 mg orally once daily.",
    sideEffects: ["Nausea", "Insomnia", "Sexual dysfunction"],
    contraindications: ["MAOI use within 14 days"],
    interactions: ["MAOIs", "Triptans", "Warfarin"],
    pregnancy: "Generally safe (Category C)."
  },
  
  "diazepam": {
    name: "Diazepam",
    class: "Benzodiazepine",
    indications: ["Anxiety", "Seizures", "Muscle spasms"],
    mechanism: "Enhances GABA-A receptor activity → CNS depression.",
    usage: "2–10 mg orally 2–4 times daily.",
    sideEffects: ["Sedation", "Dependence", "Respiratory depression"],
    contraindications: ["Severe hepatic impairment", "Sleep apnea"],
    interactions: ["Alcohol", "Opioids", "Other CNS depressants"],
    pregnancy: "Avoid unless necessary (Category D)."
  },
  
  "morphine": {
    name: "Morphine",
    class: "Opioid analgesic",
    indications: ["Severe pain", "MI pain relief", "Pulmonary edema (palliative)"],
    mechanism: "Binds µ-opioid receptors → inhibits pain pathways.",
    usage: "Oral: 10–30 mg every 4 hours as needed; IV: 2–10 mg q4h.",
    sideEffects: ["Respiratory depression", "Constipation", "Nausea"],
    contraindications: ["Respiratory depression", "Head injury"],
    interactions: ["Alcohol", "Benzodiazepines", "MAOIs"],
    pregnancy: "Use with caution (Category C)."
  },
  
  "codeine": {
    name: "Codeine",
    class: "Opioid analgesic & antitussive",
    indications: ["Mild to moderate pain", "Cough suppression"],
    mechanism: "Converted to morphine in the liver → µ-opioid receptor agonist.",
    usage: "15–60 mg orally every 4–6 hours as needed (max 360 mg/day).",
    sideEffects: ["Constipation", "Drowsiness", "Nausea"],
    contraindications: ["Respiratory depression", "Children <12 years"],
    interactions: ["Alcohol", "Benzodiazepines", "MAOIs"],
    pregnancy: "Use only if necessary (Category C)."
  },
  
  "ceftriaxone": {
    name: "Ceftriaxone",
    class: "Cephalosporin (3rd generation antibiotic)",
    indications: ["Pneumonia", "Meningitis", "UTI", "Gonorrhea"],
    mechanism: "Inhibits bacterial cell wall synthesis → bactericidal.",
    usage: "IV/IM: 1–2 g once daily (max 4 g/day).",
    sideEffects: ["Diarrhea", "Allergic reactions", "Biliary sludging"],
    contraindications: ["Severe penicillin allergy", "Neonates with hyperbilirubinemia"],
    interactions: ["Calcium-containing IV solutions"],
    pregnancy: "Safe (Category B)."
  },
  
  "azithromycin": {
    name: "Azithromycin",
    class: "Macrolide antibiotic",
    indications: ["Respiratory infections", "Skin infections", "STIs"],
    mechanism: "Inhibits bacterial 50S ribosomal subunit → prevents protein synthesis.",
    usage: "500 mg orally on day 1, then 250 mg once daily on days 2–5.",
    sideEffects: ["Diarrhea", "QT prolongation", "Hepatotoxicity"],
    contraindications: ["Liver dysfunction", "QT prolongation"],
    interactions: ["Warfarin", "Digoxin", "Antacids"],
    pregnancy: "Generally safe (Category B)."
  },
  
  "ciprofloxacin": {
    name: "Ciprofloxacin",
    class: "Fluoroquinolone antibiotic",
    indications: ["UTI", "Gastrointestinal infections", "Bone/joint infections"],
    mechanism: "Inhibits bacterial DNA gyrase and topoisomerase IV.",
    usage: "250–750 mg orally every 12 hours.",
    sideEffects: ["Tendonitis", "GI upset", "Photosensitivity"],
    contraindications: ["Children", "Pregnancy"],
    interactions: ["Antacids", "Warfarin", "Theophylline"],
    pregnancy: "Avoid (Category C)."
  },
  
  "metronidazole": {
    name: "Metronidazole",
    class: "Nitroimidazole antibiotic/antiprotozoal",
    indications: ["Anaerobic infections", "Bacterial vaginosis", "Giardiasis"],
    mechanism: "Forms toxic free radicals that damage microbial DNA.",
    usage: "500 mg orally/IV every 8 hours for 7–10 days.",
    sideEffects: ["Metallic taste", "Nausea", "Disulfiram-like reaction with alcohol"],
    contraindications: ["First trimester of pregnancy", "Alcohol use"],
    interactions: ["Alcohol", "Warfarin", "Phenytoin"],
    pregnancy: "Avoid in 1st trimester (Category B after)."
  },
  
  "doxycycline": {
    name: "Doxycycline",
    class: "Tetracycline antibiotic",
    indications: ["Acne", "Respiratory infections", "Rickettsial diseases"],
    mechanism: "Inhibits bacterial 30S ribosomal subunit → prevents protein synthesis.",
    usage: "100 mg orally twice daily.",
    sideEffects: ["Photosensitivity", "GI irritation", "Tooth discoloration in children"],
    contraindications: ["Pregnancy", "Children <8 years"],
    interactions: ["Antacids", "Iron supplements", "Warfarin"],
    pregnancy: "Contraindicated (Category D)."
  },
  
  "fluoxetine": {
    name: "Fluoxetine",
    class: "SSRI (antidepressant)",
    indications: ["Depression", "Anxiety", "OCD", "Bulimia nervosa"],
    mechanism: "Selectively inhibits serotonin reuptake in the CNS.",
    usage: "20–60 mg orally once daily.",
    sideEffects: ["Insomnia", "Sexual dysfunction", "GI upset"],
    contraindications: ["MAOI use within 14 days"],
    interactions: ["MAOIs", "Tramadol", "Warfarin"],
    pregnancy: "Category C — may be used if benefits outweigh risks."
  },
  
    "lorazepam": {
    name: "Lorazepam",
    class: "Benzodiazepine",
    indications: ["Anxiety", "Insomnia", "Status epilepticus"],
    mechanism: "Enhances GABA-A receptor activity → increases inhibitory neurotransmission.",
    usage: "Oral: 1–4 mg daily in divided doses; IV: 2–4 mg slowly for acute seizures or sedation.",
    sideEffects: ["Sedation", "Dependence", "Respiratory depression", "Dizziness"],
    contraindications: ["Severe respiratory insufficiency", "Acute narrow-angle glaucoma"],
    interactions: ["Alcohol — additive CNS depression", "Opioids — increased respiratory depression", "CYP3A4 inhibitors"],
    pregnancy: "Category D — avoid if possible; use only if benefits justify risks."
  },
  
  "montelukast": {
    name: "Montelukast",
    class: "Leukotriene receptor antagonist",
    indications: ["Asthma maintenance", "Allergic rhinitis"],
    mechanism: "Blocks cysteinyl leukotriene (CysLT1) receptors → reduces bronchoconstriction and inflammation.",
    usage: "Oral: 10 mg once daily in the evening (adults).",
    sideEffects: ["Headache", "GI upset", "Rare neuropsychiatric events (mood changes)"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Phenobarbital — may reduce montelukast levels"],
    pregnancy: "Category B — use if clinically indicated."
  },
  
  "salmeterol": {
    name: "Salmeterol",
    class: "Long-acting beta-2 agonist (LABA)",
    indications: ["Asthma (maintenance)", "COPD"],
    mechanism: "Selective stimulation of β2-adrenergic receptors → prolonged bronchodilation.",
    usage: "Inhaler: 50 mcg twice daily (do not use for acute bronchospasm).",
    sideEffects: ["Tremor", "Palpitations", "Throat irritation", "Rare paradoxical bronchospasm"],
    contraindications: ["Acute bronchospasm as monotherapy"],
    interactions: ["Beta-blockers — antagonistic effect", "MAOIs — potential interactions"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  
  "allopurinol": {
    name: "Allopurinol",
    class: "Xanthine oxidase inhibitor",
    indications: ["Chronic gout", "Hyperuricemia", "Prevention of tumor lysis syndrome"],
    mechanism: "Inhibits xanthine oxidase → decreases uric acid production.",
    usage: "Oral: 100–300 mg once daily; titrate to serum uric acid (max ~800 mg/day in divided doses).",
    sideEffects: ["Rash", "Hepatotoxicity", "GI upset"],
    contraindications: ["Hypersensitivity to allopurinol", "Use with caution in renal impairment"],
    interactions: ["Azathioprine/6-mercaptopurine — increased toxicity", "Warfarin"],
    pregnancy: "Category C — use if benefits justify risks."
  },
  
  "digoxin": {
    name: "Digoxin",
    class: "Cardiac glycoside",
    indications: ["Heart failure (selected cases)", "Atrial fibrillation/flutter rate control"],
    mechanism: "Inhibits Na+/K+-ATPase → increases intracellular Ca²⁺ → positive inotropy; also increases vagal tone.",
    usage: "Oral/IV: typical maintenance 0.125–0.25 mg daily; adjust dosing per renal function and serum levels.",
    sideEffects: ["Arrhythmias", "Nausea/vomiting", "Visual disturbances (yellow halos)"],
    contraindications: ["Ventricular fibrillation", "Known digoxin toxicity"],
    interactions: ["Diuretics (hypokalemia increases toxicity)", "Amiodarone — increases digoxin levels", "Verapamil"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  
  "spironolactone": {
    name: "Spironolactone",
    class: "Potassium-sparing diuretic; aldosterone antagonist",
    indications: ["Heart failure", "Ascites", "Primary hyperaldosteronism", "Resistant hypertension"],
    mechanism: "Aldosterone receptor antagonist → conserves K⁺ and excretes Na⁺.",
    usage: "Oral: 25–100 mg once daily; adjust by indication.",
    sideEffects: ["Hyperkalemia", "Gynecomastia", "Menstrual irregularities"],
    contraindications: ["Hyperkalemia", "Anuria", "Severe renal impairment"],
    interactions: ["ACE inhibitors/ARBs — increased hyperkalemia risk", "NSAIDs"],
    pregnancy: "Category C — use only if benefits outweigh risks."
  },
  
  "ranitidine": {
    name: "Ranitidine",
    class: "H2 receptor antagonist",
    indications: ["Peptic ulcer disease", "GERD", "Stress ulcer prophylaxis"],
    mechanism: "Competitive H2 receptor antagonist → decreased gastric acid secretion.",
    usage: "Oral: 150 mg twice daily or 300 mg at bedtime.",
    sideEffects: ["Headache", "Dizziness", "Constipation/diarrhea"],
    contraindications: ["Porphyria (relative)"],
    interactions: ["Drugs requiring gastric acidity for absorption may be affected"],
    pregnancy: "Category B — use if indicated."
  },
  
  "escitalopram": {
    name: "Escitalopram",
    class: "SSRI (antidepressant)",
    indications: ["Major depressive disorder", "Generalized anxiety disorder"],
    mechanism: "Selective serotonin reuptake inhibition → increases synaptic serotonin.",
    usage: "Oral: 10–20 mg once daily.",
    sideEffects: ["Nausea", "Insomnia", "Sexual dysfunction"],
    contraindications: ["Concurrent MAOI therapy", "Hypersensitivity"],
    interactions: ["MAOIs — serotonin syndrome risk", "NSAIDs — bleeding risk"],
    pregnancy: "Category C — weigh risks and benefits."
  },
  
  "dexamethasone": {
    name: "Dexamethasone",
    class: "Glucocorticoid",
    indications: ["Severe allergic reactions", "Cerebral edema", "Inflammatory conditions", "Antiemetic adjunct in chemo"],
    mechanism: "Glucocorticoid receptor agonist → potent anti-inflammatory and immunosuppressive effects.",
    usage: "Oral/IV: 0.5–9 mg/day depending on indication; high-dose for cerebral edema; taper if prolonged use.",
    sideEffects: ["Hyperglycemia", "Immunosuppression", "Psychiatric disturbances", "Osteoporosis (long-term)"],
    contraindications: ["Systemic fungal infections", "Live vaccines during therapy"],
    interactions: ["NSAIDs — increased GI risk", "CYP3A4 inducers/inhibitors"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  
  "hydrocortisone": {
    name: "Hydrocortisone",
    class: "Glucocorticoid",
    indications: ["Adrenal insufficiency", "Severe inflammation", "Allergic reactions"],
    mechanism: "Replaces/copies endogenous cortisol → anti-inflammatory and metabolic effects.",
    usage: "Oral: 15–30 mg/day in divided doses for replacement; IV dosing higher for acute situations.",
    sideEffects: ["Fluid retention", "Hyperglycemia", "Immunosuppression"],
    contraindications: ["Systemic fungal infections"],
    interactions: ["NSAIDs", "Live vaccines", "CYP3A4 modulators"],
    pregnancy: "Category C — use if necessary."
  },
  
  "levetiracetam": {
    name: "Levetiracetam",
    class: "Antiepileptic",
    indications: ["Focal seizures", "Generalized tonic-clonic seizures", "Myoclonic seizures"],
    mechanism: "Binds synaptic vesicle protein SV2A → modulates neurotransmitter release.",
    usage: "Oral/IV: 500 mg twice daily, can be increased to 1500 mg twice daily depending on response.",
    sideEffects: ["Somnolence", "Irritability", "Dizziness"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Minimal clinically significant interactions"],
    pregnancy: "Category C — use if benefits outweigh risks."
  },
  
  "lamotrigine": {
    name: "Lamotrigine",
    class: "Antiepileptic/mood stabilizer",
    indications: ["Epilepsy (partial and generalized)", "Bipolar disorder maintenance"],
    mechanism: "Inhibits voltage-gated Na+ channels → stabilizes neuronal membranes and decreases glutamate release.",
    usage: "Oral: start low and titrate (e.g., 25 mg daily) to maintenance 100–200 mg daily; slower titration if on valproate.",
    sideEffects: ["Rash (including Stevens–Johnson syndrome)", "Dizziness", "Ataxia"],
    contraindications: ["History of severe rash with lamotrigine"],
    interactions: ["Valproate — increases lamotrigine levels", "Carbamazepine — decreases levels"],
    pregnancy: "Category C — monitor and balance seizure control vs. risk."
  },
  
  "cetirizine": {
    name: "Cetirizine",
    class: "Second-generation antihistamine (H1 blocker)",
    indications: ["Allergic rhinitis", "Urticaria"],
    mechanism: "Selective H1 receptor antagonist → reduces histamine-mediated symptoms.",
    usage: "Oral: 10 mg once daily (adults).",
    sideEffects: ["Mild sedation (less than 1st-gen)", "Dry mouth", "Headache"],
    contraindications: ["Severe renal impairment (dose adjust)"],
    interactions: ["Alcohol — additive sedation risk"],
    pregnancy: "Category B — use if clinically needed."
  },
  
  "loratadine": {
    name: "Loratadine",
    class: "Second-generation antihistamine (H1 blocker)",
    indications: ["Allergic rhinitis", "Urticaria"],
    mechanism: "Selective peripheral H1 receptor antagonist → reduces allergic symptoms without sedation.",
    usage: "Oral: 10 mg once daily (adults).",
    sideEffects: ["Headache", "Dry mouth (rare)"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Ketoconazole/erythromycin may increase levels"],
    pregnancy: "Category B — generally considered safe."
  },
  
  "amlodipine": {
    name: "Amlodipine",
    class: "Dihydropyridine calcium channel blocker",
    indications: ["Hypertension", "Chronic stable angina"],
    mechanism: "Inhibits L-type calcium channels in vascular smooth muscle → vasodilation.",
    usage: "Oral: 5–10 mg once daily.",
    sideEffects: ["Peripheral edema", "Dizziness", "Flushing"],
    contraindications: ["Severe hypotension"],
    interactions: ["CYP3A4 inhibitors — increase levels", "Simvastatin — increased risk of myopathy at high simvastatin doses"],
    pregnancy: "Category C — use if benefits justify risks."
  },
  
  "nifedipine": {
    name: "Nifedipine",
    class: "Dihydropyridine calcium channel blocker",
    indications: ["Hypertension", "Angina (vasospastic)"],
    mechanism: "Blocks L-type calcium channels → vascular smooth muscle relaxation.",
    usage: "Oral: 30–60 mg once daily (extended-release formulations common).",
    sideEffects: ["Flushing", "Headache", "Peripheral edema"],
    contraindications: ["Severe hypotension"],
    interactions: ["Grapefruit juice — increases levels", "Beta-blockers"],
    pregnancy: "Category C — can be used in pregnancy for hypertension when needed."
  },
  
  "clindamycin": {
    name: "Clindamycin",
    class: "Lincosamide antibiotic",
    indications: ["Anaerobic infections", "Skin and soft tissue infections", "Dental infections"],
    mechanism: "Binds 50S ribosomal subunit → inhibits bacterial protein synthesis (bacteriostatic).",
    usage: "Oral: 150–450 mg every 6–8 hours; IV: 600–900 mg every 8 hours.",
    sideEffects: ["Diarrhea", "Pseudomembranous colitis (C. difficile)"],
    contraindications: ["History of antibiotic-associated colitis"],
    interactions: ["Erythromycin — antagonistic", "Neuromuscular blocking agents — enhanced effect"],
    pregnancy: "Category B — use if indicated."
  },
  
  "vancomycin": {
    name: "Vancomycin",
    class: "Glycopeptide antibiotic",
    indications: ["Serious Gram-positive infections", "MRSA", "Oral for C. difficile"],
    mechanism: "Binds D-Ala-D-Ala → inhibits peptidoglycan polymerization and cell wall synthesis.",
    usage: "IV: 15 mg/kg every 8–12 hours (adjust by level); Oral: 125–500 mg every 6 hours for C. difficile.",
    sideEffects: ["Nephrotoxicity", "Red man syndrome (infusion-related)"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Other nephrotoxins (aminoglycosides, NSAIDs) — increased risk"],
    pregnancy: "Category B — use if necessary."
  },
  
  "gentamicin": {
    name: "Gentamicin",
    class: "Aminoglycoside antibiotic",
    indications: ["Severe Gram-negative infections", "Synergy for endocarditis (with beta-lactam)"],
    mechanism: "Binds 30S ribosomal subunit → inhibits protein synthesis (bactericidal).",
    usage: "IV/IM: dosing weight-based (e.g., 3–5 mg/kg/day once-daily dosing common); adjust for renal function.",
    sideEffects: ["Nephrotoxicity", "Ototoxicity (vestibular/cochlear)"],
    contraindications: ["Pre-existing renal impairment (use caution)"],
    interactions: ["Loop diuretics — increased ototoxicity", "Vancomycin — additive nephrotoxicity"],
    pregnancy: "Category D — use only if life-saving."
  },
  
  "insulin lispro": {
    name: "Insulin Lispro",
    class: "Rapid-acting insulin analog",
    indications: ["Type 1 and Type 2 diabetes requiring prandial insulin"],
    mechanism: "Binds insulin receptor → promotes glucose uptake; rapid onset for mealtime coverage.",
    usage: "Subcutaneous: give within 15 minutes before or immediately after meals; dose individualized.",
    sideEffects: ["Hypoglycemia", "Weight gain", "Injection site reactions"],
    contraindications: ["Hypoglycemia", "Allergy to insulin excipients"],
    interactions: ["Beta-blockers — mask hypoglycemia signs", "Alcohol — increased hypoglycemia risk"],
    pregnancy: "Category B — safe with monitoring."
  },
  
  "sitagliptin": {
    name: "Sitagliptin",
    class: "DPP-4 inhibitor (antidiabetic)",
    indications: ["Type 2 diabetes mellitus (adjunct to diet/exercise)"],
    mechanism: "Inhibits DPP-4 → prolongs incretin action (GLP-1, GIP) → increases insulin release and decreases glucagon.",
    usage: "Oral: 100 mg once daily (adjust for renal impairment).",
    sideEffects: ["Nasopharyngitis", "Headache", "Rare pancreatitis reports"],
    contraindications: ["Type 1 diabetes", "Diabetic ketoacidosis"],
    interactions: ["May interact with strong CYP3A4 inhibitors (dose adjustments rarely needed)"],
    pregnancy: "Category B — limited data; use only if clearly needed."
  },
  
  "simvastatin": {
    name: "Simvastatin",
    class: "HMG-CoA reductase inhibitor (statin)",
    indications: ["Hypercholesterolemia", "Cardiovascular risk reduction"],
    mechanism: "Inhibits HMG-CoA reductase → reduces cholesterol synthesis in the liver.",
    usage: "Oral: 10–40 mg once daily in the evening (max 40 mg/day for most patients).",
    sideEffects: ["Myalgia", "Liver enzyme elevation", "Rhabdomyolysis (rare)"],
    contraindications: ["Active liver disease", "Pregnancy", "Concomitant strong CYP3A4 inhibitors (high-dose contraindications)"],
    interactions: ["Grapefruit juice", "Macrolide antibiotics", "Amiodarone"],
    pregnancy: "Contraindicated (Category X)."
  },
  
  "pregabalin": {
    name: "Pregabalin",
    class: "Anticonvulsant/neuropathic pain agent (GABA analogue)",
    indications: ["Neuropathic pain", "Fibromyalgia", "Adjunctive therapy for partial seizures"],
    mechanism: "Binds α2δ subunit of voltage-gated calcium channels → reduces excitatory neurotransmitter release.",
    usage: "Oral: 75–150 mg twice daily; adjust for renal function.",
    sideEffects: ["Dizziness", "Somnolence", "Peripheral edema", "Weight gain"],
    contraindications: ["Hypersensitivity"],
    interactions: ["Opioids/CNS depressants — increased sedation"], 
    pregnancy: "Category C — weigh benefits vs risks."
  },
  
  "tramadol": {
    name: "Tramadol",
    class: "Opioid analgesic (atypical)",
    indications: ["Moderate to moderately severe pain"],
    mechanism: "Weak µ-opioid receptor agonist and inhibits reuptake of norepinephrine and serotonin.",
    usage: "Oral: 50–100 mg every 4–6 hours as needed (max 400 mg/day for immediate-release).",
    sideEffects: ["Nausea", "Dizziness", "Constipation", "Risk of seizures (at high doses)"],
    contraindications: ["Acute intoxication with alcohol/opioids/psychotropic drugs", "Seizure disorders (relative)"],
    interactions: ["MAOIs — severe interactions", "SSRIs/SNRIs — serotonin syndrome risk", "CNS depressants"],
    pregnancy: "Category C — use only if necessary."
  }
  //Add Drugs here
};

// -------------------- Elements --------------------
const searchBtn = document.getElementById("search-btn");
const sampleBtn = document.getElementById("sample-btn");
const input = document.getElementById("drug-input");
const resultsDiv = document.getElementById("results");
const historyList = document.getElementById("history-list");

// -------------------- Load saved history --------------------
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
renderHistory();

// -------------------- Core Search Logic --------------------
function searchDrug(drugName) {
  const key = drugName.toLowerCase().trim();

  if (!key) {
    alert("Please enter a drug name.");
    return;
  }

  const drug = DEV_LOCAL_DB[key];

  if (drug) {
    renderDrug(drug);
    addToHistory(drugName);
  } else {
    resultsDiv.classList.remove("hidden");
    resultsDiv.innerHTML = `
      <p style="color:#c0392b"><strong>No results found</strong> for "${drugName}".</p>
      <p>Try another drug name or check your spelling.</p>
    `;
  }
}

// -------------------- Render Function --------------------
function renderDrug(drug) {
  resultsDiv.classList.remove("hidden");

  resultsDiv.innerHTML = `
    <h2>${drug.name || "Unknown Drug"}</h2>
    <p><strong>Class:</strong> ${drug.class || "Information not available"}</p>
    <p><strong>Indications:</strong> ${drug.indications ? drug.indications.join(", ") : "Information not available"}</p>
    <p><strong>Mechanism of Action:</strong> ${drug.mechanism || "Information not available"}</p>
    <p><strong>Usage:</strong> ${drug.usage || "Usage information not available."}</p>
    <p><strong>Side Effects:</strong> ${drug.sideEffects ? drug.sideEffects.join(", ") : "Information not available"}</p>
    <p><strong>Contraindications:</strong> ${drug.contraindications ? drug.contraindications.join(", ") : "Information not available"}</p>
    <p><strong>Interactions:</strong> ${drug.interactions ? drug.interactions.join(", ") : "Information not available"}</p>
    <p><strong>Pregnancy:</strong> ${drug.pregnancy || "Information not available"}</p>
  `;
}

// -------------------- Search History --------------------
function addToHistory(drugName) {
  const formatted = drugName.trim();

  if (!searchHistory.includes(formatted)) {
    searchHistory.push(formatted);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); // Save to localStorage
    renderHistory();
  }
}

function renderHistory() {
  historyList.innerHTML = "";
  searchHistory.forEach((drug) => {
    const div = document.createElement("div");
    div.textContent = drug;
    div.classList.add("history-item");
    div.style.cursor = "pointer";
    div.onclick = () => searchDrug(drug);
    historyList.appendChild(div);
  });
}

// -------------------- Event Listeners --------------------
searchBtn.addEventListener("click", () => searchDrug(input.value));
sampleBtn.addEventListener("click", () => {
  input.value = "aspirin";
  searchDrug("aspirin");
});
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchDrug(input.value);
});

