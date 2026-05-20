import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

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

import socket from "./socket";

export default function App() {

  const [page, setPage] =
    useState("home");

  const [selected, setSelected] =
    useState(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const openAboutPage = (item) => {

    const type =
      item.media_type ||
      (item.first_air_date
        ? "tv"
        : "movie");

    setSelected({
      ...item,
      type
    });

    setPage("about");
  };

  const changePage = (newPage) => {

    setSearchQuery("");

    setPage(newPage);

    setSelected(null);
  };

  const hideNavbarFooter =
    page === "login" ||
    page === "register";

  useEffect(() => {

    socket.on("activity", (data) => {

      let message = "";

      if (
        data.category ===
        "favorites"
      ) {
        message =
          `❤️ Someone favorited ${data.title}`;
      }

      if (
        data.category ===
        "watchlist"
      ) {
        message =
          `📌 Someone added ${data.title} to watchlist`;
      }

      if (message) {
        toast(message);
      }
    });

    socket.on(
      "onlineUsers",
      (count) => {
        console.log(
          "Online Users:",
          count
        );
      }
    );

    return () => {
      socket.off("activity");
      socket.off("onlineUsers");
    };

  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#112240",
            color: "#ffffff",
            borderRadius: "12px",
            borderLeft:
              "4px solid #2ec4b6",
          },
        }}
      />

      {!hideNavbarFooter && (
        <Navbar
          setPage={changePage}
          page={page}
          onSearch={setSearchQuery}
        />
      )}

      {page === "home" && (
        <Main
          onOpen={openAboutPage}
          searchQuery={searchQuery}
        />
      )}

      {page === "movies" && (
        <Movies onOpen={openAboutPage} />
      )}

      {page === "tvshows" && (
        <TvShows onOpen={openAboutPage} />
      )}

      {page === "library" && (
        <MyLibrary onOpen={openAboutPage} />
      )}

      {page === "mynotes" && (
        <MyNotes onOpen={openAboutPage} />
      )}

      {page === "analytics" && (
        <Analytics onOpen={openAboutPage} />
      )}

      {page === "about" &&
        selected && (
          <About
            selected={selected}
            setPage={changePage}
            onOpen={openAboutPage}
          />
        )}

      {page === "login" && (
        <LoginPage setPage={changePage} />
      )}

      {page === "register" && (
        <RegPage setPage={changePage} />
      )}

      {!hideNavbarFooter && (
        <Footer setPage={changePage} />
      )}
    </>
  );
}