from ollama import chat
from json import JSONDecodeError
import json
from datetime import datetime
from ollama import Client
import os
import sys

api_key = os.getenv("OLLAMA_API_KEY")

if not api_key:
    with open("../scraper/events_ai.json", "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False, indent=2)
    print("OLLAMA_API_KEY not set → saved empty events_ai.json")
    sys.exit(0)

with open("../scraper/events_raw.json", "r", encoding="utf-8") as f:
    events = json.load(f)

today = datetime.now().strftime("%Y-%m-%d")

for event in events:
    description = event.get("description") or ""

    prompt = f"""
    Today's date: {today},
Return ONLY valid JSON with the following fields:

{{
  "startDate": "YYYY-MM-DDTHH:MM or null if unknown(dates may be with words)",
  "endDate": "YYYY-MM-DD or null if unknown",
  "location": "event location if mentioned, else null",
  "category": "short label from these: (tech, career, research, culture, health, sport, education, workshop)",
  "mode": "short label from these: (LIVE, ONLINE, HYBRID)",
}}

Event description(in macedonian):
\"\"\"{description}\"\"\"
"""

    response_text = ""

    client = Client(
    host="https://ollama.com",
    headers={'Authorization': f'Bearer {api_key}'}
    )

    messages = [
    {
        'role': 'user',
        'content': prompt,
    },
    ]

    for part in client.chat('gpt-oss:120b', messages=messages, stream=True):
        if 'message' in part and 'content' in part['message']:
            response_text += part['message']['content']

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

with open("../scraper/events_ai.json", "w", encoding="utf-8") as f:
    json.dump(events, f, ensure_ascii=False, indent=2)

print(f"Saved {len(events)} enriched events")
