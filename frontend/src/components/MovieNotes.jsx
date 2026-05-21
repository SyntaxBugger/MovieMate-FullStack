import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import styles from './MovieNotes.module.css';
import { useNotifications } from '../hooks/useNotifications';  // ✅ ADD THIS

const MovieNotes = ({ movie }) => {
  const [rating, setRating] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  const { addNotification } = useNotifications();  // ✅ ADD THIS

  // Load existing note when movie changes
  useEffect(() => {
    if (!movie) return;
    
    console.log('Loading note for movie:', movie.id);
    
    if (movie.existingNote) {
      setRating(movie.existingNote.rating);
      setNoteText(movie.existingNote.note || '');
      setShowEditor(!!(movie.existingNote.note || movie.existingNote.rating));
    } else {
      setRating(null);
      setNoteText('');
      setShowEditor(false);
    }
  }, [movie?.id]);

  // Save to localStorage
  
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    movie.onSave(
  movie.id,
  movie.mediaType,
  {
    rating: newRating,
    note: noteText,
    isFavorite
  }
);
    // ✅ ADD NOTIFICATION FOR RATING
    addNotification(
      'Movie Rated', 
      `You rated "${movie.title}" ${newRating}/10`, 
      'success'
    );
  };

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleSaveNote = () => {
    if (!noteText.trim() && !rating) {
      addNotification('Cannot Save', 'Please add a rating or write a note', 'warning');
      return;
    }
    movie.onSave(
  movie.id,
  movie.mediaType,
  {
    rating,
    note: noteText,
  }
);

setSaveStatus('✓ Saved!');
setTimeout(() => setSaveStatus(''), 2000);
   
    // ✅ ADD NOTIFICATION FOR SAVING NOTE
    addNotification(
      'Note Saved', 
      `Your note for "${movie.title}" has been saved!`, 
      'success'
    );
  };

  const handleDeleteNote = () => {
    if (window.confirm('Delete this note?')) {
      setRating(null);
      setNoteText('');

      setShowEditor(false);
      movie.onDelete(movie.id, movie.mediaType);
      // ✅ ADD NOTIFICATION FOR DELETING NOTE
      addNotification(
        'Note Deleted', 
        `Your note for "${movie.title}" has been deleted`, 
        'info'
      );
    }
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