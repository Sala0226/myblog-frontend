import { useState, useEffect } from 'react';
import RegisterForm   from './components/RegisterForm';
import LoginForm      from './components/LoginForm';
import Dashboard      from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword  from './components/ResetPassword';

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

  const [page, setPage] = useState(getInitialPage());
  const [user, setUser] = useState(savedUser || null);
  const [resetToken, setResetToken] = useState(getToken());

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage('dashboard');
    window.history.pushState({}, '', '/');
  };

  const goLogin = () => {
    setPage('login');
    window.history.pushState({}, '', '/');
  };

  if (page === 'dashboard')  return <Dashboard user={user} onLogout={() => { setUser(null); setPage('login'); }} />;
  if (page === 'reset')      return <ResetPassword token={resetToken} onGoLogin={goLogin} />;
  if (page === 'forgot')     return <ForgotPassword onGoLogin={goLogin} />;
  if (page === 'login')      return <LoginForm onLoginSuccess={handleLoginSuccess} onGoRegister={() => setPage('register')} onForgot={() => setPage('forgot')} />;
  return <RegisterForm onGoLogin={goLogin} />;
}