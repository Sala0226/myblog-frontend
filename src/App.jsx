import { useState, useEffect } from 'react';
import RegisterForm   from './components/RegisterForm';
import LoginForm      from './components/LoginForm';
import Dashboard      from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword  from './components/ResetPassword';
import AdminDashboard from './components/admin/AdminDashboard';
import SplashScreen   from './components/SplashScreen';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com';

export default function App() {
  // 1. Initialisation des états
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const [showSplash, setShowSplash] = useState(true);

  const getInitialPage = () => {
    const path = window.location.pathname;
    if (path.startsWith('/reset-password/')) return 'reset';
    if (savedUser) return 'dashboard';
    return 'register';
  };

  const getToken = () => {
    const path = window.location.pathname;
    if (path.startsWith('/reset-password/')) {
      return path.replace('/reset-password/', '');
    }
    return null;
  };

  const [page, setPage]           = useState(getInitialPage());
  const [user, setUser]           = useState(savedUser || null);
  const [resetToken]              = useState(getToken());
  const [showAdmin, setShowAdmin] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  // 2. Gestion des effets (History API)
  useEffect(() => {
    if (page === 'dashboard') {
      window.history.pushState(null, '', '/');
      const handlePopState = () => {
        window.history.pushState(null, '', '/');
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [page]);

  // 3. Fonctions de navigation
  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setPage('dashboard');
    window.history.pushState({}, '', '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setPage('login');
    setShowAdmin(false);
  };

  const goLogin = () => {
    setPage('login');
    window.history.pushState({}, '', '/');
  };

  // 4. RENDU CONDITIONNEL (Toujours après les hooks)
  
  // Affiche le Splash Screen en priorité s'il est actif
  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  // Dashboard Admin
  if (showAdmin && isAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  // Dashboard Utilisateur
  if (page === 'dashboard') {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        onAdmin={isAdmin ? () => setShowAdmin(true) : null}
      />
    );
  }

  // Pages d'authentification
  if (page === 'reset')  return <ResetPassword token={resetToken} onGoLogin={goLogin} />;
  if (page === 'forgot') return <ForgotPassword onGoLogin={goLogin} />;
  if (page === 'login')  return (
    <LoginForm
      onLoginSuccess={handleLoginSuccess}
      onGoRegister={() => setPage('register')}
      onForgot={() => setPage('forgot')}
    />
  );

  return <RegisterForm onGoLogin={goLogin} />;
}