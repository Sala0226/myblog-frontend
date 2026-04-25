import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import * as postService from '../services/post.service';
import '../styles/dashboard.css';
import '../styles/post.css';

export default function Dashboard({ user, onLogout }) {
  const [posts, setPosts]         = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  useEffect(() => {
    postService.getPosts()
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>

      {/* Header */}
      <header className="header">
        <span className="header-logo">Dashboard</span>
        <div className="header-right">
          <button className="btn-create-post" onClick={() => setShowModal(true)}>
            + Créer un post
          </button>
          <div className="user-info">
            <div className="avatar">{initial}</div>
            <div>
              <p className="user-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </header>

      {/* Posts */}
      {loading ? (
        <div className="empty-state"><p>Chargement...</p></div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>Aucun post pour le moment.</p>
          <p>Sois le premier à publier !</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post._id} post={post} currentUser={user} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}