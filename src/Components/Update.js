import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { auth, firestore, storage } from '../firebase';

export default function Update() {
  const [formData, setFormData] = useState({


    email: '',
    displayName: '',
    address: '',
    nic: '',
    Contact:'',
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
              Contact: userData.Contact || '',
              categorie: userData.Competition_cat || '',
              password: '',
              Submitdate:serverTimestamp(),
              image: userData.image || formData.image,
              imagelogo: userData.imagelogo || formData.imagelogo,
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

const validatePassword = () => {
    const minLength = 8;
    const containsLetters = /[a-zA-Z]/.test(formData.password);
    const containsNumbers = /\d/.test(formData.password);

    return formData.password.length >= minLength && containsLetters && containsNumbers;
  };

  const validatePhoneNumber = () => {
 
    const phoneNumberPattern = /^(0\d{9}|0\d{2}-\d{7})$/;
  
  
    return phoneNumberPattern.test(formData.Contact);
  };


  const validateNIC = () => {
    // Regular expression pattern for Sri Lankan NIC numbers
    const nicPattern = /^(?:\d{9}[vVxX]|\d{12})$/;
  
    // Test the input NIC against the pattern
    return nicPattern.test(formData.nic);
  };
  


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validatePassword()) {
     
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
  

  const validationErrors = {};
  setErrors(validationErrors);

  if (!formData.currentPassword) {
    validationErrors.currentPassword = 'Current password is required';
  
  }

  if (!isAdmin && !formData.password) {
    validationErrors.password = 'New Password is required ';
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
          if (formData.Contact) updateData.Contact = formData.Contact;
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
          icon: "success",
          title: "Good job",
          text: 'Updated Successfully',
        });
      } 
      else {
      
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'User not found. Please make sure you are logged in.',
        });
      }
    } catch (error) {
      console.error('Update error:', error.message);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Update error: ${error.message}`,
      });
    
    }
  }
};
  return (
    <div><br></br>
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
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass='mb-4'
                label='Email address'
                id='formControlLg'
                type='email'
                size="lg"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              {isAdmin && ( // Show these fields only if the user is an admin
                <>
                  <MDBInput
                    wrapperClass='mb-4'
                    label='Display Name'
                    id='formControlLg'
                    type='text'
                    size="lg"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    required
                  />

                  <MDBInput
                    wrapperClass='mb-4'
                    label='Address'
                    id='formControlLg'
                    type='text'
                    size="lg"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />

                   <MDBInput
                    wrapperClass='mb-4'
                    label='Contact Number'
                    id='formControlLg'
                    type='number'
                    size="lg"
                    name="Contact Number"
                    value={formData.Contact}
                    onChange={handleInputChange}
                    required
                  />

                  <MDBInput
                    wrapperClass='mb-4'
                    label='NIC'
                    id='formControlLg'
                    type='text'
                    size="lg"
                    name="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                    required
                  />

                  <h6>Competition Name</h6>
                  <MDBInput
                    wrapperClass='mb-4'
                    id='formControlLg'
                    type='text'
                    size="lg"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />

                  <h6>Competition Category</h6>
                  <select
                    name="categorie"
                    onChange={handleInputChange}
                    value={formData.categorie}
                    className="form-select mb-4"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Realityshow">Realityshow</option>
                    <option value="Organization">Organization</option>
                  </select>
                </>
              )}

              <MDBInput
                wrapperClass='mb-4'
                label='Current Password'
                id='formControlLg'
                type='password'
                size="lg"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
          {errors.currentPassword && <div className="text-danger">{errors.currentPassword}</div>}
             
                  <MDBInput
                    wrapperClass='mb-4'
                    label='New Password'
                    id='formControlLg'
                    type='password'
                    size="lg"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                   {errors.password && <div className="text-danger">{errors.password}</div>}
           {isAdmin && (
                <>
                  <h6>Utility Bill Image</h6>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  
                  />
                  <br></br>
                  {formData.image && ( // Check if image URL is available
                  <img
                  src={formData.image}
                   alt='Utility Bill'
                  style={{ maxWidth: '50%', marginTop: '10px' }}
                  />
                   )}
                  <br/><br/>

                  <h6>Competition Logo</h6>
                  <input
                    type="file"
                    onChange={handleLogoChange}
                    accept="image/*"

                  />
                  <br></br>
                  {formData.imagelogo && ( // Check if image URL is available
                  <img
                  src={formData.imagelogo}
                   alt='Utility Bill'
                  style={{ maxWidth: '50%', marginTop: '10px' }}
                  />
                   )}
                </>
              )}

              <br/><br/>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                style={{
                  marginRight: '10px',
                  background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2"
              >
                Update
              </Button>

              <a href='/login'>
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                  }}
                  className="custom-button2"
                >
                  Back to login
                </Button>
              </a>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
