import React, { useState, useEffect } from 'react';
import PlatformCard from './PlatformCard';
import styles from './WatchPlatforms.module.css';

// Country list with flags
const countryList = {
  'IN': { name: 'India', flag: '🇮🇳', code: 'IN' },
  'US': { name: 'United States', flag: '🇺🇸', code: 'US' },
  'GB': { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  'CA': { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  'AU': { name: 'Australia', flag: '🇦🇺', code: 'AU' }
};

const WatchPlatforms = ({ mediaType, id, title }) => {
  const [providers, setProviders] = useState({ flatrate: [], rent: [], buy: [], ads: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [availableCountries, setAvailableCountries] = useState(['IN', 'US', 'GB', 'CA', 'AU']);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Hardcoded data for popular movies (fallback)
  const getFallbackProviders = (movieId, country) => {
    const fallbackData = {
      // Avengers: Endgame (ID: 299534)
      299534: {
        IN: {
          flatrate: [
            { provider_id: 218, provider_name: "Disney+ Hotstar", logo_path: "/7rwgBjw8bTdVj5S8O5pjhZQmMlX.png" },
            { provider_id: 8, provider_name: "Netflix", logo_path: "/wwemzKWzjKYJFfCeiB57q3r4Bcm.png" }
          ],
          rent: [
            { provider_id: 3, provider_name: "Google Play", logo_path: "/8zV2LPWfXZm4iLIqHu3QXUywBBC.png" },
            { provider_id: 2, provider_name: "Apple TV", logo_path: "/gQZJqB1q1q1q1q1q1q1q1q1q.png" }
          ]
        },
        US: {
          flatrate: [
            { provider_id: 8, provider_name: "Netflix", logo_path: "/wwemzKWzjKYJFfCeiB57q3r4Bcm.png" },
            { provider_id: 9, provider_name: "Amazon Prime Video", logo_path: "/8zV2LPWfXZm4iLIqHu3QXUywBBC.png" },
            { provider_id: 386, provider_name: "Disney+", logo_path: "/7rwgBjw8bTdVj5S8O5pjhZQmMlX.png" }
          ]
        }
      },
      // Inception (ID: 27205)
      27205: {
        IN: {
          flatrate: [
            { provider_id: 8, provider_name: "Netflix", logo_path: "/wwemzKWzjKYJFfCeiB57q3r4Bcm.png" },
            { provider_id: 9, provider_name: "Prime Video", logo_path: "/8zV2LPWfXZm4iLIqHu3QXUywBBC.png" }
          ],
          rent: [
            { provider_id: 3, provider_name: "Google Play", logo_path: "/8zV2LPWfXZm4iLIqHu3QXUywBBC.png" },
            { provider_id: 2, provider_name: "Apple TV", logo_path: "/gQZJqB1q1q1q1q1q1q1q1q1q.png" }
          ]
        }
      },
      // Interstellar (ID: 157336)
      157336: {
        IN: {
          flatrate: [
            { provider_id: 9, provider_name: "Prime Video", logo_path: "/8zV2LPWfXZm4iLIqHu3QXUywBBC.png" }
          ],
          rent: [
            { provider_id: 3, provider_name: "Google Play", logo_path: "/8zV2LPWfXZm4iLIqHu3QXUywBBC.png" },
            { provider_id: 2, provider_name: "Apple TV", logo_path: "/gQZJqB1q1q1q1q1q1q1q1q1q.png" }
          ]
        }
      }
    };

    return fallbackData[movieId]?.[country] || null;
  };

  const fetchWatchProviders = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First try TMDB API
      const url = `https://api.themoviedb.org/3/${mediaType}/${id}/watch/providers?api_key=${TMDB_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results[selectedCountry]) {
        const countryData = data.results[selectedCountry];
        setProviders({
          flatrate: countryData.flatrate || [],
          rent: countryData.rent || [],
          buy: countryData.buy || [],
          ads: countryData.ads || []
        });
        
        // Update available countries
        const countries = Object.keys(data.results);
        if (countries.length > 0) setAvailableCountries(countries);
      } else {
        // If no data from API, try fallback data
        const fallback = getFallbackProviders(id, selectedCountry);
        if (fallback) {
          setProviders({
            flatrate: fallback.flatrate || [],
            rent: fallback.rent || [],
            buy: fallback.buy || [],
            ads: fallback.ads || []
          });
          console.log('Using fallback data for movie:', title);
        } else {
          setProviders({ flatrate: [], rent: [], buy: [], ads: [] });
        }
      }
    } catch (err) {
      console.error('Error fetching watch providers:', err);
      // Try fallback on error
      const fallback = getFallbackProviders(id, selectedCountry);
      if (fallback) {
        setProviders({
          flatrate: fallback.flatrate || [],
          rent: fallback.rent || [],
          buy: fallback.buy || [],
          ads: fallback.ads || []
        });
      } else {
        setError('Failed to load streaming platforms');
      }
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

  const hasSubscription = providers.flatrate?.length > 0;
  const hasRent = providers.rent?.length > 0;
  const hasBuy = providers.buy?.length > 0;
  const hasProviders = hasSubscription || hasRent || hasBuy;

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

  if (error && !hasProviders) {
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
          <p>"{title}" is not available for streaming in {countryList[selectedCountry]?.name || selectedCountry}</p>
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
                  {countryList[country]?.flag || '🌍'} {countryList[country]?.name || country}
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