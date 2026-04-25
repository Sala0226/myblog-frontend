import { useState } from 'react';
import * as postService from '../services/post.service';
import '../styles/post.css';

export default function PostCard({ post, currentUser }) {
  const [likes, setLikes]       = useState(post.likes?.length || 0);
  const [liked, setLiked]       = useState(post.likes?.includes(currentUser?._id));
  const [comments, setComments] = useState(post.comments?.length || 0);
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState('');

  const initial = post.author?.name?.charAt(0).toUpperCase() || '?';

  const handleLike = async () => {
    try {
      await postService.likePost(post._id);
      setLiked(!liked);
      setLikes(prev => liked ? prev - 1 : prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await postService.commentPost(post._id, { content: commentText });
      setComments(prev => prev + 1);
      setCommentText('');
      setShowComment(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-card-header">
        <div className="post-avatar">{initial}</div>
        <div>
          <p className="post-author">{post.author?.name || 'Inconnu'}</p>
          <p className="post-date">
            {new Date(post.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Contenu */}
      <p className="post-title">{post.title}</p>
      <p className="post-content">{post.content}</p>

      {/* Footer actions */}
      <div className="post-card-footer">
        <button className={`post-action ${liked ? 'liked' : ''}`} onClick={handleLike}>
          <span>{liked ? '❤️' : '🤍'}</span> {likes}
        </button>
        <button className="post-action" onClick={() => setShowComment(!showComment)}>
          <span>💬</span> {comments}
        </button>
      </div>

      {/* Zone commentaire */}
      {showComment && (
        <form onSubmit={handleComment} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <input
            style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
            placeholder="Écrire un commentaire..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          <button type="submit" style={{ padding: '8px 14px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            Envoyer
          </button>
        </form>
      )}
    </div>
  );
}