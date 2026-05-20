import { useState, useEffect } from 'react';
import { getHistory, getFavorites } from '../api/api';
import {
  getMovieDetails,
  getTvDetails,
  getRecommendations
} from '../api/tmdb';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalMovies: 0,
    totalRatings: 0,
    averageRating: 0,
    favoriteGenre: 'N/A',
    mostActiveDay: 'N/A',
    watchTimeByGenre: {},
    ratingsDistribution: {},
    monthlyActivity: {},
    topRatedMovies: [],
    favoriteCount: 0,
    totalNotes: 0,
    recommendations: [],
    recommendedMovies: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    // Load notes from localStorage
    const history = await getHistory();
const favorites = await getFavorites();

// Normalize backend data
const notes = history.map(item => ({
  mediaId: item.movieId,
  mediaType: item.media_type,
  title: item.title,
  poster_path: item.poster_path,
  rating: item.rating || 0,
  note: item.notes || '',
  updatedAt: item.updatedAt,
  timestamp: item.createdAt
}));

const recentlyViewed = notes;

// Favorite IDs
const favoriteIds = favorites.map(
  f => f.movieId || f.id
);
const watchTimeByGenre = {};

for (const note of notes) {

  try {

    let details;

    if (note.mediaType === 'tv') {
      details = await getTvDetails(note.mediaId);
    } else {
      details = await getMovieDetails(note.mediaId);
    }

    const genres = details.genres || [];

    // Save genres into note
    note.genres = genres;

    genres.forEach(g => {

      watchTimeByGenre[g.name] =
        (watchTimeByGenre[g.name] || 0) + 1;

    });

  } catch (err) {

    console.error(
      `Genre fetch failed for ${note.title}`,
      err
    );
  }
}
    
    // Basic stats
   const completedMovies =
  history.filter(
    m =>
      m.watchStatus === 'completed' ||
      !m.watchStatus
  );

const totalMovies =
  completedMovies.length;
    const totalNotes = notes.filter(n => n.note && n.note.trim().length > 0).length;
    const ratedMovies = notes.filter(n => n.rating && n.rating > 0);
    const totalRatings = ratedMovies.length;
    const avgRating = ratedMovies.length > 0 
      ? (ratedMovies.reduce((sum, n) => sum + n.rating, 0) / ratedMovies.length).toFixed(1)
      : 0;
  const favoriteCount = favorites.length;
    
    // Rating distribution
    const ratingsDistribution = {};
    for (let i = 1; i <= 10; i++) {
      ratingsDistribution[i] = notes.filter(n => n.rating === i).length;
    }
    
    // Top rated movies
    const topRatedMovies = [...notes]
      .filter(n => n.rating && n.rating > 0)
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 5)
  .map(movie => ({
    ...movie,
    isFavorite: favoriteIds.includes(movie.mediaId)
  }));  
    
    // Monthly activity
    const monthlyActivity = {};
    notes.forEach(note => {
      if (note.updatedAt) {
        const month = new Date(note.updatedAt).toLocaleString('default', { month: 'short' });
        monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
      }
    });
    
    // Genre distribution
    
    // Find favorite genre
    let favoriteGenre = 'Action';
    let maxGenre = 0;
    Object.entries(watchTimeByGenre).forEach(([genre, count]) => {
      if (count > maxGenre) { maxGenre = count; favoriteGenre = genre; }
    });
    
    // Most active day
    const dayActivity = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
    recentlyViewed.forEach(item => {
      if (item.timestamp) {
        const day = new Date(item.timestamp).toLocaleString('default', { weekday: 'long' });
        dayActivity[day] = (dayActivity[day] || 0) + 1;
      }
    });
    
    let mostActiveDay = 'Saturday';
    let maxDay = 0;
    Object.entries(dayActivity).forEach(([day, count]) => {
      if (count > maxDay) { maxDay = count; mostActiveDay = day; }
    });
    
    // Sort months
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedMonthlyActivity = {};
    monthOrder.forEach(month => {
      if (monthlyActivity[month]) { sortedMonthlyActivity[month] = monthlyActivity[month]; }
    });
    
    // Generate recommendations
    const recommendations =
  await generateRecommendations(
    notes,
    favoriteIds
  );
    console.log("Analytics Notes:", notes);
console.log("Favorites:", favorites);
    
    setAnalytics({
      totalMovies, totalRatings, totalNotes, averageRating: avgRating,
      favoriteGenre, mostActiveDay, watchTimeByGenre, ratingsDistribution,
      monthlyActivity: sortedMonthlyActivity, topRatedMovies, favoriteCount,
      recommendations: recommendations,
      recommendedMovies: recommendations.slice(0, 8)
    });
  };

  // Generate personalized recommendations based on user's ratings
  const generateRecommendations = async (
  notes,
  favoriteIds = []
) => {

  try {

    const highRatedMovies = notes
      .filter(n => n.rating >= 7)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    if (highRatedMovies.length === 0) {
      return [];
    }

    const watchedIds = notes.map(
      n => n.mediaId
    );

    const recommendationMap = new Map();

    for (const movie of highRatedMovies) {

      const recs =
        await getRecommendations(
          movie.mediaId,
          movie.mediaType || 'movie'
        );

      for (const rec of (
        recs.results || []
      )) {

        if (
          watchedIds.includes(rec.id)
        ) continue;

        let score =
          movie.rating || 1;

        // Favorite boost
        if (
          favoriteIds.includes(
            movie.mediaId
          )
        ) {
          score += 10;
        }

        // Recency boost
        const daysAgo =
          (
            Date.now() -
            new Date(movie.updatedAt)
          ) /
          (1000 * 60 * 60 * 24);

        const recencyBoost =
          Math.max(
            1,
            5 - daysAgo / 30
          );

        score += recencyBoost;

        // Genre boost
        const recGenres =
          rec.genre_ids || [];

        if (movie.genres) {

          const matchingGenres =
            movie.genres.filter(g =>
              recGenres.includes(g.id)
            ).length;

          score += matchingGenres * 2;
        }

        if (
          !recommendationMap.has(
            rec.id
          )
        ) {

          recommendationMap.set(
            rec.id,
            {
              id: rec.id,

              title:
                rec.title ||
                rec.name,

              year:
                (
                  rec.release_date ||
                  rec.first_air_date ||
                  ''
                ).slice(0, 4),

              rating:
                rec.vote_average?.toFixed(
                  1
                ),

              poster:
                rec.poster_path,

              score,

              reasons: [
                movie.title
              ]
            }
          );

        } else {

          const existing =
            recommendationMap.get(
              rec.id
            );

          existing.score += score;

          if (
            !existing.reasons.includes(
              movie.title
            )
          ) {
            existing.reasons.push(
              movie.title
            );
          }

          recommendationMap.set(
            rec.id,
            existing
          );
        }
      }
    }

    return Array.from(
      recommendationMap.values()
    )
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 12)
      .map(movie => ({
        ...movie,

        reason:
          movie.reasons.length > 1
            ? `Because you liked ${movie.reasons.slice(0, 2).join(' & ')}`
            : `Because you liked ${movie.reasons[0]}`
      }));

  } catch (err) {

    console.error(
      "Recommendation error:",
      err
    );

    return [];
  }
};
  


  return analytics;
};