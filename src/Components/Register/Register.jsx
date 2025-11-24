import React, { useState } from 'react';
import './Register.css';
import { FaUser, FaLock, FaPhone, FaIdBadge } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Create user data object
    const userData = {
      firstName,
      lastName,
      phoneNumber,
      email: username,   // assuming your backend uses "email" instead of "username"
      password
    };

    try {
      // Send POST request to backend
      const response = await axios.post('http://localhost:8080/register', userData);
      console.log('Response:', response.data);

      alert('Registration successful!');
      
      // Clear all fields
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setUsername('');
      setPassword('');

      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-wrapper">
      <h1>Sign Up</h1>
      <form onSubmit={handleRegister}>

        <div className="register-input-box">
          <input 
            type="text" 
            placeholder="First Name" 
            required 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <span className="icon"><FaIdBadge /></span>
        </div>

        <div className="register-input-box">
          <input 
            type="text" 
            placeholder="Last Name" 
            required 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <span className="icon"><FaIdBadge /></span>
        </div>

        <div className="register-input-box">
          <input 
            type="tel" 
            placeholder="Phone Number (Optional)" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <span className="icon"><FaPhone /></span>
        </div>

        <div className="register-input-box">
          <input 
            type="email" 
            placeholder="Email" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className="icon"><FaUser /></span>
        </div>

        <div className="register-input-box">
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="icon"><FaLock /></span>
        </div>

        <button type="submit">Sign Up</button>

        <div className="login-link">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>

      </form>
    </div>
  );
};

export default Register;