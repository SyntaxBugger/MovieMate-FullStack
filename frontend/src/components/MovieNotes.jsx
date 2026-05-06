import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import styles from './MovieNotes.module.css';

const MovieNotes = ({ movie }) => {
  const [rating, setRating] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Load existing note when movie changes - FIXED: Added proper dependencies
  useEffect(() => {
    if (!movie) return;
    
    console.log('Loading note for movie:', movie.id);
    
    if (movie.existingNote) {
      setRating(movie.existingNote.rating);
      setNoteText(movie.existingNote.note || '');
      setIsFavorite(movie.existingNote.isFavorite || false);
      setShowEditor(!!(movie.existingNote.note || movie.existingNote.rating));
    } else {
      setRating(null);
      setNoteText('');
      setIsFavorite(false);
      setShowEditor(false);
    }
  }, [movie?.id]); // Only run when movie ID changes, not on every render

  // Save to localStorage
  const saveToLocalStorage = (newRating, newNote, newFavorite) => {
    try {
      const existingNotes = JSON.parse(localStorage.getItem('moviemate_movie_notes') || '[]');
      
      const filteredNotes = existingNotes.filter(
        n => !(n.mediaId === movie.id && n.mediaType === movie.mediaType)
      );
      
      const newNoteObj = {
        mediaId: movie.id,
        mediaType: movie.mediaType,
        title: movie.title,
        poster_path: movie.poster_path,
        rating: newRating,
        note: newNote,
        isFavorite: newFavorite,
        updatedAt: new Date().toISOString()
      };
      
      const updatedNotes = [newNoteObj, ...filteredNotes];
      localStorage.setItem('moviemate_movie_notes', JSON.stringify(updatedNotes));
      
      setSaveStatus('✓ Saved!');
      setTimeout(() => setSaveStatus(''), 2000);
      
      if (movie.onSave) {
        movie.onSave(movie.id, movie.mediaType, { rating: newRating, note: newNote, isFavorite: newFavorite });
      }
    } catch (error) {
      console.error('Error:', error);
      setSaveStatus('❌ Failed');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    saveToLocalStorage(newRating, noteText, isFavorite);
  };

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleSaveNote = () => {
    if (!noteText.trim() && !rating) {
      alert('Please add a rating or write a note');
      return;
    }
    saveToLocalStorage(rating, noteText, isFavorite);
  };

  const handleDeleteNote = () => {
    if (window.confirm('Delete this note?')) {
      setRating(null);
      setNoteText('');
      setIsFavorite(false);
      setShowEditor(false);
      saveToLocalStorage(null, '', false);
    }
  };

  const handleToggleFavorite = () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    saveToLocalStorage(rating, noteText, newFavorite);
  };

  return (
    <div className={styles.notesContainer}>
      <div className={styles.header}>
        <h3>
          <i className="fas fa-pen"></i>
          My Notes & Rating
        </h3>
        {!showEditor && !noteText && !rating && (
          <button className={styles.editBtn} onClick={() => setShowEditor(true)}>
            <i className="fas fa-plus"></i> Add Note
          </button>
        )}
        {(showEditor || noteText || rating) && !showEditor && (
          <button className={styles.editBtn} onClick={() => setShowEditor(true)}>
            <i className="fas fa-edit"></i> Edit Note
          </button>
        )}
      </div>

      {/* Rating Section */}
      <div className={styles.ratingSection}>
        <div className={styles.ratingLabel}>
          <i className="fas fa-star"></i>
          <span>Your Rating (Click on stars)</span>
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
          <i className="fas fa-heart"></i>
          {isFavorite ? ' Added to Favorites' : ' Add to Favorites'}
        </button>
      </div>

      {/* Textarea Section */}
      {showEditor && (
        <div className={styles.noteSection}>
          <label>
            <i className="fas fa-sticky-note"></i>
            Personal Notes
          </label>
          <textarea
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Write your thoughts about this movie..."
            className={styles.noteTextarea}
            rows={4}
            autoFocus
          />
          <div className={styles.noteActions}>
            <button className={styles.saveBtn} onClick={handleSaveNote}>
              <i className="fas fa-save"></i> Save Note
            </button>
            {(noteText || rating) && (
              <button className={styles.deleteBtn} onClick={handleDeleteNote}>
                <i className="fas fa-trash"></i> Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preview existing note */}
      {!showEditor && noteText && (
        <div className={styles.notePreview}>
          <label>
            <i className="fas fa-sticky-note"></i>
            Your Note:
          </label>
          <p>{noteText}</p>
        </div>
      )}

      {saveStatus && (
        <div className={saveStatus.includes('✓') ? styles.successMessage : styles.errorMessage}>
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default MovieNotes;