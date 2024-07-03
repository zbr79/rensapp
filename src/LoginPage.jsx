// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [connectionError, setConnectionError] = useState('');

    useEffect(() => {
        const checkConnection = async () => {
            try {
                await axios.get('http://vite-project-zbr.us-west-2.elasticbeanstalk.com/api/test');
                setConnectionError('');
            } catch (err) {
                setConnectionError('Failed to connect to the backend. Please check your server.');
            }
        };

        checkConnection();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            const response = await axios.post('http://vite-project-zbr.us-west-2.elasticbeanstalk.com/api/auth/login', { 
                username, 
                password 
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Invalid username or password.');
                } else if (error.response.status === 404) {
                    setError('User not found.');
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
            } else {
                setError('Network error: No response received.');
            }
        }
    };

    return (
        <div className="account-page">
            <h2 className="account-page-title">Login Page</h2>
            {connectionError && <p className="error-message">{connectionError}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-button">Submit</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
}

export default LoginPage;
