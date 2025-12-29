import { useState } from 'react';

function FavoriteDishes({ isOpen, onClose, dishes, onAddDish, onRemoveDish }) {
  const [newDish, setNewDish] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDish.trim()) {
      onAddDish(newDish);
      setNewDish('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content dishes-modal">
        <div className="modal-header">
          <h2>🍜 Favorite Dishes</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {dishes.length > 0 ? (
            <div className="dishes-list">
              {dishes.map((dish, index) => (
                <div key={index} className="dish-chip">
                  <span className="dish-name">{dish}</span>
                  <button
                    className="dish-remove"
                    onClick={() => onRemoveDish(dish)}
                    aria-label={`Remove ${dish}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-dishes">No favorite dishes yet. Add some below!</p>
          )}

          <div className="add-dish-form">
            <input
              type="text"
              value={newDish}
              onChange={(e) => setNewDish(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a dish (e.g., Pad Thai, Ramen)"
              className="dish-input"
            />
            <button
              className="btn-add-dish"
              onClick={handleSubmit}
              disabled={!newDish.trim()}
            >
              + Add
            </button>
          </div>

          <p className="dishes-help">
            We'll look for restaurants known for these dishes in future searches.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FavoriteDishes;
