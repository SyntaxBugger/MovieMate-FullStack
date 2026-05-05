import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import About from "./pages/About";
import Main from "./pages/Main";
import MyLibrary from "./pages/MyLibrary";
import MyNotes from "./pages/MyNotes";  // ✅ ADD THIS
import LoginPage from "./LoginPage";
import RegPage from "./RegPage";
import MovieDetailModal from "./components/MovieDetailModal";

export default function App() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const openAboutPage = (item) => {
    const type = item.media_type || (item.first_air_date ? "tv" : "movie");
    setSelected({ ...item, type: type });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  const changePage = (newPage) => {
    setSearchQuery("");
    setPage(newPage);
    setShowModal(false);
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
      
      {/* ✅ MY NOTES ROUTE */}
      {page === "mynotes" && <MyNotes onOpen={openAboutPage} />}

      {page === "about" && selected && (
        <About selected={selected} setPage={changePage} onOpen={openAboutPage}/>
      )}

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