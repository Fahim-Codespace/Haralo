import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import styles from "../css/SignUP.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const SignUP = () => {
    const [formData, setFormData] = useState({
        name: "",
        institution: "",
        email: "",
        password: "",
        agree: false
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agree) {
            setMessage("You must agree to the terms and conditions.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/student/signup", {
                name: formData.name,
                institution: formData.institution,
                email: formData.email,
                password: formData.password
            });

            setMessage(res.data.message || "Signup successful!");

            if (res.status === 201) {
                setFormData({ name: "", institution: "", email: "", password: "", agree: false });
                
                // Save JWT token to localStorage
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
                
                // Save user data to localStorage
                if (res.data.email) {
                    localStorage.setItem('userEmail', res.data.email);
                }
                
                // Redirect to home after successful signup
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        }
    };

    return ( 
        <div className={styles.pageContainer}>
            {/* Navigation removed for unauthenticated signup page */}
            <div className={styles.gradientArea}>
                <div className={styles.centeredContent}>
                    <div style={{ width: '480px', minHeight: '340px', margin: '32px auto', background: 'rgba(255,255,255,0.95)', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: '32px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ marginBottom: '24px', fontWeight: 700, color: '#2c3e50' }}>Sign Up</h2>
                        <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter full name" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formInstitution">
                            <Form.Label>Institution</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your institution name" 
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                            />
                        </Form.Group>

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
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
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
                            <Form.Text className="text-muted">
                                Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formCheckbox">
                            <Form.Check 
                                type="checkbox" 
                                label="I agree with all the terms and conditions" 
                                name="agree"
                                checked={formData.agree}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>

                    {message && <p style={{ marginTop: "10px", color: message.includes("successful") ? "green" : "red" }}>{message}</p>}
                    <div style={{ marginTop: "16px" }}>
                        <span>Already have an account? </span>
                        <Link to="/login">Login</Link>
                    </div>
                </div> {/* close card div */}
            </div>
        </div>
        <Footer />
    </div>
    );
}

export default SignUP;