import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:8080/login', loginData);
      
      // Store JWT token
      localStorage.setItem('token', response.data);
      localStorage.setItem('userEmail', email);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event('authChange'));
      
      console.log('Login successful!');
      alert('Login successful!');
      
      // Clear form
      setEmail('');
      setPassword('');
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <i className='bx bxs-envelope icon'></i>
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i className='bx bxs-lock-alt icon'></i>
        </div>
{/*
        <div className="remember-forgot">
          <label>
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>
  */}

        <button type="submit">Login</button>

        <div className="register-link">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;