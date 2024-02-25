import { Box } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'; // Import necessary Firebase Firestore functions
import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { Col, Container, Row } from 'react-bootstrap';

import { auth, firestore } from '../firebase';

import './Styles.css';

export default function Comparison() {
  const filter = createFilterOptions();

  const user = auth.currentUser;
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [competitorDetails, setCompetitorDetails] = useState([]);

  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [] // Initially empty until fetched from Firestore
      }
    },
    series: []
  });

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
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error.message);
      }
    };

    fetchSuggestions();
  }, [user]);

  const fetchChart = async (competitor1, competitor2) => {
    try {
        const competitorDocRef1 = doc(firestore, 'competitors', competitor1);
        const competitorDocSnapshot1 = await getDoc(competitorDocRef1);
        
        const competitorDocRef2 = doc(firestore, 'competitors', competitor2);
        const competitorDocSnapshot2 = await getDoc(competitorDocRef2);
        
        if (competitorDocSnapshot1.exists() && competitorDocSnapshot2.exists()) {
            const competitorData1 = competitorDocSnapshot1.data();
            const votedPool1 = competitorData1.votedPool || {};
            
            const competitorData2 = competitorDocSnapshot2.data();
            const votedPool2 = competitorData2.votedPool || {};
            
            const commonPoolIds = Array.from(
                new Set([...Object.keys(votedPool1), ...Object.keys(votedPool2)])
            );
            
            // Fetch pool title for each pool ID
            const poolTitlePromises = commonPoolIds.map(async (poolId) => {
                const poolDocRef = doc(firestore, 'Pools', poolId); // Assuming voted pools are stored in a collection named 'votedpools'
                const poolDocSnapshot = await getDoc(poolDocRef);
                const poolTitle = poolDocSnapshot.data()?.title || 'Unknown Title'; // Assuming the title is stored as a field named 'title'
                return poolTitle;
            });
            
            const poolTitles = await Promise.all(poolTitlePromises);
            
            const voteCounts1 = commonPoolIds.map(poolId => votedPool1[poolId] || 0);
            const voteCounts2 = commonPoolIds.map(poolId => votedPool2[poolId] || 0);
            
            setState(prevState => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: poolTitles // Use pool titles as x-axis categories
                    }
                },
                series: [
                    {
                        name: "Vote Count - Competitor 1",
                        data: voteCounts1 // Set vote counts for competitor 1 as series data
                    },
                    {
                        name: "Vote Count - Competitor 2",
                        data: voteCounts2 // Set vote counts for competitor 2 as series data
                    }
                ]
            }));
        }
    } catch (error) {
        console.error('Error fetching chart data:', error.message);
    }
};


  useEffect(() => {
    if (value && value1) {
      fetchChart(value.id, value1.id);
    }
  }, [value, value1]);

  return (
    <div>
      <Container style={{ marginTop: '70px' }}>
        <Row>
          <Col xs={6} md={2}>
            xs=6 md=4
          </Col>
          <Col xs={12} md={8} style={{ display: 'flex' }}>
            <Box sx={{ minWidth: 700, paddingTop: '24px', marginLeft: '0px' }}>
              <React.Fragment>
                <Autocomplete
                  value={value1}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setValue1({
                        inputValue: newValue,
                        name: newValue,
                        id: '',
                      });
                    } else if (newValue && newValue.inputValue) {
                      setValue1(newValue);
                    } else {
                      setValue1(newValue);
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
                      value={(value1 && value1.inputValue) || ''}
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
            <Box sx={{ minWidth: 700, paddingTop: '24px', marginLeft: '-150px' }}>
              <React.Fragment>
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setValue({
                        inputValue: newValue,
                        name: newValue,
                        id: '',
                      });
                    } else if (newValue && newValue.inputValue) {
                      setValue(newValue);
                    } else {
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
          </Col>
        </Row>
        <Row>
          <br></br>  <br></br>
          <Col xs={6} md={2}>
            xs=6 md=4
          </Col>
          <Col xs={12} md={8}>
            <div className="mixed-chart">
              <Chart
                options={state.options}
                series={state.series}
                type="bar"
                width="800"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
