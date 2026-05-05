import React, { useState, useEffect } from 'react';
import PlatformCard from './PlatformCard';
import styles from './WatchPlatforms.module.css';
import { API_TOKEN } from '../apiToken';

// Country list with flags
const countryList = {
  'IN': { name: 'India', flag: '🇮🇳', code: 'IN' },
  'US': { name: 'United States', flag: '🇺🇸', code: 'US' },
  'GB': { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  'CA': { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  'AU': { name: 'Australia', flag: '🇦🇺', code: 'AU' }
};

// Helper functions
const getCountryInfo = (code) => {
  return countryList[code] || { name: code, flag: '🌍', code };
};

const groupProviders = (providers) => {
  if (!providers) return { flatrate: [], rent: [], buy: [], ads: [] };
  return {
    flatrate: providers.flatrate || [],
    rent: providers.rent || [],
    buy: providers.buy || [],
    ads: providers.ads || []
  };
};

const hasAnyProviders = (providers) => {
  if (!providers) return false;
  return (providers.flatrate?.length > 0 || 
          providers.rent?.length > 0 || 
          providers.buy?.length > 0 || 
          providers.ads?.length > 0);
};

const WatchPlatforms = ({ mediaType, id, title }) => {
  const [providers, setProviders] = useState({ flatrate: [], rent: [], buy: [], ads: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [availableCountries, setAvailableCountries] = useState(['IN', 'US', 'GB', 'CA', 'AU']);

  // Fetch watch providers using Bearer token (same as tmdb.js)
  const fetchWatchProviders = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `https://api.themoviedb.org/3/${mediaType}/${id}/watch/providers`;
      
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
      
      if (data.results && data.results[selectedCountry]) {
        const countryData = data.results[selectedCountry];
        setProviders(groupProviders(countryData));
        
        // Update available countries
        const countries = Object.keys(data.results);
        if (countries.length > 0) setAvailableCountries(countries);
      } else {
        setProviders({ flatrate: [], rent: [], buy: [], ads: [] });
      }
    } catch (err) {
      console.error('Error fetching watch providers:', err);
      setError('Failed to load streaming platforms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchProviders();
  }, [mediaType, id, selectedCountry]);

  const changeCountry = (country) => {
    setSelectedCountry(country);
  };

  const hasProviders = hasAnyProviders(providers);
  const hasSubscription = providers.flatrate?.length > 0;
  const hasRent = providers.rent?.length > 0;
  const hasBuy = providers.buy?.length > 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Checking where to watch...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!hasProviders) {
    return (
      <div className={styles.container}>
        <div className={styles.noProviders}>
          <i className="fas fa-film"></i>
          <h4>No streaming information available</h4>
          <p>"{title}" is not available for streaming in {getCountryInfo(selectedCountry).name}</p>
          <small>Try changing the region below</small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <i className="fas fa-play-circle"></i>
          <h3>Where to Watch</h3>
        </div>
        
        <div className={styles.countrySelector}>
          <label>
            <i className="fas fa-globe"></i>
            <select 
              value={selectedCountry} 
              onChange={(e) => changeCountry(e.target.value)}
              className={styles.countrySelect}
            >
              {availableCountries.map(country => (
                <option key={country} value={country}>
                  {getCountryInfo(country).flag} {getCountryInfo(country).name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {hasSubscription && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <i className="fas fa-tv"></i>
            <h4>Streaming (Subscription)</h4>
            <span className={styles.count}>({providers.flatrate.length})</span>
          </div>
          <div className={styles.providersGrid}>
            {providers.flatrate.map((provider, idx) => (
              <PlatformCard
                key={`${provider.provider_id}-${idx}`}
                provider={provider}
                type="flatrate"
                mediaType={mediaType}
                mediaId={id}
              />
            ))}
          </div>
        </div>
      )}

      {hasRent && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <i className="fas fa-calendar-alt"></i>
            <h4>Rent</h4>
            <span className={styles.count}>({providers.rent.length})</span>
          </div>
          <div className={styles.providersGrid}>
            {providers.rent.map((provider, idx) => (
              <PlatformCard
                key={`${provider.provider_id}-${idx}`}
                provider={provider}
                type="rent"
                mediaType={mediaType}
                mediaId={id}
              />
            ))}
          </div>
        </div>
      )}

      {hasBuy && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <i className="fas fa-shopping-cart"></i>
            <h4>Buy</h4>
            <span className={styles.count}>({providers.buy.length})</span>
          </div>
          <div className={styles.providersGrid}>
            {providers.buy.map((provider, idx) => (
              <PlatformCard
                key={`${provider.provider_id}-${idx}`}
                provider={provider}
                type="buy"
                mediaType={mediaType}
                mediaId={id}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.note}>
        <i className="fas fa-info-circle"></i>
        <p>Click on any platform to search where to watch • Availability may vary by region</p>
      </div>
    </div>
  );
};

export default WatchPlatforms;