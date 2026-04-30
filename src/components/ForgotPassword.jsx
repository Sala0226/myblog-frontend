import { useState } from 'react';
import * as authService from '../services/auth.service';
import '../styles/auth.css';

export default function ForgotPassword({ onGoLogin }) {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState(null);
  const [sent, setSent]     = useState(false);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Mot de passe oublié</h1>

        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: '#534AB7', fontWeight: 600 }}>
              Email envoyé !
            </p>
            <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
              Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
            </p>
            <button className="btn" onClick={onGoLogin} style={{ marginTop: '1.5rem' }}>
              Retour à la connexion
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '1.25rem' }}>
              Saisis ton email et on t'enverra un lien pour réinitialiser ton mot de passe.
            </p>
            <form onSubmit={handleSubmit}>
              <input className="input" type="email" placeholder="Email" required
                value={email} onChange={e => setEmail(e.target.value)} />
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>
            <div className="link">
              <span onClick={onGoLogin}>← Retour à la connexion</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}