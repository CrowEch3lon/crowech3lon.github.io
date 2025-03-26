# House M.D. Midterm Project

A responsive, accessible, and data-driven two-page website built with HTML, CSS, JavaScript, and Python. The site showcases a high-level application of semantic HTML, responsive design, lazy loading, and automated data generation through a custom OMDb scraper.

---

## Overview

This project features:

- An **About** page styled with float and flexbox layout patterns.
- An **Episodes** page that uses lazy-loading and pagination to render content from JSON files.
- A **Python-based scraper** that pulls full season and episode metadata—including titles, descriptions, runtimes, and poster images—directly from the OMDb API.
- A **responsive layout** with semantic HTML, accessible navigation, skip links, and styled scroll containers.
- A clearly organized asset pipeline, separating scraped data, static media, styling, and scripts.

---

## Project Structure

```
midterm/
├── .venv/                  # Python virtual environment (ignored by Git)
├── assets/                 # Downloaded poster images
├── data/                   # JSON files per season with episode metadata
├── scripts/
│   ├── scraper.py          # OMDb scraping script
│   └── .env                # API key for OMDb (ignored by Git)
├── style.css               # Global styles
├── episodes.css            # Page-specific overrides
├── about.html              # About the show
├── episodes.html           # Dynamic episode browser
├── requirements.txt        # Python dependencies
└── .gitignore              # Ignore sensitive and environment-specific files
```

---

## Technologies Used

### Front-End
- **HTML5**: Semantic markup for structure and accessibility.
- **CSS3**: Mix of float- and flexbox-based layout. Includes responsive typography, custom scrollbars, and mobile-first media queries.
- **JavaScript** (not shown here): Dynamically loads and displays episode data, implementing lazy loading via Intersection Observer or a scroll sentinel.

### Back-End / Scraper
- **Python 3.11+**
- **Requests**: Communicates with the OMDb API.
- **dotenv**: Manages API key securely through `.env`.
- **argparse**: CLI argument parsing for scraper control.
- **OMDb API**: Provides episode-level metadata and poster URLs.

---

## Scraper Logic

The `scraper.py` script performs the following:

1. Queries OMDb for all seasons of a given TV show.
2. Loops through each episode, pulling detailed metadata including title, runtime, plot, and poster.
3. Downloads each poster into `assets/`, skipping duplicates unless `--force` is used.
4. Generates one JSON file per season in the `data/` directory, ready for the frontend to render.

The script auto-creates necessary directories and includes error handling for API failures, missing data, or invalid poster URLs. A short delay between requests avoids hitting OMDb’s rate limits.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd midterm
```

### 2. Set Up Python Environment

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1   # PowerShell
# or
source .venv/bin/activate    # Unix/macOS
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Add Your OMDb API Key

Create a `.env` file inside the `scripts/` directory:

```
# scripts/.env
OMDB_API_KEY=your_api_key_here
```

---

## Runtime Instructions

### 1. Confirm Project Structure

Ensure your project contains the following files and folders:

- `about.html`, `episodes.html`
- `style.css`, `episodes.css`
- `scripts/scraper.py`
- `assets/` and `data/` (will be auto-filled by the scraper)

### 2. Run the Scraper

Use the CLI to generate episode data and images:

```bash
python scripts/scraper.py --title "House M.D." --force
```

- `--title`: Required, TV show name.
- `--force`: Optional, redownloads posters even if they exist.

Poster images will be saved to `assets/`. JSON data will be saved to `data/`.

### 3. View or Deploy the Site

#### Option A: Local Server (Python)

```bash
# From the root of the project
python -m http.server 8080
```

Then open in your browser:

- `http://localhost:8080/about.html`
- `http://localhost:8080/episodes.html`

#### Option B: Deploy to GitHub Pages, Netlify, or Vercel

Make sure `assets/` and `data/` are included in your deployment. Omit `.venv/` and `scripts/.env` from version control.

---

## Accessibility and Design Goals

- Supports screen readers and keyboard navigation.
- Includes skip links and clear focus indicators.
- Uses `em` units, responsive containers, and content-first layout decisions.
- Minimalist aesthetic consistent with the tone of *House M.D.*

---

## Git Ignore Policy

The following are excluded from version control via `.gitignore`:

- `.venv/`: Python virtual environment.
- `scripts/.env`: Contains sensitive API credentials.
- Poster assets and cached data can be included or excluded based on deployment needs.