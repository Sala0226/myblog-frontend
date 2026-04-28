import { useState, useRef } from 'react';
import { FiEdit2, FiCheck, FiX, FiTrash2, FiMoreVertical, FiImage } from 'react-icons/fi';
import * as postService from '../services/post.service';
import '../styles/post.css';

function CommentItem({ c, currentUser, postId, onUpdate, editingId, editingText, setEditingId, setEditingText }) {
  const commentInitial = c.user?.name?.charAt(0).toUpperCase() || '?';
  const isOwner = c.user?._id === currentUser?._id;
  const isEditing = editingId === c._id;

  return (
    <div className="comment-item">
      {c.user?.avatar ? (
        <img src={c.user.avatar} alt={c.user?.name}
          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div className="comment-avatar">{commentInitial}</div>
      )}
      <div className="comment-bubble" style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p className="comment-author">{c.user?.name || 'Utilisateur'}</p>
          {isOwner && !isEditing && (
            <button onClick={() => { setEditingId(c._id); setEditingText(c.content); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px' }}>
              <FiEdit2 size={11} /> Modifier
            </button>
          )}
        </div>
        {isEditing ? (
          <div style={{ marginTop: '6px' }}>
            <textarea value={editingText} onChange={e => setEditingText(e.target.value)} autoFocus
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #534AB7', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', minHeight: '60px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setEditingId(null); setEditingText(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <FiX size={11} /> Annuler
              </button>
              <button onClick={async () => {
                const res = await postService.updateComment(postId, c._id, { content: editingText });
                onUpdate(res.data.comments || []);
                setEditingId(null);
              }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <FiCheck size={11} /> Sauvegarder
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-text">{c.content}</p>
            {c.createdAt && <p className="comment-date">{new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
          </>
        )}
      </div>
    </div>
  );
}
export default function PostCard({ post, currentUser, onDelete, onUpdate }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: post.title, content: post.content });
  const [editImage, setEditImage] = useState(null);
 const [editPreview, setEditPreview] = useState(post.image && post.image !== '' ? post.image : null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const isLiked = likes.some(l => (l._id || l) === currentUser?._id);
  const isAuthor = post.author?._id === currentUser?._id;
  const initial = post.author?.name?.charAt(0).toUpperCase() || '?';
  const authorAvatar = post.author?.avatar;

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

  const handleDelete = async () => {
    if (!confirm('Supprimer ce post ?')) return;
    setDeleting(true);
    try {
      await postService.deletePost(post._id);
      onDelete(post._id);
    } catch (err) { console.error(err); }
    setDeleting(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('content', editForm.content);
      if (editImage) formData.append('image', editImage);
      const res = await postService.updatePost(post._id, formData);
      onUpdate(res.data);
      setShowEditModal(false);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  return (
    <>
      <div className="post-card">
        {/* Header */}
        <div className="post-card-header">
          {authorAvatar ? (
            <img src={authorAvatar} alt={post.author?.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div className="post-avatar">{initial}</div>
          )}
          <div style={{ flex: 1 }}>
            <p className="post-author">{post.author?.name || 'Inconnu'}</p>
            <p className="post-date">{new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {/* Menu 3 points — visible uniquement pour l'auteur */}
          {isAuthor && (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowMenu(!showMenu)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px', borderRadius: '6px' }}>
                <FiMoreVertical size={16} />
              </button>
              {showMenu && (
                <div style={{ position: 'absolute', right: 0, top: '28px', background: 'white', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '140px' }}>
                  <button onClick={() => { setShowEditModal(true); setShowMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#333' }}>
                    <FiEdit2 size={13} /> Modifier
                  </button>
                  <button onClick={() => { handleDelete(); setShowMenu(false); }} disabled={deleting}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#e74c3c' }}>
                    <FiTrash2 size={13} /> {deleting ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="post-title">{post.title}</p>
        <p className="post-content">{post.content}</p>

        {post.image && post.image !== '' && (
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
          <input placeholder="Écrire un commentaire..." value={commentText}
            onChange={e => setCommentText(e.target.value)} />
          <button type="submit">Envoyer</button>
        </form>
      </div>

      {/* Modal Modifier post */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Modifier le post</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <input className="modal-input" type="text" placeholder="Titre"
                value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
              <textarea className="modal-textarea" placeholder="Contenu..."
                value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} />

              {editPreview && (
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <img src={editPreview} alt="preview"
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button type="button" onClick={() => { setEditImage(null); setEditPreview(null); }}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiX size={13} />
                  </button>
                </div>
              )}

              {!editPreview && (
                <button type="button" onClick={() => fileRef.current.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#f5f5f5', border: '1px dashed #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                  <FiImage size={14} /> Ajouter une photo
                </button>
              )}

              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => {
                  const f = e.target.files[0];
                  if (f) { setEditImage(f); setEditPreview(URL.createObjectURL(f)); }
                }} />

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Likes */}
      {showLikesModal && (
        <div className="modal-overlay" onClick={() => setShowLikesModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>❤️ Likes ({likes.length})</h2>
              <button className="modal-close" onClick={() => setShowLikesModal(false)}>✕</button>
            </div>
            <div className="modal-list">
              {likes.length === 0 ? <p className="modal-empty">Aucun like.</p>
                : likes.map((l, i) => (
                  <div key={i} className="modal-user-item">
                    {l.avatar ? (
                      <img src={l.avatar} alt={l.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div className="modal-user-avatar">{l.name?.charAt(0).toUpperCase()}</div>
                    )}
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
              {comments.length === 0 ? <p className="modal-empty">Aucun commentaire.</p>
                : comments.map((c, i) => (
                  <CommentItem key={c._id || i} c={c} currentUser={currentUser} postId={post._id}
                    onUpdate={setComments} editingId={editingId} editingText={editingText}
                    setEditingId={setEditingId} setEditingText={setEditingText} />
                ))}
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '8px' }}>
              <form onSubmit={handleComment} className="comment-input-row">
                <input placeholder="Écrire un commentaire..." value={commentText}
                  onChange={e => setCommentText(e.target.value)} />
                <button type="submit">Envoyer</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}