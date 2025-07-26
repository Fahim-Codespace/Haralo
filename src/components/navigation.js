import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Navigation = () => {
    return ( 
        <div>
            <Navbar expand="lg" style={{ backgroundColor: '#fcd8cfff' }}>
  <Container fluid>
    <Navbar.Brand href="#">LOST AND FOUND</Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarScroll" />
    <Navbar.Collapse id="navbarScroll">
      <Nav
        className="me-auto my-2 my-lg-0"
        style={{ maxHeight: '100px' }}
        navbarScroll
      >
        <Nav.Link href="#action1">Home</Nav.Link>
        <Nav.Link href="#action2">About US</Nav.Link>
        <Nav.Link href="#action2">Profiles</Nav.Link>

        <NavDropdown title="Dashboard?" id="navbarScrollingDropdown">
          <NavDropdown.Item href="#action3">FOUND</NavDropdown.Item>
          <NavDropdown.Item href="#action4">LOST</NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title="Report Something?" id="navbarScrollingDropdown">
          <NavDropdown.Item href="#action3">Report FOUND</NavDropdown.Item>
          <NavDropdown.Item href="#action4">Report LOST</NavDropdown.Item>
        </NavDropdown>
        
        <Nav.Link href="#" disabled>SignUp</Nav.Link>
      </Nav>
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
        />
        <Button variant="outline-success">Search</Button>
      </Form>
    </Navbar.Collapse>
  </Container>
</Navbar>
        </div>
     );
}
 
export default Navigation;