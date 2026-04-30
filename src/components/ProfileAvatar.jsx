import { useRef, useState, useEffect } from 'react';
import { FiCamera, FiTrash2 } from 'react-icons/fi';
import * as userService from '../services/user.service';

export default function ProfileAvatar({ user, onUpdate }) {
  const [loading, setLoading]   = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileRef = useRef();

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setShowMenu(false);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await userService.updateAvatar(formData);
      const saved = JSON.parse(localStorage.getItem('user'));
      const updated = { ...saved, avatar: res.data.user.avatar };
      localStorage.setItem('user', JSON.stringify(updated));
      onUpdate(updated);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    setLoading(true);
    try {
      await userService.deleteAvatar();
      const saved = JSON.parse(localStorage.getItem('user'));
      const updated = { ...saved, avatar: '' };
      localStorage.setItem('user', JSON.stringify(updated));
      onUpdate(updated);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
  const handleClickOutside = () => setShowMenu(false);
  if (showMenu) document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, [showMenu]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>

      {/* Avatar */}
      <div onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} style={{ cursor: 'pointer' }}>
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar"
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div className="avatar">{initial}</div>
        )}
        {/* Icône caméra */}
        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#534AB7', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white' }}>
          {loading
            ? <div style={{ width: '8px', height: '8px', border: '1px solid white', borderTop: '1px solid transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            : <FiCamera size={9} color="white" />
          }
        </div>
      </div>

      {/* Menu */}
      {showMenu && (
        <div style={{ position: 'absolute', right: 0, top: '44px', background: 'white', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '160px' }}>
          <button onClick={() => { fileRef.current.click(); setShowMenu(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#333' }}>
            <FiCamera size={13} /> Changer la photo
          </button>
          {user?.avatar && (
            <button onClick={handleDelete}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#e74c3c' }}>
              <FiTrash2 size={13} /> Supprimer la photo
            </button>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*"
        onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
}