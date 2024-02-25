import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase'; // Assuming you have the authentication instance
import './Styles.css';

export default function Navigationbar() {

  const navigate = useNavigate();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
  
      if (user) {
        // If the user is logged in, fetch their role from Firestore
        const userRef = collection(firestore, 'Nusers');
        const adminRef = collection(firestore, 'Admins');
  
        getDocs(userRef)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.exists()) {
                setUserRole(doc.data().Role);
              } else {
                console.error('No such document in Nusers!');
              }
            });
          })
          .catch((error) => {
            console.error('Error getting document from Nusers:', error);
          });
  
        getDocs(adminRef)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.exists()) {
                setUserRole(doc.data().Role);
              } else {
                console.error('No such document in Admins!');
              }
            });
          })
          .catch((error) => {
            console.error('Error getting document from Admins:', error);
          });
      }
    });
  
    return () => unsubscribe();
  }, []);


  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        // Redirect to the login page after successful logout
       navigate('/home')
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <div>
      <Navbar expand="lg" style={{backgroundColor:'#111827'}} data-bs-theme="dark" fixed="top">
        <Container >
          <Navbar.Brand style={{ color: '#FFFFFF' }} href="#" className='logo'>Voting LK</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link className='Links' style={{ color: '#FFFFFF' }} href="/home">Home</Nav.Link>

              <Nav.Link className='Links' style={{ color: '#FFFFFF',marginLeft:'10px' }} href="/Pools">Voting Pools</Nav.Link>
              
              {userRole === 'Admin' && (
              <Nav.Link className='Links' style={{ color: '#FFFFFF',marginLeft:'10px' }} href="/Prices">Pricing</Nav.Link>

              )}

             
              <Nav.Link className='Links' style={{ color: '#FFFFFF',marginLeft:'10px' }} href="/about">About</Nav.Link>
            </Nav>

            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success" style={{borderColor:'black', color:'black', backgroundColor:'lightgreen'}}>Search</Button>
            </Form>

            {/* Add user dropdown menu with custom CSS */}
            <Dropdown align="end" style={{ marginLeft: '10px' }}>
              <Dropdown.Toggle variant="secondary" id="user-dropdown" >
                User
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {/* Conditionally render the links based on the user's login status */}
                {!userLoggedIn && (
                  <>
                    <Dropdown.Item href="/login">Login</Dropdown.Item>
                    <Dropdown.Item href="/register">Register</Dropdown.Item>
                  </>
                )}
                {userLoggedIn && (
                  <>
                    <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
                 
                    <Dropdown.Item href="/Update">Edit Profile</Dropdown.Item>

                    {userRole === 'Admin' && (
                  <Dropdown.Item href="/Adminpannel">Admin Pannel</Dropdown.Item>
                    )}
              
                  </>
                )}
          
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
