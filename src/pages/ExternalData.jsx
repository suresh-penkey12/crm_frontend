import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ExternalData() {
  const [data, setData] = useState([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/external-data', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">External API Data</h2>
        <div>
          <button
            onClick={() => navigate('/')}
            className="mr-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((user) => (
          <div key={user.id} className="p-4 bg-white shadow rounded transition hover:scale-105">
            <h3 className="font-bold">{user.name}</h3>
            <p>{user.address.city}</p>
            <p className="text-sm text-gray-500">{user.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
