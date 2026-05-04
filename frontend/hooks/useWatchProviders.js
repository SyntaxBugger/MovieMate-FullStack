import { useState, useEffect, useCallback } from 'react';
import { platformApi } from '../api/apis/platformApi';
import { groupProviders, hasAnyProviders } from '../src/utils/platformHelpers';

export const useWatchProviders = (mediaType, id, defaultCountry = 'IN') => {
  const [providers, setProviders] = useState({ flatrate: [], rent: [], buy: [], ads: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [fromCache, setFromCache] = useState(false);

  const fetchProviders = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await platformApi.getWatchProviders(mediaType, id, selectedCountry);
      
      if (data && data.success && data.results && data.results[selectedCountry]) {
        const providersData = data.results[selectedCountry];
        setProviders(groupProviders(providersData));
        setFromCache(data.fromCache || false);
      } else {
        setProviders({ flatrate: [], rent: [], buy: [], ads: [] });
      }
    } catch (err) {
      console.error('Error fetching watch providers:', err);
      setError('Failed to load streaming platforms');
    } finally {
      setLoading(false);
    }
  }, [mediaType, id, selectedCountry]);

  const fetchAvailableCountries = useCallback(async () => {
    try {
      const data = await platformApi.getAvailableCountries(mediaType, id);
      if (data && data.success && data.countries) {
        setAvailableCountries(data.countries);
      }
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  }, [mediaType, id]);

  useEffect(() => {
    fetchProviders();
    fetchAvailableCountries();
  }, [fetchProviders, fetchAvailableCountries]);

  const changeCountry = (country) => {
    setSelectedCountry(country);
  };

  const hasProviders = hasAnyProviders(providers);
  const hasSubscription = providers.flatrate.length > 0;
  const hasRent = providers.rent.length > 0;
  const hasBuy = providers.buy.length > 0;
  const hasAds = providers.ads.length > 0;

  return {
    providers,
    loading,
    error,
    selectedCountry,
    availableCountries,
    fromCache,
    changeCountry,
    hasProviders,
    hasSubscription,
    hasRent,
    hasBuy,
    hasAds
  };
};