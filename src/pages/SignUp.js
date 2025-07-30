import Navigation from "../components/navigation";
import Footer from "../components/footer";
import styles from "../css/SignUP.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SignUP = () => {
    return ( 
        <div className={styles.pageContainer}>
            <Navigation />
            <div className={styles.gradientArea}>
            <div className={styles.centeredContent}>
                <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Full Name </Form.Label>
        <Form.Control type="name" placeholder="Enter full name" />
        <Form.Label>Institution </Form.Label>
        <Form.Control type="name" placeholder="Enter your institution name" />
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="I agree with all the terms and conditions" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
            
        </div>
      </div>

      <Footer />

        </div>
     );
}
 
export default SignUP;