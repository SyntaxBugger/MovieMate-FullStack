import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'moviemate_notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  const saveNotifications = (newNotifications) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  };

  const addNotification = (title, message, type = 'info', link = null) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };

    const newNotifications = [newNotification, ...notifications];
    saveNotifications(newNotifications);

    // Show toast notification - SIMPLE STRING VERSION
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast(message, {
          icon: '⚠️',
          style: {
            background: '#112240',
            color: '#ff9800',
          },
        });
        break;
      default:
        toast(message, {
          icon: 'ℹ️',
          style: {
            background: '#112240',
            color: '#2ec4b6',
          },
        });
    }

    return newNotification;
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount
  };
};