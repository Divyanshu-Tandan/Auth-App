import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import axios from 'axios'
import Features from "./pages/Features"
import Pricing from "./pages/Pricing"
import About from "./pages/About"

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

  if(isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0f0d] text-white">

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
      <Navbar user={user} setUser={setUser}/>
      <Routes>
        <Route path="/" element={<Home user={user} error={error} />} />
        <Route path="/login" element={<Login setUser={setUser}/>} />
        <Route path="/register" element={<Register setUser={setUser}/>} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App