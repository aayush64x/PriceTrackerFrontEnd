import React, { useState } from 'react';
import './Register.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering:', username, password);
    // TODO: send to backend
  };

  return (
    <div className="register-wrapper">

      <h1>Sign Up</h1>

      <form onSubmit={handleRegister}>

        <div className="register-input-box">
          <input type="text" placeholder="Username" required value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className = "icon"><FaUser /></span>
        </div>

        <div className="register-input-box">
          <input type="password" placeholder="Password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className = "icon"><FaLock /></span>
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
