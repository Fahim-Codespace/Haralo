import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../utils/requests';
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from "../css/SignUP.module.css";

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await post('/api/student/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (res && res.status >= 200 && res.status < 300) navigate('/login');
      else alert(res?.data?.message || 'Signup failed');
    } catch (err) {
      console.error('Signup error', err);
      alert(err?.response?.data?.message || err.message || 'Server error');
    } finally { setIsLoading(false); }
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
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter email" 
                                name="email"
                                value={form.email}
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
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <Form.Text className="text-muted">
                                Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing up...' : 'Submit'}
                        </Button>
                    </Form>

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

export default SignUp;