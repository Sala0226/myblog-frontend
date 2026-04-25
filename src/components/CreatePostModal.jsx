import { useState } from 'react';
import * as postService from '../services/post.service';
import '../styles/post.css';

export default function CreatePostModal({ onClose, onPostCreated }) {
  const [form, setForm]     = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Titre et contenu requis.');
      return;
    }
    setLoading(true);
    try {
      const res = await postService.createPost(form);
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

        {error && (
          <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '10px' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="text"
            placeholder="Titre"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="modal-textarea"
            placeholder="Contenu..."
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
          />
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