# Milestone 1: UI with Dummy Data

## Setup
- [x] Initialize React project with Vite
- [x] Set up project structure (`components/`, `App.jsx`, `App.css`)

## Components
- [x] Create `SearchForm.jsx`
  - [x] City text input
  - [x] Kid Ages text input
  - [x] Date & Time Availability text input
  - [x] Max Distance slider (1-50 miles)
  - [x] Optional Preferences textarea
  - [x] Search button
  - [x] Clear button
- [x] Create `ResultsList.jsx`
  - [x] Result card component with rank badge, emoji, title, description, location, distance
  - [x] Display 5 dummy activities

## Styling
- [x] Header with logo, title, subtitle
- [x] Two-column layout (form left, results right)
- [x] Form card styling with emoji labels
- [x] Distance slider with blue pill value display
- [x] Result cards with colored rank badges
- [x] Match color scheme from spec

## State & Functionality
- [x] Form state management
- [x] Show results on form submit
- [x] Clear button resets form and hides results

---

# Milestone 2: Claude API Integration

## Backend Setup
- [x] Create `server/` directory structure
- [x] Initialize Express server in `server/index.js`
- [x] Install dependencies (`express`, `cors`, `@anthropic-ai/sdk`, `dotenv`)
- [x] Create `.env` file with `ANTHROPIC_API_KEY` and `PORT=3001`

## API Endpoint
- [x] Create `/api/activities` POST endpoint in `server/routes/activities.js`
- [x] Build prompt from `prompt.md` template, substituting user inputs for variables
- [x] Implement Claude API call with web search tool
- [x] Parse Claude response to extract JSON activity array

## Frontend Integration
- [x] Add fetch call to `/api/activities` in App.jsx
- [x] Pass form data to API on submit
- [x] Replace dummy data with real API response in ResultsList

## UX Enhancements
- [x] Add loading state (spinner/skeleton) while waiting for API
- [x] Add error handling and display error messages to user
- [x] Handle edge cases (empty results, API timeout)

---

# Milestone 3: Event Type Feature (Activities vs Dining) ✅

## UI Changes
- [x] Add "What are you looking for?" dropdown (activity/dining)
- [x] Conditional label: "Preferences" → "Cuisine Type" for dining
- [x] Conditional button text: "Search Activities" → "Search Restaurants"
- [x] Add `eventType` to form state in App.jsx

## Backend Changes
- [x] Create `buildDiningPrompt()` for restaurant searches
- [x] Add route logic to select prompt based on `eventType`
- [x] Dining prompt emphasizes: unique, popular, no chains, family-friendly

## Testing
- [x] Test activity search still works
- [x] Test dining search returns unique local restaurants
- [x] Verify no chain restaurants in dining results

---

# Milestone 4: Family Preference Learning (localStorage)

## Goal
Learn what the family enjoys over time using thumbs up/down reactions. Recommendations improve while preserving discovery (always include surprises).

## Hook Creation
- [ ] Create `/client/src/hooks/usePreferences.js`
- [ ] Implement `addReaction(activity, reaction)` - save thumbs up (+1) or down (-1)
- [ ] Implement `getReactionForActivity(title)` - check existing reactions
- [ ] Implement `buildPreferenceContext()` - generate prompt text from patterns
- [ ] Implement `clearPreferences()` - reset all data
- [ ] Add category extraction logic (zoo, museum, outdoor, dining, etc.)

## UI Changes
- [ ] Add thumbs up/down buttons to each result card in `ResultsList.jsx`
- [ ] Show filled vs outline icon based on existing reaction
- [ ] Add visual feedback animation on reaction click
- [ ] Add "Matches your interests" badge when activity matches preferences
- [ ] Add "Clear Preferences" link in footer/settings

## App Integration
- [ ] Import and use `usePreferences` hook in `App.jsx`
- [ ] Pass reaction functions to `ResultsList` as props
- [ ] Call `buildPreferenceContext()` before API call
- [ ] Include `preferenceContext` in API request body

## Backend Changes
- [ ] Accept optional `preferenceContext` field in `/api/activities`
- [ ] Append preference context to activity prompt
- [ ] Append preference context to dining prompt
- [ ] Ensure prompts request 1-2 discoveries outside known preferences

## Styling
- [ ] Style thumbs up/down buttons (hover, active states)
- [ ] Style preference match badge
- [ ] Add reaction animation CSS

## Testing
- [ ] Thumbs buttons appear on results
- [ ] Clicking saves to localStorage
- [ ] Preference badge appears for matching activities
- [ ] Preferences included in API request
- [ ] Recommendations prioritize (but don't exclude) based on preferences
- [ ] Clear preferences works
