import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { Box } from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { MDBBadge, MDBDropdown, MDBDropdownItem, MDBDropdownMenu } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Form, Table } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { auth, firestore } from '../firebase';
import Sidenav from './AdminPannel';
import './Styles.css';
export default function Adminhome() {

  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [poolDetails, setPoolDetails] = useState([]);
  const [adminDetails, setAdminDetails] = useState({});
  const [voteCountForSelectedPool, setVoteCountForSelectedPool] = useState(0);
  const [usercount, setusercount] = useState(0);
  const [activePoolId, setActivePoolId] = useState(null); // Initialize as needed
  const [competitorCount, setCompetitorCount] = useState(0);
  const [top4Competitors, setTop4Competitors] = useState([]);
  const [poolIds, setPoolIds] = useState([]);
  const [selectedPoolId, setSelectedPoolId] = useState('');
  const[selectedcomId,setSelectedcomlId]=useState('');
  const[selectedcomId1,setSelectedcomlId1]=useState('');
  const[count,setcount]=useState(0);
  const[count1,setcount1]=useState(0);
  const [selectedPoolIdReports1, setSelectedPoolIdReports1] = useState('');
  const [competitorDetails1, setCompetitorDetails1] = useState([]);
  
  const [state1, setstate1] = useState({
    barOptions: {
      chart: {
        id: "basic-bar"
      },
    },
    barSeries: [],
    pieOptions: {
      labels: ['Voted', 'Non Voted'],
      
    },
    
    pieSeries: [0, 0],
  });

  useEffect(() => {
    // Assume you have the logic to fetch and update voteCountForSelectedPool, usercount, and competitorCount
    // ...

    // Update the pieSeries in state
    setstate1(prevState => ({
      ...prevState,
      pieSeries: [
        voteCountForSelectedPool, // Updated vote count for selected pool
        usercount, // Updated user count
      ],
     
    }));
  }, [voteCountForSelectedPool, usercount]);


  const [state, setState] = useState({
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
       labels: {
        style: {
          fontSize: '16px', // Adjust the font size as needed
        },
      }, // Update with the competitor names
      },
      yaxis: {
        labels: {
         style: {
           fontSize: '16px', // Adjust the font size as needed
         },
       }, // Update with the competitor names
       },
    },
    series: [
      {
        name: 'series-1',
        data: [], // Update with the vote counts
      },
    ],
  });



const user = auth.currentUser;

useEffect(() => {
  
  const fetchAdminDetails = async () => {
    try {
      console.log(user);

      if (user) {
        const usersCollection = collection(firestore, 'Admins');
        const userDocRef = doc(usersCollection, user.uid);
        const userDoc = await getDoc(userDocRef);
        setAdminDetails(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching admin details:', error.message);
    }
  };

  fetchAdminDetails();
}, []);


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
        // setPoolDetails(activeUserPoolsData);

        // Assuming there is a field in the pool document that represents the pool ID
        const activePoolId = activeUserPoolsData[0]?.id; // Assuming you want the first pool, adjust accordingly

        // Fetch competitor details where poolId is in the competitors collection
        const competitorsCollection = collection(firestore, 'competitors');
        const competitorQuery = query(
          competitorsCollection,
          where('poolid', 'array-contains-any', [activePoolId]) // Replace 'poolid' with the actual field name
        );
        const competitorQuerySnapshot = await getDocs(competitorQuery);

        if (!competitorQuerySnapshot.empty) {
          const competitorData = [];
          competitorQuerySnapshot.forEach((competitorDoc) => {
            competitorData.push({ id: competitorDoc.id, ...competitorDoc.data() });
          });

          setCompetitorDetails(competitorData);

          // Extract vote count for the selected pool ID
          const voteCountForSelectedPool = competitorData.reduce((sum, competitor) => {
            const votedPool = competitor.votedPool || {};
            return sum + (votedPool[activePoolId] || 0);
          }, 0);

          setCompetitorDetails(competitorData);
          setVoteCountForSelectedPool(voteCountForSelectedPool);

          console.log('Vote count for selected pool ID:', voteCountForSelectedPool);

          setActivePoolId(activePoolId);
          setCompetitorCount(competitorData.length);
          
        }
      }
    } catch (error) {
      console.error('Error fetching active user pools:', error.message);
    }
  };

  fetchActiveUserPools();
}, [user.uid]);



const getTotalUsersCount = async () => {
  try {
    const usersCollection = collection(firestore, 'Nusers'); // Replace 'Nusers' with the actual collection name
    const usersQuery = query(usersCollection);
    const usersQuerySnapshot = await getDocs(usersQuery);

    const totalUsersCount = usersQuerySnapshot.size;
    console.log('Total Nusers count:', totalUsersCount);
    setusercount(totalUsersCount);

    // Do something with the totalUsersCount, like setting it in state if needed
    // setTotalUsersCount(totalUsersCount);
  } catch (error) {
    console.error('Error fetching total Nusers count:', error.message);
  }
};

useEffect(() => {

  getTotalUsersCount();
}, [user.uid]);





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
        const activePoolId = activeUserPoolsData[0]?.id; // Assuming you want the first pool, adjust accordingly

        // Fetch competitor details where poolId is in the competitors collection
        const competitorsCollection = collection(firestore, 'competitors');
        const competitorQuery = query(
          competitorsCollection,
          where('poolid', 'array-contains-any', [activePoolId]) // Replace 'poolid' with the actual field name
        );
        const competitorQuerySnapshot = await getDocs(competitorQuery);

        if (!competitorQuerySnapshot.empty) {
          const competitorData = [];

          competitorQuerySnapshot.forEach((competitorDoc) => {
            competitorData.push({ id: competitorDoc.id, ...competitorDoc.data() });
          });

          // Sort competitors by vote count in descending order
          const sortedCompetitors = competitorData.sort((a, b) => {
            const votedPoolA = a.votedPool || {};
            const voteCountA = votedPoolA[activePoolId] || 0;

            const votedPoolB = b.votedPool || {};
            const voteCountB = votedPoolB[activePoolId] || 0;

            return voteCountB - voteCountA;
          });

            const top4CompetitorsWithNames = sortedCompetitors.slice(0, 4).map((competitor) => {
            const votedPool = competitor.votedPool || {};
            const voteCount = votedPool[activePoolId] || 0;
            return { name: competitor.Name, voteCount };
             
          });

          console.log('Top 4 Vote Counts:', top4CompetitorsWithNames);
          setTop4Competitors(top4CompetitorsWithNames);

          setState({
            options: {
              ...state.options,
              xaxis: {
                categories: top4CompetitorsWithNames.map((competitor) => competitor.name),
              },
            },
            series: [
              {
                name: 'series-1',
                data: top4CompetitorsWithNames.map((competitor) => competitor.voteCount),
              },
            ],
          });
          
        }
      }
    } catch (error) {
      console.error('Error fetching active user pools:', error.message);
    }
  };

  fetchActiveUserPools();
}, [user.uid]);


useEffect(() => {
  const fetchPoolIds = async () => {
    try {
      const poolsCollection = collection(firestore, 'Pools');
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



useEffect(() => {
  const fetchCompetitorDetails = async () => {
    try {
      if (user && selectedPoolId) {
        const competitorsCollection = collection(firestore, 'competitors');
        const q = query(competitorsCollection, where('poolid', 'array-contains-any', [selectedPoolId]));
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
}, [selectedPoolId]);


useEffect(() => {
  const fetchCompetitorvote = async () => {
    try {
      if (user && selectedPoolId && selectedcomId) {
        const competitorsCollection = collection(firestore, 'competitors');
        const q = query(competitorsCollection, where('poolid', 'array-contains-any', [selectedPoolId]));
        const querySnapshot = await getDocs(q);

        const fetchedCompetitorData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Find the competitor with the given competitorId
        const selectedCompetitor = fetchedCompetitorData.find(competitor => competitor.id === selectedcomId);
        const selectedCompetitor1 = fetchedCompetitorData.find(competitor => competitor.id === selectedcomId1);

        if (selectedCompetitor) {
          // Access the votedPool data for the selected pool
          const voteCount = selectedCompetitor.votedPool[selectedPoolId];
          // You can now use the voteCount for further processing
          console.log('Vote count for selected pool:', voteCount);
          setcount(voteCount);

        } 
        else {
          console.warn('Competitor not found with the specified competitorId:', selectedcomId);
        }


        if (selectedCompetitor1) {
          // Access the votedPool data for the selected pool
          const voteCount1 = selectedCompetitor1.votedPool[selectedPoolId];
          // You can now use the voteCount for further processing
          console.log('Vote count for selected pool:', voteCount1);
          setcount1(voteCount1);
        } 
        else {
          console.warn('Competitor not found with the specified competitorId:', selectedcomId1);
        }
      }
    } catch (error) {
      console.error('Error fetching competitor details:', error.message);
    }
  };

  fetchCompetitorvote();
}, [selectedPoolId,selectedcomId,selectedcomId1]);




const handleChange1 = (event) => {
  setSelectedPoolIdReports1(event.target.value);
};




useEffect(() => {
  const fetchCompetitorDetails1 = async () => {
    try {
      if (user && selectedPoolIdReports1) {
        const competitorsCollection = collection(firestore, 'competitors');
        const querySnapshot = await getDocs(
          query(competitorsCollection, where('poolid', 'array-contains-any', [selectedPoolIdReports1]))
        );
  
        if (!querySnapshot.empty) {
          const competitorData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCompetitorDetails1(competitorData);
        } else {
          setCompetitorDetails1([]);
        }
      }
    } catch (error) {
      console.error('Error fetching competitor details:', error.message);
    }
  };

  fetchCompetitorDetails1();
}, [selectedPoolIdReports1]);




    return (
     
<div className="Align" style={{backgroundColor:'#f3f6fd'}}>

<Container>
 
      <Row>
        <Col><div className="Frame2" style={{width: 250, height: 80, position: 'relative', background: 'linear-gradient(270deg, #EC5844 0%, #F203F7 100%)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}><center><h5 style={{paddingTop:'10px',color:'whitesmoke'}}><b>Vote given user count</b></h5></center><br>
        </br><h5 style={{marginLeft:'90px',marginTop:"-24px",color:'black'}}> <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
          {voteCountForSelectedPool}
            </MDBBadge></h5></div></Col>
        <Col><div className="Frame2" style={{width: 250, height: 80, position: 'relative', background: 'linear-gradient(270deg, #EC5844 0%, #F203F7 100%)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}><center><h5 style={{paddingTop:'10px',color:'whitesmoke'}}><b>Active Pool ID</b></h5></center><br>
        </br><h5 style={{marginLeft:'25px',marginTop:"-24px",color:'black'}}> <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
       {activePoolId}
            </MDBBadge></h5></div></Col>
        <Col><div className="Frame2" style={{width: 250, height: 80, position: 'relative', background: 'linear-gradient(270deg, #EC5844 0%, #F203F7 100%)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}><center><h5 style={{paddingTop:'10px',color:'whitesmoke'}}><b>Active Competitor Count</b></h5></center><br>
        </br><h5 style={{marginLeft:'100px',marginTop:"-24px",color:'black'}}><MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
           {competitorCount}
            </MDBBadge></h5></div></Col>
      
   
   
              <Col style={{marginTop:'90px'}}>
              <h5>Best Competitors Vote Count </h5>
              <div  style={{width: 550, height: 340, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}>
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              width="500"
            />
            </div>
        </Col>
        <Col style={{marginTop:'90px',marginLeft:'10px'}}>
        <h5>Voted and non voted Precentage</h5>
        <div  style={{width: 420, height: 340, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}>
          <Chart
            options={state1.pieOptions}
            series={state1.pieSeries}
            type="pie"
            width="380"
            
          />
          </div>
        </Col>

        <Col style={{marginTop:'20px'}}>
        <div  style={{width: 560, height: 330, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}>
        <h5 style={{marginLeft:'10px',marginTop:'10px'}}>Analysis</h5>
        <div class="d-flex">
        <div class="p-2 flex-fill">
          <MDBDropdown dropright
          name="type">
        <Form.Select onChange={(e) => setSelectedPoolId(e.target.value)} aria-label="Default select example">
          <option>Select Pool ID</option>
          {poolIds.map((pool) => (
        <option key={pool.id} value={pool.id}>
         {`${pool.id} - ${pool.title}`}
        </option>
  ))}
     </Form.Select>
        <MDBDropdownMenu dark>
          <MDBDropdownItem link value="voteOne">111</MDBDropdownItem>
          <MDBDropdownItem link value="voteMany">345</MDBDropdownItem>
          
        </MDBDropdownMenu>
      </MDBDropdown> 
      </div>
      </div>
        <div class="d-flex">
        <div class="p-2 flex-fill">
          <MDBDropdown dropright
          name="type">
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
        <MDBDropdownMenu dark>
          <MDBDropdownItem link value="voteOne">111</MDBDropdownItem>
          <MDBDropdownItem link value="voteMany">345</MDBDropdownItem>
          
        </MDBDropdownMenu>
      </MDBDropdown> 
      </div>

        <div class="p-2 flex-fill"><h4>VS</h4></div>
        <div class="p-2 flex-fill">
        <MDBDropdown dropright
          name="type">
        <Form.Select
            onChange={(e) => setSelectedcomlId1(e.target.value)}
            aria-label="Default select example">
            <option>Select Competitor</option>
            {competitorDetails.map((competitor) => (
              <option key={competitor.id} value={competitor.id}>
                {`${competitor.id} - ${competitor.Name}`}
              </option>
            ))}
          </Form.Select>
        <MDBDropdownMenu dark>
        <MDBDropdownItem link value="voteOne">111</MDBDropdownItem>
          <MDBDropdownItem link value="voteMany">345</MDBDropdownItem>
          
        </MDBDropdownMenu>
        </MDBDropdown>
        </div>
        
        </div>
        <div class="d-flex">
        <div class="p-2 flex-fill">

        <img
        src="https://i.ibb.co/9p2QLq3/download-4.jpg"
        class="img-fluid rounded"
        alt="Townhouses and Skyscrapers"
         width={'100px'}
         height={"50px"}
         />


        </div>

        <div class="p-2 flex-fill"  style={{marginLeft:"110px"}}>

        <img
        src="https://i.ibb.co/9p2QLq3/download-4.jpg"
        class="img-fluid rounded"
        alt="Townhouses and Skyscrapers"
        width={'100px'}
        height={"50px"}
       />


        </div>
        
        
        </div>
        <div class="d-flex">
        <div class="p-2 flex-fill" >
         <h6>Vote Count:{count}</h6> 
          
          </div>
          
          <div class="p-2 flex-fill" style={{marginLeft:"110px"}}>
          <h6>Vote Count:{count1}</h6> 
          
          </div>
          </div>
       </div>
        </Col>
        
        <Col style={{marginTop:'20px'}}>
        <div  style={{width: 420, height: 310, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar />
       </LocalizationProvider>
       </div>
        </Col>
        </Row>
        </Container>
          <br></br><br></br>
        <div  style={{width: 980, height: 440, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}>
        <Container fluid="md" ><br></br>
          <h3>Pool Results</h3><br></br>
        <Box sx={{ minWidth: 120 }}>
            <h6>Select Pool ID</h6>
            <Form.Select aria-label="Default select example"onChange={handleChange1} value={selectedPoolIdReports1} >
              <option>Select Pool ID</option>
              {poolIds.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {`${pool.id} - ${pool.title}`}
                </option>
              ))}
            </Form.Select>
          </Box>

  <br />
  <Row>
  <Col sm={12}>
      <Table striped bordered hover style={{ border: '4px', borderColor: 'black', color: 'black' }}>
        <thead>
          <tr>
            <th style={{ color: 'black' }}>Competitor Name</th>
            <th style={{ color: 'black' }}>Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {competitorDetails1.map((competitor) => (
            <tr key={competitor.id}>
              <td style={{ color: 'black' }}>{competitor.Name}</td>
              <td style={{ color: 'black' }}>{competitor.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  </Row>
  <br></br>
</Container></div>
      <Sidenav adminDetails={adminDetails} /> 

      
    
</div>
    
    );
  }