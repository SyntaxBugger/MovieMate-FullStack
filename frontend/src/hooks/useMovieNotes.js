import { useState, useEffect } from "react";
import {
  getHistory,
  getLibraryItem,
  updateLibraryItem
} from "../api/api";

export const useMovieNotes = () => {
  const [notes, setNotes] = useState([]);

  // Load all history items with notes/ratings
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const history = await getHistory();

      const formatted = history.map(item => ({
        mediaId: item.movieId,
        mediaType: item.media_type,
        title: item.title,
        poster_path: item.poster_path,
        rating: item.rating || null,
        note: item.notes || "",
        isFavorite: item.category === "favorites",
        updatedAt: item.updatedAt,
        libraryId: item._id
      }));
      console.log("RAW HISTORY:", history);
console.log("FORMATTED NOTES:", formatted);

      setNotes(formatted);

    } catch (err) {
      console.error("Error loading notes:", err);
    }
  };

  const getNote = (mediaId, mediaType = "movie") => {
    return notes.find(
      n => n.mediaId === mediaId && n.mediaType === mediaType
    );
  };

  const saveNote = async (
    mediaId,
    mediaType,
    title,
    poster_path,
    rating,
    noteText,
    isFavorite = false
  ) => {
    try {
      const existing = await getLibraryItem(mediaId, "history");

      if (!existing) {
        console.error("No history item exists yet");
        return;
      }

      const updated = await updateLibraryItem(existing._id, {
        rating: rating || 0,
        notes: noteText || "",
        watched: true
      });

      await loadNotes();

      return updated;

    } catch (err) {
      console.error("Save note error:", err);
    }
  };

 const deleteNote = async (
  mediaId,
  mediaType
) => {

  try {

    const existing =
      await getLibraryItem(
        mediaId,
        "history"
      );

    if (!existing) return;

    await updateLibraryItem(
      existing._id,
      {
        rating: 0,
        notes: ""
      }
    );

    // Remove from frontend state immediately
    setNotes(prev =>
      prev.filter(
        n =>
          !(
            n.mediaId === mediaId &&
            n.mediaType === mediaType
          )
      )
    );

  } catch (err) {

    console.error(
      "Delete note error:",
      err
    );
  }
};
  const getFavorites = () => {
    return notes.filter(n => n.isFavorite);
  };

  const getRatedMovies = () => {
    return notes.filter(n => n.rating && n.rating > 0);
  };

  return {
    notes,
    getNote,
    saveNote,
    deleteNote,
    getFavorites,
    getRatedMovies
  };
};