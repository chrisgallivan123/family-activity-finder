# Family Activity Finder - Claude API Prompt

## Input Variables
- `{{city}}` - User's city
- `{{kidAges}}` - Ages of children
- `{{availability}}` - When they're free
- `{{maxDistance}}` - Maximum driving distance in miles
- `{{preferences}}` - Optional preferences

---

## Prompt

```
Find 5 family-friendly activities happening this weekend near {{city}}.

**Family Details:**
- Kids ages: {{kidAges}}
- Available: {{availability}}
- Maximum distance: {{maxDistance}} miles
- Preferences: {{preferences}}

**Instructions:**
Search for current local events, attractions, and activities suitable for children of these ages. Prioritize activities that are:
1. Age-appropriate and engaging for kids aged {{kidAges}}
2. Within {{maxDistance}} miles of {{city}}
3. Available during {{availability}}
4. Matching any stated preferences

**Response Format:**
Return exactly 5 recommendations as a JSON array. Each object must have:
- `emoji`: A single relevant emoji for the activity type
- `title`: Activity name with date/time (e.g., "Dinosaur Exhibit - Saturday 10am-5pm")
- `description`: 2-4 sentences explaining the activity and why it's great for kids of these ages
- `location`: Venue or location name
- `distance`: Approximate distance from {{city}} center in miles (number)

**Example Response:**
```json
[
  {
    "emoji": "🦕",
    "title": "Dinosaur Discovery Exhibit - Saturday 10am-5pm",
    "description": "An interactive exhibit featuring life-size dinosaur replicas and fossil dig activities. Perfect for curious kids who love prehistoric creatures. Hands-on stations let children excavate replica fossils and learn about paleontology.",
    "location": "Natural History Museum",
    "distance": 2.3
  }
]
```

Return ONLY the JSON array, no additional text.
```
