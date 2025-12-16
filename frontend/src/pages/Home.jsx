import { NavLink } from 'react-router'

const Home = ({ user, error }) => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div>
        {error && <p className='text-red-500 md-4 text-sm'>{error}</p>}
        {
          user ? ( 
          <div className='shadow-xl p-5 rounded-2xl border-2 border-[#5f259f]'>
            <h2 className='text-2xl text-bold md-4 text-[#5f259f] text-center'>Welcome {user.username}</h2>
            <p className='text-lg md-4 text-[#68369e] text-center'>Email: {user.email}</p>
          </div> ) : 
          ( <div>
            <h2 className='text-2xl text-bold md-4 text-[#5f259f] text-center'>Welcome 😊</h2>
            <p className='text-lg md-4 text-[#68369e] text-center mb-4'>Please login or register</p>
            {/* <div className='flex justify-around text-lg'>
              <NavLink to="/login" className={`bg-[#5f259f] rounded-md text-white px-3 py-1`} end>
                Login
              </NavLink>
              <NavLink to="/register" className={`bg-[#5f259f] rounded-md text-white px-3 py-1`} end>
                Register
              </NavLink>
            </div> */}
          </div> )
        }
      </div>
    </div>
  )
}

export default Home
