const dummyActivities = [
  {
    emoji: "🦕",
    title: "Dinosaur Discovery Exhibit - Saturday 10am-5pm",
    description: "An interactive exhibit featuring life-size dinosaur replicas and fossil dig activities. Perfect for curious kids who love prehistoric creatures. Hands-on stations let children excavate replica fossils and learn about paleontology.",
    location: "Natural History Museum",
    distance: 2.3
  },
  {
    emoji: "🎨",
    title: "Kids Art Workshop - Sunday 1pm-3pm",
    description: "A creative session where children can explore painting, sculpting, and mixed media. All materials provided. Great for fostering creativity and self-expression in a fun, supportive environment.",
    location: "Community Arts Center",
    distance: 4.1
  },
  {
    emoji: "🌳",
    title: "Nature Trail Adventure - Saturday 9am-12pm",
    description: "Guided family hike through scenic trails with a naturalist who points out local wildlife and plants. Kid-friendly pace with interactive nature bingo cards. Suitable for all fitness levels.",
    location: "Riverside State Park",
    distance: 7.8
  },
  {
    emoji: "🎭",
    title: "Children's Theater: The Magic Garden - Sunday 2pm",
    description: "A delightful 45-minute performance perfect for young audiences. Interactive storytelling with audience participation, colorful costumes, and catchy songs that kids will be humming for days.",
    location: "Downtown Playhouse",
    distance: 3.5
  },
  {
    emoji: "🔬",
    title: "Junior Scientists Lab - Saturday 2pm-4pm",
    description: "Hands-on science experiments designed for kids ages 5-12. This week's theme: Volcano explosions and chemical reactions! Lab coats provided. A perfect blend of education and excitement.",
    location: "Science Discovery Center",
    distance: 5.2
  }
];

function ResultsList({ activities = dummyActivities }) {
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
        <h2>Top 5 Recommendations</h2>
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
