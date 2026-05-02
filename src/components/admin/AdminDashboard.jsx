import { useState, useEffect } from 'react';
import {
  FiUsers, FiFileText, FiImage, FiHeart,
  FiMessageSquare, FiArrowLeft, FiTrash2,
  FiBarChart2, FiSearch
} from 'react-icons/fi';
import * as adminService from '../../services/admin.service';
import '../../styles/admin.css';
import ConfirmModal from '../ConfirmModal';

// ── Sidebar ──────────────────────────────────────────────
function Sidebar({ tab, setTab, onBack }) {
  const items = [
    { key: 'stats',  label: 'Vue générale',  icon: <FiBarChart2 size={16} /> },
    { key: 'users',  label: 'Utilisateurs',  icon: <FiUsers size={16} /> },
    { key: 'posts',  label: 'Posts',          icon: <FiFileText size={16} /> },
    { key: 'images', label: 'Stockage images',icon: <FiImage size={16} /> },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img src="/logo.png" alt="MyBlog" />
        <div>
          <span>MyBlog</span>
          <small>Back Office</small>
        </div>
      </div>

      <nav className="admin-nav">
        {items.map(item => (
          <button key={item.key}
            className={`admin-nav-item ${tab === item.key ? 'active' : ''}`}
            onClick={() => setTab(item.key)}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-back-btn" onClick={onBack}>
          <FiArrowLeft size={14} /> Retour au blog
        </button>
      </div>
    </div>
  );
}

// ── Stats ─────────────────────────────────────────────────
function StatsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.getStats().then(res => setStats(res.data));
  }, []);

  const cards = [
    { label: 'Utilisateurs',   value: stats?.totalUsers,    icon: <FiUsers size={20} />,        bg: '#EEEDFE', color: '#534AB7' },
    { label: 'Posts',          value: stats?.totalPosts,    icon: <FiFileText size={20} />,     bg: '#EAF3DE', color: '#3B6D11' },
    { label: 'Likes',          value: stats?.totalLikes,    icon: <FiHeart size={20} />,        bg: '#FCEBEB', color: '#A32D2D' },
    { label: 'Commentaires',   value: stats?.totalComments, icon: <FiMessageSquare size={20} />,bg: '#E6F1FB', color: '#185FA5' },
    { label: 'Posts avec image', value: stats?.postsWithImage, icon: <FiImage size={20} />,    bg: '#FAEEDA', color: '#854F0B' },
  ];

  return (
    <>
      <div className="admin-header">
        <h1>Vue générale</h1>
        <p>Statistiques globales de MyBlog</p>
      </div>

      <div className="admin-stats">
        {cards.map((c, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: c.bg, color: c.color }}>
              {c.icon}
            </div>
            <div>
              <p className="admin-stat-value">{c.value ?? '—'}</p>
              <p className="admin-stat-label">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Croissance users */}
      {stats?.userGrowth?.length > 0 && (
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h2>Inscriptions récentes</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Nouveaux users</th>
              </tr>
            </thead>
            <tbody>
              {stats.userGrowth.map((d, i) => (
                <tr key={i}>
                  <td>{new Date(d._id).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td><span className="admin-badge purple">+{d.count}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── Users ─────────────────────────────────────────────────
function UsersSection() {
  const [users, setUsers]           = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);

  const [confirmModal, setConfirmModal] = useState(null);

  const fetchData = (p = 1, q = search) => {
    setLoading(true);
    adminService.getUsers(p, q)
      .then(res => { setUsers(res.data.users); setPagination(res.data.pagination); setPage(p); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(1, ''); }, []);
  useEffect(() => {
    const t = setTimeout(() => fetchData(1, search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = (userId) => {
  setConfirmModal({
    message: 'Supprimer cet utilisateur et tous ses posts ?',
    onConfirm: async () => {
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      setConfirmModal(null);
    }
  });
};
  return (
    <>
      <div className="admin-header">
        <h1>Utilisateurs</h1>
        <p>{pagination?.total || 0} utilisateurs inscrits</p>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>Liste des utilisateurs</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <FiSearch size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input className="admin-search" style={{ paddingLeft: '30px', width: '100%', boxSizing: 'border-box' }}
              placeholder="Rechercher..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Chargement...</p>
        ) : users.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Aucun utilisateur trouvé.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="admin-desktop-only">
              <table>
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Posts</th>
                    <th>Likes</th>
                    <th>Commentaires</th>
                    <th>Inscrit le</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="admin-user-cell">
                          {u.avatar ? <img src={u.avatar} alt={u.name} className="admin-user-avatar" />
                            : <div className="admin-user-initial">{u.name?.charAt(0).toUpperCase()}</div>}
                          <span style={{ fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#888' }}>{u.email}</td>
                      <td><span className="admin-badge purple">{u.postCount}</span></td>
                      <td><span className="admin-badge green">{u.likeCount}</span></td>
                      <td><span className="admin-badge gray">{u.commentCount}</span></td>
                      <td style={{ color: '#888', fontSize: '13px' }}>
                        {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <button className="admin-delete-btn" onClick={() => handleDelete(u._id)}>
                          <FiTrash2 size={12} /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="admin-mobile-only" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {users.map(u => (
                <div key={u._id} style={{ background: '#fafafa', borderRadius: '10px', padding: '12px', border: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {u.avatar ? <img src={u.avatar} alt={u.name} className="admin-user-avatar" />
                        : <div className="admin-user-initial">{u.name?.charAt(0).toUpperCase()}</div>}
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{u.name}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{u.email}</p>
                      </div>
                    </div>
                    <button className="admin-delete-btn" onClick={() => handleDelete(u._id)}>
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="admin-badge purple">{u.postCount} posts</span>
                    <span className="admin-badge green">{u.likeCount} likes</span>
                    <span className="admin-badge gray">{u.commentCount} commentaires</span>
                    <span style={{ fontSize: '11px', color: '#aaa', alignSelf: 'center' }}>
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="admin-pagination">
            <button className="admin-page-btn" disabled={page === 1} onClick={() => fetchData(page - 1)}>‹</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`admin-page-btn ${n === page ? 'active' : ''}`} onClick={() => fetchData(n)}>{n}</button>
            ))}
            <button className="admin-page-btn" disabled={page === pagination.totalPages} onClick={() => fetchData(page + 1)}>›</button>
          </div>
        )}
      </div>
      
      {confirmModal && (
  <ConfirmModal
    message={confirmModal.message}
    onConfirm={confirmModal.onConfirm}
    onCancel={() => setConfirmModal(null)}
  />
)}
    </>
  );
}

// ── Posts ─────────────────────────────────────────────────
function PostsSection() {
  const [posts, setPosts]           = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);

  const [confirmModal, setConfirmModal] = useState(null);

  const fetchData = (p = 1, q = search) => {
    setLoading(true);
    adminService.getPosts(p, q)
      .then(res => { setPosts(res.data.posts); setPagination(res.data.pagination); setPage(p); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(1, ''); }, []);
  useEffect(() => {
    const t = setTimeout(() => fetchData(1, search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = (postId) => {
  setConfirmModal({
    message: 'Supprimer ce post définitivement ?',
    onConfirm: async () => {
      await adminService.deletePost(postId);
      setPosts(prev => prev.filter(p => p._id !== postId));
      setConfirmModal(null);
    }
  });
};

  return (
    <>
      <div className="admin-header">
        <h1>Posts</h1>
        <p>{pagination?.total || 0} posts publiés</p>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>Liste des posts</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <FiSearch size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input className="admin-search" style={{ paddingLeft: '30px', width: '100%', boxSizing: 'border-box' }}
              placeholder="Rechercher..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Chargement...</p>
        ) : posts.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Aucun post trouvé.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="admin-desktop-only">
              <table>
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Visibilité</th>
                    <th>Likes</th>
                    <th>Commentaires</th>
                    <th>Image</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 500, maxWidth: '160px' }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </span>
                      </td>
                      <td>
                        <div className="admin-user-cell">
                          {p.author?.avatar
                            ? <img src={p.author.avatar} alt={p.author.name} className="admin-user-avatar" />
                            : <div className="admin-user-initial">{p.author?.name?.charAt(0).toUpperCase()}</div>
                          }
                          <span>{p.author?.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${p.isPublic !== false ? 'green' : 'gray'}`}>
                          {p.isPublic !== false ? 'Public' : 'Privé'}
                        </span>
                      </td>
                      <td><span className="admin-badge purple">{p.likes?.length || 0}</span></td>
                      <td><span className="admin-badge gray">{p.comments?.length || 0}</span></td>
                      <td>
                        {p.image
                          ? <img src={p.image} alt="post" style={{ width: '40px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                          : <span style={{ color: '#ccc', fontSize: '12px' }}>—</span>
                        }
                      </td>
                      <td style={{ color: '#888', fontSize: '13px' }}>
                        {new Date(p.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <button className="admin-delete-btn" onClick={() => handleDelete(p._id)}>
                          <FiTrash2 size={12} /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="admin-mobile-only" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {posts.map(p => (
                <div key={p._id} style={{ background: '#fafafa', borderRadius: '10px', padding: '12px', border: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                      <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {p.author?.avatar
                          ? <img src={p.author.avatar} alt={p.author.name} style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} />
                          : <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#534AB7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600 }}>
                              {p.author?.name?.charAt(0).toUpperCase()}
                            </div>
                        }
                        <span style={{ fontSize: '12px', color: '#888' }}>{p.author?.name}</span>
                      </div>
                    </div>
                    <button className="admin-delete-btn" onClick={() => handleDelete(p._id)}>
                      <FiTrash2 size={12} />
                    </button>
                  </div>

                  {p.image && (
                    <img src={p.image} alt="post"
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />
                  )}

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className={`admin-badge ${p.isPublic !== false ? 'green' : 'gray'}`}>
                      {p.isPublic !== false ? 'Public' : 'Privé'}
                    </span>
                    <span className="admin-badge purple">{p.likes?.length || 0} likes</span>
                    <span className="admin-badge gray">{p.comments?.length || 0} commentaires</span>
                    <span style={{ fontSize: '11px', color: '#aaa' }}>
                      {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="admin-pagination">
            <button className="admin-page-btn" disabled={page === 1} onClick={() => fetchData(page - 1)}>‹</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`admin-page-btn ${n === page ? 'active' : ''}`} onClick={() => fetchData(n)}>{n}</button>
            ))}
            <button className="admin-page-btn" disabled={page === pagination.totalPages} onClick={() => fetchData(page + 1)}>›</button>
          </div>
        )}
      </div>

{confirmModal && (
  <ConfirmModal
    message={confirmModal.message}
    onConfirm={confirmModal.onConfirm}
    onCancel={() => setConfirmModal(null)}
  />
)}
    </>
  );
}

// ── Images ────────────────────────────────────────────────
function ImagesSection() {
  const [data, setData]     = useState(null);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const fetch = (p = 1) => {
    setLoading(true);
    adminService.getImages(p)
      .then(res => { setData(res.data); setPage(p); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1); }, []);

  return (
    <>
      <div className="admin-header">
        <h1>Stockage images</h1>
        <p>Toutes les images uploadées sur MyBlog</p>
      </div>

      {/* Sous-tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        {[
          { key: 'posts',   label: `Images posts (${data?.postImages?.length || 0})` },
          { key: 'avatars', label: `Avatars (${data?.avatars?.length || 0})` },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '8px 16px', border: '1px solid', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              borderColor:  activeTab === t.key ? '#534AB7' : '#ddd',
              background:   activeTab === t.key ? '#534AB7' : 'white',
              color:        activeTab === t.key ? 'white'   : '#555'
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>Chargement...</p>
      ) : (
        <div className="admin-table-wrap">
          {activeTab === 'posts' && (
            <>
              <div className="admin-images-grid">
                {data?.postImages?.length === 0 ? (
                  <p style={{ padding: '2rem', color: '#888' }}>Aucune image de post.</p>
                ) : data?.postImages?.map((p, i) => (
                  <div key={i} className="admin-image-card">
                    <img src={p.image} alt={p.title} />
                    <div className="admin-image-info">
                      {p.author?.avatar
                        ? <img src={p.author.avatar} alt={p.author.name} />
                        : <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#534AB7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600, flexShrink: 0 }}>
                            {p.author?.name?.charAt(0).toUpperCase()}
                          </div>
                      }
                      <div style={{ overflow: 'hidden' }}>
                        <span style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                        <span style={{ fontSize: '11px', color: '#aaa' }}>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {data?.pagination?.totalPages > 1 && (
                <div className="admin-pagination">
                  <button className="admin-page-btn" disabled={page === 1} onClick={() => fetch(page - 1)}>‹</button>
                  {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} className={`admin-page-btn ${n === page ? 'active' : ''}`} onClick={() => fetch(n)}>{n}</button>
                  ))}
                  <button className="admin-page-btn" disabled={page === data.pagination.totalPages} onClick={() => fetch(page + 1)}>›</button>
                </div>
              )}
            </>
          )}

          {activeTab === 'avatars' && (
            <div className="admin-images-grid">
              {data?.avatars?.length === 0 ? (
                <p style={{ padding: '2rem', color: '#888' }}>Aucun avatar uploadé.</p>
              ) : data?.avatars?.map((u, i) => (
                <div key={i} className="admin-image-card">
                  <img src={u.avatar} alt={u.name} style={{ height: '130px', objectFit: 'cover' }} />
                  <div className="admin-image-info">
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#333' }}>{u.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ── Main AdminDashboard ───────────────────────────────────
export default function AdminDashboard({ onBack }) {
  const [tab, setTab]               = useState('stats');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'stats',  label: 'Vue générale',    icon: <FiBarChart2 size={16} /> },
    { key: 'users',  label: 'Utilisateurs',    icon: <FiUsers size={16} /> },
    { key: 'posts',  label: 'Posts',            icon: <FiFileText size={16} /> },
    { key: 'images', label: 'Stockage images',  icon: <FiImage size={16} /> },
  ];

  const handleNavClick = (key) => {
    setTab(key);
    setMobileMenuOpen(false);
  };

  return (
  <div className="admin-page">

    {/* Sidebar desktop uniquement */}
    <Sidebar tab={tab} setTab={setTab} onBack={onBack} />

    {/* Overlay sombre quand menu ouvert */}
    {mobileMenuOpen && (
      <div className="admin-overlay open"
        onClick={() => setMobileMenuOpen(false)} />
    )}

    {/* Drawer mobile */}
    <div className={`admin-mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
      <div className="admin-mobile-nav-logo">
        <img src="/logo.png" alt="MyBlog" />
        <div>
          <p>MyBlog</p>
          <p>Back Office</p>
        </div>
      </div>
      <nav className="admin-nav">
        {navItems.map(item => (
          <button key={item.key}
            className={`admin-nav-item ${tab === item.key ? 'active' : ''}`}
            onClick={() => handleNavClick(item.key)}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      <div className="admin-mobile-nav-footer">
        <button className="admin-back-btn" onClick={onBack}>
          <FiArrowLeft size={14} /> Retour au blog
        </button>
      </div>
    </div>

    {/* Header mobile sticky */}
    <div className="admin-mobile-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button className="admin-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span><span></span><span></span>
        </button>
        <span style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>
          {navItems.find(n => n.key === tab)?.label}
        </span>
      </div>
      <img src="/logo.png" alt="MyBlog" style={{ height: '28px' }} />
    </div>

    {/* Contenu — prend toute la largeur sur mobile */}
    <main className="admin-main">
      {tab === 'stats'  && <StatsSection />}
      {tab === 'users'  && <UsersSection />}
      {tab === 'posts'  && <PostsSection />}
      {tab === 'images' && <ImagesSection />}
    </main>

  </div>
);
}
