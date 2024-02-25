import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch } from 'firebase/firestore';
import {
  MDBBtn, MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardImage, MDBCol, MDBContainer, MDBIcon,
  MDBInput, MDBRow, MDBTextArea
} from 'mdb-react-ui-kit';
import { Ripple, initMDB } from "mdb-ui-kit";
import React, { useEffect, useState } from "react";
import { Button, Image } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Swal from 'sweetalert2';
import { firestore } from '../firebase';
import './Styles.css';
// Initialization for ES Users
import { onAuthStateChanged } from 'firebase/auth';
import { Input } from "mdb-ui-kit";
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

initMDB({ Input, Ripple });
initMDB({ Dropdown, Ripple });

const filter = createFilterOptions();

export default function Pools() {


  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [activePools, setActivePools] = useState([]);
  const [poolDetails, setPoolDetails] = useState([]);
  const [poolDetails1, setPoolDetails1] = useState([]);
  const [user, setUser] = useState(null);
  const [checked, setChecked] = React.useState(new Array(competitorDetails.length).fill(false));
  const [checkedCompetitorIds, setCheckedCompetitorIds] = useState([]);
  const [setPoolId]=useState('');
  const [voteCount, setVoteCount] = useState({});
  const [commentText, setCommentText] = useState('');
  const [userComments, setUserComments] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const [id,setid]=useState('');
  const [selectedCompetitorId, setSelectedCompetitorId] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Trigger the data fetching only if user and poolId are available
      if (user) {
        fetchCompetitorsByPoolId(user);
      }
    });

    return () => unsubscribe();
  }, [user]);
  
 
const poolId='DRj3wPeypiwXk1RE7m8T';



useEffect(() => {
  const fetchSuggestions = async () => {
    try {
      const poolsCollection = collection(firestore, 'Pools');
      const querySnapshot = await getDoc(poolsCollection);
  
      if (!querySnapshot.empty) {
        const poolData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().Name,
        }));
  
        setSuggestions(poolData);
        console.log(poolData.id); // You might want to loop through the array
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error.message);
    }
  };

  fetchSuggestions();
}, [user]);


  useEffect (()=>{
    const fetchUserComments = async () => {
      if (user) {
  
        try {
         
          const commentsCollection = collection(firestore, 'Comments');
    
          const q = query(commentsCollection,where('poolId', 'array-contains', poolId));
    
          const querySnapshot = await getDocs(q);
    
          const comments = [];
          querySnapshot.forEach((doc) => {
          comments.push({ id: doc.id, ...doc.data() });
          });
        
          setUserComments(comments);
  
        } catch (error) {
          console.error('Error fetching user comments: ', error.message);
        }
      }
    };

    fetchUserComments();
  })
  
  
  const postComment = async (e) => {
    e.preventDefault();
    console.log('postComment function called');
  
    try {
      const commentsCollection = collection(firestore, 'Comments');
  
      const userId = user.uid;
    
  
      if (!commentText.trim()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Comment text cannot be empty",
        });
        return;
      }
  
      // Convert poolId to an array if it's not already
      const poolIdArray = Array.isArray(poolId) ? poolId : [poolId];
  
      const newComment = {
        userId: userId,
        postDate: serverTimestamp(),
        poolId: poolIdArray,
        text: commentText,
        email: user.email
      };
  
      const docRef = await addDoc(commentsCollection, newComment);
  
      console.log('Comment added with ID: ', docRef.id);
      setCommentText('');
      Swal.fire({
        title: "Good job!",
        text: "Comment added successfully",
        icon: "success"
      });
    
    } catch (error) {
      console.error('Error adding comment: ', error.message);
    }


  };


  const deleteComment = async (commentId) => {
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
        // Fetch the comment document
        const commentRef = doc(firestore, 'Comments', commentId);
        const commentSnapshot = await getDoc(commentRef);
  
        if (commentSnapshot.exists()) {
          const commentData = commentSnapshot.data();
          const commentPoolIds = commentData.poolId || [];
  
          // Check if the poolId exists in the comment's poolId array
          if (commentPoolIds.includes(poolId)) {
            // If yes, remove it from the array
            await updateDoc(commentRef, {
              poolId: arrayRemove(poolId)
            });
  
            Swal.fire({
              title: "Deleted!",
              text: "Your comment has been deleted.",
              icon: "success"
            });
  
            // Fetch comments again after deleting a comment
          } else {
            // If the poolId doesn't exist in the array, simply delete the comment
            await deleteDoc(commentRef);
  
            Swal.fire({
              title: "Deleted!",
              text: "Your comment has been deleted.",
              icon: "success"
            });
  
            // Fetch comments again after deleting a comment
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Comment not found.",
          });
        }
      }
    } catch (error) {
      console.error('Error deleting comment: ', error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };


  // Function to update a comment
  const updateComment = async (commentId, newText) => {
    try {
      const commentsCollection = collection(firestore, 'Comments');
      await updateDoc(doc(commentsCollection, commentId), { text: newText });
      Swal.fire({
        title: "Good job!",
        text: "Comment update successfully",
        icon: "success"
      });
      // Fetch comments again after updating a comment
    
    } catch (error) {
      console.error('Error updating comment: ', error.message);
    }
  };


 
  const handleSwitchChange = async (index, competitorId) => {
    const currentDate = new Date();
  
    // Check if the current date is within the pool voting period
    if (
      poolDetails1.length > 0 &&
      currentDate >= new Date(poolDetails1[0].stdate.toMillis()) &&
      currentDate <= new Date(poolDetails1[0].enddate.toMillis())
    ) {
      // User is allowed to vote
    
    } else {
      // Pool is not currently active, display an alert or message to the user
   
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Voting is not currently active for this pool.",
       
      });
    }
    console.log(poolDetails.stdate);
    console.log(`Switch changed for competitor at index ${index} with ID ${competitorId}`);
   
  
   
  
    // Check if the current user has already voted for this competitor
  
      const userRef = doc(firestore, 'Nusers', user.uid);
      const userDoc = await getDoc(userRef);
  
      // Check if the user has already voted for the current pool
      const userVotedPoolsMap = userDoc.data().votedPools || {};
      const poolId = "DRj3wPeypiwXk1RE7m8T"; // Replace with your actual pool ID
  
      if (userVotedPoolsMap[poolId]) {
        console.log('User has already voted for this pool.');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You are already voted for this pool.",
         
        });
        return;
      }
  
    const updatedChecked = [...checked];
    updatedChecked[index] = !updatedChecked[index];
    setChecked(updatedChecked);
  
    // Update checked competitor IDs
    if (updatedChecked[index]) {

      setCheckedCompetitorIds((prevIds) => [...prevIds, competitorId]);
      // Increment vote count for the current user
      setVoteCount((prevCounts) => ({ ...prevCounts, [competitorId]: (prevCounts[competitorId] || 0) + 1 }));
    } else {
      setCheckedCompetitorIds((prevIds) => prevIds.filter((id) => id !== competitorId));
      // Decrement vote count for the current user
      setVoteCount((prevCounts) => ({ ...prevCounts, [competitorId]: (prevCounts[competitorId] || 1) - 1 }));
    }
  };


  
  const updateVoteCountInFirestore = async () => {
    try {
      const poolId = "DRj3wPeypiwXk1RE7m8T";
      const userRef = doc(firestore, 'Nusers', user.uid);
      const userDoc = await getDoc(userRef);
  
      const userVotedPoolsMap = userDoc.data().votedPools || {};
  
      if (userVotedPoolsMap[poolId]) {
        console.log('You are already voted for this pool.')
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You are  already voted for this pool.",
         
        });
        return;
      }

      const batch = writeBatch(firestore);
  
      for (const competitorId of checkedCompetitorIds) {
        const competitorRef = doc(firestore, 'competitors', competitorId);
  
        // Fetch the current voteCount value
        const competitorDoc = await getDoc(competitorRef);
        const currentVoteCount = competitorDoc.data().voteCount || 0;
        const votedPoolsMap = competitorDoc.data().votedPools || {};
  
        // Increment the voteCount manually
        const newVoteCount = currentVoteCount + 1;
        // Replace with your actual pool ID
        votedPoolsMap[poolId] = newVoteCount;
        
        batch.update(competitorRef, {
          votedPool:votedPoolsMap,
          voteCount: newVoteCount,
        });
      }
  
      // Commit the batch only once after all updates
    await batch.commit();

    userVotedPoolsMap["DRj3wPeypiwXk1RE7m8T"] = true;

    await updateDoc(userRef, {
      votedPools:userVotedPoolsMap,
    });
   
      console.log('Vote count updated in Firestore');
      Swal.fire({
        title: "Good job!",
        text: "Vote added successfully",
        icon: "success"
      });
    } catch (error) {
      console.error('Error updating vote count in Firestore:', error.message);
    }
  };
  
  const handleAddVoteClick = () => {
    if (checkedCompetitorIds.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Select at least one competitor before adding your vote.",
       
      });
      return;
    }
   
    // Call the function to update vote count in Firestore
    updateVoteCountInFirestore();
  };
  


  
  const fetchActivePools = async () => {
    try {
      const poolsCollection = collection(firestore, 'Pools');
      const activePoolsQuery = query(poolsCollection, where('Competition_cat', '==', 'Realityshow'), where('poolActive', '==', 'Active'));
      const activePoolsQuerySnapshot = await getDocs(activePoolsQuery);

      if (!activePoolsQuerySnapshot.empty) {
        const activePoolsData = [];
        activePoolsQuerySnapshot.forEach((poolDoc) => {
          activePoolsData.push({ id: poolDoc.id, ...poolDoc.data() });
        });
        setPoolDetails(activePoolsData);
       

      }
    } catch (error) {
      console.error('Error fetching active pools:', error.message);
    }
  };


  const fetchAllPools = async () => {
    try {
      const poolsCollection = collection(firestore, 'Pools');
      const activePoolsQuery = query(poolsCollection, 
        where('poolActive', '==', 'Active'),
        where('Competition_cat', 'in', ['Organization', 'Realityshow'])
      );
      const activePoolsQuerySnapshot = await getDocs(activePoolsQuery);

      if (!activePoolsQuerySnapshot.empty) {
        const activePoolsData = [];
        activePoolsQuerySnapshot.forEach((poolDoc) => {
          activePoolsData.push({ id: poolDoc.id, ...poolDoc.data() });
        });
        setActivePools(activePoolsData);
       

      }
    } catch (error) {
      console.error('Error fetching active pools:', error.message);
    }
  };


  const fetchActivePool = async () => {
    try {
      const poolsCollection = collection(firestore, 'Pools');
      const activePoolsQuery = query(poolsCollection, where('poolId', '==', poolId));
      const activePoolsQuerySnapshot = await getDocs(activePoolsQuery);

      if (!activePoolsQuerySnapshot.empty) {
        const activePoolsData = [];
        activePoolsQuerySnapshot.forEach((poolDoc) => {
          activePoolsData.push({ id: poolDoc.id, ...poolDoc.data() });
        });
        setPoolDetails1(activePoolsData);
       

      }
    } catch (error) {
      console.error('Error fetching active pools:', error.message);
    }
  };

  

  useEffect(() => {
    fetchActivePools();
    fetchActivePool();
    fetchAllPools();
  }, []);
  
 

  const fetchCompetitorsByPoolId = async () => {
    try {
      const competitorsCollection = collection(firestore, 'competitors');
      const competitorQuery = query(competitorsCollection, where('poolid','array-contains','DRj3wPeypiwXk1RE7m8T'));
      const competitorQuerySnapshot = await getDocs(competitorQuery);

      if (!competitorQuerySnapshot.empty) {
        const competitorData = [];
        competitorQuerySnapshot.forEach((competitorDoc) => {
          competitorData.push({ id: competitorDoc.id, ...competitorDoc.data() });
        });
        setCompetitorDetails(competitorData);
      }
    } catch (error) {
      console.error('Error fetching competitors by pool ID:', error.message);
    }
  };



  

  const [inputValue, setInputValue] = useState('http://localhost:3000/Pools');

  const handleCopyClick = () => {
    // Copy the value to the clipboard
    navigator.clipboard.writeText(inputValue)
      .then(() => {
        console.log('Text copied to clipboard:', inputValue);
        // You can also provide feedback to the user that the text has been copied
      })
      .catch(err => {
        console.error('Unable to copy text to clipboard', err);
        // Handle any errors that may occur during the copy process
      });
  };


  const handleSearchClick = (id) => {
    console.log(id);
      // If a pool is selected, navigate to the Realpool page with the selected pool's ID
     
      // Handle the case where no pool is selected
      // For example, display an alert to prompt the user to select a pool
  
  };


    return (
<div style={{backgroundColor:'#111827'}}>

<Container style={{marginTop:'50px' ,backgroundColor:'#111827'}}>
  <br></br><br></br>
      <Row className="justify-content-md-center">
        <Col xs lg="1" >
        <Dropdown align="end" >
              <Dropdown.Toggle variant="secondary" id="user-dropdown" >
                categories
              </Dropdown.Toggle>
              <Dropdown.Menu>
               
                    <Dropdown.Item href="/Realityshow">Reality Shows</Dropdown.Item>
                    <Dropdown.Item href="/Organizations">Oraganization</Dropdown.Item>
                
  
              </Dropdown.Menu>
            </Dropdown>
        </Col> 
         <React.Fragment>
        <Col md="auto" style={{marginLeft:'40px', color:'white'}}>
          
      
          
     <Autocomplete
     value={value}
    onChange={(event, newValue) => {
    if (typeof newValue === 'string') {
      // setSelectedCompetitorId(null);
      setValue({
        inputValue: newValue,
        name: newValue,
        id: '',
      });
   
    } else if (newValue && newValue.inputValue) {
     
      setValue(newValue);
    

     
    } else {
      // setSelectedCompetitorId(null);
      setValue(newValue);
      handleSearchClick(value.id);
     
 

    }
  }}
  filterOptions={(options, params) => {
    const filtered = filter(options, params);

    if (params.inputValue !== '') {
      const matchingSuggestions = suggestions.filter((suggestion) =>
        suggestion.title.toLowerCase().includes(params.inputValue.toLowerCase())
      );

      matchingSuggestions.forEach((suggestion) => {
        filtered.push({
          inputValue: suggestion.name,
          title: suggestion.name,
          id: suggestion.id,
        });
      });
    }

    return filtered;
  }}
  
  id="free-solo-dialog-demo"
  options={activePools.map((option) => ({
    id: option.id,
    title: option.title,
    inputValue: option.name,
  }))}
  getOptionLabel={(option) => option.inputValue || option.title|| ''}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  sx={{ width: 300 }}
  freeSolo
  renderInput={(params) => (
    <TextField   sx={{
      border: '2px solid white',
      borderRadius: 1,
      '& input': {
        color: 'white',
        height: '10px',
        marginBottom:'7px' // Set input text color to white
      },
      '& label': {
        color: 'white', // Set label text color to white
      },
    }}
      {...params}
      label="Search Pool"
      value={(value && value.inputValue) || ''}
    />
    
  )}
  renderOption={(props, option, { inputValue }) => (
 
    <li {...props}>
      <div>
        <strong>{option.title}</strong> 
      </div>
    </li>
  
  )}
/>


 
 
        </Col>
        <Col xs lg="1">
       <div>
       <Link
         to={{
        pathname: "/Realpools",
        search: `?poolId=${value.id}`,
      }}>
 <button
            type="button"
            className="btn btn-primary"
            data-mdb-ripple-init
            style={{ height: '55px' }}
            onClick={handleSearchClick} // Call handleSearchClick when the button is clicked
          >
            <i className="fas fa-search"></i>
          </button></Link>
  </div>
        </Col>
 </React.Fragment>

      </Row><br></br>
      <h2 style={{color:'white'}}>Trending Voting Pools</h2><br></br>

      <section class="text-center">
  <div className="row">
    <div className="col-lg-3 col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative">
      <img
        src='https://i.ibb.co/0ySzt3h/Star-Singer-Season-9-1.jpg'
        className='img-thumbnail'
        alt='...'
        width={'280px'}
        height={'250px'}
      />
      <h4 className="fw-normal mb-0" style={{color:'white'}} >Stage Singer</h4>
    </div>

    <div className="col-lg-3 col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative">
      
      <img
        src='https://i.ibb.co/4dPGGVK/9f72ba755216dcb34b60a6570c803747.jpg'
        className='img-thumbnail'
        alt='...'
        width={'330px'}
        height={'210px'}
      />
      <h4 className="fw-normal mb-0" style={{color:'white'}}>The Voice</h4>
    </div>

        {poolDetails.map((Pools, index) => (
         
              <div key={index} className="col-lg-3 col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative">
               <Link
               to={{
               pathname: "/Realpools",
               search: `?poolId=${Pools.id}`
               }}>

                <img
                  src={Pools.Competition_logo} 
                  className='img-thumbnail'
                  alt='...'
                  width={'330px'}
                  height={'210px'}
                /></Link>
                <h4 className="fw-normal mb-0" style={{ color: 'white' }}>{Pools.Competition_name}</h4>
              </div>
            ))}

  

   
  </div>
</section><br></br><br></br>


        {poolDetails.length > 0 && (
        <div>
          <h1 style={{color:"white"}}>{poolDetails1[0].title}</h1>
          <br />
          <h4 style={{color:"white"}}>
          Voting Start {new Date(poolDetails1[0].stdate.toMillis()).toLocaleString()} - Voting End {new Date(poolDetails1[0].enddate.toMillis()).toLocaleString()}
          </h4>
          <br />
        </div>
      )}
    </Container><br></br><br></br>
    <MDBContainer>
      <MDBRow>
      <MDBCol md='3'>
      <Image src="https://i.ibb.co/VWLWZFb/815933137.jpg" rounded  style={{height:'100px'}}/>
      </MDBCol>
      <MDBCol md='6'>
      
      </MDBCol>
      <MDBCol md='3'>
      <Image src="https://i.ibb.co/VWLWZFb/815933137.jpg" rounded  style={{height:'100px',marginLeft:"150px"}}/>
      </MDBCol>
      </MDBRow>

      
    </MDBContainer><br></br>
      
    {competitorDetails.length > 0 && (
        <Container>
          <div>
            
            <Row>
              {competitorDetails.map((competitor, index) => (
                <Col key={index} sm={'auto'} className="mb-4" >
                  <Card style={{ width: '18rem',width:'300px'}}>
                 
                    <Card.Img variant="top" src={competitor.Image} style={{width:'300px' ,height:'500px'}} />
                    <Card.Body>
                      <Card.Title>Name- {competitor.Name}</Card.Title>
                      <Card.Text>Colombo distric</Card.Text>
                      <Card.Text>Age:21</Card.Text>
                      <Switch
                        checked={checked[index] || false}
                        onChange={() => handleSwitchChange(index, competitor.id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      )}
              <Button
                variant="primary"
                size="lg"
                type="submit"
                onClick={handleAddVoteClick}
                style={{
                marginLeft: '110px',
                background:'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2">
                Add Vote 
              </Button>

              <Link  
               to={{
               pathname: "/Results",
               search: `?poolId=${poolId}`
               }}><Button
                variant="primary"
                size="lg"
                type="submit"
                style={{
                marginLeft: '30px',
                background:'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',}}
                className="custom-button2">
                View Result
              </Button></Link>

              <br></br><br></br>

           <Container >
           <Row>
           <Col md={5} style={{backgroundColor:'#202838',borderRadius:'10px'}}><br></br>
        <section className=''>
          <form action=''>
            <MDBRow className='d-flex justify-content-center'>
              <MDBCol size="auto">
               
                <p className='pt-2'>
                  <strong style={{color:'white'}}>Share the Link</strong>
                </p>
              </MDBCol>

              <MDBCol md='5' start>
              <MDBInput
        contrast
        className='mb-4'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} // Track input value
      />
              </MDBCol>

              <MDBCol size="auto">
              <MDBBtn
        outline
        color='light'
        type='button' // Use type='button' to prevent form submission
        className='mb-4'
        style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }}
        onClick={handleCopyClick} // Handle click event
      >
                  Copy
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </form>
        </section>

        <section className='mb-4' style={{paddingLeft:'110px'}}>
          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='facebook-f' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='twitter' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='google' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='instagram' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='linkedin-in' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='github' />
          </MDBBtn>
        </section>
           </Col>

           <Col md={5}>

           </Col>
       
            </Row>
      
            </Container>
   <form onSubmit={postComment}>
  <Container style={{ height: '500px', overflowY: 'auto' }}>
  <section className="vh-100" style={{ backgroundColor: '#111827', marginLeft: '-440px' }}>
    <MDBContainer className="py-5">
      
      <Row className="justify-content-center">
        
        <Col md="12" lg="10" xl="8">
        <MDBCardFooter className="py-3 border-0" style={{ backgroundColor: '#111827' }}>
              <div className="d-flex flex-start w-100">
                <MDBCardImage
                  className="rounded-circle shadow-1-strong me-3"
                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                  alt="avatar"
                  width="40"
                  height="40"
                />
                <MDBTextArea
                  label="Message"
                  id="textAreaExample"
                  rows={4}
                  style={{ backgroundColor: '#111827', color: 'white' }}
                  wrapperClass="w-100"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <div className="float-end mt-2 pt-1" style={{ color: 'white' }}>
                <MDBBtn size="sm" type="submit">
                  Post comment
                </MDBBtn>
                <MDBBtn outline size="sm">
                  Cancel
                </MDBBtn>
              </div>
            </MDBCardFooter>
          {userComments.map((comment) => (
            <MDBCard key={comment.id} style={{ backgroundColor: '#111827', marginBottom: '20px' }}>
              <MDBCardBody>
                <div className="d-flex flex-start align-items-center">
                  <MDBCardImage
                    className="rounded-circle shadow-1-strong me-3"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                    alt="avatar"
                    width="60"
                    height="60"
                  />
                  <div>
                    <h6 className="fw-bold text-primary mb-1">{comment.email}</h6>
                    <p className="text-muted small mb-0"> {comment.postDate ? comment.postDate.toDate().toLocaleString() : 'No date available'}</p>
                  </div>
                </div>

                <p className="mt-3 mb-4 pb-2" style={{ color: 'white' }}>
                  {comment.text}
                </p>
                {user && comment && user.uid === comment.userId && (
                 <>
    <a
      href="#!"
      className="d-flex align-items-center me-3"
      onClick={() => deleteComment(comment.id, user.uid)}
    >
      <MDBIcon far icon="trash-alt me-2" />
      <p className="mb-0">Delete</p>
    </a>
    <a
      href="#!"
      className="d-flex align-items-center me-3"
      onClick={() => {
        const newText = prompt('Enter new comment text:', comment.text);
        if (newText !== null && newText !== undefined) {
          updateComment(comment.id, newText);
        }
      }}
    >
      <MDBIcon far icon="edit me-2" />
      <p className="mb-0">Edit</p>
    </a>
  </>
)}

               

                <div className="small d-flex justify-content-start">
                  <a href="#!" className="d-flex align-items-center me-3">
                    <MDBIcon far icon="thumbs-up me-2" />
                    <p className="mb-0">Like</p>
                  </a>
                  <a href="#!" className="d-flex align-items-center me-3">
                    <MDBIcon far icon="comment-dots me-2" />
                    <p className="mb-0">Comment</p>
                  </a>
                  <a href="#!" className="d-flex align-items-center me-3">
                    <MDBIcon fas icon="share me-2" />
                    <p className="mb-0">Share</p>
                  </a>
                </div>
              </MDBCardBody>
            </MDBCard>
          ))}

          <MDBCard style={{ backgroundColor: '#111827' }}>
            
          </MDBCard>
        </Col>
      </Row>
    </MDBContainer>
  </section>
</Container></form>
  
      </div>
    );
  }

  