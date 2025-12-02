import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: username,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:8080/register', userData);
      console.log('Response:', response.data);
      
      alert('Registration successful!');
      
      setFirstName('');
      setLastName('');
      setUsername('');
      setPassword('');
      
      navigate('/login');
      
    } catch (error) {
      console.error('Error registering user:', error);
      
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="register-wrapper">
      <form onSubmit={handleRegister}>
        <h1>Register</h1>
        
        <div className="register-input-box">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <i className='bx bxs-user icon'></i>
        </div>

        <div className="register-input-box">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <i className='bx bxs-user icon'></i>
        </div>

        <div className="register-input-box">
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <i className='bx bxs-envelope icon'></i>
        </div>

        <div className="register-input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i className='bx bxs-lock-alt icon'></i>
        </div>

        <button type="submit">Register</button>

        <div className="login-link">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </form>
    </div>
  );
};

export default Register;