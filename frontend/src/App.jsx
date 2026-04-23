import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import axios from 'axios'

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h2 className="text-2xl text-[#5f259f] text-center">Loading...</h2>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App