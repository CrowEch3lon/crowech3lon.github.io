let programs = [];

// DOM references
const resultsEl = document.getElementById('results');
const showBtn   = document.getElementById('show-btn');
const filters   = {
  discipline: document.getElementById('discipline-filter'),
  degree: document.getElementById('degree-filter'),
  borough: document.getElementById('borough-filter')
};

// Helper guards
const hasFilters = filters.discipline && filters.degree && filters.borough;
const hasShowBtn = !!showBtn;

// Load program data and populate filters
async function loadPrograms() {
  if (!hasFilters) return;

  try {
    const res = await fetch('programs.json');
    programs = await res.json();
    populateFilters();
  } catch (err) {
    console.error('Failed to load program data:', err);
  }
}

// Populate dropdown filters
function populateFilters() {
  const disciplineSet = new Set();
  const boroughSet = new Set();

  programs.forEach(p => {
    p.Discipline.split(',').forEach(d => disciplineSet.add(d.trim()));
    boroughSet.add(p.Borough.trim());
  });

  filters.discipline.innerHTML = '<option value="">All</option>';
  filters.borough.innerHTML = '<option value="">All</option>';

  disciplineSet.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    filters.discipline.appendChild(opt);
  });

  boroughSet.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    filters.borough.appendChild(opt);
  });
}

// Slugify school name for logo filename
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Render the filtered cards
function renderCards(list) {
  resultsEl.innerHTML = '';

  if (!list.length) {
    resultsEl.innerHTML = '<p class="no-results">No programs found.</p>';
    return;
  }

  list.forEach(p => {
    const slug = slugify(p["CUNY Schools"]);
    const img = `images/logos/${slug}.jpg`;

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${img}" alt="${p["CUNY Schools"]} logo" width="300" height="150">
      <div class="card-content">
        <h3>${p.Programs}</h3>
        <p class="degree">${p.Degree}</p>
        <p class="school">${p["CUNY Schools"]}</p>
        <p>${p.Description}</p>
        <a href="${p.Links}" target="_blank" rel="noopener">Learn More →</a>
      </div>
    `;
    resultsEl.appendChild(card);
  });
}

// Apply current filter selections
function applyFilters() {
  const discipline = filters.discipline.value;
  const degree = filters.degree.value;
  const borough = filters.borough.value;

  const filtered = programs.filter(p => {
    let match = true;

    if (discipline) {
      const list = p.Discipline.split(',').map(x => x.trim());
      match = match && list.includes(discipline);
    }

    if (degree) {
      const isAssoc = p.Degree.toUpperCase().startsWith('A');
      const isBach  = p.Degree.toUpperCase().startsWith('B');
      if (degree === 'associate') match = match && isAssoc;
      if (degree === 'bachelor')  match = match && isBach;
    }

    if (borough) {
      match = match && p.Borough.trim() === borough;
    }

    return match;
  });

  renderCards(filtered);
}

// Toggle results grid visibility
function setupToggleButton() {
  if (!hasShowBtn) return;

  showBtn.addEventListener('click', () => {
    const isHidden = resultsEl.classList.toggle('hidden');

    if (isHidden) {
      showBtn.textContent = 'Show Results';
      document.getElementById('filters').scrollIntoView({ behavior: 'smooth' });
    } else {
      applyFilters();
      showBtn.textContent = 'Hide Results';
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Mobile nav toggle (always runs)
function initNavToggle() {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');

  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  loadPrograms();
  setupToggleButton();
  initNavToggle();

  if (hasFilters && resultsEl) {
    Object.values(filters).forEach(select => {
      select.addEventListener('change', () => {
        if (!resultsEl.classList.contains('hidden')) {
          applyFilters();
        }
      });
    });
  }
});
