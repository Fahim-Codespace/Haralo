import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import footerStyles from '../css/footer.module.css';

const Footer = () => {
    return (
        <footer className={footerStyles.footer}>
            <Container fluid>
                <Row className="py-4">
                    <Col md={4}>
                        <h5 className={footerStyles.footerTitle}>Lost and Found</h5>
                        <p className={footerStyles.footerText}>
                            Helping people reunite with their lost belongings and find their owners.
                        </p>
                    </Col>
                    <Col md={4}>
                        <h6 className={footerStyles.footerSubtitle}>Quick Links</h6>
                        <ul className={footerStyles.footerLinks}>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#found">Found Items</a></li>
                            <li><a href="#lost">Lost Items</a></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h6 className={footerStyles.footerSubtitle}>Contact Info</h6>
                        <p className={footerStyles.footerText}>
                            Email: help@lostandfound.com<br />
                            Phone: (880) 123-456789<br />
                            Available 24/7
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <hr className={footerStyles.footerDivider} />
                        <p className={footerStyles.footerCopyright}>
                            © 2025 Lost and Found. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;