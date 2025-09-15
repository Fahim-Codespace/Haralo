import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

const Navigation = () => {
    return ( 
        <div>
            <Navbar expand="lg" style={{ backgroundColor: 'rgb(255, 248, 247)' }}>
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">LOST AND FOUND</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="my-2 my-lg-0"
                            style={{ maxHeight: '100px',marginLeft: '300px' }}
                            navbarScroll
                        >
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about-us">About Us</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>

                            <NavDropdown title="Dashboard" id="navbarScrollingDropdown">
                                <NavDropdown.Item as={Link} to="/lost">LOST</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/found">FOUND</NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title="Report Something?" id="navbarScrollingDropdown">
                                <NavDropdown.Item as={Link} to="/report-found">Report FOUND</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/report-lost-item">Report LOST</NavDropdown.Item>
                            </NavDropdown>
                            
                            {/* Signup option removed from navbar */}
                        </Nav>
                        
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
     );
}
 
export default Navigation;