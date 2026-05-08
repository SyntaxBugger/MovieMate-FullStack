import React, { useState } from 'react';
import styles from './RecentlyViewed.module.css';
import { useNotifications } from '../hooks/useNotifications';  // ✅ ADD THIS

const RecentlyViewed = ({ items, onItemClick, onRemove, onClearAll, title = "Recently Viewed" }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { addNotification } = useNotifications();  // ✅ ADD THIS

  if (!items || items.length === 0) {
    return null;
  }

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
    setShowConfirm(false);
    // ✅ ADD NOTIFICATION FOR CLEARING ALL
    addNotification(
      'History Cleared',
      'All recently viewed items have been cleared',
      'info'
    );
  };

  // ✅ HANDLE REMOVE SINGLE ITEM WITH NOTIFICATION
  const handleRemoveItem = (e, itemId, itemTitle) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(itemId);
      addNotification(
        'Item Removed',
        `"${itemTitle}" removed from recently viewed`,
        'info'
      );
    }
  };

  // ✅ HANDLE ITEM CLICK WITH NOTIFICATION
  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
      addNotification(
        'Opening Movie',
        `Opening "${item.title}"`,
        'info'
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <i className="fas fa-history"></i>
          <h3>{title}</h3>
          <span className={styles.badge}>{items.length}</span>
        </div>
        
        <div className={styles.headerRight}>
          {showConfirm ? (
            <div className={styles.confirmBox}>
              <span>Clear all?</span>
              <button 
                className={styles.confirmBtn}
                onClick={handleClearAll}
              >
                Yes
              </button>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          ) : (
            <button 
              className={styles.clearBtn}
              onClick={() => setShowConfirm(true)}
              title="Clear all recently viewed"
            >
              <i className="fas fa-trash-alt"></i>
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.grid}>
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className={styles.card}
            onClick={() => handleItemClick(item)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={styles.posterContainer}>
              {item.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  alt={item.title}
                  className={styles.poster}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x300?text=No+Poster';
                  }}
                />
              ) : (
                <div className={styles.placeholder}>
                  <i className="fas fa-film"></i>
                </div>
              )}
              
              <button 
                className={styles.removeBtn}
                onClick={(e) => handleRemoveItem(e, item.id, item.title)}
                title="Remove from recently viewed"
              >
                <i className="fas fa-times"></i>
              </button>
              
              <div className={styles.typeBadge}>
                {item.media_type === 'movie' ? (
                  <span>🎬 MOVIE</span>
                ) : (
                  <span>📺 TV</span>
                )}
              </div>
            </div>
            
            <div className={styles.info}>
              <p className={styles.title}>{item.title}</p>
              {item.vote_average && (
                <div className={styles.rating}>
                  <i className="fas fa-star"></i>
                  <span>{item.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;