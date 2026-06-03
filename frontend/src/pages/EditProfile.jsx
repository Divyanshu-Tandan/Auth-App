import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.put(
        `${API_BASE}/api/users/update-profile`,
        { username, email },
        {
          withCredentials: true
        }
      );

      // Update user state
      setUser(response.data.user);
      setSuccessMessage('Profile updated successfully!');
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-dvh flex items-center justify-center bg-[#0b0f0d] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />
        <div className="relative z-10 text-center">
          <p className="text-lg text-emerald-400">Please log in to edit your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0b0f0d] text-white">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.25),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="backdrop-blur-xl bg-white/5 border border-emerald-400/30 rounded-3xl p-8 shadow-[0_0_80px_rgba(16,185,129,0.2)]">
            <h2 className="text-3xl sm:text-4xl font-semibold text-emerald-400 mb-2 text-center">
              Edit Profile
            </h2>
            <p className="text-gray-400 text-center mb-6 text-sm">
              Update your username and email
            </p>

            {successMessage && (
              <div className="mb-4 p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-300 text-sm">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-lg text-red-300 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="w-full px-4 py-3 bg-white/10 border border-emerald-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full px-4 py-3 bg-white/10 border border-emerald-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 mt-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 hover:bg-emerald-500/30 transition text-emerald-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition text-white font-semibold"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
