import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Update from './Update';
import {Dialog, DialogContent} from '@mui/material';
import { useReducer } from 'react';

const Superiors = () => {
  const [superiors, setSuperiors] = useState([]);
  const [empId, setEmpId] = useState('');
  const [superiorEmpId, setSuperiorEmpId] = useState('');
  const [updateStatus, setUpdateStatus] = useState('Active');
  const [ignored, forceUpdate] = useReducer(x => x +1, 0 ); 
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const handleOpenUpdateDialog = (employee_id) => {
    setOpenUpdateDialog(true);
    // navigate(`/update/${employeeId}`);
    // setUpdateNavigation(() => () => navigate(`/update/${employeeId}`));
    setSelectedEmployeeId(employee_id);
  };
  
  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    // navigate('/');
    // forceUpdate();
  };

  const fetchSuperiors = async () => {
    try {
      const res = await axios.get("http://localhost:8800/view-superior");
      setSuperiors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate()

  useEffect(() => {
    fetchSuperiors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(empId, superiorEmpId, updateStatus);
  
    if (empId === '' || superiorEmpId === '' ) {
        alert('Please fill all fields');
        return;
    }
  
    try {
        await axios.post("http://localhost:8800/superior-add", {
          employee_id: empId,
          superior_id: superiorEmpId,
          status: 'Active'
          
        });
        alert('Superior assigned successfully!');
        setEmpId('');
        setSuperiorEmpId('');
        setUpdateStatus('active');
        fetchSuperiors();
      } catch (err) {
        console.log(err);
      }  
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const confirmMessage = "Are you sure you want to update?";
    if (window.confirm(confirmMessage)) {
      try {
        await axios.post("http://localhost:8800/superior-update", {
          employee_id: empId,
          superior_id: superiorEmpId,
          status: updateStatus
        });
        alert('Superior updated successfully!');
        setEmpId('');
        setSuperiorEmpId('');
        setUpdateStatus('Active');
        fetchSuperiors(); // Refresh the data
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDelete = async (signatoryID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8800/superior/${signatoryID}`);
        fetchSuperiors(); // Refresh the list after deleting
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <img src={process.env.PUBLIC_URL + '/LOGO.jpg'} alt="Logo" className='logo'/>
        <div className="botton-nav">
          <Link to="/" className="main-nav">
            EMPLOYEES
          </Link>
          <Link to="/view" className="main-nav">
            VIEW BY DEPARTMENT
          </Link>
          <Link to="/leaves" className="main-nav">
            VIEW BY LEAVES
          </Link>
          <Link to="/superior" className="main-nav">
            VIEW SUPERIOR
          </Link>
        </div>
      </div>
      <div className='main-content'>
        <h1 className="header-left">EMPLOYEES & SUPERIORS</h1>
        <table>
          <thead>
            <tr>
              <th className='primary-key'>EMP ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Superior ID</th>
              <th>Superior Emp ID</th>
              <th>Superior</th>
              <th>Signatory Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {superiors.map((superior) => (
              <tr key={superior.employee_id}>
                <td className='primary-key'>{superior.employee_id}</td>
                <td>
                  {`${superior.firstname} ${superior.lastname}`}
                </td>
                <td>{superior.designation_name}</td>
                <td>{superior.superior_id}</td>
                <td>{superior.superior_emp_id}</td>
                <td>
                  {`${superior.superior_firstname} ${superior.superior_lastname}`}
                </td>
                <td>{superior.signatory_status}</td>
                <td className="button-container">
                  <div className="action-btn" onClick={() => handleDelete(superior.signatories_id)}>
                    DELETE
                  </div>

                  <Link onClick={() => handleOpenUpdateDialog(superior.employee_id)}className="action-btn">UPDATE</Link>

                  {/* <Link to={`/update/${superior.employee_id}`} className="action-btn">
                    UPDATE
                  </Link> */}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '1000px' }}>
        <Update handleCloseDialog={handleCloseUpdateDialog} selectedEmployeeId={selectedEmployeeId}  />
        </DialogContent>
        </Dialog>

        <div className='bottom-nav'> 
          <h3>Add Signatory</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Enter Emp ID:
              <input type="text" value={empId} onChange={(e) => setEmpId(e.target.value)} />
            </label>
            <label>
              Enter Superior ID:
              <input type="text" value={superiorEmpId} onChange={(e) => setSuperiorEmpId(e.target.value)} />
            </label>
            <label>
            Update Status:
            <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
            <div className="bottom-nav">
              <button type="submit">Add Superior</button>
              <button type="button" onClick={handleUpdate}>Update Superior</button>
            </div>
          </form>
        </div>
        <Link to="/" className="add-btn">
                          <h1><b>BACK</b></h1>
        </Link>
      </div>
    </div>
  );
};

export default Superiors;