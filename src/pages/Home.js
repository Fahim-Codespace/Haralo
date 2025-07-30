import React from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import styles from '../css/homeCSS.module.css';

function Home() {
  return (
    <div className={styles.pageContainer}>
      <Navigation />
      
      <div className={styles.gradientArea}>
        <div className={styles.centeredContent}>
          <div className={styles.textSection}>
            <h1>Welcome to Lost and Found</h1>
            <p>Help reunite people with their lost belongings</p>
          </div>
          <div className={styles.buttonsSection}>
            <button className={`${styles.actionBtn} ${styles.lostBtn}`}>Lost </button>
            <button className={`${styles.actionBtn} ${styles.foundBtn}`}>Found</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;