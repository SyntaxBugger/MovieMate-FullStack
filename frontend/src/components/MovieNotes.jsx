import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import styles from './MovieNotes.module.css';

const MovieNotes = ({ movie, onNoteSaved }) => {
  const [rating, setRating] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load existing note when movie changes
  useEffect(() => {
    if (movie && movie.existingNote) {
      setRating(movie.existingNote.rating);
      setNoteText(movie.existingNote.note || '');
      setIsFavorite(movie.existingNote.isFavorite || false);
      setIsEditing(!!(movie.existingNote.note || movie.existingNote.rating));
    } else {
      setRating(null);
      setNoteText('');
      setIsFavorite(false);
      setIsEditing(false);
    }
  }, [movie]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // Auto-save when rating is clicked
    if (movie.onSave) {
      movie.onSave(movie.id, movie.mediaType, { 
        rating: newRating, 
        note: noteText, 
        isFavorite 
      });
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleSaveNote = () => {
    if (movie.onSave) {
      movie.onSave(movie.id, movie.mediaType, { 
        rating, 
        note: noteText, 
        isFavorite 
      });
    }
    setIsEditing(true);
    setShowSuccess(true);
    if (onNoteSaved) onNoteSaved();
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleDeleteNote = () => {
    setRating(null);
    setNoteText('');
    setIsFavorite(false);
    setIsEditing(false);
    
    if (movie.onDelete) {
      movie.onDelete(movie.id, movie.mediaType);
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleToggleFavorite = () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    if (movie.onSave) {
      movie.onSave(movie.id, movie.mediaType, { 
        rating, 
        note: noteText, 
        isFavorite: newFavorite 
      });
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className={styles.notesContainer}>
      <div className={styles.header}>
        <h3>
          <i className="fas fa-pen"></i>
          My Notes & Rating
        </h3>
        {!isEditing && !noteText && !rating && (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
            <i className="fas fa-plus"></i> Add Note
          </button>
        )}
        {(isEditing || noteText || rating) && (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
            <i className="fas fa-edit"></i> Edit Note
          </button>
        )}
      </div>

      {/* Rating Section */}
      <div className={styles.ratingSection}>
        <div className={styles.ratingLabel}>
          <i className="fas fa-star"></i>
          <span>Your Rating</span>
        </div>
        <RatingStars 
          rating={rating} 
          onRatingChange={handleRatingChange}
          size="medium"
        />
        {rating && <span className={styles.ratingValue}>{rating}/10</span>}
      </div>

      {/* Favorite Section */}
      <div className={styles.favoriteSection}>
        <button 
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
          onClick={handleToggleFavorite}
        >
          <i className={`fas ${isFavorite ? 'fa-heart' : 'fa-heart'}`}></i>
          {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
        </button>
      </div>

      {/* Note Section - Always show if editing OR has existing note */}
      {(isEditing || noteText) && (
        <div className={styles.noteSection}>
          <label>
            <i className="fas fa-sticky-note"></i>
            Personal Notes
          </label>
          <textarea
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Write your personal thoughts about this movie..."
            className={styles.noteTextarea}
            rows={4}
            autoFocus={isEditing && !noteText}
          />
          <div className={styles.noteActions}>
            <button className={styles.saveBtn} onClick={handleSaveNote}>
              <i className="fas fa-save"></i> Save Note
            </button>
            {(noteText || rating) && (
              <button className={styles.deleteBtn} onClick={handleDeleteNote}>
                <i className="fas fa-trash"></i> Delete All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Show existing note preview when not editing */}
      {!isEditing && noteText && (
        <div className={styles.notePreview}>
          <label>
            <i className="fas fa-sticky-note"></i>
            Your Note:
          </label>
          <p>{noteText}</p>
          <button className={styles.editNoteBtn} onClick={() => setIsEditing(true)}>
            <i className="fas fa-edit"></i> Edit Note
          </button>
        </div>
      )}

      {showSuccess && (
        <div className={styles.successMessage}>
          <i className="fas fa-check-circle"></i>
          Saved successfully!
        </div>
      )}
    </div>
  );
};

export default MovieNotes;