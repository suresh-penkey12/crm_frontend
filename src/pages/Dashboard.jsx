import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    dateOfContact: '',
    level: 'Hot',
    notes: '',
  });

  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const fetchLeads = async () => {
    const res = await fetch('http://localhost:5000/leads', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLeads(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:5000/leads/${editingId}`
      : 'http://localhost:5000/leads';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({
        firstName: '',
        lastName: '',
        age: '',
        dateOfContact: '',
        level: 'Hot',
        notes: '',
      });
      setEditingId(null);
      fetchLeads();
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/leads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLeads();
  };

  const handleEdit = (lead) => {
    setForm({
      firstName: lead.firstName,
      lastName: lead.lastName,
      age: lead.age,
      dateOfContact: lead.dateOfContact.slice(0, 10),
      level: lead.level,
      notes: lead.notes,
    });
    setEditingId(lead._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">CRM Dashboard</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate('/external')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            View Weather
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add/Update Lead Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingId ? '✏️ Update Lead' : '➕ Add New Lead'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['firstName', 'lastName', 'age', 'dateOfContact', 'notes'].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-gray-600 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={field === 'age' ? 'number' : field === 'dateOfContact' ? 'date' : 'text'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block mb-1 text-gray-600">Lead Level</label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Very Hot</option>
              <option>Hot</option>
              <option>Cold</option>
            </select>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            {editingId ? 'Update Lead' : 'Add Lead'}
          </button>
        </form>
      </div>

      {/* Leads Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Leads List</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Age</th>
              <th className="p-2">Date</th>
              <th className="p-2">Level</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-100">
                <td className="p-2">{lead.firstName} {lead.lastName}</td>
                <td className="p-2">{lead.age}</td>
                <td className="p-2">{lead.dateOfContact.slice(0, 10)}</td>
                <td className="p-2">{lead.level}</td>
                <td className="p-2">{lead.notes}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(lead)}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lead._id)}
                    className="text-red-600 hover:text-red-800 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
