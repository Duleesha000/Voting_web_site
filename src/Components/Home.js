import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './Styles.css';


import { Ripple, initMDB } from "mdb-ui-kit";

initMDB({ Ripple });

export default function Home() {
  const [content, setContent] = useState('section1'); // Manage content state

  const handleLinkClick = (newContent) => {
    setContent(newContent);
    scrollToSection(newContent);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToSection(content);
  }, [content]);

  return (
    <div style={{ position: 'relative', backgroundColor: '#111827' }}>
      <h1
        id="section1"
        style={{
          position: 'absolute',
          left: 110,
          top: '10%',
          color: 'whitesmoke',
          fontFamily: 'fantasy',
        }}
      >
        Embark on the journey to stardom <br />with passion and perseverance.
      </h1>
      <Button
        variant="primary"
        style={{
          background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
          position: 'absolute',
          left: 110,
          top: '18%',
          transform: 'translateY(-50%)',
          width: '160px',
          height: '50px',
          fontSize: '15px',
        }}
        onClick={() => handleLinkClick('section1')}
      >
        How To Use
      </Button>

      <Button
        variant="primary"
        style={{
          background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
          position: 'absolute',
          left: 310,
          top: '18%',
          transform: 'translateY(-50%)',
          width: '160px',
          height: '50px',
          fontSize: '15px',
        }}
        onClick={() => handleLinkClick('section2')}
      >
        DEMO
      </Button>
      <br />
      <img
        src="https://i.ibb.co/VHgk8HF/Home-2.png"
        className="img-fluid"
        alt="Wild Landscape"
        style={{ width: '100%' }}
      />

      <br></br> <br></br>
      <div style={{ position: 'sticky', left: 100, top: 0, backgroundColor: '#111827', padding: '5px', fontSize: '20px', width: '20%', boxSizing: 'border-box', height: '50%' }}>
        <h5 id='section' style={{ color: 'white' }}>Table of content</h5>

        <a href="#section1" style={{ color: 'white' }} onClick={() => handleLinkClick('section1')}>
          <Button
            variant="primary"
            style={{
              background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
              transform: 'translateY(-50%)',
              fontSize: '15px',
              marginTop: '35px'
            }}
          >
            How to use Admin Account
          </Button>
        </a>
        <br />
        <a href="#section2" style={{ color: 'white' }} onClick={() => handleLinkClick('section2')}>
          <Button
            variant="primary"
            style={{
              background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
              transform: 'translateY(-50%)',
              fontSize: '15px',
              marginTop: '25px',
              width: '260px'
            }}
          >
            How to give a vote
          </Button>
        </a>
      </div>

      <div id="section2" style={{ flex: 1, padding: '1px', fontSize: '20px', boxSizing: 'border-box', marginLeft: '590px', marginTop: '-120px' }}>
        {/* Right side content based on state */}
        {content === 'section1' && <p><img
          src=" https://i.ibb.co/wcXSrBK/Your-paragraph-text.jpg"
          className="img-fluid"
          alt="Wild Landscape"
          style={{ width: '90%' }}
        /></p>}
        {content === 'section2' && <img
          src=" https://i.ibb.co/VQZpSTz/Your-paragraph-text-1.png"
          className="img-fluid"
          alt="Wild Landscape"
          style={{ width: '90%' }}
        />}
      </div><br></br><br></br><br></br><br></br>
      <Container>
      <Row className="justify-content-md-center">
    <Col sm lg="12">
   
    <iframe
  width="1260"
  height="715"
  src="https://www.youtube.com/embed/fpzgQpF7EnQ"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
    </Col>
  </Row>
        <Row className="justify-content-md-center">
          <Col sm lg="12">
            <h2 className="sub1" style={{color:"white"}}>What Sets Us Apart</h2>
            <ul className="sub2">
              <li style={{color:"white"}}>
                <strong>User-Friendly Interface:</strong> Our platform is
                designed with simplicity in mind, ensuring that users of all ages
                and technical backgrounds can easily navigate and cast their
                votes.
              </li>
              <li style={{color:"white"}}>
                <strong>Secure and Transparent:</strong> We prioritize the
                security and integrity of every vote. Our platform employs robust
                security measures to protect user data and maintain the
                transparency of the voting process.
              </li>
              <li style={{color:"white"}}>
                <strong>Diverse Voting Options:</strong> Whether it's a reality
                show competition or an organizational decision, Voting Lk offers
                diverse voting options to cater to the unique needs of each
                event.
              </li>
            </ul>
          </Col>
        </Row>

    
      </Container><br></br>

      <Container>
        <Row className="justify-content-md-center">
          <Col sm lg="12">
            <h2 className="sub1" style={{color:"white"}}>How It Works</h2>
            <ul className="sub2">
              <li style={{color:"white"}}>
                <strong>Create Your Event:</strong> Organizers can easily set up
                their voting events, providing details such as candidates,
                options, and voting duration.
              </li>
              <li style={{color:"white"}}>
                <strong>Engage Your Audience:</strong> Participants can access
                the voting platform, view the candidates or options, and cast
                their votes with just a few clicks.
              </li>
              <li style={{color:"white"}}>
                <strong>Real-Time Results:</strong> Witness the excitement as
                votes are tallied in real-time, providing instant feedback and
                transparency to both organizers and voters.
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

    </div>
  );
}
