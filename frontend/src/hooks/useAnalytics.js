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
    totalNotes: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    // Load notes from localStorage
    const notes = JSON.parse(localStorage.getItem('moviemate_movie_notes') || '[]');
    
    // Load recently viewed
    const recentlyViewed = JSON.parse(localStorage.getItem('moviemate_recently_viewed') || '[]');
    
    // Total movies with notes
    const totalMovies = notes.length;
    
    // Total notes with text
    const totalNotes = notes.filter(n => n.note && n.note.trim().length > 0).length;
    
    // Movies with ratings
    const ratedMovies = notes.filter(n => n.rating && n.rating > 0);
    const totalRatings = ratedMovies.length;
    
    // Average rating
    const avgRating = ratedMovies.length > 0 
      ? (ratedMovies.reduce((sum, n) => sum + n.rating, 0) / ratedMovies.length).toFixed(1)
      : 0;
    
    // Favorite count
    const favoriteCount = notes.filter(n => n.isFavorite).length;
    
    // Rating distribution (1-10)
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
    
    // Genre distribution (based on ratings)
    const watchTimeByGenre = {
      'Action': 0,
      'Comedy': 0,
      'Drama': 0,
      'Sci-Fi': 0,
      'Horror': 0,
      'Romance': 0,
      'Thriller': 0
    };
    
    notes.forEach(note => {
      const title = (note.title || '').toLowerCase();
      if (title.includes('action') || title.includes('avengers') || title.includes('mission') || title.includes('fast') || title.includes('john wick')) {
        watchTimeByGenre['Action'] += 1;
      } else if (title.includes('comedy') || title.includes('funny') || title.includes('jumanji') || title.includes('deadpool')) {
        watchTimeByGenre['Comedy'] += 1;
      } else if (title.includes('drama') || title.includes('inception') || title.includes('shawshank') || title.includes('green book')) {
        watchTimeByGenre['Drama'] += 1;
      } else if (title.includes('sci-fi') || title.includes('interstellar') || title.includes('space') || title.includes('star') || title.includes('dune')) {
        watchTimeByGenre['Sci-Fi'] += 1;
      } else if (title.includes('horror') || title.includes('conjuring') || title.includes('scary') || title.includes('it')) {
        watchTimeByGenre['Horror'] += 1;
      } else if (title.includes('romance') || title.includes('love') || title.includes('notebook') || title.includes('titanic')) {
        watchTimeByGenre['Romance'] += 1;
      } else if (title.includes('thriller') || title.includes('mystery') || title.includes('gone') || title.includes('fight club')) {
        watchTimeByGenre['Thriller'] += 1;
      }
    });
    
    // Find favorite genre
    let favoriteGenre = 'Action';
    let maxGenre = 0;
    Object.entries(watchTimeByGenre).forEach(([genre, count]) => {
      if (count > maxGenre) {
        maxGenre = count;
        favoriteGenre = genre;
      }
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
      if (count > maxDay) {
        maxDay = count;
        mostActiveDay = day;
      }
    });
    
    // Sort months
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedMonthlyActivity = {};
    monthOrder.forEach(month => {
      if (monthlyActivity[month]) {
        sortedMonthlyActivity[month] = monthlyActivity[month];
      }
    });
    
    setAnalytics({
      totalMovies,
      totalRatings,
      totalNotes,
      averageRating: avgRating,
      favoriteGenre,
      mostActiveDay,
      watchTimeByGenre,
      ratingsDistribution,
      monthlyActivity: sortedMonthlyActivity,
      topRatedMovies,
      favoriteCount
    });
  };

  return analytics;
};