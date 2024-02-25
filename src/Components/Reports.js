import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'; // Import necessary Firebase Firestore functions
import { MDBBadge, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Form from 'react-bootstrap/Form';
import { auth, firestore } from '../firebase';



import { Button } from 'react-bootstrap';
import './Styles.css';

const filter = createFilterOptions();

const CandidateTableColumns = [
  { id: 'Name', label: 'Name', minWidth: 170 },
 
  { id: 'Province', label: 'Province', minWidth: 170 },
  {
    id: 'stdate',
    label: 'Pool Start Date',
    minWidth: 170,
    format: (value) => (value ? new Date(value).toLocaleString() : 'N/A'),
  },
  {
    id: 'enddate',
    label: 'Pool End Date',
    minWidth: 170,
    format: (value) => (value ? new Date(value).toLocaleString() : 'N/A'),
  },{ id: 'title', label: 'Pool Title', minWidth: 170 },
  
 
  {
    id: 'voteCount',
    label: 'Vote count',
    minWidth: 170,
    format: (value) => (
      <MDBBadge color="success" pill style={{ height: '24px', fontSize: '15px', borderRadius: '12px' }}>
        {value}
      </MDBBadge>
    ),
  },

   
];




const staticCompetitorDetails1 = [
  { id: 'Egrr44455', name: 'John Doe', age: 22, province: 'Colombo', voteCount: 23333, image: 'https://mdbootstrap.com/img/new/avatars/8.jpg' },
  { id: 'Ecrr44455', name: 'Alex Ray', age: 22, province: 'Southern', voteCount: 23333, image: 'https://mdbootstrap.com/img/new/avatars/6.jpg' },
  { id: 'Rtcrr44455', name: 'Kate Hunington', age: 22, province: 'Western', voteCount: 23333, image: 'https://firebasestorage.googleapis.com/v0/b/voting-app-9cc9e.appspot.com/o/user-images%2F2le4bgcgstYbPmWoQuP77u74Q5t2?alt=media&token=e20ba535-df07-4c8c-b0d2-6d43a245b671' },
];

function Reports() {
  const [selectedPoolIdReports, setSelectedPoolIdReports] = useState('');
  const [selectedPoolIdReports1, setSelectedPoolIdReports1] = useState('');
  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [competitorDetails1, setCompetitorDetails1] = useState([]);
  const [poolIds, setPoolIds] = useState([]);
  const [allCompetitorIds, setAllCompetitorIds] = useState([]);
  const user = auth.currentUser;
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = React.useState(null);
  const [open, toggleOpen] = React.useState(false);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState(null);
  const [candidateRows, setCandidateRows] = useState([]);
  const [staticCompetitorDetails1, setStaticCompetitorDetails1] = useState([]); // Competitors data

  const onChange = (event, { newValue }) => {
    setSearchQuery(newValue);
  };
  
 

  const handleClose = () => {
    setDialogValue({
      title: '',
      year: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    title: '',
    year: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue({
      title: dialogValue.title,
      year: parseInt(dialogValue.year, 10),
    });
    handleClose();
  };



  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const competitorsCollection = collection(firestore, 'competitors');
        const querySnapshot = await getDocs(query(competitorsCollection, where('Adminid', '==', user.uid)));
    
        if (!querySnapshot.empty) {
          const competitorData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().Name,
          }));
    
          setSuggestions(competitorData);
          console.log(competitorData.id); // You might want to loop through the array
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error.message);
      }
    };

    fetchSuggestions();
  }, [user]);



  const fetchData = async (competitorId) => {
    try {
      const competitorDoc = await getDoc(doc(firestore, 'competitors', competitorId));
  
      if (competitorDoc.exists()) {
        const competitorData = { id: competitorDoc.id, ...competitorDoc.data() };
        console.log('Competitor Data:', competitorData);
  
        // Fetch details for each poolId in competitorData.poolid
        const poolDetailsPromises = competitorData.poolid.map(async (poolId) => {
          const poolDoc = await getDoc(doc(firestore, 'Pools', poolId));
          return poolDoc.exists ? poolDoc.data() : null;
        });
  
        // Resolve all promises to get an array of pool details
        const poolDetails = await Promise.all(poolDetailsPromises);
  
        // Remove null values from poolDetails
        const validPoolDetails = poolDetails.filter((poolDetail) => poolDetail !== null);
  
        setCandidateRows((prevRows) => {
          const updatedRows = [...prevRows];
          const index = updatedRows.findIndex((row) => row.id === competitorData.id);
  
          if (index !== -1) {
            updatedRows[index] = { ...competitorData, poolDetails: validPoolDetails };
          } else {
            updatedRows.push({ ...competitorData, poolDetails: validPoolDetails });
          }
  
          return updatedRows;
        });
      } else {
        console.error('Competitor not found');
      }
    } catch (error) {
      console.error('Error fetching competitor details:', error.message);
    }
  };
  
  
  
  useEffect(() => {
    const fetchCompetitorDetails = async () => {
      try {
        if (user && selectedPoolIdReports1) {
          const competitorsCollection = collection(firestore, 'competitors');
          const poolIdQuery = query(competitorsCollection, where('poolid', 'array-contains', selectedPoolIdReports1));
          const querySnapshot = await getDocs(poolIdQuery);
  
          if (!querySnapshot.empty) {
            const competitorData = querySnapshot.docs.map((doc) => {
              const { Name, Age, Province, votedPool } = doc.data();
  
              // Extract vote count for the selected pool ID
              const voteCountForSelectedPool = votedPool[selectedPoolIdReports1] || 0;
  
              return {
                id: doc.id,
                Name,
                Age,
                Province,
                voteCount: voteCountForSelectedPool,
              };
            });
  
            setStaticCompetitorDetails1(competitorData);
          } else {
            setStaticCompetitorDetails1([]);
          }
        }
      } catch (error) {
        console.error('Error fetching competitor details:', error.message);
      }
    };
  
    fetchCompetitorDetails();
  }, [selectedPoolIdReports1]);
  
  
  
  useEffect(() => {
    const fetchPoolIds = async () => {
      try {
        const poolsCollection = collection(firestore, 'Pools');
        const querySnapshot = await getDocs(query(poolsCollection, where('Adminid', '==', user.uid)));

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
    const fetchAllCompetitorIds = async () => {
      try {
        if (user) {
          const competitorsCollection = collection(firestore, 'competitors');
          const competitorQuerySnapshot = await getDocs(
            query(competitorsCollection, where('Adminid', '==', user.uid))
          );
    
          if (!competitorQuerySnapshot.empty) {
            const competitorData = competitorQuerySnapshot.docs.map((doc) => ({
              id: doc.id,
              Name: doc.data().Name,
            }));
            setAllCompetitorIds(competitorData);
          } else {
            setAllCompetitorIds([]);
          }
        }
      } catch (error) {
        console.error('Error fetching competitor IDs:', error.message);
      }
    };
  
    fetchAllCompetitorIds();
  }, [user]);
  

  // Fetch competitor details based on the selected pool ID
  useEffect(() => {
    const fetchCompetitorDetails = async () => {
      try {
        if (user && selectedPoolIdReports) {
          const competitorsCollection = collection(firestore, 'competitors');
          const querySnapshot = await getDocs(
            query(competitorsCollection, where('poolid', 'array-contains-any', [selectedPoolIdReports]))
          );
    
          if (!querySnapshot.empty) {
            const competitorData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCompetitorDetails(competitorData);
          } else {
            setCompetitorDetails([]);
          }
        }
      } catch (error) {
        console.error('Error fetching competitor details:', error.message);
      }
    };
    
    fetchCompetitorDetails();
  }, [selectedPoolIdReports]);



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


  const handleChange = (event) => {
    setSelectedPoolIdReports(event.target.value);
  };


  const handleChange1 = (event) => {
    setSelectedPoolIdReports1(event.target.value);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


const [page1, setPage1] = React.useState(0);
const [rowsPerPage1, setRowsPerPage1] = React.useState(10);

const handleChangePage1 = (event, newPage) => {
  setPage1(newPage);
};

const handleChangeRowsPerPage1 = (event) => {
  setRowsPerPage1(+event.target.value);
  setPage1(0);
};

const handleDownload = () => {
  // Convert table content into downloadable format (e.g., CSV or Excel)
  // For simplicity, let's assume downloading CSV format
  const csvContent = "data:text/csv;charset=utf-8," 
    + CandidateTableColumns.map(column => column.label).join(',') + '\n' 
    + candidateRows.map(row => 
      CandidateTableColumns.map(column => {
        if (column.id === 'title') {
          return row.poolDetails && row.poolDetails.length > 0 ? row.poolDetails.map(poolDetail => poolDetail.title).join(', ') : 'N/A';
        } else if (column.id === 'stdate' || column.id === 'enddate') {
          return row.poolDetails && row.poolDetails.length > 0 ? row.poolDetails.map(poolDetail => column.format(poolDetail[column.id].toDate())).join(', ') : 'N/A';
        } else if (column.id === 'voteCount') {
          return row.votedPool ? Object.values(row.votedPool).join(', ') : 'N/A';
        } else {
          return row[column.id];
        }
      }).join(',')
    ).join('\n');

  // Create a link element to trigger the download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Candidate Result Report.csv");
  document.body.appendChild(link);
  link.click();
};




const handleDownload1 = () => {
  // Prepare table data in CSV format
  const csvContent = [
    'Name, Age, Province, Vote count',
    ...staticCompetitorDetails1.map(row => `${row.Name}, ${row.Age}, ${row.Province}, ${row.voteCount}`)
  ].join('\n');

  // Create a Blob object containing the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a link element to trigger the download
  const link = document.createElement("a");
  if (link.download !== undefined) { // Feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Election Result Report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('Your browser does not support automatic download. Please right-click the link and select "Save link as..."');
  }
};

  return (
    <div style={{ marginTop: '80px', alignContent: 'center', marginLeft: '300px' }}>
    
    <MDBContainer fluid className="p-3 my-5">
      <h1>Candidate Result Report</h1>
      <br></br>
      <MDBRow>
      <MDBCol style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginRight: '20px' }} >
         
          <Box sx={{ minWidth: 300 }}>
          <h6>Select Competitor ID</h6>
            <Form.Select aria-label="Default select example" onChange={handleChange} value={selectedPoolIdReports}>
              <option>Select Competitor ID</option>
              {allCompetitorIds.map((competitor) => (
                <option key={competitor.id} value={competitor.id}>
                  {`${competitor.id} - ${competitor.Name}`}
                </option>
              ))}
            </Form.Select>
          
          </Box>
         
      <Box sx={{ minWidth: 700, paddingTop: '24px', marginLeft: '20px' }}>
     <React.Fragment>
     <Autocomplete
     value={value}
    onChange={(event, newValue) => {
    if (typeof newValue === 'string') {
      setSelectedCompetitorId(null);
      setValue({
        inputValue: newValue,
        name: newValue,
        id: '',
      });
    } else if (newValue && newValue.inputValue) {
      setSelectedCompetitorId(newValue.id);
      setValue(newValue);
      fetchData(newValue.id);
    } else {
      setSelectedCompetitorId(null);
      setValue(newValue);
    }
  }}
  filterOptions={(options, params) => {
    const filtered = filter(options, params);

    if (params.inputValue !== '') {
      const matchingSuggestions = suggestions.filter((suggestion) =>
        suggestion.name.toLowerCase().includes(params.inputValue.toLowerCase())
      );

      matchingSuggestions.forEach((suggestion) => {
        filtered.push({
          inputValue: suggestion.name,
          name: suggestion.name,
          id: suggestion.id,
        });
      });
    }

    return filtered;
  }}
  id="free-solo-dialog-demo"
  options={competitorDetails.map((option) => ({
    id: option.id,
    name: option.name,
    inputValue: option.name,
  }))}
  getOptionLabel={(option) => option.inputValue || option.name || ''}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  sx={{ width: 300 }}
  freeSolo
  renderInput={(params) => (
    <TextField
      {...params}
      label="Search Competitors"
      value={(value && value.inputValue) || ''}
    />
  )}
  renderOption={(props, option, { inputValue }) => (
    <li {...props}>
      <div>
        <strong>{option.name}</strong> - ID: {option.id}
      </div>
    </li>
  )}
/>


  </React.Fragment>
   </Box>

   <Button
  variant="info"
  size="lg"
  
  style={{
    background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',height:'50px',width:'230px',paddingTop:'5px'
  }}
  onClick={handleDownload}
  className="custom-button2"
>
  Download Report
</Button>
        </MDBCol>
       
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Paper sx={{ width: '100%', overflow: 'hidden',borderColor:'black'}} style={{borderColor:'black'}}>
        <TableContainer
        sx={{ minWidth: 650, height: '280px', overflowY: 'auto' }}
        striped
        bordered
        hover
       style={{ border: '10px' }}>
    <Table stickyHeader aria-label="sticky table">
    <TableHead>
      <TableRow>
        {CandidateTableColumns.map((column) => (
          <TableCell key={column.id} align="center" style={{ minWidth: column.minWidth }}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
  {candidateRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
      {CandidateTableColumns.map((column) => (
        <TableCell key={column.id} align="center">
          {column.id === 'title' ? (
        <div>
        {row.poolDetails && row.poolDetails.length > 0
          ? row.poolDetails.map((poolDetail, detailIndex) => (
              <React.Fragment key={detailIndex}>
                <span style={{ paddingTop: '25px' }}>
                  {poolDetail.title}
                </span>
                {detailIndex < row.poolDetails.length - 1 && <br></br>}
              </React.Fragment>
            ))
          : 'N/A'}
      </div>
      

          ) : column.id === 'stdate' || column.id === 'enddate' ? (
            // Customize the rendering for "Start Date" and "End Date"
            <span style={{ color: 'black' ,marginTop:'10px'}}>
              {column.format && row.poolDetails && row.poolDetails.length > 0
                ? row.poolDetails.map((poolDetail, detailIndex) => (
                    <div key={detailIndex}>
                      {column.id === 'stdate' ? (
                        column.format(poolDetail.stdate.toDate())
                      ) : (
                        column.format(poolDetail.enddate.toDate())
                      )}
                    </div>
                  ))
                : 'N/A'}
            </span>
          ) : column.id === 'voteCount' ? (
            <div>
            {row.votedPool &&
              Object.entries(row.votedPool).map(([poolId, voteCount], index) => (
                <React.Fragment key={poolId}>
                  <MDBBadge
                    color="success"
                    pill
                    style={{ height: '20px', fontSize: '13px', borderRadius: '12px', marginRight: '10px',marginTop:'5px'}}>
                    {voteCount}
                  </MDBBadge>
                  {index < Object.entries(row.votedPool).length - 1 && <br></br>} {/* Add line break if not the last voteCount */}
                </React.Fragment>
              ))}
          </div>
          
          )
          
          : (
            // Render other columns normally
            column.format && typeof row[column.id] === 'number' ? column.format(row[column.id]) : row[column.id]
          )}
        </TableCell>
      ))}
    </TableRow>
  ))}
 </TableBody>

  </Table>
  </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={candidateRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      </MDBRow>
    </MDBContainer>

    <MDBContainer fluid className="p-3 my-5" >
        <br></br>
        <h1 style={{ marginTop: '30px' }}>Election Result Report</h1>
        <br></br>
        <br></br>
        <MDBCol style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginRight: '20px' }}>
          <Box sx={{ minWidth: 120 }}>
            <h6>Select Pool ID</h6>
            <Form.Select aria-label="Default select example" onChange={handleChange1} value={selectedPoolIdReports1}>
              <option>Select Pool ID</option>
              {poolIds.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {`${pool.id} - ${pool.title}`}
                </option>
              ))}
            </Form.Select>
          </Box>

          <Box sx={{ minWidth: 120, marginTop: '23px' }}>
            <Form.Select aria-label="Default select example" onChange={handleChange1} value={selectedPoolIdReports1}>
              <option>Sort By</option>
              <option>Best</option>
              <option>High to Low</option>
              <option>Low to High</option>
            </Form.Select>
          </Box>

          <Button
  variant="info"
  size="lg"
  
  style={{
    background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',height:'50px',width:'150px',paddingTop:'5px',marginLeft:'480px'
  }}
  onClick={handleDownload1}
  className="custom-button2"
>
  Download Report
</Button>
        </MDBCol>
        <br></br>

        <Paper sx={{ width: '100%', overflow: 'hidden',borderColor:'black'}} style={{borderColor:'black'}}>
        <TableContainer
        sx={{ minWidth: 650, height: '280px', overflowY: 'auto' }}
        striped
        bordered
        hover
       style={{ border: '3px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Province</TableCell>
                <TableCell>Vote count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staticCompetitorDetails1
                .slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1)
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className='d-flex align-items-center'>
                        
                        <div className='ms-3'>
                          <p className='fw-bold mb-1'>{row.Name}</p>
                          <p className='text-muted mb-0'>{`Competitor ID-${row.id}`}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className='fw-normal mb-1'>{row.Age}</p>
                    </TableCell>
                    <TableCell>{row.Province}</TableCell>
                    <TableCell>
                      <MDBBadge color='success' pill style={{ height: '24px', fontSize: '15px' }}>
                        {row.voteCount}
                      </MDBBadge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={staticCompetitorDetails1.length}
          rowsPerPage={rowsPerPage1}
          page={page1}
          onPageChange={handleChangePage1}
          onRowsPerPageChange={handleChangeRowsPerPage1}
        /></Paper>
      </MDBContainer>
    </div>
  );
}

export default Reports;