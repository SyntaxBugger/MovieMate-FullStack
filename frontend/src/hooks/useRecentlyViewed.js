import { useState, useEffect } from 'react';

const STORAGE_KEY = 'moviemate_recently_viewed';
const MAX_ITEMS = 12;

export const useRecentlyViewed = () => {
  const [recentItems, setRecentItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentItems(parsed);
        console.log('📀 Loaded from localStorage:', parsed.length, 'items');
      } catch (error) {
        console.error('Error loading recently viewed:', error);
        setRecentItems([]);
      }
    }
  }, []);

  // Add item to recently viewed
  const addToRecentlyViewed = (item) => {
    if (!item || !item.id) {
      console.log('❌ Cannot add: No item or id');
      return;
    }

    console.log('📝 Adding to recently viewed:', item.title || item.name);

    setRecentItems(prev => {
      // Remove if already exists
      const filtered = prev.filter(i => i.id !== item.id);
      
      // Create new item with timestamp
      const newItem = {
        id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path,
        media_type: item.media_type || 'movie',
        vote_average: item.vote_average,
        timestamp: Date.now()
      };
      
      // Add to beginning
      const newList = [newItem, ...filtered];
      
      // Keep only MAX_ITEMS
      const trimmed = newList.slice(0, MAX_ITEMS);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      console.log('💾 Saved to localStorage:', trimmed.length, 'items');
      
      return trimmed;
    });
  };

  // Clear all recently viewed
  const clearRecentlyViewed = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentItems([]);
    console.log('🗑️ Cleared all recently viewed');
  };

  // Remove single item
  const removeFromRecentlyViewed = (id) => {
    const newList = recentItems.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    setRecentItems(newList);
    console.log('❌ Removed item with id:', id);
  };

  // Get recently viewed count
  const getRecentCount = () => {
    return recentItems.length;
  };

  return {
    recentItems,
    addToRecentlyViewed,
    clearRecentlyViewed,
    removeFromRecentlyViewed,
    getRecentCount
  };
};