import { useRef, useState, useEffect } from 'react';
import { FiCamera, FiTrash2 } from 'react-icons/fi';
import * as userService from '../services/user.service';

export default function ProfileAvatar({ user, onUpdate, size = 'small' }) {
  const [loading, setLoading]   = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileRef = useRef();

  const initial    = user?.name?.charAt(0).toUpperCase() || '?';
  const avatarSize = size === 'large' ? '96px' : '36px';
  const fontSize   = size === 'large' ? '36px' : '15px';
  const cameraSize = size === 'large' ? 22 : 9;
  const cameraWrap = size === 'large' ? '28px' : '16px';

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setShowMenu(false);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await userService.updateAvatar(formData);
      const saved   = JSON.parse(localStorage.getItem('user'));
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
      const saved   = JSON.parse(localStorage.getItem('user'));
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
      <div onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
        style={{ cursor: 'pointer' }}>
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar"
            style={{
              width: avatarSize, height: avatarSize,
              borderRadius: '50%', objectFit: 'cover',
              border: size === 'large' ? '4px solid white' : 'none',
              boxShadow: size === 'large' ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
              display: 'block'
            }} />
        ) : (
          <div style={{
            width: avatarSize, height: avatarSize,
            borderRadius: '50%', background: '#534AB7', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '600', fontSize: fontSize,
            border: size === 'large' ? '4px solid white' : 'none',
            boxShadow: size === 'large' ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
          }}>
            {initial}
          </div>
        )}

        {/* Icône caméra */}
        <div style={{
          position: 'absolute',
          bottom: size === 'large' ? '2px' : '-2px',
          right:  size === 'large' ? '2px' : '-2px',
          background: '#534AB7', borderRadius: '50%',
          width: cameraWrap, height: cameraWrap,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid white'
        }}>
          {loading
            ? <div style={{ width: size === 'large' ? '12px' : '8px', height: size === 'large' ? '12px' : '8px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            : <FiCamera size={cameraSize} color="white" />
          }
        </div>
      </div>

      {/* Menu */}
      {showMenu && (
        <div style={{
          position: 'absolute', right: 0,
          top: size === 'large' ? '104px' : '44px',
          background: 'white', border: '1px solid #eee',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 100, minWidth: '160px'
        }}>
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