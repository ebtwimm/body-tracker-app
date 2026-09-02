import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return isAuthenticated ? (
    <Dashboard />
  ) : (
    <Login onLoginSuccess={() => setIsAuthenticated(true)} />
  );
}