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

# Milestone 4: Family Preference Learning (localStorage) ✅

## Goal
Learn what the family enjoys over time using thumbs up/down reactions. Recommendations improve while preserving discovery (always include surprises).

## Hook Creation
- [x] Create `/client/src/hooks/usePreferences.js`
- [x] Implement `addReaction(activity, reaction)` - save thumbs up (+1) or down (-1)
- [x] Implement `getReactionForActivity(title)` - check existing reactions
- [x] Implement `buildPreferenceContext()` - generate prompt text from patterns
- [x] Implement `clearPreferences()` - reset all data
- [x] Add category extraction logic (qualities: menu, ambience, authenticity)

## UI Changes
- [x] Add thumbs up/down buttons to each result card in `ResultsList.jsx`
- [x] Show filled vs outline icon based on existing reaction
- [x] Add visual feedback animation on reaction click
- [x] Add "Matches your interests" badge when activity matches preferences
- [x] Add "Clear Preferences" link in footer
- [x] Add "What did you like?" prompt (Menu/Ambience/Authenticity)

## App Integration
- [x] Import and use `usePreferences` hook in `App.jsx`
- [x] Pass reaction functions to `ResultsList` as props
- [x] Call `buildPreferenceContext()` before API call
- [x] Include `preferenceContext` in API request body

## Backend Changes
- [x] Accept optional `preferenceContext` field in `/api/activities`
- [x] Append preference context to activity prompt
- [x] Append preference context to dining prompt
- [x] Ensure prompts request 1-2 discoveries outside known preferences

## Styling
- [x] Style thumbs up/down buttons (hover, active states)
- [x] Style preference match badge
- [x] Add reaction animation CSS
- [x] Style "What did you like?" prompt

## Testing
- [x] Thumbs buttons appear on results
- [x] Clicking saves to localStorage
- [x] Preference badge appears for matching activities
- [x] Preferences included in API request
- [x] Recommendations prioritize (but don't exclude) based on preferences
- [x] Clear preferences works

---

# Milestone 5: Favorite Dishes Feature ✅

## Goal
Allow users to track favorite dishes. Use dish preferences to improve recommendations - highlight restaurants known for dishes the family loves.

## Data Structure
- [x] Update `usePreferences.js` to store `favoriteDishes` array
- [x] Bump preference version to handle migration
- [x] Add `addDish(dishName)` function
- [x] Add `removeDish(dishName)` function
- [x] Add `getFavoriteDishes()` function

## UI - Dishes Modal
- [x] Create `FavoriteDishes.jsx` modal component
- [x] Display existing dishes as removable chips
- [x] Add text input for new dish
- [x] Add helper text explaining how dishes are used

## Footer Integration
- [x] Update footer to show dish count: "🍜 Favorite Dishes (3)"
- [x] Clicking opens dishes modal
- [x] Update "Clear All" to also clear dishes

## Preference Context
- [x] Update `buildPreferenceContext()` to include dishes
- [x] Format: "The family loves these dishes: Pad Thai, Ramen, Tacos"
- [x] Instruct Claude to prioritize restaurants known for these dishes

## Enhanced Badge
- [x] Check if restaurant description mentions a favorite dish
- [x] Show specific badge: "⭐ Known for Pad Thai - your favorite!"
- [x] Falls back to generic badge if no dish match

## Styling
- [x] Style dishes modal
- [x] Style dish chips with remove button
- [x] Style dish input field

## Testing
- [x] Can add dishes to favorites list
- [x] Can remove dishes from list
- [x] Dishes persist in localStorage
- [x] Dishes included in Claude prompt
- [x] Badge shows when restaurant known for favorite dish
- [x] Clear all removes dishes too
