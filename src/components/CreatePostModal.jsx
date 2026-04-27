import { useState, useRef } from 'react';
import { FiImage, FiX } from 'react-icons/fi';
import * as postService from '../services/post.service';
import '../styles/post.css';

export default function CreatePostModal({ onClose, onPostCreated }) {
  const [form, setForm]         = useState({ title: '', content: '' });
  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const fileRef                 = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Titre et contenu requis.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      if (image) formData.append('image', image);

      const res = await postService.createPost(formData);
      onPostCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Créer un post</h2>

        {error && <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input className="modal-input" type="text" placeholder="Titre"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />

          <textarea className="modal-textarea" placeholder="Contenu..."
            value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />

          {/* Preview image */}
          {preview && (
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <img src={preview} alt="preview"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              <button type="button" onClick={removeImage}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiX size={14} />
              </button>
            </div>
          )}

          {/* Bouton ajouter image */}
          {!preview && (
            <button type="button" onClick={() => fileRef.current.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#f5f5f5', border: '1px dashed #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#666', marginBottom: '12px' }}>
              <FiImage size={15} /> Ajouter une photo
            </button>
          )}

          <input ref={fileRef} type="file" accept="image/*"
            onChange={handleImage} style={{ display: 'none' }} />

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}