import { useState, useEffect } from 'react';

const STORAGE_KEY = 'moviemate_comments';

export const useComments = (movieId, movieTitle) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load comments from localStorage
  useEffect(() => {
    if (!movieId) return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const allComments = JSON.parse(stored);
        const movieComments = allComments.filter(c => c.movieId === movieId);
        setComments(movieComments.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error('Error loading comments:', error);
        setComments([]);
      }
    }
    setLoading(false);
  }, [movieId]);

  // Save all comments to localStorage
  const saveComments = (allComments) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
  };

  // Add a new comment
  const addComment = (text, userName, userAvatar = null) => {
    if (!text.trim()) return null;
    
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const newComment = {
      id: Date.now(),
      movieId,
      movieTitle,
      text: text.trim(),
      userName: userName || 'Anonymous',
      userAvatar,
      createdAt: Date.now(),
      likes: 0,
      replies: []
    };
    
    allComments.push(newComment);
    saveComments(allComments);
    
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    
    return newComment;
  };

  // Reply to a comment
  const addReply = (parentId, replyText, userName, userAvatar = null) => {
    if (!replyText.trim()) return null;
    
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const commentIndex = allComments.findIndex(c => c.id === parentId);
    
    if (commentIndex !== -1) {
      const newReply = {
        id: Date.now(),
        text: replyText.trim(),
        userName: userName || 'Anonymous',
        userAvatar,
        createdAt: Date.now(),
        likes: 0
      };
      
      if (!allComments[commentIndex].replies) {
        allComments[commentIndex].replies = [];
      }
      allComments[commentIndex].replies.push(newReply);
      saveComments(allComments);
      
      // Update state
      setComments(prev => {
        const updated = [...prev];
        const commentIdx = updated.findIndex(c => c.id === parentId);
        if (commentIdx !== -1) {
          if (!updated[commentIdx].replies) updated[commentIdx].replies = [];
          updated[commentIdx].replies.push(newReply);
        }
        return updated;
      });
      
      return newReply;
    }
    return null;
  };

  // Like a comment
  const likeComment = (commentId, isReply = false, parentId = null) => {
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    if (isReply && parentId) {
      const comment = allComments.find(c => c.id === parentId);
      if (comment && comment.replies) {
        const reply = comment.replies.find(r => r.id === commentId);
        if (reply) {
          reply.likes = (reply.likes || 0) + 1;
          saveComments(allComments);
          
          // Update state
          setComments(prev => {
            const updated = [...prev];
            const commentIdx = updated.findIndex(c => c.id === parentId);
            if (commentIdx !== -1 && updated[commentIdx].replies) {
              const replyIdx = updated[commentIdx].replies.findIndex(r => r.id === commentId);
              if (replyIdx !== -1) {
                updated[commentIdx].replies[replyIdx].likes += 1;
              }
            }
            return updated;
          });
        }
      }
    } else {
      const comment = allComments.find(c => c.id === commentId);
      if (comment) {
        comment.likes = (comment.likes || 0) + 1;
        saveComments(allComments);
        
        setComments(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(c => c.id === commentId);
          if (idx !== -1) {
            updated[idx].likes += 1;
          }
          return updated;
        });
      }
    }
  };

  // Delete a comment
  const deleteComment = (commentId, isReply = false, parentId = null) => {
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    if (isReply && parentId) {
      const comment = allComments.find(c => c.id === parentId);
      if (comment && comment.replies) {
        comment.replies = comment.replies.filter(r => r.id !== commentId);
        saveComments(allComments);
        
        setComments(prev => {
          const updated = [...prev];
          const commentIdx = updated.findIndex(c => c.id === parentId);
          if (commentIdx !== -1 && updated[commentIdx].replies) {
            updated[commentIdx].replies = updated[commentIdx].replies.filter(r => r.id !== commentId);
          }
          return updated;
        });
      }
    } else {
      const filtered = allComments.filter(c => c.id !== commentId);
      saveComments(filtered);
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  const getCommentCount = () => {
    return comments.length;
  };

  return {
    comments,
    loading,
    addComment,
    addReply,
    likeComment,
    deleteComment,
    getCommentCount
  };
};