import { useEffect, useState } from 'react';

const API =
  'http://localhost:5000/api/comments';

export const useComments = (
  movieId,
  movieTitle
) => {

  const [comments, setComments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (!movieId) return;

    fetchComments();

  }, [movieId]);

  const fetchComments = async () => {

    try {

      setLoading(true);

      const res =
        await fetch(
          `${API}/${movieId}`
        );

      const data =
        await res.json();

      setComments(data);

    } catch (err) {

      console.error(
        'Fetch comments error:',
        err
      );

    } finally {

      setLoading(false);
    }
  };

  const addComment = async (
    text,
    username
  ) => {

    try {

      const res =
        await fetch(API, {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            movieId,
            mediaType: 'movie',
            movieTitle,
            username,
            content: text
          })
        });

      const newComment =
        await res.json();

      setComments(prev => [
        newComment,
        ...prev
      ]);

    } catch (err) {

      console.error(
        'Add comment error:',
        err
      );
    }
  };

  const updateComment = async (
    id,
    content
  ) => {

    try {

      const res =
        await fetch(
          `${API}/${id}`,
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              content
            })
          }
        );

      const updated =
        await res.json();

      setComments(prev =>
        prev.map(comment =>
          comment.id === id
            ? updated
            : comment
        )
      );

    } catch (err) {

      console.error(
        'Update comment error:',
        err
      );
    }
  };

  const deleteComment = async (
    id
  ) => {

    try {

      await fetch(
        `${API}/${id}`,
        {
          method: 'DELETE'
        }
      );

      setComments(prev =>
        prev.filter(
          comment =>
            comment.id !== id
        )
      );

    } catch (err) {

      console.error(
        'Delete comment error:',
        err
      );
    }
  };

  return {
    comments,
    loading,
    addComment,
    updateComment,
    deleteComment,
    getCommentCount:
      () => comments.length
  };
};