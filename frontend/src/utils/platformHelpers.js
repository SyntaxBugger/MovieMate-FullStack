// Platform logo mapping (TMDB provider IDs to logo URLs)
export const getPlatformLogo = (logoPath) => {
  if (!logoPath) return 'https://via.placeholder.com/48x48?text=🎬';
  return `https://image.tmdb.org/t/p/original${logoPath}`;
};

// Provider type labels and icons
export const getProviderTypeInfo = (type) => {
  const types = {
    flatrate: { label: 'Subscription', icon: 'fa-tv', color: '#2ec4b6' },
    rent: { label: 'Rent', icon: 'fa-calendar-alt', color: '#ff9f1c' },
    buy: { label: 'Buy', icon: 'fa-shopping-cart', color: '#e63946' },
    ads: { label: 'Free with Ads', icon: 'fa-ad', color: '#6c757d' }
  };
  return types[type] || { label: type, icon: 'fa-play', color: '#2ec4b6' };
};

// Country names with flags
export const countryList = {
  'IN': { name: 'India', flag: '🇮🇳', code: 'IN' },
  'US': { name: 'United States', flag: '🇺🇸', code: 'US' },
  'GB': { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  'CA': { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  'AU': { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  'DE': { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  'FR': { name: 'France', flag: '🇫🇷', code: 'FR' },
  'JP': { name: 'Japan', flag: '🇯🇵', code: 'JP' },
  'KR': { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
  'BR': { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
  'MX': { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  'ES': { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  'IT': { name: 'Italy', flag: '🇮🇹', code: 'IT' }
};

export const getCountryInfo = (code) => {
  return countryList[code] || { name: code, flag: '🌍', code };
};

// Group providers by type
export const groupProviders = (providers) => {
  if (!providers) return { flatrate: [], rent: [], buy: [], ads: [] };
  
  return {
    flatrate: providers.flatrate || [],
    rent: providers.rent || [],
    buy: providers.buy || [],
    ads: providers.ads || []
  };
};

// Check if any providers exist
export const hasAnyProviders = (providers) => {
  if (!providers) return false;
  return (providers.flatrate?.length > 0 || 
          providers.rent?.length > 0 || 
          providers.buy?.length > 0 || 
          providers.ads?.length > 0);
};

// Generate streaming link (simplified - you can add actual URLs)
export const getStreamingLink = (providerName, mediaType, id) => {
  const name = providerName.toLowerCase();
  
  // Common platform URLs (you can expand this)
  const platformUrls = {
    'netflix': `https://www.netflix.com/search?q=`,
    'prime video': `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=`,
    'amazon prime': `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=`,
    'disney+': `https://www.disneyplus.com/search/`,
    'hotstar': `https://www.hotstar.com/in/search?q=`,
    'jio cinema': `https://www.jiocinema.com/search?query=`,
    'hbo max': `https://www.max.com/search?q=`,
    'apple tv+': `https://tv.apple.com/search?q=`,
    'youtube': `https://www.youtube.com/results?search_query=`,
    'google play': `https://play.google.com/store/search?q=`,
    'voot': `https://www.voot.com/search/`,
    'zee5': `https://www.zee5.com/search?q=`,
    'sonyliv': `https://www.sonyliv.com/search/`
  };
  
  for (const [key, baseUrl] of Object.entries(platformUrls)) {
    if (name.includes(key)) {
      return `${baseUrl}${encodeURIComponent(id)}`;
    }
  }
  
  // Default to Google search
  return `https://www.google.com/search?q=watch+${mediaType}+${id}`;
};