import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth, firestore, provider } from '../firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [address, setaddress] = useState('');
  const [nic, setNic] = useState(null);
  const [Name, setName] = useState('');
  const [categorie,setcategorie]=useState('');
  const [tel,settel]=useState(null);
  const [image, setImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Normaluser');
   const [value, setValue] = useState('');
   const navigate = useNavigate();


  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };



  const vote="null"
  const validateDisplayName = () => {
    return !/\d/.test(displayName);
  };

  const validatePassword = () => {
    const minLength = 8;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);

    return password.length >= minLength && containsLetters && containsNumbers;
  };

  const validatePhoneNumber = () => {
 
    const phoneNumberPattern = /^(0\d{9}|0\d{2}-\d{7})$/;
  
  
    return phoneNumberPattern.test(tel);
  };
  

  const validateNIC = () => {
    // Regular expression pattern for Sri Lankan NIC numbers
    const nicPattern = /^(?:\d{9}[vVxX]|\d{12})$/;
  
    // Test the input NIC against the pattern
    return nicPattern.test(nic);
  };

  
  const handlelogin = () => {
    signInWithPopup(auth, provider)
      .then(async (data) => {
        setValue(data.user.email);
        localStorage.setItem('email', data.user.email);
  
        // Additional details you want to store in Firestore
        const additionalDetails = {
          email: data.user.email,
          vote_status: vote,
          Role: selectedRole,
          Submitdate: serverTimestamp(),
          // Add any other details you want to store
        };
  
  
        const userDocRef = doc(firestore,'Nusers', data.user.uid);
        await setDoc(userDocRef, additionalDetails);
  
        Swal.fire({
          title: "Gob job!",
          text: "Register Successfully",
          icon: "success"
        });
  
        navigate('/home');
      })
      .catch((error) => {
        console.error('Login error:', error.message);
    
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Login error: ${error.message}`,
        });
      });


}

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!validateDisplayName()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Display name must contain non-numeric characters.',
      });
      
      return;
    } else if (!validatePassword()) {
     
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:'Password must be at least 8 characters long and contain both letters and numbers.',
      });
      
      return;
    }

    else if (!validatePhoneNumber()) {
     
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:'Phone Number must be 10 numbers ex:0701553732',
      });
      
      return;
    }


    else if (!validateNIC()) {
     
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:'NIC Number must be (ex: 123456789V or 200219401140)',
      });
      
      return;
    }

  

    
    try {

   
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Wait for the user creation to be completed before updating Firestore
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Upload image to Firebase Storage
      const storageInstance = getStorage();
      const storageInstance1 = getStorage();
      const imageRef = ref(storageInstance, `Admin-images/${user.uid}`);
      const imageRef1 = ref(storageInstance1, `competition-logo/${user.uid}`);
      await uploadBytes(imageRef, image);
      await uploadBytes(imageRef1, image1);
  
      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);
      const imageUrl1 = await getDownloadURL(imageRef1);
     
      if (selectedRole==='Admin'){
      // Update user profile with email, display name, NIC, and image URL
      await setDoc(doc(firestore, 'Admins',user.uid), {
        email: email,
        displayName: displayName,
        nic: nic,
        Submitdate:serverTimestamp(),
        vote_status:vote,
        Role:selectedRole,
        image:imageUrl,
        imagelogo:imageUrl1,
        Contact:tel,
        address:address,
        Competition_name:Name,
        Competition_cat:categorie,

      });
    }
    else{
      await setDoc(doc(firestore,'Nusers',user.uid), {
        email: email,
        vote_status:vote,
        Role:selectedRole,
        Submitdate:serverTimestamp(),
      });
    }
  
      Swal.fire({
        title: "Gob job!",
        text: 'Signup successful!',
        icon: "success"
      });

      console.log('Signup successful!');
    } catch (error) {
      
      console.error('Signup error:', error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:`Signup error: ${error.message}`,
      });
      
     
    }
  };


  
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handlelogo = (e) => {
    const file = e.target.files[0];
    setImage1(file);
  };

  const handlecategorie =(e)=>{
    setcategorie(e.target.value);
  }

  return (
    <div>
      <br></br>
      <MDBContainer fluid className="p-3 my-5">
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone imagefd"
            />
          </MDBCol>
          <MDBCol col='4' md='6'>
            <form onSubmit={handleSignup}>
              <MDBInput
                wrapperClass='mb-4'
                label='Email'
                id='formControlLg'
                type='email'
                size="lg"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                id='formControlLg'
                type='password'
                size="lg"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
             
             
                 
        <label htmlFor="Role">Choose Role:</label>
        <select name="Role" id="Role" onChange={handleRoleChange} value={selectedRole}>
        <option value="Normaluser">Normal User</option>
        <option value="Admin">Admin</option>
        </select>
        <br></br>
        {selectedRole === 'Admin' && (
        <div><br></br>
         
       <MDBInput
       wrapperClass='mb-4'
       label='NIC'
       id='formControlLg'
       type='text'
       size="lg"
       name="NIC"
       value={nic}    
       onChange={(e) => setNic(e.target.value)}
       required
       
     />

               <MDBInput
                wrapperClass='mb-4'
                label='Display name'
                id='formControlLg'
                type='text'
                size="lg"
                name="DisplayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />

               <MDBInput
                wrapperClass='mb-4'
                label='Address'
                id='formControlLg'
                type='text'
                size="lg"
                name="address"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
                required
              />

                <MDBInput
                wrapperClass='mb-4'
                label='Contact Number'
                id='formControlLg'
                type='number'
                size="lg"
                name="Contact Number"
                value={tel}
                onChange={(e) => settel(e.target.value)}
                required
              />
               <h6>Utility Bill Image</h6>
               <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                required
              /><br></br><br></br>

                <h6>Competition Logo</h6>
                <input
                type="file"
                onChange={handlelogo}
                accept="image/*"
                required
              />
              <br></br><br></br>
              <h6>Competition Categorie</h6>
            <Form.Select aria-label="Default select example"
            value={categorie}
            onChange={handlecategorie}
            required>
            <option value="Realityshow">Realityshow</option>
            <option value="Oraganization">Organization</option>
             
            </Form.Select>
           <br></br>

                <MDBInput
                wrapperClass='mb-4'
                label='Competition Name'
                id='formControlLg'
                type='text'
                size="lg"
                name="DisplayName"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
                
               />
               </div>
      
              )}

            <br></br>  
            
             {selectedRole === 'Normaluser' && (   
              <button onClick={handlelogin}>
               <FontAwesomeIcon icon={faEnvelope} /> Open Gmail
             </button>
               )}


             
            <br></br> 
         
              <Button
                variant="primary"
                size="lg"
                type="submit"
                style={{
                  marginRight: '10px',
                  background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2"
              >
                Register
              </Button>
              <br />
              <br />
              <a href='/login'>
                <Button
                  variant="primary"
                  size="md"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(118, 75, 162, 0.7), rgba(101, 126, 234, 0.7)',
                  }}
                  className="custom-button2"
                >
                  Login instead
                </Button>
              </a>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
