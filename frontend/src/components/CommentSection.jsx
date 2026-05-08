import React, { useState, useEffect } from 'react';
import { useComments } from '../hooks/useComments';
import styles from './CommentSection.module.css';

const CommentSection = ({ movieId, movieTitle }) => {
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [user, setUser] = useState(null);

  const { comments, loading, addComment, addReply, likeComment, deleteComment, getCommentCount } = useComments(movieId, movieTitle);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ name: 'User' });
      }
    }
  }, []);

  const getUserName = () => {
    if (user?.name) return user.name;
    return 'Guest User';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment, getUserName());
      setNewComment('');
    }
  };

  const handleSubmitReply = (parentId) => {
    if (replyText[parentId]?.trim()) {
      addReply(parentId, replyText[parentId], getUserName());
      setReplyText(prev => ({ ...prev, [parentId]: '' }));
      setReplyingTo(null);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const getInitials = (name) => {
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#2ec4b6', '#ff9f1c', '#e63946', '#4fd1c5', '#ffb347', '#1cecff'];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading comments...</p>
      </div>
    );
  }

  return (
    <div className={styles.commentSection}>
      <div className={styles.header}>
        <h3>
          <i className="fas fa-comments"></i>
          Comments ({getCommentCount()})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className={styles.commentForm}>
        <div className={styles.avatar}>
          {user?.avatar ? (
            <img src={user.avatar} alt={getUserName()} />
          ) : (
            <div 
              className={styles.avatarPlaceholder}
              style={{ backgroundColor: getAvatarColor(getUserName()) }}
            >
              {getInitials(getUserName())}
            </div>
          )}
        </div>
        <div className={styles.formContent}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className={styles.commentInput}
            rows={3}
          />
          <button type="submit" className={styles.submitBtn} disabled={!newComment.trim()}>
            <i className="fas fa-paper-plane"></i> Post Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-comment-dots"></i>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentAvatar}>
                {comment.userAvatar ? (
                  <img src={comment.userAvatar} alt={comment.userName} />
                ) : (
                  <div 
                    className={styles.avatarPlaceholder}
                    style={{ backgroundColor: getAvatarColor(comment.userName) }}
                  >
                    {getInitials(comment.userName)}
                  </div>
                )}
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.userName}>{comment.userName}</span>
                  <span className={styles.commentTime}>{formatDate(comment.createdAt)}</span>
                </div>
                <p className={styles.commentText}>{comment.text}</p>
                <div className={styles.commentActions}>
                  <button 
                    className={styles.likeBtn}
                    onClick={() => likeComment(comment.id)}
                  >
                    <i className="fas fa-heart"></i>
                    <span>{comment.likes || 0}</span>
                  </button>
                  <button 
                    className={styles.replyBtn}
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <i className="fas fa-reply"></i>
                    Reply
                  </button>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => deleteComment(comment.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className={styles.replyForm}>
                    <textarea
                      value={replyText[comment.id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                      placeholder="Write a reply..."
                      className={styles.replyInput}
                      rows={2}
                    />
                    <div className={styles.replyActions}>
                      <button 
                        className={styles.cancelReplyBtn}
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className={styles.submitReplyBtn}
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyText[comment.id]?.trim()}
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className={styles.repliesSection}>
                    <button 
                      className={styles.showRepliesBtn}
                      onClick={() => toggleReplies(comment.id)}
                    >
                      <i className={`fas fa-chevron-${showReplies[comment.id] ? 'up' : 'down'}`}></i>
                      {showReplies[comment.id] ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                    
                    {showReplies[comment.id] && (
                      <div className={styles.repliesList}>
                        {comment.replies.map(reply => (
                          <div key={reply.id} className={styles.replyItem}>
                            <div className={styles.replyAvatar}>
                              <div 
                                className={styles.avatarPlaceholderSmall}
                                style={{ backgroundColor: getAvatarColor(reply.userName) }}
                              >
                                {getInitials(reply.userName)}
                              </div>
                            </div>
                            <div className={styles.replyContent}>
                              <div className={styles.replyHeader}>
                                <span className={styles.userName}>{reply.userName}</span>
                                <span className={styles.replyTime}>{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className={styles.replyText}>{reply.text}</p>
                              <div className={styles.replyActions}>
                                <button 
                                  className={styles.likeBtn}
                                  onClick={() => likeComment(reply.id, true, comment.id)}
                                >
                                  <i className="fas fa-heart"></i>
                                  <span>{reply.likes || 0}</span>
                                </button>
                                <button 
                                  className={styles.deleteBtn}
                                  onClick={() => deleteComment(reply.id, true, comment.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;