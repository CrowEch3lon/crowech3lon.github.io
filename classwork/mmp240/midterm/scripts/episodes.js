const batchSize = 4;
let currentBatch = 0;
let allEpisodes = [];

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && currentBatch * batchSize < allEpisodes.length) {
      loadNextBatch();
    }
  });
});

// Load Episodes from JSON
async function loadEpisodes(season) {
  const res = await fetch(`data/${season}.json`);
  allEpisodes = await res.json();
  currentBatch = 0;

  const grid = document.getElementById('episode-grid');
  grid.innerHTML = '<div id="sentinel"></div>';
  
  observer.observe(document.getElementById('sentinel'));

  loadNextBatch();
}

// Load next episode batch (overlay background image)
function loadNextBatch() {
  const grid = document.getElementById('episode-grid');
  const sentinel = document.getElementById('sentinel');
  const start = currentBatch * batchSize;
  const end = start + batchSize;

  allEpisodes.slice(start, end).forEach(ep => {
    const card = document.createElement('article');
    card.className = 'episode-card fade-in';
    card.style.backgroundImage = `url(${ep.thumbnail})`;

    card.innerHTML = `
      <div class="episode-info">
        <h3>${ep.title}</h3>
        <p><strong>Length:</strong> ${ep.length}</p>
        <p>${ep.description}</p>
      </div>
    `;
    grid.insertBefore(card, sentinel);
  });

  currentBatch++;
}

// Season select listener
document.getElementById('season-select').addEventListener('change', (e) => {
  loadEpisodes(e.target.value);
});

// Initialize with Season 1
document.addEventListener('DOMContentLoaded', () => {
  loadEpisodes('season1');
});
