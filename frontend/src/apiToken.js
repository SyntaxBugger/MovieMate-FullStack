// Read token from .env file
export const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

// Debug log (remove after testing)
console.log('🔑 API Token loaded:', API_TOKEN ? '✅ Yes' : '❌ No');
console.log('🔑 Token length:', API_TOKEN?.length || 0);