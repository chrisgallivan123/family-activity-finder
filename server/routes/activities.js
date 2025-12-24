import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// Anthropic client will be initialized lazily on first request
let anthropic = null;

function getAnthropicClient() {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return anthropic;
}

/**
 * Get today's date formatted for the prompt
 */
function getTodayFormatted() {
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return today.toLocaleDateString('en-US', options);
}

/**
 * Build the prompt by substituting user inputs into the template
 */
function buildPrompt({ city, kidAges, availability, maxDistance, preferences }) {
  const preferencesText = preferences || 'No specific preferences';
  const todayDate = getTodayFormatted();

  return `Today is ${todayDate}. Find 5 family-friendly EVENTS happening on or around "${availability}" near ${city}.

**Important**: Search for SPECIFIC DATED EVENTS, not generic attractions. Look for:
- Local event calendars and "things to do" listings for the specified date
- Special programs, festivals, performances, and seasonal events
- One-time or limited-run activities with specific dates/times
- Community events, holiday activities, and special exhibits

Do NOT recommend generic "always open" attractions unless they have a SPECIFIC special event happening on the requested date.

**Family Details:**
- Kids ages: ${kidAges}
- When they're available: ${availability}
- Maximum distance: ${maxDistance} miles
- Preferences: ${preferencesText}

**Search Strategy:**
1. Search for "${city} events ${availability}"
2. Search for "${city} kids activities ${availability}"
3. Search for "things to do with kids ${city}" for the specified date
4. Check local event calendars and community listings

**Response Format:**
Return exactly 5 event recommendations as a JSON array. Each object must have:
- \`emoji\`: A single relevant emoji for the activity type
- \`title\`: Event name with SPECIFIC date/time matching "${availability}" (e.g., "Holiday Train Show - Sat Dec 27, 2pm-4pm")
- \`description\`: 2-4 sentences explaining the event and why it's great for kids of these ages. Mention what makes this a special/timely event.
- \`location\`: Venue or location name
- \`distance\`: Approximate distance from ${city} center in miles (number)

**Example Response:**
\`\`\`json
[
  {
    "emoji": "🎄",
    "title": "Winter Wonderland Festival - Sat Dec 27, 11am-4pm",
    "description": "Annual holiday festival featuring live reindeer, Santa meet-and-greet, and kids' craft stations. This special weekend event includes ice sculpting demonstrations and a holiday parade at 2pm. Perfect for kids who love festive activities.",
    "location": "Lincoln Park Zoo",
    "distance": 3.2
  }
]
\`\`\`

CRITICAL: You MUST return ONLY a valid JSON array with exactly 5 activities. Do NOT include any explanatory text, apologies, or caveats. If you cannot find specific dated events, include ongoing attractions or regularly scheduled activities that would be available on that date. Never respond with anything other than the JSON array.`;
}

/**
 * Build the dining prompt for restaurant searches
 */
function buildDiningPrompt({ city, kidAges, availability, maxDistance, preferences }) {
  const cuisineType = preferences || 'any cuisine';
  const todayDate = getTodayFormatted();

  // Build cuisine-specific instruction
  const cuisineInstruction = preferences
    ? `IMPORTANT: The user specifically requested "${cuisineType}" cuisine. ALL 5 restaurants MUST serve ${cuisineType} food. Do NOT suggest other cuisine types.`
    : 'Find a variety of cuisine types.';

  return `Today is ${todayDate}. Find 5 UNIQUE family-friendly ${cuisineType} restaurants near ${city} for "${availability}".

${cuisineInstruction}

**Search Criteria:**
- Cuisine type: ${cuisineType} (REQUIRED - all results must match this cuisine)
- Must be POPULAR and HIGHLY RATED (4+ stars on Google/Yelp)
- UNIQUE local restaurants - NO national chains (no McDonald's, Chili's, Applebee's, Olive Garden, PF Chang's, etc.)
- Family-friendly atmosphere suitable for kids ages ${kidAges}
- Within ${maxDistance} miles

**Search Strategy:**
1. Search for "best ${cuisineType} restaurants ${city}"
2. Search for "top rated ${cuisineType} ${city}"
3. Search for "${cuisineType} restaurant near ${city}"

**Prioritize UNIQUE EXPERIENCES:**
1. Authentic ${cuisineType} restaurants with great reviews
2. Local gems and hidden treasures that locals love
3. Places with character, story, and personality - interesting decor, memorable atmosphere, or interactive elements
4. Restaurants known for specific signature ${cuisineType} dishes
5. One-of-a-kind dining experiences the family will remember - think unique themes, tableside preparations, open kitchens, unusual settings, or cultural immersion

**Response Format:**
Return exactly 5 ${cuisineType} restaurant recommendations as JSON array:
- \`emoji\`: Relevant food emoji for ${cuisineType} cuisine
- \`title\`: Restaurant name with typical hours (e.g., "Thai Basil - Open 11am-9pm")
- \`description\`: 2-3 sentences highlighting what makes this a UNIQUE dining experience (atmosphere, specialty, story), must-try ${cuisineType} dishes, and why it's great for families.
- \`location\`: Full address or neighborhood
- \`distance\`: Miles from ${city} center (number)

CRITICAL: Return ONLY a valid JSON array. ALL restaurants MUST serve ${cuisineType} food. NO CHAINS. No explanatory text, just the JSON array.`;
}

/**
 * Remove citation tags from text (e.g., <cite index="1-2">text</cite> -> text)
 */
function removeCitations(text) {
  return text
    .replace(/<cite[^>]*>/g, '')
    .replace(/<\/cite>/g, '')
    .trim();
}

/**
 * Extract JSON array from Claude's response text
 * Handles cases where JSON might be wrapped in markdown code blocks
 */
function parseActivitiesFromResponse(responseText) {
  // Try to extract JSON from markdown code block first
  const jsonBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  const textToParse = jsonBlockMatch ? jsonBlockMatch[1].trim() : responseText.trim();

  // Find the JSON array in the text
  const arrayMatch = textToParse.match(/\[[\s\S]*\]/);
  if (!arrayMatch) {
    // Check if Claude explained it couldn't find events
    if (responseText.toLowerCase().includes('unable to find') ||
        responseText.toLowerCase().includes('could not find') ||
        responseText.toLowerCase().includes('no specific events')) {
      throw new Error('No events found for this date. Try a date closer to today, or a larger city.');
    }
    throw new Error('No JSON array found in response');
  }

  const activities = JSON.parse(arrayMatch[0]);

  // Validate the structure
  if (!Array.isArray(activities)) {
    throw new Error('Response is not an array');
  }

  // Validate and clean each activity
  activities.forEach((activity, index) => {
    const required = ['emoji', 'title', 'description', 'location', 'distance'];
    for (const field of required) {
      if (!(field in activity)) {
        throw new Error(`Activity ${index + 1} missing required field: ${field}`);
      }
    }
    // Clean citation tags from description
    activity.description = removeCitations(activity.description);
  });

  return activities;
}

/**
 * POST /api/activities
 * Receives form data and returns activity recommendations from Claude
 */
router.post('/', async (req, res) => {
  try {
    const { eventType, city, kidAges, availability, maxDistance, preferences, preferenceContext } = req.body;

    // Validate required fields
    if (!city || !kidAges || !availability) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'City, kid ages, and availability are required'
      });
    }

    const isDining = eventType === 'dining';
    console.log('📥 Received request:', { eventType, city, kidAges, availability, maxDistance, preferences });
    if (preferenceContext) {
      console.log('🧠 Preference context included:', preferenceContext.substring(0, 100) + '...');
    }

    // Build the appropriate prompt based on event type
    let prompt = isDining
      ? buildDiningPrompt({ city, kidAges, availability, maxDistance, preferences })
      : buildPrompt({ city, kidAges, availability, maxDistance, preferences });

    // Append preference context if provided
    if (preferenceContext) {
      prompt += `\n\n${preferenceContext}`;
    }

    console.log(`🤖 Calling Claude API for ${isDining ? 'DINING' : 'ACTIVITIES'} search...`);

    // Call Claude API with retry logic for rate limits
    const client = getAnthropicClient();
    let response;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 16000,
          tools: [{
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 5
          }],
          messages: [{ role: 'user', content: prompt }]
        });
        break; // Success, exit loop
      } catch (err) {
        if (err.status === 429 && retries < maxRetries - 1) {
          retries++;
          const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff: 2s, 4s, 8s
          console.log(`⏳ Rate limited, waiting ${waitTime/1000}s before retry ${retries}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          throw err; // Re-throw if not rate limit or out of retries
        }
      }
    }

    console.log('✅ Claude API response received');
    console.log('📋 Response content blocks:', response.content.length);

    // Extract text content from response
    // Claude may return multiple content blocks when using tools
    let responseText = '';
    for (const block of response.content) {
      console.log('  Block type:', block.type);
      if (block.type === 'text') {
        responseText += block.text;
      }
    }

    console.log('📝 Response text length:', responseText.length);
    console.log('📝 Response preview:', responseText.substring(0, 500));

    if (!responseText) {
      throw new Error('No text response from Claude');
    }

    // Parse activities from response
    const activities = parseActivitiesFromResponse(responseText);

    console.log(`📤 Returning ${activities.length} activities`);

    res.json({ activities });

  } catch (error) {
    console.error('❌ Error:', error.message);

    // Handle specific API errors
    if (error.status === 401) {
      return res.status(500).json({
        error: 'API authentication failed',
        details: 'Please check your ANTHROPIC_API_KEY'
      });
    }

    if (error.status === 429) {
      return res.status(503).json({
        error: 'Rate limited',
        details: 'The API is busy. Please wait 30 seconds and try again.'
      });
    }

    res.status(500).json({
      error: 'Failed to get activity recommendations',
      details: error.message
    });
  }
});

export default router;
