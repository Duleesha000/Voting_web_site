import { Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import { auth, firestore, storage } from '../firebase';
import './Styles.css';

// Function to simplify image upload
const uploadImage = async (imageFile, path) => {
  try {
    const storageRef = ref(storage, path + imageFile.name);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
};

const AddPage = () => {
  const [Name, setName] = useState('');
  const [Age, setAge] = useState('');
  const [Description, setDescription] = useState('');
  const [Province, setProvince] = useState('');
  const [Image1, setImage1] = useState(null);
  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [poolIds, setPoolIds] = useState([]);
  const [editCompetitor, setEditCompetitor] = useState(null);
  const [selectedPoolId, setSelectedPoolId] = useState('');
  const [selectedPoolId1, setSelectedPoolId1] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const user = auth.currentUser;
  const[selectedcomId,setSelectedcomlId]=useState('');
 
  const longText2 = `
  This is compulsory you should select pool Id.
  `;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage1(file);
  };


  const [showModal, setShowModal] = useState(false); // State to manage the modal visibility

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlecompetitorSelection = async () => {
    try {
      if (selectedcomId && selectedPoolId) {
        // Make sure selectedcomId and selectedPoolId are not null or undefined
        const competitorRef = doc(firestore, 'competitors', selectedcomId);
        const competitorDoc = await getDoc(competitorRef);
  
        if (competitorDoc.exists()) {
          const competitorData = competitorDoc.data();
  
          // Check if poolid is an array in the competitor document
          if (Array.isArray(competitorData.poolid)) {
            // Check if the selectedPoolId already exists in the poolid array
            if (!competitorData.poolid.includes(selectedPoolId)) {
              // If it doesn't exist, add the selectedPoolId to the array
              const updatedPoolIds = [...competitorData.poolid, selectedPoolId];
  
              // Update the competitor's poolid array
              await updateDoc(competitorRef, { ...competitorData, poolid: updatedPoolIds });
            } else {
              console.log('Selected pool ID already exists in the competitor\'s poolid array.');
            }
          } else {
            console.error('poolid is not an array in the competitor document.');
          }
  
          // Close the modal after updating
          setShowModal(false);
        } else {
          console.error('Competitor not found.');
        }
      } else {
        console.error('Invalid competitor ID or pool ID for updating poolid.');
      }
    } catch (error) {
      console.error('Error updating competitor poolid:', error.message);
    }
  };
  

  useEffect(() => {
    const fetchPoolIds = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(firestore, 'Pools'), where('Adminid', '==', user.uid)));
  
        if (!querySnapshot.empty) {
          const poolData = querySnapshot.docs.map((doc) => {
            const { title } = doc.data(); // Assuming 'title' is a field in your 'Pools' documents
            return { id: doc.id, title };
          });
          setPoolIds(poolData);
        }
      } catch (error) {
        console.error('Error fetching pool IDs:', error.message);
      }
    };
  
    fetchPoolIds();
  }, [user.uid]);

  
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const poolId = selectedPoolId;
      const Image1URL = Image1 ? await uploadImage(Image1, 'sponsor_images/') : null;

      await addDoc(collection(firestore, 'competitors'), {
        Adminid: user.uid,
        Name,
        Age,
        Province,
        poolid: [poolId],
        Description,
        Image: Image1URL,
      });

      Swal.fire({
        title: "Good job!",
        text: "Competitor added successfully!",
        icon: "success"
      });
    } catch (error) {
      console.error('Register error:', error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Register error: ${error.message}`,
      });
    
     
    }
  };

  useEffect(() => {
    const fetchCompetitorDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const competitorsCollection = collection(firestore, 'competitors');
          const querySnapshot = await getDocs(query(competitorsCollection, where('Adminid', '==', user.uid)));

          if (!querySnapshot.empty) {
            const competitorData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCompetitorDetails(competitorData);
          }
        }
      } catch (error) {
        console.error('Error fetching competitor details:', error.message);
      }
    };

    fetchCompetitorDetails();
  }, []);

  const handleEditClick = (competitor) => {
    if (competitor && competitor.id) {
      setEditCompetitor({ ...competitor, Image: competitor.Image || null });
    } else {
      console.error('Invalid competitor data for editing.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!editCompetitor) {
        console.error('Invalid competitor data for editing.');
        return;
      }

      const updatedCompetitor = { ...editCompetitor };

      if (updatedCompetitor.Image) {
        const updatedImageURL = await uploadImage(updatedCompetitor.Image, 'sponsor_images/');
        updatedCompetitor.Image = updatedImageURL;
      }

      await updateDoc(doc(firestore, 'competitors', editCompetitor.id), updatedCompetitor);

      setEditCompetitor(null);

      
    } catch (error) {
      console.error('Error updating competitor details:', error.message);
    }
  };

  const handleImageEdit = (e) => {
    const file = e.target.files[0];
    setEditCompetitor({ ...editCompetitor, Image: file });
  };

  const handleDeleteCompetitor = async (competitor) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });
  
      if (result.isConfirmed) {
        const competitorRef = doc(firestore, 'competitors', competitor.id);
        const competitorSnapshot = await getDoc(competitorRef);
  
        if (competitorSnapshot.exists()) {
          const competitorData = competitorSnapshot.data();
          const poolIds = competitorData.poolid || [];
  
          if (poolIds.includes(selectedPoolId1)) {
            // If the competitor is in the selected pool, remove it from the poolid array
            await updateDoc(competitorRef, {
              poolid: arrayRemove(selectedPoolId1)
            });
          } else {
            // If the competitor is not in the selected pool, delete the entire competitor document
            await deleteDoc(competitorRef);
          }
  
          // Update the state to reflect the deletion
          const updatedCompetitors = competitorDetails.filter((c) => c.id !== competitor.id);
          setCompetitorDetails(updatedCompetitors);
  
          Swal.fire({
            title: "Deleted!",
            text: "Competitor deleted successfully!",
            icon: "success"
          });
        } else {
          console.error('Competitor document does not exist');
          Swal.fire({
            title: "Error!",
            text: "Competitor document does not exist",
            icon: "error"
          });
        }
      }
    } catch (error) {
      console.error('Error deleting competitor:', error.message);
      Swal.fire({
        title: "Error!",
        text: `Error deleting competitor: ${error.message}`,
        icon: "error"
      });
    }
  };
  

  useEffect(() => {
    const fetchCompetitorDetails = async () => {
      try {
        const user = auth.currentUser;
       
        if (user && selectedPoolId1) {
          const competitorsCollection = collection(firestore, 'competitors');
          const q = query(competitorsCollection, where('poolid', 'array-contains-any', [selectedPoolId1]));
          const querySnapshot = await getDocs(q);

          const fetchedCompetitorData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          setCompetitorDetails(fetchedCompetitorData);

          // ... handle the retrieved data
        }
      } catch (error) {
        console.error('Error fetching competitor details:', error.message);
      }
    };

    fetchCompetitorDetails();
  }, [selectedPoolId1]);

  return (
    <div className="Align" style={{backgroundColor:'#f3f6fd'}}>
           <h4 style={{marginLeft:"-50px"}}>Add Candidates </h4>
      <MDBContainer fluid className="p-3 my-5" style={{marginLeft:"-70px"}}>
        <MDBRow>
          <MDBCol col='4' md='6'>
            <form onSubmit={handleRegister}>
            <Tooltip title={<h6 style={{ color: 'lightblue' }}>{longText2}</h6>}>
            <Form.Select onChange={(e) => setSelectedPoolId(e.target.value)} aria-label="Default select example">
          <option>Select Pool ID</option>
          {poolIds.map((pool) => (
        <option key={pool.id} value={pool.id}>
         {`${pool.id} - ${pool.title}`}
        </option>
  ))}
     </Form.Select></Tooltip>

              <br></br>

              <MDBInput
                wrapperClass='mb-4'
                label='Name'
                id='formControlLg'
                type='Text'
                size="lg"
                name="Name"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Age'
                id='formControlLg'
                type='Text'
                size="lg"
                name="Age"
                value={Age}
                onChange={(e) => setAge(e.target.value)}
                required
              />


          <Form.Select onChange={(e) => setProvince(e.target.value)} aria-label="Default select example" >
          <option>Select Province</option>
          <option value="Central Province"> Central Province</option>
          <option value="Eastern Province">Eastern Province</option>
          <option value="North Central Province">North Central Province</option>
          <option value="Northern Province"> Northern Province</option>
          <option value="North Western Province">North Western Province</option>
          <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
          <option value="Southern Province">Southern Province</option>
          <option value="Uva Province">Uva Province</option>
          <option value="Western Province">Western Province</option>
         
     
          </Form.Select><br></br>

              <MDBInput
                wrapperClass='mb-4'
                label='Description'
                id='formControlLg'
                type='Text'
                size="lg"
                name="Description"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              
              <label>Competitor Image</label><br></br>
              <input
                type="file"
                onChange={handleImage}
                accept="image/*"
                required
              />

              <br></br><br></br>

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
                Add Competitor
              </Button>

              <Button
            variant="primary"
            size="lg"
            onClick={handleOpenModal} // Open the modal when the button is clicked
           style={{
            background:
            'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
            }}
           className="custom-button2"
            >
           Add excist competitores
          </Button>

              <br />
              <br />
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {competitorDetails.length > 0 && (
        <Container style={{marginLeft:'-70px'}}>
          <div>
            <h4>All Candidates Details:</h4>
            <Form.Select onChange={(e) => setSelectedPoolId1(e.target.value)} aria-label="Default select example" style={{backgroundColor:'lightblue'}}>
          <option>Select Pool ID</option>
          {poolIds.map((pool) => (
        <option key={pool.id} value={pool.id}>
         {`${pool.id} - ${pool.title}`}
        </option>
        ))}
     </Form.Select><br></br>
     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Competitor Id</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Province</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {competitorDetails
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((competitor, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{competitor.id}</TableCell>
                  <TableCell>
                    <img src={competitor.Image} alt="Competitor" style={{ maxWidth: '80px' }} />
                  </TableCell>
                  <TableCell>{competitor.Name}</TableCell>
                  <TableCell>{competitor.Age}</TableCell>
                  <TableCell>{competitor.Province}</TableCell>
                  <TableCell>{competitor.Description}</TableCell>
                  <TableCell>
                  <Button variant="primary" onClick={() => handleEditClick(competitor)}>
                        Update
                      </Button>
                    <Button
                        variant="danger"
                        style={{ marginLeft: '1px' }}
                        onClick={() => handleDeleteCompetitor(competitor)}
                      >
                        Delete
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={competitorDetails.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
          </div>
        </Container>
      )}


<Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add excist competitores </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            onChange={(e) => setSelectedcomlId(e.target.value)}
            aria-label="Default select example"
          >
            <option>Select Competitor</option>
            {competitorDetails.map((competitor) => (
              <option key={competitor.id} value={competitor.id}>
                {`${competitor.id} - ${competitor.Name}`}
              </option>
            ))}
          </Form.Select>

          <Tooltip title={<h6 style={{ color: 'lightblue' }}>{longText2}</h6>}>
            <Form.Select onChange={(e) => setSelectedPoolId(e.target.value)} aria-label="Default select example">
              <option>Select Pool ID</option>
              {poolIds.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {`${pool.id} - ${pool.title}`}
                </option>
              ))}
            </Form.Select>
          </Tooltip>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {/* Add your logic for handling the selection */}
          <Button variant="primary" onClick={handlecompetitorSelection}>
            Select
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editCompetitor !== null} onHide={() => setEditCompetitor(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Competitor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="editName">Name:</label>
          <input
            type="text"
            className="form-control"
            id="editName"
            value={editCompetitor ? editCompetitor.Name : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, Name: e.target.value })}
          />

          <label htmlFor="editAge">Age:</label>
          <input
            type="text"
            className="form-control"
            id="editAge"
            value={editCompetitor ? editCompetitor.Age : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, Age: e.target.value })}
          />

         <label htmlFor="editAge">Province:</label>
          <input
            type="text"
            className="form-control"
            id="editprovince"
            value={editCompetitor ? editCompetitor.Province : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, Province: e.target.value })}
          />

          <label htmlFor="editDescription">Description:</label>
          <input
            type="text"
            className="form-control"
            id="editDescription"
            value={editCompetitor ? editCompetitor.Description : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, Description: e.target.value })}
          />

          <label htmlFor="editImage">Image:</label>
          <input
            type="file"
            className="form-control"
            id="editImage"
            onChange={handleImageEdit}
            accept="image/*"
          />

          <label htmlFor="editPoolId">Pool ID:</label>
          <Form.Select
            aria-label="Default select example"
            value={editCompetitor ? editCompetitor.poolid : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, poolid: e.target.value })}
          >
           {poolIds.map((pool) => (
          <option key={pool.id} value={pool.id}>
         {`${pool.id} - ${pool.title}`}
        </option>
         ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddPage;
