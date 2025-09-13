import React, { useEffect, useState } from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import '../css/LostFound.css';

const Found = () => {
  const [foundPosts, setFoundPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [contactInfo, setContactInfo] = useState("");

  useEffect(() => {
    fetch('http://localhost:5000/api/report-found')
      .then(res => res.json())
      .then(data => {
        setFoundPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setFoundPosts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <Navigation />
      
      <Container className="posts-container">
        <div className="page-header">
          <h1 className="page-title">Found Items</h1>
          <p className="page-subtitle">
            Good people who found items and want to return them
          </p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : foundPosts.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <Row>
            {foundPosts.map(post => (
              <Col key={post._id} lg={6} md={6} sm={12} className="mb-4">
                <Card className="post-card found-post h-100">
                  <Card.Body className="p-3">
                    
                    <div className="d-flex align-items-center mb-3">
                      <img 
                        src={"https://ui-avatars.com/api/?name=" + encodeURIComponent(post.name || "User")}
                        alt={post.name}
                        className="profile-pic me-3"
                      />
                      <h6 className="user-name mb-0">{post.name}</h6>
                    </div>

                    <h5 className="item-title mb-1">{post.item || 'Item'}</h5>
                    <div className="mb-2 text-muted small">Location: {post.location || 'Unknown'}</div>

                    <p className="post-description mb-3">{post.description}</p>

                    <div className="image-placeholder mb-3">
                      {post.photo ? (
                        <img
                          src={`http://localhost:5000/uploads/${post.photo}`}
                          alt={post.item}
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                        />
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
                      <Button 
                        variant="outline-success"
                        size="sm"
                        className="status-btn"
                      >
                        Available
                      </Button>
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

export default Found;