import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ token, currentUser }) => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'https://chatbot-0g7m.onrender.com';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsersList(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`${API_BASE_URL}/api/auth/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to completely remove this user? This action cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsersList(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-32 px-8 animate-fade-in">
      <h1 className="text-60 font-black mb-4 tracking-tighter">System Administration.</h1>
      <p className="text-gray-400 font-medium mb-16">Global registry of all verified neural link users.</p>

      {loading ? (
        <div className="text-center py-20 text-blue-400 font-bold animate-pulse">Scanning Database...</div>
      ) : error ? (
        <div className="p-10 text-center text-red-500 bg-red-500/5 border border-red-500/10 rounded-3xl">
          Access Denied: {error}
        </div>
      ) : (
        <div className="glass overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white-5 flex justify-between items-center bg-white-2">
            <h3 className="text-xl font-black flex items-center gap-3">
               User Ledger
            </h3>
            <span className="bg-blue-600-20 text-blue-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              {usersList.length} Active Nodes
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="text-10 font-black uppercase tracking-02 text-gray-600 border-b border-white-5">
                  <th className="p-8">Username</th>
                  <th className="p-8">Email</th>
                  <th className="p-8">Clearance</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id} className="border-b border-white-5 hover:bg-white-1 transition-colors">
                    <td className="p-8 font-bold text-white">@{u.username}</td>
                    <td className="p-8 text-gray-400">{u.email}</td>
                    <td className="p-8">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                       {currentUser && currentUser.username !== u.username && (
                         <div className="flex justify-end gap-4">
                           <button onClick={() => handleRoleChange(u._id, u.role)} className="text-10 font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                             {u.role === 'admin' ? 'Revoke' : 'Promote'}
                           </button>
                           <button onClick={() => handleDeleteUser(u._id)} className="text-10 font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors">
                             Delete
                           </button>
                         </div>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
