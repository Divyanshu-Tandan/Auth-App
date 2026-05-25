import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import Modal from './Modal';

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * LOGOUT MODAL COMPONENT
 * 
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Callback when user clicks Cancel or outside modal
 * - username: Current logged-in user's username
 * - onLogoutSuccess: Callback after successful logout (parent handles setUser, navigation)
 * 
 * This component:
 * 1. Uses the reusable Modal wrapper component
 * 2. Handles logout API call
 * 3. Passes styling and content as children to Modal
 * 4. Handles loading state during logout
 */
const LogoutModal = ({ isOpen, onClose, username, onLogoutSuccess }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${API_BASE}/api/users/logout`, {}, {
        withCredentials: true
      });
      
      // Call parent callback to clear user state
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
      
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* MODAL HEADER */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Confirm Logout
        </h2>
      </div>

      {/* MODAL BODY */}
      <div className="px-6 sm:px-8 py-6">
        {/* USERNAME DISPLAY */}
        <div className="mb-6 p-4 bg-white/10 border border-emerald-400/30 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">Logged in as:</p>
          <p className="text-lg font-semibold text-emerald-400">{username}</p>
        </div>

        {/* CONFIRMATION MESSAGE */}
        <p className="text-gray-300 text-center">
          Are you sure you want to logout?
        </p>
      </div>

      {/* MODAL FOOTER / ACTIONS */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex gap-4 sm:gap-6">
        {/* CANCEL BUTTON */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm sm:text-base hover:bg-white/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-sm sm:text-base font-semibold transition cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </Modal>
  );
};

export default LogoutModal;
