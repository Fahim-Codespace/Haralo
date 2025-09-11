import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import styles from "../css/SignUP.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/student/login", {
                email: formData.email,
                password: formData.password
            });
            setMessage(res.data.message);
            if (res.status === 200) {
                setFormData({ email: "", password: "" });
                // Save user data to localStorage for profile page
                if (res.data.student) {
                    localStorage.setItem('user', JSON.stringify(res.data.student));
                }
                navigate('/profile');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* Navigation removed for unauthenticated login page */}
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
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                    {message && <p style={{ marginTop: "10px" }}>{message}</p>}
                    <div style={{ marginTop: "16px" }}>
                        <span>Don't have an account? </span>
                        <Link to="/sign-up">Sign Up</Link>
                    </div>
                </div> {/* close card div */}
            </div>
        </div>
        <Footer />
    </div>
    );
};

export default Login;
