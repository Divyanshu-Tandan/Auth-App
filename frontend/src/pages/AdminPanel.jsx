import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const AdminPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/users/getAllUsers`, {
        withCredentials: true
      });
      setUsers(res.data.allUsers);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      setUsers(users.map(u => u._id === userId ? res.data.user : u));
      setEditingId(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `${API_BASE}/api/users/${userId}`,
        { withCredentials: true }
      );
      setUsers(users.filter(u => u._id !== userId));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f0d] text-white pt-20 px-4 sm:px-6 md:px-10 pb-10">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-105 h-105 bg-emerald-500/20 blur-[120px] rounded-full animate-blob top-1/4 left-1/3" />
        <div className="absolute w-75 h-75 bg-emerald-400/20 blur-[120px] rounded-full animate-blob animation-delay-2000 top-1/2 right-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users and their roles</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-300 hover:text-red-200">✕</button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mb-4"></div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Table Container */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {users.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-400">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-emerald-400">Username</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-emerald-400">Email</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-emerald-400">Role</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-emerald-400">Joined</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-emerald-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/5 transition">
                          <td className="px-4 sm:px-6 py-4 text-sm">{u.username}</td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-400">{u.email}</td>
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            {editingId === u._id ? (
                              <div className="flex gap-2">
                                <select
                                  defaultValue={u.role}
                                  className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-400"
                                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-gray-400 hover:text-white text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                u.role === 'admin'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}>
                                {u.role}
                              </span>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              {editingId !== u._id && (
                                <button
                                  onClick={() => setEditingId(u._id)}
                                  className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded text-emerald-300 text-xs transition"
                                >
                                  Edit Role
                                </button>
                              )}
                              <button
                                onClick={() => setDeleteConfirm(u._id)}
                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-300 text-xs transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0b0f0d] border border-white/20 rounded-2xl p-6 max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Delete User?</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
