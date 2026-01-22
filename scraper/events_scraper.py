import requests
import time
import json
import os
import hashlib
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_DOMAIN = "https://finki.ukim.mk"
LIST_URL = BASE_DOMAIN + "/mk/fcse-events"

IMAGES_DIR = "../frontend/public/event_images"
os.makedirs(IMAGES_DIR, exist_ok=True)

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0"
})


# ----------------- helpers -----------------

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def image_filename(title, image_url):
    slug = slugify(title)[:50]
    h = hashlib.md5(image_url.encode()).hexdigest()[:8]
    ext = os.path.splitext(image_url.split("?")[0])[1] or ".jpg"
    return f"event-{slug}-{h}{ext}"


def download_image(image_url, filename):
    path = os.path.join(IMAGES_DIR, filename)

    # prevent duplicates
    if os.path.exists(path):
        return filename

    resp = session.get(image_url, timeout=10)
    resp.raise_for_status()

    with open(path, "wb") as f:
        f.write(resp.content)

    time.sleep(0.3)
    return filename


# ----------------- scraper -----------------

page = 0
events = []

while True:
    if page ==1:
        break

    url = LIST_URL if page == 0 else f"{LIST_URL}?page={page}"
    print(f"Scraping list: {url}")

    response = session.get(url, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    items = soup.select(".row .news-item")

    if not items:
        break

    for item in items:
        links = item.select("h3 a")
        if len(links) < 2:
            continue

        title_el = links[1]
        event_url = urljoin(BASE_DOMAIN, title_el["href"])

        event = {
            "title": title_el.get_text(strip=True),
            "url": event_url,
            "description": None,
            "image_url": None
        }

        # ✅ THUMBNAIL IMAGE (from LIST page – correct one)
        img = item.select_one(".col-xs-12.col-sm-4 img.img-responsive")
        if img and img.get("src"):
            image_url = urljoin(BASE_DOMAIN, img["src"])
            filename = image_filename(event["title"], image_url)
            event["image_url"] = download_image(image_url, filename)

        try:
            detail_resp = session.get(event_url, timeout=10)
            detail_resp.raise_for_status()

            detail_soup = BeautifulSoup(detail_resp.text, "html.parser")

            body = detail_soup.select_one(".field-name-body .field-item.even")
            event["description"] = body.get_text("\n", strip=True) if body else None

            time.sleep(0.8)

        except Exception as e:
            print(f"Failed detail page: {e}")

        events.append(event)

    page += 1


# ----------------- save -----------------

with open("../scraper/events_raw.json", "w", encoding="utf-8") as f:
    json.dump(events, f, ensure_ascii=False, indent=2)

print(f"Saved {len(events)} raw events")
