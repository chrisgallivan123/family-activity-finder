# Family Activity Finder - Spec

## Overview
A web app that helps parents find weekend activities for their family based on location, kids' ages, availability, and preferences. Uses Claude API with web search to generate personalized recommendations.

---

## Requirements

### User Inputs
| Field | Type | Details |
|-------|------|---------|
| City | Text input | Required |
| Kid Ages | Text input | e.g., "7" or "5, 8, 12" |
| Date & Time | Text input | e.g., "Sunday afternoon" |
| Max Distance | Slider | 1-50 miles, default 10 |
| Preferences | Textarea | Optional, e.g., "indoor, educational" |

### Output
5 activity recommendations, each with:
- Rank badge (#1-#5)
- Emoji (activity-relevant)
- **Bold title** with date/time
- 2-4 sentence description
- Location name with pin icon
- Distance in miles with car icon

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) |
| Styling | CSS (vanilla) |
| Backend | Express.js |
| AI | Claude API with web search tool |
| Package Manager | npm |

### Project Structure
```
family-activity-finder/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchForm.jsx
│   │   │   └── ResultsList.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── index.html
├── server/
│   ├── index.js
│   └── routes/
│       └── activities.js
├── package.json
└── .env
```

---

## Design Guidelines

### Layout
- **Header**: Logo, "Family Activity Finder" title, subtitle, "New Search" link
- **Two-column layout**: Form (left ~35%), Results (right ~65%)
- **Card-based design** with subtle shadows and rounded corners

### Form Panel
- White card with shadow
- Field labels with emoji prefixes (📍 City, 👦 Kid Ages, 📅 Date, 🚗 Distance, ✨ Preferences)
- Distance slider showing current value in blue pill
- Blue primary button "🔍 Search Activities"
- Secondary "Clear" button

### Results Panel
- "Top 5 Recommendations" heading with "SORTED BY RELEVANCE" label
- Each result card:
  - Colored rank badge (gradient: blue → teal → green)
  - Large emoji (left side)
  - Bold title
  - Gray description text
  - Footer: 📍 Location • 🚗 X.X miles

### Colors
- Primary blue: `#3B82F6`
- Background: `#F8FAFC`
- Card background: `#FFFFFF`
- Text primary: `#1E293B`
- Text secondary: `#64748B`

---

## Milestones

### Milestone 1: UI with Dummy Data
**Goal**: Build the complete frontend with hardcoded results

**Tasks**:
1. Initialize React project with Vite
2. Create `SearchForm` component with all input fields
3. Create `ResultsList` component displaying 5 dummy activities
4. Style to match mockup design
5. Add form state management and clear functionality

**Deliverable**: Fully styled, interactive UI that displays dummy results on form submit

---

### Milestone 2: Claude API Integration
**Goal**: Connect to Claude API with web search for real recommendations

**Tasks**:
1. Set up Express server with `/api/activities` endpoint
2. Install `@anthropic-ai/sdk`
3. Implement Claude API call with web search tool using the prompt template from `prompt.md`:
   ```javascript
   const response = await client.messages.create({
     model: "claude-sonnet-4-20250514",
     max_tokens: 1500,
     tools: [{ type: "web_search_20250305" }],
     messages: [{ role: "user", content: prompt }]
   });
   ```
   Build the prompt by substituting user inputs into the template variables (`{{city}}`, `{{kidAges}}`, etc.)
4. Parse Claude response into structured activity format
5. Connect frontend to backend API
6. Add loading state and error handling

**Deliverable**: Working end-to-end app that returns real activity recommendations

---

## Environment Variables
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```
