import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import About from "./pages/About";
import Main from "./pages/Main";
import MyLibrary from "./pages/MyLibrary";
import MyNotes from "./pages/MyNotes";
import Analytics from "./pages/Analytics";
import LoginPage from "./LoginPage";
import RegPage from "./RegPage";
// Remove MovieDetailModal import if not using

export default function App() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Remove showModal state

  const openAboutPage = (item) => {
    const type = item.media_type || (item.first_air_date ? "tv" : "movie");
    setSelected({ ...item, type: type });
    setPage("about");  // ✅ Go to About page
  };

  const changePage = (newPage) => {
    setSearchQuery("");
    setPage(newPage);
    setSelected(null);
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
      {page === "mynotes" && <MyNotes onOpen={openAboutPage} />}
      {page === "analytics" && <Analytics onOpen={openAboutPage} />}
      
      {/* ✅ About Page - Shows movie details, cast, streaming */}
      {page === "about" && selected && (
        <About selected={selected} setPage={changePage} onOpen={openAboutPage} />
      )}

      {page === "login" && <LoginPage setPage={changePage} />}
      {page === "register" && <RegPage setPage={changePage} />}

      {!hideNavbarFooter && <Footer setPage={changePage} />}
    </>
  );
}