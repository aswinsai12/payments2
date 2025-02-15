import React, { useState } from 'react'
import './Login.css'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import '../node_modules/bootstrap/dist/css/bootstrap-grid.min.css'
import './App.css';
import { FaUserAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleChanges = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }
    const handleSumbit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/auth/Login', values)
            if(response.status === 201) {
                localStorage.setItem('token', response.data.token)
                navigate('/')
            }
        } catch(err) {
            console.log(err.message)
        }
    }
  return (
    <div className='wrapper'>
    <form action="">
        <h1>Login</h1>
        <div className="input-box">
            <input type="text" placeholder="Username" required name="username" onChange={handleChanges}/>
            <FaUserAlt className='icon'/>
        </div>
        <div className="input-box">
            <input type="password" placeholder="Password" required/>
            <FaLock className='icon'/>
        </div>
        <div className="remember-forgot">
            <label><input type="checkbox" />Remember me</label>
            <a href="#">Forgot password?</a>
            
        </div>
        <button type='submit'>Login</button>
        <div className="register-link">
            <p>Don't have an account?<a href="#">Register</a></p>
        </div>
    </form>
</div>
   
  )
}

export default Login