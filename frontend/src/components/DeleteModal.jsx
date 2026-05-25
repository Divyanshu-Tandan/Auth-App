import { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * DELETE MODAL COMPONENT
 * 
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Callback when user clicks Cancel or outside modal
 * - userId: ID of user to delete
 * - username: Username of user to delete (for display)
 * - onDeleteSuccess: Callback after successful deletion (parent refreshes user list)
 * 
 * This component:
 * 1. Uses the reusable Modal wrapper component
 * 2. Handles delete API call
 * 3. Shows user being deleted (for confirmation)
 * 4. Handles loading state during deletion
 */
const DeleteModal = ({ isOpen, onClose, userId, username, onDeleteSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      await axios.delete(`${API_BASE}/api/users/${userId}`, {
        withCredentials: true
      });
      
      // Call parent callback to refresh user list
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user';
      setError(errorMsg);
      console.error('Delete failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackdropClick={!isLoading}>
      {/* MODAL HEADER */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Delete User
        </h2>
      </div>

      {/* MODAL BODY */}
      <div className="px-6 sm:px-8 py-6">
        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* USER BEING DELETED */}
        <div className="mb-6 p-4 bg-white/10 border border-red-400/30 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">User to delete:</p>
          <p className="text-lg font-semibold text-red-400">{username}</p>
        </div>

        {/* WARNING MESSAGE */}
        <p className="text-gray-300 text-center mb-2">
          Are you sure you want to delete this user?
        </p>
        <p className="text-sm text-gray-400 text-center">
          This action cannot be undone.
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

        {/* DELETE BUTTON */}
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-sm sm:text-base font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
