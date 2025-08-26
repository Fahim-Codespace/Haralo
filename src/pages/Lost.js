import React from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import '../css/LostFound.css';

const lostPosts = [
  {
    id: 1,
    userPic: " https://via.placeholder.com/40x40/dc3545/ffffff?text=JD",
    userName: "Musa",
    location: "University Library",
    category: "card",
    timePosted: "8 minutes ago",
    description: "Lost my AUST ID card in the library.",
    status: "lost",
    contact: "Contact Musa"
  },
  {
    id: 2,
    userPic: "https://via.placeholder.com/40x40/6c757d/ffffff?text=MS", 
    userName: "Feroz Alam",
    location: "Classroom",
    category: "Books",
    timePosted: "1 day ago",
    description: "Lost my textbook in the classroom. It has my name written inside.",
    status: "found",
    contact: "Contact Feroz"
  },
  {
    id: 3,
    userPic: "https://via.placeholder.com/40x40/28a745/ffffff?text=SJ",
    userName: "Dip", 
    location: "Canteen",
    category: "phone",
    timePosted: "3 days ago",
    description: "Lost my iPhone 16 pro in the canteen. It has a blue case and a screen protector.",
    status: "lost",
    contact: "Contact Dip"
  },
  {
    id: 4,
    userPic: "https://via.placeholder.com/40x40/28a745/ffffff?text=SJ",
    userName: "Shadman", 
    location: "Canteen",
    category: "Wallet",
    timePosted: "3 days ago",
    description: "Lost my Wallet in the canteen.",
    status: "lost",
    contact: "Contact Shadman"
  }
];

const Lost = () => {
  return (
    <div className="page-container">
      <Navigation />
      
      <Container className="posts-container">
        <div className="page-header">
          <h1 className="page-title">Lost Items</h1>
          <p className="page-subtitle">
            People who have lost their belongings
          </p>
        </div>

        <Row>
          {lostPosts.map(post => (
            <Col key={post.id} lg={6} md={6} sm={12} className="mb-4">
              <Card className="post-card lost-post h-100">
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
                      variant={post.status === "found" ? "outline-success" : "outline-secondary"} 
                      size="sm"
                      className="status-btn"
                    >
                      {post.status === "found" ? "Found!" : "Not Found Yet"}
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

export default Lost;