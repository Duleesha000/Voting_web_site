// Login.js

import {
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow
} from 'mdb-react-ui-kit';

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, firestore, provider } from '../firebase';

import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';
import './Styles.css';



export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateEmail = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = () => {
    const minLength = 8;
    return password.length >= minLength;
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid email address",
      });
      return;
    }

    if (!validatePassword()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password must be at least 8 characters long",
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const isAdmin = await checkUserRole('Admins', user.uid);
      const isNormalUser = await checkUserRole('Nusers', user.uid);
      Swal.fire({
        title: "Good job!",
        text: "You are login successfully",
        icon: "success"
      });
      if (isAdmin) {
        navigate('/Adminpannel');
      } else if (isNormalUser) {
        navigate('/home');
      } else {
        console.error('User role not found');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User role not found",
        });
      }
    } catch (error) {
      console.error('Login error:', error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Login error: ${error.message}`,
      });
    }
  };

  const checkUserRole = async (collectionName, userId) => {
    try {
      const userDocRef = doc(collection(firestore, collectionName), userId);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists();
    } catch (error) {
      console.error('Error checking user role:', error.message);
      return false;
    }
  };

  
    const handleGmailLogin = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
    
        // Additional details you want to store in Firestore
       

    
        Swal.fire({
          title: "Good job!",
          text: "Gmail login successful!",
          icon: "success"
        });
    
        navigate('/home');
      } catch (error) {
        console.error('Gmail login error:', error.message);
    
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gmail login error: ${error.message}`,
        });
      }
    };
    
  

  return (
    <div>
      <MDBContainer fluid className="p-3 my-5">
        <br></br>
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
          </MDBCol>

          <MDBCol col='4' md='6'>
            <form onSubmit={handleManualLogin}>
              <MDBInput
                wrapperClass='mb-4'
                label='Email'
                id='formControlLg'
                type='email'
                size="lg"
                name="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} required />

              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                id='formControlLg'
                type='password'
                size="lg"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} required />

              <Button
                variant="primary"
                size="lg"
                className="custom-button2"
                type="submit"
                style={{
                  marginRight: '10px',
                  background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}>
                Login
              </Button>

              <br></br>
              <br></br>
           
              <button type="button" onClick={handleGmailLogin}>
              <FontAwesomeIcon icon={faEnvelope} /> Open Gmail
            </button>   <br></br>

              <a href='/Forgotpassword'><p>Forgot Password ?</p></a>
              <p>Don't have an account yet?</p>
              <a href='/register'>
                <Button
                  variant="primary"
                  size="md"
                  style={{
                    background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                  }}
                  className="custom-button2">
                  Create an account
                </Button>
              </a>
            </form>
            
            {/* Add Gmail login button */}
         
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}