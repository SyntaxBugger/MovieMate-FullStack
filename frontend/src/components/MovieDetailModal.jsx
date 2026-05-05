import React, { useEffect, useState } from 'react';
import WatchPlatforms from './WatchPlatforms';
import MovieNotes from './MovieNotes';  // ✅ ADD THIS IMPORT
import styles from './MovieDetailModal.module.css';
import { API_TOKEN } from '../apiToken';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useMovieNotes } from '../hooks/useMovieNotes';  // ✅ ADD THIS IMPORT

const MovieDetailModal = ({ movie, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { getNote, saveNote, deleteNote } = useMovieNotes();  // ✅ ADD THIS

  // Get existing note for this movie
  const existingNote = getNote(movie?.id, movie?.media_type || 'movie');

  useEffect(() => {
    if (movie && movie.id) {
      console.log("✅ Modal - Saving to recently viewed:", movie.title || movie.name);
      
      addToRecentlyViewed({
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        media_type: movie.media_type || 'movie',
        vote_average: movie.vote_average
      });
    }
  }, [movie, addToRecentlyViewed]);

  useEffect(() => {
    if (movie && movie.id) {
      fetchMovieDetails();
    }
  }, [movie]);

  const fetchMovieDetails = async () => {
    try {
      const mediaType = movie.media_type || 'movie';
      const url = `https://api.themoviedb.org/3/${mediaType}/${movie.id}`;
      
      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`TMDB Error: ${response.status}`);
      }
      
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle save note
  const handleSaveNote = (mediaId, mediaType, noteData) => {
    const title = movieDetails?.title || movieDetails?.name || movie.title || movie.name;
    const posterPath = movieDetails?.poster_path || movie.poster_path;
    
    saveNote(
      mediaId, 
      mediaType, 
      title, 
      posterPath, 
      noteData.rating, 
      noteData.note, 
      noteData.isFavorite
    );
  };

  // ✅ Handle delete note
  const handleDeleteNote = (mediaId, mediaType) => {
    deleteNote(mediaId, mediaType);
  };

  if (!movie) return null;

  const displayMovie = movieDetails || movie;
  const mediaType = movie.media_type || 'movie';
  const title = displayMovie.title || displayMovie.name;
  const posterPath = displayMovie.poster_path;
  const rating = displayMovie.vote_average;
  const releaseDate = displayMovie.release_date || displayMovie.first_air_date;
  const overview = displayMovie.overview;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        
        <div className={styles.content}>
          <div className={styles.poster}>
            {posterPath ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${posterPath}`} 
                alt={title}
              />
            ) : (
              <div className={styles.posterPlaceholder}>
                <i className="fas fa-film"></i>
              </div>
            )}
          </div>

          <div className={styles.info}>
            <h2>{title}</h2>
            <div className={styles.meta}>
              {rating && <span>⭐ {rating.toFixed(1)}/10</span>}
              {releaseDate && <span>📅 {releaseDate}</span>}
            </div>
            <p className={styles.overview}>{overview || "No overview available."}</p>

            {loading && (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading details...</p>
              </div>
            )}

            {/* WHERE TO WATCH */}
            <WatchPlatforms 
              mediaType={mediaType}
              id={movie.id}
              title={title}
            />

            {/* ✅ MOVIE NOTES & RATINGS - ADD THIS HERE */}
            <MovieNotes 
              movie={{
                id: movie.id,
                mediaType: mediaType,
                title: title,
                poster_path: posterPath,
                existingNote: existingNote,
                onSave: handleSaveNote,
                onDelete: handleDeleteNote
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;