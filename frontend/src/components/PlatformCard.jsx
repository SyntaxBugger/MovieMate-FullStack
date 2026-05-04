import React from 'react';
import { getPlatformLogo, getStreamingLink } from '../utils/platformHelpers';
import StreamingBadge from './StreamingBadge';
import styles from './PlatformCard.module.css';

const PlatformCard = ({ provider, type, mediaType, mediaId }) => {
  const logoUrl = getPlatformLogo(provider.logo_path);
  const streamingLink = getStreamingLink(provider.provider_name, mediaType, mediaId);

  const handleClick = () => {
    window.open(streamingLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.logoContainer}>
        <img 
          src={logoUrl} 
          alt={provider.provider_name}
          className={styles.logo}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/48x48?text=🎬';
          }}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{provider.provider_name}</div>
        <StreamingBadge type={type} size="small" />
      </div>
      <div className={styles.arrow}>
        <i className="fas fa-arrow-right"></i>
      </div>
    </div>
  );
};

export default PlatformCard;