import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

const TestPage = () => {
  const { isAdmin, login, logout, adminUser } = useAdminAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const result = await login(email, password);
    setMessage(result.message);
  };

  const handleLogout = () => {
    logout();
    setMessage('Çıkış yapıldı');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Test Sayfası</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Admin Durumu</h2>
        <p className="mb-2">Admin Girişi: {isAdmin() ? '✅ Giriş yapılmış' : '❌ Giriş yapılmamış'}</p>
        
        {adminUser && (
          <div className="mb-4 p-3 bg-green-100 rounded">
            <p><strong>Kullanıcı:</strong> {adminUser.name}</p>
            <p><strong>Email:</strong> {adminUser.email}</p>
            <p><strong>Rol:</strong> {adminUser.role}</p>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-blue-100 rounded">
            {message}
          </div>
        )}

        {!isAdmin() ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Giriş Yap</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Şifre:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Giriş Yap
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Çıkış Yap
            </button>
            <a
              href="/admin"
              target="_blank"
              className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Admin Paneline Git
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage; 
