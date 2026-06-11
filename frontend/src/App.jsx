import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import axios from 'axios'
import Features from "./pages/Features"
import TechStack from "./pages/TechStack"
import About from "./pages/About"
import ForgotPassword from "./pages/ForgotPassword"
import NotFound from "./pages/NotFound"
import AdminPanel from "./pages/AdminPanel"
import EditProfile from "./pages/EditProfile"
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users/me`, {
          withCredentials: true
        });

        setUser(res.data);
      } catch (error) {
        const status = error.response?.status;

        if (status === 401) {
          // ✅ Not logged in → normal case
          setUser(null);
        } else {
          // ❗ Real error (server down, network issue, etc.)
          console.error(error.response?.data || error.message);
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#0b0f0d] text-white">

        {/* Animated Blob */}
        <div className="absolute w-105 h-105 bg-emerald-500/40 blur-[120px] rounded-full animate-blob top-1/4 left-1/3" />
        <div className="absolute w-75 h-75 bg-emerald-400/30 blur-[120px] rounded-full animate-blob animation-delay-2000 top-1/2 right-1/4" />

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />

        <h2 className="text-4xl text-emerald-400 text-center">Loading...</h2>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#34d399',
              secondary: '#0b0f0d',
            },
            style: {
              border: '1px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)',
            }
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#0b0f0d',
            },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)',
            }
          },
        }}
      />
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} error={error} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/edit-profile" element={<EditProfile user={user} setUser={setUser} />} />
        <Route path="/features" element={<Features />} />
        <Route path="/tech-stack" element={<TechStack />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminPanel user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App