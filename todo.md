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
- [ ] Create `server/` directory structure
- [ ] Initialize Express server in `server/index.js`
- [ ] Install dependencies (`express`, `cors`, `@anthropic-ai/sdk`, `dotenv`)
- [ ] Create `.env` file with `ANTHROPIC_API_KEY` and `PORT=3001`

## API Endpoint
- [ ] Create `/api/activities` POST endpoint in `server/routes/activities.js`
- [ ] Build prompt from `prompt.md` template, substituting user inputs for variables
- [ ] Implement Claude API call with web search tool
- [ ] Parse Claude response to extract JSON activity array

## Frontend Integration
- [ ] Add fetch call to `/api/activities` in App.jsx
- [ ] Pass form data to API on submit
- [ ] Replace dummy data with real API response in ResultsList

## UX Enhancements
- [ ] Add loading state (spinner/skeleton) while waiting for API
- [ ] Add error handling and display error messages to user
- [ ] Handle edge cases (empty results, API timeout)
