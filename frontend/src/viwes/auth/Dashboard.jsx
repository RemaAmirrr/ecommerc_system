import React, {useState, useEffect} from 'react'
import { login } from '../../utils/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore, } from '../../store/auth'

function Dashboard() {

    const [isLoggedIn, setIsLoggenIn] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user
    ])
       
  return (
    <div>
        {
            isLoggedIn()?
             <div>
                <h>HomePage</h>
                <br/>
                <Link to={`/logout`}>Logout</Link>
             </div>
             :
             <div>
                <h>Dashboard</h>
                <br/>
                <div className='d-flex'>
                    <Link  className='btn btn-primary'to={`/login`}> Login</Link>
                    <Link className='btn btn-success ms-4'  to={`/register`}> Register</Link>  
                </div>
             </div>
               
        }
    </div>
  )
}

export default Dashboard
