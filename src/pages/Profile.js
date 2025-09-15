import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import styles from '../css/SignUP.module.css';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
        const response = await axios.get(`${apiUrl}/api/student`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Find current user from the list of students
        if (Array.isArray(response.data)) {
          const currentUser = response.data.find(u => u.email === userEmail);
          if (currentUser) {
            // Normalize avatar URL: if server returned a relative GridFS path like '/api/uploads/gridfs/..',
            // prefix the API base so the frontend can load it from the backend host.
            if (currentUser.avatar && typeof currentUser.avatar === 'string') {
              if (currentUser.avatar.startsWith('/api/') || currentUser.avatar.startsWith('/uploads/')) {
                currentUser.avatar = `${apiUrl}${currentUser.avatar}`;
              }
            }
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

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setAvatarFile(f);
  };

  const handleUploadAvatar = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    if (!avatarFile) return setError('Please choose an avatar file first');
    setUploading(true);
    setError('');
    try {
      // reuse apiUrl defined above
      const form = new FormData();
      form.append('avatar', avatarFile);
      const resp = await axios.post(`${apiUrl}/api/avatar/avatar`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      // server returns { avatar: '/api/uploads/gridfs/<filename>' }
      if (resp.data && resp.data.avatar) {
        let avatarPath = resp.data.avatar;
        if (avatarPath.startsWith('/api/') || avatarPath.startsWith('/uploads/')) {
          avatarPath = `${apiUrl}${avatarPath}`;
        }
        if (!avatarPath.startsWith('http')) {
          // as a last resort, prefix apiUrl
          avatarPath = `${apiUrl}${avatarPath}`;
        }
        setUser(prev => ({ ...(prev || {}), avatar: avatarPath }));
        setAvatarFile(null);
      }
    } catch (err) {
      console.error('Avatar upload error', err);
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navigation />
      <div className={styles.gradientArea}>
        <div className={styles.centeredContent}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '60vh', paddingTop: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input id="avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              <img
                role="button"
                tabIndex={0}
                onClick={() => document.getElementById('avatar-input').click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('avatar-input').click(); }}
                src={user && user.avatar ? user.avatar : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                alt="Profile"
                style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', marginBottom: '18px', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', cursor: 'pointer' }}
              />
              <h1 style={{ fontWeight: 700, color: '#2c3e50', marginBottom: '8px', fontSize: '2.2rem', letterSpacing: '1px' }}>Profile</h1>
            </div>
            
            {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
            
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <>
                <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '28px 36px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: '380px', textAlign: 'left', marginTop: '18px', marginBottom: '18px' }}>
                  <div style={{ marginBottom: '12px', fontSize: '1.15rem' }}><span style={{ fontWeight: 600, color: '#2c3e50' }}>Name:</span> {user.name || 'Not specified'}</div>
                  <div style={{ marginBottom: '12px', fontSize: '1.15rem' }}><span style={{ fontWeight: 600, color: '#2c3e50' }}>Email:</span> {user.email}</div>
                  <div style={{ marginBottom: '0', fontSize: '1.15rem' }}><span style={{ fontWeight: 600, color: '#2c3e50' }}>Institution:</span> {user.institution || <span style={{ color: '#888' }}>N/A</span>}</div>
                </div>

                {avatarFile && (
                  <div style={{ marginBottom: '12px', minWidth: '380px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={URL.createObjectURL(avatarFile)} alt="preview" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handleUploadAvatar} disabled={uploading} style={{ padding: '8px 14px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{uploading ? 'Uploading...' : 'Upload'}</button>
                        <button onClick={() => setAvatarFile(null)} style={{ padding: '8px 14px', background: '#ecf0f1', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
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