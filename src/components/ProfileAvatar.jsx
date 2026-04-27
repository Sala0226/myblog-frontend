import { useRef, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import * as userService from '../services/user.service';

export default function ProfileAvatar({ user, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await userService.updateAvatar(formData);
      // Met à jour le localStorage
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const updated = { ...savedUser, avatar: res.data.user.avatar };
      localStorage.setItem('user', JSON.stringify(updated));
      onUpdate(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
      onClick={() => fileRef.current.click()}>

      {user?.avatar ? (
        <img src={user.avatar} alt="avatar"
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div className="avatar">{initial}</div>
      )}

      {/* Icône caméra */}
      <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#534AB7', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white' }}>
        {loading ? (
          <div style={{ width: '8px', height: '8px', border: '1px solid white', borderTop: '1px solid transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        ) : (
          <FiCamera size={9} color="white" />
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*"
        onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
}