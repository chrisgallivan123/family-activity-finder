import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'familyActivityPreferences';
const PREFERENCE_VERSION = 1;

// Category keywords to extract from activity titles/descriptions
// Focus on QUALITIES that drive preferences, not just types
const CATEGORY_KEYWORDS = {
  // === ACTIVITY TYPES (for activities search) ===
  zoo: ['zoo', 'animal', 'wildlife', 'aquarium', 'safari'],
  museum: ['museum', 'exhibit', 'gallery', 'art', 'science center'],
  outdoor: ['park', 'nature', 'hiking', 'beach', 'garden', 'trail', 'outdoor'],
  performance: ['theater', 'theatre', 'show', 'concert', 'performance', 'ballet', 'opera', 'circus'],
  sports: ['game', 'stadium', 'sports', 'soccer', 'baseball', 'basketball', 'skating', 'bowling'],
  festival: ['festival', 'fair', 'carnival', 'parade', 'celebration'],
  educational: ['library', 'workshop', 'class', 'learning', 'stem', 'planetarium'],

  // === DINING QUALITIES (what actually matters for restaurants) ===
  // Ambience & Atmosphere
  'cozy-ambience': ['cozy', 'intimate', 'warm atmosphere', 'charming', 'quaint', 'homey'],
  'fun-atmosphere': ['fun', 'lively', 'vibrant', 'energetic', 'exciting', 'entertaining'],
  'unique-decor': ['unique decor', 'cool decor', 'themed', 'instagram', 'instagrammable', 'beautiful interior', 'stunning'],
  'family-vibe': ['family-friendly', 'kid-friendly', 'welcoming', 'casual', 'relaxed'],

  // Food Quality
  'authentic-food': ['authentic', 'traditional', 'genuine', 'real deal', 'legit', 'true to'],
  'fresh-quality': ['fresh', 'quality ingredients', 'farm-to-table', 'locally sourced', 'homemade', 'house-made', 'scratch'],
  'award-winning': ['award', 'best in', 'voted', 'renowned', 'famous for', 'known for'],

  // Menu & Options
  'great-for-kids': ['kids menu', 'children', 'kid-friendly', 'crayons', 'high chair', 'play area', 'family portions'],
  'unique-menu': ['unique dishes', 'creative', 'innovative', 'signature', 'specialty', 'one-of-a-kind', 'unusual'],
  'generous-portions': ['generous portions', 'huge portions', 'big portions', 'hearty', 'filling'],

  // Experience
  'interactive-dining': ['interactive', 'tableside', 'open kitchen', 'watch', 'cook your own', 'hands-on'],
  'great-value': ['great value', 'affordable', 'reasonable prices', 'good prices', 'budget-friendly'],
  'local-gem': ['local favorite', 'hidden gem', 'locals love', 'neighborhood', 'mom and pop', 'family-run', 'family-owned']
};

// Map explicit user reasons to related auto-extracted categories
const REASON_TO_CATEGORIES = {
  menu: ['unique-menu', 'great-for-kids', 'generous-portions'],
  ambience: ['cozy-ambience', 'fun-atmosphere', 'unique-decor', 'family-vibe'],
  authenticity: ['authentic-food', 'fresh-quality', 'award-winning', 'local-gem']
};

// Reverse mapping: auto-extracted categories map to explicit reasons
const CATEGORY_TO_REASON = {};
for (const [reason, categories] of Object.entries(REASON_TO_CATEGORIES)) {
  for (const cat of categories) {
    CATEGORY_TO_REASON[cat] = reason;
  }
}

/**
 * Extract categories from activity title and description
 */
function extractCategories(activity) {
  const text = `${activity.title} ${activity.description}`.toLowerCase();
  const categories = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      categories.push(category);
      // Also add the mapped explicit reason if applicable
      if (CATEGORY_TO_REASON[category]) {
        categories.push(CATEGORY_TO_REASON[category]);
      }
    }
  }

  return categories.length > 0 ? [...new Set(categories)] : ['general'];
}

/**
 * Load preferences from localStorage
 */
function loadPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.version === PREFERENCE_VERSION) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Failed to load preferences:', e);
  }
  return { version: PREFERENCE_VERSION, reactions: [] };
}

/**
 * Save preferences to localStorage
 */
function savePreferences(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save preferences:', e);
  }
}

/**
 * Custom hook for managing family activity preferences
 */
export function usePreferences() {
  const [preferences, setPreferences] = useState(() => loadPreferences());

  // Save to localStorage whenever preferences change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  /**
   * Add a reaction (thumbs up or down) for an activity
   * @param {Object} activity - The activity object
   * @param {number} reaction - 1 for thumbs up, -1 for thumbs down
   * @param {string[]} explicitReasons - User-selected reasons (menu, ambience, authenticity)
   */
  const addReaction = useCallback((activity, reaction, explicitReasons = []) => {
    // For thumbs up with explicit reasons, use those
    // For thumbs down or no reasons, extract from description
    let categories;

    if (reaction === 1 && explicitReasons.length > 0) {
      // User told us exactly what they liked
      categories = explicitReasons;
    } else {
      // Fall back to extraction (for thumbs down or activities)
      categories = extractCategories(activity);
    }

    const newReaction = {
      title: activity.title,
      categories,
      reaction,
      date: new Date().toISOString().split('T')[0]
    };

    setPreferences(prev => {
      // Remove any existing reaction for this activity
      const filtered = prev.reactions.filter(r => r.title !== activity.title);
      return {
        ...prev,
        reactions: [...filtered, newReaction]
      };
    });
  }, []);

  /**
   * Get the current reaction for an activity (if any)
   * @param {string} title - The activity title
   * @returns {number|null} 1, -1, or null if no reaction
   */
  const getReactionForActivity = useCallback((title) => {
    const reaction = preferences.reactions.find(r => r.title === title);
    return reaction ? reaction.reaction : null;
  }, [preferences.reactions]);

  /**
   * Check if an activity matches the user's known preferences
   * Returns true if the activity's categories have 2+ positive reactions
   * @param {Object} activity - The activity to check
   * @param {Object} options - Optional settings
   * @param {string[]} options.excludeCategories - Categories to ignore (e.g., current search cuisine)
   */
  const matchesPreferences = useCallback((activity, options = {}) => {
    const { excludeCategories = [] } = options;
    const activityCategories = extractCategories(activity);

    // Count positive reactions per category
    const categoryScores = {};
    for (const reaction of preferences.reactions) {
      if (reaction.reaction > 0) {
        for (const cat of reaction.categories) {
          categoryScores[cat] = (categoryScores[cat] || 0) + 1;
        }
      }
    }

    // Filter out excluded categories (like the current search cuisine)
    // and check if any remaining categories have 2+ likes
    const relevantCategories = activityCategories.filter(cat =>
      !excludeCategories.some(excluded =>
        cat.toLowerCase().includes(excluded.toLowerCase()) ||
        excluded.toLowerCase().includes(cat.toLowerCase())
      )
    );

    return relevantCategories.some(cat => (categoryScores[cat] || 0) >= 2);
  }, [preferences.reactions]);

  // Human-readable descriptions for category keys
  const CATEGORY_DESCRIPTIONS = {
    // Explicit user-selected reasons (most important!)
    menu: 'great menu choices',
    ambience: 'great ambience and atmosphere',
    authenticity: 'authentic, quality food',

    // Activities
    zoo: 'zoos and animal experiences',
    museum: 'museums and exhibits',
    outdoor: 'outdoor activities',
    performance: 'shows and performances',
    sports: 'sports and games',
    festival: 'festivals and fairs',
    educational: 'educational activities',

    // Auto-extracted dining qualities (fallback)
    'cozy-ambience': 'cozy atmospheres',
    'fun-atmosphere': 'fun, lively atmospheres',
    'unique-decor': 'unique decor',
    'family-vibe': 'family-friendly vibes',
    'authentic-food': 'authentic cuisine',
    'fresh-quality': 'fresh ingredients',
    'award-winning': 'highly-rated spots',
    'great-for-kids': 'great kids options',
    'unique-menu': 'unique menu items',
    'generous-portions': 'generous portions',
    'interactive-dining': 'interactive dining',
    'great-value': 'great value',
    'local-gem': 'local gems'
  };

  /**
   * Build a preference context string to include in Claude prompts
   */
  const buildPreferenceContext = useCallback(() => {
    if (preferences.reactions.length === 0) {
      return null;
    }

    // Count reactions by category
    const liked = {};
    const disliked = {};

    for (const reaction of preferences.reactions) {
      const target = reaction.reaction > 0 ? liked : disliked;
      for (const cat of reaction.categories) {
        target[cat] = (target[cat] || 0) + 1;
      }
    }

    // Build lists of strong preferences (2+ reactions)
    const strongLikes = Object.entries(liked)
      .filter(([_, count]) => count >= 2)
      .map(([cat]) => CATEGORY_DESCRIPTIONS[cat] || cat.replace(/-/g, ' '));

    const strongDislikes = Object.entries(disliked)
      .filter(([_, count]) => count >= 2)
      .map(([cat]) => CATEGORY_DESCRIPTIONS[cat] || cat.replace(/-/g, ' '));

    if (strongLikes.length === 0 && strongDislikes.length === 0) {
      return null;
    }

    let context = '**Family Preference History:**\n';

    if (strongLikes.length > 0) {
      context += `The family tends to enjoy: ${strongLikes.join(', ')}\n`;
    }

    if (strongDislikes.length > 0) {
      context += `The family tends to avoid: ${strongDislikes.join(', ')}\n`;
    }

    context += '\nWhen ranking results, give higher priority to options matching these preferences, ';
    context += 'but ALWAYS include at least 1-2 options outside their usual interests for discovery.';

    return context;
  }, [preferences.reactions]);

  /**
   * Clear all stored preferences
   */
  const clearPreferences = useCallback(() => {
    setPreferences({ version: PREFERENCE_VERSION, reactions: [] });
  }, []);

  /**
   * Get count of total reactions stored
   */
  const reactionCount = preferences.reactions.length;

  return {
    addReaction,
    getReactionForActivity,
    matchesPreferences,
    buildPreferenceContext,
    clearPreferences,
    reactionCount
  };
}

export default usePreferences;
