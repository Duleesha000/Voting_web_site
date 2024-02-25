import { faEye, faHome, faPlus, faRankingStar, faReceipt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link, useLocation } from 'react-router-dom';
import './Styles.css';




const Sidenav = ({ adminDetails })=> {


  const location = useLocation();
  
  const [shouldRedirect, setShouldRedirect] = useState(true);


 if(location.pathname==="/home" || location.pathname=="/about" || location.pathname=="/shop" || location.pathname=="/login" || location.pathname=="/register" 
 || location.pathname=="/ApprovePage" || location.pathname=="/Prices" || location.pathname=="/Pools"   || location.pathname=="/Checkouts"  || location.pathname=="/Realityshow" || location.pathname=="/Organizations"
 || location.pathname=="/Update" || location.pathname=="/Forgotpassword" || location.pathname=="/Realpools" || location.pathname=="/Results" || location.pathname=="/"){

  return null;
 }

  const handleLinkClick = () => {
    // Stop the redirection by setting shouldRedirect to false
    setShouldRedirect(false);
  };

  
  return (
    <div className="container-fluid">
      
      <div className="row">
        <div className="col-md-2 sidebar" style={{backgroundColor:'#111827'}}>
          
          <br></br>
          <Container >
            <Row>
        
            <Col md={4}><img
              className='cart'
              src="https://i.ibb.co/ZShJMsd/R-2.png"
              alt="Shopping Cart"
            /></Col>
            <Col md={{ span: 7, offset: 0 }}><h5 style={{color:'whitesmoke'}}> {adminDetails?.displayName}</h5></Col>
          </Row></Container><br></br>
          <Link to="AdminHome" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>

          <Link to="/Createpools" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faPlus} /> Create Pool
          </Link>
          <Link to="/AddCompitiors" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faPlus} />Compititors
          </Link>
          <Link to="/Preview" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faEye} /> Preview
          </Link>
          <Link to="/Comparison" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faRankingStar} /> Comparison
          </Link>
          <Link to="/Reports" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faReceipt} /> Reports
          </Link>
          <Link to="/Adminacc" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faUserCircle} />My Account
          </Link>
        </div>
        
        <div className="col-md-9 content">
          {/* The content of the page */}
        </div>
       
      </div>
      
    </div>
  );
}

export default Sidenav;
