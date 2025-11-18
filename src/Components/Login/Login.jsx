import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const Login = () => {
    /*
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5000/login', {username, password})
        .then(result => {console.log(result)
        navigate('/home')
        })
        .catch(err=> console.log(err))
    }*/

    return (
        <div className='wrapper'> 
                <h1>Login</h1>

                <div className="input-box">
                    <input type="text" placeholder='Username' required 
                    /*value={username} onChange = {e => setUsername(e.target.value)}*//>
                    <span className="icon"><FaUser /></span>
                </div>

                <div className="input-box">
                    <input type="password" placeholder='Password' required
                    /*value={password} onChange = {e => setPassword(e.target.value)}*//>
                    <span className="icon"><FaLock /></span>
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" /> Remember me</label>
                    <a href="#"> Forgot password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p> Don't have an account? <Link to="/register">Sign Up</Link></p>
                </div>

                {/*}
                <div className="login-link">
                    <p> Already have an account? <Link to="/login">Login</Link></p>
                </div>
                */}
            
        </div>
    );
};

export default Login;
