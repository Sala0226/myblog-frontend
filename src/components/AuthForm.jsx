import { useState } from 'react';
import * as authService from '../services/auth.service';

export default function AuthForm() {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(loginData);
      localStorage.setItem('token', res.data.token);
      showToast('Connexion réussie !', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur de connexion', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(registerData);
      showToast('Compte créé ! Tu peux te connecter.', 'success');
      setTab('login');
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur inscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '22px' }}>
          {tab === 'login' ? 'Connexion' : 'Inscription'}
        </h1>

        {toast && (
          <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '1rem', background: toast.type === 'success' ? '#eafaf1' : '#fdecea', color: toast.type === 'success' ? '#1a7a4a' : '#c0392b', fontSize: '14px' }}>
            {toast.msg}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '8px', border: '1px solid', borderColor: tab === t ? '#534AB7' : '#ddd', borderRadius: '8px', background: tab === t ? '#534AB7' : 'white', color: tab === t ? 'white' : '#666', cursor: 'pointer', fontWeight: 500 }}>
              {t === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" required value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              style={inputStyle} />
            <input type="password" placeholder="Mot de passe" required value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              style={inputStyle} />
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Chargement...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Nom complet" required value={registerData.name}
              onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
              style={inputStyle} />
            <input type="email" placeholder="Email" required value={registerData.email}
              onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
              style={inputStyle} />
            <input type="password" placeholder="Mot de passe" required value={registerData.password}
              onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              style={inputStyle} />
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Chargement...' : "Créer le compte"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', marginBottom: '12px',
  border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px',
  boxSizing: 'border-box', outline: 'none'
};

const btnStyle = {
  width: '100%', padding: '11px', background: '#534AB7', color: 'white',
  border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 500,
  cursor: 'pointer', marginTop: '4px'
};