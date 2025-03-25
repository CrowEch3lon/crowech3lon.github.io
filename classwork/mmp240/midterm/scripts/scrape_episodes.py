import argparse
import os
import json
import requests
from dotenv import load_dotenv
from pathlib import Path
from time import sleep

#
# ======== LOAD ENV & SETUP PATHS =========
#
SCRIPT_DIR = Path(__file__).resolve().parent  # .../midterm/scripts
PROJECT_ROOT = SCRIPT_DIR.parent             # .../midterm
ENV_PATH = PROJECT_ROOT / ".env"

load_dotenv(dotenv_path=ENV_PATH)
OMDB_API_KEY = os.getenv("OMDB_API_KEY")
if not OMDB_API_KEY:
    raise ValueError("OMDB_API_KEY not found in .env at project root!")

ASSETS_DIR = PROJECT_ROOT / "assets"
DATA_DIR = PROJECT_ROOT / "data"
ASSETS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)


#
# ======== CLI ARGS =========
#
parser = argparse.ArgumentParser(description="Scrape TV episodes from OMDb and store results.")
parser.add_argument("--force", action="store_true", help="Re-download images even if they exist")
parser.add_argument("--title", required=True, help="Title of the TV show to scrape, e.g. 'House M.D.'")
args = parser.parse_args()


#
# ======== HELPER FUNCTIONS =========
#
def query_omdb(params):
    base_url = "http://www.omdbapi.com/"
    params["apikey"] = OMDB_API_KEY
    response = requests.get(base_url, params=params)
    response.raise_for_status()
    return response.json()

def download_thumbnail(url, save_path, force=False):
    """Downloads image to 'save_path'. Skips if file exists unless force=True."""
    if save_path.exists() and not force:
        print(f"✓ Skipping {save_path.name} (already exists).")
        return
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        with open(save_path, "wb") as f:
            f.write(r.content)
        print(f"⬇ Downloaded {save_path.name}")
    except Exception as e:
        print(f"✗ Failed to download {url}: {e}")


#
# ======== MAIN SCRAPING LOGIC =========
#
def scrape_all_seasons(title):
    season_num = 1
    while True:
        print(f"\nScraping Season {season_num} for '{title}'...")
        try:
            # 1) Get season info
            season_data = query_omdb({"t": title, "Season": season_num})
        except Exception as e:
            print(f"✗ API error: {e}")
            break

        # If 'Episodes' not present => no more seasons
        if "Episodes" not in season_data:
            print(f"✓ Finished. No Episodes found for Season {season_num}.")
            break

        episodes_for_this_season = []

        for ep in season_data["Episodes"]:
            ep_num = ep.get("Episode")
            if not ep_num:
                continue

            # 2) Detailed query for each episode
            try:
                ep_data = query_omdb({"t": title, "Season": season_num, "Episode": ep_num})
            except Exception as e:
                print(f"✗ Error fetching Episode {ep_num}: {e}")
                continue

            if ep_data.get("Response") == "False":
                print(f"✗ Episode {ep_num} data not found. Skipping.")
                continue

            # 3) Extract fields
            episode_number = f"{int(ep_num):02}"  # zero-padding
            full_title = f"{episode_number}. {ep_data.get('Title', 'Unknown')}"
            poster_url = ep_data.get("Poster", "")
            runtime = ep_data.get("Runtime", "N/A")
            plot = ep_data.get("Plot", "No description available.")

            # 4) Download poster if valid
            image_filename = f"season{season_num}episode{episode_number}.jpg"
            if poster_url and poster_url != "N/A":
                download_thumbnail(poster_url, ASSETS_DIR / image_filename, force=args.force)
            else:
                print(f"⚠ No poster URL for S{season_num}E{episode_number}, skipping image.")

            # 5) Build episode entry
            episode_info = {
                "season": f"season{season_num}",
                "episode": f"episode{episode_number}",
                "title": full_title,
                "length": runtime,
                "thumbnail": f"assets/{image_filename}",
                "description": plot
            }
            episodes_for_this_season.append(episode_info)

            # Friendly delay
            sleep(0.3)

        # 6) Write results for this season
        out_json = DATA_DIR / f"season{season_num}.json"
        with open(out_json, "w", encoding="utf-8") as f:
            json.dump(episodes_for_this_season, f, indent=2)
        print(f"💾 Saved {len(episodes_for_this_season)} episodes to {out_json.name}")

        season_num += 1


#
# ======== RUN SCRIPT (ENTRY POINT) =========
#
if __name__ == "__main__":
    # Print loaded key (debug if needed)
    # print(f"DEBUG: OMDB_API_KEY={OMDB_API_KEY}")

    scrape_all_seasons(args.title)
