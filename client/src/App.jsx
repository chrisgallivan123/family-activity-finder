import { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';
import './App.css';

const initialFormData = {
  city: '',
  kidAges: '',
  availability: '',
  maxDistance: 10,
  preferences: ''
};

function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [showResults, setShowResults] = useState(false);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setShowResults(false);
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
        {showResults && (
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
          />
        </div>

        <div className="results-column">
          {showResults ? (
            <ResultsList />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎪</div>
              <h3>Ready to explore?</h3>
              <p>Fill in the form and click "Search Activities" to discover family-friendly activities near you.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
