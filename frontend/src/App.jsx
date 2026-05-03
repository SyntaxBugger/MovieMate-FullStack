// In your App.jsx
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import About from "./pages/About";
import Main from "./pages/Main";
import MyLibrary from "./pages/MyLibrary";
import LoginPage from "./LoginPage";
import RegPage from "./RegPage";
import MovieDetailModal from "./components/MovieDetailModal"; // ✅ ADD THIS

export default function App() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false); // ✅ ADD THIS

  const openAboutPage = (item) => {
    const type = item.media_type || (item.first_air_date ? "tv" : "movie");
    setSelected({ ...item, type: type });
    
    // ✅ OPTION 1: Use Modal (Uncomment this, comment the About page)
    setShowModal(true);
    
    // ✅ OPTION 2: Use About Page (Keep this, comment the above)
    // setPage("about");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  const changePage = (newPage) => {
    setSearchQuery("");
    setPage(newPage);
    setShowModal(false); // Close modal when changing page
  };

  const hideNavbarFooter = page === "login" || page === "register";

  return (
    <>
      {!hideNavbarFooter && (
        <Navbar setPage={changePage} page={page} onSearch={setSearchQuery} />
      )}

      {page === "home" && (
        <Main onOpen={openAboutPage} searchQuery={searchQuery} />
      )}

      {page === "movies" && <Movies onOpen={openAboutPage} />}
      {page === "tvshows" && <TvShows onOpen={openAboutPage} />}
      {page === "library" && <MyLibrary onOpen={openAboutPage} />}

      {/* About Page (if using Option 2) */}
      {page === "about" && selected && (
        <About selected={selected} setPage={changePage} onOpen={openAboutPage}/>
      )}

      {/* ✅ MODAL - Where to Watch will appear here */}
      {showModal && selected && (
        <MovieDetailModal 
          movie={selected} 
          onClose={closeModal}
        />
      )}

      {page === "login" && <LoginPage setPage={changePage} />}
      {page === "register" && <RegPage setPage={changePage} />}

      {!hideNavbarFooter && <Footer setPage={changePage} />}
    </>
  );
}