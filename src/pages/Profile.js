import React, { useEffect, useState } from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import styles from '../css/SignUP.module.css';

import axios from 'axios';


function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Fetch latest user data from backend using email
      axios.get(`http://localhost:5000/api/student?email=${parsedUser.email}`)
        .then(res => {
          // If backend returns an array, find the matching user
          if (Array.isArray(res.data)) {
            const found = res.data.find(u => u.email === parsedUser.email);
            setUser(found || parsedUser);
          } else {
            setUser(res.data);
          }
        })
        .catch(() => {
          setUser(parsedUser); // fallback to localStorage
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

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
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '12px', padding: '32px 40px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: '320px', textAlign: 'left' }}>
                <div style={{ marginBottom: '18px', fontSize: '1.15rem' }}><span style={{ fontWeight: 600, color: '#2c3e50' }}>Name:</span> {user.name}</div>
                <div style={{ marginBottom: '18px', fontSize: '1.15rem' }}><span style={{ fontWeight: 600, color: '#2c3e50' }}>Email:</span> {user.email}</div>
                <div style={{ marginBottom: '0', fontSize: '1.15rem' }}><span style={{ fontWeight: 600, color: '#2c3e50' }}>Institution:</span> {user.institution ? user.institution : <span style={{ color: '#888' }}>N/A</span>}</div>
              </div>
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
