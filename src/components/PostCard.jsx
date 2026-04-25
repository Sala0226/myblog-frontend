import { useState } from 'react';
import * as postService from '../services/post.service';
import '../styles/post.css';

export default function PostCard({ post, currentUser }) {
  const [likes, setLikes]       = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showLikesModal, setShowLikesModal]       = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const isLiked = likes.some(l => (l._id || l) === currentUser?._id);
  const initial = post.author?.name?.charAt(0).toUpperCase() || '?';

  const handleLike = async () => {
    try {
      const res = await postService.likePost(post._id);
      setLikes(res.data.likes || []);
    } catch (err) { console.error(err); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await postService.commentPost(post._id, { content: commentText });
      setComments(res.data.comments || []);
      setCommentText('');
    } catch (err) { console.error(err); }
  };

  return (
    <>
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

        {/* Résumé likes et commentaires cliquables */}
        {(likes.length > 0 || comments.length > 0) && (
          <div className="post-summary">
            {likes.length > 0 && (
              <span className="post-summary-item" onClick={() => setShowLikesModal(true)}>
                ❤️ {likes.length} like{likes.length > 1 ? 's' : ''}
              </span>
            )}
            {comments.length > 0 && (
              <span className="post-summary-item" onClick={() => setShowCommentsModal(true)}>
                💬 {comments.length} commentaire{comments.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="post-card-footer">
          <button className={`post-action ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
            <span>{isLiked ? '❤️' : '🤍'}</span> {likes.length}
          </button>
          <button className="post-action" onClick={() => setShowCommentsModal(true)}>
            <span>💬</span> {comments.length}
          </button>
        </div>

        {/* Zone écrire un commentaire */}
        <form onSubmit={handleComment} className="comment-input-row">
          <input
            placeholder="Écrire un commentaire..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          <button type="submit">Envoyer</button>
        </form>

      </div>

      {/* Modal Likes */}
      {showLikesModal && (
        <div className="modal-overlay" onClick={() => setShowLikesModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>❤️ Likes ({likes.length})</h2>
              <button className="modal-close" onClick={() => setShowLikesModal(false)}>✕</button>
            </div>
            <div className="modal-list">
              {likes.length === 0 ? (
                <p className="modal-empty">Aucun like pour le moment.</p>
              ) : likes.map((l, i) => (
                <div key={i} className="modal-user-item">
                  <div className="modal-user-avatar">
                    {l.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="modal-user-name">{l.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Commentaires */}
      {showCommentsModal && (
        <div className="modal-overlay" onClick={() => setShowCommentsModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💬 Commentaires ({comments.length})</h2>
              <button className="modal-close" onClick={() => setShowCommentsModal(false)}>✕</button>
            </div>
            <div className="modal-list">
              {comments.length === 0 ? (
                <p className="modal-empty">Aucun commentaire pour le moment.</p>
              ) : comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <div className="comment-avatar">
                    {c.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="comment-bubble">
                    <p className="comment-author">{c.user?.name || 'Utilisateur'}</p>
                    <p className="comment-text">{c.content}</p>
                    <p className="comment-date">
                      {new Date(c.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ajouter commentaire dans le modal */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '8px' }}>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!commentText.trim()) return;
                try {
                  const res = await postService.commentPost(post._id, { content: commentText });
                  setComments(res.data.comments || []);
                  setCommentText('');
                } catch (err) { console.error(err); }
              }} className="comment-input-row">
                <input
                  placeholder="Écrire un commentaire..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                <button type="submit">Envoyer</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}