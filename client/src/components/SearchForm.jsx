function SearchForm({ formData, onFormChange, onSubmit, onClear }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="availability">📅 Date & Time</label>
          <input
            type="text"
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="e.g., Sunday afternoon"
            required
          />
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
          <label htmlFor="preferences">✨ Preferences (optional)</label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            placeholder="e.g., indoor, educational, budget-friendly"
            rows="3"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">
            🔍 Search Activities
          </button>
          <button type="button" className="btn-secondary" onClick={onClear}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
