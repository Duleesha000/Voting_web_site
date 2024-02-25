import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  MDBBtn,
  MDBCol,
  MDBInput,
  MDBRow
} from 'mdb-react-ui-kit';
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import { Link, useLocation } from 'react-router-dom';
import { auth, firestore } from '../firebase';

export default function Result() {
  
  const [poolId, setPoolId] = useState(null);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [PoolDetails, setPoolDetails] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('poolId');
    console.log(id)
    setPoolId(id);
  }, [location.search]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Trigger the data fetching only if user and poolId are available
      if (user && poolId) {
        fetchCompetitorDetails(user);
      }
    });

    return () => unsubscribe();
  }, [user, poolId]);



  const fetchCompetitorDetails = async (user) => {

    try {
      const competitorsCollection = collection(firestore, 'competitors');
      const q = query(competitorsCollection, where('poolid', 'array-contains', poolId));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
          const competitorData = [];
          for (const doc of querySnapshot.docs) {
          const competitorId = doc.id;
          const competitorVotes = doc.data().voteCount || 0; // Assuming voteCount is the field containing vote counts
          const votedPoolData = doc.data().votedPool || {}; // Assuming votedPool is the field containing the map

          
          console.log(`Competitor ID: ${competitorId}, Vote Count: ${competitorVotes}, Voted Pool:`, votedPoolData);

          competitorData.push({
            id: competitorId,
            votes: competitorVotes,
            votedPool: votedPoolData,
            ...doc.data()
          });
          }

        setCompetitorDetails(competitorData);
        console.log(competitorData);
        }


    } catch (error) {
      console.error('Error fetching competitor details:', error.message);
    }

    try {
      const poolsCollection = collection(firestore, 'Pools');
      const activePoolsQuery = query(poolsCollection,  where('poolId', '==', poolId));
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

  useEffect(() => {
    // Fetch competitor details when the component mounts
    const fetchData = async () => {
      // Assuming you have the fetchCompetitorDetails function defined in your component
      await fetchCompetitorDetails();
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const [inputValue, setInputValue] = useState('');

  // Use useEffect to set the initial value of inputValue when the component mounts
  useEffect(() => {
    const urlWithPoolId = `http://localhost:3000/?poolId=${poolId}`;
    setInputValue(urlWithPoolId);
  }, [poolId]); // Run this effect when poolId changes

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

  return (
    <div style={{ backgroundColor: '#111827', paddingTop: '120px' }}>
      <Button
        variant="primary"
        size="lg"
        type="submit"
        style={{
          marginLeft: '110px',
          background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
        }}
        className="custom-button2">
        Back to Main Page
      </Button>

      <div style={{ marginTop: '40px' }}>
      <Container fluid="md" style={{ backgroundColor: '#1F2937' }}>
  <Row>
    <Col>
    {PoolDetails.map((Pools) => ( <h3 style={{ color: 'white' }}>{Pools.Competition_name}</h3> ))}
    </Col>
  </Row>

  <Row>
    <Col sm={8}>
    {PoolDetails.map((Pools) => (<h6 style={{ color: '#85A3B8', marginTop: '10px' }}>{Pools.title}</h6> ))}
    </Col>
  </Row>
  <br />

  <Row>
  <Col sm={12}>
      <Table striped bordered hover style={{ border: '4px', borderColor: 'white', color: 'white' }}>
        <thead>
          <tr>
            <th style={{ color: 'white' }}>Competitor Name</th>
            <th style={{ color: 'white' }}>Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {competitorDetails.map((competitor) => (
            <tr key={competitor.id}>
              <td style={{ color: 'white' }}>{competitor.Name}</td>
              <td style={{ color: 'white' }}>{competitor.votes}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  </Row>
  <br />

  <Row>
    <Col sm={6}>
      <Link to={{
       pathname: "/Realpools",
       search: `?poolId=${poolId}`}}>
      <Button
        variant="primary"
        size="lg"
        type="submit"
        style={{
          marginLeft: '0', // Adjust the margin-left as needed
          background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
        }}
        className="custom-button2">
        Back to Pool
      </Button></Link>
    </Col>

    <Col sm={6} style={{paddingLeft:'240px'}}>
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
    </Col>
  </Row><br></br>
</Container>


      </div>
    </div>
  );
}