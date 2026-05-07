import { useState, useEffect } from 'react';

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

  const loadAnalytics = () => {
    // Load notes from localStorage
    const notes = JSON.parse(localStorage.getItem('moviemate_movie_notes') || '[]');
    const recentlyViewed = JSON.parse(localStorage.getItem('moviemate_recently_viewed') || '[]');
    
    // Basic stats
    const totalMovies = notes.length;
    const totalNotes = notes.filter(n => n.note && n.note.trim().length > 0).length;
    const ratedMovies = notes.filter(n => n.rating && n.rating > 0);
    const totalRatings = ratedMovies.length;
    const avgRating = ratedMovies.length > 0 
      ? (ratedMovies.reduce((sum, n) => sum + n.rating, 0) / ratedMovies.length).toFixed(1)
      : 0;
    const favoriteCount = notes.filter(n => n.isFavorite).length;
    
    // Rating distribution
    const ratingsDistribution = {};
    for (let i = 1; i <= 10; i++) {
      ratingsDistribution[i] = notes.filter(n => n.rating === i).length;
    }
    
    // Top rated movies
    const topRatedMovies = [...notes]
      .filter(n => n.rating && n.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
    
    // Monthly activity
    const monthlyActivity = {};
    notes.forEach(note => {
      if (note.updatedAt) {
        const month = new Date(note.updatedAt).toLocaleString('default', { month: 'short' });
        monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
      }
    });
    
    // Genre distribution
    const watchTimeByGenre = {
      'Action': 0, 'Comedy': 0, 'Drama': 0, 'Sci-Fi': 0,
      'Horror': 0, 'Romance': 0, 'Thriller': 0
    };
    
    notes.forEach(note => {
      const title = (note.title || '').toLowerCase();
      if (title.includes('action') || title.includes('avengers') || title.includes('john wick') || title.includes('mission')) {
        watchTimeByGenre['Action'] += 1;
      } else if (title.includes('comedy') || title.includes('funny') || title.includes('deadpool') || title.includes('jumanji')) {
        watchTimeByGenre['Comedy'] += 1;
      } else if (title.includes('drama') || title.includes('inception') || title.includes('shawshank') || title.includes('green book')) {
        watchTimeByGenre['Drama'] += 1;
      } else if (title.includes('sci-fi') || title.includes('interstellar') || title.includes('dune') || title.includes('space')) {
        watchTimeByGenre['Sci-Fi'] += 1;
      } else if (title.includes('horror') || title.includes('conjuring') || title.includes('it')) {
        watchTimeByGenre['Horror'] += 1;
      } else if (title.includes('romance') || title.includes('love') || title.includes('notebook') || title.includes('titanic')) {
        watchTimeByGenre['Romance'] += 1;
      } else if (title.includes('thriller') || title.includes('mystery') || title.includes('gone') || title.includes('parasite')) {
        watchTimeByGenre['Thriller'] += 1;
      }
    });
    
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
    const recommendations = generateRecommendations(notes, favoriteGenre);
    
    setAnalytics({
      totalMovies, totalRatings, totalNotes, averageRating: avgRating,
      favoriteGenre, mostActiveDay, watchTimeByGenre, ratingsDistribution,
      monthlyActivity: sortedMonthlyActivity, topRatedMovies, favoriteCount,
      recommendations: recommendations,
      recommendedMovies: recommendations.slice(0, 8)
    });
  };

  // Generate personalized recommendations based on user's ratings
  const generateRecommendations = (notes, favoriteGenre) => {
    const recommendations = [];
    const watchedIds = notes.map(n => n.mediaId);
    
    // Get user's high-rated movies (7+)
    const highRatedMovies = notes.filter(n => n.rating && n.rating >= 7);
    
    // Movie database for recommendations
    const movieDB = [
      { id: 27205, title: 'Inception', year: 2010, rating: 8.8, genre: 'Sci-Fi', poster: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', reason: 'Mind-bending thriller' },
      { id: 157336, title: 'Interstellar', year: 2014, rating: 8.6, genre: 'Sci-Fi', poster: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', reason: 'Space epic' },
      { id: 155, title: 'The Dark Knight', year: 2008, rating: 9.0, genre: 'Action', poster: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', reason: 'Superhero masterpiece' },
      { id: 299534, title: 'Avengers: Endgame', year: 2019, rating: 8.4, genre: 'Action', poster: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', reason: 'Epic conclusion' },
      { id: 496243, title: 'Parasite', year: 2019, rating: 8.6, genre: 'Thriller', poster: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', reason: 'Oscar winner' },
      { id: 278, title: 'The Shawshank Redemption', year: 1994, rating: 9.3, genre: 'Drama', poster: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', reason: 'Timeless classic' },
      { id: 293660, title: 'Deadpool', year: 2016, rating: 8.0, genre: 'Comedy', poster: '/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg', reason: 'Hilarious action' },
      { id: 372058, title: 'Your Name', year: 2016, rating: 8.4, genre: 'Romance', poster: '/xq1Ufd62eLGJezbKJsnEnDdqZEb.jpg', reason: 'Beautiful anime' },
      { id: 335983, title: 'Venom', year: 2018, rating: 6.7, genre: 'Action', poster: '/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg', reason: 'Anti-hero action' },
      { id: 324857, title: 'Spider-Man: Into the Spider-Verse', year: 2018, rating: 8.4, genre: 'Animation', poster: '/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg', reason: 'Groundbreaking animation' },
      { id: 49026, title: 'The Dark Knight Rises', year: 2012, rating: 8.4, genre: 'Action', poster: '/dN0nSNi4Rn3DzVF7o2iB6bNj7oo.jpg', reason: 'Epic finale' },
      { id: 118340, title: 'Guardians of the Galaxy', year: 2014, rating: 8.0, genre: 'Action', poster: '/r7vmZjiyZw9rpJMQJdXpjgiNEWk.jpg', reason: 'Fun space adventure' },
      { id: 244786, title: 'Whiplash', year: 2014, rating: 8.5, genre: 'Drama', poster: '/6bbZ6XyvgfiUObxK2DzL1KvZcFY.jpg', reason: 'Intense drama' },
      { id: 68721, title: 'Iron Man 3', year: 2013, rating: 7.1, genre: 'Action', poster: '/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg', reason: 'Action-packed' }
    ];
    
    // Score each movie based on user preferences
    const scoredMovies = movieDB.map(movie => {
      let score = 0;
      
      // Score based on genre preference
      if (movie.genre === favoriteGenre) score += 10;
      
      // Score based on high-rated movies
      highRatedMovies.forEach(rated => {
        const ratedTitle = (rated.title || '').toLowerCase();
        const movieTitle = movie.title.toLowerCase();
        
        // Similar genre
        if (rated.title && movie.genre === favoriteGenre) score += 5;
        
        // Similar movies
        if ((ratedTitle.includes('inception') && movieTitle.includes('interstellar')) ||
            (ratedTitle.includes('dark knight') && movieTitle.includes('dark knight rises'))) {
          score += 15;
        }
      });
      
      // Score based on TMDB rating
      score += movie.rating * 2;
      
      // Penalize if already watched
      if (watchedIds.includes(movie.id)) score = -1;
      
      return { ...movie, score };
    });
    
    // Filter and sort
    const filtered = scoredMovies.filter(m => m.score > 0 && !watchedIds.includes(m.id));
    const sorted = filtered.sort((a, b) => b.score - a.score);
    
    // Add personalized reasons
    return sorted.slice(0, 12).map(movie => ({
      ...movie,
      reason: getRecommendationReason(movie, favoriteGenre, highRatedMovies)
    }));
  };
  
  const getRecommendationReason = (movie, favoriteGenre, highRatedMovies) => {
    if (movie.genre === favoriteGenre) {
      return `Because you love ${favoriteGenre} movies`;
    }
    
    const topMovie = highRatedMovies[0];
    if (topMovie && (movie.title.includes('Dark Knight') && topMovie.title?.includes('Dark Knight'))) {
      return `Similar to ${topMovie.title}`;
    }
    
    return `Top rated ${movie.genre} movie`;
  };

  return analytics;
};