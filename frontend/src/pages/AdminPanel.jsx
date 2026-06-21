import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import DeleteModal from '../components/DeleteModal';
import { toast } from 'react-hot-toast';

const AdminPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { userId, username }
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const API_BASE = import.meta.env.VITE_API_URL;

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/users/getAllUsers?page=${page}&limit=10&search=${search}`, {
        withCredentials: true
      });
      setUsers(res.data.allUsers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1); // Reset to first page on new search
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
      toast.success('User role updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteSuccess = () => {
    if (deleteConfirm?.userId) {
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u._id !== deleteConfirm.userId));
      setDeleteConfirm(null);
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchUsers();
      }
    }
  };

  return (
    <div className="min-h-dvh bg-[#0b0f0d] text-white pt-20 px-4 sm:px-6 md:px-10 pb-10">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-105 h-105 bg-emerald-500/20 blur-[120px] rounded-full animate-blob top-1/4 left-1/3" />
        <div className="absolute w-75 h-75 bg-emerald-400/20 blur-[120px] rounded-full animate-blob animation-delay-2000 top-1/2 right-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage users and their roles</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-emerald-400 transition"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition">
              🔍
            </button>
          </form>
        </div>

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
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
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
                        <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-emerald-400">Status</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-emerald-400">Joined</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-emerald-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => {
                        const isOnline = u.lastActive && (new Date() - new Date(u.lastActive)) / (1000 * 60) < 5;
                        return (
                          <tr key={u._id} className="hover:bg-white/5 transition">
                            <td className="px-4 sm:px-6 py-4 text-sm">{u.username}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-400">{u.email}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm">
                              {editingId === u._id ? (
                                <div className="flex gap-2">
                                  <select
                                    defaultValue={u.role}
                                    className="bg-[#1a231f] border border-white/20 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-400"
                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                  >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-400 hover:text-white text-xs cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  }`}>
                                  {u.role}
                                </span>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-gray-500'}`}></span>
                                <span className={isOnline ? 'text-emerald-400' : 'text-gray-400'}>
                                  {isOnline ? 'Online' : 'Offline'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm">
                              <div className="flex gap-2">
                                {editingId !== u._id && (
                                  <button
                                    onClick={() => setEditingId(u._id)}
                                    className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded text-emerald-300 text-xs transition cursor-pointer"
                                  >
                                    Edit Role
                                  </button>
                                )}
                                <button
                                  onClick={() => setDeleteConfirm({ userId: u._id, username: u.username })}
                                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-300 text-xs transition cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-gray-400 text-sm">
                  Page <span className="text-emerald-400">{page}</span> of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        )}

        {/* DELETE MODAL - Rendered via Portal */}
        <DeleteModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          userId={deleteConfirm?.userId}
          username={deleteConfirm?.username}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
