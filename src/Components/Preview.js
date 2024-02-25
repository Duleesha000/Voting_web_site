
import Switch from '@mui/material/Switch';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { auth, firestore } from '../firebase';

import './Styles.css';



const Preview = () => {
  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [checked, setChecked] = React.useState(true);
  const [poolDetails, setPoolDetails] = useState([]);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const user = auth.currentUser;
  
  
  useEffect(() => {
    const fetchActiveUserPools = async () => {
      try {
        const poolsCollection = collection(firestore, 'Pools');
        const q = query(
          poolsCollection,
          where('Adminid', '==', user.uid),
          where('poolActive', '==', 'Active')
        );
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const activeUserPoolsData = [];
          querySnapshot.forEach((doc) => {
            activeUserPoolsData.push({ id: doc.id, ...doc.data() });
          });
          setPoolDetails(activeUserPoolsData);
  
          // Assuming there is a field in the pool document that represents the pool ID
          const activePoolIds = activeUserPoolsData.map((pool) => pool.id); // Replace 'id' with the actual field name
  
          // Fetch competitor details where poolId is in the competitors collection
          const competitorsCollection = collection(firestore, 'competitors');
          const competitorQuery = query(
            competitorsCollection,
            where('poolid', 'array-contains-any', activePoolIds) // Replace 'poolid' with the actual field name
          );
          const competitorQuerySnapshot = await getDocs(competitorQuery);
  
          if (!competitorQuerySnapshot.empty) {
            const competitorData = [];
            competitorQuerySnapshot.forEach((competitorDoc) => {
              competitorData.push({ id: competitorDoc.id, ...competitorDoc.data() });
            });
            setCompetitorDetails(competitorData);
          }
        }
      } catch (error) {
        console.error('Error fetching active user pools:', error.message);
      }
    };
  
    fetchActiveUserPools();
  }, [user.uid]);
  

  return (
    <div className="Align">
     {poolDetails.length > 0 && (
        <div>
          <h1>{poolDetails[0].title}</h1>
          <br />
          <h4>
          Voting Start {new Date(poolDetails[0].stdate.toMillis()).toLocaleString()} - Voting End {new Date(poolDetails[0].enddate.toMillis()).toLocaleString()}
          </h4>
          <br />
        </div>
      )}
    <Container>
      <Row>
        <Col xs={6} md={4}>
          <Image src="https://i.ibb.co/VWLWZFb/815933137.jpg" rounded  style={{height:'100px'}}/>
        </Col>
      
        <Col xs={6} md={4}>
         
        </Col>

        <Col xs={6} md={4}>
          <Image src="https://i.ibb.co/VWLWZFb/815933137.jpg" rounded  style={{height:'100px'}}/>
        </Col>
      </Row>
    </Container><br></br>
    {competitorDetails.length > 0 && (
        <Container>
          <div>
            
            <Row>
              {competitorDetails.map((competitor, index) => (
                <Col key={index} sm={'auto'} className="mb-4">
                  <Card style={{ width: '18rem' }}>
                 
                    <Card.Img variant="top" src={competitor.Image} style={{width:'300px' ,height:'500px'}} />
                    <Card.Body>
                      <Card.Title>Name- {competitor.Name}</Card.Title>
                      <Card.Text>Colombo distric</Card.Text>
                      <Card.Text>Age:21</Card.Text>
                      <Switch
                       checked={checked}
                       onChange={handleChange}
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
                style={{
                  marginLeft: '10px',
                  background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2"
              >
                Add Vote 
              </Button>
    </div>
  );
};

export default Preview;
