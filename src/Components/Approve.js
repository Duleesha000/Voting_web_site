import emailjs from '@emailjs/browser';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { firestore } from '../firebase';

const Approvepage = () => {
  const [adminDetails, setAdminDetails] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');



  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_n961oqo', 'template_wh3rrwl', form.current, 'O7Khpa3LgdWlny8Zd')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  const fetchAdminDetails = async () => {
    try {
      const adminsCollection = collection(firestore, 'Admins');
      const adminsSnapshot = await getDocs(adminsCollection);

      if (!adminsSnapshot.empty) {
        const adminData = [];
        adminsSnapshot.forEach((doc) => {
          adminData.push({ id: doc.id, ...doc.data() });
        });
        setAdminDetails(adminData);
        console.log(adminDetails);
      }
    } catch (error) {
      console.error('Error fetching admin details:', error.message);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const handleEditClick = (adminId, status) => {
    setShowEditModal(true);
    setSelectedAdminId(adminId);
    setSelectedStatus(status);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedAdminId(null);
    setSelectedStatus('');
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      if (selectedAdminId) {
        const adminRef = doc(firestore, 'Admins', selectedAdminId);
        await updateDoc(adminRef, { Approve_status: selectedStatus });
        // Refresh the admin details after the update
        fetchAdminDetails();
      }
    } catch (error) {
      console.error('Error updating admin status:', error.message);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div style={{ marginTop: '80px' }}>
      <div className="d-flex align-items-center">
        <h2 style={{ marginLeft: '30px' }}>Admins Approve Section</h2>
        <div className="ms-auto mr-4" style={{ marginRight: '50px' }}>
          <a href="">
            <i className="fas fa-envelope fa-lg"></i>
            <span className="badge rounded-pill badge-notification bg-danger">999+</span>
          </a>
        </div>
      </div>

      <br></br><br></br>
      <div class="row">
        <div class="col-12" style={{ marginLeft: '30px' }}>
          <MDBTable align='middle' borderColor='black'>
            <MDBTableHead>
              <tr>
                <th scope='col'>Name</th>
                <th scope='col'>NIC</th>
                <th scope='col'>Address</th>
                <th scope='col'>Image</th>
                <th scope='col'>Submit Date</th>
                <th scope='col'>Approve Status</th>
                <th scope='col'>Update</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {adminDetails.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className='d-flex align-items-center'>
                      <div className='ms-3'>
                        <p className='fw-bold mb-1'>{admin.name}</p>
                        <p className='text-muted mb-0'>{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className='fw-normal mb-1'>{admin.nic}</p>
                  </td>
                  <td>
                    <p className='fw-normal mb-1'>{admin.address}</p>
                  </td>
                  <td>
                    <a href={admin.image}>
                      <p>{admin.image}</p>
                    </a>
                  </td>
                  <td>
                  <p className='fw-normal mb-1'>{admin.Submitdate?.toDate()?.toLocaleString()}</p>
                  </td>
                  <td>
                    <p className='fw-normal mb-1'>{admin.Approve_status}</p>
                  </td>
                  <td>
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={() => handleEditClick(admin.id, admin.Approve_status)}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
          <br />
          <br />
        </div>
      </div>
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Admin Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            aria-label="Default select example"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option>Open this select menu</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Not Approved">Not Approved</option>
            <option value="Not Approved">Suspend</option>
          </Form.Select><br></br>

      <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="user_name" /><br></br><br></br>
      <label>Email</label>
      <input type="email" name="user_email" /><br></br><br></br>
      <label>Message</label><br></br>
      <textarea name="message" /><br></br>
      <input type="submit" value="Send email" />
    </form>
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

export default Approvepage;
