import { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';
import './App.css';

const API_URL = 'http://localhost:3001';

// Get next Saturday as default date
const getNextSaturday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSaturday);
  return saturday.toISOString().split('T')[0];
};

const initialFormData = {
  eventType: 'activity',  // 'activity' or 'dining'
  city: '',
  kidAges: '',
  date: getNextSaturday(),
  timeOfDay: 'afternoon',
  maxDistance: 10,
  preferences: ''
};

function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date for display (e.g., "Saturday, December 28, 2024")
  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00'); // Add time to avoid timezone issues
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    // Combine date and time of day into availability string
    const formattedDate = formatDateForDisplay(formData.date);
    const availability = `${formattedDate}, ${formData.timeOfDay}`;

    try {
      const response = await fetch(`${API_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          availability  // Send combined date + time
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch activities');
      }

      setActivities(data.activities);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message || 'Failed to get recommendations. Please try again.');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setActivities([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">🎯</div>
          <div className="header-text">
            <h1>Family Activity Finder</h1>
            <p>Discover perfect weekend activities for your family</p>
          </div>
        </div>
        {hasSearched && (
          <button className="new-search-link" onClick={handleClear}>
            + New Search
          </button>
        )}
      </header>

      <main className="main-content">
        <div className="form-column">
          <SearchForm
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
            isLoading={isLoading}
          />
        </div>

        <div className="results-column">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <h3>{formData.eventType === 'dining' ? 'Finding restaurants...' : 'Finding activities...'}</h3>
              <p>Searching for {formData.eventType === 'dining' ? 'unique dining spots' : `${formData.timeOfDay} events`} on {formatDateForDisplay(formData.date)} near {formData.city}</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="btn-primary" onClick={handleSubmit}>
                Try Again
              </button>
            </div>
          ) : hasSearched && activities.length > 0 ? (
            <ResultsList activities={activities} />
          ) : hasSearched && activities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No {formData.eventType === 'dining' ? 'restaurants' : 'activities'} found</h3>
              <p>Try adjusting your search criteria or expanding your distance.</p>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">{formData.eventType === 'dining' ? '🍽️' : '🎪'}</div>
              <h3>Ready to explore?</h3>
              <p>Fill in the form and click "{formData.eventType === 'dining' ? 'Search Restaurants' : 'Search Activities'}" to discover {formData.eventType === 'dining' ? 'unique local restaurants' : 'family-friendly activities'} near you.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
