import React, { useEffect, useState, useReducer } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {Dialog, DialogContent} from '@mui/material';
import Add from './Add';
import Update from './Update';
import AddLeave from './AddLeave';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);  
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [ignored, forceUpdate] = useReducer(x => x +1, 0 ); 
  const navigate = useNavigate()

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    navigate('/');
    forceUpdate();
  }

  const handleOpenUpdateDialog = (employee_id) => {
    setOpenUpdateDialog(true);
    setSelectedEmployeeId(employee_id);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    navigate('/');
    forceUpdate();
  };

  const handleOpenLeaveDialog = (employee_id) => {
    setOpenLeaveDialog(true);
    setSelectedEmployeeId(employee_id);
  };

  const handleCloseLeaveDialog = () => {
    setOpenLeaveDialog(false);
    navigate('/');
    forceUpdate();
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:8800/employees");
        setEmployees(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEmployees();
  }, [ignored]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        await axios.delete("http://localhost:8800/employees/" + id);
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
        <h1 className="header-left">EMPLOYEES</h1>
        <table>
          <thead>
            <tr>
              <th className='primary-key'>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id}>
                <td className='primary-key'>{employee.employee_id}</td>
                <td>
                  {`${employee.firstname} ${employee.middlename} ${employee.lastname}`}
                </td>
                <td>
                  {`${employee.addressline} ${employee.barangay} ${employee.province} ${employee.country} ${employee.zipcode}`}
                </td>
                <td className="button-container">
                <div className="action-btn" onClick={() => handleDelete(employee.employee_id)}>
                  DELETE
                </div>

                <Link className="action-btn" onClick={() => handleOpenUpdateDialog(employee.employee_id)}>
                  UPDATE
                </Link>

                <Link className="action-btn" onClick={() => handleOpenLeaveDialog(employee.employee_id)}>
                  LEAVE
                </Link>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link  className="add-btn"
          onClick={handleOpenAddDialog}>
            <h1><b>ADD</b></h1>
        </Link>
      </div>

    
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '1000px'}}>
        <Add handleCloseDialog={handleCloseAddDialog}/>
        </DialogContent>
        </Dialog>

        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '1000px' }}>
        {/* <Update handleCloseDialog={handleCloseUpdateDialog}/> */}
        <Update handleCloseDialog={handleCloseUpdateDialog} selectedEmployeeId={selectedEmployeeId}  />
        </DialogContent>
        </Dialog>
∑
        <Dialog open={openLeaveDialog} onClose={handleCloseLeaveDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '500px' }}>
        <AddLeave handleCloseDialog={handleCloseLeaveDialog} selectedEmployeeId={selectedEmployeeId}  />
        </DialogContent>
        </Dialog>

    </div>
  );
};

export default Employees;