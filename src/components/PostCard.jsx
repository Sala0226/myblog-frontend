import { useState } from 'react';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import * as postService from '../services/post.service';
import '../styles/post.css';

// ← EN DEHORS de PostCard
function CommentItem({ c, currentUser, postId, onUpdate, editingId, editingText, setEditingId, setEditingText }) {
  const commentInitial = c.user?.name?.charAt(0).toUpperCase() || '?';
  const isOwner = c.user?._id === currentUser?._id;
  const isEditing = editingId === c._id;

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const submitEdit = async () => {
    if (!editingText.trim()) return;
    try {
      const res = await postService.updateComment(postId, c._id, { content: editingText });
      onUpdate(res.data.comments || []);
      cancelEdit();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="comment-item">
      <div className="comment-avatar">{commentInitial}</div>
      <div className="comment-bubble" style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p className="comment-author">{c.user?.name || 'Utilisateur'}</p>
          {isOwner && !isEditing && (
            <button
              onClick={() => { setEditingId(c._id); setEditingText(c.content); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '2px 4px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px' }}>
              <FiEdit2 size={12} /> Modifier
            </button>
          )}
        </div>

        {isEditing ? (
          <div style={{ marginTop: '6px' }}>
            <textarea
              value={editingText}
              onChange={e => setEditingText(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #534AB7', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', minHeight: '60px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
              <button onClick={cancelEdit}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#666' }}>
                <FiX size={12} /> Annuler
              </button>
              <button onClick={submitEdit}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <FiCheck size={12} /> Sauvegarder
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-text">{c.content}</p>
            {c.createdAt && (
              <p className="comment-date">
                {new Date(c.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PostCard({ post, currentUser }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

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

        <p className="post-title">{post.title}</p>
        <p className="post-content">{post.content}</p>
        {post.image && (
          <img src={post.image} alt="post"
            style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px' }} />
        )}

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

        <div className="post-card-footer">
          <button className={`post-action ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
            <span>{isLiked ? '❤️' : '🤍'}</span> {likes.length}
          </button>
          <button className="post-action" onClick={() => setShowCommentsModal(true)}>
            <span>💬</span> {comments.length}
          </button>
        </div>

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
                  <div className="modal-user-avatar">{l.name?.charAt(0).toUpperCase() || '?'}</div>
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
                <CommentItem
                  key={c._id || i}
                  c={c}
                  currentUser={currentUser}
                  postId={post._id}
                  onUpdate={setComments}
                  editingId={editingId}
                  editingText={editingText}
                  setEditingId={setEditingId}
                  setEditingText={setEditingText}
                />
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '8px' }}>
              <form onSubmit={handleComment} className="comment-input-row">
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