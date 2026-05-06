import React, { useState, useEffect } from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useAnalytics } from '../hooks/useAnalytics';
import styles from './Analytics.module.css';

const Analytics = () => {
  const analytics = useAnalytics();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className={styles.loginPrompt}>
        <i className="fas fa-chart-line"></i>
        <h2>Login to View Your Analytics</h2>
        <p>Sign in to see your watching habits and insights.</p>
        <button onClick={() => window.location.href = '/'} className={styles.loginBtn}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>
          <i className="fas fa-chart-line"></i>
          Analytics Dashboard
        </h1>
        <p>Your watching habits at a glance</p>
      </div>
      <AnalyticsDashboard analytics={analytics} />
    </div>
  );
};

export default Analytics;