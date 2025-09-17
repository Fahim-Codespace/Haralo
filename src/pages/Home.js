import React, { useEffect, useState } from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import styles from '../css/homeCSS.module.css';
import AboutUs from './AboutUs';
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for JWT token instead of user object
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className={styles.pageContainer}>
      {isAuthenticated && <Navigation />}
      <div className={styles.gradientArea}>
        <div className={styles.centeredContent}>
          <div className={styles.textSection}>
            <div className={styles.welcomeContainer}>
            <h1>Welcome to Pacchina</h1>
            <img src="/images/logo.png" alt="Logo" className={styles.logo} />
            <p className="bangla-text">আপনার জিনিস হারিয়ে যাক নিশ্চিন্তে</p>
            </div>
          </div>
          <div className={styles.buttonsSection}>
            {isAuthenticated ? (
              <>
                <button
                  className={`${styles.actionBtn} ${styles.lostBtn}`}
                  onClick={() => navigate('/report-lost-item')}
                >
                  Lost
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.foundBtn}`}
                  onClick={() => navigate('/report-found')}
                >
                  Found
                </button>
              </>
            ) : (
              <>
                <button
                  className={`${styles.actionBtn} ${styles.lostBtn}`}
                  onClick={() => navigate('/sign-up')}
                >
                  Signup
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.foundBtn}`}
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;