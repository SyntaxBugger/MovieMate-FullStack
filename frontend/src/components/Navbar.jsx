import { useState, useEffect } from 'react';
import styles from "./Navbar.module.css";
import logoVideo from "../assets/movielight.mp4";
import Avatar from './Avatar';  // ✅ ADD THIS
import NotificationBell from './NotificationBell';  // ✅ ADD THIS
import socket from '../socket';

export default function Navbar({ setPage, page, onSearch }) {
  
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem("user"); 
    setIsLoggedIn(!!user);
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.email || 'User');
      } catch {
        setUserName('User');
      }
    }
  }, [page]);

  const getLinkClass = (pageName) => {
    return `${styles.navLink} ${page === pageName ? styles.active : ''}`;
  };
  useEffect(() => {

  socket.on('onlineUsers', (count) => {
    setOnlineUsers(count);
  });

  return () => {
    socket.off('onlineUsers');
  };

}, []);
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    } else {
      onSearch("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const goHome = () => {
    onSearch(""); 
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_avatar");
    localStorage.removeItem("avatar_type");
    localStorage.removeItem("cartoon_avatar_svg");
    setIsLoggedIn(false);
    goHome();
  };

  return (
    <header className={styles.mainHeader}>
      <div className="container">
        <nav className={styles.navbar}>

          {/* LEFT SECTION - Logo */}
          <div className={styles.leftSection}>
            <button
              className={styles.logo}
              onClick={goHome}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <video
                src={logoVideo} 
                autoPlay muted loop playsInline
                width="250" height="80"
              ></video>
            </button>
          </div>

          {/* MIDDLE NAV */}
          <ul className={styles.middleSection}>
            <li className={styles.navItem}>
              <button
                className={getLinkClass("home")}
                onClick={goHome}
              >
                Home
              </button>
            </li>
            <li className={styles.navItem}>
              <button
                className={getLinkClass("movies")}
                onClick={() => {
                  onSearch(""); 
                  setPage("movies");
                }}
              >
                Movies
              </button>
            </li>
            <li className={styles.navItem}>
              <button
                className={getLinkClass("tvshows")}
                onClick={() => {
                  onSearch(""); 
                  setPage("tvshows");
                }}
              >
                TV Shows
              </button>
            </li>
            
            {/* MY LIBRARY LINK */}
            {isLoggedIn && (
              <li className={styles.navItem}>
                <button
                  className={getLinkClass("library")}
                  onClick={() => {
                    onSearch("");
                    setPage("library");
                  }}
                >
                  My Library
                </button>
              </li>
            )}

            {/* MY NOTES LINK */}
            {isLoggedIn && (
              <li className={styles.navItem}>
                <button
                  className={getLinkClass("mynotes")}
                  onClick={() => {
                    onSearch("");
                    setPage("mynotes");
                  }}
                >
                  <i className="fas fa-pen"></i> My Notes
                </button>
              </li>
            )}

            {/* ANALYTICS LINK */}
            {isLoggedIn && (
              <li className={styles.navItem}>
                <button
                  className={getLinkClass("analytics")}
                  onClick={() => {
                    onSearch("");
                    setPage("analytics");
                  }}
                >
                  <i className="fas fa-chart-line"></i> Analytics
                </button>
              </li>
            )}

            {/* PROFILE LINK */}
            {isLoggedIn && (
              <li className={styles.navItem}>
                <button
                  className={getLinkClass("profile")}
                  onClick={() => {
                    onSearch("");
                    setPage("profile");
                  }}
                >
                  <i className="fas fa-user"></i> Profile
                </button>
              </li>
            )}
          </ul>

          {/* RIGHT SIDE - Search + Avatar + Notifications + Login/Logout */}
          <div className={styles.rightSection}>
            <div>🟢 {onlineUsers} Online</div>
            <div className={styles.searchContainer}>
              <i 
                className={`fas fa-search ${styles.searchIcon}`} 
                onClick={handleSearch} 
              />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search for movies, TV shows..."
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={handleKeyDown} 
              />
            </div>
            
            {/* ✅ AVATAR - Only shows if logged in */}
            {isLoggedIn && <Avatar name={userName} size="medium" />}
            
            {/* ✅ NOTIFICATION BELL */}
            {isLoggedIn && <NotificationBell />}
            
            {isLoggedIn ? (
              <button className={styles.btn} onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className={styles.btn} onClick={() => setPage("login")}>
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}