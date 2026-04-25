import { useState } from 'react';
import * as authService from '../services/auth.service';
import '../styles/auth.css';

export default function RegisterForm({ onGoLogin }) {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(data);
      showToast('Compte créé ! Connecte-toi.', 'success');
      setTimeout(() => onGoLogin(), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur inscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Inscription</h1>

        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

        <form onSubmit={handleSubmit}>
          <input className="input" type="text" placeholder="Nom complet" required
            value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
          <input className="input" type="email" placeholder="Email" required
            value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
          <input className="input" type="password" placeholder="Mot de passe" required
            value={data.password} onChange={e => setData({ ...data, password: e.target.value })} />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'Créer le compte'}
          </button>
        </form>

        <div className="link">
          Déjà un compte ? <span onClick={onGoLogin}>Se connecter</span>
        </div>
      </div>
    </div>
  );
}