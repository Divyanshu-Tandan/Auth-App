import { NavLink, useNavigate } from "react-router-dom";
import { useState } from 'react'
import LogoutModal from './LogoutModal';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /**
   * When logout button is clicked, show the logout modal instead of immediately logging out
   * The actual logout logic is handled inside LogoutModal component
   */
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  /**
   * Callback when logout is successful
   * Clear user state and optionally close menu
   */
  const handleLogoutSuccess = () => {
    setUser(null);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 sm:py-4">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-lg sm:text-xl font-semibold tracking-wide text-white hover:text-emerald-400 transition flex items-center justify-center gap-1"
        >
          <img className='h-7 w-7' src="/AuthIcon.svg" alt="AuthIcon" />
          <span className="hidden sm:inline">AuthApp</span>
        </NavLink>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Center Nav Links - Desktop */}
        <div className="hidden md:flex gap-6 lg:gap-8 text-sm text-gray-300">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-400"
                : "hover:text-white transition"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/features"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-400"
                : "hover:text-white transition"
            }
          >
            Features
          </NavLink>

          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-400"
                : "hover:text-white transition"
            }
          >
            Pricing
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-400"
                : "hover:text-white transition"
            }
          >
            About
          </NavLink>
        </div>

        {/* Right Auth Actions - Desktop */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {user ? (
            <>
              <span className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-white/10 border border-white/20 text-xs lg:text-sm text-white">
                {user.username}
              </span>

              <button
                onClick={handleLogoutClick}
                className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-white/10 border border-white/20 text-xs lg:text-sm text-white hover:bg-white/20 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : "" }
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/60 backdrop-blur-xl border-t border-white/10">
          <div className="flex flex-col px-4 py-3 space-y-3">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm ${
                  isActive ? "text-emerald-400 bg-emerald-400/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/features"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm ${
                  isActive ? "text-emerald-400 bg-emerald-400/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              Features
            </NavLink>

            <NavLink
              to="/pricing"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm ${
                  isActive ? "text-emerald-400 bg-emerald-400/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              Pricing
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm ${
                  isActive ? "text-emerald-400 bg-emerald-400/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              About
            </NavLink>

            {/* Mobile Auth Actions */}
            {user && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="px-3 py-2 rounded-lg bg-white/10 text-sm text-white">
                  {user.username}
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white hover:bg-white/20 transition text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOGOUT MODAL - Rendered via Portal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        username={user?.username}
        onLogoutSuccess={handleLogoutSuccess}
      />
    </nav>
  );
};

export default Navbar;
