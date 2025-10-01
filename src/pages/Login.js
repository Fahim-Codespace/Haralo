import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import styles from "../css/SignUP.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { post } from '../utils/requests';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RUNTIME = (typeof window !== 'undefined' && window.__BACKEND_URL__) ? window.__BACKEND_URL__ : null;
export const BASE = (RUNTIME || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
export const api = axios.create({ baseURL: BASE || '', timeout: 15000, headers: { 'Content-Type': 'application/json' } });

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        try {
            const { email, password } = formData;
            await post('/api/student/login', { email, password });
            
            setMessage("Login successful!");
            
            // Save JWT token to localStorage
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }
            
            // Save user email to localStorage
            if (res.data.email) {
                localStorage.setItem('userEmail', res.data.email);
            }
            
            // Redirect to home page
            navigate('/');
        } catch (err) {
            console.error("Login error:", err);
            setMessage(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.gradientArea}>
                <div className={styles.centeredContent}>
                    <div style={{ width: '480px', minHeight: '340px', margin: '32px auto', background: 'rgba(255,255,255,0.95)', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: '32px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ marginBottom: '24px', fontWeight: 700, color: '#2c3e50' }}>Login</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </Form>
                        {message && (
                            <p style={{ 
                                marginTop: "10px", 
                                color: message.includes("successful") ? "green" : "red",
                                fontWeight: message.includes("successful") ? "bold" : "normal"
                            }}>
                                {message}
                            </p>
                        )}
                        <div style={{ marginTop: "16px" }}>
                            <span>Don't have an account? </span>
                            <Link to="/sign-up">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;