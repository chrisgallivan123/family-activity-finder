function SearchForm({ formData, onFormChange, onSubmit, onClear, isLoading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  // Get today's date in YYYY-MM-DD format for the date picker min value
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const isDining = formData.eventType === 'dining';

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventType">🎯 What are you looking for?</label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
          >
            <option value="activity">🎪 Family Activities</option>
            <option value="dining">🍽️ Family Dining</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="city">📍 City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="kidAges">👦 Kid Ages</label>
          <input
            type="text"
            id="kidAges"
            name="kidAges"
            value={formData.kidAges}
            onChange={handleChange}
            placeholder="e.g., 5, 8, 12"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">📅 Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeOfDay">🕐 Time of Day</label>
          <select
            id="timeOfDay"
            name="timeOfDay"
            value={formData.timeOfDay}
            onChange={handleChange}
            required
          >
            <option value="morning">Morning (before noon)</option>
            <option value="afternoon">Afternoon (12pm - 5pm)</option>
            <option value="evening">Evening (after 5pm)</option>
            <option value="all day">All Day</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="maxDistance">
            🚗 Max Distance: <span className="distance-pill">{formData.maxDistance} miles</span>
          </label>
          <input
            type="range"
            id="maxDistance"
            name="maxDistance"
            min="1"
            max="50"
            value={formData.maxDistance}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="preferences">
            {isDining ? '🍽️ Cuisine Type (optional)' : '✨ Preferences (optional)'}
          </label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            placeholder={isDining
              ? "e.g., Italian, Sushi, BBQ, Mexican, Brunch"
              : "e.g., indoor, educational, budget-friendly"}
            rows="3"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading
              ? '⏳ Searching...'
              : isDining
                ? '🔍 Search Restaurants'
                : '🔍 Search Activities'}
          </button>
          <button type="button" className="btn-secondary" onClick={onClear} disabled={isLoading}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
