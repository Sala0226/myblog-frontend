import { useState } from 'react';
import * as authService from '../services/auth.service';
import '../styles/auth.css';

export default function ResetPassword({ token, onGoLogin }) {
  const [form, setForm]       = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [done, setDone]       = useState(false);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    if (form.password.length < 6) {
      showToast('Minimum 6 caractères', 'error');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, { password: form.password });
      setDone(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Nouveau mot de passe</h1>

        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

        {done ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: '#534AB7', fontWeight: 600 }}>
              Mot de passe réinitialisé !
            </p>
            <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
              Tu peux maintenant te connecter avec ton nouveau mot de passe.
            </p>
            <button className="btn" onClick={onGoLogin} style={{ marginTop: '1.5rem' }}>
              Se connecter
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input className="input" type="password" placeholder="Nouveau mot de passe" required
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <input className="input" type="password" placeholder="Confirmer le mot de passe" required
              value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Réinitialisation...' : 'Réinitialiser'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}