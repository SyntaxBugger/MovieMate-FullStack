import { useState, useEffect } from 'react';

const STORAGE_KEY = 'moviemate_movie_notes';

export const useMovieNotes = () => {
  const [notes, setNotes] = useState([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotes(parsed);
      } catch (error) {
        console.error('Error loading notes:', error);
        setNotes([]);
      }
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (newNotes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  // Get note for a specific movie
  const getNote = (mediaId, mediaType = 'movie') => {
    return notes.find(n => n.mediaId === mediaId && n.mediaType === mediaType);
  };

  // Add or update note
  const saveNote = (mediaId, mediaType, title, poster_path, rating, noteText, isFavorite = false) => {
    const existingNoteIndex = notes.findIndex(n => n.mediaId === mediaId && n.mediaType === mediaType);
    
    const newNote = {
      mediaId,
      mediaType,
      title,
      poster_path,
      rating: rating || null,
      note: noteText || '',
      isFavorite,
      updatedAt: new Date().toISOString()
    };

    let newNotes;
    if (existingNoteIndex !== -1) {
      // Update existing note
      newNotes = [...notes];
      newNotes[existingNoteIndex] = { ...newNotes[existingNoteIndex], ...newNote };
    } else {
      // Add new note
      newNotes = [newNote, ...notes];
    }

    saveNotes(newNotes);
    return newNote;
  };

  // Delete note
  const deleteNote = (mediaId, mediaType) => {
    const newNotes = notes.filter(n => !(n.mediaId === mediaId && n.mediaType === mediaType));
    saveNotes(newNotes);
  };

  // Update rating only
  const updateRating = (mediaId, mediaType, rating) => {
    const existingNote = getNote(mediaId, mediaType);
    if (existingNote) {
      saveNote(mediaId, mediaType, existingNote.title, existingNote.poster_path, rating, existingNote.note, existingNote.isFavorite);
    } else {
      // Create new note with just rating
      saveNote(mediaId, mediaType, '', '', rating, '', false);
    }
  };

  // Update note only
  const updateNoteText = (mediaId, mediaType, noteText) => {
    const existingNote = getNote(mediaId, mediaType);
    if (existingNote) {
      saveNote(mediaId, mediaType, existingNote.title, existingNote.poster_path, existingNote.rating, noteText, existingNote.isFavorite);
    } else {
      saveNote(mediaId, mediaType, '', '', null, noteText, false);
    }
  };

  // Toggle favorite
  const toggleFavorite = (mediaId, mediaType) => {
    const existingNote = getNote(mediaId, mediaType);
    if (existingNote) {
      saveNote(mediaId, mediaType, existingNote.title, existingNote.poster_path, existingNote.rating, existingNote.note, !existingNote.isFavorite);
    } else {
      saveNote(mediaId, mediaType, '', '', null, '', true);
    }
  };

  // Get all favorite movies
  const getFavorites = () => {
    return notes.filter(n => n.isFavorite);
  };

  // Get all notes with ratings
  const getRatedMovies = () => {
    return notes.filter(n => n.rating !== null && n.rating > 0);
  };

  return {
    notes,
    getNote,
    saveNote,
    deleteNote,
    updateRating,
    updateNoteText,
    toggleFavorite,
    getFavorites,
    getRatedMovies
  };
};