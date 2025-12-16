import { NavLink, useNavigate } from 'react-router'

const Navbar = ({ user, setUser }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/');
  }

  return (
    <nav className='flex items-center justify-between w-full fixed top-0 left-0 bg-[#5f259f] px-5 py-3'>
      <NavLink to='/' className='font-sans text-3xl text-white'>
        <span>🔒</span>
        Auth App
      </NavLink>
      <div>
        {user ? 
        ( <button onClick={handleLogout} className='bg-white rounded-md text-[#5f259f] px-3 py-1 cursor-pointer'>Logout</button> ) 
        : 
        ( 
          <>
          <NavLink to={`/login`} className={`bg-white rounded-md text-[#5f259f] px-3 py-1 mr-4`}>Login</NavLink>
          <NavLink to={`/register`} className={`bg-white rounded-md text-[#5f259f] px-3 py-1`}>Register</NavLink>
          </> 
        )}
      </div>
    </nav>
  )
}

export default Navbar
