import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { auth } from '../firebase';


export default function ForgotPassword() {


  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    newPassword: '',
  });

  const history = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

   
  };

  const handlePasswordReset = async () => {

    try {
     
      if(!formData.email){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Please type email address`,
        });
  
      }

      else{
      await sendPasswordResetEmail(auth, formData.email);


      Swal.fire({
        title: "Good job!",
        text: "Password reset email sent. Please check your email to update your password.",
        icon: "success"
      });
    }
    
  }   catch (error) {

      console.error('Password reset error:', error.message);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Password reset error: ${error.message}`,
      });
    }
  };

  const handleRegistration = async () => {
    const validationErrors = {};
    setErrors(validationErrors);

    if (!formData.email) {
      validationErrors.email = 'Email is required';
    }

    if (!formData.newPassword) {
      validationErrors.newPassword = 'New password is required';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Create a new user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.newPassword);
        const user = userCredential.user;

        // Log the user object
        console.log('New user:', user);

        // Send verification email to the provided email
        await sendEmailVerification(user);

        console.log('Verification email sent. Please check your email to verify your account.');
        alert('Verification email sent. Please check your email to verify your account.');

        // Redirect to home or another page after successful registration
        history('/');
      } catch (error) {
        console.error('Error creating user or sending verification email:', error.message);
        alert(`Error creating user or sending verification email: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <MDBContainer fluid className="p-3 my-5">
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
          </MDBCol>
          <MDBCol col='4' md='6'>
            <form>
              <MDBInput
                wrapperClass='mb-4'
                label='Email address'
                id='formControlLg'
                type='email'
                size="lg"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={handlePasswordReset}
                style={{
                  marginRight: '10px',
                  background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2"
              >
                Reset Password
              </Button>

           
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
