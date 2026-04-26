import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios'
  const API_BASE = import.meta.env.VITE_API_URL;

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post(`${API_BASE}/api/users/logout`, {}, {
      withCredentials: true
    });
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="flex items-center justify-between px-10 py-4">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-xl font-semibold tracking-wide text-white hover:text-emerald-400 transition flex items-center justify-center gap-1"
        >
          <img className='h-6 w-6' src="/AuthIcon.svg" alt="AuthIcon" />
          AuthApp
        </NavLink>

        {/* Center Nav Links */}
        <div className="hidden md:flex gap-8 text-sm text-gray-300">
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
            className="hover:text-white transition"
          >
            Features
          </NavLink>

          <NavLink
            to="/pricing"
            className="hover:text-white transition"
          >
            Pricing
          </NavLink>

          <NavLink
            to="/about"
            className="hover:text-white transition"
          >
            About
          </NavLink>
        </div>

        {/* Right Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white">
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white hover:bg-white/20 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : "" }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
