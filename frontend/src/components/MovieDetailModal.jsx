import React, { useEffect, useState } from 'react';
import WatchPlatforms from './WatchPlatforms';
import styles from './MovieDetailModal.module.css';

const MovieDetailModal = ({ movie, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movie && movie.id) {
      fetchMovieDetails();
    }
  }, [movie]);

  const fetchMovieDetails = async () => {
    try {
      const mediaType = movie.media_type || 'movie';
      const url = `https://api.themoviedb.org/3/${mediaType}/${movie.id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!movie) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        
        <div className={styles.content}>
          {/* Movie Poster */}
          <div className={styles.poster}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title || movie.name}
            />
          </div>

          {/* Movie Info */}
          <div className={styles.info}>
            <h2>{movie.title || movie.name}</h2>
            <div className={styles.meta}>
              <span>⭐ {movie.vote_average?.toFixed(1)}/10</span>
              <span>📅 {movie.release_date || movie.first_air_date}</span>
            </div>
            <p className={styles.overview}>{movie.overview}</p>

            {/* ✅ WHERE TO WATCH - ADDED HERE */}
            <WatchPlatforms 
              mediaType={movie.media_type || 'movie'}
              id={movie.id}
              title={movie.title || movie.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;