import React from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import '../css/LostFound.css';

const foundPosts = [
  {
    id: 1,
    userPic: "https://via.placeholder.com/40x40/28a745/ffffff?text=AC",
    userName: "Rahim",
    location: "Plaza",
    category: "watch",
    timePosted: "30 minutes ago",
    description: "Found this golden watch at the Aust Plaza this morning. It looks expensive and has some engravings on the back. Owner can contact me.",
    status: "Available",
    contact: "Contact Rahim"
  },
  {
    id: 2,
    userPic: "https://via.placeholder.com/40x40/6c757d/ffffff?text=LW",
    userName: "Karim",
    location: "Washroom",
    category: "keys",
    timePosted: "1 hour ago",
    description: "Found a set of keys in the washroom. They have a keychain with a small red tag. If you lost your keys, please reach out to me.",
    status: "Claimed",
    contact: "Contact Karim"
  },
  {
    id: 3,
    userPic: "https://via.placeholder.com/40x40/ffc107/000000?text=EB",
    userName: "Shakib",
    location: "Canteen",
    category: "purse",
    timePosted: "3 hours ago",
    description: "Found this white purse at the canteen. Contains some personal items.",
    status: "Available",
    contact: "Contact Shakib"
  },
  {
    id: 4,
    userPic: "https://via.placeholder.com/40x40/ffc107/000000?text=EB",
    userName: "Rakib",
    location: "Canteen",
    category: "Bag",
    timePosted: "3 hours ago",
    description: "Found this black bag at the canteen. ",
    status: "Available",
    contact: "Contact Rakib"
  }
];

const Found = () => {
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

        <Row>
          {foundPosts.map(post => (
            <Col key={post.id} lg={6} md={6} sm={12} className="mb-4">
              <Card className="post-card found-post h-100">
                <Card.Body className="p-3">
                  
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={post.userPic} 
                      alt={post.userName}
                      className="profile-pic me-3"
                    />
                    <h6 className="user-name mb-0">{post.userName}</h6>
                  </div>

                  
                  <p className="post-description mb-3">{post.description}</p>

                  <div className="image-placeholder mb-3">
                    <span>Image</span>
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
                      variant={post.status === "Claimed" ? "secondary" : "outline-success"} 
                      size="sm"
                      className="status-btn"
                      disabled={post.status === "Claimed"}
                    >
                      {post.status === "Claimed" ? "Already Claimed" : "Available"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Found;