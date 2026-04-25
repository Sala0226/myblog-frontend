import { useState } from 'react';
import * as authService from '../services/auth.service';
import '../styles/auth.css';

export default function LoginForm({ onLoginSuccess, onGoRegister }) {
  const [data, setData] = useState({ email: '', password: '' });
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
      const res = await authService.login(data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur de connexion', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Connexion</h1>

        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

        <form onSubmit={handleSubmit}>
          <input className="input" type="email" placeholder="Email" required
            value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
          <input className="input" type="password" placeholder="Mot de passe" required
            value={data.password} onChange={e => setData({ ...data, password: e.target.value })} />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>

        <div className="link">
          Pas de compte ? <span onClick={onGoRegister}>S'inscrire</span>
        </div>
      </div>
    </div>
  );
}