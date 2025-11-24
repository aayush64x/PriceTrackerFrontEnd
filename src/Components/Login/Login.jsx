// src/Components/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../javascript/AuthContext";
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        // Check if user is already logged in
        if (isAuthenticated()) {
            // Redirect to home or saved page
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                localStorage.removeItem('redirectAfterLogin');
                navigate(redirectPath);
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/login', {
                email: email.trim(),
                password: password
            });

            // Backend returns token as plain text in response.data
            const token = response.data;

            if (!token || token === 'fail to authenticate') {
                throw new Error('Invalid email or password');
            }

            console.log('Login successful, token received');
            
            // Use context to save auth state
            login(token, email.trim());

            // Redirect to saved page or home
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                localStorage.removeItem('redirectAfterLogin');
                navigate(redirectPath);
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error('Login error:', err);
            
            if (err.response) {
                // Server responded with error
                const errorMsg = err.response.data?.error || err.response.data || 'Invalid email or password';
                setError(errorMsg);
            } else if (err.request) {
                // Request made but no response
                setError('Cannot connect to server. Please try again.');
            } else {
                // Other errors
                setError(err.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='wrapper'> 
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder='Email' 
                        required 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <span className="icon"><FaUser /></span>
                </div>

                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder='Password' 
                        required
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <span className="icon"><FaLock /></span>
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" /> Remember me</label>
                    <a href="#"> Forgot password?</a>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="register-link">
                    <p> Don't have an account? <Link to="/register">Sign Up</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;