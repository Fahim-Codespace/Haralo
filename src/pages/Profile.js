import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import styles from '../css/SignUP.module.css';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token) {
      navigate('/login');
      return;
    }

    // Try to fetch user data from backend
    const fetchUserData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/student`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Find current user from the list of students
        if (Array.isArray(response.data)) {
          const currentUser = response.data.find(u => u.email === userEmail);
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Fallback: create user object from stored email
            setUser({ email: userEmail, name: 'User', institution: 'Not specified' });
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Fallback: create user object from stored email
        setUser({ email: userEmail, name: 'User', institution: 'Not specified' });
        setError('Failed to load full profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className={styles.pageContainer}>
      <Navigation />
      <div className={styles.gradientArea}>
        <div className={styles.centeredContent}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile"
              style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', marginBottom: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
            />
            <h1 style={{ fontWeight: 700, color: '#2c3e50', marginBottom: '18px', fontSize: '2.2rem', letterSpacing: '1px' }}>Profile</h1>
            
            {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
            
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <>
                <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '12px', padding: '32px 40px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: '320px', textAlign: 'left', marginBottom: '24px' }}>
                  <div style={{ marginBottom: '18px', fontSize: '1.15rem' }}><span style={{ fontWeight: 600, color: '#2c3e50' }}>Name:</span> {user.name || 'Not specified'}</div>
                  <div style={{ marginBottom: '18px', fontSize: '1.15rem' }}><span style={{ fontWeight: 600, color: '#2c3e50' }}>Email:</span> {user.email}</div>
                  <div style={{ marginBottom: '0', fontSize: '1.15rem' }}><span style={{ fontWeight: 600, color: '#2c3e50' }}>Institution:</span> {user.institution || <span style={{ color: '#888' }}>N/A</span>}</div>
                </div>
                <button
                  style={{ padding: '10px 32px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginBottom: '8px' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <p style={{ color: '#c0392b', fontWeight: 500 }}>No user data found. Please log in.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;