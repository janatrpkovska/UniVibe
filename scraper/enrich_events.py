from ollama import chat
from json import JSONDecodeError
import json
from datetime import datetime

# ✅ Load events from scraper
with open("../scraper/events_raw.json", "r", encoding="utf-8") as f:
    events = json.load(f)

today = datetime.now().strftime("%Y-%m-%d")

for event in events:
    description = event.get("description") or ""

    prompt = f"""
    Today's date: {today},
Return ONLY valid JSON with the following fields:

{{
  "startDate": "YYYY-MM-DDTHH:MM or null if unknown",
  "endDate": "YYYY-MM-DD or null if unknown",
  "location": "event location if mentioned, else null",
  "category": "short label from these: (tech, career, research, culture, health, sport, education, workshop)",
  "mode": "short label from these: (LIVE, ONLINE, HYBRID)",
}}

Event description:
\"\"\"{description}\"\"\"
"""


    response_text = ""

    stream = chat(
        model="gemma3",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )

    for chunk in stream:
        response_text += chunk["message"]["content"]

    # 🔍 Extract JSON safely
    start = response_text.find("{")
    end = response_text.rfind("}") + 1

    if start != -1 and end != -1:
        try:
            parsed = json.loads(response_text[start:end])
        except JSONDecodeError:
            parsed = {"start_date": None, "end_date": None, "category": None}
    else:
        parsed = {"start_date": None, "end_date": None, "category": None}

    event.update(parsed)

# ✅ Save enriched events
with open("../scraper/events_ai.json", "w", encoding="utf-8") as f:
    json.dump(events, f, ensure_ascii=False, indent=2)

print(f"Saved {len(events)} enriched events")
