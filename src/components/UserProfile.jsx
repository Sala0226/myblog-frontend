import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiLock, FiEdit2, FiArrowLeft } from 'react-icons/fi';
import * as userService from '../services/user.service';
import * as postService from '../services/post.service';
import PostCard from './PostCard';
import ProfileAvatar from './ProfileAvatar';
import { FiPlus } from 'react-icons/fi';
import CreatePostModal from './CreatePostModal';
import '../styles/profile.css';
import '../styles/post.css';

export default function UserProfile({ currentUser, onUpdate, onBack }) {
  const [tab, setTab]           = useState('posts');
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const initial = currentUser?.name?.charAt(0).toUpperCase() || '?';

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  
const handlePostCreated = (newPost) => {
  setPosts(prev => [newPost, ...prev]);
};

  useEffect(() => {
    postService.getPostsByUser(currentUser._id)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const handleToggleVisibility = async (postId, currentStatus) => {
    try {
      await postService.toggleVisibility(postId);
      setPosts(prev => prev.map(p =>
        p._id === postId ? { ...p, isPublic: !p.isPublic } : p
      ));
    } catch (err) { console.error(err); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      showToast('Minimum 6 caractères', 'error');
      return;
    }
    setPwLoading(true);
    try {
      await userService.updatePassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword
      });
      showToast('Mot de passe mis à jour !', 'success');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur', 'error');
    } finally {
      setPwLoading(false);
    }
  };

  const publicPosts  = posts.filter(p => p.isPublic !== false);
  const privatePosts = posts.filter(p => p.isPublic === false);

  return (
    <div className="profile-page">

      {/* Cover */}
      <div className="profile-cover">
        <button onClick={onBack}
          style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', color: 'white', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
          <FiArrowLeft size={15} /> Retour
        </button>

         <button onClick={() => setShowModal(true)}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: 'none', borderRadius: '8px', color: '#534AB7', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          <FiPlus size={15} /> Créer un post
        </button>
      </div>

      {/* Card profil */}
      <div className="profile-card">
        <div className="profile-avatar-wrap">
          <ProfileAvatar user={currentUser} onUpdate={onUpdate} size="large" />
        </div>

        <div className="profile-info">
          <div>
            <p className="profile-name">{currentUser?.name}</p>
            <p className="profile-email">{currentUser?.email}</p>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{posts.length}</span>
                <span className="profile-stat-label">Posts</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{publicPosts.length}</span>
                <span className="profile-stat-label">Publics</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{privatePosts.length}</span>
                <span className="profile-stat-label">Privés</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {[
          { key: 'posts', label: 'Mes posts' },
          { key: 'settings', label: 'Paramètres' },
        ].map(t => (
          <button key={t.key} className={`profile-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ margin: '1rem 2rem 0', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', background: toast.type === 'success' ? '#eafaf1' : '#fdecea', color: toast.type === 'success' ? '#1a7a4a' : '#c0392b' }}>
          {toast.msg}
        </div>
      )}

      {/* Contenu */}
      <div className="profile-content">

        {/* Onglet Posts */}
        {tab === 'posts' && (
          <>
            {loading ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Chargement...</p>
            ) : posts.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Aucun post pour le moment.</p>
            ) : (
              <div className="posts-grid">
                {posts.map(post => (
                  <div key={post._id} style={{ position: 'relative' }}>
                    {/* Badge visibilité */}
                    <button
                      className={`visibility-badge ${post.isPublic !== false ? 'public' : 'private'}`}
                      onClick={() => handleToggleVisibility(post._id, post.isPublic)}
                      style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
                      {post.isPublic !== false
                        ? <><FiEye size={11} /> Public</>
                        : <><FiEyeOff size={11} /> Privé</>
                      }
                    </button>
                    <PostCard
                      post={post}
                      currentUser={currentUser}
                      onDelete={handleDeletePost}
                      onUpdate={handleUpdatePost}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Onglet Paramètres */}
        {tab === 'settings' && (
          <div style={{ maxWidth: '480px' }}>

            {/* Changer mot de passe */}
            <div className="settings-card">
              <h3><FiLock size={15} style={{ marginRight: '6px' }} />Changer le mot de passe</h3>
              <form onSubmit={handleUpdatePassword}>
                <input className="settings-input" type="password"
                  placeholder="Mot de passe actuel" required
                  value={pwForm.currentPassword}
                  onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
                <input className="settings-input" type="password"
                  placeholder="Nouveau mot de passe" required
                  value={pwForm.newPassword}
                  onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                <input className="settings-input" type="password"
                  placeholder="Confirmer le mot de passe" required
                  value={pwForm.confirm}
                  onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} />
                <button className="settings-btn" type="submit" disabled={pwLoading}>
                  {pwLoading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </form>
            </div>

          </div>
        )}
      </div>
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}