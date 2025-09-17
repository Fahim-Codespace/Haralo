import React, { useEffect, useState } from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import '../css/LostFound.css';

const Lost = () => {
  const [lostPosts, setLostPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [contactInfo, setContactInfo] = useState("");

  useEffect(() => {
    fetch('http://localhost:5000/api/report-lost')
      .then(res => res.json())
      .then(data => {
        // Sort posts by date in descending order (newest first)
        const sortedPosts = data.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
        setLostPosts(sortedPosts);
        setLoading(false);
      })
      .catch(() => {
        setLostPosts([]);
        setLoading(false);
      });
  }, []);

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload._id || payload.id || null;
    } catch (e) {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const toggleStatus = async (post) => {
    const newStatus = post.status === 'lost' ? 'got returned' : 'lost';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/report-lost/${post._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to update status');
        return;
      }
      const data = await res.json();
      setLostPosts(prev => prev.map(p => p._id === post._id ? data.item : p));
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="page-container">
      <Navigation />
      
      <Container className="posts-container">
        <div className="page-header">
          <h1 className="page-title">Lost Items</h1>
          <p className="page-subtitle">
            People who lost items and are looking for help
          </p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : lostPosts.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <Row>
            {lostPosts.map(post => (
              <Col key={post._id} lg={6} md={6} sm={12} className="mb-4">
                <Card className="post-card lost-post h-100">
                  <Card.Body className="p-3">
                    
                    <div className="d-flex align-items-center mb-3">
                      {
                        (() => {
                          const apiOrigin = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                          let avatarSrc = null;
                          if (post.posterAvatar && typeof post.posterAvatar === 'string') {
                            avatarSrc = post.posterAvatar;
                            if (avatarSrc.startsWith('/api/') || avatarSrc.startsWith('/uploads/')) {
                              avatarSrc = `${apiOrigin}${avatarSrc}`;
                            } else if (!avatarSrc.startsWith('http')) {
                              avatarSrc = `${apiOrigin}${avatarSrc.startsWith('/') ? '' : '/'}${avatarSrc}`;
                            }
                          }

                          return (
                            <>
                              <img
                                src={avatarSrc || ("https://ui-avatars.com/api/?name=" + encodeURIComponent(post.name || "User"))}
                                alt={post.name}
                                className="profile-pic me-3"
                                onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(post.name || "User"); }}
                              />
                              <h6 className="user-name mb-0">{post.name}</h6>
                            </>
                          );
                        })()
                      }
                    </div>

                    <h5 className="item-title mb-1">{post.item || 'Item'}</h5>
                    <div className="mb-2 text-muted small">Location: {post.location || 'Unknown'}</div>

                    <p className="post-description mb-3">{post.description}</p>

                    <div className="image-placeholder mb-3">
                      {post.photo ? (
                        (() => {
                          const p = post.photo;
                          const apiOrigin = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                          let src = '';
                          if (typeof p === 'string') {
                            if (p.startsWith('http://') || p.startsWith('https://')) {
                              src = p;
                            } else if (p.startsWith('/')) {
                              src = `${apiOrigin}${p}`;
                            } else if (p.includes('/api/uploads/gridfs/')) {
                              src = p.startsWith('/') ? `${apiOrigin}${p}` : `${apiOrigin}/${p}`;
                            } else {
                              src = `${apiOrigin}/uploads/${p}`;
                            }
                          }
                          return (
                            <img
                              src={src}
                              alt={post.item}
                              style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                              onError={(e) => { console.warn('Image load failed for', src); e.currentTarget.style.display = 'none'; }}
                            />
                          );
                        })()
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <div className="d-flex justify-content-between">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="contact-btn"
                        onClick={() => {
                          setContactInfo(post.contact || "No contact info provided");
                          setShowContact(true);
                        }}
                      >
                        Contact
                      </Button>
                      {String(post.posterId) === String(currentUserId) ? (
                        <Button 
                          variant="outline-danger"
                          size="sm"
                          className="status-btn"
                          onClick={() => toggleStatus(post)}
                        >
                          {post.status || 'lost'}
                        </Button>
                      ) : (
                        <Button 
                          variant="outline-danger"
                          size="sm"
                          className="status-btn"
                          disabled
                        >
                          {post.status || 'lost'}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Footer />
      <Modal show={showContact} onHide={() => setShowContact(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contact Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{contactInfo}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContact(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Lost;