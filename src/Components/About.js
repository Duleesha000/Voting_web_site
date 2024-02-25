import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTextArea
} from "mdb-react-ui-kit";
import React from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function About() {
  return (
    <div>
      <br></br><br></br><br></br>

      <Container>
        <Row className="justify-content-md-center">
          <Col sm lg="12">
            <h2 className="sub1">Our Mission</h2>
            <p className="sub2">
              At Voting Lk, we believe in the power of voices coming together to
              shape the future. Our mission is to provide a platform that
              empowers individuals to express their opinions, make their voices
              heard, and participate actively in the decision-making process. We
              strive to foster a democratic environment where every vote counts.
            </p>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="justify-content-md-center">
          <Col sm lg="12">
            <h2 className="sub1">Who We Are</h2>
            <p className="sub2">
              Voting Lk is a dynamic and user-friendly online voting platform
              designed to facilitate various types of voting events, from reality
              shows to organizational decisions. We understand the importance of
              engaging the community and leveraging technology to simplify the
              voting process.
            </p>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="justify-content-md-center">
          <Col sm lg="12">
            <h2 className="sub1">What Sets Us Apart</h2>
            <ul className="sub2">
              <li>
                <strong>User-Friendly Interface:</strong> Our platform is
                designed with simplicity in mind, ensuring that users of all ages
                and technical backgrounds can easily navigate and cast their
                votes.
              </li>
              <li>
                <strong>Secure and Transparent:</strong> We prioritize the
                security and integrity of every vote. Our platform employs robust
                security measures to protect user data and maintain the
                transparency of the voting process.
              </li>
              <li>
                <strong>Diverse Voting Options:</strong> Whether it's a reality
                show competition or an organizational decision, Voting Lk offers
                diverse voting options to cater to the unique needs of each
                event.
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="justify-content-md-center">
          <Col sm lg="12">
            <h2 className="sub1">How It Works</h2>
            <ul className="sub2">
              <li>
                <strong>Create Your Event:</strong> Organizers can easily set up
                their voting events, providing details such as candidates,
                options, and voting duration.
              </li>
              <li>
                <strong>Engage Your Audience:</strong> Participants can access
                the voting platform, view the candidates or options, and cast
                their votes with just a few clicks.
              </li>
              <li>
                <strong>Real-Time Results:</strong> Witness the excitement as
                votes are tallied in real-time, providing instant feedback and
                transparency to both organizers and voters.
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="justify-content-md-center">
          <Col sm lg="12">
            <h2 className="sub1">Get Involved</h2>
            <p className="sub2">
              Voting Lk is not just a platform; it's a community of individuals
              passionate about making their opinions count. Join us in shaping
              the outcome and celebrating the power of collective decision-making.
            </p>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="justify-content-md-center">
          <Col sm lg="12">
            <h2 className="sub1">Contact Us</h2>
            <p className="sub2">
              Have questions, suggestions, or feedback? We'd love to hear from
              you! Contact our support team at{" "}
              <a href="mailto:support@votinglk.com">support@votinglk.com</a> for
              assistance.
            </p>
          </Col>
        </Row>
      </Container>

      <section
        className="vh-100"
        style={{ backgroundColor: "#eee" }}
      >
        <MDBContainer className="py-5" style={{ maxWidth: "1000px" }}>
          <MDBRow className="justify-content-center">
            <MDBCol md="12" lg="10" xl="8">
              <MDBCard>
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
                      <h6 className="fw-bold text-primary mb-1">
                        Lily Coleman
                      </h6>
                      <p className="text-muted small mb-0">
                        Shared publicly - Jan 2020
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 mb-4 pb-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip consequat.
                  </p>

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

                <MDBCardFooter
                  className="py-3 border-0"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
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
                      style={{ backgroundColor: "#fff" }}
                      wrapperClass="w-100"
                    />
                  </div>
                  <div className="float-end mt-2 pt-1">
                    <MDBBtn size="sm" className="me-1">
                      Post comment
                    </MDBBtn>
                    <MDBBtn outline size="sm">
                      Cancel
                    </MDBBtn>
                  </div>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </div>
  );
}
