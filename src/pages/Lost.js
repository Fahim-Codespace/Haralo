import React, { useEffect, useState } from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../css/LostFound.css';

const Lost = () => {
  const [lostPosts, setLostPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/report-lost')
      .then(res => res.json())
      .then(data => {
        setLostPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setLostPosts([]);
        setLoading(false);
      });
  }, []);

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
                      <img 
                        src={"https://ui-avatars.com/api/?name=" + encodeURIComponent(post.name || "User")}
                        alt={post.name}
                        className="profile-pic me-3"
                      />
                      <h6 className="user-name mb-0">{post.name}</h6>
                    </div>

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
                      >
                        Contact
                      </Button>
                      <Button 
                        variant="outline-danger"
                        size="sm"
                        className="status-btn"
                      >
                        Lost
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
    </div>
  );
};

export default Lost;