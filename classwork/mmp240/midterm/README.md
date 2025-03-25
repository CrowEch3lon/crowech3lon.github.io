# House M.D. Midterm Website

A two-page responsive HTML/CSS website featuring an "About" page and an "Episodes" page for the TV show House M.D., including a dynamic episode scraper powered by Python.

---

## Project Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd midterm
```

### 2. Set up Python environment
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1  # for PowerShell
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Create `.env` in `/scripts/`
Create a file at `scripts/.env` with the following content:
```
OMDB_API_KEY=your_api_key_here
```

---

## Features

- **Responsive Layout** with semantic HTML
- **Accessible Design** using skip links and ARIA roles
- **Episodes Page** with lazy loading
- **Python Scraper** that pulls episode info + images from OMDb

---

## Folder Structure
```
midterm/
├── .venv/                  # Virtual environment (ignored)
├── assets/                 # Episode thumbnails
├── episodes/               # JSON files per season
├── scripts/                # Scraper and .env
│   ├── scraper.py
│   └── .env
├── style.css
├── about.html
├── episodes.html
├── requirements.txt
└── .gitignore
```

---

## Accessibility & Design Goals
- Uses `float` and `flexbox` layout models
- Supports `em` sizing and responsive images
- Meets MMP 240 midterm standards

---

## Do NOT commit:
- `.venv/`
- `scripts/.env`

All are listed in `.gitignore`.