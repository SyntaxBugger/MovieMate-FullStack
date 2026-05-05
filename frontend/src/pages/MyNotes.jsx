import React, { useState, useEffect } from 'react';
import { useMovieNotes } from '../hooks/useMovieNotes';
import styles from './MyNotes.module.css';

const MyNotes = ({ onOpen }) => {
  const { notes, deleteNote, getFavorites, getRatedMovies } = useMovieNotes();
  const [activeTab, setActiveTab] = useState('all');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredNotes(notes);
    } else if (activeTab === 'favorites') {
      setFilteredNotes(getFavorites());
    } else if (activeTab === 'rated') {
      setFilteredNotes(getRatedMovies());
    }
  }, [notes, activeTab, getFavorites, getRatedMovies]);

  const handleDelete = (mediaId, mediaType) => {
    if (window.confirm('Delete this note?')) {
      deleteNote(mediaId, mediaType);
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(10 - rating);
  };

  if (notes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <i className="fas fa-sticky-note"></i>
        <h2>No Notes Yet</h2>
        <p>Add notes and ratings to movies you've watched!</p>
        <button onClick={() => window.history.back()} className={styles.backBtn}>
          Browse Movies
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <i className="fas fa-pen"></i>
          My Notes & Ratings
        </h1>
        <div className={styles.stats}>
          <span>{notes.length} Total Notes</span>
          <span>{getFavorites().length} Favorites</span>
          <span>{getRatedMovies().length} Rated</span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Notes ({notes.length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'favorites' ? styles.active : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites ({getFavorites().length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'rated' ? styles.active : ''}`}
          onClick={() => setActiveTab('rated')}
        >
          Rated ({getRatedMovies().length})
        </button>
      </div>

      <div className={styles.notesGrid}>
        {filteredNotes.map((note) => (
          <div key={`${note.mediaId}-${note.mediaType}`} className={styles.noteCard}>
            <div className={styles.poster}>
              {note.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w200${note.poster_path}`}
                  alt={note.title}
                  onClick={() => onOpen({ id: note.mediaId, media_type: note.mediaType, title: note.title })}
                />
              ) : (
                <div className={styles.posterPlaceholder}>
                  <i className="fas fa-film"></i>
                </div>
              )}
            </div>
            
            <div className={styles.noteContent}>
              <h3 onClick={() => onOpen({ id: note.mediaId, media_type: note.mediaType, title: note.title })}>
                {note.title || `Media ID: ${note.mediaId}`}
              </h3>
              
              {note.rating && (
                <div className={styles.rating}>
                  <span className={styles.stars}>{getRatingStars(note.rating)}</span>
                  <span className={styles.ratingValue}>{note.rating}/10</span>
                </div>
              )}
              
              {note.note && (
                <p className={styles.note}>{note.note}</p>
              )}
              
              {note.isFavorite && (
                <div className={styles.favoriteBadge}>
                  <i className="fas fa-heart"></i> Favorite
                </div>
              )}
              
              <div className={styles.noteMeta}>
                <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                <button 
                  className={styles.deleteNoteBtn}
                  onClick={() => handleDelete(note.mediaId, note.mediaType)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNotes;