import React, { useEffect, useState } from 'react';
import WatchPlatforms from './WatchPlatforms';
import styles from './MovieDetailModal.module.css';
import { API_TOKEN } from '../apiToken';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'; // ✅ ADD THIS

const MovieDetailModal = ({ movie, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ ADD THIS - Recently Viewed hook
  const { addToRecentlyViewed } = useRecentlyViewed();

  // ✅ ADD THIS - Track when movie is viewed
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

  if (!movie) return null;

  const displayMovie = movieDetails || movie;
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

            <WatchPlatforms 
              mediaType={movie.media_type || 'movie'}
              id={movie.id}
              title={title}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;