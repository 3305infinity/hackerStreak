import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaArrowRight, FaLaptopCode } from 'react-icons/fa';
import './Login.css';

const Login = () => {
    const [user, setUser] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', user, { 
                withCredentials: true 
            });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userEmail', user.email); // Store user email for personalization
            navigate('/'); // Redirect to home/dashboard after login
        } catch (error) {
            setError(error.response?.data?.error || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // CSS illustration as SVG alternative
    const CodingIllustration = () => (
        <svg 
            width="100%" 
            height="auto" 
            viewBox="0 0 400 300" 
            className="coding-illustration"
            aria-hidden="true"
        >
            {/* Monitor */}
            <rect x="100" y="50" width="200" height="150" rx="10" fill="#1a1a2e" />
            <rect x="110" y="60" width="180" height="130" rx="5" fill="#6e48aa" opacity="0.2" />
            
            {/* Code Brackets */}
            <text x="120" y="100" font-family="monospace" font-size="14" fill="#4bc0c8">{'< >'}</text>
            <text x="120" y="120" font-family="monospace" font-size="14" fill="white">{'// HackStreak'}</text>
            <text x="120" y="140" font-family="monospace" font-size="14" fill="white">{'const win = () =>'}</text>
            
             
            {/* Stand */}
            <rect x="175" y="200" width="50" height="20" fill="#1a1a2e" />
            <rect x="185" y="220" width="30" height="10" fill="#1a1a2e" />
        </svg>
    );

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-left">
                    <div className="login-header">
                        <h1>Welcome to <span className="brand-highlight">HackStreak</span></h1>
                        <p className="login-subtitle">
                            Track coding contests, set reminders, and level up your skills
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        {error && (
                            <div className="login-error">
                                <FaLock className="error-icon" />
                                {error}
                            </div>
                        )}
                        
                        <div className="input-group">
                            <label htmlFor="email">
                                <FaEnvelope className="input-icon" />
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="your@email.com" 
                                onChange={onChange}
                                value={user.email}
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">
                                <FaLock className="input-icon" />
                                Password
                            </label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="••••••••" 
                                onChange={onChange}
                                value={user.password}
                                required 
                            />
                        </div>

                        <div className="login-options">
                            <label className="remember-me">
                                <input type="checkbox" /> 
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="forgot-password">
                                Forgot password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>
                                    Continue <FaArrowRight className="arrow-icon" />
                                </>
                            )}
                        </button>

                        <div className="login-footer">
                            New to HackStreak?{' '}
                            <Link to="/signup" className="signup-link">
                                Create account
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="login-right">
                    <div className="illustration-container">
                        <CodingIllustration />
                        <div className="login-quote">
                            <FaLaptopCode className="quote-icon" />
                            <h3>Your Contest Tracker</h3>
                            <p>Never miss another coding challenge</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;