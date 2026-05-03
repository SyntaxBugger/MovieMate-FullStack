import React from 'react';
import { getProviderTypeInfo } from '../utils/platformHelpers';
import styles from './StreamingBadge.module.css';

const StreamingBadge = ({ type, size = 'small' }) => {
  const typeInfo = getProviderTypeInfo(type);
  
  return (
    <span 
      className={`${styles.badge} ${styles[size]} ${styles[type]}`}
      style={{ backgroundColor: typeInfo.color + '20', color: typeInfo.color }}
    >
      <i className={`fas ${typeInfo.icon} ${styles.icon}`}></i>
      <span>{typeInfo.label}</span>
    </span>
  );
};

export default StreamingBadge;