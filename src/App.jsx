import { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

export default function App() {
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const [page, setPage] = useState(savedUser ? 'dashboard' : 'register');
  const [user, setUser] = useState(savedUser || null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  if (page === 'dashboard') return <Dashboard user={user} onLogout={() => { setUser(null); setPage('login'); }} />;
  if (page === 'login')     return <LoginForm onLoginSuccess={handleLoginSuccess} onGoRegister={() => setPage('register')} />;
  return <RegisterForm onGoLogin={() => setPage('login')} />;
}