function ResultsList({ activities }) {
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

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>Top {activities.length} Recommendations</h2>
        <span className="sorted-label">SORTED BY RELEVANCE</span>
      </div>

      <div className="results-list">
        {activities.map((activity, index) => (
          <div className="result-card" key={index}>
            <div
              className="rank-badge"
              style={{ background: getRankColor(index) }}
            >
              #{index + 1}
            </div>
            <div className="activity-emoji">{activity.emoji}</div>
            <div className="activity-content">
              <h3 className="activity-title">{activity.title}</h3>
              <p className="activity-description">{activity.description}</p>
              <div className="activity-footer">
                <span>📍 {activity.location}</span>
                <span>🚗 {activity.distance} miles</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsList;
