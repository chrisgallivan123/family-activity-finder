# Family Activity Finder - Claude API Prompts

## Input Variables (All Modes)
- `{{city}}` - User's city
- `{{kidAges}}` - Ages of children
- `{{availability}}` - When they're free (date + time of day)
- `{{maxDistance}}` - Maximum driving distance in miles
- `{{preferences}}` - Optional preferences (activities) or cuisine type (dining)
- `{{currentDate}}` - Today's date (injected by server)
- `{{eventType}}` - 'activity' or 'dining'

---

# Activities Prompt (eventType: 'activity')

Used when searching for family events and activities.

```
Today is {{currentDate}}. Find 5 family-friendly EVENTS happening on or around "{{availability}}" near {{city}}.

**Important**: Search for SPECIFIC DATED EVENTS, not generic attractions. Look for:
- Local event calendars and "things to do" listings for the specified date
- Special programs, festivals, performances, and seasonal events
- One-time or limited-run activities with specific dates/times
- Community events, holiday activities, and special exhibits

Do NOT recommend generic "always open" attractions unless they have a SPECIFIC special event happening on the requested date.

**Family Details:**
- Kids ages: {{kidAges}}
- When they're available: {{availability}}
- Maximum distance: {{maxDistance}} miles
- Preferences: {{preferences}}

**Search Strategy:**
1. Search for "{{city}} events {{availability}}"
2. Search for "{{city}} kids activities {{availability}}"
3. Search for "things to do with kids {{city}}" for the specified date
4. Check local event calendars and community listings

**Response Format:**
Return exactly 5 event recommendations as a JSON array. Each object must have:
- `emoji`: A single relevant emoji for the activity type
- `title`: Event name with SPECIFIC date/time (e.g., "Holiday Train Show - Sat Dec 27, 2pm-4pm")
- `description`: 2-4 sentences explaining the event and why it's great for kids of these ages
- `location`: Venue or location name
- `distance`: Approximate distance from {{city}} center in miles (number)

**Example Response:**
[
  {
    "emoji": "🎄",
    "title": "Winter Wonderland Festival - Sat Dec 27, 11am-4pm",
    "description": "Annual holiday festival featuring live reindeer and kids' craft stations. This special weekend event includes ice sculpting demonstrations. Perfect for kids who love festive activities.",
    "location": "Lincoln Park Zoo",
    "distance": 3.2
  }
]

CRITICAL: Return ONLY a valid JSON array. No explanatory text.
```

---

# Dining Prompt (eventType: 'dining')

Used when searching for unique family-friendly restaurants. The `{{preferences}}` field becomes cuisine type.

```
Today is {{currentDate}}. Find 5 UNIQUE family-friendly {{cuisineType}} restaurants near {{city}} for "{{availability}}".

IMPORTANT: The user specifically requested "{{cuisineType}}" cuisine. ALL 5 restaurants MUST serve {{cuisineType}} food. Do NOT suggest other cuisine types.

**Search Criteria:**
- Cuisine type: {{cuisineType}} (REQUIRED - all results must match this cuisine)
- Must be POPULAR and HIGHLY RATED (4+ stars on Google/Yelp)
- UNIQUE local restaurants - NO national chains (no McDonald's, Chili's, Applebee's, Olive Garden, PF Chang's, etc.)
- Family-friendly atmosphere suitable for kids ages {{kidAges}}
- Within {{maxDistance}} miles

**Search Strategy:**
1. Search for "best {{cuisineType}} restaurants {{city}}"
2. Search for "top rated {{cuisineType}} {{city}}"
3. Search for "{{cuisineType}} restaurant near {{city}}"

**Prioritize UNIQUE EXPERIENCES:**
1. Authentic {{cuisineType}} restaurants with great reviews
2. Local gems and hidden treasures that locals love
3. Places with character, story, and personality - interesting decor, memorable atmosphere, or interactive elements
4. Restaurants known for specific signature {{cuisineType}} dishes
5. One-of-a-kind dining experiences the family will remember - think unique themes, tableside preparations, open kitchens, unusual settings, or cultural immersion

**Response Format:**
Return exactly 5 {{cuisineType}} restaurant recommendations as JSON array:
- `emoji`: Relevant food emoji for {{cuisineType}} cuisine
- `title`: Restaurant name with typical hours (e.g., "Thai Basil - Open 11am-9pm")
- `description`: 2-3 sentences highlighting what makes this a UNIQUE dining experience (atmosphere, specialty, story), must-try {{cuisineType}} dishes, and why it's great for families
- `location`: Full address or neighborhood
- `distance`: Miles from {{city}} center (number)

**Example Response:**
[
  {
    "emoji": "🍜",
    "title": "Thai Basil - Open 11am-9pm",
    "description": "Authentic family-run Thai restaurant known for their Pad Thai and Green Curry. The owners are from Bangkok and use traditional recipes. Kid-friendly with mild options available.",
    "location": "123 Main St, Downtown",
    "distance": 2.1
  }
]

CRITICAL: Return ONLY a valid JSON array. ALL restaurants MUST serve {{cuisineType}} food. NO CHAINS.
```

---

## Notes

- Both prompts use Claude's web search tool (`web_search_20250305`) to find current information
- The server injects the current date automatically
- Citation tags (`<cite>`) are stripped from responses before returning to the frontend
- If Claude can't find specific events/restaurants, it falls back to general recommendations
