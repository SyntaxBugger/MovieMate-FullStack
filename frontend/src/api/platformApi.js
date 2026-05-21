import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const rawSocketUrl = import.meta.env.VITE_SOCKET_URL;
const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

const API_BASE_URL = rawApiUrl || (rawSocketUrl ? `${rawSocketUrl.replace(/\/$/, '')}/api` : DEFAULT_API_BASE_URL);

export const platformApi = {
  // Get watch providers for a movie or TV show
  getWatchProviders: async (mediaType, id, country = 'IN') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/platforms/${mediaType}/${id}`, {
        params: { country }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching watch providers:', error);
      return null;
    }
  },
  
  // Get available countries
  getAvailableCountries: async (mediaType, id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/platforms/${mediaType}/${id}/countries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return null;
    }
  }
};