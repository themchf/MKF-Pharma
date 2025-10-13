```javascript
if(!name) return;
results.classList.remove('hidden');
results.innerHTML = '<div class="muted">Searching...</div>';
const key = name.trim().toLowerCase();


// 1. Check local DB
if(localDB[key]){
const d = localDB[key];
results.innerHTML = '';
const header = document.createElement('div');
header.className = 'field-title';
header.textContent = `${d.name}`;
results.appendChild(header);
results.appendChild(makeRow('Drug class', d.class || '—'));
results.appendChild(makeRow('Indications', arrayToList(d.indications)));
results.appendChild(makeRow('Mechanism of action', d.mechanism || '—'));
results.appendChild(makeRow('Side effects', arrayToList(d.sideEffects)));
results.appendChild(makeRow('Contraindications', arrayToList(d.contraindications)));
results.appendChild(makeRow('Interactions', arrayToList(d.interactions)));
results.appendChild(makeRow('Pregnancy risk', d.pregnancy || '—'));


pushHistory(d.name);
return;
}


// 2. Attempt to fetch OpenFDA label (optional enrichment). This may fail due to CORS or rate limits.
try{
const q = encodeURIComponent(name);
const url = `https://api.fda.gov/drug/label.json?search=brand_name:${q}+OR+generic_name:${q}&limit=1`;
const resp = await fetch(url);
if(!resp.ok) throw new Error('no openfda');
const j = await resp.json();
const info = j.results && j.results[0];
if(info){
const d = {
name: (info.openfda && (info.openfda.brand_name || info.openfda.generic_name) ? (info.openfda.brand_name || info.openfda.generic_name).join(', ') : name),
class: (info.openfda && info.openfda.pharm_class_epc ? info.openfda.pharm_class_epc.join(', ') : '—'),
indications: info.indications_and_usage || [],
mechanism: info.mechanism_of_action ? (Array.isArray(info.mechanism_of_action)?info.mechanism_of_action.join('\n') : info.mechanism_of_action) : '—',
sideEffects: info.adverse_reactions || [],
contraindications: info.contraindications || [],
interactions: info.drug_interactions || [],
pregnancy: info.pregnancy || info.use_in_pregnancy || '—'
};
results.innerHTML = '';
const header = document.createElement('div');
header.className = 'field-title';
header.textContent = `${d.name}`;
results.appendChild(header);
results.appendChild(makeRow('Drug class', d.class));
results.appendChild(makeRow('Indications', arrayToList(d.indications)));
results.appendChild(makeRow('Mechanism of action', d.mechanism));
results.appendChild(makeRow('Side effects', arrayToList(d.sideEffects)));
results.appendChild(makeRow('Contraindications', arrayToList(d.contraindications)));
results.appendChild(makeRow('Interactions', arrayToList(d.interactions)));
results.appendChild(makeRow('Pregnancy risk', d.pregnancy));S