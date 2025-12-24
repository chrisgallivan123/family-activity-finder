import { useState } from 'react';

function ResultsList({ activities, addReaction, getReactionForActivity, matchesPreferences, searchContext = {} }) {
  // Track which cards just had a reaction for animation
  const [animatingCard, setAnimatingCard] = useState(null);
  // Track which card is showing the "what did you like?" prompt
  const [askingWhyCard, setAskingWhyCard] = useState(null);

  // Build exclude list based on current search (don't badge for what they're already searching)
  const getExcludeCategories = () => {
    const excludes = [];
    if (searchContext.cuisineType) {
      // Add the cuisine type and common variations
      excludes.push(searchContext.cuisineType);
    }
    return excludes;
  };

  const getRankColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #3B82F6, #2563EB)', // Blue
      'linear-gradient(135deg, #0EA5E9, #0284C7)', // Light blue
      'linear-gradient(135deg, #14B8A6, #0D9488)', // Teal
      'linear-gradient(135deg, #10B981, #059669)', // Green
      'linear-gradient(135deg, #22C55E, #16A34A)'  // Light green
    ];
    return colors[index] || colors[0];
  };

  const handleReaction = (activity, reaction) => {
    if (!addReaction) return;

    if (reaction === 1) {
      // Thumbs up - ask what they liked
      setAskingWhyCard(activity.title);
    } else {
      // Thumbs down - just record it
      addReaction(activity, reaction, []);
      setAnimatingCard(activity.title);
      setTimeout(() => setAnimatingCard(null), 300);
    }
  };

  const handleWhySelection = (activity, reason) => {
    if (addReaction) {
      addReaction(activity, 1, [reason]);
      setAskingWhyCard(null);
      setAnimatingCard(activity.title);
      setTimeout(() => setAnimatingCard(null), 300);
    }
  };

  const handleCancelWhy = () => {
    setAskingWhyCard(null);
  };

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>Top {activities.length} Recommendations</h2>
        <span className="sorted-label">SORTED BY RELEVANCE</span>
      </div>

      <div className="results-list">
        {activities.map((activity, index) => {
          const currentReaction = getReactionForActivity ? getReactionForActivity(activity.title) : null;
          const excludeCategories = getExcludeCategories();
          const isMatch = matchesPreferences ? matchesPreferences(activity, { excludeCategories }) : false;
          const isAnimating = animatingCard === activity.title;
          const isAskingWhy = askingWhyCard === activity.title;

          return (
            <div className={`result-card ${isAnimating ? 'card-pulse' : ''}`} key={index}>
              {isMatch && !isAskingWhy && (
                <div className="preference-badge">
                  <span className="badge-icon">⭐</span>
                  <span className="badge-text">Matches your interests</span>
                </div>
              )}
              <div
                className="rank-badge"
                style={{ background: getRankColor(index) }}
              >
                #{index + 1}
              </div>
              <div className="activity-emoji">{activity.emoji}</div>
              <div className="activity-content">
                <h3 className="activity-title">{activity.title}</h3>

                {isAskingWhy ? (
                  <div className="why-prompt">
                    <p className="why-question">What did you like about this place?</p>
                    <div className="why-options">
                      <button
                        className="why-btn"
                        onClick={() => handleWhySelection(activity, 'menu')}
                      >
                        🍽️ Menu choices
                      </button>
                      <button
                        className="why-btn"
                        onClick={() => handleWhySelection(activity, 'ambience')}
                      >
                        ✨ Ambience
                      </button>
                      <button
                        className="why-btn"
                        onClick={() => handleWhySelection(activity, 'authenticity')}
                      >
                        👨‍🍳 Authenticity
                      </button>
                    </div>
                    <button className="why-cancel" onClick={handleCancelWhy}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="activity-description">{activity.description}</p>
                    <div className="activity-footer">
                      <div className="activity-info">
                        <span>📍 {activity.location}</span>
                        <span>🚗 {activity.distance} miles</span>
                      </div>
                      {addReaction && (
                        <div className="reaction-buttons">
                          <button
                            className={`reaction-btn thumbs-up ${currentReaction === 1 ? 'active' : ''}`}
                            onClick={() => handleReaction(activity, 1)}
                            title="We tried it and liked it"
                            aria-label="Thumbs up"
                          >
                            {currentReaction === 1 ? '👍' : '👍🏻'}
                          </button>
                          <button
                            className={`reaction-btn thumbs-down ${currentReaction === -1 ? 'active' : ''}`}
                            onClick={() => handleReaction(activity, -1)}
                            title="Not for us"
                            aria-label="Thumbs down"
                          >
                            {currentReaction === -1 ? '👎' : '👎🏻'}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultsList;
