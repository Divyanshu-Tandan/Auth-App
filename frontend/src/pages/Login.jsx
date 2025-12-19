import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router'

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;


  const handleChange = (element) => {
    setFormData({ ...formData, [element.target.name]: element.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/users/login`, formData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      navigate('/');
    }
    catch(error) {
      setError(error.response?.data?.message || "Login Failed");
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg min-w-1/4'>
        <h2 className='font-bold text-2xl text-[#5f259f] mb-4 text-center'>Login Form</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-0.5 text-[#5f259f]'>
              <label htmlFor="email">Email:</label>
              <input 
              type="email" 
              name='email' 
              placeholder='Enter your email' 
              onChange={handleChange}
              value={formData.email} 
              className='outline-0 border-2 rounded-md py-0.5 px-1' 
              required/>
            </div>
            <div className='flex flex-col gap-0.5 text-[#5f259f] mb-4'>
              <label htmlFor="password">Password:</label>
              <input 
              type="password" 
              name='password' 
              placeholder='Enter your password' 
              onChange={handleChange}
              value={formData.password} 
              autoComplete="current-password"
              className='outline-0 border-2 rounded-md py-0.5 px-1' 
              required/>
            </div>
          </div>
          <button className='w-full text-white bg-[#5f259f] px-0.5 py-1 rounded-md cursor-pointer'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
