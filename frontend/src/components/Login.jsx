import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const endpoint = isRegistering ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
    const payload = isRegistering ? { username, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      if (isRegistering) {
        setSuccessMsg('Registration successful! Please log in.');
        setIsRegistering(false);
      } else {
        localStorage.setItem('token', data.token);
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-md border border-gray-700">
        <h2 className="mb-6 text-center text-2xl font-bold">
          {isRegistering ? 'Create Account' : 'Body Tracker Login'}
        </h2>
        {error && <div className="mb-4 rounded bg-red-500/20 border border-red-500 p-3 text-sm text-red-300">{error}</div>}
        {successMsg && <div className="mb-4 rounded bg-green-500/20 border border-green-500 p-3 text-sm text-green-300">{successMsg}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-2 text-white font-semibold hover:bg-indigo-700 transition"
          >
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }}
            className="text-sm text-indigo-400 hover:underline"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}