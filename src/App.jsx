import { useState, useEffect } from 'react';
import RegisterForm   from './components/RegisterForm';
import LoginForm      from './components/LoginForm';
import Dashboard      from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword  from './components/ResetPassword';
import AdminDashboard from './components/admin/AdminDashboard';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com';

export default function App() {
  const savedUser = JSON.parse(localStorage.getItem('user'));

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

  // ← useEffect TOUJOURS avant les return conditionnels
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

  // ← Tous les return conditionnels APRÈS les hooks
  if (showAdmin && isAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  if (page === 'dashboard') {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        onAdmin={isAdmin ? () => setShowAdmin(true) : null}
      />
    );
  }

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