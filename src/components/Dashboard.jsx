import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import * as postService from '../services/post.service';
import '../styles/dashboard.css';
import '../styles/post.css';

export default function Dashboard({ user, onLogout }) {
  const [posts, setPosts]         = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const fetchPosts = (p = 1) => {
    setLoading(true);
    postService.getPosts(p)
      .then(res => {
        setPosts(res.data.posts);
        setPagination(res.data.pagination);
        setPage(p);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(1); }, []);

  const handlePostCreated = (newPost) => {
    fetchPosts(1); // Recharge page 1 après création
  };

  // Filtre local sur les posts de la page courante
  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.content?.toLowerCase().includes(q) ||
      p.author?.name?.toLowerCase().includes(q)
    );
  }, [search, posts]);

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  // Génère les numéros de pages
  const pageNumbers = pagination
    ? Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
    : [];

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

        <div className="header-mobile">
          <div className="avatar">{initial}</div>
          <button className="burger-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>
      </header>

      {/* Burger menu mobile */}
      {menuOpen && (
        <div className="burger-menu">
          <div className="burger-user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
          <button className="burger-item" onClick={() => { setShowModal(true); setMenuOpen(false); }}>
            + Créer un post
          </button>
          <button className="burger-item logout" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      )}

      {/* Recherche */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par titre, contenu ou auteur..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <FiX size={14} />
            </button>
          )}
        </div>
        <span className="search-count">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="empty-state"><p>Chargement...</p></div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          {search ? (
            <>
              <p style={{ fontSize: '24px' }}>🔍</p>
              <p>Aucun post trouvé pour <strong>"{search}"</strong></p>
              <button onClick={() => setSearch('')}
                style={{ marginTop: '12px', padding: '8px 16px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                Effacer la recherche
              </button>
            </>
          ) : (
            <>
              <p>Aucun post pour le moment.</p>
              <p>Sois le premier à publier !</p>
            </>
          )}
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <PostCard key={post._id} post={post} currentUser={user} />
          ))}
        </div>
      )}

      {/* Pagination — cachée si recherche active */}
      {!search && pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          {/* Précédent */}
          <button
            className="page-btn arrow"
            disabled={!pagination.hasPrev}
            onClick={() => fetchPosts(page - 1)}>
            ‹
          </button>

          {/* Numéros */}
          {pageNumbers.map(n => (
            <button
              key={n}
              className={`page-btn ${n === page ? 'active' : ''}`}
              onClick={() => fetchPosts(n)}>
              {n}
            </button>
          ))}

          {/* Suivant */}
          <button
            className="page-btn arrow"
            disabled={!pagination.hasNext}
            onClick={() => fetchPosts(page + 1)}>
            ›
          </button>

          <span className="page-info">
            Page {page} / {pagination.totalPages}
          </span>
        </div>
      )}

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}