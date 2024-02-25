import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Swal from 'sweetalert2';
import { auth, firestore, storage } from '../firebase';

const Adminacc = () => {
  const [adminDetails, setAdminDetails] = useState([]);
  const [loading, setLoading] = useState(true);


  const currentUser = auth.currentUser;
  
  const handleDeleteUser = async () => {
    try {
      const user = auth.currentUser;
  
      if (user) {
        // Check if the currentPassword is provided
        
        // Reauthenticate the user before deleting the account
        const credentials = EmailAuthProvider.credential(user.email, formData.currentPassword);
        await reauthenticateWithCredential(user, credentials);
  
        // Delete the user
        await user.delete();
        console.log('User deleted successfully.');
        Swal.fire({
          title: "Good job!",
          text: 'User deleted successfully.',
          icon: "success"
        });
      } else {
        console.log('No user is currently signed in.');

      }
    } catch (error) {
      console.error('Error deleting user:', error.message);

      Swal.fire({
        title: "Error!",
        text: `Error deleting user: ${error.message}`,
        icon: "error"
      });
  
      // Handle specific error messages
      if (error.code === "auth/wrong-password") {
        Swal.fire({
          title: "Error!",
          text: 'Incorrect current password.',
          icon: "error"
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: `Error deleting user: ${error.message}`,
          icon: "error"
        });
      }
    }
  };
  


  const [formData, setFormData] = useState({


    email: '',
    displayName: '',
    address: '',
    nic: '',
    name: '',
    categorie: '',
    Submitdate:'',
    password: '',
    currentPassword: '',
    image: null,
    imagelogo: null,
    
  });

  const [errors, setErrors] = useState({
    email: '',
    displayName: '',
    password: '',
    currentPassword: '',
  });

  const [isAdmin, setIsAdmin] = useState(false); // Add state to track user role

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const adminDocRef = doc(firestore, 'Admins', user.uid);
          const nuserDocRef = doc(firestore, 'Nusers', user.uid);

          const isAdminUser = (await getDoc(adminDocRef)).exists();
          const isNuserUser = (await getDoc(nuserDocRef)).exists();

          setIsAdmin(isAdminUser);

          const userDocRef = isAdminUser ? adminDocRef : nuserDocRef;
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            console.log('Fetched User Data:', userData);

            setFormData({
              email: userData.email || '',
              displayName: userData.displayName || '',
              address: userData.address || '',
              nic: userData.nic || '',
              name: userData.Competition_name || '',
              categorie: userData.Competition_cat || '',
              password: '',
              Submitdate:serverTimestamp(),
              image: userData.image || null,
              imagelogo: userData.imagelogo || null,
            });
          } else {
            console.error('User document not found.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imagelogo: file });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = {};
  setErrors(validationErrors);

  if (!formData.currentPassword) {
    validationErrors.currentPassword = 'Current password is required';
  }

  if (!isAdmin && !formData.password) {
    validationErrors.password = 'Password is required';
  }

  if (Object.keys(validationErrors).length === 0) {
    try {
      const user = auth.currentUser;

      if (user) {
        const authInstance = auth; // Retrieve the auth instance

        // Reauthenticate the user before changing the password
        const credentials = EmailAuthProvider.credential(user.email, formData.currentPassword);
        await reauthenticateWithCredential(user, credentials);

        const userRef = isAdmin ? doc(firestore, 'Admins', user.uid) : doc(firestore, 'Nusers', user.uid);

        // Only include the necessary fields in the updateData object
        const updateData = {
          email: formData.email,
          password: formData.password,  // Include password field for Nusers
          currentPassword: formData.currentPassword,
          Submitdate:serverTimestamp(),
        };

        if (isAdmin) {
          // Include additional fields for admins
          if (formData.displayName) updateData.displayName = formData.displayName;
          if (formData.address) updateData.address = formData.address;
          if (formData.nic) updateData.nic = formData.nic;
          if (formData.name) updateData.Competition_name = formData.name;
          if (formData.categorie) updateData.Competition_cat = formData.categorie;

          if (formData.image) {
            const imageRef = ref(storage, `userImages/${user.uid}_${formData.image.name}`);
            await uploadBytes(imageRef, formData.image);
            const imageUrl = await getDownloadURL(imageRef);
            updateData.image = imageUrl;
          }

          if (formData.imagelogo) {
            const logoRef = ref(storage, `userLogos/${user.uid}_${formData.imagelogo.name}`);
            await uploadBytes(logoRef, formData.imagelogo);
            const logoUrl = await getDownloadURL(logoRef);
            updateData.imagelogo = logoUrl;
          }
        }

        await updateDoc(userRef, updateData);

        // Update the password
        if (isAdmin) {
          // Only update password for admins
          await updatePassword(user, formData.password);
        }

       
        Swal.fire({
          title: "Gob job!",
          text: "'Update successful!'",
          icon: "success"
        });
      } else {

        alert('User not found. Please make sure you are logged in.');
      }
    } catch (error) {
      console.error('Update error:', error.message);
      alert(`Update error: ${error.message}`);
    }
  }
};
  const fetchAdminDetails = async () => {
    try {
      if (currentUser) {
        console.log('Current User UID:', currentUser.uid);

        const adminsCollection = collection(firestore, 'Admins');
        const q = query(adminsCollection, where('email', '==', currentUser.email));
        const adminsSnapshot = await getDocs(q);

        if (!adminsSnapshot.empty) {
          const adminData = [];
          adminsSnapshot.forEach((doc) => {
            adminData.push({ id: doc.id, ...doc.data() });
          });
          setAdminDetails(adminData);
          console.log('User Name:', adminDetails[0]?.displayName); 
          setLoading(false);

        } else {
          console.log('No admin data found for the current user.');
          setAdminDetails([]);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error fetching admin details:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [currentUser]);

  return (
    <div style={{ paddingTop: '100px' }}>
      <Container style={{ paddingLeft: '150px' }}>
        <Row className="justify-content-md-center">
          <Col xs lg="1"></Col>
          <Col xs lg="">
            <Tabs
              defaultActiveKey="profile"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="home" title="Admin Details" style={{ color: 'black', fontSize: '18px' }}>
                {adminDetails[0]?.displayName && (
                <>
                 User Name:- {adminDetails[0]?.displayName}<br /> <br></br>
                 User Email:- {adminDetails[0]?.email}<br></br><br></br>
                 Address:- {adminDetails[0]?.address}<br></br><br></br>
                 Contact:- {adminDetails[0]?.Contact}<br></br><br></br>
                 Competition Name:-{adminDetails[0]?.Competition_name}<br></br><br></br>
                 Voting Category:- {adminDetails[0]?.Competition_cat}<br></br><br></br>
                 Account Approve Status:- {adminDetails[0]?.Approve_status}<br></br>
                </>
              )}  
              </Tab>
              <Tab eventKey="profile" title="Subscription" style={{ color: 'black', fontSize: '18px' }}>
              {adminDetails[0]?.packagename && (
               <>
               Package Type:- {adminDetails[0]?.packagename}<br /><br></br>
  
               Package Start Date:- {adminDetails[0]?.Subscription_get?.toDate().toLocaleString()}<br /><br></br>
              
               Package End Date:- {adminDetails[0]?.Subscription_end?.toDate().toLocaleString()}<br /><br></br>
                  </>
                  )}

                 <Button
                variant="primary"
                size="lg"
                type="submit"
                // onClick={updatepkg}
                style={{
                  marginRight: '10px',
                  background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2">
                Upgrate Package
              </Button>
              </Tab>
        <Tab eventKey="contact" title="Delete Account" style={{ color: 'black', fontSize: '25px' }}>


          <MDBContainer fluid className="p-3 my-5">
          <MDBRow>
          
          <MDBCol col='4' md='6'>
            <form onSubmit={handleSubmit}>
            <label style={{fontSize:'20px'}}>Email</label>
              <MDBInput
                wrapperClass='mb-4'
                label=''
                id='formControlLg'
                type='email'
                size="lg"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <label style={{fontSize:'20px'}}>Password</label>

              <MDBInput
                wrapperClass='mb-4'
                label=''
                id='formControlLg'
                type='password'
                size="lg"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />

        

             

              <Button
                variant="primary"
                size="lg"
                type="submit"
                onClick={handleDeleteUser}
                style={{
                  marginRight: '10px',
                  background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2">
                Delete Account
              </Button>
            </form>
          </MDBCol>
          </MDBRow>
         </MDBContainer>
              </Tab>

              
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Adminacc;
